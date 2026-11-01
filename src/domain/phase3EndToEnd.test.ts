/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA — PHASE 3: REAL-WORLD PSYCHOLOGY ENGINE INTEGRATION & VERIFICATION
 * Comprehensive End-to-End Verification Test Suite
 * 
 * Verifies Tasks 1 through 7:
 * - Task 1: Audit verification of psychology constructs, engine version, and models
 * - Task 2: Real member assessments (saving, resuming, continuous vectors, staged patterns, DPDP Act 2023 deletion)
 * - Task 3: Real matching engine (no hardcoded scores, independent intentions, Stage A eligibility conflicts)
 * - Task 4: 60-question pilot bank verification (audit function, 12 layers, 3 languages, semantic IDs)
 * - Task 5: 0–100 scores verification (identical=100, different<30, insufficient data=null, missing answers handled)
 * - Task 6: Privacy & admin security (zero raw answers exposed to admins/staff, non-accusatory quality checks)
 * - Task 7: End-to-end multi-account lifecycle (Kavya, Aarav, Meera, Rohan, Tara, Vikram)
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  auditPilotQuestionBank,
  PILOT_60_QUESTION_BANK,
} from '../data/pilotQuestionBank';
import {
  authorizeRawAnswerAccess,
  computeAttributeSimilarity,
  deriveConstructProfileFromAnswers,
  determineDominantArchetypes,
  evaluateMemberPairwiseMatch,
  evaluateMemberStagedPattern,
  evaluateMutualEligibility,
  evaluateResponseQuality,
  evaluateWeBalanceEachOther,
  filterProfilesByFullSimilaritySpectrum,
  getMemberFacingLensLabel,
  LENS_DISPLAY_MAP,
  MIN_COMPARABLE_CONSTRUCTS_FOR_SCORE,
  PSYCHOLOGY_ENGINE_VERSION,
  scoreShuffledResponseOption,
  shuffleQuestionOptionsDeterministically,
} from './psychologyEngine';
import { memberStore } from './memberStore';
import { ConstructVectorPoint } from '../types/kithra';

// ============================================================================
// TASK 1: FEATURE AUDIT & ARCHITECTURE VERIFICATION
// ============================================================================

test('Task 1 - Psychology Engine Architecture & Versioning', () => {
  assert.equal(PSYCHOLOGY_ENGINE_VERSION, '2026.11-psych-v2.0-deterministic');
  assert.equal(MIN_COMPARABLE_CONSTRUCTS_FOR_SCORE, 2);

  // User-facing discovery lens names
  assert.equal(getMemberFacingLensLabel('echo'), 'Similar to Me');
  assert.equal(getMemberFacingLensLabel('counterpoint'), 'Different from Me');
  assert.equal(getMemberFacingLensLabel('mosaic'), 'We Balance Each Other');

  // Verify display descriptor metadata
  assert.equal(LENS_DISPLAY_MAP.echo.memberFacingName, 'Similar to Me');
  assert.equal(LENS_DISPLAY_MAP.counterpoint.memberFacingName, 'Different from Me');
  assert.equal(LENS_DISPLAY_MAP.mosaic.memberFacingName, 'We Balance Each Other');
});

// ============================================================================
// TASK 2: REAL MEMBER ASSESSMENTS & DPDP ACT 2023 COMPLIANCE
// ============================================================================

test('Task 2.1 - Save and Resume: Real Member Assessment Answers Persist and Update Vectors', () => {
  memberStore.resetStoreToDefaults();

  const activeMember = memberStore.getActiveMember();
  assert.equal(activeMember.id, 'member-kavya');

  // Retrieve current answers using self-authorization
  const initialAnswers = memberStore.getMemberRawAnswers(
    'member-kavya',
    'member_self',
    'member-kavya'
  );
  assert.equal(Object.keys(initialAnswers).length, 25);
  assert.equal(initialAnswers['q-pace'], 'opt-slow');

  // Member updates an answer (e.g. changes pace to daytime coffee)
  const result = memberStore.saveMemberAnswer(
    'member-kavya',
    'q-pace',
    'opt-early-call',
    4200
  );

  assert.ok(result.constructProfile.length > 0);
  assert.equal(result.quality.qualityState, 'valid_high_confidence');

  // Verify answer is updated persistently in store
  const updatedAnswers = memberStore.getMemberRawAnswers(
    'member-kavya',
    'member_self',
    'member-kavya'
  );
  assert.equal(updatedAnswers['q-pace'], 'opt-early-call');

  // Verify continuous construct profile was updated dynamically
  const commConstruct = result.constructProfile.find(
    (c) => c.constructId === 'communication'
  );
  assert.ok(commConstruct);
  assert.ok(commConstruct.score > 0);
});

