import { getSupabaseClient } from '../lib/supabase/client';
import { JobVacancy, Company, ModerationReport, SAMPLE_JOBS, SAMPLE_COMPANIES, INITIAL_REPORTS } from '../data/demo-data';

export type VerificationStage =
  | 'unverified'
  | 'verification_submitted'
  | 'under_review'
  | 'additional_info_required'
  | 'verified'
  | 'rejected'
  | 'suspended'
  | 'expired';

export type ModerationStatus =
  | 'draft'
  | 'pending_review'
  | 'under_review'
  | 'additional_info_required'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'suspended'
  | 'expired'
  | 'filled';

export type FreshnessStatus =
  | 'newly_published'
  | 'active'
  | 'reconfirmation_required'
  | 'temporarily_unavailable'
  | 'expired'
  | 'filled';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type VerificationMethod =
  | 'official_email_domain'
  | 'gstin_registry_check'
  | 'udyam_msme_check'
  | 'midc_plot_allotment_check'
  | 'factory_license_dish_check'
  | 'representative_authorization_letter'
  | 'physical_plant_audit'
  | 'manual_desk_audit';

export interface UpdateVerificationStageOptions {
  companyId: string;
  stage: VerificationStage;
  notes?: string;
  rejectionReason?: string;
  reviewerId?: string;
  method?: VerificationMethod;
  documentsReviewed?: string[];
  decision?: string;
}

export interface CompanyVerificationDetails {
  legalName: string;
  tradeName?: string;
  businessType: string;
  companyWebsite?: string;
  registeredOfficeAddress: string;
  factoryAddress: string;
  clusterId: string;
  authorizedRepName: string;
  authorizedRepDesignation: string;
  authorizedRepEmail: string;
  authorizedRepPhone: string;
  gstin?: string;
  udyamRegistrationNo?: string;
  factoryLicenseNo?: string;
}

export interface CandidateReportSubmission {
  jobId?: string;
  companyId?: string;
  agencyId?: string;
  reporterId?: string;
  reporterEmail?: string;
  reportCategory:
    | 'Fake Salary'
    | 'Demanded Money / Registration Fee'
    | 'Ghost Vacancy'
    | 'Unsafe Working Conditions'
    | 'Incorrect Location'
    | 'Impersonation'
    | 'Suspicious External Link'
    | 'Misleading Employment Terms';
  description: string;
  evidenceFiles?: string[];
  reporterContactAllowed: boolean;
}

export interface DuplicateJobMatch {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  matchedJobId: string;
  matchedJobTitle: string;
  matchedCompanyName: string;
  similarityScore: number;
  matchType: string;
  status: 'pending' | 'confirmed_duplicate' | 'dismissed_distinct_plant';
  createdAt: string;
}

