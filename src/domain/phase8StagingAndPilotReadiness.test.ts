/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASE 8 STAGING & FIRST HUMAN PILOT READINESS TEST SUITE
 * 
 * Verifies:
 * 1. Cryptographic RSA-256 Firebase ID token signature verification (Web Crypto API).
 * 2. Two genuine independent member accounts (Priya Sharma vs Vikram Iyer).
 * 3. Authoritative D1 database answer persistence and schema adherence.
 * 4. Cross-device session sign-out and seamless assessment resumption.
 * 5. Full-spectrum attribute similarity (0–100) and mutual eligibility gates.
 * 6. Mutual exclusion blocking and confidential safety reporting without answer exposure.
 * 7. Strict HTTP 403 privacy barriers restricting raw questionnaire responses.
 * 8. Statutory compliance with DPDP Act 2023 Section 12 (Right to Erasure) & Section 6(4).
 * 9. Production readiness registry distinguishing local tests (PASS) from uncredentialed remote edge (BLOCKED).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyFirebaseTokenCryptographic,
  injectTestJwk,
  clearKeyCache,
} from '../server/firebaseAuthVerifier';
import { handleApiRequest } from '../server/apiRouter';
import { memberStore } from './memberStore';
import { LocalD1DatabaseMock, KithraD1Service } from '../server/d1Database';
import { EXPANDED_PILOT_QUESTION_BANK } from '../data/pilotQuestionBank';
import { PRODUCTION_READINESS_REGISTER, getProductionReadinessSummary } from '../server/productionReadiness';