test('Task 2.2 - Staged Pattern Guardrails: < 5, 5-14, 15-29, 30+ Questions', () => {
  const dummyConstructs: ConstructVectorPoint[] = [
    {
      constructId: 'communication',
      constructName: 'Communication Cadence',
      score: 80,
      itemCount: 4,
      answeredItemCount: 4,
      confidence: 0.8,
      flexibility: 75,
      welcomesComplementarity: true,
    },
    {
      constructId: 'conflict_repair',
      constructName: 'Conflict & Repair Style',
      score: 85,
      itemCount: 4,
      answeredItemCount: 4,
      confidence: 0.8,
      flexibility: 80,
      welcomesComplementarity: true,
    },
  ];

  // Stage 0: 3 answers -> insufficient for pattern
  const stage0 = evaluateMemberStagedPattern(3, dummyConstructs);
  assert.equal(stage0.stage, 1);
  assert.equal(stage0.confidenceBand, 'insufficient_for_pattern');
  assert.equal(stage0.assignedPrimaryArchetype, null);
  assert.equal(stage0.assignedSecondaryArchetype, null);

  // Stage 1: 5 answers -> early provisional note, explicitly NO personality type!
  const stage1 = evaluateMemberStagedPattern(5, dummyConstructs);
  assert.equal(stage1.stage, 1);
  assert.equal(stage1.confidenceBand, 'provisional_early_note');
  assert.equal(stage1.assignedPrimaryArchetype, null);
  assert.equal(stage1.assignedSecondaryArchetype, null);
  assert.match(stage1.provisionalNotice, /5 questions cannot assign a fixed personality type/i);

  // Stage 2: 18 answers -> developing experimental pattern
  const stage2 = evaluateMemberStagedPattern(18, dummyConstructs);
  assert.equal(stage2.stage, 2);
  assert.equal(stage2.confidenceBand, 'developing_pattern');
  assert.ok(stage2.assignedPrimaryArchetype !== null);
  assert.ok(stage2.assignedSecondaryArchetype !== null);
  assert.match(stage2.provisionalNotice, /developing experimental pattern/i);

  // Stage 3: 35 answers -> established experimental pattern
  const stage3 = evaluateMemberStagedPattern(35, dummyConstructs);
  assert.equal(stage3.stage, 3);
  assert.equal(stage3.confidenceBand, 'established_experimental_pattern');
  assert.ok(stage3.assignedPrimaryArchetype !== null);
  assert.match(stage3.provisionalNotice, /continuous dimensions for all similarity/i);
});

test('Task 2.3 - Section 27 DPDP Act 2023 Consent Withdrawal and Data Deletion', () => {
  memberStore.resetStoreToDefaults();

  // Verify member initially has answers
  const initialAnswers = memberStore.getMemberRawAnswers(
    'member-kavya',
    'member_self',
    'member-kavya'
  );
  assert.ok(Object.keys(initialAnswers).length > 0);

  // Execute DPDP Act 2023 deletion
  const deletionResult = memberStore.deleteMemberAssessmentData('member-kavya');
  assert.equal(deletionResult.success, true);
  assert.equal(deletionResult.rawAnswersRemaining, 0);
  assert.equal(deletionResult.derivedVectorsCleared, true);
  assert.equal(deletionResult.pairwiseCacheInvalidated, true);

  // Verify raw answers store is empty
  const answersAfter = memberStore.getMemberRawAnswers(
    'member-kavya',
    'member_self',
    'member-kavya'
  );
  assert.equal(Object.keys(answersAfter).length, 0);

  // Verify profile vectors and archetypes are cleared
  const profileAfter = memberStore.getMemberById('member-kavya');
  assert.deepEqual(profileAfter?.constructProfile, []);
  assert.equal(profileAfter?.experimentalPrimaryPattern, undefined);
  assert.equal(profileAfter?.attributeSimilarityScore, null);
});

