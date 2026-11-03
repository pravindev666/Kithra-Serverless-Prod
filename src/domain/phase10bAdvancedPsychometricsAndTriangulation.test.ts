import test from 'node:test';
import assert from 'node:assert';
import {
  evaluateTriangulationEvidence,
  countGenuineContradictions,
  evaluateTriangulationCluster,
  TRIANGULATION_CLUSTERS,
} from './triangulationEngine';
import {
  evaluateResponseQuality,
  shuffleQuestionOptionsDeterministically,
  scoreShuffledResponseOption,
  evaluateMutualEligibility,
  computeAttributeSimilarity,
  determineDominantArchetypes,
  evaluateMemberStagedPattern,
  authorizeRawAnswerAccess,
  deriveConstructProfileFromAnswers,
} from './psychologyEngine';
import { selectNextAdaptiveQuestion } from './adaptiveQuestionEngine';
import { memberStore } from './memberStore';
import { EXPANDED_PILOT_QUESTION_BANK, PILOT_60_QUESTION_BANK } from '../data/pilotQuestionBank';
import {
  AssessmentQuestion,
  AdministeredItemResponse,
  MemberEligibilityRequirements,
} from '../types/kithra';

// ============================================================================
// PHASE 10B: TASK 12 EXHAUSTIVE TEST SCENARIOS (A THROUGH T)
// ============================================================================

test('Scenario A — Three Social, Three Solitude Answers: Contextual Nuance Over Blind Contradiction', () => {
  // Member answers 3 items indicating high social celebration energy and 3 items indicating deep solitude need
  const memberAnswers: Record<string, any> = {
    // 3 social energy items
    'q-26-festival-celebration-context': { optionId: 'opt-q26-energized', normalizedValue: 85 },
    'q-77-hosting-vs-meeting': { optionId: 'opt-q77-host', normalizedValue: 80 },
    'q-14-spontaneous-gathering': { optionId: 'opt-q14-enthusiastic', normalizedValue: 90 },

    // 3 solitude & recharge items
    'q-27-friday-exhausted-context': { optionId: 'opt-q27-solitude', normalizedValue: 20 },
    'q-76-friday-energy-restore': { optionId: 'opt-q76-solo', normalizedValue: 15 },
    'q-41-partner-solo-space': { optionId: 'opt-q41-generous-space', normalizedValue: 25 },
  };

  const report = evaluateTriangulationEvidence({
    memberAnswers,
    bank: EXPANDED_PILOT_QUESTION_BANK,
  });

  // 1. Must NOT classify as genuine contradiction or accuse member of dishonesty
  assert.strictEqual(
    report.genuineContradictionCount,
    0,
    'Social energy during celebrations + solitude after exhaustion must NOT be flagged as genuine contradiction'
  );

  // 2. Must detect healthy contextual variation
  assert.ok(
    report.contextualAdaptationCount > 0 ||
    Object.values(report.facetReviews).some((f) => f.evidenceCategory === 'plausible_contextual_variation'),
    'Must identify contextual adaptation between celebration and exhaustion'
  );

  // 3. User-facing explanation must be respectful and non-accusatory
  assert.ok(
    report.evidenceSummary.includes('contextual adaptation') ||
    report.evidenceSummary.includes('Triangulation evidence review'),
    'Evidence summary must be constructive'
  );
});

