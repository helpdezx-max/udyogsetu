import assert from 'assert';

console.log('--- UDYOGSETU PHASE 6: JOB ALERT ENGINE TEST SUITE ---');

async function runTests() {
  try {
    const { jobAlertEngine } = await import('../../src/services/alerts/jobAlertEngine');

    // Test 1: Preference Matching
    console.log('Test 1: Manufacturing Job Preference Matching');
    const candidatePrefs = {
      userId: 'cand-user-1',
      candidatePhone: '+919876543210',
      preferredTrades: ['VMC Machine Operator', 'CNC Turning Operator'],
      preferredClusters: ['Chakan MIDC Phase 2'],
      minSalary: 18000,
      alertFrequency: 'immediate' as const,
      preferredLanguage: 'mr' as const
    };

    const eligibleJob = {
      id: 'job-matching-101',
      title: 'VMC Machine Operator (Fanuc / Siemens)',
      company: 'Sahyadri Precision Ltd.',
      trade: 'VMC Machine Operator',
      cluster: 'Chakan MIDC Phase 2',
      monthlySalary: 22000,
      status: 'active',
      moderation_status: 'approved',
      is_verified: true
    };

    const isMatch = jobAlertEngine.matchesPreferences(candidatePrefs, eligibleJob);
    assert.strictEqual(isMatch, true, 'Job should match candidate trade, cluster, and salary');
    console.log('  ✔ Trade, cluster & salary compatibility verified (PASS)');

    // Test 2: Gating Unmoderated / Suspended Vacancies
    console.log('Test 2: Reject Unmoderated or Suspended Vacancies');
    const suspendedJob = { ...eligibleJob, status: 'closed', moderation_status: 'suspended' };
    assert.strictEqual(jobAlertEngine.matchesPreferences(candidatePrefs, suspendedJob), false);

    const pendingReviewJob = { ...eligibleJob, moderation_status: 'pending_review' };
    assert.strictEqual(jobAlertEngine.matchesPreferences(candidatePrefs, pendingReviewJob), false);
    console.log('  ✔ Suspended and pending review jobs blocked from alerts (PASS)');

    // Test 3: Duplicate Alert Suppression
    console.log('Test 3: Duplicate Alert Suppression');
    const dispatch1 = await jobAlertEngine.dispatchAlertIfEligible(candidatePrefs, eligibleJob);
    assert.strictEqual(dispatch1.sent, true);
    assert.strictEqual(dispatch1.isDuplicate, false);

    const dispatch2 = await jobAlertEngine.dispatchAlertIfEligible(candidatePrefs, eligibleJob);
    assert.strictEqual(dispatch2.sent, false, 'Second dispatch must be suppressed as duplicate');
    assert.strictEqual(dispatch2.isDuplicate, true);
    console.log('  ✔ Duplicate alert suppression verified (PASS)');

    console.log('======================================================');
    console.log('ALL PHASE 6 JOB ALERT TEST ASSERTIONS PASSED!');
    console.log('======================================================');
  } catch (err: any) {
    console.log('[EXPECTED RED] Job alert engine not yet implemented:', err.message);
    process.exit(1);
  }
}

runTests();
