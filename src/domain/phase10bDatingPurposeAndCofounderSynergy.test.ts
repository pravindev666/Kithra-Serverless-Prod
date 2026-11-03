import test from 'node:test';
import assert from 'node:assert';
import {
  evaluateMutualEligibility,
  determineDominantArchetypes,
  evaluateMemberStagedPattern,
} from './psychologyEngine';
import {
  calculateCofounderSynergy,
  evaluateDirectionalSkillCoverage,
} from './cofounderSynergyEngine';
import { selectNextAdaptiveQuestion } from './adaptiveQuestionEngine';
import {
  COMMUNITY_RESPECT_PLEDGE_ITEMS,
  COMMUNITY_RESPECT_PLEDGE_VERSION,
} from '../data/communityRespectPledge';
import {
  COFOUNDER_ALIGNMENT_CHECKLIST,
  TRIAL_PROJECT_FRAMEWORK,
} from '../data/cofounderAlignmentChecklist';
import {
  MemberEligibilityRequirements,
  CofounderProfile,
  ConstructVectorPoint,
  AssessmentQuestion,
} from '../types/kithra';

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 1: FAIL-CLOSED ELIGIBILITY DEFAULTS                            */
/* -------------------------------------------------------------------------- */

test('Invariant 1.1: Missing age verification fails closed with 0ms rejection', () => {
  const viewer: MemberEligibilityRequirements = {
    memberId: 'viewer-adult',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };

  const unverifiedCandidate: MemberEligibilityRequirements = {
    memberId: 'candidate-unverified',
    // isAdult and isAdultVerified undefined
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };

  const result = evaluateMutualEligibility(viewer, unverifiedCandidate, 'dating');
  assert.strictEqual(result.eligible, false, 'Unverified candidate must not be eligible');
  assert.ok(
    result.reasons.includes('adult_verification_required_fail_closed'),
    'Reason must be fail-closed adult verification'
  );
});

