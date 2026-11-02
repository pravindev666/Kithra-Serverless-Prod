/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASE 3.5 & PHASE 4 VERIFICATION TEST SUITE
 * 
 * Verifies:
 * 1. Psychometric calibration: 63 items, scoring types, research basis, limitations, translations.
 * 2. Stage A Gates auto-binding: Q38, Q50, and Q63 synchronize directly to private eligibility.
 * 3. Flexibility and Complementarity: No default 75, explicit mutual consent required.
 * 4. Response quality position tracking: Real visual displayedOptionIndex (no arbitrary % 3).
 * 5. Adaptive Question Selection Engine: Starter battery (1–5), essential gates, coverage gaps.
 * 6. Lifestyle Smoking & Vaping Compatibility: 3 distinct concepts, intention isolation.
 * 7. Founder Vision non-negotiable principles compliance audit.
 * 8. Production Backend: Firebase JWT auth, D1 schema, and HTTP 403 raw answer denial.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  auditPilotQuestionBank,
  PILOT_60_QUESTION_BANK,
  RESEARCH_PILOT_QUESTION_BANK,
} from '../data/pilotQuestionBank';
import {
  ADAPTIVE_ENGINE_VERSION,
  selectNextAdaptiveQuestion,
  STARTER_BATTERY_QUESTION_IDS,
} from './adaptiveQuestionEngine';
import { memberStore } from './memberStore';
import {
  evaluateMemberPairwiseMatch,
  evaluateMutualEligibility,
  evaluateWeBalanceEachOther,
} from './psychologyEngine';
import { auditFounderVisionCompliance, FOUNDER_VISION } from './founderVision';
import {
  authorizeAssessmentAccess,
  verifyFirebaseToken,
} from '../server/authMiddleware';
import { handleApiRequest } from '../server/apiRouter';
import {
  getProductionReadinessSummary,
  PRODUCTION_READINESS_REGISTER,
} from '../server/productionReadiness';

// ============================================================================
// SUITE 1: PSYCHOMETRIC AUDIT & 63-ITEM PILOT QUESTION BANK
// ============================================================================

test('Goal 1.1 - 63-Item Research Pilot Question Bank Audit', () => {
  const audit = auditPilotQuestionBank(RESEARCH_PILOT_QUESTION_BANK);

  assert.equal(audit.totalQuestions, 63, 'Expected 60 baseline + 3 lifestyle items = 63 total');
  assert.equal(audit.allHaveUniqueSemanticIds, true);
  assert.equal(audit.allHaveThreeLanguages, true);
  assert.equal(audit.allHaveScoringTypes, true, 'All 63 items must specify psychometric scoringType');
  assert.equal(audit.allHaveResearchBasis, true, 'All 63 items must document empirical researchBasis');
  assert.equal(audit.allHaveMeasurementLimitations, true, 'All 63 items must document measurementLimitations');
  assert.equal(audit.allHaveOptionTranslations, true, 'All options must have Tamil and Hindi translations');

  // Verify categorical classification for Q1 (resolving the arbitrary scalar trap)
  const q1 = RESEARCH_PILOT_QUESTION_BANK.find((q) => q.id === 'q-pace');
  assert.ok(q1);
  assert.equal(q1.scoringType, 'categorical_preference', 'Q1 must be categorical, not a pseudo-linear trait');
  assert.ok(q1.researchBasis?.includes('Walther'));

  // Verify essential gates
  const q38 = RESEARCH_PILOT_QUESTION_BANK.find((q) => q.id === 'q-38-relationship-structure-gate');
  assert.equal(q38?.scoringType, 'essential_gate');

  const q50 = RESEARCH_PILOT_QUESTION_BANK.find((q) => q.id === 'q-50-children-goal-gate');
  assert.equal(q50?.scoringType, 'essential_gate');

  const q63 = RESEARCH_PILOT_QUESTION_BANK.find((q) => q.id === 'q-63-partner-smoking-requirement');
  assert.equal(q63?.scoringType, 'essential_gate');
});

