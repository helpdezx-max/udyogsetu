import { NormalizedDiscoveredJob, DiscoveryRunSummary, DiscoverySource } from './types';
import { evaluateJobRisk } from '../trustService';
import { getAdminSupabaseClient } from '../../lib/supabase/server';

export interface EvaluatedIngestionCandidate {
  jobData: NormalizedDiscoveredJob;
  moderation_status: 'pending_review' | 'approved' | 'suspended' | 'rejected';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  risk_signals: string[];
  is_duplicate: boolean;
  duplicate_group_id?: string;
  is_external_aggregation: boolean;
  freshness_status: 'newly_published';
}

export class IngestionPipeline {
  /**
   * Pure evaluation step for an individual discovered vacancy against safety rules & existing jobs
   */
  public evaluateCandidateForIngestion(
    candidate: NormalizedDiscoveredJob,
    existingJobs: Array<{ id: string; title: string; company?: string; cluster?: string }>
  ): EvaluatedIngestionCandidate {
    // 1. Run Pre-Moderation Risk Scoring Engine
    const riskAssessment = evaluateJobRisk({
      title: candidate.title,
      description: candidate.description,
      category: candidate.industryCategory,
      salaryInHandMonthly: candidate.inHandMonthlyEstimate
    });

    let moderation_status: 'pending_review' | 'approved' | 'suspended' | 'rejected' = 'pending_review';

    // Auto-suspend fee extortion scams immediately
    if (riskAssessment.riskLevel === 'critical' || riskAssessment.riskScore >= 50) {
      moderation_status = 'suspended';
    } else {
      // Aggregated jobs must ALWAYS be pending_review (Never auto-approved without admin check)
      moderation_status = 'pending_review';
    }

    // 2. Duplicate Detection
    let is_duplicate = false;
    let duplicate_group_id: string | undefined = undefined;

    const candTitleClean = candidate.title.toLowerCase().trim();
    const candCompClean = candidate.companyName.toLowerCase().trim();
    const candClusterClean = candidate.cluster.toLowerCase().trim();

    for (const existing of existingJobs) {
      const exTitle = existing.title.toLowerCase().trim();
      const exComp = (existing.company || '').toLowerCase().trim();
      const exCluster = (existing.cluster || '').toLowerCase().trim();

      // Exact match check
      if (exTitle === candTitleClean && exComp === candCompClean && exCluster === candClusterClean) {
        is_duplicate = true;
        duplicate_group_id = existing.id;
        break;
      }

      // High token similarity check
      const candTokens = new Set(candTitleClean.split(/\s+/));
      const exTokens = new Set(exTitle.split(/\s+/));
      let overlap = 0;
      for (const t of candTokens) {
        if (exTokens.has(t)) overlap++;
      }
      const similarity = overlap / Math.max(candTokens.size, exTokens.size);
      if (similarity >= 0.8 && exComp === candCompClean) {
        is_duplicate = true;
        duplicate_group_id = existing.id;
        break;
      }
    }

    return {
      jobData: candidate,
      moderation_status,
      risk_level: riskAssessment.riskLevel,
      risk_score: riskAssessment.riskScore,
      risk_signals: riskAssessment.flags,
      is_duplicate,
      duplicate_group_id,
      is_external_aggregation: true,
      freshness_status: 'newly_published'
    };
  }

  /**
   * Full database ingestion execution
   */
  public async processDiscoveryRun(
    source: DiscoverySource,
    discoveredJobs: NormalizedDiscoveredJob[]
  ): Promise<DiscoveryRunSummary> {
    const runSummary: DiscoveryRunSummary = {
      runId: `run-${Date.now()}`,
      sourceId: source.id,
      status: 'completed',
      vacanciesDiscovered: discoveredJobs.length,
      vacanciesIngested: 0,
      duplicatesDetected: 0,
      errors: [],
      startedAt: new Date().toISOString()
    };

    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      runSummary.status = 'partial';
      runSummary.errors.push('Supabase client not configured. Executed in dry-run mode.');
      return runSummary;
    }

    try {
      // 1. Fetch active jobs for duplicate comparison
      const { data: existingJobsData } = await supabase
        .from('jobs')
        .select('id, title, location, metadata')
        .eq('status', 'active');

      const existingJobs = (existingJobsData || []).map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.metadata?.companyName,
        cluster: j.metadata?.cluster
      }));

      // 2. Evaluate and ingest
      for (const rawJob of discoveredJobs) {
        const evaluated = this.evaluateCandidateForIngestion(rawJob, existingJobs);

        if (evaluated.is_duplicate) {
          runSummary.duplicatesDetected++;
          continue;
        }

        // Insert into database
        const { error: insertErr } = await supabase.from('jobs').insert({
          title: evaluated.jobData.title,
          category_id: null,
          employment_type: 'full_time',
          experience_level: evaluated.jobData.experienceYearsMin === 0 ? 'entry' : 'mid',
          location: `${evaluated.jobData.cluster}, ${evaluated.jobData.city}`,
          salary_min: evaluated.jobData.monthlySalaryMin || 18000,
          salary_max: evaluated.jobData.monthlySalaryMax || 25000,
          salary_currency: 'INR',
          salary_period: 'monthly',
          status: evaluated.moderation_status === 'suspended' ? 'closed' : 'under_moderation',
          moderation_status: evaluated.moderation_status,
          risk_level: evaluated.risk_level,
          risk_score: evaluated.risk_score,
          freshness_status: evaluated.freshness_status,
          is_duplicate: evaluated.is_duplicate,
          duplicate_group_id: evaluated.duplicate_group_id || null,
          source_type: 'aggregated',
          original_source_url: evaluated.jobData.originalSourceUrl,
          is_external_aggregation: true,
          is_verified: false,
          created_at: new Date().toISOString(),
          metadata: {
            standardTrade: evaluated.jobData.standardTrade,
            companyName: evaluated.jobData.companyName,
            cluster: evaluated.jobData.cluster,
            facilities: evaluated.jobData.facilities,
            shiftType: evaluated.jobData.shiftType,
            sourceName: evaluated.jobData.sourceName,
            description: evaluated.jobData.description
          }
        });

        if (insertErr) {
          runSummary.errors.push(`Insert failed for ${evaluated.jobData.title}: ${insertErr.message}`);
        } else {
          runSummary.vacanciesIngested++;
        }
      }

      // 3. Log discovery run in audit table
      await supabase.from('discovery_runs').insert({
        source_id: source.id,
        status: runSummary.errors.length > 0 ? 'partial' : 'completed',
        vacancies_discovered: runSummary.vacanciesDiscovered,
        vacancies_ingested: runSummary.vacanciesIngested,
        duplicates_detected: runSummary.duplicatesDetected,
        error_log: runSummary.errors,
        started_at: runSummary.startedAt,
        completed_at: new Date().toISOString()
      });

      // 4. Update source timestamp
      await supabase
        .from('discovery_sources')
        .update({
          last_successful_crawl: new Date().toISOString(),
          last_attempted_crawl: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', source.id);

      runSummary.completedAt = new Date().toISOString();
      return runSummary;
    } catch (err: any) {
      runSummary.status = 'failed';
      runSummary.errors.push(err.message || 'Fatal ingestion error');
      return runSummary;
    }
  }
}
