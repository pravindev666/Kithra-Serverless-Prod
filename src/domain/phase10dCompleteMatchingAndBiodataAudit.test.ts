import test from 'node:test';
import assert from 'node:assert';
import { memberStore } from './memberStore';
import {
  evaluateMemberPairwiseMatch,
  evaluateMutualEligibility,
  filterProfilesByFullSimilaritySpectrum,
  PROVISIONAL_DOMAIN_WEIGHTS,
} from './psychologyEngine';
import { calculateCofounderSynergy } from './cofounderSynergyEngine';
import {
  CofounderProfile,
  ConstructVectorPoint,
  ExtendedIntentionId,
  MemberProfile,
} from '../types/kithra';

/* -------------------------------------------------------------------------- */
/*  PHASE 10D TEST SUITE: COMPLETE MATCHING, BIODATA & PSYCHOMETRIC AUDIT     */
/* -------------------------------------------------------------------------- */

test('Invariant 1: memberStore.upsertMemberProfile with missing eligibility fails closed (isAdultVerified: false)', () => {
  const testId = `test-member-p0-${Date.now()}`;
  const profile = memberStore.upsertMemberProfile({
    id: testId,
    name: 'P0 Test Member',
    city: 'Bengaluru',
    // Deliberately omit eligibility
  });

  assert.strictEqual(
    profile.eligibility?.isAdultVerified,
    false,
    'Missing eligibility must default to isAdultVerified: false (fail-closed, P0.1)'
  );
  assert.strictEqual(
    profile.eligibility?.isAdult,
    false,
    'Missing eligibility must default to isAdult: false (fail-closed, P0.1)'
  );
});

test('Invariant 2: evaluateMemberPairwiseMatch with missing eligibility fails closed (isAdultVerified: false)', () => {
  const viewerWithoutEligibility: MemberProfile = {
    id: 'viewer-no-elig',
    name: 'Viewer',
    ageRange: '25–28',
    city: 'Bengaluru',
    languages: ['English'],
    intentions: ['dating'],
    primaryIntention: 'dating',
    headline: 'Headline',
    bio: 'Bio',
    interests: ['Reading'],
    paceNote: 'Calm',
    occupation: 'Writer',
    portraitVariant: 'portrait_01',
    alignment: [],
    measuredDimensions: [],
    connectionState: 'discover',
    saved: false,
    // eligibility deliberately omitted
  };

  const candidateWithEligibility: MemberProfile = {
    ...viewerWithoutEligibility,
    id: 'candidate-elig',
    eligibility: {
      isAdult: true,
      isAdultVerified: true,
      enabledIntentions: ['dating'],
      discoverableInIntentions: ['dating'],
      discoveryEnabledByIntention: { dating: true },
      blockedMemberIds: [],
    },
  };

  const match = evaluateMemberPairwiseMatch(viewerWithoutEligibility, candidateWithEligibility, 'dating');
  assert.strictEqual(
    match.eligibility.eligible,
    false,
    'Viewer missing eligibility must fail mutual eligibility check'
  );
  assert.deepStrictEqual(
    match.eligibility.reasons,
    ['adult_verification_required_fail_closed'],
    'Reasons must be adult_verification_required_fail_closed when adult verification is missing'
  );
});

test('Invariant 3: Discovery filtering strictly excludes candidates missing profile.eligibility', () => {
  const viewerEligibility = {
    isAdult: true,
    isAdultVerified: true,
    enabledIntentions: ['friendship' as ExtendedIntentionId],
    discoverableInIntentions: ['friendship' as ExtendedIntentionId],
    discoveryEnabledByIntention: { friendship: true },
    blockedMemberIds: [],
  };

  const mockCandidate: MemberProfile = {
    id: 'cand-no-elig',
    name: 'Candidate No Eligibility',
    ageRange: '26',
    city: 'Bengaluru',
    languages: ['English'],
    intentions: ['friendship'],
    primaryIntention: 'friendship',
    headline: 'Hello',
    bio: 'Bio',
    interests: ['Music'],
    paceNote: 'Calm',
    occupation: 'Engineer',
    portraitVariant: 'p1',
    alignment: [],
    measuredDimensions: [],
    connectionState: 'discover',
    saved: false,
    attributeSimilarityScore: 92,
    // eligibility is deliberately undefined
  };

  const results = filterProfilesByFullSimilaritySpectrum([mockCandidate], {
    intention: 'friendship',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 0,
    maxSimilarity: 100,
    lensView: 'all',
    viewerEligibility,
  });

  assert.strictEqual(
    results.length,
    0,
    'Candidate missing eligibility must never bypass discovery checks regardless of high similarity'
  );
});

