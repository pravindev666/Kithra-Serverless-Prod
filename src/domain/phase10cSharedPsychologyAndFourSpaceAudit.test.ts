import test from 'node:test';
import assert from 'node:assert';
import {
  evaluateMutualEligibility,
  determineDominantArchetypes,
  evaluateMemberStagedPattern,
  EXPERIMENTAL_ARCHETYPE_CATALOG,
} from './psychologyEngine';
import {
  calculateCofounderSynergy,
  evaluateDirectionalSkillCoverage,
} from './cofounderSynergyEngine';
import { selectNextAdaptiveQuestion } from './adaptiveQuestionEngine';
import {
  MemberEligibilityRequirements,
  CofounderProfile,
  ConstructVectorPoint,
  ExtendedIntentionId,
} from '../types/kithra';
import { EXPANDED_PILOT_QUESTION_BANK } from '../data/pilotQuestionBank';

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 1: ARCHETYPE MULTIDIMENSIONAL COVERAGE & SCIENTIFIC INTEGRITY   */
/* -------------------------------------------------------------------------- */

test('Invariant 1.1: Missing constructs are never assigned synthetic score 50', () => {
  const partialConstructs: ConstructVectorPoint[] = [
    { constructId: 'communication', score: 85, itemCount: 4 },
  ];
  const result = determineDominantArchetypes(partialConstructs);

  // Archetypes where communication is NOT a primary construct must have score 0 (not 50!)
  assert.strictEqual(
    result.archetypeScores.steady_anchor,
    0,
    'steady_anchor has no communication primary construct and must score 0'
  );
  assert.strictEqual(
    result.archetypeScores.horizon_planner,
    0,
    'horizon_planner has no communication primary construct and must score 0'
  );
});

test('Invariant 1.2: Archetype assignment requires multidimensional coverage (>= 2 primary constructs)', () => {
  // Only 1 construct measured (communication = 90)
  const singleConstruct: ConstructVectorPoint[] = [
    { constructId: 'communication', score: 90, itemCount: 5 },
  ];
  const singleResult = determineDominantArchetypes(singleConstruct);
  assert.strictEqual(singleResult.primaryMatchedConstructCount, 1);
  assert.strictEqual(
    singleResult.hasSufficientMultidimensionalCoverage,
    false,
    'Single construct measurement must flag insufficient multidimensional coverage'
  );

  // Two primary constructs measured (communication = 90, conflict_repair = 80)
  const multiConstruct: ConstructVectorPoint[] = [
    { constructId: 'communication', score: 90, itemCount: 4 },
    { constructId: 'conflict_repair', score: 80, itemCount: 4 },
  ];
  const multiResult = determineDominantArchetypes(multiConstruct);
  assert.strictEqual(multiResult.primaryMatchedConstructCount, 2);
  assert.strictEqual(
    multiResult.hasSufficientMultidimensionalCoverage,
    true,
    'Measuring >= 2 primary constructs provides sufficient multidimensional coverage'
  );
});

