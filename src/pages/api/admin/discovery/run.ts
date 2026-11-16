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

    // If no approved sources are found in registry
    if (sources.length === 0) {
      return res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        sourcesProcessed: 0,
        runs: [],
        message: 'No enabled and approved discovery sources registered in database.'
      });
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