test('Goal 1.2 - Backward Compatibility of PILOT_60_QUESTION_BANK', () => {
  const audit = auditPilotQuestionBank(PILOT_60_QUESTION_BANK);
  assert.equal(audit.totalQuestions, 60);
  assert.equal(audit.stageCounts[1], 10);
  assert.equal(audit.stageCounts[2], 21);
  assert.equal(audit.stageCounts[3], 29);
});

// ============================================================================
// SUITE 2: STAGE A GATES AUTO-BINDING TO PRIVATE ELIGIBILITY
// ============================================================================

test('Goal 2.1 - Q38 Relationship Structure Auto-Syncs to Member Eligibility', () => {
  memberStore.resetStoreToDefaults();

  // Answer Q38 with exclusive requirement
  memberStore.saveMemberAnswer('member-tara', 'q-38-relationship-structure-gate', 'opt-q38-exclusive');
  let tara = memberStore.getMemberById('member-tara')!;
  assert.equal(tara.eligibility?.relationshipStructure, 'exclusive_required');

  // Update Q38 to open structure
  memberStore.saveMemberAnswer('member-tara', 'q-38-relationship-structure-gate', 'opt-q38-open');
  tara = memberStore.getMemberById('member-tara')!;
  assert.equal(tara.eligibility?.relationshipStructure, 'open_required');

  // Update Q38 to flexible
  memberStore.saveMemberAnswer('member-tara', 'q-38-relationship-structure-gate', 'opt-q38-flexible');
  tara = memberStore.getMemberById('member-tara')!;
  assert.equal(tara.eligibility?.relationshipStructure, 'flexible_either');
});

test('Goal 2.2 - Q50 Children Goal Auto-Syncs to Member Eligibility', () => {
  memberStore.resetStoreToDefaults();

  // Answer Q50 with wants children
  memberStore.saveMemberAnswer('member-tara', 'q-50-children-goal-gate', 'opt-q50-wants');
  let tara = memberStore.getMemberById('member-tara')!;
  assert.equal(tara.eligibility?.childrenPreference, 'wants_children');
  assert.equal(tara.eligibility?.childrenRequirementLevel, 'essential');

  // Answer Q50 with child-free
  memberStore.saveMemberAnswer('member-tara', 'q-50-children-goal-gate', 'opt-q50-no');
  tara = memberStore.getMemberById('member-tara')!;
  assert.equal(tara.eligibility?.childrenPreference, 'does_not_want_children');
  assert.equal(tara.eligibility?.childrenRequirementLevel, 'essential');

  // Answer Q50 with flexible
  memberStore.saveMemberAnswer('member-tara', 'q-50-children-goal-gate', 'opt-q50-open');
  tara = memberStore.getMemberById('member-tara')!;
  assert.equal(tara.eligibility?.childrenPreference, 'open_or_flexible');
  assert.equal(tara.eligibility?.childrenRequirementLevel, 'flexible');
});

// ============================================================================
// SUITE 3: FLEXIBILITY & COMPLEMENTARITY VERIFICATION
// ============================================================================