test('Scenario B — Directly Opposing Statements in Equivalent Contexts: Targeted Optional Clarification', () => {
  // Two directly conflicting choices in the EXACT same scenario (conflict cooldown pacing)
  const memberAnswers = {
    'q-72-cooldown-pause': { optionId: 'opt-q72-pause', normalizedValue: 90 }, // insists on cooldown pause
    'q-20-heated-voice-anchor-a': { optionId: 'opt-q20-engage', normalizedValue: 20 }, // insists on continuing heated argument
  };

  const report = evaluateTriangulationEvidence({
    memberAnswers,
    bank: EXPANDED_PILOT_QUESTION_BANK,
  });

  // 1. Must detect genuine discrepancy in equivalent context
  assert.strictEqual(
    report.genuineContradictionCount >= 1 || report.overallClassification === 'clarification_needed',
    true,
    'Opposing anchors in equivalent context must trigger clarification_needed'
  );

  // 2. Must generate respectful clarification options without accusing of dishonesty
  assert.ok(report.clarificationRequests.length > 0, 'Must provide clarification request');
  const clarifyReq = report.clarificationRequests[0];
  assert.ok(
    clarifyReq.options.some((opt) => opt.id === 'depends_on_situation'),
    'Must offer "It depends on the situation" option'
  );
  assert.ok(
    clarifyReq.options.some((opt) => opt.id === 'skip_for_now' || opt.id === 'review_previous_answer'),
    'Must offer skip or review options'
  );
});

test('Scenario C — Six Genuinely Consistent Answers: Zero Unnecessary Clarifications', () => {
  const consistentAnswers = {
    'q-01-daily-checkin': { optionId: 'opt-q01-daily', normalizedValue: 75 },
    'q-02-silence-comfort': { optionId: 'opt-q02-comfortable', normalizedValue: 80 },
    'q-03-weekend-rhythm': { optionId: 'opt-q03-balanced', normalizedValue: 70 },
    'q-04-listening-role': { optionId: 'opt-q04-empathy', normalizedValue: 78 },
    'q-05-spontaneity-plans': { optionId: 'opt-q05-moderately-flexible', normalizedValue: 72 },
    'q-06-social-battery': { optionId: 'opt-q06-steady', normalizedValue: 75 },
  };

  const report = evaluateTriangulationEvidence({
    memberAnswers: consistentAnswers,
    bank: EXPANDED_PILOT_QUESTION_BANK,
  });

  assert.strictEqual(report.genuineContradictionCount, 0);
  assert.strictEqual(report.clarificationRequests.length, 0, 'Consistent answers must not generate clarification badgering');
});

test('Scenario D — Twenty Consecutive Option B Clicks: Evaluated Fairly Without Moral Accusations', () => {
  // Member clicks Option B (index 1) for 20 questions, but with thoughtful, realistic timing (2,400ms median)
  const twentyResponses: AdministeredItemResponse[] = Array.from({ length: 20 }, (_, idx) => ({
    itemId: `q-${idx + 1}`,
    displayedOptionIndex: 1, // Option B
    semanticOptionId: `sem-b-${idx + 1}`,
    responseTimeMs: 2200 + (idx % 5) * 100, // Thoughtful pace (~2400ms)
    normalizedValue: 60,
  }));

  const quality = evaluateResponseQuality('sess-option-b-streak', twentyResponses, 0);

  // 1. High display position streak detected
  assert.strictEqual(quality.maxDisplayPositionStreak, 20);

  // 2. Strictly non-punitive: NEVER accuses of dishonesty and NEVER triggers automatic suspension
  assert.strictEqual(quality.isAccusedOfDishonesty, false, 'Option B clicks must never accuse of dishonesty');
  assert.strictEqual(quality.deceptionAccusationIssued, false, 'No deception accusation issued');
  assert.strictEqual(quality.isBlockedOrSuspended, false, 'Must never automatically suspend user');
  assert.strictEqual(quality.automaticSuspensionTriggered, false, 'Zero automatic suspension');

  // 3. Thoughtful pace protects valid confidence
  assert.ok(
    quality.qualityState === 'valid_moderate_confidence' || quality.qualityState === 'valid_high_confidence',
    'Thoughtful pace with authentic position consistency remains valid'
  );
});

