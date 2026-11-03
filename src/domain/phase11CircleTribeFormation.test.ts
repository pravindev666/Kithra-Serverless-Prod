import { test } from 'node:test';
import assert from 'node:assert';
import {
  TRIBE_AFFINITY_THEMES,
  validateCircleProposal,
  createMemberCircle,
  estimateTribeAffinityCohort,
  inviteMemberToCircle,
} from './circleTribeEngine';
import { MemberProfile, ExtendedIntentionId } from '../types/kithra';

// Mock Profiles for Testing
const adultMemberHost: MemberProfile = {
  id: 'p01-priya',
  name: 'Priya Sharma',
  ageRange: '28',
  city: 'Bengaluru',
  intentions: ['friendship', 'dating', 'cofounders'],
  primaryIntention: 'friendship',
  languages: ['English', 'Kannada'],
  interests: ['books', 'hiking'],
  paceNote: 'Thoughtful unhurried',
  headline: 'Curious designer & reader',
  bio: 'Exploring literature, hiking, and slow conversations.',
  occupation: 'Designer',
  portraitVariant: 'portrait-1',
  alignment: [],
  measuredDimensions: [],
  connectionState: 'discover',
  saved: false,
  constructProfile: [
    { constructId: 'C1_openness', score: 85, itemCount: 6 },
    { constructId: 'C2_planfulness', score: 70, itemCount: 6 },
    { constructId: 'C3_social_energy', score: 75, itemCount: 5 },
    { constructId: 'C4_warmth', score: 88, itemCount: 5 },
  ],
  eligibility: {
    memberId: 'p01-priya',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating', 'cofounders'],
    discoverableInIntentions: ['friendship', 'dating', 'cofounders'],
    blockedMemberIds: [],
  },
};

const unverifiedMinorMember: MemberProfile = {
  ...adultMemberHost,
  id: 'p15-aryan',
  name: 'Aryan Malhotra',
  ageRange: '17',
  eligibility: {
    memberId: 'p15-aryan',
    isAdultVerified: false, // Not verified adult
    enabledIntentions: ['friendship'],
    discoverableInIntentions: ['friendship'],
    blockedMemberIds: [],
  },
};

const peerCandidate1: MemberProfile = {
  id: 'p02-ananya',
  name: 'Ananya Iyer',
  ageRange: '29',
  city: 'Bengaluru',
  intentions: ['friendship', 'dating'],
  primaryIntention: 'friendship',
  languages: ['English', 'Tamil'],
  interests: ['literature', 'walking'],
  paceNote: 'Unhurried and warm',
  headline: 'Literature lover',
  bio: 'Walking and reading.',
  occupation: 'Writer',
  portraitVariant: 'portrait-2',
  alignment: [],
  measuredDimensions: [],
  connectionState: 'discover',
  saved: false,
  constructProfile: [
    { constructId: 'C1_openness', score: 82, itemCount: 6 }, // High openness
    { constructId: 'C4_warmth', score: 85, itemCount: 5 },
  ],
  eligibility: {
    memberId: 'p02-ananya',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating'],
    discoverableInIntentions: ['friendship', 'dating'],
    blockedMemberIds: [],
  },
};

const peerCandidate2: MemberProfile = {
  id: 'p03-rohit',
  name: 'Rohit Verma',
  ageRange: '31',
  city: 'Bengaluru',
  intentions: ['friendship'],
  primaryIntention: 'friendship',
  languages: ['English', 'Hindi'],
  interests: ['finance', 'chess'],
  paceNote: 'Quiet and structured',
  headline: 'Pragmatic analyst',
  bio: 'Methodical and quiet.',
  occupation: 'Analyst',
  portraitVariant: 'portrait-3',
  alignment: [],
  measuredDimensions: [],
  connectionState: 'discover',
  saved: false,
  constructProfile: [
    { constructId: 'C1_openness', score: 45, itemCount: 6 }, // Low openness (< 60)
    { constructId: 'C2_planfulness', score: 90, itemCount: 6 },
  ],
  eligibility: {
    memberId: 'p03-rohit',
    isAdultVerified: true,
    enabledIntentions: ['friendship'],
    discoverableInIntentions: ['friendship'],
    blockedMemberIds: [],
  },
};

