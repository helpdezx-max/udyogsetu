import assert from 'assert';

console.log('--- UDYOGSETU PHASE 6: PLUGGABLE AI CLIENT TEST SUITE ---');

async function runTests() {
  try {
    const { aiClient } = await import('../../src/services/ai/aiClient');

    // Test 1: Fallback Resilience when Offline
    console.log('Test 1: Offline Fallback & Zero-Crash Guarantee');
    const result = await aiClient.generateCompletion({
      featureName: 'job_description_assistant',
      systemPrompt: 'You are an industrial recruitment AI.',
      userPrompt: 'Draft JD for CNC Operator',
      fallbackGenerator: () => ({
        title: 'CNC Turning Operator',
        summary: 'Operate Fanuc-controlled turning centers in Chakan Phase 2.'
      })
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.status, 'fallback_rule_based');
    assert.strictEqual(result.data.title, 'CNC Turning Operator');
    assert.ok(result.tokensUsed.promptTokens > 0);
    console.log('  ✔ Offline fallback executed cleanly with token logging (PASS)');

    // Test 2: AI Feature Governance Toggles
    console.log('Test 2: AI Feature Governance Toggles');
    assert.strictEqual(aiClient.isFeatureEnabled('job_description_assistant'), true);
    aiClient.setFeatureEnabled('job_description_assistant', false);
    assert.strictEqual(aiClient.isFeatureEnabled('job_description_assistant'), false);
    aiClient.setFeatureEnabled('job_description_assistant', true); // Reset
    console.log('  ✔ Admin feature kill-switch verified (PASS)');

    console.log('======================================================');
    console.log('ALL PHASE 6 AI CLIENT TEST ASSERTIONS PASSED!');
    console.log('======================================================');
  } catch (err: any) {
    console.log('[EXPECTED RED] AI Client not yet implemented:', err.message);
    process.exit(1);
  }
}

runTests();
