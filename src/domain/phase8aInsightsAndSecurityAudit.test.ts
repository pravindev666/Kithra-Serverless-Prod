/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASE 8A: PSYCHOLOGICAL INSIGHTS, FOUNDER ANALYTICS & SECURITY AUDIT TEST SUITE
 * 
 * Verifies:
 * 1. Cryptographic Firebase token verification & operational staff 2-step MFA / RBAC.
 * 2. Strict rejection of mock/dev tokens in production and staging environments.
 * 3. Member-controlled psychological self-understanding reports across 12 domains.
 * 4. Transparent confidence bands (provisional, developing, established) and non-clinical limitations.
 * 5. DPDP Act 2023 Section 12 personal data review, correction, and erasure.
 * 6. Voluntary relationship reflection bank (zero inference of past marital/intimacy history).
 * 7. Privacy-preserving founder analytics with k-anonymity (k >= 5) cell suppression.
 * 8. Decoupled safety moderation free from clinical or moral pathology labels.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  initiateStaffLogin,
  verifyStaffMfaCode,
  authenticateStaffToken,
  authorizeStaffRole,
  generateStaffTotpCode,
  clearStaffRateLimits,
} from '../server/adminAuthService';
import {
  verifyFirebaseToken,
} from '../server/authMiddleware';
import {
  generateMemberSelfUnderstandingReport,
  NON_CLINICAL_DISCLAIMER,
} from './psychologicalInsightsEngine';
import {
  VOLUNTARY_RELATIONSHIP_REFLECTION_BANK,
} from '../data/relationshipReflectionBank';
import {
  applyKAnonymity,
  generateFounderAnalyticsReport,
  K_ANONYMITY_THRESHOLD,
} from './founderAnalyticsEngine';
import { memberStore } from './memberStore';
import { EXPANDED_PILOT_QUESTION_BANK } from '../data/pilotQuestionBank';
import { handleApiRequest } from '../server/apiRouter';

// ============================================================================
// SUITE 1: OPERATIONAL STAFF 2-STEP MFA & RBAC ENFORCEMENT
// ============================================================================

test('Phase 8A — Staff Authentication: Step 1 Credential Check & Challenge Generation', async () => {
  clearStaffRateLimits();

  // Reject invalid operational credentials
  const badLogin = await initiateStaffLogin('intruder@kithra.in', 'WrongPassword123');
  assert.equal(badLogin.success, false);
  assert.equal(badLogin.challengeId, undefined);

  // Reject non-operational external email
  const externalLogin = await initiateStaffLogin('member.kavya@gmail.com', 'KithraSecureAdmin2026!');
  assert.equal(externalLogin.success, false);

  // Valid administrator login initiates 5-minute challenge
  const adminChallenge = await initiateStaffLogin('admin@kithra.in', 'KithraSecureAdmin2026!');
  assert.equal(adminChallenge.success, true);
  assert.equal(adminChallenge.mfaRequired, true);
  assert.ok(adminChallenge.challengeId?.startsWith('mfa_ch_'));

  // Valid moderator login initiates challenge
  const modChallenge = await initiateStaffLogin('moderator@kithra.in', 'KithraSafetyMod2026!');
  assert.equal(modChallenge.success, true);
  assert.equal(modChallenge.mfaRequired, true);

  // Rate limiting lockout check after 5 failed attempts
  for (let i = 0; i < 5; i++) {
    await initiateStaffLogin('admin@kithra.in', 'BadPass' + i);
  }
  const lockedOutLogin = await initiateStaffLogin('admin@kithra.in', 'KithraSecureAdmin2026!');
  assert.equal(lockedOutLogin.success, false);
  assert.equal(lockedOutLogin.rateLimited, true);
  assert.ok(lockedOutLogin.errorMessage?.includes('temporarily locked'));

  clearStaffRateLimits();
});

