import assert from 'assert';

console.log('--- UDYOGSETU PHASE 6: WHATSAPP CONSENT & OUTBOX TEST SUITE ---');

async function runTests() {
  try {
    const { whatsappClient } = await import('../../src/services/whatsapp/whatsappClient');
    const { consentManager } = await import('../../src/services/whatsapp/consentManager');
    const { renderTemplate } = await import('../../src/services/whatsapp/templates');

    // Test 1: Multilingual Templates
    console.log('Test 1: Multilingual Template Catalog');
    const enText = renderTemplate('interview_scheduled', 'en', {
      candidateName: 'Rahul',
      companyName: 'Sahyadri Precision Ltd.',
      dateTime: '18 Nov 10:30 AM',
      location: 'Chakan MIDC Phase 2'
    });
    assert.ok(enText.includes('Interview Scheduled: Sahyadri Precision Ltd.'));

    const mrText = renderTemplate('interview_scheduled', 'mr', {
      candidateName: 'राहुल',
      companyName: 'सह्याद्री प्रिसिजन',
      dateTime: '१८ नोव्हेंबर स. १०:३०',
      location: 'चाकण एमआयडीसी फेज २'
    });
    assert.ok(mrText.includes('मुलाखत निश्चित'));

    console.log('  ✔ English and Marathi templates rendered (PASS)');

    // Test 2: Consent Enforcement & STOP Opt-Out
    console.log('Test 2: Consent Gate & STOP Opt-Out');
    const testPhone = '+919876543210';
    consentManager.recordOptIn(testPhone, 'candidate-1');
    assert.strictEqual(consentManager.hasConsent(testPhone), true);

    consentManager.processInboundMessage(testPhone, 'STOP');
    assert.strictEqual(consentManager.hasConsent(testPhone), false, 'STOP command must opt-out candidate');
    console.log('  ✔ STOP command opt-out enforced (PASS)');

    // Test 3: Idempotency & Message Dispatch
    console.log('Test 3: Idempotency & Safe Dispatch');
    const res1 = await whatsappClient.sendTemplateMessage({
      recipientPhone: '+919876543211',
      templateName: 'interview_scheduled',
      lang: 'en',
      parameters: { candidateName: 'Amit', companyName: 'Tata Motors', dateTime: '19 Nov', location: 'Chakan' },
      idempotencyKey: 'test-key-event-101'
    });
    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.isDuplicate, false);

    const res2 = await whatsappClient.sendTemplateMessage({
      recipientPhone: '+919876543211',
      templateName: 'interview_scheduled',
      lang: 'en',
      parameters: { candidateName: 'Amit', companyName: 'Tata Motors', dateTime: '19 Nov', location: 'Chakan' },
      idempotencyKey: 'test-key-event-101'
    });
    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.isDuplicate, true, 'Second call with identical idempotencyKey must be duplicate');
    console.log('  ✔ Duplicate dispatch prevented via idempotency (PASS)');

    console.log('======================================================');
    console.log('ALL PHASE 6 WHATSAPP TEST ASSERTIONS PASSED!');
    console.log('======================================================');
  } catch (err: any) {
    console.log('[EXPECTED RED] WhatsApp service not yet implemented:', err.message);
    process.exit(1);
  }
}

runTests();