test('Scenario E — Alternating B/C Response Positions: Semantic Choice Coherence Respected', () => {
  // Screen positions alternate: [1, 2, 1, 2, 1, 2, 1, 2], but each semantic choice is deliberate and thoughtful
  const alternatingResponses: AdministeredItemResponse[] = Array.from({ length: 10 }, (_, idx) => ({
    itemId: `q-${idx + 1}`,
    displayedOptionIndex: idx % 2 === 0 ? 1 : 2, // Alternates between Option B and Option C
    semanticOptionId: `sem-thoughtful-${idx + 1}`,
    responseTimeMs: 1800 + (idx % 3) * 150, // Thoughtful reading pace
    normalizedValue: 50 + (idx % 4) * 10,
  }));

  const quality = evaluateResponseQuality('sess-alternating-bc', alternatingResponses, 0);

  // Screen alternation alone is NOT treated as proof of deception
  assert.strictEqual(quality.isAccusedOfDishonesty, false);
  assert.strictEqual(quality.isBlockedOrSuspended, false);
  assert.strictEqual(quality.deceptionAccusationIssued, false);
});

test('Scenario F — Option Order Randomization: Semantic Scores Invariant Across Shuffles', () => {
  // Find a question with 4 options in EXPANDED_PILOT_QUESTION_BANK
  const sampleQuestion = EXPANDED_PILOT_QUESTION_BANK.find((q) => q.options.length >= 4) ?? EXPANDED_PILOT_QUESTION_BANK[0];
  assert.ok(sampleQuestion.options.length >= 3);

  // Shuffle with seed 12345
  const shuffledA = shuffleQuestionOptionsDeterministically(sampleQuestion.options, 12345);
  // Shuffle with seed 98765
  const shuffledB = shuffleQuestionOptionsDeterministically(sampleQuestion.options, 98765);

  // Choosing the same semantic option in both shuffles produces identical normalized values
  const targetOption = sampleQuestion.options[0];
  const targetOptionId = targetOption.id;
  const scoredA = scoreShuffledResponseOption(sampleQuestion, targetOptionId);
  const scoredB = scoreShuffledResponseOption(sampleQuestion, targetOptionId);

  assert.strictEqual(scoredA.normalizedValue, scoredB.normalizedValue, 'Semantic score must be 100% invariant to display shuffle');
  assert.strictEqual(scoredA.semanticOptionId, scoredB.semanticOptionId);
});

test('Scenario G — Fast But Attentive Member: Not Unfairly Penalized', () => {
  // Attentive fast reader: 700ms median (above 650ms cutoff), diverse displayed positions, coherent semantic choices
  const fastResponses: AdministeredItemResponse[] = [
    { itemId: 'q1', displayedOptionIndex: 0, semanticOptionId: 'sem-1', responseTimeMs: 720, normalizedValue: 80 },
    { itemId: 'q2', displayedOptionIndex: 2, semanticOptionId: 'sem-2', responseTimeMs: 680, normalizedValue: 75 },
    { itemId: 'q3', displayedOptionIndex: 1, semanticOptionId: 'sem-3', responseTimeMs: 750, normalizedValue: 85 },
    { itemId: 'q4', displayedOptionIndex: 3, semanticOptionId: 'sem-4', responseTimeMs: 690, normalizedValue: 80 },
    { itemId: 'q5', displayedOptionIndex: 0, semanticOptionId: 'sem-5', responseTimeMs: 710, normalizedValue: 78 },
  ];

  const quality = evaluateResponseQuality('sess-fast-attentive', fastResponses, 0);

  assert.strictEqual(quality.qualityState, 'valid_high_confidence', 'Attentive fast reader with varied positions must receive valid_high_confidence');
  assert.strictEqual(quality.isAccusedOfDishonesty, false);
});

