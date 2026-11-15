import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminSupabaseClient } from '../../../../lib/supabase/server';
import { CareerPageConnector } from '../../../../services/discovery/CareerPageConnector';
import { StructuredFeedConnector } from '../../../../services/discovery/StructuredFeedConnector';
import { normalizeDiscoveredJob } from '../../../../services/discovery/normalizer';
import { IngestionPipeline } from '../../../../services/discovery/ingestionPipeline';
import { DiscoverySource } from '../../../../services/discovery/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // 1. Security Authorization Gate
  const authHeader = req.headers.authorization;
  const adminSecret = process.env.ADMIN_PROVISION_SECRET || 'udyogsetu_super_secret_admin_2026_chakan';
  const cronSecret = process.env.CRON_SECRET || 'study-trust-secret-2026';

  let isAuthorized = false;
  if (authHeader && (authHeader === `Bearer ${cronSecret}` || authHeader === `Bearer ${adminSecret}`)) {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return res.status(401).json({
      error: 'Unauthorized. Admin authorization or CRON_SECRET token required.'
    });
  }

  const supabase = getAdminSupabaseClient();
  const pipeline = new IngestionPipeline();
  const results: any[] = [];

  try {
    // 2. Fetch approved sources
    let sources: DiscoverySource[] = [];

    if (supabase) {
      const { data, error } = await supabase
        .from('discovery_sources')
        .select('*')
        .eq('is_enabled', true)
        .eq('permission_status', 'approved');

      if (!error && data && data.length > 0) {
        sources = data as any;
      }
    }

    // Fallback seed sources if DB table not yet populated or offline
    if (sources.length === 0) {
      sources = [
        {
          id: 'src-mahindra-demo',
          name: 'Mahindra & Mahindra Chakan Plant Direct Careers',
          website_url: 'https://jobs.mahindra.com/search/?q=chakan',
          category: 'career_page',
          source_owner: 'Mahindra & Mahindra Ltd.',
          access_method: 'http_get',
          permission_status: 'approved',
          crawl_frequency_minutes: 720,
          last_successful_crawl: null,
          last_attempted_crawl: null,
          reliability_score: 98,
          is_enabled: true,
          rate_limit_per_minute: 6
        },
        {
          id: 'src-bajaj-demo',
          name: 'Bajaj Auto Chakan Production Openings',
          website_url: 'https://www.bajajauto.com/careers/openings',
          category: 'career_page',
          source_owner: 'Bajaj Auto Ltd.',
          access_method: 'http_get',
          permission_status: 'approved',
          crawl_frequency_minutes: 720,
          last_successful_crawl: null,
          last_attempted_crawl: null,
          reliability_score: 96,
          is_enabled: true,
          rate_limit_per_minute: 6
        }
      ];
    }

    // 3. Execute Discovery Runs in Isolated Boundary
    for (const source of sources) {
      let connector = source.access_method === 'rss_feed'
        ? new StructuredFeedConnector()
        : new CareerPageConnector();

      const crawlResult = await connector.collectVacancies(source);

      if (crawlResult.success && crawlResult.vacanciesFound.length > 0) {
        const normalized = crawlResult.vacanciesFound.map(v => normalizeDiscoveredJob(v));
        const runSummary = await pipeline.processDiscoveryRun(source, normalized);
        results.push(runSummary);
      } else {
        results.push({
          sourceId: source.id,
          sourceName: source.name,
          status: crawlResult.success ? 'completed' : 'failed',
          vacanciesDiscovered: 0,
          vacanciesIngested: 0,
          duplicatesDetected: 0,
          error: crawlResult.error
        });
      }
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      sourcesProcessed: sources.length,
      runs: results
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal Discovery Engine Error'
    });
  }
}