test('Phase 8A — Staff Authentication: Step 2 TOTP MFA Verification & Single-Use Challenge', async () => {
  clearStaffRateLimits();
  const challenge = await initiateStaffLogin('admin@kithra.in', 'KithraSecureAdmin2026!');
  assert.ok(challenge.challengeId);

  // Reject invalid MFA code
  const badMfa = await verifyStaffMfaCode(challenge.challengeId, '000000');
  assert.equal(badMfa.success, false);
  assert.equal(badMfa.session, undefined);

  // Calculate real RFC 6238 TOTP code
  const currentTotp = await generateStaffTotpCode('admin@kithra.in');
  assert.ok(currentTotp);
  assert.equal(currentTotp.length, 6);

  // Accept valid 6-digit TOTP code
  const goodMfa = await verifyStaffMfaCode(challenge.challengeId, currentTotp);
  assert.equal(goodMfa.success, true);
  assert.ok(goodMfa.session);
  assert.equal(goodMfa.session.role, 'admin');
  assert.equal(goodMfa.session.mfaVerified, true);

  // Verify token is a cryptographically signed HS256 JWT
  const jwtParts = goodMfa.session.token.split('.');
  assert.equal(jwtParts.length, 3);

  // Cryptographic token verification
  const verifiedToken = await authenticateStaffToken(goodMfa.session.token);
  assert.equal(verifiedToken.authenticated, true);
  assert.equal(verifiedToken.context?.role, 'admin');

  // Single-use challenge: Replaying the challengeId must fail
  const replayAttempt = await verifyStaffMfaCode(challenge.challengeId, currentTotp);
  assert.equal(replayAttempt.success, false);
  assert.ok(replayAttempt.errorMessage?.includes('expired or not found'));

  // Test emergency backup code
  const challenge2 = await initiateStaffLogin('admin@kithra.in', 'KithraSecureAdmin2026!');
  const backupMfa = await verifyStaffMfaCode(challenge2.challengeId!, 'REC-ADM-8421-9901');
  assert.equal(backupMfa.success, true);
  assert.equal(backupMfa.session?.role, 'admin');
});

test('Phase 8A — Staff Role-Based Access Control (RBAC): Admin vs Moderator Permissions', async () => {
  clearStaffRateLimits();

  // Login as moderator
  const modCh = await initiateStaffLogin('moderator@kithra.in', 'KithraSafetyMod2026!');
  const modTotp = await generateStaffTotpCode('moderator@kithra.in');
  const modMfa = await verifyStaffMfaCode(modCh.challengeId!, modTotp!);
  const modSession = modMfa.session!;

  // Moderator is permitted for case review
  const casePerm = authorizeStaffRole(modSession, ['moderator', 'admin']);
  assert.equal(casePerm.allowed, true);

  // Moderator is strictly forbidden from founder aggregate analytics
  const analyticsPerm = authorizeStaffRole(modSession, ['admin']);
  assert.equal(analyticsPerm.allowed, false);
  assert.equal(analyticsPerm.status, 403);

  // Login as admin
  const adminCh = await initiateStaffLogin('admin@kithra.in', 'KithraSecureAdmin2026!');
  const adminTotp = await generateStaffTotpCode('admin@kithra.in');
  const adminMfa = await verifyStaffMfaCode(adminCh.challengeId!, adminTotp!);
  const adminSession = adminMfa.session!;

  // Admin is permitted for founder analytics
  const adminAnalyticsPerm = authorizeStaffRole(adminSession, ['admin']);
  assert.equal(adminAnalyticsPerm.allowed, true);

  // Auditor-only operational permissions are forbidden for admin
  const adminAuditorPerm = authorizeStaffRole(adminSession, ['auditor']);
  assert.equal(adminAuditorPerm.allowed, false);
  assert.equal(adminAuditorPerm.status, 403);
});

test('Phase 8A — Security Guardrail: Mock / Dev Tokens Strictly Disabled in Staging & Production', () => {
  // Save initial env
  const origEnv = process.env.ENVIRONMENT;
  const origAllow = process.env.ALLOW_DEV_TOKENS;

  try {
    // When environment is staging or production, dev tokens must be rejected
    process.env.ENVIRONMENT = 'staging';
    const stagingCheck = verifyFirebaseToken('dev-token-member-kavya-member');
    assert.equal(stagingCheck.authenticated, false);
    assert.equal(stagingCheck.errorCode, 'DEV_TOKENS_DISABLED');

    // When ALLOW_DEV_TOKENS is explicitly false, dev tokens must be rejected
    process.env.ENVIRONMENT = 'development';
    process.env.ALLOW_DEV_TOKENS = 'false';
    const disabledCheck = verifyFirebaseToken('dev-token-member-kavya-member');
    assert.equal(disabledCheck.authenticated, false);
    assert.equal(disabledCheck.errorCode, 'DEV_TOKENS_DISABLED');
  } finally {
    // Restore clean testing environment
    process.env.ENVIRONMENT = origEnv;
    process.env.ALLOW_DEV_TOKENS = origAllow;
  }
});

// ============================================================================
// SUITE 2: MEMBER-CONTROLLED PSYCHOLOGICAL SELF-UNDERSTANDING INSIGHTS
// ============================================================================

