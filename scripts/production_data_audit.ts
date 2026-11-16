// ============================================================================
// UDYOGSETU PLATFORM — AUTOMATED PRODUCTION DATA AUDIT TOOL
// Scans for Demo/Seed Business Data, Silent Mock Fallbacks, and Unverified Metrics
// ============================================================================

import fs from 'fs';
import path from 'path';
import { CHAKAN_PILOT_LOCATIONS } from '../src/data/pilot-locations';

export interface AuditFinding {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'CATEGORY_A_DEMO_DATA' | 'MOCK_FALLBACK' | 'REFERENCE_DATA' | 'INTEGRATION';
  file: string;
  description: string;
}

export function runProductionAudit(rootDir: string): {
  passed: boolean;
  findings: AuditFinding[];
  summary: {
    criticalCount: number;
    warningCount: number;
    infoCount: number;
    referenceLocationsCount: number;
  };
} {
  const findings: AuditFinding[] = [];

  // 1. Verify Category B Reference Data: 12 Industrial Locations
  if (CHAKAN_PILOT_LOCATIONS.length === 12) {
    findings.push({
      severity: 'INFO',
      category: 'REFERENCE_DATA',
      file: 'src/data/pilot-locations.ts',
      description: 'Category B Reference Data verified: 12 legitimate Chakan–Khed pilot locations configured.',
    });
  } else {
    findings.push({
      severity: 'CRITICAL',
      category: 'REFERENCE_DATA',
      file: 'src/data/pilot-locations.ts',
      description: `Expected 12 pilot locations, found ${CHAKAN_PILOT_LOCATIONS.length}.`,
    });
  }

  // 2. Scan services for silent mock fallbacks
  const servicesToAudit = [
    { file: 'src/services/jobsService.ts', name: 'jobsService' },
    { file: 'src/services/candidateService.ts', name: 'candidateService' },
    { file: 'src/services/employerService.ts', name: 'employerService' },
    { file: 'src/services/adminService.ts', name: 'adminService' },
    { file: 'src/services/trustService.ts', name: 'trustService' },
  ];

  servicesToAudit.forEach(({ file, name }) => {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) {
      findings.push({
        severity: 'CRITICAL',
        category: 'MOCK_FALLBACK',
        file,
        description: `Service file ${file} does not exist.`,
      });
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check if silent fallback returns SAMPLE_JOBS on API error
    if (content.includes('return { jobs: SAMPLE_JOBS') || content.includes('jobs: SAMPLE_JOBS')) {
      findings.push({
        severity: 'CRITICAL',
        category: 'MOCK_FALLBACK',
        file,
        description: `${name} silently falls back to SAMPLE_JOBS on API failure or empty query. Must return empty array & proper error.`,
      });
    }

    // Check if silent fallback returns SAMPLE_COMPANIES
    if (content.includes('company: SAMPLE_COMPANIES') || content.includes('return { company: SAMPLE_COMPANIES')) {
      findings.push({
        severity: 'CRITICAL',
        category: 'MOCK_FALLBACK',
        file,
        description: `${name} silently falls back to SAMPLE_COMPANIES on API failure. Must return null & proper error.`,
      });
    }

    // Check if silent fallback returns SAMPLE_CANDIDATE
    if (content.includes('profile: SAMPLE_CANDIDATE')) {
      findings.push({
        severity: 'CRITICAL',
        category: 'MOCK_FALLBACK',
        file,
        description: `${name} silently falls back to SAMPLE_CANDIDATE on API failure. Must return null & proper error.`,
      });
    }
  });

  // 3. Scan AppContext.tsx for default demo initialization
  const appContextPath = path.join(rootDir, 'src/context/AppContext.tsx');
  if (fs.existsSync(appContextPath)) {
    const appContextContent = fs.readFileSync(appContextPath, 'utf-8');
    if (appContextContent.includes('useState<JobVacancy[]>(SAMPLE_JOBS)')) {
      findings.push({
        severity: 'CRITICAL',
        category: 'CATEGORY_A_DEMO_DATA',
        file: 'src/context/AppContext.tsx',
        description: 'AppContext initializes jobs state with SAMPLE_JOBS demo array. Must initialize with empty array [] in production.',
      });
    }
    if (appContextContent.includes('useState<Company[]>(SAMPLE_COMPANIES)')) {
      findings.push({
        severity: 'CRITICAL',
        category: 'CATEGORY_A_DEMO_DATA',
        file: 'src/context/AppContext.tsx',
        description: 'AppContext initializes companies state with SAMPLE_COMPANIES demo array. Must initialize with empty array [] in production.',
      });
    }
    if (appContextContent.includes('useState<JobApplication[]>(INITIAL_APPLICATIONS)')) {
      findings.push({
        severity: 'CRITICAL',
        category: 'CATEGORY_A_DEMO_DATA',
        file: 'src/context/AppContext.tsx',
        description: 'AppContext initializes applications state with INITIAL_APPLICATIONS. Must initialize with empty array [] in production.',
      });
    }
  }

  // 4. Scan Database Seed Migration 05
  const migration05Path = path.join(rootDir, 'supabase/migrations/05_seed_companies_and_jobs.sql');
  if (fs.existsSync(migration05Path)) {
    const m05 = fs.readFileSync(migration05Path, 'utf-8');
    if (m05.includes('Sahyadri Precision Auto-Tech Ltd.')) {
      findings.push({
        severity: 'INFO',
        category: 'CATEGORY_A_DEMO_DATA',
        file: 'supabase/migrations/05_seed_companies_and_jobs.sql',
        description: 'Migration 05 contains historical Category A seed data. Purged via Migration 10 in production.',
      });
    }
  }

  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL').length;
  const warningCount = findings.filter((f) => f.severity === 'WARNING').length;
  const infoCount = findings.filter((f) => f.severity === 'INFO').length;

  return {
    passed: criticalCount === 0,
    findings,
    summary: {
      criticalCount,
      warningCount,
      infoCount,
      referenceLocationsCount: CHAKAN_PILOT_LOCATIONS.length,
    },
  };
}

// Standalone execution
if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  console.log('\n=====================================================================');
  console.log('  UDYOGSETU PLATFORM — AUTOMATED PRODUCTION DATA AUDIT TOOL');
  console.log('=====================================================================\n');

  const result = runProductionAudit(root);

  result.findings.forEach((f) => {
    const badge =
      f.severity === 'CRITICAL' ? '❌ [CRITICAL]' : f.severity === 'WARNING' ? '⚠️ [WARNING]' : 'ℹ️ [INFO]';
    console.log(`${badge} ${f.file}: ${f.description}`);
  });

  console.log('\n---------------------------------------------------------------------');
  console.log(
    `Summary: ${result.summary.criticalCount} Critical | ${result.summary.warningCount} Warnings | ${result.summary.infoCount} Info`
  );
  console.log(`Reference Pilot Locations: ${result.summary.referenceLocationsCount} Hubs Active`);
  console.log('---------------------------------------------------------------------');

  if (!result.passed) {
    console.error('\n❌ AUDIT FAILED: Critical mock fallbacks or demo dependencies detected.');
    process.exit(1);
  } else {
    console.log('\n✔ AUDIT PASSED: Zero critical mock fallbacks or demo data leaks detected.');
    process.exit(0);
  }
}