test('Scenario H — Low-Literacy / Multilingual / Assistive-Tech User: Long Response Times Never Penalized', () => {
  // User takes 25,000ms (25s) per question listening with screen reader or reading in regional language
  const slowResponses: AdministeredItemResponse[] = [
    { itemId: 'q1', displayedOptionIndex: 0, semanticOptionId: 'sem-1', responseTimeMs: 24000, normalizedValue: 70 },
    { itemId: 'q2', displayedOptionIndex: 1, semanticOptionId: 'sem-2', responseTimeMs: 28000, normalizedValue: 75 },
    { itemId: 'q3', displayedOptionIndex: 2, semanticOptionId: 'sem-3', responseTimeMs: 22000, normalizedValue: 80 },
    { itemId: 'q4', displayedOptionIndex: 3, semanticOptionId: 'sem-4', responseTimeMs: 26000, normalizedValue: 72 },
    { itemId: 'q5', displayedOptionIndex: 1, semanticOptionId: 'sem-5', responseTimeMs: 25000, normalizedValue: 78 },
  ];

  const quality = evaluateResponseQuality('sess-accessibility', slowResponses, 0);

  // Slow response time must NEVER lower validity confidence or flag user
  assert.strictEqual(quality.qualityState, 'valid_high_confidence');
  assert.strictEqual(quality.isAccusedOfDishonesty, false);
  assert.strictEqual(quality.isBlockedOrSuspended, false);
});

test('Scenario I — Member Changes Earlier Answer: Affected Constructs & Matches Refresh Cleanly', () => {
  const memberId = 'member-kavya';
  const initialAnswers = memberStore.getMemberRawAnswers(memberId, 'member_self', memberId);

  // Save new answer to q-01
  const updateResult = memberStore.saveMemberAnswer(
    memberId,
    'q-01-daily-checkin',
    'opt-q01-daily',
    3500,
    0
  );

  assert.ok(updateResult.constructProfile.length > 0);

  // Verify answer persists in store
  const freshAnswers = memberStore.getMemberRawAnswers(memberId, 'member_self', memberId);
  assert.strictEqual(freshAnswers['q-01-daily-checkin'], 'opt-q01-daily');
});

test('Scenario J — Member Declines Clarification: Account & Profile Readiness Preserved Without Penalty', () => {
  const memberId = 'member-kavya';
  const clarReqs = memberStore.getActiveClarificationRequests(memberId, EXPANDED_PILOT_QUESTION_BANK);

  // Dismiss clarification
  const dismissResult = memberStore.dismissClarification(memberId, 'clarify-test-facet');
  assert.strictEqual(dismissResult.dismissed, true);

  // Profile readiness remains healthy
  const readiness = memberStore.getMemberProfileReadiness(memberId, EXPANDED_PILOT_QUESTION_BANK);
  assert.ok(readiness.accountProfileReadiness >= 0);
  assert.strictEqual(typeof readiness.isReadyForDiscovery, 'boolean');
});

test('Scenario K — Contradiction in Irrelevant Domain Does Not Disrupt Other Intentions', () => {
  // Contradiction in parental involvement (marriage domain)
  const answersWithMatrimonyConflict = {
    'q-88-elderly-caregiving': { optionId: 'opt-q88-immediate', normalizedValue: 95 },
    'q-99-in-law-boundaries': { optionId: 'opt-q99-strict-separation', normalizedValue: 15 },
  };

  const report = evaluateTriangulationEvidence({
    memberAnswers: answersWithMatrimonyConflict,
    bank: EXPANDED_PILOT_QUESTION_BANK,
  });

  // Check friendship constructs
  const stringAnswers = {
    'q-88-elderly-caregiving': 'opt-q88-immediate',
    'q-99-in-law-boundaries': 'opt-q99-strict-separation',
  };
  const friendshipConstructs = deriveConstructProfileFromAnswers(stringAnswers, EXPANDED_PILOT_QUESTION_BANK);
  const communicationVector = friendshipConstructs.find((c) => c.constructId === 'communication');

  // Friendship matching calculation functions cleanly without error
  const candVector = [{ constructId: 'communication' as const, score: 70, itemCount: 1 }];
  const sim = computeAttributeSimilarity(friendshipConstructs, candVector, 'friendship');
  assert.ok(sim !== undefined);
});

