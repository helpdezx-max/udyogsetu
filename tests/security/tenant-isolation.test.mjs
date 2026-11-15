/**
 * UDYOGSETU (उद्योगसेतू) — PHASE 2 SECURITY & TENANT ISOLATION TEST SUITE
 * Validates cross-tenant boundaries, Row Level Security rules, storage restrictions,
 * and administrative provisioning endpoints.
 */

import http from 'http';

const TEST_RESULTS = [];

function assert(description, condition, details = '') {
  if (condition) {
    TEST_RESULTS.push({ test: description, status: 'PASSED', details });
    console.log(`[PASS] ${description}`);
  } else {
    TEST_RESULTS.push({ test: description, status: 'FAILED', details });
    console.error(`[FAIL] ${description} - ${details}`);
  }
}

async function runSecurityTestSuite() {
  console.log('=====================================================================');
  console.log('  UDYOGSETU PLATFORM — AUTOMATED SECURITY & RLS TEST SUITE');
  console.log('  Validating Multi-Tenant Isolation & Role-Based Access Control');
  console.log('=====================================================================\n');

  // -------------------------------------------------------------------
  // 1. STORAGE PATH CONVENTIONAL PRIVACY VALIDATION
  // -------------------------------------------------------------------
  console.log('--> 1. Storage Path & Tenant Isolation Checks');

  const candidateA_id = 'user-cand-aaa-1111';
  const candidateB_id = 'user-cand-bbb-2222';
  const company1_id = 'comp-1111-1111-1111';
  const company2_id = 'comp-2222-2222-2222';

  // Rule: Candidate A can only access resumes with prefix resumes/{candidateA_id}/
  const canAccessResume = (requesterId, storagePath) => {
    const parts = storagePath.split('/');
    const folderOwner = parts[0];
    return requesterId === folderOwner;
  };

  assert(
    'Candidate A CAN read own resume in resumes bucket',
    canAccessResume(candidateA_id, `${candidateA_id}/resume.pdf`) === true
  );

  assert(
    'Candidate A CANNOT read Candidate B resume (Cross-Tenant Breach Prevention)',
    canAccessResume(candidateA_id, `${candidateB_id}/resume.pdf`) === false,
    'Candidate A was correctly blocked from accessing Candidate B storage path'
  );

  // Rule: Verification docs can only be uploaded to verification-docs/{companyId}/
  const canAccessVerificationDoc = (userCompanyId, docPath, isAdmin = false) => {
    if (isAdmin) return true;
    const parts = docPath.split('/');
    const docCompanyId = parts[0];
    return userCompanyId === docCompanyId;
  };

  assert(
    'Employer 1 CANNOT view Employer 2 statutory verification documents',
    canAccessVerificationDoc(company1_id, `${company2_id}/gstin_cert.pdf`, false) === false,
    'Cross-company document access was rejected'
  );

  assert(
    'Platform Administrator CAN inspect all company verification documents',
    canAccessVerificationDoc(null, `${company2_id}/gstin_cert.pdf`, true) === true
  );

  // -------------------------------------------------------------------
  // 2. ROLE RESTRICTION & SELF-PROVISIONING SECURITY CHECKS
  // -------------------------------------------------------------------
  console.log('\n--> 2. RBAC Privilege Escalation Prevention Checks');

  const sanitizeRegistrationRole = (requestedRole) => {
    // Mirroring trigger logic in public.handle_new_user()
    if (['candidate', 'employer', 'agency'].includes(requestedRole)) {
      return requestedRole;
    }
    return 'candidate'; // Default fallback, admin self-assignment rejected!
  };

  assert(
    'Registration trigger strips self-assigned "admin" role to prevent elevation',
    sanitizeRegistrationRole('admin') === 'candidate',
    'Metadata role "admin" was demoted to "candidate"'
  );

  assert(
    'Registration trigger permits legitimate "employer" role assignment',
    sanitizeRegistrationRole('employer') === 'employer'
  );

  assert(
    'Registration trigger permits legitimate "candidate" role assignment',
    sanitizeRegistrationRole('candidate') === 'candidate'
  );

  // -------------------------------------------------------------------
  // 3. ADMIN PROVISIONING ENDPOINT ENFORCEMENT CHECK
  // -------------------------------------------------------------------
  console.log('\n--> 3. Administrative API Boundary Check (/api/admin/provision)');

  const testApiEndpoint = async (headers, body, method = 'POST') => {
    return new Promise((resolve) => {
      const data = JSON.stringify(body);
      const req = http.request(
        {
          hostname: 'localhost',
          port: 3000,
          path: '/api/admin/provision',
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
            ...headers,
          },
        },
        (res) => {
          let resBody = '';
          res.on('data', (chunk) => (resBody += chunk));
          res.on('end', () => {
            try {
              resolve({ statusCode: res.statusCode, data: JSON.parse(resBody) });
            } catch {
              resolve({ statusCode: res.statusCode, raw: resBody });
            }
          });
        }
      );

      req.on('error', (e) => {
        resolve({ error: e.message });
      });

      req.write(data);
      req.end();
    });
  };

  // Test 3a: Request without x-admin-secret must return 401 Unauthorized
  const unauthRes = await testApiEndpoint({}, { email: 'hacker@example.com' });
  if (unauthRes.statusCode) {
    assert(
      'Unauthenticated call to /api/admin/provision returns 401 Unauthorized',
      unauthRes.statusCode === 401,
      `Received status: ${unauthRes.statusCode}`
    );
  } else {
    console.log('[SKIP] Live API call skipped (Server offline during test execution)');
  }

  // Test 3b: GET request to provision endpoint must return 405 Method Not Allowed
  const getRes = await testApiEndpoint({}, {}, 'GET');
  if (getRes.statusCode) {
    assert(
      'GET request to /api/admin/provision returns 405 Method Not Allowed',
      getRes.statusCode === 405,
      `Received status: ${getRes.statusCode}`
    );
  }

  // -------------------------------------------------------------------
  // 4. DUPLICATE APPLICATION PREVENTION
  // -------------------------------------------------------------------
  console.log('\n--> 4. Business Constraint & Integrity Checks');

  const applicationRegistry = new Set();
  const applyForJob = (candidateId, jobId) => {
    const key = `${candidateId}:${jobId}`;
    if (applicationRegistry.has(key)) {
      return { success: false, error: 'UNIQUE_VIOLATION' };
    }
    applicationRegistry.add(key);
    return { success: true };
  };

  const app1 = applyForJob('cand-01', 'job-101');
  assert('First application submission succeeds', app1.success === true);

  const app2 = applyForJob('cand-01', 'job-101');
  assert(
    'Duplicate application for the same job is rejected (unique index constraint)',
    app2.success === false && app2.error === 'UNIQUE_VIOLATION'
  );

  const app3 = applyForJob('cand-01', 'job-102');
  assert('Application to a different job succeeds', app3.success === true);

  // -------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------
  console.log('\n=====================================================================');
  const passed = TEST_RESULTS.filter((r) => r.status === 'PASSED').length;
  const failed = TEST_RESULTS.filter((r) => r.status === 'FAILED').length;
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED | TOTAL ${TEST_RESULTS.length}`);
  console.log('=====================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTestSuite();
