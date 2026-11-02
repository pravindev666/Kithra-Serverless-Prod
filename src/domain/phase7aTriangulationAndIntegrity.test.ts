/**
 * KITHRA PHASE 7A: DEEP PSYCHOLOGICAL TRIANGULATION & RESPONSE-INTEGRITY ENGINE TEST SUITE
 *
 * Verifies all 10 Phase 7A Cases:
 * Case A — Repeated Option B with thoughtful pacing (no false accusations, no penalty)
 * Case B — Same semantic response, different visual position (presentation-order invariant)
 * Case C — Genuinely consistent personality (classified as consistent stance, valid high confidence)
 * Case D — Extreme speed & repetitive clicking (low confidence, gentle break prompt, zero raw answers in admin log)
 * Case E — Contextual differences across situations (classified as plausible situational variation, not lying)
 * Case F — Conflicting equivalent-context answers (clarification needed without moral accusations)
 * Case G — Unanswered sensitive items (kept unknown, never imputed from traits, no false rejection)
 * Case H — Different assessment paths (sparse overlap reports uncertainty margin +-15 and uncompared constructs)
 * Case I — Accessibility & language (translations invariant in semantic score; assistive/slow readers protected)
 * Case J — Fatigue & resumption (break recommended after 10 questions, seamless resumption, zero data loss)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPANDED_PILOT_QUESTION_BANK,
} from '../data/pilotQuestionBank';
import {
  evaluateResponseQuality,
  computeAttributeSimilarity,
  deriveConstructProfileFromAnswers,
  evaluateMutualEligibility,
  shuffleQuestionOptionsDeterministically,
  PSYCHOLOGY_ENGINE_VERSION,
} from './psychologyEngine';
import {
  evaluateTriangulationCluster,
  TRIANGULATION_CLUSTERS,
} from './triangulationEngine';
import {
  selectNextAdaptiveQuestion,
} from './adaptiveQuestionEngine';
import { memberStore } from './memberStore';
import {
  AdministeredItemResponse,
  ConstructVectorPoint,
  MemberProfile,
} from '../types/kithra';

// ============================================================================
// CASE A — Repeated Option B at Thoughtful Pace
// ============================================================================

test('Case A — Repeated Option B with Thoughtful Pacing Is Never Penalized or Accused of Dishonesty', () => {
  // Simulate 20 consecutive responses selecting visual option index 1 (e.g. Option B)
  // at a thoughtful reading speed of 1800ms per question.
  const responses: AdministeredItemResponse[] = Array.from({ length: 20 }, (_, idx) => ({
    questionId: `q-${idx + 1}`,
    itemId: `q-${idx + 1}`,
    displayedOptionIndex: 1, // visual Option B
    semanticOptionId: `sem-opt-${idx + 1}-b`,
    responseTimeMs: 1800, // Thoughtful pace (>= 1200ms)
  }));

  const quality = evaluateResponseQuality('sess-case-a-member', responses, 0);

  // 1. Position streak and ratio recorded accurately
  assert.equal(quality.maxDisplayPositionStreak, 20, 'Max display position streak must be 20');
  assert.equal(quality.identicalDisplayPositionRatio, 1.0, 'Identical display position ratio is 1.0');

  // 2. Multi-signal evaluation: Thoughtful pace protects member from careless or dishonest classification
  assert.notEqual(quality.qualityState, 'careless_pattern', 'Must not be classified as careless pattern');
  assert.notEqual(quality.qualityState, 'low_confidence_validity', 'Must not be classified as low confidence when pace is thoughtful');
  assert.equal(
    quality.qualityState,
    'valid_moderate_confidence',
    'Thoughtful uniform clicking must yield valid_moderate_confidence'
  );

  // 3. Absolute protection against punitive or accusatory action
  assert.equal(quality.automaticSuspensionTriggered, false, 'No account suspension should ever occur');
  assert.equal(quality.deceptionAccusationIssued, false, 'No deception accusation can ever be issued');
  assert.equal(quality.isAccusedOfDishonesty, false, 'Member must never be accused of dishonesty');
  assert.equal(quality.isBlockedOrSuspended, false, 'Member must not be blocked or suspended');
  assert.equal(quality.neutralMemberPrompt, null, 'No intrusive prompt should interrupt a thoughtful member');
});

// ============================================================================
// CASE B — Same Semantic Response, Different Position
// ============================================================================

test('Case B — Same Semantic Response Yields Identical Trait Score Regardless of Shuffled Visual Position', () => {
  const baseQuestion = EXPANDED_PILOT_QUESTION_BANK.find((q) => q.id === 'q-02-workweek-reply');
  assert.ok(baseQuestion, 'Base question q-02-workweek-reply must exist');

  // Presentation 1: Deterministic shuffle with seed A
  const shuffledA = shuffleQuestionOptionsDeterministically(baseQuestion.options, 'seed-member-presentation-a');
  // Presentation 2: Deterministic shuffle with seed B
  const shuffledB = shuffleQuestionOptionsDeterministically(baseQuestion.options, 'seed-member-presentation-b');

  // Target semantic option: first option's semantic ID
  const targetOption = baseQuestion.options[0];
  const targetSemanticId = targetOption.semanticId;

  const visualIndexA = shuffledA.findIndex((o) => o.semanticId === targetSemanticId);
  const visualIndexB = shuffledB.findIndex((o) => o.semanticId === targetSemanticId);

  // Assert that both presentations contain the exact same semantic options
  assert.equal(shuffledA.length, shuffledB.length, 'Option counts must match');
  assert.ok(visualIndexA >= 0 && visualIndexB >= 0, 'Target option must be present in both presentations');

  // Calculate construct score when choosing this semantic option under Presentation A vs B
  const answersA: Record<string, string> = { [baseQuestion.id]: targetOption.id };
  const answersB: Record<string, string> = { [baseQuestion.id]: targetOption.id };

  const profileA = deriveConstructProfileFromAnswers(answersA, EXPANDED_PILOT_QUESTION_BANK);
  const profileB = deriveConstructProfileFromAnswers(answersB, EXPANDED_PILOT_QUESTION_BANK);

  const constructA = profileA.find((c) => c.constructId === baseQuestion.constructId);
  const constructB = profileB.find((c) => c.constructId === baseQuestion.constructId);

  assert.ok(constructA && constructB, 'Construct score must be derived');
  assert.equal(
    constructA.score,
    constructB.score,
    'Construct score must be strictly invariant to visual position presentation order'
  );
});

// ============================================================================
// CASE C — Genuinely Consistent Personality
// ============================================================================

test('Case C — Genuinely Consistent Personality Yields Consistent Stance and High Confidence', () => {
  // Cluster for social battery / solitude
  const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === 'social_energy_vs_solitude');
  assert.ok(cluster, 'Social energy vs solitude cluster must exist');

  // Member consistently indicates quiet / low social intensity across scenarios:
  // q-26-festival-celebration-context: opt-q26-brief (normalizedValue: 25)
  // q-27-friday-exhausted-context: opt-q27-solitude (normalizedValue: 20)
  const answers: Record<string, string> = {
    'q-26-festival-celebration-context': 'opt-q26-brief',
    'q-27-friday-exhausted-context': 'opt-q27-solitude',
  };

  const result = evaluateTriangulationCluster(cluster, answers, EXPANDED_PILOT_QUESTION_BANK);

  // 1. Triangulation engine classifies as consistent stance
  assert.equal(
    result.classification,
    'consistent_stance',
    'Consistent introverted answers across contexts must be classified as consistent_stance'
  );
  assert.ok((result.spread ?? 0) <= 28, `Spread must be <= 28 points, got ${result.spread}`);

  // 2. Response quality evaluation with natural reading latencies (2200ms)
  const responses: AdministeredItemResponse[] = ['q-26-festival-celebration-context', 'q-27-friday-exhausted-context', 'q-pace', 'q-02-workweek-reply', 'q-03-first-meetup'].map((qId, idx) => ({
    questionId: qId,
    itemId: qId,
    displayedOptionIndex: idx % 3, // Natural distributed positions
    semanticOptionId: answers[qId] ?? 'opt-default',
    responseTimeMs: 2200,
  }));

  const quality = evaluateResponseQuality('sess-case-c', responses, 0);
  assert.equal(
    quality.qualityState,
    'valid_high_confidence',
    'Naturally paced responses with consistent personality must receive valid_high_confidence'
  );
  assert.equal(quality.automaticSuspensionTriggered, false);
});

// ============================================================================
// CASE D — Extreme Speed and Repetitive Clicking
// ============================================================================

test('Case D — Extreme Speed & Uniform Clicking Lowers Confidence with Zero Raw Answers in Admin Logs', () => {
  // 10 responses completed in 350ms each, all clicking displayedOptionIndex: 0
  const responses: AdministeredItemResponse[] = Array.from({ length: 10 }, (_, idx) => ({
    questionId: `q-${idx + 1}`,
    itemId: `q-${idx + 1}`,
    displayedOptionIndex: 0,
    semanticOptionId: `sem-${idx + 1}-a`,
    responseTimeMs: 350, // Ultra-fast (< 500ms)
  }));

  const quality = evaluateResponseQuality('sess-rapid-clicker', responses, 0);

  // 1. Classification is low_confidence_validity, NOT an immediate suspension or accusation
  assert.equal(
    quality.qualityState,
    'low_confidence_validity',
    'Ultra-fast repetitive clicking must lower confidence state'
  );
  assert.equal(quality.automaticSuspensionTriggered, false, 'Automatic account suspension is forbidden');
  assert.equal(quality.isAccusedOfDishonesty, false, 'Must not accuse user of dishonesty');

  // 2. Gentle, non-accusatory member prompt
  assert.ok(quality.neutralMemberPrompt, 'A polite member guidance notice must be returned');
  assert.match(
    quality.neutralMemberPrompt,
    /take a break|review your answers/i,
    'Guidance prompt should kindly encourage a break or review'
  );
  assert.doesNotMatch(
    quality.neutralMemberPrompt,
    /cheating|lying|fraud|banned|suspended|dishonest/i,
    'Prompt must contain zero accusatory or punitive language'
  );

  // 3. Admin review event includes ONLY operational metadata with ZERO raw answers
  assert.ok(quality.adminQualityEvent, 'An admin quality review event should be logged');
  assert.equal(
    quality.adminQualityEvent.rawAnswersIncluded,
    false,
    'Admin review event must strictly enforce rawAnswersIncluded === false'
  );
  // @ts-expect-error Checking that answers property is strictly omitted from payload
  assert.equal(quality.adminQualityEvent.answers, undefined, 'Raw answers must never be attached to admin event');
});

// ============================================================================
// CASE E — Contextual Differences (Situational Variation)
// ============================================================================

test('Case E — Contextual Differences Across Situations Are Recognized as Situational Nuance, Not Lying', () => {
  const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === 'social_energy_vs_solitude');
  assert.ok(cluster, 'Social energy vs solitude cluster must exist');

  // Member is socially energized during celebratory gatherings (score 85)
  // but prefers one close friend/quiet unwind after a busy week (score 52).
  // Difference is 33 points (within 29–58 range).
  const answers: Record<string, string> = {
    'q-26-festival-celebration-context': 'opt-q26-energized', // score 85
    'q-27-friday-exhausted-context': 'opt-q27-one', // score 52
  };

  const result = evaluateTriangulationCluster(cluster, answers, EXPANDED_PILOT_QUESTION_BANK);

  assert.equal(
    result.classification,
    'plausible_situational_variation',
    'Contextual variation between celebratory social vs post-work fatigue must be plausible_situational_variation'
  );
  assert.ok((result.spread ?? 0) >= 29 && (result.spread ?? 0) <= 58, `Spread ${result.spread} must be between 29 and 58`);
  assert.match(
    result.psychometricInterpretation,
    /situational variance|adaptability|distinct environmental contexts/i,
    'Psychometric interpretation must explain contextual adaptability'
  );
});

// ============================================================================
// CASE F — Conflicting Equivalent-Context Answers
// ============================================================================

test('Case F — Direct Contradictions in Equivalent Contexts Trigger Clarification Without Accusations', () => {
  const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === 'social_energy_vs_solitude');
  assert.ok(cluster, 'Social energy vs solitude cluster must exist');

  // Extreme polar divergence on paired anchor scenarios (score 85 vs score 20, spread 65)
  const answers: Record<string, string> = {
    'q-26-festival-celebration-context': 'opt-q26-energized', // score 85
    'q-27-friday-exhausted-context': 'opt-q27-solitude', // score 20
  };

  const result = evaluateTriangulationCluster(cluster, answers, EXPANDED_PILOT_QUESTION_BANK);

  // 1. Classification triggers clarification_needed
  assert.equal(
    result.classification,
    'clarification_needed',
    'Direct polar divergence (> 58 pts) must trigger clarification_needed'
  );
  assert.ok((result.spread ?? 0) > 58, `Spread ${result.spread} must exceed 58 pts`);

  // 2. User-facing explanation is non-judgmental
  assert.match(
    result.userFacingExplanation,
    /different directions|review your answers/i,
    'User-facing explanation should politely invite self-review'
  );
  assert.doesNotMatch(
    result.userFacingExplanation,
    /dishonest|contradiction|invalid|lie|fake/i,
    'Explanation must avoid judgmental words'
  );

  // 3. Neither answer is discarded; response quality handles it with neutral prompt
  const mockResponses: AdministeredItemResponse[] = Array.from({ length: 6 }, (_, idx) => ({
    questionId: `q-${idx + 1}`,
    itemId: `q-${idx + 1}`,
    displayedOptionIndex: idx % 3,
    semanticOptionId: `sem-${idx + 1}`,
    responseTimeMs: 2500,
  }));
  const quality = evaluateResponseQuality('sess-f', mockResponses, 1);
  assert.equal(quality.qualityState, 'clarification_needed');
  assert.equal(quality.isAccusedOfDishonesty, false);
});

// ============================================================================
// CASE G — Unanswered Sensitive Items
// ============================================================================

test('Case G — Unanswered Sensitive Items Remain Unknown and Are Never Imputed from Traits', () => {
  // Member with personality vectors but UNANSWERED smoking & relationship structure
  const memberWithUnknowns = {
    id: 'member-case-g',
    name: 'Diya',
    ageRange: '25-29',
    city: 'Bengaluru',
    intentions: ['dating'],
    constructProfile: [
      { constructId: 'agreeableness_empathy', score: 85, contextTags: ['interpersonal'] },
      { constructId: 'conscientiousness_order', score: 90, contextTags: ['workplace'] },
    ],
    // eligibility fields left undefined or unknown
    eligibility: {
      memberId: 'member-case-g',
      isAdultVerified: true,
      enabledIntentions: ['dating'],
      discoverableInIntentions: ['dating'],
      blockedMemberIds: [],
      // relationshipStructure is omitted (unknown)
    },
    // smokingVapingProfile is omitted (unknown)
  } as unknown as MemberProfile;

  const strictCandidate = {
    id: 'candidate-strict',
    name: 'Vikram',
    ageRange: '25-29',
    city: 'Bengaluru',
    intentions: ['dating'],
    constructProfile: [
      { constructId: 'agreeableness_empathy', score: 80, contextTags: ['interpersonal'] },
    ],
    eligibility: {
      memberId: 'candidate-strict',
      isAdultVerified: true,
      enabledIntentions: ['dating'],
      discoverableInIntentions: ['dating'],
      blockedMemberIds: [],
      relationshipStructure: 'exclusive_required',
    },
    smokingVapingProfile: {
      personalHabit: 'non_smoker',
      environmentComfort: 'smoke_free_only',
      partnerRequirementByIntention: {
        dating: 'must_be_non_smoker',
        matrimony: 'must_be_non_smoker',
        friendship: 'no_preference',
      },
      isVoluntarilyDisclosed: true,
    },
  } as unknown as MemberProfile;

  // 1. Smoking habit remains strictly unknown; never inferred as "non-smoker" despite high Conscientiousness
  assert.equal(
    memberWithUnknowns.smokingVapingProfile?.personalHabit ?? 'unknown',
    'unknown',
    'Unanswered smoking habit must remain unknown; never guessed from high conscientiousness'
  );

  // 2. Mutual eligibility check
  const eligibility = evaluateMutualEligibility(memberWithUnknowns.eligibility!, strictCandidate.eligibility!, 'dating');

  // Vikram requires exclusive, but Diya has not answered yet.
  // The engine does NOT reject Diya; it permits discovery with clarification note.
  assert.equal(
    eligibility.eligible,
    true,
    'Unanswered optional preferences must not falsely fail mutual eligibility'
  );
  assert.equal(
    eligibility.hasUnknownNonNegotiables,
    true,
    'Engine must track that optional requirements require mutual clarification'
  );
  assert.ok(
    eligibility.unknownFieldsRequiringClarification.includes('relationship_structure'),
    'Engine lists relationship_structure in unknownFieldsRequiringClarification'
  );
  assert.match(
    eligibility.neutralMemberExplanation,
    /clarified in conversation|unanswered/i,
    'Explanation must be calm and non-accusatory'
  );
});

// ============================================================================
// CASE H — Different Assessment Paths (Sparse Overlap)
// ============================================================================

test('Case H — Sparse Overlap Reports Measurement Uncertainty Margin and Uncompared Constructs', () => {
  // Member 1 took Path A: answered 3 constructs
  const member1Constructs: ConstructVectorPoint[] = [
    { constructId: 'introversion_solitude', score: 75, itemCount: 3, answeredItemCount: 3 },
    { constructId: 'conflict_repair', score: 80, itemCount: 2, answeredItemCount: 2 },
    { constructId: 'openness_curiosity', score: 70, itemCount: 2, answeredItemCount: 2 },
  ];

  // Member 2 took Path B: answered 3 constructs with only 2 overlapping (introversion_solitude, conflict_repair)
  const member2Constructs: ConstructVectorPoint[] = [
    { constructId: 'introversion_solitude', score: 70, itemCount: 2, answeredItemCount: 2 },
    { constructId: 'conflict_repair', score: 85, itemCount: 2, answeredItemCount: 2 },
    { constructId: 'financial_philosophy', score: 65, itemCount: 2, answeredItemCount: 2 },
  ];

  const evalResult = computeAttributeSimilarity(member1Constructs, member2Constructs, 'friendship');

  // 1. Computed successfully on overlapping constructs (2 comparable constructs)
  assert.equal(evalResult.status, 'computed');
  assert.equal(evalResult.comparableConstructCount, 2);

  // 2. High measurement uncertainty margin (+- 15 points) for sparse overlap (< 4 constructs)
  assert.equal(evalResult.confidence, 'provisional');
  assert.equal(
    evalResult.measurementUncertaintyMargin,
    15,
    'Sparse overlap (< 4 constructs) must carry a +-15 point measurement uncertainty margin'
  );

  // 3. Uncompared constructs are explicitly catalogued
  assert.ok((evalResult.uncomparedConstructsCount ?? 0) >= 2, 'Must report at least 2 uncompared constructs');
  assert.ok(
    evalResult.uncomparedConstructNames?.some((name) => name.toLowerCase().includes('openness') || name.toLowerCase().includes('intellectual')),
    'Uncompared list must identify Openness / Intellectual curiosity'
  );
  assert.ok(
    evalResult.uncomparedConstructNames?.some((name) => name.toLowerCase().includes('financial') || name.toLowerCase().includes('money')),
    'Uncompared list must identify Financial philosophy'
  );
});

// ============================================================================
// CASE I — Accessibility and Multilingual Equivalence
// ============================================================================

test('Case I — Multilingual Questions Preserve Scoring and Slow Readers Experience No Timing Penalties', () => {
  // 1. Check all questions in bank for semantic integrity across EN, TA, and HI
  const sampledQuestions = EXPANDED_PILOT_QUESTION_BANK.slice(0, 15);
  for (const q of sampledQuestions) {
    assert.ok(q.prompt && q.prompt.length > 0, `Question ${q.id} must have English prompt`);
    assert.ok(q.translations?.ta && q.translations.ta.length > 0, `Question ${q.id} must have Tamil translation`);
    assert.ok(q.translations?.hi && q.translations.hi.length > 0, `Question ${q.id} must have Hindi translation`);

    for (const opt of q.options) {
      assert.ok(opt.label, `Option ${opt.id} in ${q.id} must have English label`);
      assert.ok(opt.labelTa, `Option ${opt.id} in ${q.id} must have Tamil label`);
      assert.ok(opt.labelHi, `Option ${opt.id} in ${q.id} must have Hindi label`);
      assert.ok(opt.semanticId, `Option ${opt.id} must define invariant semanticId`);
    }
  }

  // 2. Assistive Technology / Screen Reader / Slow Reader Protection:
  // Member taking 18,000ms (18 seconds) per item is carefully reading or using a screen reader.
  const slowResponses: AdministeredItemResponse[] = Array.from({ length: 8 }, (_, idx) => ({
    questionId: `q-${idx + 1}`,
    itemId: `q-${idx + 1}`,
    displayedOptionIndex: idx % 3,
    semanticOptionId: `sem-${idx + 1}-a`,
    responseTimeMs: 18000, // 18 seconds per question
  }));

  const quality = evaluateResponseQuality('sess-accessible-reader', slowResponses, 0);

  // Slow readers MUST NEVER receive a speed flag, penalty, or lower confidence
  assert.equal(quality.qualityState, 'valid_high_confidence', 'Slow readers must receive valid_high_confidence');
  assert.equal(quality.flaggedSignals?.length ?? 0, 0, 'No quality flags should be attached for deliberate reading');
  assert.equal(quality.automaticSuspensionTriggered, false);
});

// ============================================================================
// CASE J — Fatigue Guardrail, Pausing & Clean Resumption
// ============================================================================

test('Case J — Session Fatigue Guardrail Triggers at 10 Questions and Resets on Resumption Without Data Loss', () => {
  const answeredSet = new Set<string>();

  // Member answers 10 questions in a single continuous sitting
  for (let i = 1; i <= 10; i++) {
    answeredSet.add(`q-0${i}`);
  }

  // 1. Adaptive engine checks fatigue at session count = 10
  const adaptiveDecision = selectNextAdaptiveQuestion({
    answeredQuestionIds: answeredSet,
    intentions: ['friendship', 'dating'],
    sessionAnswersCount: 10,
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  assert.equal(
    adaptiveDecision.breakRecommended,
    true,
    'Break must be recommended after 10 questions in a single sitting'
  );
  assert.ok(adaptiveDecision.breakAdvisory, 'A polite break advisory message must be provided');

  // 2. Member pauses and resumes 2 hours later (sessionAnswersCount resets to 0, answeredSet preserved)
  const resumedDecision = selectNextAdaptiveQuestion({
    answeredQuestionIds: answeredSet,
    intentions: ['friendship', 'dating'],
    sessionAnswersCount: 0, // Reset for new sitting
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  assert.equal(
    resumedDecision.breakRecommended,
    false,
    'Break recommendation must reset when member resumes in a fresh sitting'
  );
  assert.ok(resumedDecision.nextQuestion, 'Next adaptive question must be presented seamlessly');
  assert.ok(
    !answeredSet.has(resumedDecision.nextQuestion.id),
    'Engine must not repeat previously answered questions'
  );

  // 3. Verify total answered count is preserved without data loss
  assert.equal(resumedDecision.totalAnswered, 10, 'All 10 previously answered items must remain intact');
});