// ============================================================================
// TASK 3: CONNECT REAL MATCHING ENGINE (DYNAMIC SCORES & HARD CONFLICTS)
// ============================================================================

test('Task 3.1 - Dynamic Pairwise Scoring: Member A (Kavya) vs Member B (Aarav)', () => {
  memberStore.resetStoreToDefaults();

  const kavya = memberStore.getMemberById('member-kavya')!;
  const aarav = memberStore.getMemberById('member-aarav')!;

  const match = evaluateMemberPairwiseMatch(kavya, aarav, 'friendship');

  assert.equal(match.eligibility.eligible, true);
  assert.equal(match.similarity.status, 'computed');

  // Verify score is NOT hardcoded: it is calculated directly from their construct vectors
  const expectedSim = computeAttributeSimilarity(
    kavya.constructProfile!,
    aarav.constructProfile!,
    'friendship'
  );
  assert.equal(match.dynamicSimilarityScore, expectedSim.score);
  assert.ok(match.dynamicSimilarityScore! >= 80, 'Kavya and Aarav share high values and pace');

  // Verify lens summaries are populated dynamically
  assert.ok(match.sharedGroundSummary.length > 0);
  assert.ok(match.whyThisMatchExplanation.includes('attribute similarity'));
});

test('Task 3.2 - Hard Relationship Conflict Enforcement: Member A (Kavya) vs Member D (Rohan)', () => {
  memberStore.resetStoreToDefaults();

  const kavya = memberStore.getMemberById('member-kavya')!;
  const rohan = memberStore.getMemberById('member-rohan')!;

  // 1. FRIENDSHIP INTENTION:
  // Friendship does NOT inherit romantic monogamy requirements.
  // Kavya and Rohan SHOULD be ELIGIBLE for Friendship!
  const friendshipMatch = evaluateMemberPairwiseMatch(kavya, rohan, 'friendship');
  assert.equal(friendshipMatch.eligibility.eligible, true);
  assert.ok(
    friendshipMatch.dynamicSimilarityScore !== null &&
    friendshipMatch.dynamicSimilarityScore > 0,
    'Friendship dynamic score is computed'
  );

  // 2. DATING INTENTION:
  // Kavya requires exclusivity (`exclusive_required`).
  // Rohan requires open relationship (`open_required`).
  // Dating MUST be strictly INELIGIBLE due to non-negotiable conflict!
  const datingMatch = evaluateMemberPairwiseMatch(kavya, rohan, 'dating');
  assert.equal(datingMatch.eligibility.eligible, false);
  assert.equal(
    datingMatch.eligibility.status,
    'ineligible_hard_requirement_conflict'
  );
  assert.ok(
    datingMatch.eligibility.reasons.includes('incompatible_relationship_structure')
  );
  assert.match(
    datingMatch.whyThisMatchExplanation,
    /stated essential relationship preferences differ/i
  );

  // 3. Dynamic Candidate Discovery: Rohan must appear in Friendship discovery, but NOT in Dating discovery!
  const friendshipCandidates = memberStore.getDynamicMatchesForActiveMember(
    'member-kavya',
    'friendship'
  );
  assert.ok(
    friendshipCandidates.some((c) => c.id === 'member-rohan'),
    'Rohan appears in Friendship candidates'
  );

  const datingCandidates = memberStore.getDynamicMatchesForActiveMember(
    'member-kavya',
    'dating'
  );
  assert.ok(
    !datingCandidates.some((c) => c.id === 'member-rohan'),
    'Rohan is filtered out of Dating candidates due to hard structure conflict'
  );
});

