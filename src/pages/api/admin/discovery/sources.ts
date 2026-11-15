import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminSupabaseClient } from '../../../../lib/supabase/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Authorization check
  const authHeader = req.headers.authorization;
  const adminSecret = process.env.ADMIN_PROVISION_SECRET || 'udyogsetu_super_secret_admin_2026_chakan';

  if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
    return res.status(401).json({ error: 'Unauthorized. Admin authorization required.' });
  }

  const supabase = getAdminSupabaseClient();

  if (req.method === 'GET') {
    if (!supabase) {
      return res.status(200).json({
        sources: [
          {
            id: 'src-1',
            name: 'Mahindra & Mahindra Chakan Plant Direct Careers',
            website_url: 'https://jobs.mahindra.com/search/?q=chakan',
            category: 'career_page',
            source_owner: 'Mahindra & Mahindra Ltd.',
            access_method: 'http_get',
            permission_status: 'approved',
            crawl_frequency_minutes: 720,
            reliability_score: 98,
            is_enabled: true,
            rate_limit_per_minute: 6,
            admin_notes: 'Direct OEM career portal for Chakan automotive manufacturing facility.'
          },
          {
            id: 'src-2',
            name: 'Bajaj Auto Chakan Production Openings',
            website_url: 'https://www.bajajauto.com/careers/openings',
            category: 'career_page',
            source_owner: 'Bajaj Auto Ltd.',
            access_method: 'http_get',
            permission_status: 'approved',
            crawl_frequency_minutes: 720,
            reliability_score: 96,
            is_enabled: true,
            rate_limit_per_minute: 6,
            admin_notes: 'Two-wheeler and commercial vehicle assembly, press shop and weld shop roles.'
          },
          {
            id: 'src-3',
            name: 'General Motors / Talegaon Vendor Park Feeds',
            website_url: 'https://example.com/talegaon-vendors/jobs',
            category: 'job_board',
            source_owner: 'Talegaon Vendor Association',
            access_method: 'http_get',
            permission_status: 'review_required',
            crawl_frequency_minutes: 1440,
            reliability_score: 80,
            is_enabled: false,
            rate_limit_per_minute: 5,
            admin_notes: 'Requires legal terms review before automated crawling can be enabled.'
          }
        ]
      });
    }

    const { data, error } = await supabase
      .from('discovery_sources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ sources: data || [] });
  }

  if (req.method === 'POST') {
    const { name, website_url, category, source_owner, access_method, permission_status, rate_limit_per_minute, admin_notes } = req.body;

    if (!name || !website_url) {
      return res.status(400).json({ error: 'Name and website_url are required.' });
    }

    if (!supabase) {
      return res.status(201).json({
        success: true,
        source: {
          id: `src-${Date.now()}`,
          name,
          website_url,
          category: category || 'career_page',
          source_owner: source_owner || null,
          access_method: access_method || 'http_get',
          permission_status: permission_status || 'review_required',
          reliability_score: 90,
          is_enabled: true,
          rate_limit_per_minute: rate_limit_per_minute || 6,
          admin_notes: admin_notes || null
        }
      });
    }

    const { data, error } = await supabase.from('discovery_sources').insert({
      name,
      website_url,
      category: category || 'career_page',
      source_owner: source_owner || null,
      access_method: access_method || 'http_get',
      permission_status: permission_status || 'review_required',
      reliability_score: 90,
      is_enabled: true,
      rate_limit_per_minute: rate_limit_per_minute || 6,
      admin_notes: admin_notes || null
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true, source: data });
  }

  if (req.method === 'PATCH') {
    const { id, permission_status, is_enabled, admin_notes } = req.body;
    if (!id) return res.status(400).json({ error: 'Source ID is required.' });

    if (!supabase) {
      return res.status(200).json({ success: true, message: 'Source updated in demo mode.' });
    }

    const updates: any = {};
    if (permission_status !== undefined) updates.permission_status = permission_status;
    if (is_enabled !== undefined) updates.is_enabled = is_enabled;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('discovery_sources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, source: data });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