test('Invariant 4: Continuous construct vectors derive from full 125-item question bank', () => {
  const testMemberId = `test-125-bank-${Date.now()}`;
  memberStore.upsertMemberProfile({
    id: testMemberId,
    name: '125 Bank Tester',
    city: 'Bengaluru',
    intentions: ['friendship', 'dating'],
    eligibility: {
      isAdult: true,
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'dating'],
      blockedMemberIds: [],
    },
  });

  // Answer a question from the expanded bank (items > 63, e.g. q-64-confidentiality-friendship)
  memberStore.saveMemberAnswer(
    testMemberId,
    'q-64-confidentiality-friendship',
    'opt-q64-strict',
    2150
  );

  const member = memberStore.getMemberById(testMemberId);
  assert.ok(member?.constructProfile, 'Construct profile should be derived');
  // Confirm constructProfile was populated using expanded 125-item bank
  const constructWithAnswers = member?.constructProfile.find((c) => (c.answeredItemCount ?? 0) > 0);
  assert.ok(
    constructWithAnswers,
    'Answering question 64+ must contribute to continuous construct profile derivation'
  );
});

test('Invariant 5: Measured interaction latency is recorded in saveMemberAnswer', () => {
  const testMemberId = `test-latency-${Date.now()}`;
  memberStore.upsertMemberProfile({
    id: testMemberId,
    name: 'Latency Tester',
    city: 'Bengaluru',
  });

  // Save an answer with measured 4321 ms latency
  memberStore.saveMemberAnswer(testMemberId, 'q-pace', 'opt-slow', 4321);

  // Retrieve response record using official helper and verify timing is captured
  const record = memberStore.getMemberResponseRecord(testMemberId, 'q-pace');
  assert.ok(record, 'Raw response record must exist');
  assert.strictEqual(
    record?.responseLatencyMs,
    4321,
    'Measured latency must be accurately recorded'
  );
  assert.strictEqual(
    record?.optionId,
    'opt-slow',
    'Option ID must be recorded'
  );
});

test('Invariant 6: Q38 relationship structure gate respects exploring and prefer-not-to-say options', () => {
  const testMemberId = `test-q38-${Date.now()}`;
  memberStore.upsertMemberProfile({
    id: testMemberId,
    name: 'Q38 Choice Member',
    city: 'Bengaluru',
    intentions: ['dating'],
    eligibility: {
      isAdult: true,
      isAdultVerified: true,
      enabledIntentions: ['dating'],
      blockedMemberIds: [],
    },
  });

  // Answer Q38 with opt-q38-exploring
  memberStore.saveMemberAnswer(testMemberId, 'q-38-relationship-structure-gate', 'opt-q38-exploring', 3000);
  let updatedMember = memberStore.getMemberById(testMemberId);
  assert.strictEqual(
    updatedMember?.eligibility?.relationshipStructure,
    'unknown',
    'opt-q38-exploring must map to unknown without penalty'
  );

  // Answer Q38 with opt-q38-prefer-not-to-say
  memberStore.saveMemberAnswer(testMemberId, 'q-38-relationship-structure-gate', 'opt-q38-prefer-not-to-say', 2800);
  updatedMember = memberStore.getMemberById(testMemberId);
  assert.strictEqual(
    updatedMember?.eligibility?.relationshipStructure,
    'prefer_not_to_answer',
    'opt-q38-prefer-not-to-say must map to prefer_not_to_answer'
  );
});

