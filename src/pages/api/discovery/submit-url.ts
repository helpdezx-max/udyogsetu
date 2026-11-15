import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminSupabaseClient } from '../../../lib/supabase/server';
import { ManualSubmissionConnector } from '../../../services/discovery/ManualSubmissionConnector';
import { normalizeDiscoveredJob } from '../../../services/discovery/normalizer';
import { IngestionPipeline } from '../../../services/discovery/ingestionPipeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const { url, companyName, notes } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({ error: 'A valid http/https vacancy URL is required.' });
  }

  try {
    const connector = new ManualSubmissionConnector();
    const mockSource = {
      id: `manual-${Date.now()}`,
      name: companyName ? `${companyName} Career Submission` : 'Direct Vacancy Submission',
      website_url: url,
      category: 'manual_submission' as const,
      source_owner: companyName || null,
      access_method: 'manual_url' as const,
      permission_status: 'review_required' as const,
      crawl_frequency_minutes: 0,
      last_successful_crawl: null,
      last_attempted_crawl: null,
      reliability_score: 85,
      is_enabled: true,
      rate_limit_per_minute: 10,
      admin_notes: notes || 'Submitted for administrator verification'
    };

    const crawlResult = await connector.collectVacancies(mockSource);
    let ingestedSummary: any = null;

    if (crawlResult.success && crawlResult.vacanciesFound.length > 0) {
      const normalized = crawlResult.vacanciesFound.map(v => normalizeDiscoveredJob(v));
      const pipeline = new IngestionPipeline();
      ingestedSummary = await pipeline.processDiscoveryRun(mockSource, normalized);
    }

    const supabase = getAdminSupabaseClient();
    if (supabase) {
      // Record source for admin audit
      await supabase.from('discovery_sources').insert({
        name: mockSource.name,
        website_url: url,
        category: 'manual_submission',
        source_owner: companyName || null,
        access_method: 'manual_url',
        permission_status: 'review_required',
        admin_notes: notes || 'Candidate / Employer manual link submission'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vacancy link submitted successfully and routed to admin moderation desk.',
      extractedVacancy: crawlResult.vacanciesFound[0] || null,
      ingested: ingestedSummary?.vacanciesIngested || 0
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error processing submitted vacancy URL'
    });
  }
}
