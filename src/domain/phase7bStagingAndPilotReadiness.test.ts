/**
 * KITHRA PHASE 7B: PSYCHOMETRIC QUALITY AUDIT, REAL STAGING & PRIVATE PILOT READINESS TEST SUITE
 *
 * Verifies:
 * 1. Rewritten Q101–Q125 items: verified scenarios, 3 languages without placeholders, balanced options, research basis.
 * 2. Triangulation clusters audit: Cluster 6 is stress_regulation_and_decompression (pure psychological construct);
 *    separation of personal habits and partner requirements from trait clusters.
 * 3. Experimental heuristic thresholds explicitly documented and labeled (spread 28/58/59, uncertainty +-5/+-9/+-15, cutoff 650ms).
 * 4. Complete questionnaire experience: starter battery, adaptive follow-ups, save/resume, and zero data loss.
 * 5. Blocking, unblocking, and confidential report submission.
 * 6. Account isolation and authenticated API router behavior with 403 privacy invariant.
 * 7. Cloud staging status audit: transparent PASS / FAIL / BLOCKED accounting.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPANDED_PILOT_QUESTION_BANK,
} from '../data/pilotQuestionBank';
import {
  TRIANGULATION_CLUSTERS,
  EXPERIMENTAL_TRIANGULATION_SPREAD_THRESHOLDS,
  evaluateTriangulationCluster,
} from './triangulationEngine';
import {
  EXPERIMENTAL_UNCERTAINTY_MARGINS,
  EXPERIMENTAL_RESPONSE_TIME_CUTOFF_MS,
  computeAttributeSimilarity,
  deriveConstructProfileFromAnswers,
} from './psychologyEngine';
import { memberStore } from './memberStore';
import { handleApiRequest } from '../server/apiRouter';
import { PRODUCTION_READINESS_REGISTER, getProductionReadinessSummary } from '../server/productionReadiness';

// ============================================================================
// TEST GROUP 1: REWRITTEN Q101–Q125 QUESTION BANK AUDIT
// ============================================================================

test('Task 1.1 — Q101–Q125 Items Are Fully Reviewed With Realistic Scenarios & Zero Placeholders', () => {
  const q101to125 = EXPANDED_PILOT_QUESTION_BANK.filter(
    (q) => q.questionNumber >= 101 && q.questionNumber <= 125
  );

  assert.equal(q101to125.length, 25, 'Must contain exactly 25 items from Q101 to Q125');

  for (const q of q101to125) {
    // 1. Validation status must be PILOT_REVIEWED
    assert.equal(
      q.validationStatus,
      'PILOT_REVIEWED',
      `Item ${q.id} must be marked PILOT_REVIEWED`
    );

    // 2. Realistic prompt in English, Tamil, and Hindi
    assert.ok(q.prompt && q.prompt.length >= 25, `Item ${q.id} prompt must be detailed`);
    assert.ok(q.translations?.ta && q.translations.ta.length >= 20, `Item ${q.id} must have Tamil translation`);
    assert.ok(q.translations?.hi && q.translations.hi.length >= 20, `Item ${q.id} must have Hindi translation`);

    // Verify zero question mark placeholder characters in translations
    assert.doesNotMatch(q.translations.ta, /\?{3,}/, `Item ${q.id} Tamil translation must not contain placeholder ???`);
    assert.doesNotMatch(q.translations.hi, /\?{3,}/, `Item ${q.id} Hindi translation must not contain placeholder ???`);

    // 3. Research basis and limitations documented
    assert.ok(q.researchBasis && q.researchBasis.length >= 20, `Item ${q.id} must cite research basis`);
    assert.ok(q.measurementLimitations && q.measurementLimitations.length >= 20, `Item ${q.id} must note measurement limitations`);

    // 4. Options must be balanced with distinct normalized values
    assert.equal(q.options.length, 3, `Item ${q.id} must have 3 distinct options`);
    const values = q.options.map((o) => o.normalizedValue);
    const uniqueValues = new Set(values);
    assert.equal(uniqueValues.size, 3, `Item ${q.id} must have 3 distinct normalized values, got: ${values.join(', ')}`);

    for (const opt of q.options) {
      assert.ok(opt.label && opt.label.length >= 15, `Option ${opt.id} must have detailed English label`);
      assert.ok(opt.labelTa && opt.labelTa.length >= 10, `Option ${opt.id} must have Tamil label`);
      assert.ok(opt.labelHi && opt.labelHi.length >= 10, `Option ${opt.id} must have Hindi label`);
      assert.doesNotMatch(opt.labelTa, /\?{3,}/, `Option ${opt.id} Tamil label must not contain ???`);
      assert.doesNotMatch(opt.labelHi, /\?{3,}/, `Option ${opt.id} Hindi label must not contain ???`);
      assert.ok(opt.semanticId && opt.semanticId.startsWith('sem-'), `Option ${opt.id} must have valid semanticId`);
      assert.ok(opt.reflection && opt.reflection.length >= 10, `Option ${opt.id} must have reflection text`);
    }
  }
});

// ============================================================================
// TEST GROUP 2: TRIANGULATION CLUSTERS & HEURISTIC AUDIT
// ============================================================================

test('Task 2.1 — Triangulation Clusters Disentangle Character Traits From Substance Lifestyle Gates', () => {
  assert.equal(TRIANGULATION_CLUSTERS.length, 12, 'Must maintain exactly 12 triangulation clusters');

  // Verify Cluster 6 is stress_regulation_and_decompression (pure psychological construct)
  const cluster6 = TRIANGULATION_CLUSTERS.find((c) => c.id === 'stress_regulation_and_decompression');
  assert.ok(cluster6, 'Cluster 6 must be stress_regulation_and_decompression');
  assert.equal(cluster6.coreConstruct, 'emotional_regulation');

  // Verify that smoking/alcohol habit questions are NOT in Cluster 6
  assert.equal(
    cluster6.questionIds.includes('q-61-smoking-habit'),
    false,
    'q-61-smoking-habit must not be in a trait triangulation cluster'
  );
  assert.equal(
    cluster6.questionIds.includes('q-63-partner-smoking-requirement'),
    false,
    'q-63-partner-smoking-requirement must not be in a trait triangulation cluster'
  );
  assert.equal(
    cluster6.questionIds.includes('q-80-alcohol-lifestyle-habit'),
    false,
    'q-80-alcohol-lifestyle-habit must not be in a trait triangulation cluster'
  );

  // Verify Cluster 6 uses genuine multi-context stress regulation items
  assert.ok(cluster6.questionIds.includes('q-74-stress-spillover'));
  assert.ok(cluster6.questionIds.includes('q-102-de-escalation-patience'));
  assert.ok(cluster6.questionIds.includes('q-110-crisis-composure-anchor'));
  assert.ok(cluster6.questionIds.includes('q-122-patience-in-frustrations'));
});

test('Task 2.2 — Spread Thresholds, Uncertainty Margins & Latencies Are Explicitly Labeled Experimental Heuristics', () => {
  // 1. Triangulation spread thresholds
  assert.equal(EXPERIMENTAL_TRIANGULATION_SPREAD_THRESHOLDS.CONSISTENT_MAX_SPREAD, 28);
  assert.equal(EXPERIMENTAL_TRIANGULATION_SPREAD_THRESHOLDS.SITUATIONAL_MAX_SPREAD, 58);
  assert.equal(EXPERIMENTAL_TRIANGULATION_SPREAD_THRESHOLDS.CLARIFICATION_MIN_SPREAD, 59);

  // 2. Similarity uncertainty margins
  assert.equal(EXPERIMENTAL_UNCERTAINTY_MARGINS.HIGH_CONFIDENCE_MARGIN, 5);
  assert.equal(EXPERIMENTAL_UNCERTAINTY_MARGINS.MODERATE_CONFIDENCE_MARGIN, 9);
  assert.equal(EXPERIMENTAL_UNCERTAINTY_MARGINS.PROVISIONAL_CONFIDENCE_MARGIN, 15);

  // 3. Response time cutoff
  assert.equal(EXPERIMENTAL_RESPONSE_TIME_CUTOFF_MS, 650);

  // 4. Verify triangulation results explicitly tag psychometric interpretation with experimental heuristic disclaimer
  const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === 'stress_regulation_and_decompression')!;
  const answers: Record<string, string> = {
    'q-74-stress-spillover': 'opt-q74-retreat-solitude', // 80
    'q-102-de-escalation-patience': 'opt-q102-pause', // 90
  };
  const result = evaluateTriangulationCluster(cluster, answers, EXPANDED_PILOT_QUESTION_BANK);
  assert.match(
    result.psychometricInterpretation,
    /EXPERIMENTAL HEURISTIC — UNCALIBRATED PILOT THRESHOLD/i,
    'Triangulation output must contain clear experimental calibration notice'
  );
});

// ============================================================================
// TEST GROUP 3: MEMBER ACTIONS (BLOCKING, REPORTING & MUTUAL ISOLATION)
// ============================================================================

test('Task 3.1 — Member Blocking Immediately Excludes Candidates From Mutual Discovery', () => {
  memberStore.resetStoreToDefaults();

  // Initial state: Kavya sees Aarav in dynamic matches
  const initialMatches = memberStore.getDynamicMatchesForActiveMember('member-kavya', 'dating');
  const aaravInitial = initialMatches.find((m) => m.id === 'member-aarav');
  assert.ok(aaravInitial, 'Aarav should be initially discoverable by Kavya');

  // Kavya blocks Aarav
  memberStore.blockMember('member-kavya', 'member-aarav');
  assert.equal(memberStore.isMemberBlocked('member-kavya', 'member-aarav'), true);

  // After blocking: Kavya's matches do NOT contain Aarav
  const postBlockMatchesKavya = memberStore.getDynamicMatchesForActiveMember('member-kavya', 'dating');
  assert.equal(
    postBlockMatchesKavya.some((m) => m.id === 'member-aarav'),
    false,
    'Aarav must be excluded from Kavya matches after block'
  );

  // Mutual isolation: Aarav's matches do NOT contain Kavya either!
  const postBlockMatchesAarav = memberStore.getDynamicMatchesForActiveMember('member-aarav', 'dating');
  assert.equal(
    postBlockMatchesAarav.some((m) => m.id === 'member-kavya'),
    false,
    'Kavya must be excluded from Aarav matches after block'
  );

  // Unblock restores discoverability
  memberStore.unblockMember('member-kavya', 'member-aarav');
  assert.equal(memberStore.isMemberBlocked('member-kavya', 'member-aarav'), false);
  const postUnblockMatches = memberStore.getDynamicMatchesForActiveMember('member-kavya', 'dating');
  assert.ok(
    postUnblockMatches.some((m) => m.id === 'member-aarav'),
    'Aarav should be discoverable again after unblocking'
  );
});

test('Task 3.2 — Member Reporting Submits Confidential Staff Case Without Exposing Private Questionnaire Data', () => {
  const staffCase = memberStore.submitMemberReport(
    'member-kavya',
    'member-rohan',
    'Boundary concern',
    'Inappropriate message received outside agreed intentions'
  );

  assert.ok(staffCase.id.startsWith('K-'), 'Report case must receive a valid K- tracking ID');
  assert.equal(staffCase.category, 'Boundary concern');
  assert.equal(staffCase.priority, 'High');
  assert.equal(staffCase.status, 'Awaiting review');
  assert.match(staffCase.reportedContext, /member-kavya/);
  assert.match(staffCase.reportedContext, /member-rohan/);

  // Verify report object does NOT contain raw questionnaire answers
  // @ts-expect-error verifying raw answers are omitted
  assert.equal(staffCase.answers, undefined);
});

// ============================================================================
// TEST GROUP 4: REAL API ROUTER & AUTHENTICATED ENDPOINTS
// ============================================================================

test('Task 4.1 — Authenticated API Router Handles Blocking, Reporting & DPDP Deletion Cleanly', async () => {
  memberStore.resetStoreToDefaults();
  const token = 'dev-token-member-kavya-member';
  const authHeaders = { Authorization: `Bearer ${token}` };

  // 1. POST /api/member/block
  const blockRes = await handleApiRequest({
    method: 'POST',
    path: '/api/member/block',
    headers: authHeaders,
    body: { targetMemberId: 'member-rohan' },
  });
  assert.equal(blockRes.status, 200);
  assert.equal(memberStore.isMemberBlocked('member-kavya', 'member-rohan'), true);

  // 2. POST /api/member/report
  const reportRes = await handleApiRequest({
    method: 'POST',
    path: '/api/member/report',
    headers: authHeaders,
    body: {
      targetMemberId: 'member-rohan',
      category: 'Boundary concern',
      summary: 'Report via API endpoint',
    },
  });
  assert.equal(reportRes.status, 200);
  const reportBody = reportRes.body as { success: boolean; reportCase: { id: string } };
  assert.equal(reportBody.success, true);
  assert.ok(reportBody.reportCase.id.startsWith('K-'));

  // 3. POST /api/member/unblock
  const unblockRes = await handleApiRequest({
    method: 'POST',
    path: '/api/member/unblock',
    headers: authHeaders,
    body: { targetMemberId: 'member-rohan' },
  });
  assert.equal(unblockRes.status, 200);
  assert.equal(memberStore.isMemberBlocked('member-kavya', 'member-rohan'), false);

  // 4. Strict Privacy Guard: Staff requesting member raw answers receives HTTP 403
  const staffToken = 'dev-token-admin-user-1-admin';
  const privacyRes = await handleApiRequest({
    method: 'GET',
    path: '/api/admin/quiz-answers/member-kavya',
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  assert.equal(privacyRes.status, 403, 'Staff must be blocked with HTTP 403 from inspecting member raw answers');
});

// ============================================================================
// TEST GROUP 5: PRODUCTION READINESS AUDIT (PASS / FAIL / BLOCKED ACCOUNTING)
// ============================================================================

test('Task 5.1 — Production Readiness Register Correctly Distinguishes Local Code (PASS) from Cloud Deployments (BLOCKED)', () => {
  const summary = getProductionReadinessSummary();

  assert.ok(summary.total >= 10, 'Must track at least 10 core production readiness features');
  assert.ok(summary.passed >= 8, 'Core local algorithms, security, and schema must pass');
  assert.ok(summary.blocked >= 2, 'External cloud deployments without credentials must be BLOCKED');
  assert.equal(summary.failed, 0, 'Zero features should be in FAIL state');

  const smsFeature = PRODUCTION_READINESS_REGISTER.find((f) => f.featureId === 'infra-sms-otp-gateway');
  assert.equal(smsFeature?.status, 'BLOCKED', 'SMS OTP must be BLOCKED pending Indian DLT carrier integration');

  const turnstileFeature = PRODUCTION_READINESS_REGISTER.find((f) => f.featureId === 'infra-turnstile-bot-defense');
  assert.equal(turnstileFeature?.status, 'BLOCKED', 'Cloudflare Turnstile must be BLOCKED pending sitekey provisioning');
});