test('Invariant 7: Dynamic cofounder work-style psychology responds to actual construct deltas', () => {
  const profileA: CofounderProfile = {
    headline: 'Technical Systems Architect',
    startupInterests: ['B2B SaaS', 'DevTools'],
    skillsOffered: [{ skillId: 'engineering', name: 'Distributed Systems', proficiency: 'advanced' }],
    skillsNeeded: [{ skillId: 'b2b_sales', priority: 'critical' }],
    ideaStage: 'building_prototype',
    fundingPreference: 'bootstrapped',
    timeCommitment: 'full_time_now',
    locationPreference: 'remote_first',
    equityExpectation: 'equal_split_ethos',
    isDiscoverable: true,
  };

  const profileB: CofounderProfile = {
    headline: 'B2B Enterprise Sales Lead',
    startupInterests: ['B2B SaaS', 'Fintech'],
    skillsOffered: [{ skillId: 'b2b_sales', name: 'Enterprise Sales', proficiency: 'advanced' }],
    skillsNeeded: [{ skillId: 'engineering', priority: 'critical' }],
    ideaStage: 'building_prototype',
    fundingPreference: 'bootstrapped',
    timeCommitment: 'full_time_now',
    locationPreference: 'remote_first',
    equityExpectation: 'equal_split_ethos',
    isDiscoverable: true,
  };

  const synergy = calculateCofounderSynergy(
    {
      id: 'f-alpha',
      name: 'Alpha Founder',
      profile: profileA,
      constructs: [
        { constructId: 'adaptability_change', score: 35, answeredItemCount: 3 },
        { constructId: 'conflict_repair', score: 85, answeredItemCount: 4 },
      ],
    },
    {
      id: 'f-beta',
      name: 'Beta Founder',
      profile: profileB,
      constructs: [
        { constructId: 'adaptability_change', score: 88, answeredItemCount: 4 },
        { constructId: 'conflict_repair', score: 80, answeredItemCount: 5 },
      ],
    }
  );

  assert.ok(
    synergy.skillComplementarity.mutualSynergyScore >= 0 &&
    synergy.skillComplementarity.mutualSynergyScore <= 100
  );
  assert.strictEqual(
    synergy.workingStyle.decisionMakingStyle.founderApproachA,
    'Thorough analytical risk modeling and structural diligence',
    'Founder A style must reflect actual measured 35/100 risk diligence'
  );
  assert.strictEqual(
    synergy.workingStyle.decisionMakingStyle.founderApproachB,
    'Iterative, rapid execution with agile user testing',
    'Founder B style must reflect actual measured 88/100 velocity'
  );

  // If constructs are missing entirely, engine must report honest unassessed status
  const unassessedSynergy = calculateCofounderSynergy(
    {
      id: 'f-unassessed',
      name: 'Unassessed Founder',
      profile: profileA,
      constructs: undefined,
    },
    {
      id: 'f-beta',
      name: 'Beta Founder',
      profile: profileB,
      constructs: undefined,
    }
  );

  assert.strictEqual(
    unassessedSynergy.workingStyle.decisionMakingStyle.founderApproachA,
    'Not yet assessed (requires Work-Style reflections)',
    'Missing constructs must not be faked with static strings'
  );
});

test('Invariant 8: Four-space integration and cofounder domain weights', () => {
  // Confirm PROVISIONAL_DOMAIN_WEIGHTS defines weights for all 4 spaces
  assert.ok(PROVISIONAL_DOMAIN_WEIGHTS.friendship, 'friendship weights must exist');
  assert.ok(PROVISIONAL_DOMAIN_WEIGHTS.dating, 'dating weights must exist');
  assert.ok(PROVISIONAL_DOMAIN_WEIGHTS.matrimony, 'matrimony weights must exist');
  assert.ok(PROVISIONAL_DOMAIN_WEIGHTS.cofounders, 'cofounders weights must exist');

  // Verify cofounder weights focus on work-style constructs while zeroing romantic/family expectations
  assert.strictEqual(PROVISIONAL_DOMAIN_WEIGHTS.cofounders.romantic_expectations, 0.0);
  assert.strictEqual(PROVISIONAL_DOMAIN_WEIGHTS.cofounders.family_domestic, 0.0);
  assert.ok(PROVISIONAL_DOMAIN_WEIGHTS.cofounders.trust_reliability >= 1.3);
  assert.ok(PROVISIONAL_DOMAIN_WEIGHTS.cofounders.conflict_repair >= 1.3);
});