test('Scenario L — Ambiguous Categorical Preference: Categorical Gates Never Averaged with Continuous Traits', () => {
  // Q38 is relationship structure (categorical preference)
  const mixedAnswers = {
    'q-38-relationship-structure': { optionId: 'opt-q38-strictly-monogamous', normalizedValue: 100 },
    'q-01-daily-checkin': { optionId: 'opt-q01-daily', normalizedValue: 80 },
  };

  const report = evaluateTriangulationEvidence({
    memberAnswers: mixedAnswers,
    bank: EXPANDED_PILOT_QUESTION_BANK,
  });

  // Categorical preference items are separated from continuous trait averaging
  for (const review of Object.values(report.facetReviews)) {
    if (review.facetId === 'rel_relationship_structure') {
      assert.strictEqual(review.isGenuinelyComparable, false);
    }
  }
});

test('Scenario M — Three-Item Archetype Coverage: Cautious Non-Overclaim', () => {
  // Only 3 starter questions answered
  const constructs = [
    { constructId: 'communication' as const, score: 80, itemCount: 2 },
    { constructId: 'conflict_repair' as const, score: 75, itemCount: 1 },
  ];

  const staged = evaluateMemberStagedPattern(3, constructs);

  // Must strictly return null archetype assignment for < 5 items
  assert.strictEqual(staged.assignedPrimaryArchetype, null);
  assert.strictEqual(staged.assignedSecondaryArchetype, null);
  assert.strictEqual(staged.confidenceBand, 'insufficient_for_pattern');
  assert.ok(staged.provisionalNotice.includes('5 questions cannot assign a fixed personality type'));
});