test('Task 3.3 - Unknown Non-Negotiables: Pending Clarification without False Rejection', () => {
  const viewer = {
    memberId: 'v1',
    isAdultVerified: true,
    enabledIntentions: ['dating'] as any,
    discoverableInIntentions: ['dating'] as any,
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required' as any,
    childrenPreference: 'wants_children' as any,
    childrenRequirementLevel: 'essential' as any,
  };

  const candidateWithUnknown = {
    memberId: 'c1',
    isAdultVerified: true,
    enabledIntentions: ['dating'] as any,
    discoverableInIntentions: ['dating'] as any,
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required' as any,
    childrenPreference: 'unknown' as any, // Unanswered preference
  };

  const result = evaluateMutualEligibility(
    viewer,
    candidateWithUnknown,
    'c1',
    'v1',
    'dating'
  );

  // Must NOT falsely reject
  assert.equal(result.eligible, true);
  assert.equal(result.status, 'clarification_needed_unknown_requirement');
  assert.equal(result.hasUnknownNonNegotiables, true);
  assert.ok(result.unknownFieldsRequiringClarification.includes('children_preference'));
});

// ============================================================================
// TASK 4: VERIFY 60-QUESTION PILOT BANK
// ============================================================================

test('Task 4.1 - Programmatic Audit of 60-Question Pilot Bank via auditPilotQuestionBank', () => {
  const audit = auditPilotQuestionBank(PILOT_60_QUESTION_BANK);

  assert.equal(audit.totalQuestions, 60);
  assert.equal(audit.allHaveUniqueSemanticIds, true);
  assert.equal(audit.allHaveThreeLanguages, true);
  assert.equal(audit.allMarkedOriginalUnvalidated, true);
  assert.equal(audit.duplicatePromptsFound, 0);

  // All 12 construct layers covered
  const constructKeys = Object.keys(audit.constructCoverage);
  assert.ok(constructKeys.length >= 10, 'Broad coverage across life domains');
  assert.ok(audit.constructCoverage['communication'] >= 3);
  assert.ok(audit.constructCoverage['conflict_repair'] >= 3);
  assert.ok(audit.constructCoverage['personal_values'] >= 3);
  assert.ok(audit.constructCoverage['daily_lifestyle'] >= 3);

  // Multi-stage distribution: 10 starter, 21 developing, 29 deep reflections = 60 total
  assert.equal(audit.stageCounts[1], 10);
  assert.equal(audit.stageCounts[2], 21);
  assert.equal(audit.stageCounts[3], 29);
  assert.equal(audit.stageCounts[1] + audit.stageCounts[2] + audit.stageCounts[3], 60);

  // 7 question formats present
  assert.ok(audit.formatCounts['direct_preference'] > 0);
  assert.ok(audit.formatCounts['situational_judgment'] > 0);
  assert.ok(audit.formatCounts['contextual_trait'] > 0);
  assert.ok(audit.formatCounts['values_tradeoff'] > 0);
  assert.ok(audit.formatCounts['forced_choice'] > 0);
  assert.ok(audit.formatCounts['importance_boundary'] > 0);
  assert.ok(audit.formatCounts['optional_reflection'] > 0);
});

test('Task 4.2 - Option Randomization Preserves Semantic Value Across Shuffles', () => {
  const item = PILOT_60_QUESTION_BANK[0];
  const shuffledA = shuffleQuestionOptionsDeterministically(item.options, 'seed-client-user-1');
  const shuffledB = shuffleQuestionOptionsDeterministically(item.options, 'seed-client-user-2');

  const selectedOpt = item.options[0];

  const scoreA = scoreShuffledResponseOption(shuffledA, selectedOpt.id);
  const scoreB = scoreShuffledResponseOption(shuffledB, selectedOpt.id);

  assert.equal(scoreA.semanticOptionId, selectedOpt.semanticId);
  assert.equal(scoreB.semanticOptionId, selectedOpt.semanticId);
  assert.equal(scoreA.normalizedValue, scoreB.normalizedValue);
  assert.equal(scoreA.normalizedValue, selectedOpt.normalizedValue);
});

// ============================================================================
// TASK 5: VERIFY 0–100 SCORE FIDELITY & EDGE CASES
// ============================================================================

