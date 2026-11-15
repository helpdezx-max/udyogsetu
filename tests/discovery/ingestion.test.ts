import assert from 'assert';

console.log('--- UDYOGSETU PHASE 5: INGESTION PIPELINE & TRUST TEST ---');

async function runTests() {
  try {
    const { IngestionPipeline } = await import('../../src/services/discovery/ingestionPipeline');

    const pipeline = new IngestionPipeline();

    // Test 1: Clean Job Ingestion Pre-Moderation Gating
    console.log('Test 1: Clean Discovered Job Gating');
    const cleanJob = {
      sourceId: 'src-test',
      sourceName: 'Bharat Forge Direct',
      title: 'CNC Turning Operator (Fanuc)',
      standardTrade: 'CNC Machine Operator',
      companyName: 'Bharat Forge Ltd.',
      industryCategory: 'Machine Operations & CNC',
      cluster: 'Chakan MIDC Phase 1',
      city: 'Pune',
      state: 'Maharashtra',
      monthlySalaryMin: 22000,
      monthlySalaryMax: 26000,
      inHandMonthlyEstimate: 22000,
      shiftType: 'rotational' as const,
      experienceYearsMin: 1,
      educationMin: 'iti' as const,
      facilities: { busProvided: true, canteenProvided: true, overtimeOffered: true, pfEsiIncluded: true },
      openingsCount: 8,
      originalSourceUrl: 'https://example.com/job/cnc',
      discoveredAt: new Date().toISOString(),
      description: 'Manufacture precision automotive steering knuckles on CNC horizontal turning center.'
    };

    const evaluatedClean = pipeline.evaluateCandidateForIngestion(cleanJob, []);
    assert.strictEqual(evaluatedClean.moderation_status, 'pending_review', 'Aggregated jobs must NEVER be pre-approved');
    assert.strictEqual(evaluatedClean.risk_level, 'low');
    assert.strictEqual(evaluatedClean.is_external_aggregation, true);
    assert.strictEqual(evaluatedClean.is_duplicate, false);
    console.log('  ✔ Clean job gated to pending_review with low risk (PASS)');

    // Test 2: Fee Extortion Scam Detection & Auto-Suspension
    console.log('Test 2: Scam Fee Detection Auto-Suspension');
    const scamJob = {
      ...cleanJob,
      title: 'Urgent Urgent Helper Required (Pay Rs 500 registration fee)',
      description: 'Pay Rs 500 registration fee and gate pass charge before interview.'
    };

    const evaluatedScam = pipeline.evaluateCandidateForIngestion(scamJob, []);
    assert.strictEqual(evaluatedScam.moderation_status, 'suspended', 'Scam jobs must be instantly auto-suspended');
    assert.ok(evaluatedScam.risk_score >= 50, 'Risk score must be high or critical');
    assert.strictEqual(evaluatedScam.risk_level, 'critical');
    console.log('  ✔ Scam job auto-suspended before reaching candidates (PASS)');

    // Test 3: Duplicate Job Detection
    console.log('Test 3: Duplicate Job Detection');
    const existingJobs = [
      {
        id: 'existing-job-1',
        title: 'CNC Turning Operator (Fanuc)',
        company: 'Bharat Forge Ltd.',
        cluster: 'Chakan MIDC Phase 1'
      }
    ];

    const evaluatedDup = pipeline.evaluateCandidateForIngestion(cleanJob, existingJobs);
    assert.strictEqual(evaluatedDup.is_duplicate, true, 'Matching title, company and cluster must be flagged duplicate');
    assert.strictEqual(evaluatedDup.duplicate_group_id, 'existing-job-1');
    console.log('  ✔ Exact duplicate collision prevented (PASS)');

    console.log('===========================================================');
    console.log('ALL PHASE 5 INGESTION & TRUST BRIDGE TEST ASSERTIONS PASSED!');
    console.log('===========================================================');
  } catch (err: any) {
    console.log('[EXPECTED RED] IngestionPipeline not yet implemented:', err.message);
    process.exit(1);
  }
}

runTests();