const testCohort: MemberProfile[] = [
  adultMemberHost,
  unverifiedMinorMember,
  peerCandidate1,
  peerCandidate2,
];

// ============================================================================
// TEST SUITE: MEMBER-INITIATED COMMUNITY CIRCLES & TRIBES
// ============================================================================

test('Tribe Formation 1: User A takes the initiative and forms a Circle with custom name', () => {
  const result = createMemberCircle(adultMemberHost, {
    title: 'Indiranagar Sunday Filter Coffee & Philosophy Walk',
    city: 'Bengaluru',
    format: 'In-person walk',
    intention: 'friendship',
    cadence: 'Every second Sunday · 10:00 AM',
    maxCapacity: 12,
    description: 'A slow morning walk through leafy lanes followed by coffee and structured conversation.',
    tribeTheme: 'Curious Explorers · Ideas, Arts & Philosophy',
    targetAffinityTrait: 'High curiosity, open minds & lateral thinking',
    targetConstructId: 'C1_openness',
  });

  assert.strictEqual(result.success, true);
  assert.ok(result.circle);
  assert.strictEqual(result.circle.isMemberInitiated, true);
  assert.strictEqual(result.circle.creatorMemberId, 'p01-priya');
  assert.strictEqual(result.circle.creatorMemberName, 'Priya Sharma');
  assert.strictEqual(result.circle.title, 'Indiranagar Sunday Filter Coffee & Philosophy Walk');
  assert.strictEqual(result.circle.format, 'In-person walk');
  assert.strictEqual(result.circle.intention, 'friendship');
  assert.strictEqual(result.circle.maxCapacity, 12);
  assert.strictEqual(result.circle.joined, true); // Creator is automatically enrolled
  assert.strictEqual(result.circle.memberCount, 1);
  assert.strictEqual(result.circle.status, 'active');
});

test('Tribe Formation 2: Validation rejects invalid inputs (too short title, missing city)', () => {
  // Title too short
  const res1 = validateCircleProposal(adultMemberHost, {
    title: 'Hi',
    city: 'Bengaluru',
    format: 'Small table conversation',
    intention: 'friendship',
    cadence: 'Weekly',
    description: 'This is a long enough description for the circle gathering.',
  });
  assert.strictEqual(res1.isValid, false);
  assert.ok(res1.reasons.includes('title_too_short'));

  // Description too short
  const res2 = validateCircleProposal(adultMemberHost, {
    title: 'Valid Circle Title',
    city: 'Bengaluru',
    format: 'Small table conversation',
    intention: 'friendship',
    cadence: 'Weekly',
    description: 'Short',
  });
  assert.strictEqual(res2.isValid, false);
  assert.ok(res2.reasons.includes('description_too_short'));

  // Missing city
  const res3 = validateCircleProposal(adultMemberHost, {
    title: 'Valid Circle Title',
    city: '',
    format: 'Small table conversation',
    intention: 'friendship',
    cadence: 'Weekly',
    description: 'This is a long enough description for the circle gathering.',
  });
  assert.strictEqual(res3.isValid, false);
  assert.ok(res3.reasons.includes('city_required'));
});

test('Tribe Formation 3: P0 Adulthood Verification Invariant rejects unverified members', () => {
  const result = createMemberCircle(unverifiedMinorMember, {
    title: 'Youth Gathering and Discussion',
    city: 'Delhi',
    format: 'Small table conversation',
    intention: 'friendship',
    cadence: 'Weekly',
    description: 'Gathering to discuss interesting topics and school activities.',
  });

  assert.strictEqual(result.success, false);
  assert.ok(result.error?.includes('Adult verification (18+) is required'));
});