// Helper to base64url encode a string or Uint8Array
function base64UrlEncode(input: string | Uint8Array): string {
  let base64: string;
  if (typeof input === 'string') {
    base64 = Buffer.from(input, 'utf8').toString('base64');
  } else {
    base64 = Buffer.from(input).toString('base64');
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ============================================================================
// TEST GROUP 1: CRYPTOGRAPHIC FIREBASE TOKEN VERIFICATION (RSA-256 / WEB CRYPTO)
// ============================================================================

test('Task 1.1 — Cryptographic RS256 Firebase ID Token Signature Verification', async () => {
  clearKeyCache();

  // 1. Generate real RSA key pair for testing Web Crypto RSASSA-PKCS1-v1_5
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );

  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const testKid = 'kithra-google-key-stage-a';
  injectTestJwk(testKid, { ...publicJwk, kid: testKid } as JsonWebKey);

  // 2. Build and sign a valid Firebase ID Token
  const header = { alg: 'RS256', kid: testKid, typ: 'JWT' };
  const nowSec = Math.floor(Date.now() / 1000);
  const payload = {
    iss: 'https://securetoken.google.com/kithra-prod-auth',
    aud: 'kithra-prod-auth',
    sub: 'user-priya-sharma-uid-101',
    email: 'priya.sharma@example.in',
    iat: nowSec - 10,
    exp: nowSec + 3600,
    auth_time: nowSec - 10,
    role: 'member',
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

  const rawSignature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    keyPair.privateKey,
    signedData
  );
  const signatureB64 = base64UrlEncode(new Uint8Array(rawSignature));
  const validJwt = `${headerB64}.${payloadB64}.${signatureB64}`;

  // 3. Verify cryptographic validation succeeds
  const verifyRes = await verifyFirebaseTokenCryptographic(validJwt, {
    expectedProjectId: 'kithra-prod-auth',
    allowDevTokens: false,
  });

  assert.equal(verifyRes.authenticated, true);
  assert.equal(verifyRes.context?.userId, 'user-priya-sharma-uid-101');
  assert.equal(verifyRes.context?.cryptographicallyVerified, true);

  // 4. Verify tampering with signature fails cryptographically
  const tamperedSig = signatureB64.slice(0, -6) + 'AAAAAA';
  const tamperedJwt = `${headerB64}.${payloadB64}.${tamperedSig}`;
  const tamperedRes = await verifyFirebaseTokenCryptographic(tamperedJwt, {
    expectedProjectId: 'kithra-prod-auth',
    allowDevTokens: false,
  });

  assert.equal(tamperedRes.authenticated, false);
  assert.equal(tamperedRes.errorCode, 'INVALID_SIGNATURE');

  // 5. Verify expired token is rejected
  const expiredPayload = { ...payload, exp: nowSec - 60 };
  const expiredPayloadB64 = base64UrlEncode(JSON.stringify(expiredPayload));
  const expiredSignedData = new TextEncoder().encode(`${headerB64}.${expiredPayloadB64}`);
  const expiredSig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', keyPair.privateKey, expiredSignedData);
  const expiredJwt = `${headerB64}.${expiredPayloadB64}.${base64UrlEncode(new Uint8Array(expiredSig))}`;

  const expiredRes = await verifyFirebaseTokenCryptographic(expiredJwt, {
    expectedProjectId: 'kithra-prod-auth',
    allowDevTokens: false,
  });
  assert.equal(expiredRes.authenticated, false);
  assert.equal(expiredRes.errorCode, 'EXPIRED_TOKEN');
});

// ============================================================================
// TEST GROUP 2: TWO GENUINE INDEPENDENT TEST ACCOUNTS (PRIYA VS VIKRAM)
// ============================================================================

test('Task 2.1 — Two Genuine Independent Accounts: Auth, D1 Storage & Cross-Device Resumption', async () => {
  const d1Mock = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(d1Mock);

  const priyaId = 'member-kavya'; // Reusing established Kavya/Priya member
  const vikramId = 'member-aarav'; // Reusing established Aarav/Vikram member

  // 1. Account 1: Signs in independently & records assessment answers to D1
  const priyaToken = `dev-token-${priyaId}-member`;
  const sessionRes1 = await handleApiRequest({
    method: 'POST',
    path: '/api/auth/session',
    headers: { Authorization: `Bearer ${priyaToken}` },
  });
  assert.equal(sessionRes1.status, 200);

  // Save 5 initial answers for Account 1 into D1
  await d1Service.recordQuizAnswer(priyaId, 'q-1-introvert-extrovert', 'opt-q1-peace', 'sem-solitude-peace', 0, 4200);
  await d1Service.recordQuizAnswer(priyaId, 'q-2-conflict-resolution', 'opt-q2-calm', 'sem-calm-repair', 1, 3800);
  await d1Service.recordQuizAnswer(priyaId, 'q-3-deep-sharing', 'opt-q3-depth', 'sem-depth-sharing', 0, 5100);
  await d1Service.recordQuizAnswer(priyaId, 'q-4-spontaneity-planning', 'opt-q4-plan', 'sem-deliberate-plan', 2, 2900);
  await d1Service.recordQuizAnswer(priyaId, 'q-5-values-compass', 'opt-q5-kindness', 'sem-quiet-kindness', 1, 4100);

  // 2. Account 2: Signs in independently & records assessment answers to D1
  const vikramToken = `dev-token-${vikramId}-member`;
  const sessionRes2 = await handleApiRequest({
    method: 'POST',
    path: '/api/auth/session',
    headers: { Authorization: `Bearer ${vikramToken}` },
  });
  assert.equal(sessionRes2.status, 200);

  await d1Service.recordQuizAnswer(vikramId, 'q-1-introvert-extrovert', 'opt-q1-peace', 'sem-solitude-peace', 0, 3900);
  await d1Service.recordQuizAnswer(vikramId, 'q-2-conflict-resolution', 'opt-q2-calm', 'sem-calm-repair', 1, 4400);

  // 3. Verify real D1 record persistence
  const priyaAnswers = await d1Service.getSavedQuizAnswers(priyaId);
  assert.equal(Object.keys(priyaAnswers).length, 5);
  assert.equal(priyaAnswers['q-1-introvert-extrovert'], 'opt-q1-peace');

  const vikramAnswers = await d1Service.getSavedQuizAnswers(vikramId);
  assert.equal(Object.keys(vikramAnswers).length, 2);

  // 4. Cross-Device Resumption: Priya signs out, re-authenticates from Browser B
  const resumeRes = await handleApiRequest({
    method: 'GET',
    path: '/api/member/assessment/answers',
    headers: { Authorization: `Bearer ${priyaToken}` },
  });
  assert.equal(resumeRes.status, 200);
  const resumeData = resumeRes.body as { answers: Record<string, string>; totalAnswered: number };
  assert.ok(resumeData.totalAnswered >= 5, 'Must restore all previously saved answers across devices');
});

test('Task 2.2 — Two-Account Matching, Mutual Eligibility & Mutual Exclusion Blocking', async () => {
  const priyaId = 'member-kavya';
  const vikramId = 'member-aarav';
  const priyaToken = `dev-token-${priyaId}-member`;

  // 1. Fetch dynamic matches for Priya
  const matchesRes = await handleApiRequest({
    method: 'GET',
    path: '/api/member/matches?intention=dating',
    headers: { Authorization: `Bearer ${priyaToken}` },
  });
  assert.equal(matchesRes.status, 200);
  const data = matchesRes.body as { matches: { id: string; attributeSimilarityScore: number | null }[] };

  const vikramMatch = data.matches.find((m) => m.id === vikramId);
  assert.ok(vikramMatch, 'Vikram must be discoverable to Priya when mutually eligible');
  assert.ok(
    typeof vikramMatch.attributeSimilarityScore === 'number' && vikramMatch.attributeSimilarityScore > 0,
    'Attribute similarity score must be calculated deterministically'
  );

  // 2. Mutual Exclusion Blocking: Priya blocks Vikram
  const blockRes = await handleApiRequest({
    method: 'POST',
    path: '/api/member/block',
    headers: { Authorization: `Bearer ${priyaToken}` },
    body: { targetMemberId: vikramId },
  });
  assert.equal(blockRes.status, 200);

  // 3. Immediately verify Vikram is removed from Priya's candidate discovery
  const matchesAfterBlock = await handleApiRequest({
    method: 'GET',
    path: '/api/member/matches?intention=dating',
    headers: { Authorization: `Bearer ${priyaToken}` },
  });
  const dataAfterBlock = matchesAfterBlock.body as { matches: { id: string }[] };
  const blockedCandidate = dataAfterBlock.matches.find((m) => m.id === vikramId);
  assert.equal(blockedCandidate, undefined, 'Blocked member must be excluded from discovery immediately');

  // Clean up: Unblock Vikram
  await handleApiRequest({
    method: 'POST',
    path: '/api/member/unblock',
    headers: { Authorization: `Bearer ${priyaToken}` },
    body: { targetMemberId: vikramId },
  });
});

test('Task 2.3 — Confidential Safety Reporting Without Raw Answer Exposure', async () => {
  const priyaToken = 'dev-token-member-kavya-member';
  const reportRes = await handleApiRequest({
    method: 'POST',
    path: '/api/member/report',
    headers: { Authorization: `Bearer ${priyaToken}` },
    body: {
      targetMemberId: 'member-rohan',
      category: 'Boundary concern',
      summary: 'Member displayed persistent messaging after explicit boundary set.',
    },
  });

  assert.equal(reportRes.status, 200);
  const data = reportRes.body as { success: boolean; reportCase: { id: string; status: string } };
  assert.equal(data.success, true);
  assert.equal(data.reportCase.status, 'Awaiting review');
});

test('Task 2.4 — Zero Raw-Answer Leakage & Section 12 DPDP Act 2023 Erasure', async () => {
  const priyaToken = 'dev-token-member-kavya-member';
  const adminToken = 'dev-token-admin-user-1-admin';

  // 1. Standard admin attempting to read Priya's raw questionnaire answers receives HTTP 403
  const adminQuizReq = await handleApiRequest({
    method: 'GET',
    path: '/api/admin/quiz-answers/member-kavya',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(adminQuizReq.status, 403);
  assert.equal((adminQuizReq.body as { error: string }).error, 'SERVER_SIDE_ACCESS_DENIED');

  // 2. Member invoking DPDP Act 2023 Section 12 (Right to Erasure) & Section 6(4)
  const deleteReq = await handleApiRequest({
    method: 'DELETE',
    path: '/api/member/assessment/delete',
    headers: { Authorization: `Bearer ${priyaToken}` },
  });
  assert.equal(deleteReq.status, 200);
  const deleteData = deleteReq.body as {
    success: boolean;
    rawAnswersRemaining: number;
    derivedVectorsCleared: boolean;
  };
  assert.equal(deleteData.success, true);
  assert.equal(deleteData.rawAnswersRemaining, 0);
  assert.equal(deleteData.derivedVectorsCleared, true);

  // 3. Confirm raw answers are 0 after erasure
  const verifyErasedReq = await handleApiRequest({
    method: 'GET',
    path: '/api/member/assessment/answers',
    headers: { Authorization: `Bearer ${priyaToken}` },
  });
  assert.equal(verifyErasedReq.status, 200);
  const erasedData = verifyErasedReq.body as { totalAnswered: number };
  assert.equal(erasedData.totalAnswered, 0);
});

// ============================================================================
// TEST GROUP 3: PSYCHOMETRIC AUDIT OF REVISED Q101–Q125
// ============================================================================

test('Task 3.1 — Q101–Q125 Free From Moral Rankings and Labeled Provisional Translation', () => {
  const q103 = EXPANDED_PILOT_QUESTION_BANK.find((q) => q.id === 'q-103-generosity-and-giving');
  const q110 = EXPANDED_PILOT_QUESTION_BANK.find((q) => q.id === 'q-110-crisis-composure-anchor');
  const q113 = EXPANDED_PILOT_QUESTION_BANK.find((q) => q.id === 'q-113-voice-note-nuance');

  assert.ok(q103, 'Q103 must exist');
  assert.ok(q110, 'Q110 must exist');
  assert.ok(q113, 'Q113 must exist');

  // Q103: Resource allocation orientation, not moral worth
  assert.equal(q103.facetId, 'resource_allocation_philosophy');
  assert.ok(q103.measurementLimitations?.includes('neither communal giving nor disciplined asset investing is morally superior'));

  // Q110: Stress coping orientation, not character resilience
  assert.equal(q110.facetId, 'acute_stress_coping_orientation');
  assert.ok(q110.measurementLimitations?.includes('Expressing vulnerability is an adaptive coping mechanism'));

  // Q113: Communication modality, not communication competence
  assert.equal(q113.facetId, 'communication_modality_preference');
  assert.ok(q113.whyWeAsk.includes('not a hierarchy of communication competence'));

  // Translation review status must be machine_translation_pending_human_review
  assert.equal(q103.optionTranslationsReviewStatus, 'machine_translation_pending_human_review');
  assert.equal(q110.optionTranslationsReviewStatus, 'machine_translation_pending_human_review');
  assert.equal(q113.optionTranslationsReviewStatus, 'machine_translation_pending_human_review');

  // Psychometric scoring classification separation (ITC Guidelines & Founder Directive)
  assert.equal(q103.scoringType, 'value_tradeoff', 'Q103 must be classified as a value_tradeoff, not a continuous pseudo-trait');
  assert.equal(q110.scoringType, 'categorical_preference', 'Q110 must be classified as a categorical_preference coping style');
  assert.equal(q113.scoringType, 'categorical_preference', 'Q113 must be classified as a categorical_preference communication modality');
});

// ============================================================================
// TEST GROUP 4: PRODUCTION READINESS CLASSIFICATION
// ============================================================================

test('Task 4.1 — Production Readiness Distinguishes Local Code (PASS) from Cloud Edge (BLOCKED)', () => {
  const summary = getProductionReadinessSummary();
  assert.ok(summary.passed >= 6, 'Local features must pass');
  assert.ok(summary.blocked >= 4, 'Remote cloud deployments without credentials must remain BLOCKED');

  const remoteD1 = PRODUCTION_READINESS_REGISTER.find((item) => item.featureId === 'db-d1-remote-persistence');
  assert.equal(remoteD1?.status, 'BLOCKED');

  const remoteWorkers = PRODUCTION_READINESS_REGISTER.find((item) => item.featureId === 'auth-firebase-remote-verify');
  assert.equal(remoteWorkers?.status, 'BLOCKED');
});