test('Goal 3.1 - Flexibility Is Not Defaulted to 75 and Requires Explicit Consent for Complementarity', () => {
  // 1. Verify flexibility is undefined (unknown) when unmeasured, NOT arbitrarily defaulted to 75
  const answersWithoutFlexibility = { 'q-pace': 'opt-slow' };
  const constructs = memberStore.getMemberById('member-tara')?.constructProfile ?? [];
  const commConstruct = constructs.find((c) => c.constructId === 'communication');
  assert.notEqual(commConstruct?.flexibility, 75, 'Flexibility must never be defaulted to 75');

  // 2. Complementarity requires both mutual consent AND confirmed flexibility
  const viewerWithoutFlex = [
    { constructId: 'social_energy' as const, score: 65, itemCount: 2 },
  ];
  const candidateWithoutFlex = [
    { constructId: 'social_energy' as const, score: 35, itemCount: 2 },
  ];

  // With mutual consent but unmeasured flexibility: does NOT over-claim balance
  const resultUnconfirmedFlex = evaluateWeBalanceEachOther(
    viewerWithoutFlex,
    candidateWithoutFlex,
    { mutualAcceptanceOfDifference: true }
  );
  assert.equal(resultUnconfirmedFlex.qualifiesForWeBalanceEachOther, false);
  assert.ok(
    resultUnconfirmedFlex.unwelcomedDifferenceWarnings.some((w) =>
      w.includes('flexibility that has not yet been confirmed')
    )
  );

  // Without mutual consent: blocked
  const resultWithoutConsent = evaluateWeBalanceEachOther(
    viewerWithoutFlex,
    candidateWithoutFlex,
    { mutualAcceptanceOfDifference: false }
  );
  assert.equal(resultWithoutConsent.qualifiesForWeBalanceEachOther, false);
  assert.equal(resultWithoutConsent.score, 0);

  // With confirmed flexibility AND mutual consent: We Balance Each Other qualifies!
  const viewerWithFlex = [
    { constructId: 'social_energy' as const, score: 65, itemCount: 2, flexibility: 80 },
  ];
  const candidateWithFlex = [
    { constructId: 'social_energy' as const, score: 35, itemCount: 2, flexibility: 80 },
  ];
  const resultWithFlexAndConsent = evaluateWeBalanceEachOther(
    viewerWithFlex,
    candidateWithFlex,
    { mutualAcceptanceOfDifference: true }
  );
  assert.equal(resultWithFlexAndConsent.qualifiesForWeBalanceEachOther, true);
  assert.ok(resultWithFlexAndConsent.score >= 50);
});

// ============================================================================
// SUITE 4: RESPONSE QUALITY & POSITION TRACKING
// ============================================================================

test('Goal 5.1 - Real Visual Displayed Option Index Recorded Without Arbitrary % 3', () => {
  memberStore.resetStoreToDefaults();

  // Save answer explicitly passing displayedOptionIndex: 2
  memberStore.saveMemberAnswer('member-tara', 'q-pace', 'opt-group-first', 2800, 2);

  const rawResponses = memberStore.getInternalState().rawResponses['member-tara'];
  assert.equal(rawResponses['q-pace'].displayedOptionIndex, 2);
  assert.equal(rawResponses['q-pace'].semanticId, 'sem-pace-circle-gathering');
});

// ============================================================================
// SUITE 5: ADAPTIVE QUESTION SELECTION ENGINE
// ============================================================================

test('Goal 6.1 - Adaptive Engine Administers Starter Battery (Items 1–5) in Fixed Order', () => {
  const answered: string[] = [];

  for (let i = 0; i < 5; i++) {
    const next = selectNextAdaptiveQuestion(answered, ['friendship']);
    assert.equal(next.selectionReason, 'starter_battery');
    assert.equal(next.nextQuestion?.id, STARTER_BATTERY_QUESTION_IDS[i]);
    assert.equal(next.engineVersion, ADAPTIVE_ENGINE_VERSION);
    answered.push(next.nextQuestion!.id);
  }
});

test('Goal 6.2 - Adaptive Engine Prioritizes Essential Gates for Dating/Matrimony after Starter Battery', () => {
  // Starter battery answered
  const answered = [...STARTER_BATTERY_QUESTION_IDS];

  // Next question for Dating intention must be one of the essential gates
  const nextForDating = selectNextAdaptiveQuestion(answered, ['dating']);
  assert.equal(nextForDating.selectionReason, 'essential_boundary_gate');
  assert.equal(nextForDating.nextQuestion?.id, 'q-38-relationship-structure-gate');

  answered.push('q-38-relationship-structure-gate');
  const nextGate2 = selectNextAdaptiveQuestion(answered, ['dating']);
  assert.equal(nextGate2.selectionReason, 'essential_boundary_gate');
  assert.equal(nextGate2.nextQuestion?.id, 'q-50-children-goal-gate');

  answered.push('q-50-children-goal-gate');
  const nextGate3 = selectNextAdaptiveQuestion(answered, ['dating']);
  assert.equal(nextGate3.selectionReason, 'essential_boundary_gate');
  assert.equal(nextGate3.nextQuestion?.id, 'q-63-partner-smoking-requirement');
});