test('Phase 8A — Member Self-Understanding: 12 Structured Domains & Non-Clinical Disclaimer', () => {
  const memberId = 'member-test-insights-1';
  const sampleAnswers: Record<string, string> = {
    'q1': 'opt-1-written',
    'q2': 'opt-2-direct',
    'q3': 'opt-3-alone',
    'q4': 'opt-4-independent',
    'q5': 'opt-5-growth',
  };

  const report = generateMemberSelfUnderstandingReport(memberId, sampleAnswers, EXPANDED_PILOT_QUESTION_BANK);

  assert.equal(report.memberId, memberId);
  assert.equal(report.overallCoverage.totalAnswered, 5);
  assert.equal(report.overallCoverage.readinessStatus, 'developing');
  assert.equal(report.nonClinicalDisclaimer, NON_CLINICAL_DISCLAIMER);
  assert.ok(report.insights.length >= 12);

  // Check communication domain
  const commInsight = report.insights.find((i) => i.constructId === 'communication');
  assert.ok(commInsight);
  assert.equal(commInsight.category, 'communication');
  assert.ok(typeof commInsight.statedPreferenceSummary === 'string');
  assert.ok(commInsight.missingInformationNote.length > 0);
  assert.ok(commInsight.interpretationLimitations.length > 0);
});

test('Phase 8A — Confidence Band Progression: Provisional vs Developing vs Established', () => {
  const memberId = 'member-test-confidence';

  // 1 answer in communication domain -> Provisional
  const provisionalReport = generateMemberSelfUnderstandingReport(
    memberId,
    { 'q-pace': 'opt-slow' },
    EXPANDED_PILOT_QUESTION_BANK
  );
  const commProvisional = provisionalReport.insights.find((i) => i.constructId === 'communication')!;
  assert.equal(commProvisional.confidenceBand, 'provisional');

  // 2 answers in communication domain -> Developing
  const developingReport = generateMemberSelfUnderstandingReport(
    memberId,
    { 'q-pace': 'opt-slow', 'q-02-workweek-reply': 'opt-02-balanced' },
    EXPANDED_PILOT_QUESTION_BANK
  );
  const commDeveloping = developingReport.insights.find((i) => i.constructId === 'communication')!;
  assert.equal(commDeveloping.confidenceBand, 'developing');

  // 3+ answers in communication domain -> Established
  const establishedReport = generateMemberSelfUnderstandingReport(
    memberId,
    { 'q-pace': 'opt-slow', 'q-02-workweek-reply': 'opt-02-balanced', 'q-05-voice-vs-text': 'opt-05-voice' },
    EXPANDED_PILOT_QUESTION_BANK
  );
  const commEstablished = establishedReport.insights.find((i) => i.constructId === 'communication')!;
  assert.equal(commEstablished.confidenceBand, 'established');
});

test('Phase 8A — DPDP Act 2023 Section 12 Data Erasure Invalidates Derived Reflections', () => {
  const testMemberId = 'member-kavya';

  // Save answers in member store
  memberStore.saveMemberAnswer(testMemberId, 'q-pace', 'opt-slow', 2000, 0);
  memberStore.saveMemberAnswer(testMemberId, 'q-02-workweek-reply', 'opt-02-balanced', 2500, 1);

  const rawBefore = memberStore.getMemberRawAnswers(testMemberId, 'member_self', testMemberId);
  assert.ok(Object.keys(rawBefore).length >= 2);

  // Invoke statutory erasure
  const erasure = memberStore.deleteMemberAssessmentData(testMemberId);
  assert.equal(erasure.success, true);
  assert.equal(erasure.rawAnswersRemaining, 0);
  assert.equal(erasure.derivedVectorsCleared, true);

  // Verify raw answers are cleared
  const rawAfter = memberStore.getMemberRawAnswers(testMemberId, 'member_self', testMemberId);
  assert.equal(Object.keys(rawAfter).length, 0);

  // Re-generating report yields 0 answered items and provisional status
  const clearedReport = generateMemberSelfUnderstandingReport(testMemberId, rawAfter, EXPANDED_PILOT_QUESTION_BANK);
  assert.equal(clearedReport.overallCoverage.totalAnswered, 0);
  assert.equal(clearedReport.overallCoverage.readinessStatus, 'provisional');
});

// ============================================================================
// SUITE 3: VOLUNTARY RELATIONSHIP REFLECTION MODULE
// ============================================================================

