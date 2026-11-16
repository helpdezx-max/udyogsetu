import type { NextApiRequest, NextApiResponse } from 'next';
import { trustService } from '../../../services/trustService';
import { getAdminSupabaseClient, isServerSupabaseConfigured } from '../../../lib/supabase/server';

interface FreshnessCronResult {
  success: boolean;
  timestamp: string;
  reconfirmationRequiredCount: number;
  temporarilyUnavailableCount: number;
  riskSignalsScanned: number;
  riskSignalsGenerated: number;
  details: {
    reconfirmationJobIds: string[];
    suspendedJobIds: string[];
    riskFindings: Array<{ jobId: string; score: number; level: string; flags: string[] }>;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FreshnessCronResult | { error: string }>
) {
  // Idempotent cron execution endpoint for platform freshness & trust maintenance
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
  }

  // Security check: Verify Bearer authorization secret if provided
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET || 'study-trust-secret-2026';
  
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized cron invocation.' });
  }

  try {
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const reconfirmationJobIds: string[] = [];
    const suspendedJobIds: string[] = [];
    const riskFindings: Array<{ jobId: string; score: number; level: string; flags: string[] }> = [];

    const adminClient = isServerSupabaseConfigured() ? getAdminSupabaseClient() : null;

    if (adminClient) {
      // 1. Mark jobs older than 14 days without confirmation as 'reconfirmation_required'
      const { data: needReconfirmation, error: err1 } = await adminClient
        .from('jobs')
        .select('id, title, last_reconfirmed_at')
        .eq('status', 'active')
        .eq('freshness_status', 'active')
        .lte('last_reconfirmed_at', fourteenDaysAgo);

      if (needReconfirmation && needReconfirmation.length > 0) {
        for (const j of needReconfirmation) {
          reconfirmationJobIds.push(j.id);
          await adminClient
            .from('jobs')
            .update({
              freshness_status: 'reconfirmation_required',
              updated_at: now.toISOString(),
            })
            .eq('id', j.id);
        }
      }

      // 2. Mark jobs older than 30 days without confirmation as 'temporarily_unavailable'
      const { data: needSuspension, error: err2 } = await adminClient
        .from('jobs')
        .select('id, title, last_reconfirmed_at')
        .eq('status', 'active')
        .lte('last_reconfirmed_at', thirtyDaysAgo);

      if (needSuspension && needSuspension.length > 0) {
        for (const j of needSuspension) {
          suspendedJobIds.push(j.id);
          await adminClient
            .from('jobs')
            .update({
              freshness_status: 'temporarily_unavailable',
              status: 'under_moderation',
              updated_at: now.toISOString(),
            })
            .eq('id', j.id);
        }
      }

      // 3. Scan active jobs for pre-moderation risk flags
      const { data: activeJobs } = await adminClient
        .from('jobs')
        .select('id, title, description, category, salary_in_hand_monthly')
        .eq('status', 'active');

      if (activeJobs) {
        for (const job of activeJobs) {
          const evalResult = trustService.evaluateJobRisk({
            title: job.title,
            description: job.description,
            category: job.category,
            salaryInHandMonthly: job.salary_in_hand_monthly,
          });

          if (evalResult.riskScore > 0) {
            riskFindings.push({
              jobId: job.id,
              score: evalResult.riskScore,
              level: evalResult.riskLevel,
              flags: evalResult.flags,
            });

            // Log risk signal into risk_signals table
            for (const flag of evalResult.flags) {
              await adminClient.from('risk_signals').insert({
                entity_type: 'job',
                entity_id: job.id,
                signal_code: flag,
                severity: evalResult.riskLevel,
                signal_details: {
                  score: evalResult.riskScore,
                  recommendation: evalResult.recommendation,
                },
              });
            }

            if (evalResult.riskLevel === 'critical') {
              await adminClient
                .from('jobs')
                .update({
                  moderation_status: 'suspended',
                  status: 'under_moderation',
                  risk_score: evalResult.riskScore,
                  risk_level: evalResult.riskLevel,
                  risk_flags: evalResult.flags,
                })
                .eq('id', job.id);
            }
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      timestamp: now.toISOString(),
      reconfirmationRequiredCount: reconfirmationJobIds.length,
      temporarilyUnavailableCount: suspendedJobIds.length,
      riskSignalsScanned: reconfirmationJobIds.length + suspendedJobIds.length + riskFindings.length,
      riskSignalsGenerated: riskFindings.length,
      details: {
        reconfirmationJobIds,
        suspendedJobIds,
        riskFindings,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Freshness cron evaluation failed.' });
  }
}
