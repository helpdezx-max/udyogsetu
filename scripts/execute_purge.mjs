import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!url || !serviceKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false }
});

const DEMO_COMPANIES = [
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
];

const DEMO_RECRUITER = '00000000-0000-0000-0000-000000000001';

async function purge() {
  console.log('--- STARTING CATEGORY A PURGE ON LIVE SUPABASE ---');

  // 1. Delete applications for demo jobs
  const { data: demoJobs, error: dJobErr } = await supabase
    .from('jobs')
    .select('id')
    .in('company_id', DEMO_COMPANIES);

  if (dJobErr) console.warn('Fetch demo jobs error:', dJobErr.message);

  const demoJobIds = demoJobs?.map(j => j.id) || [];
  console.log(`Found ${demoJobIds.length} demo jobs in DB:`, demoJobIds);

  if (demoJobIds.length > 0) {
    const { error: appErr } = await supabase
      .from('applications')
      .delete()
      .in('job_id', demoJobIds);
    if (appErr) console.warn('Applications delete note:', appErr.message);
    else console.log('✓ Purged applications for demo jobs');
  }

  // 2. Delete demo jobs
  const { error: jobErr } = await supabase
    .from('jobs')
    .delete()
    .in('company_id', DEMO_COMPANIES);
  if (jobErr) console.warn('Jobs delete note:', jobErr.message);
  else console.log('✓ Purged demo jobs');

  // 3. Delete demo company members
  const { error: cmErr1 } = await supabase
    .from('company_members')
    .delete()
    .in('company_id', DEMO_COMPANIES);
  if (cmErr1) console.warn('Company members delete note 1:', cmErr1.message);

  const { error: cmErr2 } = await supabase
    .from('company_members')
    .delete()
    .eq('user_id', DEMO_RECRUITER);
  if (cmErr2) console.warn('Company members delete note 2:', cmErr2.message);
  console.log('✓ Purged demo company members');

  // 4. Delete demo company verifications
  const { error: verErr } = await supabase
    .from('company_verifications')
    .delete()
    .in('company_id', DEMO_COMPANIES);
  if (verErr) console.warn('Company verifications delete note:', verErr.message);
  else console.log('✓ Purged demo company verifications');

  // 5. Delete demo companies
  const { error: compErr } = await supabase
    .from('companies')
    .delete()
    .in('id', DEMO_COMPANIES);
  if (compErr) console.warn('Companies delete note:', compErr.message);
  else console.log('✓ Purged demo companies');

  // Also delete any demo email companies
  const { error: compDemoErr } = await supabase
    .from('companies')
    .delete()
    .like('contact_email', '%.demo');
  if (compDemoErr) console.warn('Demo email companies delete note:', compDemoErr.message);

  // 6. Delete demo user roles & profile
  const { error: roleErr } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', DEMO_RECRUITER);
  if (roleErr) console.warn('User roles delete note:', roleErr.message);
  else console.log('✓ Purged demo user role');

  const { error: profErr } = await supabase
    .from('profiles')
    .delete()
    .eq('id', DEMO_RECRUITER);
  if (profErr) console.warn('Profiles delete note:', profErr.message);
  else console.log('✓ Purged demo profile');

  // 7. Upsert platform settings
  const { error: setErr } = await supabase
    .from('platform_settings')
    .upsert([
      {
        key: 'production_mode_active',
        value: { active: true },
        description: 'Flag indicating platform is running in clean production mode with zero demo business data'
      },
      {
        key: 'demo_data_purged_at',
        value: { purged_at: new Date().toISOString() },
        description: 'Timestamp of Category A demo data purge'
      }
    ], { onConflict: 'key' });

  if (setErr) console.warn('Platform settings upsert note:', setErr.message);
  else console.log('✓ Production mode flags recorded in platform_settings');

  // 8. Verification query
  const { data: remainingCompanies } = await supabase.from('companies').select('id, name');
  const { data: remainingJobs } = await supabase.from('jobs').select('id, title');
  const { data: clusters } = await supabase.from('industrial_clusters').select('id, name');
  const { data: settings } = await supabase.from('platform_settings').select('*');

  console.log('\n--- VERIFICATION POST-PURGE ---');
  console.log(`Remaining Companies in DB: ${remainingCompanies?.length || 0}`);
  console.log(`Remaining Jobs in DB: ${remainingJobs?.length || 0}`);
  console.log(`Preserved Industrial Clusters: ${clusters?.length || 0}`);
  console.log(`Platform Settings: ${settings?.length || 0}`);

  if ((remainingCompanies?.length || 0) === 0 && (remainingJobs?.length || 0) === 0) {
    console.log('\n>>> SUCCESS: ALL CATEGORY A FAKE DATA PURGED FROM LIVE DATABASE <<<');
  } else {
    console.warn('\n>>> WARNING: Some records remain <<<', { remainingCompanies, remainingJobs });
  }
}

purge().catch(err => {
  console.error('Purge error:', err);
  process.exit(1);
});