test('Task 5.1 - Identical Attributes Yield Exact 100/100', () => {
  const constructs: ConstructVectorPoint[] = [
    {
      constructId: 'communication',
      constructName: 'Communication',
      score: 85,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 80,
    },
    {
      constructId: 'personal_values',
      constructName: 'Personal Values',
      score: 90,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 85,
    },
    {
      constructId: 'conflict_repair',
      constructName: 'Conflict Repair',
      score: 75,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 80,
    },
  ];

  const sim = computeAttributeSimilarity(constructs, constructs, 'friendship');
  assert.equal(sim.status, 'computed');
  assert.equal(sim.score, 100);
  assert.equal(sim.bandCategory, 'Strong measured alignment');
});

test('Task 5.2 - Substantially Divergent Attributes Yield Score < 30 (Without Hiding)', () => {
  const constructsA: ConstructVectorPoint[] = [
    {
      constructId: 'communication',
      constructName: 'Communication',
      score: 15,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 60,
    },
    {
      constructId: 'personal_values',
      constructName: 'Personal Values',
      score: 10,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 60,
    },
    {
      constructId: 'daily_lifestyle',
      constructName: 'Lifestyle',
      score: 20,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 60,
    },
  ];

  const constructsB: ConstructVectorPoint[] = [
    {
      constructId: 'communication',
      constructName: 'Communication',
      score: 95,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 60,
    },
    {
      constructId: 'personal_values',
      constructName: 'Personal Values',
      score: 90,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 60,
    },
    {
      constructId: 'daily_lifestyle',
      constructName: 'Lifestyle',
      score: 85,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 60,
    },
  ];

  const sim = computeAttributeSimilarity(constructsA, constructsB, 'friendship');
  assert.equal(sim.status, 'computed');
  assert.ok(sim.score! < 30, `Score is ${sim.score}, expected < 30`);
  assert.ok(sim.score! >= 0, 'Score is never negative');
});

test('Task 5.3 - Insufficient Comparable Answers Returns score: null (insufficient_information)', () => {
  memberStore.resetStoreToDefaults();

  const kavya = memberStore.getMemberById('member-kavya')!;
  const tara = memberStore.getMemberById('member-tara')!; // Only 1 question answered

  const match = evaluateMemberPairwiseMatch(kavya, tara, 'friendship');

  assert.equal(match.eligibility.eligible, true);
  assert.equal(match.similarity.status, 'insufficient_information');
  assert.equal(match.dynamicSimilarityScore, null);
  assert.notEqual(match.dynamicSimilarityScore, 0); // Never 0/100
  assert.match(
    match.whyThisMatchExplanation,
    /Not enough overlapping questions have been answered yet/i
  );
});

test('Task 5.4 - Complementarity (We Balance Each Other): Never Rewards Coercion', () => {
  const viewerConstructs: ConstructVectorPoint[] = [
    {
      constructId: 'autonomy_boundaries',
      constructName: 'Personal Space & Boundaries',
      score: 20,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 50,
      welcomesComplementarity: true,
    },
  ];
  const candidateConstructs: ConstructVectorPoint[] = [
    {
      constructId: 'autonomy_boundaries',
      constructName: 'Personal Space & Boundaries',
      score: 80,
      itemCount: 5,
      answeredItemCount: 5,
      confidence: 1.0,
      flexibility: 50,
      welcomesComplementarity: true,
    },
  ];

  // If flagged with boundary violation or coercion
  const comp = evaluateWeBalanceEachOther(viewerConstructs, candidateConstructs, {
    involvesCoercionOrBoundaryViolation: true,
  });

  assert.equal(comp.status, 'blocked_by_boundary_protection');
  assert.equal(comp.qualifiesForWeBalanceEachOther, false);
  assert.equal(comp.score, 0);
  assert.match(
    comp.explanation,
    /never counts boundary violations or disrespect as a complementary match/i
  );
});

// ============================================================================
// TASK 6: PRIVACY & ADMIN SECURITY INTEGRATION
// ============================================================================