test('Tribe Formation 4: Capacity bounds are strictly enforced between 6 and 22 members', () => {
  // Try setting 50 (too high) -> Fails validation with capacity_out_of_bounds
  const resHigh = createMemberCircle(adultMemberHost, {
    title: 'Mega Stadium Gathering',
    city: 'Bengaluru',
    format: 'Small table conversation',
    intention: 'friendship',
    cadence: 'Monthly',
    maxCapacity: 50,
    description: 'Attempting to invite way too many people to a single small table conversation.',
  });
  assert.strictEqual(resHigh.success, false);
  assert.ok(resHigh.error?.includes('capacity_out_of_bounds'));

  // Try setting 2 (too low) -> Fails validation with capacity_out_of_bounds
  const resLow = createMemberCircle(adultMemberHost, {
    title: 'Two Person Table',
    city: 'Bengaluru',
    format: 'Small table conversation',
    intention: 'friendship',
    cadence: 'Monthly',
    maxCapacity: 2,
    description: 'Attempting to create a tiny table below minimum group capacity threshold.',
  });
  assert.strictEqual(resLow.success, false);
  assert.ok(resLow.error?.includes('capacity_out_of_bounds'));

  // Valid capacity (e.g. 16 seats) -> Successfully created
  const resValid = createMemberCircle(adultMemberHost, {
    title: 'Balanced Small Table Supper',
    city: 'Bengaluru',
    format: 'Small table conversation',
    intention: 'friendship',
    cadence: 'Monthly',
    maxCapacity: 16,
    description: 'A cozy dinner table conversation for sixteen curious participants.',
  });
  assert.strictEqual(resValid.success, true);
  assert.strictEqual(resValid.circle?.maxCapacity, 16);
});

test('Tribe Formation 5: Live Affinity Cohort Estimation enforces k >= 5 privacy suppression & zero name leakage', () => {
  // 1. Small cohort (< 5) is suppressed to prevent member re-identification
  const smallEstimate = estimateTribeAffinityCohort(
    testCohort,
    'p01-priya', // Excludes self
    'friendship',
    'Bengaluru',
    'C1_openness'
  );

  assert.strictEqual(smallEstimate.isSuppressed, true);
  assert.strictEqual(smallEstimate.estimatedCount, 0);
  assert.deepStrictEqual(smallEstimate.sampleMemberNames, []); // Zero names leaked
  assert.ok(smallEstimate.summaryNote.includes('suppressed for member privacy'));

  // 2. Cohort with >= 5 eligible members returns aggregate count without names
  const largeCohort = [
    ...testCohort,
    { ...peerCandidate1, id: 'c-peer-1', name: 'Peer One' },
    { ...peerCandidate1, id: 'c-peer-2', name: 'Peer Two' },
    { ...peerCandidate1, id: 'c-peer-3', name: 'Peer Three' },
    { ...peerCandidate1, id: 'c-peer-4', name: 'Peer Four' },
  ];
  const largeEstimate = estimateTribeAffinityCohort(
    largeCohort,
    'p01-priya',
    'friendship',
    'Bengaluru',
    'C1_openness'
  );

  assert.strictEqual(largeEstimate.isSuppressed, false);
  assert.strictEqual(largeEstimate.estimatedCount >= 5, true);
  assert.deepStrictEqual(largeEstimate.sampleMemberNames, []); // Zero names leaked
  assert.ok(largeEstimate.summaryNote.includes('share this community rhythm'));
});

test('Tribe Formation 6: Intention Boundary Invariant (Friendship & Cofounders ALLOWED; Dating & Matrimony FORBIDDEN)', () => {
  // 1. Friendship is allowed
  const friendRes = createMemberCircle(adultMemberHost, {
    title: 'Bengaluru Weekend Literature & Coffee Walk',
    city: 'Bengaluru',
    format: 'In-person walk',
    intention: 'friendship',
    cadence: 'Bi-weekly',
    maxCapacity: 14,
    description: 'A dedicated small group gathering tailored for members exploring friendship and books.',
    tribeTheme: 'Curious Explorers',
  });
  assert.strictEqual(friendRes.success, true);
  assert.strictEqual(friendRes.circle?.intention, 'friendship');

  // 2. Cofounders is allowed
  const cofounderRes = createMemberCircle(adultMemberHost, {
    title: 'Bangalore Weekend AI & Systems Coworking Sprint',
    city: 'Bengaluru',
    format: 'Coworking & sprint',
    intention: 'cofounders',
    cadence: 'Bi-weekly',
    maxCapacity: 10,
    description: 'Technical cofounders and builders collaborating on architecture and prototype milestones.',
    tribeTheme: 'Cofounder Builders',
  });
  assert.strictEqual(cofounderRes.success, true);
  assert.strictEqual(cofounderRes.circle?.intention, 'cofounders');

  // 3. Dating is strictly prohibited for member-initiated tribes
  const datingRes = createMemberCircle(adultMemberHost, {
    title: 'Singles Dating Mixer Group',
    city: 'Bengaluru',
    format: 'Small table conversation',
    intention: 'dating',
    cadence: 'Weekly',
    maxCapacity: 12,
    description: 'Attempting to create an open member-run dating group or mixer.',
  });
  assert.strictEqual(datingRes.success, false);
  assert.ok(datingRes.error?.includes('Member-initiated tribes and circles are strictly restricted to Friendship and Cofounders'));

  // 4. Matrimony is strictly prohibited for member-initiated tribes
  const matrimonyRes = createMemberCircle(adultMemberHost, {
    title: 'Open Matrimony Marriage Tribe',
    city: 'Bengaluru',
    format: 'Small table conversation',
    intention: 'matrimony',
    cadence: 'Weekly',
    maxCapacity: 12,
    description: 'Attempting to create an open member-run matrimony group.',
  });
  assert.strictEqual(matrimonyRes.success, false);
  assert.ok(matrimonyRes.error?.includes('Member-initiated tribes and circles are strictly restricted to Friendship and Cofounders'));
});

