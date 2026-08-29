import app from '../apps/api/src/index';
import { signHmac, verifyHmac } from '../apps/api/src/services/crypto';
import { DEFAULT_JWT_SECRET, DEFAULT_HMAC_SECRET } from '../apps/api/src/config';

console.log('🧪 Starting End-to-End System Tests with Bun & Hono...');

const env = {
  TURSO_URL: process.env.TURSO_URL || 'file:local.db',
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN || '',
  JWT_SECRET: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  HMAC_SECRET: process.env.HMAC_SECRET || DEFAULT_HMAC_SECRET,
};

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Root Health Check
  const rootRes = await app.request('/', {}, env);
  assert(rootRes.status === 200, 'GET / returns 200 OK');

  // 2. Submit Rescue Application (Priority Critical)
  const submitRes = await app.request(
    '/api/applications',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicant_name: 'Dr. Aarav Sharma',
        applicant_phone: '9841998877',
        applicant_email: 'aarav.sharma@patanhospital.gov.np',
        org_name: 'Patan Hospital Emergency Medical Corps',
        org_type: 'Medical Team',
        vehicle_number: 'BA 3 CHA 1199',
        vehicle_type: 'Ambulance',
        vehicle_owner: 'Patan Hospital',
        driver_name: 'Santosh Maharjan',
        driver_phone: '9851122334',
        passenger_count: 5,
        vehicle_capacity: 'ICU Ambulance',
        emergency_contact: '9801122334',
        departure_location: 'Lalitpur (Patan)',
        destination: 'Sindhupalchok (Chautara Health Center)',
        departure_time: new Date().toISOString(),
        return_time: new Date(Date.now() + 86400000).toISOString(),
        proposed_route: 'Araniko Highway -> Zero Kilo -> Chautara',
        travel_purpose: 'Emergency trauma surgery response and blood supply for flood injured citizens',
        cargo_type: 'Medical',
        cargo_details: 'Portable ventilator, blood packs, trauma surgery equipment',
      }),
    },
    env
  );

  assert(submitRes.status === 201, 'POST /api/applications creates new record (201)');
  const submitData = (await submitRes.json()) as any;
  assert(submitData.id.startsWith('EP-'), 'Application ID formatted with EP- prefix');

  const appId = submitData.id;
  const secretToken = submitData.secret_token;
  assert(Boolean(secretToken), 'Secret token is issued alongside tracking code');

  // 3. Track Application by public tracking code (no secret token required)
  const trackRes = await app.request(`/api/applications/${appId}/track`, {}, env);
  assert(trackRes.status === 200, 'GET /api/applications/:id/track by tracking code returns details');
  const trackData = (await trackRes.json()) as any;
  assert(trackData.application.id === appId, 'Tracked application ID matches');
  assert(!trackData.application.secret_token, 'Track response does not leak secret token');

  const trackWithTokenRes = await app.request(
    `/api/applications/${appId}/track?token=${secretToken}`,
    {},
    env
  );
  assert(trackWithTokenRes.status === 200, 'Track still accepts optional secret token');

  // 4. Staff Login
  const adminPassword = process.env.ADMIN_PASSWORD || 'N30c#M4st3r$9xK7#vQ2@2026!zL';
  const loginRes = await app.request(
    '/api/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: adminPassword }),
    },
    env
  );
  assert(loginRes.status === 200, 'POST /api/auth/login returns 200');
  const loginData = (await loginRes.json()) as any;
  const adminToken = loginData.token;
  assert(Boolean(adminToken), 'JWT token issued for admin session');

  // 5. Admin Issue Pass
  const issueRes = await app.request(
    '/api/admin/passes/issue',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        application_id: appId,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 86400000).toISOString(),
        approved_route: 'Araniko Highway -> Zero Kilo -> Chautara (Priority Corridor)',
      }),
    },
    env
  );
  assert(issueRes.status === 201, 'POST /api/admin/passes/issue generates e-pass');
  const issueData = (await issueRes.json()) as any;
  const passId = issueData.id;
  assert(passId.startsWith('NP-PASS-'), 'Pass ID correctly formatted as NP-PASS-');

  const issuedTrackRes = await app.request(`/api/applications/${appId}/track`, {}, env);
  const issuedTrack = (await issuedTrackRes.json()) as any;
  assert(issuedTrack.application?.status === 'issued', 'Tracking code shows issued after pass creation');
  assert(issuedTrack.application?.pass_id === passId, 'Tracking payload includes issued pass id');

  const publicByPassRes = await app.request(`/api/passes/${passId}/public`, {}, env);
  assert(publicByPassRes.status === 200, 'GET /api/passes/:passId/public returns active pass');
  const publicByAppRes = await app.request(`/api/passes/${appId}/public`, {}, env);
  assert(publicByAppRes.status === 200, 'GET /api/passes/:applicationId/public also returns the QR pass');
  const publicPass = (await publicByAppRes.json()) as any;
  assert(Boolean(publicPass.pass?.qr_token), 'Public pass includes QR token');
  assert(Boolean(publicPass.pass?.vehicle_number), 'Public pass includes vehicle details from application');

  // 6. Checkpoint Scan Verification (Online)
  const qrPayload = JSON.stringify({ pass_id: passId, vehicle: 'BA 3 CHA 1199' });
  const signature = await signHmac(qrPayload, env.HMAC_SECRET);

  const scanRes = await app.request(
    '/api/verify/scan',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_payload: qrPayload, signature }),
    },
    env
  );
  assert(scanRes.status === 200, 'POST /api/verify/scan returns 200');
  const scanData = (await scanRes.json()) as any;
  assert(scanData.valid === true, 'Scan status verified as valid');

  // 7. Checkpoint Scan Logging
  const recordRes = await app.request(
    '/api/verify/record',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pass_id: passId,
        checkpoint_id: 'CP-DOLALGHAT-01',
        scanned_by: 'Inspector B. Thapa',
        scan_location: 'Dolalghat Transit Post',
        scan_notes: 'Emergency ambulance cleared with priority siren',
      }),
    },
    env
  );
  assert(recordRes.status === 201, 'POST /api/verify/record logs transit record (201)');

  // 8. Cryptographic HMAC Verification Test
  const cryptoVerify = await verifyHmac(qrPayload, signature, env.HMAC_SECRET);
  assert(cryptoVerify === true, 'Offline HMAC-SHA256 signature validates correctly');

  // 9. Tampered Signature Test
  const tamperedSig = signature.slice(0, 8) + (signature[8] === 'A' ? 'B' : 'A') + signature.slice(9);
  const tamperedVerify = await verifyHmac(qrPayload, tamperedSig, env.HMAC_SECRET);
  assert(tamperedVerify === false, 'Tampered signature is rejected');

  // 10. Pass Revocation Test
  const revokeRes = await app.request(
    `/api/admin/passes/${passId}/revoke`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        revocation_reason: 'Route closed due to major river overflow at Dolalghat bridge',
      }),
    },
    env
  );
  assert(revokeRes.status === 200, 'POST /api/admin/passes/:id/revoke succeeds');

  // 11. Public Stats & Coordination
  const statsRes = await app.request('/api/public/stats', {}, env);
  assert(statsRes.status === 200, 'GET /api/public/stats returns public statistics');

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});