test('Invariant 1.3: Answering < 15 questions strictly returns null archetype label', () => {
  const constructs: ConstructVectorPoint[] = [
    { constructId: 'communication', score: 85, itemCount: 5 },
    { constructId: 'conflict_repair', score: 80, itemCount: 5 },
  ];

  // 5 answers: Early provisional note
  const staged5 = evaluateMemberStagedPattern(5, constructs);
  assert.strictEqual(staged5.assignedPrimaryArchetype, null);
  assert.strictEqual(staged5.assignedSecondaryArchetype, null);
  assert.strictEqual(staged5.confidenceBand, 'provisional_early_note');

  // 14 answers: Still in Stage 1, strictly null archetype
  const staged14 = evaluateMemberStagedPattern(14, constructs);
  assert.strictEqual(staged14.assignedPrimaryArchetype, null);
  assert.strictEqual(staged14.assignedSecondaryArchetype, null);
  assert.strictEqual(staged14.stage, 1);

  // 15 answers: Transitions to Stage 2 developing pattern
  const staged15 = evaluateMemberStagedPattern(15, constructs);
  assert.ok(staged15.assignedPrimaryArchetype !== null);
  assert.strictEqual(staged15.stage, 2);
  assert.strictEqual(staged15.confidenceBand, 'developing_pattern');
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 2: FOUR-SPACE MUTUAL ELIGIBILITY SEPARATION                    */
/* -------------------------------------------------------------------------- */

test('Invariant 2.1: Friendship matching strictly ignores romantic exclusivity and matrimony children gates', () => {
  const viewerFriend: MemberEligibilityRequirements = {
    memberId: 'user-friend-1',
    isAdultVerified: true,
    enabledIntentions: ['friendship'],
    discoverableInIntentions: ['friendship'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required', // Romantic gate
    childrenPreference: 'wants_children',        // Matrimony gate
    childrenPreferenceImportance: 'essential',
  };

  const candidateFriend: MemberEligibilityRequirements = {
    memberId: 'user-friend-2',
    isAdultVerified: true,
    enabledIntentions: ['friendship'],
    discoverableInIntentions: ['friendship'],
    blockedMemberIds: [],
    relationshipStructure: 'open_required',       // Conflicting romantic gate!
    childrenPreference: 'does_not_want_children', // Conflicting matrimony gate!
    childrenPreferenceImportance: 'essential',
  };

  const result = evaluateMutualEligibility(viewerFriend, candidateFriend, 'friendship');
  assert.strictEqual(
    result.eligible,
    true,
    'Friendship discovery must NOT fail due to romantic exclusivity or children preference conflicts'
  );
});

test('Invariant 2.2: Dating matching enforces intentional purpose & exclusivity, ignores cofounder funding', () => {
  const viewerDating: MemberEligibilityRequirements = {
    memberId: 'user-dating-1',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    datingPurpose: 'committed_long_term',
    acceptableDatingPurposes: ['committed_long_term'],
    acceptableFundingPreferences: ['bootstrapped'], // Cofounder field
  };

  const candidateDatingIncompatiblePurpose: MemberEligibilityRequirements = {
    memberId: 'user-dating-2',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    datingPurpose: 'intentional_dating', // Not in acceptableDatingPurposes!
    acceptableDatingPurposes: ['intentional_dating'],
    acceptableFundingPreferences: ['venture_capital'], // Opposing cofounder field
  };

  const result = evaluateMutualEligibility(viewerDating, candidateDatingIncompatiblePurpose, 'dating');
  assert.strictEqual(result.eligible, false);
  assert.ok(result.reasons.includes('incompatible_dating_purpose'));
  assert.ok(
    !result.reasons.includes('incompatible_funding_preference'),
    'Dating evaluation must not check cofounder funding preferences'
  );
});

test('Invariant 2.3: Cofounders matching enforces business non-negotiables, strictly ignores romantic gates', () => {
  const founderA: MemberEligibilityRequirements = {
    memberId: 'founder-1',
    isAdultVerified: true,
    enabledIntentions: ['cofounders' as any],
    discoverableInIntentions: ['cofounders' as any],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    childrenPreference: 'wants_children',
    childrenPreferenceImportance: 'essential',
    cofounderProfile: {
      fundingPreference: 'bootstrapped',
    } as any,
    acceptableFundingPreferences: ['bootstrapped'],
  };

  const founderB: MemberEligibilityRequirements = {
    memberId: 'founder-2',
    isAdultVerified: true,
    enabledIntentions: ['cofounders' as any],
    discoverableInIntentions: ['cofounders' as any],
    blockedMemberIds: [],
    relationshipStructure: 'open_required',       // Conflicting romantic gate!
    childrenPreference: 'does_not_want_children', // Conflicting matrimony gate!
    childrenPreferenceImportance: 'essential',
    cofounderProfile: {
      fundingPreference: 'bootstrapped',
    } as any,
    acceptableFundingPreferences: ['bootstrapped'],
  };

  const result = evaluateMutualEligibility(founderA, founderB, 'cofounders' as any);
  assert.strictEqual(
    result.eligible,
    true,
    'Cofounders discovery must ignore romantic exclusivity and children goals'
  );
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 3: TWO-WAY DIRECTIONAL SKILL COMPLEMENTARITY (FIRE + AIR)      */
/* -------------------------------------------------------------------------- */

test('Invariant 3.1: Two-way directional complementarity differentiates mutual coverage from one-way fit', () => {
  const founderTech: CofounderProfile = {
    headline: 'Senior Fullstack & AI Engineer',
    startupInterests: ['HealthTech', 'Developer Tools'],
    skillsOffered: [
      { skillId: 'engineering', name: 'Full-Stack Architecture', proficiency: 'advanced' },
      { skillId: 'ai_ml', name: 'Applied LLM Pipelines', proficiency: 'advanced' },
    ],
    skillsNeeded: [
      { skillId: 'b2b_sales', priority: 'critical' },
      { skillId: 'growth_marketing', priority: 'preferred' },
    ],
    ideaStage: 'building_prototype',
    fundingPreference: 'bootstrapped',
    timeCommitment: 'full_time_now',
    locationPreference: 'remote_first',
    equityExpectation: 'equal_split_ethos',
    isDiscoverable: true,
  };

  const founderBiz: CofounderProfile = {
    headline: 'Enterprise Sales & Growth Lead',
    startupInterests: ['HealthTech', 'B2B SaaS'],
    skillsOffered: [
      { skillId: 'b2b_sales', name: 'Enterprise Go-To-Market', proficiency: 'advanced' },
      { skillId: 'growth_marketing', name: 'Inbound Growth', proficiency: 'experienced' },
    ],
    skillsNeeded: [
      { skillId: 'engineering', priority: 'critical' },
      { skillId: 'ai_ml', priority: 'preferred' },
    ],
    ideaStage: 'building_prototype',
    fundingPreference: 'bootstrapped',
    timeCommitment: 'full_time_now',
    locationPreference: 'remote_first',
    equityExpectation: 'equal_split_ethos',
    isDiscoverable: true,
  };

  const report = calculateCofounderSynergy(
    { id: 'f-tech', name: 'Arjun', profile: founderTech },
    { id: 'f-biz', name: 'Neha', profile: founderBiz }
  );

  // Both critical needs covered in both directions:
  assert.strictEqual(report.skillComplementarity.mutualSynergyLabel, 'High Mutual Complementarity');
  assert.strictEqual(report.skillComplementarity.bCoversANeeds.criticalSkillsMissing.length, 0);
  assert.strictEqual(report.skillComplementarity.aCoversBNeeds.criticalSkillsMissing.length, 0);
  assert.strictEqual(report.sharedDirection.isDirectionallyEligible, true);
});

test('Invariant 3.2: Identical critical skill gaps result in Capability Gap', () => {
  const founderA: CofounderProfile = {
    headline: 'Sales Lead',
    startupInterests: ['FinTech'],
    skillsOffered: [{ skillId: 'b2b_sales', name: 'Sales', proficiency: 'advanced' }],
    skillsNeeded: [{ skillId: 'engineering', priority: 'critical' }],
    ideaStage: 'exploring_ideas',
    fundingPreference: 'bootstrapped',
    timeCommitment: 'full_time_now',
    locationPreference: 'remote_first',
    equityExpectation: 'equal_split_ethos',
    isDiscoverable: true,
  };

  const founderB: CofounderProfile = {
    headline: 'Marketing Lead',
    startupInterests: ['FinTech'],
    skillsOffered: [{ skillId: 'growth_marketing', name: 'Marketing', proficiency: 'advanced' }],
    skillsNeeded: [{ skillId: 'engineering', priority: 'critical' }], // Also needs engineering!
    ideaStage: 'exploring_ideas',
    fundingPreference: 'bootstrapped',
    timeCommitment: 'full_time_now',
    locationPreference: 'remote_first',
    equityExpectation: 'equal_split_ethos',
    isDiscoverable: true,
  };

  const report = calculateCofounderSynergy(
    { id: 'f-a', name: 'Ravi', profile: founderA },
    { id: 'f-b', name: 'Priya', profile: founderB }
  );

  assert.strictEqual(report.skillComplementarity.mutualSynergyLabel, 'Capability Gap');
  assert.ok(report.skillComplementarity.bCoversANeeds.criticalSkillsMissing.includes('engineering'));
  assert.ok(report.skillComplementarity.aCoversBNeeds.criticalSkillsMissing.includes('engineering'));
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 4: CROSS-CONTEXT PRIVACY FIREWALL & FAIL-CLOSED GATES          */
/* -------------------------------------------------------------------------- */

test('Invariant 4.1: Unverified adult age strictly fails closed with 0ms rejection', () => {
  const viewer: MemberEligibilityRequirements = {
    memberId: 'viewer-adult',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };

  const unverifiedCandidate: MemberEligibilityRequirements = {
    memberId: 'candidate-unverified',
    // isAdultVerified is undefined
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };

  const result = evaluateMutualEligibility(viewer, unverifiedCandidate, 'dating');
  assert.strictEqual(result.eligible, false);
  assert.ok(result.reasons.includes('adult_verification_required_fail_closed'));
});

test('Invariant 4.2: Global block overrides all four spaces immediately', () => {
  const spaces: ExtendedIntentionId[] = ['friendship', 'dating', 'matrimony', 'cofounders'];

  for (const space of spaces) {
    const viewer: MemberEligibilityRequirements = {
      memberId: 'viewer-member',
      isAdultVerified: true,
      enabledIntentions: [space as any],
      discoverableInIntentions: [space as any],
      blockedMemberIds: ['blocked-candidate'],
    };

    const candidate: MemberEligibilityRequirements = {
      memberId: 'blocked-candidate',
      isAdultVerified: true,
      enabledIntentions: [space as any],
      discoverableInIntentions: [space as any],
      blockedMemberIds: [],
    };

    const result = evaluateMutualEligibility(viewer, candidate, space as any);
    assert.strictEqual(result.eligible, false, `Space ${space} must reject blocked candidate`);
    assert.ok(
      result.reasons.includes('member_block_active'),
      `Space ${space} must return member_block_active reason`
    );
  }
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 5: ADAPTIVE QUESTION ENGINE PROGRESSION & FATIGUE PACING       */
/* -------------------------------------------------------------------------- */

test('Invariant 5.1: Starter battery items 1-5 administered first in exact sequence', () => {
  const result1 = selectNextAdaptiveQuestion({
    answeredQuestionIds: [],
    intentions: ['friendship', 'dating'],
  });
  assert.strictEqual(result1.selectionReason, 'starter_battery');
  assert.strictEqual(result1.nextQuestion?.id, 'q-pace');

  const result2 = selectNextAdaptiveQuestion({
    answeredQuestionIds: ['q-pace'],
    intentions: ['friendship', 'dating'],
  });
  assert.strictEqual(result2.selectionReason, 'starter_battery');
  assert.strictEqual(result2.nextQuestion?.id, 'q-02-workweek-reply');
});

test('Invariant 5.2: Fatigue break recommendation emitted at 10 consecutive sitting answers', () => {
  const result = selectNextAdaptiveQuestion({
    answeredQuestionIds: ['q-pace', 'q-02-workweek-reply', 'q-03-first-meetup', 'q-04-listening-role', 'q-05-voice-vs-text'],
    sessionAnswersCount: 10,
    intentions: ['friendship'],
  });

  assert.strictEqual(result.breakRecommended, true);
  assert.ok(result.breakAdvisory !== undefined);
  assert.match(result.breakAdvisory!, /10 thoughtful questions/i);
});

test('Invariant 5.3: Question bank exhaustion safely halts without runtime crashes', () => {
  const allIds = EXPANDED_PILOT_QUESTION_BANK.map((q) => q.id);
  const result = selectNextAdaptiveQuestion({
    answeredQuestionIds: allIds,
    intentions: ['friendship'],
  });

  assert.strictEqual(result.nextQuestion, null);
  assert.strictEqual(result.selectionReason, 'bank_exhausted');
  assert.strictEqual(result.adaptiveCategory, 'assessment_complete');
});
