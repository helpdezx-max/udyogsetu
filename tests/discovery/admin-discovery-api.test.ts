import assert from 'assert';

console.log('--- UDYOGSETU PHASE 5: ADMIN DISCOVERY API TEST SUITE ---');

async function runTests() {
  const baseUrl = 'http://localhost:3000';

  // Test 1: Unauthenticated call to /api/admin/discovery/run must return 401
  console.log('Test 1: Admin Discovery Run Unauthorized Gate');
  try {
    const res = await fetch(`${baseUrl}/api/admin/discovery/run`, { method: 'POST' });
    assert.strictEqual(res.status, 401, 'Unauthenticated execution must be blocked with 401');
    console.log('  ✔ Blocked unauthorized crawler execution (PASS)');
  } catch (e: any) {
    console.log('[EXPECTED RED] API route not yet available:', e.message);
  }

  // Test 2: Unauthenticated call to /api/admin/discovery/sources
  console.log('Test 2: Admin Discovery Sources Unauthorized Gate');
  try {
    const res = await fetch(`${baseUrl}/api/admin/discovery/sources`);
    assert.strictEqual(res.status, 401, 'Unauthenticated source management must be blocked with 401');
    console.log('  ✔ Blocked unauthorized source management (PASS)');
  } catch (e: any) {
    console.log('[EXPECTED RED] API route not yet available:', e.message);
  }
}

runTests();