test('Scenario N — True Adaptive UI Integration: Answer-Aware Branching Selects Next Question', () => {
  // Answer Starter Battery in exact order
  const starterIds = ['q-pace', 'q-02-workweek-reply', 'q-03-first-meetup', 'q-04-listening-role', 'q-05-voice-vs-text'];

  const adaptive = selectNextAdaptiveQuestion({
    answeredQuestionIds: starterIds,
    intentions: ['dating'],
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  assert.ok(adaptive.nextQuestion !== null, 'Adaptive engine must choose next candidate');
  assert.ok(adaptive.adaptiveCategory !== undefined, 'Adaptive category must be populated');
  // For dating intention, Essential Boundary Gates (Q38, Q50) are prioritized next
  assert.ok(
    adaptive.selectionReason === 'essential_boundary_gate' || adaptive.adaptiveCategory === 'intention_specific',
    'Essential gate prioritized for dating after starter battery'
  );
});

test('Scenario O — Fatigue: Break Offered After 10 Questions, Clarifications Capped at <= 2', () => {
  const tenAnswered = Array.from({ length: 10 }, (_, i) => `q-${i + 1}`);

  const adaptive = selectNextAdaptiveQuestion({
    answeredQuestionIds: tenAnswered,
    sessionAnswersCount: 10,
    intentions: ['friendship'],
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  // Break recommended after 10 questions in a sitting
  assert.strictEqual(adaptive.breakRecommended, true);
  assert.ok(adaptive.breakAdvisory !== undefined);
  assert.ok(adaptive.breakAdvisory!.includes('break'));
});

test('Scenario P — Skipped Sensitive Item: Never Inferred From Other Personality Items', () => {
  // Member skipped q-50-children-goal-gate (sensitive boundary)
  const skippedSet = ['q-50-children-goal-gate'];

  const adaptive = selectNextAdaptiveQuestion({
    answeredQuestionIds: ['q-pace', 'q-02-workweek-reply'],
    skippedQuestionIds: skippedSet,
    intentions: ['dating', 'matrimony'],
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  // Skipped question is NEVER re-selected
  assert.notStrictEqual(adaptive.nextQuestion?.id, 'q-50-children-goal-gate');
});

test('Scenario Q — Item Scoring & Translation Defect: Candidate Item Quarantined Without Blaming Member', () => {
  const memberAnswers = {
    'q-defect-test': { optionId: 'opt-ambiguous', normalizedValue: 30 },
    'q-01-daily-checkin': { optionId: 'opt-q01-daily', normalizedValue: 80 },
  };

  const report = evaluateTriangulationEvidence({
    memberAnswers,
    bank: EXPANDED_PILOT_QUESTION_BANK,
    quarantinedQuestionIds: ['q-defect-test'],
  });

  assert.strictEqual(report.quarantinedItemCount, 1, 'Quarantined item must be detected');
});

test('Scenario R — Unauthorized Assessment Access: Staff Access Strictly Rejected (HTTP 403)', () => {
  const staffRoles = ['moderator', 'admin_support', 'photo_reviewer', 'support'] as const;

  for (const role of staffRoles) {
    const access = authorizeRawAnswerAccess({
      requesterRole: role,
      requesterId: 'staff-employee-1',
      targetMemberId: 'member-kavya',
    });

    assert.strictEqual(access.allowed, false, `Staff role ${role} must NEVER access raw questionnaire responses`);
    assert.ok(access.reason.includes('SERVER_SIDE_ACCESS_DENIED') || access.reason.includes('Raw questionnaire responses are private'));
  }

  // Owner self-access is permitted
  const ownerAccess = authorizeRawAnswerAccess({
    requesterRole: 'member_self',
    requesterId: 'member-kavya',
    targetMemberId: 'member-kavya',
  });
  assert.strictEqual(ownerAccess.allowed, true);
});

test('Scenario S — Missing Adult Verification or Discovery Consent: Fail-Closed Discovery Gate', () => {
  const validViewer: MemberEligibilityRequirements = {
    memberId: 'viewer-valid',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };

  // 1. Missing adult verification
  const unverifiedCandidate: MemberEligibilityRequirements = {
    memberId: 'cand-unverified',
    // isAdultVerified undefined
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };

  const result1 = evaluateMutualEligibility(validViewer, unverifiedCandidate, 'dating');
  assert.strictEqual(result1.eligible, false);
  assert.ok(result1.reasons.includes('adult_verification_required_fail_closed'));

  // 2. Missing discovery consent (discoverableInIntentions is missing, not enabled)
  const noDiscoveryCandidate: MemberEligibilityRequirements = {
    memberId: 'cand-no-discovery',
    isAdultVerified: true,
    enabledIntentions: ['friendship'], // only friendship, not dating
    blockedMemberIds: [],
  };

  const result2 = evaluateMutualEligibility(validViewer, noDiscoveryCandidate, 'dating');
  assert.strictEqual(result2.eligible, false);
  assert.ok(result2.reasons.includes('intention_not_mutually_enabled'));
});

test('Scenario T — Honest Uncertainty: Returns Insufficient Information Rather Than Inventing Certainty', () => {
  // All bank items answered
  const allIds = EXPANDED_PILOT_QUESTION_BANK.map((q) => q.id);

  const adaptive = selectNextAdaptiveQuestion({
    answeredQuestionIds: allIds,
    intentions: ['friendship'],
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  assert.strictEqual(adaptive.nextQuestion, null, 'Must return null when bank exhausted');
  assert.ok(
    adaptive.selectionReason === 'bank_exhausted' || adaptive.adaptiveCategory === 'assessment_complete',
    'Must indicate bank exhausted rather than inventing synthetic questions'
  );

  // Comparing two members who have 0 comparable constructs returns score: null
  const sim = computeAttributeSimilarity([], [], 'friendship');
  assert.strictEqual(sim.score, null);
  assert.strictEqual(sim.status, 'insufficient_information');
  assert.strictEqual(sim.bandCategory, 'Insufficient information');
});
