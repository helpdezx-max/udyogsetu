import fs from 'fs';
import path from 'path';

console.log('--- UDYOGSETU PHASE 5: DISCOVERY ENGINE SCHEMA TEST ---');

const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/07_job_discovery_engine.sql');

if (!fs.existsSync(migrationPath)) {
  console.error('[FAIL] Migration file 07_job_discovery_engine.sql does not exist yet!');
  process.exit(1);
}

const sql = fs.readFileSync(migrationPath, 'utf8');

const requiredKeywords = [
  'CREATE TABLE IF NOT EXISTS discovery_sources',
  'CREATE TABLE IF NOT EXISTS discovery_runs',
  'permission_status',
  'reliability_score',
  'rate_limit_per_minute',
  'vacancies_discovered',
  'vacancies_ingested',
  'ALTER TABLE discovery_sources ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE discovery_runs ENABLE ROW LEVEL SECURITY',
  'Mahindra & Mahindra'
];

let failed = false;
for (const kw of requiredKeywords) {
  if (!sql.includes(kw)) {
    console.error(`[FAIL] Missing required definition: ${kw}`);
    failed = true;
  } else {
    console.log(`[PASS] Found schema component: ${kw}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('ALL SCHEMA DEFINITION CHECKS PASSED!');
process.exit(0);
