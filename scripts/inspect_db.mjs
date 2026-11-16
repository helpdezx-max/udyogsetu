import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!url || !key) {
  console.error('Missing URL or service key');
  process.exit(1);
}

const supabase = createClient(url, key);

async function inspect() {
  console.log('Connecting to:', url);

  const { data: companies, error: compErr } = await supabase
    .from('companies')
    .select('id, name, verification_status');
  console.log('Companies in DB:', companies?.length ?? 0, compErr?.message || '');
  if (companies?.length) console.log(companies);

  const { data: jobs, error: jobErr } = await supabase
    .from('jobs')
    .select('id, title, company_id');
  console.log('Jobs in DB:', jobs?.length ?? 0, jobErr?.message || '');
  if (jobs?.length) console.log(jobs);

  const { data: clusters, error: clustErr } = await supabase
    .from('industrial_clusters')
    .select('id, name');
  console.log('Clusters in DB:', clusters?.length ?? 0, clustErr?.message || '');

  const { data: settings, error: setErr } = await supabase
    .from('platform_settings')
    .select('*');
  console.log('Settings in DB:', settings?.length ?? 0, setErr?.message || '');
  if (settings?.length) console.log(settings);

  // Check if pilot tables from 07, 08, 09 exist
  const { data: sources, error: srcErr } = await supabase
    .from('job_sources')
    .select('id, name');
  console.log('Job sources in DB:', sources?.length ?? 0, srcErr?.message || '');

  const { data: prospects, error: prospErr } = await supabase
    .from('employer_prospects')
    .select('id, company_name');
  console.log('Employer prospects in DB:', prospects?.length ?? 0, prospErr?.message || '');

  const { data: pilotLocations, error: locErr } = await supabase
    .from('industrial_pilot_locations')
    .select('id, name');
  console.log('Pilot locations in DB:', pilotLocations?.length ?? 0, locErr?.message || '');
}

inspect().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
