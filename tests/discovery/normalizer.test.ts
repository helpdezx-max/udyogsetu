import assert from 'assert';

console.log('--- UDYOGSETU PHASE 5: NORMALIZER & GEOGRAPHY TEST SUITE ---');

async function runTests() {
  try {
    const { normalizeDiscoveredJob } = await import('../../src/services/discovery/normalizer');
    
    // Test 1: Standard English Trade Matching
    console.log('Test 1: Standard English Trade Matching');
    const job1 = normalizeDiscoveredJob({
      sourceId: 'src-1',
      sourceName: 'Direct Portal',
      title: 'Urgent: VMC Machine Operator (Fanuc Controls)',
      companyName: 'Sahyadri Precision Ltd.',
      rawLocation: 'Chakan MIDC Phase 2, Pune',
      rawSalary: 'Rs. 19,000 - 25,000 / month',
      description: 'Day/night rotational shift, free bus facility provided from Bhosari, subsidized canteen.',
      originalUrl: 'https://example.com/job/1'
    });

    assert.strictEqual(job1.standardTrade, 'VMC Machine Operator');
    assert.strictEqual(job1.industryCategory, 'Machine Operations & CNC');
    assert.strictEqual(job1.cluster, 'Chakan MIDC Phase 2');
    assert.strictEqual(job1.monthlySalaryMin, 19000);
    assert.strictEqual(job1.monthlySalaryMax, 25000);
    assert.strictEqual(job1.facilities.busProvided, true);
    assert.strictEqual(job1.facilities.canteenProvided, true);
    assert.strictEqual(job1.shiftType, 'rotational');
    console.log('  ✔ English trade, location & perks parsed (PASS)');

    // Test 2: Marathi Vernacular Normalization
    console.log('Test 2: Vernacular Marathi Trade Matching');
    const job2 = normalizeDiscoveredJob({
      sourceId: 'src-2',
      sourceName: 'MIDC Portal',
      title: 'एमआयजी वेल्डर आणि फिटर आवश्यक',
      companyName: 'Chakan Auto Components',
      rawLocation: 'कुरुळी इंडस्ट्रियल एरिया, चाकण',
      description: '८ तास ड्युटी, पीएफ आणि ईएसआय सुविधा',
      originalUrl: 'https://example.com/job/2'
    });

    assert.strictEqual(job2.standardTrade, 'MIG / CO2 Welder');
    assert.strictEqual(job2.cluster, 'Kuruli & Industrial Belt');
    assert.strictEqual(job2.facilities.pfEsiIncluded, true);
    console.log('  ✔ Marathi vernacular trade and cluster resolved (PASS)');

    // Test 3: Khed City Geocoding
    console.log('Test 3: Khed City Geocoding');
    const job3 = normalizeDiscoveredJob({
      sourceId: 'src-3',
      sourceName: 'SEZ Portal',
      title: 'Quality Inspector (Vernier, Micrometer)',
      companyName: 'Global Powertrain SEZ',
      rawLocation: 'Khed City Industrial Park, Pune',
      rawSalary: '2.4 LPA - 3.0 LPA',
      description: 'Diploma Mechanical required',
      originalUrl: 'https://example.com/job/3'
    });

    assert.strictEqual(job3.standardTrade, 'Quality Inspector');
    assert.strictEqual(job3.cluster, 'Khed City & SEZ');
    assert.strictEqual(job3.educationMin, 'diploma');
    assert.strictEqual(job3.monthlySalaryMin, 20000); // 2.4L / 12
    console.log('  ✔ Khed City SEZ cluster and LPA salary parsed (PASS)');

    console.log('========================================================');
    console.log('ALL PHASE 5 NORMALIZER & GEOGRAPHY TEST ASSERTIONS PASSED!');
    console.log('========================================================');
  } catch (err: any) {
    console.log('[EXPECTED RED] Normalizer not yet implemented:', err.message);
    process.exit(1);
  }
}

runTests();