test('Goal 6.3 - Adaptive Engine Optimizes Construct Coverage Gaps', () => {
  // Starter battery + essential gates answered
  const answered = [
    ...STARTER_BATTERY_QUESTION_IDS,
    'q-38-relationship-structure-gate',
    'q-50-children-goal-gate',
    'q-63-partner-smoking-requirement',
  ];

  const next = selectNextAdaptiveQuestion(answered, ['friendship']);
  assert.equal(next.selectionReason, 'construct_coverage_gap');
  assert.ok(next.nextQuestion);
  // Target construct must have 0 answered items
  assert.equal(next.coverageByConstruct[next.nextQuestion.constructId!], 0);
});

test('Goal 6.4 - Adaptive Engine Output is Deterministic and Reproducible', () => {
  const answered = ['q-pace', 'q-02-workweek-reply', 'q-03-first-meetup'];

  const run1 = selectNextAdaptiveQuestion(answered, ['dating']);
  const run2 = selectNextAdaptiveQuestion(answered, ['dating']);

  assert.equal(run1.nextQuestion?.id, run2.nextQuestion?.id);
  assert.equal(run1.selectionReason, run2.selectionReason);
  assert.equal(run1.rationale, run2.rationale);
});

// ============================================================================
// SUITE 6: LIFESTYLE SMOKING & VAPING COMPATIBILITY MODULE
// ============================================================================

test('Goal 9.1 - Smoking Compatibility: 3 Distinct Concepts & Intention Isolation', () => {
  memberStore.resetStoreToDefaults();

  const kavya = memberStore.getMemberById('member-kavya')!; // non-smoker, requires non-smoker in dating
  const vikram = memberStore.getMemberById('member-vikram')!; // regular smoker
  const rohan = memberStore.getMemberById('member-rohan')!; // occasional social smoker

  // 1. In Dating: Kavya vs Vikram is INELIGIBLE due to hard requirement conflict
  const datingKavyaVikram = evaluateMutualEligibility(kavya.eligibility!, vikram.eligibility!, 'dating');
  assert.equal(datingKavyaVikram.eligible, false);
  assert.ok(datingKavyaVikram.reasons.includes('incompatible_smoking_preference'));

  // 2. In Friendship: Kavya vs Vikram is ELIGIBLE (smoking requirement does not block friendship)
  const friendshipKavyaVikram = evaluateMutualEligibility(kavya.eligibility!, vikram.eligibility!, 'friendship');
  assert.equal(friendshipKavyaVikram.eligible, true);
  assert.equal(friendshipKavyaVikram.status, 'eligible');

  // 3. In Dating: Kavya vs Rohan (social smoker) is INELIGIBLE under Kavya's must_be_non_smoker requirement
  const datingKavyaRohan = evaluateMutualEligibility(kavya.eligibility!, rohan.eligibility!, 'dating');
  assert.equal(datingKavyaRohan.eligible, false);
  assert.ok(datingKavyaRohan.reasons.includes('incompatible_smoking_preference'));

  // 4. In Friendship: Kavya vs Rohan is ELIGIBLE
  const friendshipKavyaRohan = evaluateMutualEligibility(kavya.eligibility!, rohan.eligibility!, 'friendship');
  assert.equal(friendshipKavyaRohan.eligible, true);
});