test('Task 6.1 - Server-Side Authorization: Admin/Moderator Access to Raw Answers Is Strictly Denied', () => {
  // 1. Member self access is allowed
  const selfAccess = authorizeRawAnswerAccess({
    requesterRole: 'member_self',
    requesterId: 'member-kavya',
    targetMemberId: 'member-kavya',
  });
  assert.equal(selfAccess.allowed, true);

  // 2. Other member access is denied
  const otherMemberAccess = authorizeRawAnswerAccess({
    requesterRole: 'member',
    requesterId: 'member-aarav',
    targetMemberId: 'member-kavya',
  });
  assert.equal(otherMemberAccess.allowed, false);
  assert.match(otherMemberAccess.reason, /SERVER_SIDE_ACCESS_DENIED/);

  // 3. Moderator access is denied
  const modAccess = authorizeRawAnswerAccess({
    requesterRole: 'moderator',
    requesterId: 'mod-1',
    targetMemberId: 'member-kavya',
  });
  assert.equal(modAccess.allowed, false);

  // 4. Admin support access is denied
  const adminAccess = authorizeRawAnswerAccess({
    requesterRole: 'admin_support',
    requesterId: 'admin-1',
    targetMemberId: 'member-kavya',
  });
  assert.equal(adminAccess.allowed, false);

  // 5. Superadmin access is denied
  const superAccess = authorizeRawAnswerAccess({
    requesterRole: 'superadmin',
    requesterId: 'root-1',
    targetMemberId: 'member-kavya',
  });
  assert.equal(superAccess.allowed, false);

  // 6. Direct store call throws error when unauthorized role attempts access
  assert.throws(
    () => {
      memberStore.getMemberRawAnswers('member-kavya', 'moderator', 'mod-1');
    },
    /SERVER_SIDE_ACCESS_DENIED/
  );
});

test('Task 6.2 - Non-Accusatory Quality Evaluation: Fast Uniform Clicking Lowers Confidence Without Suspension', () => {
  const uniformResponses = Array.from({ length: 15 }, (_, i) => ({
    questionId: `q-${i}`,
    displayedOptionIndex: 0, // Clicked identical visual button 0 every time
    semanticOptionId: `sem-opt-${i}`,
    responseTimeMs: 350, // 350ms ultra fast
  }));

  const quality = evaluateResponseQuality('sess-test-careless', uniformResponses);

  assert.equal(quality.qualityState, 'low_confidence_validity');
  assert.equal(quality.automaticSuspensionTriggered, false);
  assert.equal(quality.deceptionAccusationIssued, false);
  assert.equal(quality.isAccusedOfDishonesty, false);
  assert.equal(quality.isBlockedOrSuspended, false);
  assert.match(
    quality.neutralMemberPrompt ?? '',
    /completed very quickly/i
  );
});

// ============================================================================
// TASK 7: MULTI-ACCOUNT END-TO-END FLOW
// ============================================================================

test('Task 7 - Multi-Account Lifecycle & Dynamic Perspective Shift', () => {
  memberStore.resetStoreToDefaults();

  // Log in as Member A (Kavya)
  memberStore.setActiveMemberId('member-kavya');
  assert.equal(memberStore.getActiveMember().name, 'Kavya Sundaram');

  // Discover candidates from Kavya's perspective
  const kavyaMatches = memberStore.getDynamicMatchesForActiveMember('member-kavya', 'all');
  assert.ok(kavyaMatches.length >= 4);

  const aaravFromKavya = kavyaMatches.find((m) => m.id === 'member-aarav');
  assert.ok(aaravFromKavya);
  assert.ok(aaravFromKavya.attributeSimilarityScore! >= 80);

  // Log in as Member B (Aarav)
  memberStore.setActiveMemberId('member-aarav');
  assert.equal(memberStore.getActiveMember().name, 'Aarav Iyer');

  // Discover candidates from Aarav's perspective
  const aaravMatches = memberStore.getDynamicMatchesForActiveMember('member-aarav', 'all');
  const kavyaFromAarav = aaravMatches.find((m) => m.id === 'member-kavya');
  assert.ok(kavyaFromAarav);
  // Deterministic reciprocity: Aarav seeing Kavya gets the same attribute similarity score
  assert.equal(kavyaFromAarav.attributeSimilarityScore, aaravFromKavya.attributeSimilarityScore);
});