export const trustService = {
  // -------------------------------------------------------------------
  // 1. AUTOMATED RULE-BASED PRE-MODERATION & RISK EVALUATION
  // -------------------------------------------------------------------
  evaluateJobRisk(
    job:
      | Partial<JobVacancy>
      | {
          title?: string;
          description?: string;
          category?: any;
          salaryInHandMonthly?: number;
          salary?: any;
          responsibilities?: string[];
        }
  ): {
    riskScore: number;
    riskLevel: RiskLevel;
    flags: string[];
    suggestedStatus: ModerationStatus;
    recommendation: string;
  } {
    let score = 0;
    const flags: string[] = [];
    const text = `${job.title || ''} ${job.description || ''}`.toLowerCase();

    // 1. Check for illegal fee demands (Critical Violation)
    const feeKeywords = ['fee', 'charge', 'deposit', 'pay rs', 'pay ₹', 'registration amount', 'interview money'];
    for (const kw of feeKeywords) {
      if (text.includes(kw)) {
        score += 65;
        flags.push(`ILLEGAL_FEE_KEYWORD: "${kw}"`);
        break;
      }
    }

    // 2. Unrealistic salary for industrial helper/unskilled categories
    const inHand = (job as any).salaryInHandMonthly || job.salary?.inHandMonthly || 0;
    if ((job.category === 'Assembly & Line' || text.includes('helper') || text.includes('cleaner')) && inHand > 40000) {
      score += 35;
      flags.push('ANOMALOUS_HIGH_SALARY_FOR_UNSKILLED');
    }

    // 3. Suspicious external link or contact hiding
    if (text.includes('bit.ly') || text.includes('t.me/') || text.includes('wa.me/')) {
      score += 25;
      flags.push('SUSPICIOUS_EXTERNAL_LINK_OR_CHANNEL');
    }

    // 4. Missing breakdown or zero gross salary
    if (job.salary && (!job.salary.grossMonthly || job.salary.grossMonthly < inHand)) {
      score += 20;
      flags.push('INVALID_SALARY_BREAKDOWN');
    }

    // 5. Incomplete job responsibilities
    if (job.responsibilities && job.responsibilities.length < 2) {
      score += 15;
      flags.push('INSUFFICIENT_JOB_RESPONSIBILITIES');
    }

    score = Math.min(100, score);
    let riskLevel: RiskLevel = 'low';
    if (score >= 60) riskLevel = 'critical';
    else if (score >= 35) riskLevel = 'high';
    else if (score >= 15) riskLevel = 'medium';

    let suggestedStatus: ModerationStatus = 'approved';
    if (riskLevel === 'critical') suggestedStatus = 'suspended';
    else if (riskLevel === 'high') suggestedStatus = 'pending_review';

    let recommendation = 'Listing complies with standard industrial posting rules.';
    if (riskLevel === 'critical') {
      recommendation = 'Quarantine vacancy immediately. Request plant management verification before unblocking.';
    } else if (riskLevel === 'high') {
      recommendation = 'Flagged for priority manual desk audit. Check statutory license details.';
    } else if (riskLevel === 'medium') {
      recommendation = 'Minor compliance warning. Allow publication with automated monitoring.';
    }

    return { riskScore: score, riskLevel, flags, suggestedStatus, recommendation };
  },

  // -------------------------------------------------------------------
  // 2. DUPLICATE VACANCY DETECTION ENGINE
  // -------------------------------------------------------------------
  detectDuplicateVacancies(
    newJob:
      | Partial<JobVacancy>
      | {
          id?: string;
          title?: string;
          companyName?: string;
          cluster?: string;
          clusterName?: string;
        },
    existingJobs: JobVacancy[]
  ): { isDuplicate: boolean; matchedJob?: JobVacancy; similarity: number; reason?: string } {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    const newTitleNorm = normalize(newJob.title || '');
    const newComp = newJob.companyName?.toLowerCase() || '';
    const newLoc = ((newJob as any).cluster || (newJob as any).clusterName || '').toLowerCase();

    for (const exist of existingJobs) {
      if (newJob.id && exist.id === newJob.id) continue;

      const existTitleNorm = normalize(exist.title);
      const existComp = exist.companyName.toLowerCase();
      const existLoc = exist.clusterName.toLowerCase();

      // Check 1: Exact title + same company + same cluster
      if (existTitleNorm === newTitleNorm && existComp === newComp && existLoc === newLoc) {
        return {
          isDuplicate: true,
          matchedJob: exist,
          similarity: 1.0,
          reason: 'Identical job title, company and industrial cluster',
        };
      }

      // Check 2: High title token overlap + same company
      const newTokensList = newTitleNorm.split(/\s+/);
      const newTokens = new Set(newTokensList);
      const existTokens = new Set(existTitleNorm.split(/\s+/));
      const intersection = newTokensList.filter((x) => existTokens.has(x));
      const tokenSimilarity = (2 * intersection.length) / (newTokens.size + existTokens.size);

      if (tokenSimilarity > 0.8 && existComp === newComp) {
        return {
          isDuplicate: true,
          matchedJob: exist,
          similarity: Number(tokenSimilarity.toFixed(2)),
          reason: 'Over 80% keyword overlap for same plant unit',
        };
      }
    }

    return { isDuplicate: false, similarity: 0 };
  },

  // -------------------------------------------------------------------
  // 3. VACANCY FRESHNESS ENGINE & RECONFIRMATION
  // -------------------------------------------------------------------
  calculateFreshness(job: {
    lastConfirmedDate: string;
    postedDaysAgo?: number;
    status: string;
  }): { freshnessStatus: FreshnessStatus; daysSinceConfirmation: number; daysUntilDue: number } {
    let daysSince = job.postedDaysAgo || 0;
    try {
      if (job.lastConfirmedDate && job.lastConfirmedDate.includes('-')) {
        const d = new Date(job.lastConfirmedDate);
        if (!isNaN(d.getTime())) {
          daysSince = Math.max(0, Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)));
        }
      }
    } catch {}

    const daysUntilDue = Math.max(0, 14 - daysSince);

    if (job.status === 'closed' || job.status === 'expired') {
      return { freshnessStatus: 'expired', daysSinceConfirmation: daysSince, daysUntilDue: 0 };
    }

    if (daysSince <= 2) {
      return { freshnessStatus: 'newly_published', daysSinceConfirmation: daysSince, daysUntilDue };
    } else if (daysSince <= 14) {
      return { freshnessStatus: 'active', daysSinceConfirmation: daysSince, daysUntilDue };
    } else if (daysSince <= 30) {
      return { freshnessStatus: 'reconfirmation_required', daysSinceConfirmation: daysSince, daysUntilDue: 0 };
    } else {
      return { freshnessStatus: 'temporarily_unavailable', daysSinceConfirmation: daysSince, daysUntilDue: 0 };
    }
  },

  async reconfirmJob(jobId: string, companyId?: string): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    const todayStr = new Date().toISOString().split('T')[0];

    if (!client) {
      return {
        success: true,
        message: 'Vacancy reconfirmed! Verified badge and 14-day freshness window extended.',
      };
    }

    try {
      const { error } = await (client as any)
        .from('jobs')
        .update({
          last_confirmed_date: todayStr,
          last_reconfirmed_at: new Date().toISOString(),
          next_reconfirmation_due: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          freshness_status: 'active',
          vacancy_verification_status: 'employer_confirmed',
          trust_badge_employer_confirmed: true,
        })
        .eq('id', jobId);

      if (error) throw error;
      return { success: true, message: 'Vacancy successfully reconfirmed in live database!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to reconfirm vacancy.' };
    }
  },

  // -------------------------------------------------------------------
  // 4. CANDIDATE COMPLAINT & FRAUD CASE REPORTING
  // -------------------------------------------------------------------
  async submitReport(
    params: CandidateReportSubmission
  ): Promise<{ success: boolean; ticketNo: string; message: string }> {
    const ticketNo = `CASE-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const client = getSupabaseClient();

    if (!client) {
      return {
        success: true,
        ticketNo,
        message: 'Report submitted successfully. Case assigned to Trust & Safety investigation desk.',
      };
    }

    try {
      const { error } = await (client as any).from('candidate_reports').insert({
        report_ticket_no: ticketNo,
        reporter_id: params.reporterId || null,
        job_id: params.jobId || null,
        company_id: params.companyId || null,
        agency_id: params.agencyId || null,
        report_category: params.reportCategory,
        description: params.description,
        evidence_file_paths: params.evidenceFiles || [],
        reporter_contact_allowed: params.reporterContactAllowed,
        investigation_status: 'submitted',
      });

      if (error) throw error;

      return {
        success: true,
        ticketNo,
        message: 'Case officially lodged. Our moderation auditors will investigate.',
      };
    } catch (err: any) {
      return {
        success: false,
        ticketNo,
        message: err.message || 'Failed to lodge complaint.',
      };
    }
  },

  // -------------------------------------------------------------------
  // 5. EMPLOYER VERIFICATION LIFECYCLE
  // -------------------------------------------------------------------
  async updateEmployerVerificationStage(
    paramOrCompanyId: string | UpdateVerificationStageOptions,
    stageArg?: VerificationStage,
    notesArg?: string,
    rejectionReasonArg?: string,
    reviewerIdArg?: string
  ): Promise<{ success: boolean; error: Error | null }> {
    let companyId: string;
    let stage: VerificationStage;
    let notes: string | undefined;
    let rejectionReason: string | undefined;
    let reviewerId: string | undefined;
    let method: VerificationMethod = 'manual_desk_audit';
    let documentsReviewed: string[] = [];

    if (typeof paramOrCompanyId === 'object') {
      companyId = paramOrCompanyId.companyId;
      stage = paramOrCompanyId.stage;
      notes = paramOrCompanyId.notes;
      rejectionReason = paramOrCompanyId.rejectionReason;
      reviewerId = paramOrCompanyId.reviewerId;
      if (paramOrCompanyId.method) method = paramOrCompanyId.method;
      if (paramOrCompanyId.documentsReviewed) documentsReviewed = paramOrCompanyId.documentsReviewed;
    } else {
      companyId = paramOrCompanyId;
      stage = stageArg || 'unverified';
      notes = notesArg;
      rejectionReason = rejectionReasonArg;
      reviewerId = reviewerIdArg;
    }

    const client = getSupabaseClient();
    if (!client) return { success: true, error: null };

    try {
      const isVerified = stage === 'verified';
      await (client as any)
        .from('companies')
        .update({
          verification_stage: stage,
          verification_status: isVerified ? 'verified' : stage === 'rejected' ? 'rejected' : 'pending',
          trust_badge_company_verified: isVerified,
          trust_badge_rep_verified: isVerified,
          verification_audit_date: isVerified ? new Date().toISOString() : null,
          rejection_reason: rejectionReason || null,
        })
        .eq('id', companyId);

      // Audit entry
      await (client as any).from('company_verification_audits').insert({
        company_id: companyId,
        reviewer_id: reviewerId || null,
        verification_method: method,
        documents_reviewed: documentsReviewed,
        decision: stage,
        rejection_reason: rejectionReason || null,
        internal_notes: notes || `Verification status transitioned to ${stage}`,
      });

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  },

  // -------------------------------------------------------------------
  // 6. TRUST & SAFETY PLATFORM METRICS
  // -------------------------------------------------------------------
  async getTrustMetrics(): Promise<{
    totalCompanies: number;
    verifiedCompanies: number;
    pendingVerifications: number;
    activeVerifiedVacancies: number;
    pendingModerationJobs: number;
    reconfirmationDueJobs: number;
    openComplaints: number;
    highRiskEntitiesCount: number;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return {
        totalCompanies: SAMPLE_COMPANIES.length,
        verifiedCompanies: SAMPLE_COMPANIES.filter((c) => c.verificationStatus === 'verified').length,
        pendingVerifications: 1,
        activeVerifiedVacancies: SAMPLE_JOBS.filter((j) => j.status === 'active').length,
        pendingModerationJobs: 0,
        reconfirmationDueJobs: 1,
        openComplaints: INITIAL_REPORTS.filter((r) => r.status === 'pending').length,
        highRiskEntitiesCount: 0,
      };
    }

    try {
      const [
        { count: totalComps },
        { count: verifiedComps },
        { count: pendingComps },
        { count: activeJobs },
        { count: pendingJobs },
        { count: openReports },
      ] = await Promise.all([
        client.from('companies').select('*', { count: 'exact', head: true }),
        client.from('companies').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
        client.from('companies').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
        client.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        client.from('jobs').select('*', { count: 'exact', head: true }).eq('moderation_status', 'pending_review'),
        (client as any).from('candidate_reports').select('*', { count: 'exact', head: true }).neq('investigation_status', 'resolved'),
      ]);

      return {
        totalCompanies: totalComps || 0,
        verifiedCompanies: verifiedComps || 0,
        pendingVerifications: pendingComps || 0,
        activeVerifiedVacancies: activeJobs || 0,
        pendingModerationJobs: pendingJobs || 0,
        reconfirmationDueJobs: 0,
        openComplaints: openReports || 0,
        highRiskEntitiesCount: 0,
      };
    } catch {
      return {
        totalCompanies: SAMPLE_COMPANIES.length,
        verifiedCompanies: 2,
        pendingVerifications: 1,
        activeVerifiedVacancies: SAMPLE_JOBS.length,
        pendingModerationJobs: 0,
        reconfirmationDueJobs: 1,
        openComplaints: 2,
        highRiskEntitiesCount: 0,
      };
    }
  },
};