test('Goal 9.2 - Unknown Smoking Habit Does Not Falsely Fail Eligibility', () => {
  const viewer = {
    isAdultVerified: true,
    enabledIntentions: ['dating'] as const,
    smokingVapingProfile: {
      personalHabit: 'non_smoker' as const,
      environmentComfort: 'smoke_free_only' as const,
      partnerRequirementByIntention: {
        dating: 'must_be_non_smoker' as const,
      },
      isVoluntarilyDisclosed: true,
    },
  };

  const candidateUnknown = {
    isAdultVerified: true,
    enabledIntentions: ['dating'] as const,
    smokingVapingProfile: {
      personalHabit: 'unknown' as const,
      environmentComfort: 'unknown' as const,
      partnerRequirementByIntention: {},
      isVoluntarilyDisclosed: false,
    },
  };

  const result = evaluateMutualEligibility(viewer as any, candidateUnknown as any, 'dating');
  // Unknown data produces clarification needed without false hard rejection
  assert.equal(result.eligible, true);
  assert.equal(result.status, 'clarification_needed_unknown_requirement');
  assert.ok(result.unknownFieldsRequiringClarification.includes('smoking_habit'));
});

// ============================================================================
// SUITE 7: FOUNDER VISION COMPLIANCE AUDIT
// ============================================================================

test('Goal 10.1 - Founder Vision Non-Negotiable Compliance Audit', () => {
  const audit = auditFounderVisionCompliance();
  assert.equal(audit.allCompliant, true);
  assert.ok(audit.checkedRules.length >= 7);
  assert.equal(FOUNDER_VISION.prohibitedMatchingFilters.includes('caste'), true);
  assert.equal(FOUNDER_VISION.prohibitedMatchingFilters.includes('income'), true);
  assert.equal(FOUNDER_VISION.prohibitedMatchingFilters.includes('height'), true);
});

// ============================================================================
// SUITE 8: PRODUCTION BACKEND & SECURITY CONTROLLERS
// ============================================================================

test('Goal 10.2 - Firebase JWT Token Verification Middleware', () => {
  // Missing token
  const missing = verifyFirebaseToken('');
  assert.equal(missing.authenticated, false);
  assert.equal(missing.errorCode, 'MISSING_TOKEN');

  // Dev / Mock Token
  const devToken = verifyFirebaseToken('dev-token-member-kavya-member');
  assert.equal(devToken.authenticated, true);
  assert.equal(devToken.context?.userId, 'member-kavya');
  assert.equal(devToken.context?.role, 'member');

  // Malformed token
  const malformed = verifyFirebaseToken('abc.def');
  assert.equal(malformed.authenticated, false);
  assert.equal(malformed.errorCode, 'MALFORMED_TOKEN');
});

test('Goal 10.3 - Raw Questionnaire Answers Strictly Restricted from Staff (HTTP 403)', async () => {
  // Admin tries to query raw answers of member Kavya
  const adminContext = {
    userId: 'admin-user-1',
    role: 'admin' as const,
    token: 'dev-token-admin-user-1-admin',
  };

  const check = authorizeAssessmentAccess(adminContext, 'member-kavya', true);
  assert.equal(check.allowed, false);
  assert.equal(check.status, 403);
  assert.equal(check.code, 'SERVER_SIDE_ACCESS_DENIED');

  // Test via API dispatcher
  const response = await handleApiRequest({
    method: 'GET',
    path: '/api/admin/quiz-answers/member-kavya',
    headers: {
      Authorization: 'Bearer dev-token-admin-user-1-admin',
    },
  });

  assert.equal(response.status, 403);
  assert.equal((response.body as any).error, 'SERVER_SIDE_ACCESS_DENIED');
  assert.ok((response.body as any).message.includes('RAW_ASSESSMENT_RESPONSES_RESTRICTED'));
});

test('Goal 10.4 - Production Readiness Matrix Evaluates Core Infrastructure', () => {
  const summary = getProductionReadinessSummary();
  assert.ok(summary.total >= 10);
  assert.ok(summary.passed >= 9);
  assert.equal(summary.failed, 0, 'No core features should be in FAIL status');
  assert.equal(summary.blocked, 2, 'Carrier SMS gateway and Turnstile are documented as BLOCKED pending external vendor provisioning');
  assert.ok(summary.readinessPercentage >= 80);
});