test('Tribe Formation 7: Direct Candidate Invitation & Duplicate Guardrail', () => {
  // Priya creates an Indiranagar Women-Only Circle focused on "Similar to Me"
  const circleRes = createMemberCircle(adultMemberHost, {
    title: 'Indiranagar Women Sunday Book & Coffee Walk',
    city: 'Bengaluru',
    format: 'In-person walk',
    intention: 'friendship',
    cadence: 'Every second Sunday',
    maxCapacity: 10,
    description: 'An intimate women-only gathering for literature, filter coffee, and quiet walks.',
    tribeTheme: 'Curious Explorers',
    cohortComfort: 'women_only',
    targetLens: 'similar_to_me',
  });
  assert.strictEqual(circleRes.success, true);
  const circle = circleRes.circle!;
  assert.strictEqual(circle.cohortComfort, 'women_only');
  assert.strictEqual(circle.targetLens, 'similar_to_me');
  assert.deepStrictEqual(circle.invitedMemberIds, []);

  // Priya invites Ananya from Discovery feed
  const inviteRes1 = inviteMemberToCircle(circle, 'p01-priya', peerCandidate1);
  assert.strictEqual(inviteRes1.success, true);
  assert.ok(inviteRes1.updatedCircle);
  assert.deepStrictEqual(inviteRes1.updatedCircle.invitedMemberIds, ['p02-ananya']);

  // Priya attempts to invite Ananya a second time (Duplicate guardrail)
  const inviteRes2 = inviteMemberToCircle(inviteRes1.updatedCircle, 'p01-priya', peerCandidate1);
  assert.strictEqual(inviteRes2.success, false);
  assert.ok(inviteRes2.error?.includes('already been invited'));
});

test('Tribe Formation 8: Host Identity, Capacity & Minor Protection on Invitation', () => {
  const circleRes = createMemberCircle(adultMemberHost, {
    title: 'Small Table Tea & Ideas',
    city: 'Bengaluru',
    format: 'Small table conversation',
    intention: 'friendship',
    cadence: 'Monthly',
    maxCapacity: 6,
    description: 'A cozy small table tea conversation for six curious participants.',
  });
  assert.strictEqual(circleRes.success, true);
  const circle = circleRes.circle!;

  // 1. Non-host attempts to invite a member
  const nonHostRes = inviteMemberToCircle(circle, 'p02-ananya', peerCandidate2);
  assert.strictEqual(nonHostRes.success, false);
  assert.ok(nonHostRes.error?.includes('Only the Founding Host'));

  // 2. Host attempts to invite unverified minor
  const minorRes = inviteMemberToCircle(circle, 'p01-priya', unverifiedMinorMember);
  assert.strictEqual(minorRes.success, false);
  assert.ok(minorRes.error?.includes('Adult verification 18+ required'));

  // 3. Full circle capacity enforcement
  const fullCircle = { ...circle, memberCount: 6 }; // Capacity reached
  const fullRes = inviteMemberToCircle(fullCircle, 'p01-priya', peerCandidate1);
  assert.strictEqual(fullRes.success, false);
  assert.ok(fullRes.error?.includes('reached its maximum small-table capacity'));
});
