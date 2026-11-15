import assert from 'assert';

console.log('--- UDYOGSETU PHASE 5/6: AI RECRUITMENT FEATURE MODULES TEST ---');

async function runTests() {
  try {
    const { jobDescriptionAssistant } = await import('../../src/services/ai/jobDescriptionAssistant');
    const { resumeParser } = await import('../../src/services/ai/resumeParser');
    const { jobMatcher } = await import('../../src/services/ai/jobMatcher');
    const { candidateAssistant } = await import('../../src/services/ai/candidateAssistant');
    const { employerAssistant } = await import('../../src/services/ai/employerAssistant');

    // Test 1: AI Job Description Assistant & Anti-Extortion Safeguard
    console.log('Test 1: AI Job Description Drafting & Safeguards');
    const jdResult = await jobDescriptionAssistant.generateJobDescription({
      trade: 'VMC Machine Operator',
      companyName: 'Sahyadri Precision Ltd.',
      cluster: 'Chakan MIDC Phase 1',
      shiftType: 'rotational',
      monthlySalaryMin: 19000,
      monthlySalaryMax: 24000,
      busRoute: 'Bhosari - Chakan'
    });

    assert.ok(jdResult.data.responsibilities.length >= 3);
    assert.ok(jdResult.data.safetyRequirements.length >= 2);
    assert.strictEqual(jdResult.data.hasProhibitedFeeTerms, false);
    console.log('  ✔ Structured manufacturing JD generated (PASS)');

    // Test 1b: Block fee demands in prompt
    const scamJd = await jobDescriptionAssistant.generateJobDescription({
      trade: 'Helper',
      companyName: 'Fake Unit',
      cluster: 'Chakan',
      customNotes: 'Require Rs 500 security deposit for gate pass'
    });
    assert.strictEqual(scamJd.data.hasProhibitedFeeTerms, true, 'Must flag deposit/fee extortion');
    console.log('  ✔ Fee extortion detected and flagged in JD assistant (PASS)');

    // Test 2: AI Resume Parsing & Candidate Review Gate
    console.log('Test 2: AI Resume Parsing & Mandatory Candidate Review');
    const sampleResume = `
      Name: Santosh Jadhav
      Phone: +91 98220 12345
      Education: ITI Machinist (Government ITI Pune, 2022)
      Experience: 2 Years at Precision Stamping Pvt Ltd, Chakan
      Skills: CNC Turning, Fanuc Controller, Vernier Caliper, Micrometer
    `;

    const parsedResume = await resumeParser.parseResumeText(sampleResume);
    assert.strictEqual(parsedResume.data.name, 'Santosh Jadhav');
    assert.strictEqual(parsedResume.data.educationLevel, 'iti');
    assert.strictEqual(parsedResume.data.is_confirmed, false, 'Parsed data must remain unconfirmed until candidate approves');
    assert.strictEqual(parsedResume.data.requires_candidate_review, true);
    console.log('  ✔ Resume parsed with candidate review confirmation gate (PASS)');

    // Test 3: Explainable Job Matching
    console.log('Test 3: Explainable Job Matching (Advisory Only)');
    const matchResult = await jobMatcher.calculateMatch({
      candidateTrade: 'VMC Machine Operator',
      candidateSkills: ['VMC', 'Fanuc', 'CNC Milling'],
      candidateCluster: 'Chakan MIDC Phase 2',
      candidateSalaryExpectation: 20000,
      candidateEducation: 'iti'
    }, {
      jobTrade: 'VMC Machine Operator',
      requiredSkills: ['VMC', 'Fanuc'],
      cluster: 'Chakan MIDC Phase 2',
      offeredSalaryMin: 22000,
      minEducation: 'iti'
    });

    assert.ok(matchResult.score >= 85, 'Should score high match for matching trade, cluster & salary');
    assert.ok(matchResult.explanation.length > 20, 'Must include plain-text rationale');
    assert.strictEqual(matchResult.isAdvisoryOnly, true, 'Must clearly declare advisory recommendation status');
    console.log('  ✔ Explainable compatibility score with advisory guard (PASS)');

    // Test 4: Candidate Vernacular Chat Assistant
    console.log('Test 4: Candidate Chatbot Interview Guidance');
    const chatAns = await candidateAssistant.askAssistant({
      userMessage: 'What documents should I carry for a Chakan factory walk-in?',
      language: 'en'
    });
    assert.ok(chatAns.answer.includes('Aadhar') || chatAns.answer.includes('documents'));
    console.log('  ✔ Candidate assistant factory interview guidance verified (PASS)');

    // Test 5: Employer Technical Rubric Assistant
    console.log('Test 5: Employer Interview Rubric Assistant');
    const rubric = await employerAssistant.generateInterviewRubric('CNC Turning Operator');
    assert.ok(rubric.data.evaluationCriteria.length >= 3);
    console.log('  ✔ Employer technical rubric generated (PASS)');

    console.log('======================================================');
    console.log('ALL PHASE 6 AI FEATURE MODULE TEST ASSERTIONS PASSED!');
    console.log('======================================================');
  } catch (err: any) {
    console.log('[EXPECTED RED] AI Features not yet implemented:', err.message);
    process.exit(1);
  }
}

runTests();
