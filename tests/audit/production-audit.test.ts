// ============================================================================
// UDYOGSETU PLATFORM — REGRESSION TEST SUITE: PRODUCTION DATA AUDIT
// Validates zero fake/seed data, zero silent mock fallbacks, and 12 pilot hubs
// ============================================================================

import path from 'path';
import { runProductionAudit } from '../../scripts/production_data_audit';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✔ ${message} (PASS)`);
}

console.log('\n--- UDYOGSETU REGRESSION SUITE: PRODUCTION DATA AUDIT ---');

const projectRoot = path.resolve(__dirname, '../..');
const auditResult = runProductionAudit(projectRoot);

console.log('\nAudit Results:');
console.log(`- Critical Findings: ${auditResult.summary.criticalCount}`);
console.log(`- Warning Findings: ${auditResult.summary.warningCount}`);
console.log(`- Info Findings: ${auditResult.summary.infoCount}`);
console.log(`- Reference Locations: ${auditResult.summary.referenceLocationsCount}`);

assert(auditResult.summary.criticalCount === 0, 'Zero critical data audit findings (no fake data or mock fallbacks)');
assert(auditResult.summary.warningCount === 0, 'Zero warning audit findings');
assert(auditResult.summary.referenceLocationsCount === 12, 'Category B reference data: Exactly 12 Chakan–Khed pilot locations active');
assert(auditResult.passed === true, 'Automated Production Data Audit PASSED');

console.log('\n======================================================');
console.log('ALL PRODUCTION DATA AUDIT CHECKS PASSED!');
console.log('======================================================\n');