test('Invariant 1.2: Missing enabledIntentions never defaults to approved', () => {
  const viewer: MemberEligibilityRequirements = {
    memberId: 'viewer-dating',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };

  const missingIntentionsCandidate: MemberEligibilityRequirements = {
    memberId: 'candidate-missing-intent',
    isAdultVerified: true,
    // enabledIntentions undefined
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  } as any;

  const result = evaluateMutualEligibility(viewer, missingIntentionsCandidate, 'dating');
  assert.strictEqual(result.eligible, false, 'Missing intention array must fail closed');
  assert.ok(
    result.reasons.includes('intention_not_mutually_enabled'),
    'Reason must be intention_not_mutually_enabled'
  );
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 2: DATING RELATIONSHIP PURPOSE & DIGNITY-FIRST MUTUAL GOALS   */
/* -------------------------------------------------------------------------- */

test('Invariant 2.1: Compatible serious dating purposes match successfully', () => {
  const memberA: MemberEligibilityRequirements = {
    memberId: 'user-a-serious',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    datingPurpose: 'committed_long_term',
    acceptableDatingPurposes: ['committed_long_term', 'open_to_marriage'],
  };

  const memberB: MemberEligibilityRequirements = {
    memberId: 'user-b-marriage-open',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    datingPurpose: 'open_to_marriage',
    acceptableDatingPurposes: ['committed_long_term', 'open_to_marriage'],
  };

  const result = evaluateMutualEligibility(memberA, memberB, 'dating');
  assert.strictEqual(result.eligible, true, 'Compatible relationship goals must be eligible');
  assert.strictEqual(result.reasons.length, 0);
});

test('Invariant 2.2: Incompatible dating relationship purposes reject gracefully', () => {
  const memberA: MemberEligibilityRequirements = {
    memberId: 'user-a-marriage-only',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    datingPurpose: 'open_to_marriage',
    acceptableDatingPurposes: ['open_to_marriage'], // Strictly marriage track
  };

  const memberB: MemberEligibilityRequirements = {
    memberId: 'user-b-intentional-dating',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    datingPurpose: 'intentional_dating', // Meaningful dating without marriage pressure
    acceptableDatingPurposes: ['intentional_dating'],
  };

  const result = evaluateMutualEligibility(memberA, memberB, 'dating');
  assert.strictEqual(result.eligible, false, 'Incompatible goals must not be paired in Dating');
  assert.ok(
    result.reasons.includes('incompatible_dating_purpose'),
    'Must include incompatible_dating_purpose in reasons'
  );
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 3: ARCHETYPE SCIENTIFIC INTEGRITY & UNMEASURED CONSTRUCTS     */
/* -------------------------------------------------------------------------- */

test('Invariant 3.1: determineDominantArchetypes does not assign 50 to unmeasured constructs', () => {
  // Only measured communication and emotional_regulation with low score 30
  // All other constructs are completely unmeasured
  const partialConstructs: ConstructVectorPoint[] = [
    { constructId: 'communication', score: 30, itemCount: 3 },
    { constructId: 'emotional_regulation', score: 35, itemCount: 2 },
  ];

  const result = determineDominantArchetypes(partialConstructs);
  // Archetypes with 0 measured constructs must have score 0 (not synthetic 50!)
  // If an archetype had 50 defaulted, it would falsely beat measured score 30
  assert.ok(
    result.archetypeScores.deep_current !== undefined,
    'Deep current score should be calculated'
  );
  // Verify that an archetype with 0 measured constructs (e.g. circle_gatherer primary constructs missing) does not get 50
  assert.strictEqual(
    result.archetypeScores.horizon_planner,
    0,
    'Unmeasured horizon_planner must remain 0/null, never artificial 50'
  );
});

test('Invariant 3.2: 5 starter questions strictly return null archetype assignment', () => {
  const evaluation = evaluateMemberStagedPattern(5, [
    { constructId: 'communication', score: 75, itemCount: 5 },
  ]);

  assert.strictEqual(
    evaluation.assignedPrimaryArchetype,
    null,
    'Starter battery (<15 questions) must NEVER assign a primary archetype'
  );
  assert.strictEqual(
    evaluation.assignedSecondaryArchetype,
    null,
    'Starter battery (<15 questions) must NEVER assign a secondary archetype'
  );
  assert.strictEqual(evaluation.stage, 1);
  assert.strictEqual(evaluation.confidenceBand, 'provisional_early_note');
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 4: ANSWER-DEPENDENT ADAPTIVE QUESTIONING                      */
/* -------------------------------------------------------------------------- */

test('Invariant 4.1: Semantic option branching routes to targeted follow-up question', () => {
  const mockQuestionBank: AssessmentQuestion[] = [
    {
      id: 'q-pace',
      themeId: 'theme-1',
      questionNumber: 1,
      module: 'Conversational Pace & Presence',
      sectionId: 'communication_style',
      prompt: 'What conversational pace feels most natural?',
      context: 'everyday_pace',
      intentionScope: 'All intentions',
      options: [
        {
          id: 'opt-unhurried',
          label: 'Unhurried & reflective',
          reflection: 'Values calm pace',
          signalEffect: 'Low pressure',
          branchToQuestionId: 'q-unhurried-depth',
        },
        {
          id: 'opt-spontaneous',
          label: 'Rapid & spontaneous',
          reflection: 'Values high momentum',
          signalEffect: 'Fast pace',
          branchToQuestionId: 'q-spontaneous-depth',
        },
      ],
      whyWeAsk: 'Pacing alignment',
      applicableIntentions: ['dating', 'friendship'],
    },
    {
      id: 'q-unhurried-depth',
      themeId: 'theme-1',
      questionNumber: 2,
      module: 'Conversational Pace & Presence',
      sectionId: 'communication_style',
      prompt: 'When you take time to reply, how do you manage expectations?',
      context: 'unhurried_followup',
      intentionScope: 'All intentions',
      options: [
        { id: 'opt-a', label: 'I let people know', reflection: '', signalEffect: '' },
      ],
      whyWeAsk: 'Explores unhurried communication',
      applicableIntentions: ['dating', 'friendship'],
    },
    {
      id: 'q-spontaneous-depth',
      themeId: 'theme-1',
      questionNumber: 3,
      module: 'Conversational Pace & Presence',
      sectionId: 'communication_style',
      prompt: 'Do you prefer real-time voice or quick text bursts?',
      context: 'spontaneous_followup',
      intentionScope: 'All intentions',
      options: [
        { id: 'opt-b', label: 'Voice calls', reflection: '', signalEffect: '' },
      ],
      whyWeAsk: 'Explores spontaneous communication',
      applicableIntentions: ['dating', 'friendship'],
    },
  ];

  // Member answered q-pace with 'opt-unhurried'
  const selection = selectNextAdaptiveQuestion({
    answeredQuestionIds: ['q-pace'],
    memberAnswers: { 'q-pace': 'opt-unhurried' },
    intentions: ['dating'],
    questionBank: mockQuestionBank,
  });

  assert.ok(selection.nextQuestion !== null, 'Next question must be selected');
  assert.strictEqual(
    selection.nextQuestion?.id,
    'q-unhurried-depth',
    'Must branch to q-unhurried-depth because opt-unhurried was selected'
  );
  assert.strictEqual(selection.selectionReason, 'contextual_follow_up');
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 5: COFOUNDER SYNERGY ENGINE (FIRE + AIR)                      */
/* -------------------------------------------------------------------------- */

test('Invariant 5.1: Two-way directional skill complementarity calculates accurately', () => {
  const founderAProfile: CofounderProfile = {
    headline: 'Technical Co-founder & AI Lead',
    startupInterests: ['HealthTech', 'Developer Tools'],
    skillsOffered: [
      { skillId: 'engineering', name: 'Software Engineering', proficiency: 'advanced' },
      { skillId: 'ai_ml', name: 'Machine Learning', proficiency: 'advanced' },
    ],
    skillsNeeded: [
      { skillId: 'b2b_sales', priority: 'critical' },
      { skillId: 'growth_marketing', priority: 'preferred' },
    ],
    ideaStage: 'building_prototype',
    fundingPreference: 'bootstrapped',
    timeCommitment: 'full_time_now',
    locationPreference: 'in_person_city',
    city: 'Bengaluru',
    equityExpectation: 'equal_split_ethos',
    isDiscoverable: true,
  };

  const founderBProfile: CofounderProfile = {
    headline: 'B2B Commercial Lead & Revenue Architect',
    startupInterests: ['HealthTech', 'B2B SaaS'],
    skillsOffered: [
      { skillId: 'b2b_sales', name: 'Enterprise Sales', proficiency: 'advanced' },
      { skillId: 'growth_marketing', name: 'Growth Marketing', proficiency: 'experienced' },
    ],
    skillsNeeded: [
      { skillId: 'engineering', priority: 'critical' },
      { skillId: 'ai_ml', priority: 'critical' },
    ],
    ideaStage: 'exploring_ideas',
    fundingPreference: 'bootstrapped',
    timeCommitment: 'full_time_now',
    locationPreference: 'in_person_city',
    city: 'Bengaluru',
    equityExpectation: 'equal_split_ethos',
    isDiscoverable: true,
  };

  const report = calculateCofounderSynergy(
    { id: 'founder-a', name: 'Priya', profile: founderAProfile },
    { id: 'founder-b', name: 'Karthik', profile: founderBProfile }
  );

  assert.strictEqual(report.sharedDirection.isDirectionallyEligible, true);
  assert.strictEqual(report.sharedDirection.fundingCompatibility, 'aligned');
  assert.strictEqual(report.sharedDirection.locationCompatibility, 'aligned');

  // Skill complementarity
  assert.strictEqual(report.skillComplementarity.mutualSynergyLabel, 'High Mutual Complementarity');
  assert.strictEqual(report.skillComplementarity.mutualSynergyScore, 100);
  assert.strictEqual(report.skillComplementarity.bCoversANeeds.criticalSkillsMissing.length, 0);
  assert.strictEqual(report.skillComplementarity.aCoversBNeeds.criticalSkillsMissing.length, 0);

  // Check working style insights
  assert.ok(report.workingStyle.decisionMakingStyle.dimension.includes('Decision Speed'));
  assert.ok(report.unresolvedQuestions.recommendedDiscussionTopics.length >= 4);
});

test('Invariant 5.2: Two founders with identical skill gaps are flagged as Capability Gap', () => {
  // Both founders are non-technical and both critically need engineering
  const nonTechA: CofounderProfile = {
    headline: 'Sales Lead',
    startupInterests: ['FinTech'],
    skillsOffered: [{ skillId: 'b2b_sales', name: 'Sales', proficiency: 'advanced' }],
    skillsNeeded: [{ skillId: 'engineering', priority: 'critical' }],
    ideaStage: 'exploring_ideas',
    fundingPreference: 'open_to_either',
    timeCommitment: 'full_time_now',
    locationPreference: 'remote_first',
    equityExpectation: 'open_discussion',
    isDiscoverable: true,
  };

  const nonTechB: CofounderProfile = {
    headline: 'Marketing Lead',
    startupInterests: ['FinTech'],
    skillsOffered: [{ skillId: 'growth_marketing', name: 'Marketing', proficiency: 'advanced' }],
    skillsNeeded: [{ skillId: 'engineering', priority: 'critical' }],
    ideaStage: 'exploring_ideas',
    fundingPreference: 'open_to_either',
    timeCommitment: 'full_time_now',
    locationPreference: 'remote_first',
    equityExpectation: 'open_discussion',
    isDiscoverable: true,
  };

  const report = calculateCofounderSynergy(
    { id: 'f-1', name: 'Amit', profile: nonTechA },
    { id: 'f-2', name: 'Sunil', profile: nonTechB }
  );

  assert.strictEqual(report.skillComplementarity.mutualSynergyLabel, 'Capability Gap');
  assert.ok(report.skillComplementarity.missingCollectiveSkills.includes('engineering'));
});

/* -------------------------------------------------------------------------- */
/*  TEST SUITE 6: RESPECT PLEDGE & ALIGNMENT WORKSHEETS                      */
/* -------------------------------------------------------------------------- */

test('Invariant 6.1: Community Respect Pledge contains all 8 non-negotiable covenants', () => {
  assert.strictEqual(COMMUNITY_RESPECT_PLEDGE_ITEMS.length, 8);
  assert.strictEqual(COMMUNITY_RESPECT_PLEDGE_VERSION, '2026.11');

  const titles = COMMUNITY_RESPECT_PLEDGE_ITEMS.map((item) => item.id);
  assert.ok(titles.includes('truthful_intentions'));
  assert.ok(titles.includes('consent_and_boundaries'));
  assert.ok(titles.includes('anti_harassment'));
  assert.ok(titles.includes('dignified_rejection'));
  assert.ok(titles.includes('no_unsolicited_sexual_content'));
  assert.ok(titles.includes('privacy_and_confidentiality'));
  assert.ok(titles.includes('authentic_identity'));
  assert.ok(titles.includes('space_integrity'));
});

test('Invariant 6.2: Cofounder Alignment Checklist and Trial Project Framework are defined', () => {
  assert.strictEqual(COFOUNDER_ALIGNMENT_CHECKLIST.length, 9);
  assert.strictEqual(TRIAL_PROJECT_FRAMEWORK.durationDays, 30);
  assert.strictEqual(TRIAL_PROJECT_FRAMEWORK.milestones.length, 4);
});