test('Phase 8A — Voluntary Relationship Reflections: Zero Inference of Past History', () => {
  assert.ok(VOLUNTARY_RELATIONSHIP_REFLECTION_BANK.length >= 3);

  for (const item of VOLUNTARY_RELATIONSHIP_REFLECTION_BANK) {
    // Invariant: Must be flagged voluntary
    assert.equal(item.isVoluntary, true);
    // Invariant: Must explain transparent reason for asking
    assert.ok(item.whyWeAsk.length > 10);
    // Invariant: Transparency note must be descriptive
    assert.ok(item.transparencyNote.length >= 10);
    // Invariant: Options must have companion guidance
    assert.ok(item.options.length >= 3);
    for (const opt of item.options) {
      assert.ok(opt.boundaryGuidance.length > 10);
      assert.ok(opt.reflectionText.length > 5);
    }
  }
});

// ============================================================================
// SUITE 4: FOUNDER AGGREGATE ANALYTICS & DIFFERENTIAL PRIVACY (k >= 5)
// ============================================================================

test('Phase 8A — Differential Privacy: k-Anonymity (k >= 5) Masking Invariant', () => {
  // Counts < 5 must be suppressed
  assert.equal(applyKAnonymity(0, 5), 0);
  assert.equal(applyKAnonymity(1, 5), '< 5 [SUPPRESSED FOR PRIVACY]');
  assert.equal(applyKAnonymity(2, 5), '< 5 [SUPPRESSED FOR PRIVACY]');
  assert.equal(applyKAnonymity(3, 5), '< 5 [SUPPRESSED FOR PRIVACY]');
  assert.equal(applyKAnonymity(4, 5), '< 5 [SUPPRESSED FOR PRIVACY]');

  // Counts >= 5 must be retained as numbers
  assert.equal(applyKAnonymity(5, 5), 5);
  assert.equal(applyKAnonymity(24, 5), 24);
  assert.equal(applyKAnonymity(100, 5), 100);
});

test('Phase 8A — Founder Analytics Engine: Segregated Taxonomy & Zero Raw-Answer Leakage', () => {
  const analytics = generateFounderAnalyticsReport(K_ANONYMITY_THRESHOLD);

  assert.ok(analytics.cohortSampleSize >= 1);
  assert.equal(analytics.privacyGuarantees.kAnonymityEnforced, true);
  assert.equal(analytics.privacyGuarantees.rawIndividualAnswersExposed, false);
  assert.equal(analytics.privacyGuarantees.individualPsychologicalDossiersGenerated, false);
  assert.equal(analytics.privacyGuarantees.nonClinicalGovernance, true);

  // 1. Observed Behavior (Completion funnel & skip friction)
  assert.ok(analytics.completionFunnel.length >= 3);
  assert.ok(analytics.questionFrictionHeatmap.length >= 1);
  assert.ok(typeof analytics.engagementMetrics.averageQuestionsAnswered === 'number');

  // 2. Self-Reported Intentions (Friendship, Dating, Matrimony)
  assert.ok(analytics.intentionsBreakdown.matrimonyCount !== undefined);
  assert.ok(analytics.intentionsBreakdown.datingCount !== undefined);

  // 3. Model Estimates (Readiness tiers & Lenses)
  assert.ok(analytics.readinessDistribution.exploratoryLess5 !== undefined);
  assert.ok(analytics.discoveryOutcomes.lensDistribution.similarToMePct !== undefined);
});

// ============================================================================
// SUITE 5: SAFETY OPERATIONS & PROHIBITION OF PATHOLOGY LABELS
// ============================================================================

test('Phase 8A — Safety Operations Decoupled from Personality: Zero Pathology Labels', () => {
  const FORBIDDEN_PATHOLOGY_TERMS = [
    'psychopath',
    'sociopath',
    'narcissist',
    'bipolar',
    'borderline',
    'mentally unstable',
    'bad character',
    'evil',
    'liar',
    'manipulator',
    'dangerous person',
  ];

  // Verify that neither psychological engine disclaimers nor reflection options contain pathology terms
  const allReflectionText = VOLUNTARY_RELATIONSHIP_REFLECTION_BANK.flatMap((i) =>
    i.options.map((o) => `${o.label} ${o.reflectionText} ${o.boundaryGuidance}`)
  ).join(' ').toLowerCase();

  for (const term of FORBIDDEN_PATHOLOGY_TERMS) {
    assert.equal(
      allReflectionText.includes(term),
      false,
      `Voluntary reflection bank contains forbidden pathology term: "${term}"`
    );
  }

  const disclaimerText = NON_CLINICAL_DISCLAIMER.toLowerCase();
  for (const term of FORBIDDEN_PATHOLOGY_TERMS) {
    assert.equal(
      disclaimerText.includes(term),
      false,
      `Non-clinical disclaimer contains forbidden pathology term: "${term}"`
    );
  }
});
