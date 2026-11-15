import fs from 'fs';
import path from 'path';

console.log('--- UDYOGSETU PHASE 6: WHATSAPP & AI SCHEMA TEST ---');

const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/08_whatsapp_and_ai_intelligence.sql');

if (!fs.existsSync(migrationPath)) {
  console.error('[FAIL] Migration file 08_whatsapp_and_ai_intelligence.sql does not exist yet!');
  process.exit(1);
}

const sql = fs.readFileSync(migrationPath, 'utf8');

const requiredKeywords = [
  'CREATE TABLE IF NOT EXISTS whatsapp_consent_records',
  'CREATE TABLE IF NOT EXISTS whatsapp_message_logs',
  'CREATE TABLE IF NOT EXISTS job_alert_preferences',
  'CREATE TABLE IF NOT EXISTS ai_usage_logs',
  'CREATE TABLE IF NOT EXISTS ai_feature_settings',
  'consent_status',
  'idempotency_key',
  'alert_frequency',
  'estimated_cost_usd',
  'ALTER TABLE whatsapp_consent_records ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY'
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

console.log('ALL PHASE 6 SCHEMA DEFINITION CHECKS PASSED!');
process.exit(0);
