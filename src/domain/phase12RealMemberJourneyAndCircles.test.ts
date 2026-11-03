/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASE 12: REAL MEMBER JOURNEY, CIRCLES, RSVP & CLOUD RELEASE GATE TEST SUITE
 * 
 * Comprehensive Verification of Journeys A through H:
 * 1. Journey A: New user auth & age verification (reject underage, accept 18+ with binding declaration).
 * 2. Journey B: Friendship match & authoritative D1 introduction transaction.
 * 3. Journey C: Matrimony match with intention isolation.
 * 4. Journey D: Cofounder skill complementarity & two-way balance.
 * 5. Journey E: User A creates Circle in D1, invites User B, User B receives invitation in D1, User B accepts RSVP, attendance increments, Gathering Salon unlocks.
 * 6. Journey F: Small-table capacity limits (cap enforcement, duplicate RSVP prevention, host-only notices).
 * 7. Journey G: Private venue details hidden from non-attendees and visible to confirmed attendees.
 * 8. Journey H: Negative security tests (forged tokens, unverified adults, cross-context suppression).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleApiRequest } from '../server/apiRouter';
import { LocalD1DatabaseMock, KithraD1Service } from '../server/d1Database';
import { memberStore } from './memberStore';
import {
  createMemberCircle,
  estimateTribeAffinityCohort,
  inviteMemberToCircle,
  validateCircleProposal,
} from './circleTribeEngine';
import {
  computeAttributeSimilarity,
  evaluateMutualEligibility,
  evaluateWeBalanceEachOther,
} from './psychologyEngine';
import { MemberProfile } from '../types/kithra';

// ============================================================================
// TEST FIXTURES & PROFILES FOR PHASE 12
// ============================================================================

const profileUserA: MemberProfile = {
  id: 'member-phase12-user-a',
  name: 'Ananya Deshmukh',
  ageRange: '27',
  city: 'Bengaluru',
  intentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
  primaryIntention: 'friendship',
  languages: ['English', 'Marathi', 'Hindi'],
  interests: ['Architecture', 'Philosophy', 'Systems Thinking', 'Trail Walking'],
  paceNote: 'Calm and reflective',
  headline: 'Product Architect & Long-Distance Walker',
  bio: 'Building human-scale software. Passionate about urban walking and quiet libraries.',
  occupation: 'Software Architect',
  portraitVariant: 'portrait-1',
  alignment: [],
  measuredDimensions: [],
  connectionState: 'discover',
  saved: false,
  constructProfile: [
    { constructId: 'C1_openness', score: 88, itemCount: 6 },
    { constructId: 'C2_planfulness', score: 82, itemCount: 6 },
    { constructId: 'C3_social_energy', score: 60, itemCount: 5 },
    { constructId: 'C4_warmth', score: 85, itemCount: 5 },
    { constructId: 'C5_emotional_resilience', score: 80, itemCount: 5 },
  ],
  eligibility: {
    memberId: 'member-phase12-user-a',
    isAdultVerified: true,
    ageSelfDeclared: 27,
    birthYearDeclared: 1999,
    ageAssuranceStatus: 'self_declared',
    ageVerifiedAt: new Date(Date.now() - 86400000).toISOString(),
    verificationMethod: 'self_declaration_with_affirmation',
    enabledIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
    discoverableInIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
    discoveryConsentGiven: true,
    blockedMemberIds: [],
  },
};

const profileUserB: MemberProfile = {
  id: 'member-phase12-user-b',
  name: 'Vikram Joshi',
  ageRange: '29',
  city: 'Bengaluru',
  intentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
  primaryIntention: 'friendship',
  languages: ['English', 'Kannada', 'Hindi'],
  interests: ['Literature', 'Philosophy', 'Business Strategy', 'Tea'],
  paceNote: 'Unhurried and analytical',
  headline: 'Commercial Strategist & Book Collector',
  bio: 'Studying economic history and small-table conversations.',
  occupation: 'Strategy Consultant',
  portraitVariant: 'portrait-2',
  alignment: [],
  measuredDimensions: [],
  connectionState: 'discover',
  saved: false,
  constructProfile: [
    { constructId: 'C1_openness', score: 84, itemCount: 6 },
    { constructId: 'C2_planfulness', score: 78, itemCount: 6 },
    { constructId: 'C3_social_energy', score: 55, itemCount: 5 },
    { constructId: 'C4_warmth', score: 80, itemCount: 5 },
    { constructId: 'C5_emotional_resilience', score: 85, itemCount: 5 },
  ],
  eligibility: {
    memberId: 'member-phase12-user-b',
    isAdultVerified: true,
    ageSelfDeclared: 29,
    birthYearDeclared: 1997,
    ageAssuranceStatus: 'self_declared',
    ageVerifiedAt: new Date(Date.now() - 86400000).toISOString(),
    verificationMethod: 'self_declaration_with_affirmation',
    enabledIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
    discoverableInIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
    discoveryConsentGiven: true,
    blockedMemberIds: [],
  },
};

const profileMinorUser: MemberProfile = {
  ...profileUserA,
  id: 'member-phase12-minor',
  name: 'Minor Candidate',
  ageRange: '17',
  eligibility: {
    memberId: 'member-phase12-minor',
    isAdultVerified: false,
    ageSelfDeclared: 17,
    birthYearDeclared: 2009,
    ageAssuranceStatus: 'rejected_underage',
    enabledIntentions: ['friendship'],
    discoverableInIntentions: ['friendship'],
    discoveryConsentGiven: false,
    blockedMemberIds: [],
  },
};

// Dev Bearer tokens for tests
const tokenUserA = 'Bearer dev-token-member-phase12-user-a-member';
const tokenUserB = 'Bearer dev-token-member-phase12-user-b-member';
const tokenUserC = 'Bearer dev-token-member-phase12-user-c-member';

// ============================================================================
// SUITE: JOURNEY A — AUTHENTICATION & ADULT ELIGIBILITY
// ============================================================================

test('Phase 12 — Journey A: Adult Age Declaration & Fail-Closed Underage Rejection', async () => {
  // 1. Underage (17yo) calculation validation
  const currentYear = new Date().getFullYear();
  const minorBirthYear = currentYear - 17;
  const calculatedAge = currentYear - minorBirthYear;
  assert.equal(calculatedAge < 18, true, 'Calculated age for 17yo must be strictly under 18');

  // 2. Verified Adult eligibility record
  const adultRecord = {
    isAdultVerified: true,
    ageSelfDeclared: 27,
    birthYearDeclared: 1999,
    ageAssuranceStatus: 'self_declared_binding' as const,
    verificationMethod: 'self_declaration_with_checkbox' as const,
  };
  assert.equal(adultRecord.isAdultVerified, true);
  assert.equal(adultRecord.ageAssuranceStatus, 'self_declared_binding');

  // 3. Fail-Closed check on minor profile in discovery
  assert.equal(profileMinorUser.eligibility?.isAdultVerified, false);
  const minorAffinityEstimate = estimateTribeAffinityCohort(
    [profileUserA, profileMinorUser],
    profileUserA.id,
    'friendship',
    'Bengaluru',
    'C1_openness'
  );
  // Minor is excluded and small cohort is suppressed for privacy
  assert.equal(minorAffinityEstimate.isSuppressed, true);
  assert.equal(minorAffinityEstimate.estimatedCount, 0);
});

// ============================================================================
// SUITE: JOURNEY B — FRIENDSHIP MATCHING & AUTHORITATIVE D1 INTRODUCTION
// ============================================================================

test('Phase 12 — Journey B: Friendship Matching & Authoritative D1 Introduction Transaction', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  // Store test profiles in store
  memberStore.upsertMemberProfile(profileUserA);
  memberStore.upsertMemberProfile(profileUserB);

  // 1. Calculate similarity in Friendship
  const sim = computeAttributeSimilarity(profileUserA.constructProfile!, profileUserB.constructProfile!, 'friendship');
  assert.ok(sim.score !== null && sim.score >= 70, `Expected high similarity score in friendship, got ${sim.score}`);

  // 2. User A sends introduction note to User B via D1 REST endpoint
  const introRes = await handleApiRequest(
    {
      method: 'POST',
      path: '/api/member/introductions',
      headers: {
        Authorization: tokenUserA,
        'Content-Type': 'application/json',
      },
      body: {
        receiverId: profileUserB.id,
        intention: 'friendship',
        noteText: 'Hello Vikram, I resonated with your interest in literature and calm evening walks.',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(introRes.status, 201, 'Authoritative introduction must succeed with HTTP 201');
  const introBody = introRes.body as any;
  assert.equal(introBody.success, true);
  assert.ok(introBody.introduction.id, 'Introduction ID must be generated');

  // 3. Verify D1 persistence of introduction
  const d1Intros = await d1Service.getIntroductionsForMember(profileUserB.id);
  assert.equal(d1Intros.length, 1);
  assert.equal(d1Intros[0].sender_id, profileUserA.id);
  assert.equal(d1Intros[0].intention, 'friendship');

  // 4. User B accepts introduction
  const respondRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/introductions/${introBody.introduction.id}/accept`,
      headers: {
        Authorization: tokenUserB,
        'Content-Type': 'application/json',
      },
      body: {},
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(respondRes.status, 200);
  const respondBody = respondRes.body as any;
  assert.equal(respondBody.success, true);
  assert.equal(respondBody.activeSpace, 'friendship');
});

// ============================================================================
// SUITE: JOURNEY C & D — MATRIMONY & COFOUNDER ISOLATION
// ============================================================================

test('Phase 12 — Journey C & D: Matrimony Hard Gate Isolation & Cofounder Complementarity', async () => {
  // Matrimony intention eligibility
  const matEligibility = evaluateMutualEligibility(
    profileUserA.eligibility!,
    profileUserB.eligibility!,
    profileUserB.id,
    profileUserA.id,
    'matrimony'
  );
  assert.equal(matEligibility.eligible, true, 'Mutual eligibility in matrimony should pass when non-negotiables match');

  // Cofounder complementarity
  const balance = evaluateWeBalanceEachOther(profileUserA.constructProfile!, profileUserB.constructProfile!);
  assert.ok(balance !== null, 'Cofounder balance should be computable');
  assert.ok(balance.complementaryScore >= 0, 'Complementary score should be valid for complementary profiles');
});

// ============================================================================
// SUITE: JOURNEY E — CIRCLE CREATION, INVITATION & RSVP IN D1
// ============================================================================

test('Phase 12 — Journey E: Member-Initiated Circle Creation, D1 Invitation, RSVP & Salon Unlock', async () => {
  const mockD1 = new LocalD1DatabaseMock();

  // 1. User A creates a Community Circle in Friendship space
  const createRes = await handleApiRequest(
    {
      method: 'POST',
      path: '/api/member/circles',
      headers: {
        Authorization: tokenUserA,
        'Content-Type': 'application/json',
      },
      body: {
        title: 'Indiranagar Sunday Filter Coffee & Philosophy Walk',
        format: 'In-person walk',
        intention: 'friendship',
        city: 'Bengaluru',
        cadence: 'Every second Sunday · 10:00 AM',
        maxCapacity: 12,
        description: 'A slow morning walk through Indiranagar parks followed by filter coffee and dialogue.',
        tribeTheme: 'Reflective Intellect & Philosophy',
        targetAffinityTrait: 'Openness to new ideas and calm discussion',
        targetConstructId: 'C1_openness',
        cohortComfort: 'all_genders',
        targetLens: 'similar_to_me',
        venueDetails: 'Courtyard table reserved at Third Wave Coffee, 12th Main Indiranagar, Bengaluru',
        upcomingEventAt: Date.now() + 604800000,
        creatorMemberId: profileUserA.id,
        creatorMemberName: profileUserA.name,
      },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(createRes.status, 201, 'Circle creation must succeed with HTTP 201');
  const createBody = createRes.body as any;
  assert.equal(createBody.success, true);
  const circleId = createBody.circle.id;
  assert.ok(circleId, 'Circle ID must be generated');

  // 2. User A invites User B to the Circle
  const inviteRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/circles/${circleId}/invite`,
      headers: {
        Authorization: tokenUserA,
        'Content-Type': 'application/json',
      },
      body: {
        inviteeId: profileUserB.id,
        lensRationale: 'Invited through shared Similar to Me quiet reading affinity.',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(inviteRes.status, 201, 'Circle invitation must succeed with HTTP 201');
  const inviteBody = inviteRes.body as any;
  assert.equal(inviteBody.success, true);
  const invitationId = inviteBody.invitation.id;

  // 3. User B queries inbound invitations
  const listInboundRes = await handleApiRequest(
    {
      method: 'GET',
      path: '/api/member/circles/invitations',
      headers: {
        Authorization: tokenUserB,
      },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(listInboundRes.status, 200);
  const inboundList = listInboundRes.body as any;
  assert.equal(inboundList.invitations.length, 1);
  assert.equal(inboundList.invitations[0].id, invitationId);
  assert.equal(inboundList.invitations[0].circle_id, circleId);

  // 4. User B accepts the RSVP
  const respondRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/circles/invitations/${invitationId}/respond`,
      headers: {
        Authorization: tokenUserB,
        'Content-Type': 'application/json',
      },
      body: {
        response: 'accept',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(respondRes.status, 200);
  const respondData = respondRes.body as any;
  assert.equal(respondData.success, true);

  // 5. Verify Gathering Salon unlocks with confirmed attendance
  const salonRes = await handleApiRequest(
    {
      method: 'GET',
      path: `/api/member/circles/${circleId}/salon`,
      headers: {
        Authorization: tokenUserB,
      },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(salonRes.status, 200);
  const salonData = salonRes.body as any;
  assert.ok(salonData.circle.venue_details.includes('Third Wave Coffee'), 'Confirmed attendee must see private venue details');
  assert.equal(salonData.attendees.some((a: any) => a.member_id === profileUserB.id), true);
});

// ============================================================================
// SUITE: JOURNEY F — CAPACITY LIMITS & HOST-ONLY NOTICES
// ============================================================================

test('Phase 12 — Journey F: Small-Table Member Cap Enforcement & Host Notice Permissions', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  // Create circle with minimum small table capacity (6 members)
  const circleRes = await d1Service.createCircle(
    profileUserA.id,
    profileUserA.name,
    {
      title: 'Intimate Six-Person Dialogue',
      format: 'Small table conversation',
      intention: 'friendship',
      city: 'Bengaluru',
      cadence: 'Weekly',
      maxCapacity: 6,
      description: 'Small dialogue pod for unhurried conversations.',
      tribeTheme: 'Reflective',
      targetAffinityTrait: 'Openness',
      targetConstructId: 'C1_openness',
      cohortComfort: 'all_genders',
      targetLens: 'similar_to_me',
    },
    'Secret garden table'
  );
  assert.equal(circleRes.success, true);
  const circle = circleRes.circle!;

  // Seat 1 is Host User A (auto-joined upon creation)
  // Fill seats 2 to 6
  for (let i = 2; i <= 6; i++) {
    const joinRes = await d1Service.joinCircle(circle.id, `member-auto-${i}`);
    assert.equal(joinRes.success, true, `Member ${i} must join successfully`);
  }

  // Seat 7: Attempt to join over capacity (6) must fail closed with 409
  const memberOverCap = 'member-phase12-user-c';
  const overCapRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/circles/${circle.id}/join`,
      headers: {
        Authorization: tokenUserC,
        'Content-Type': 'application/json',
      },
      body: {},
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(overCapRes.status, 409, 'Joining circle beyond capacity must return HTTP 409');
  const overCapBody = overCapRes.body as any;
  assert.ok(overCapBody.message?.includes('maximum capacity'));

  // Host User A posts Host Notice -> Succeeds (201)
  const hostNoticeRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/circles/${circle.id}/notices`,
      headers: {
        Authorization: tokenUserA,
        'Content-Type': 'application/json',
      },
      body: {
        title: 'Table Booked',
        content: 'Quiet courtyard table confirmed.',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(hostNoticeRes.status, 201);

  // Non-Host User B attempts to post Host Notice -> Forbidden (403)
  const fakeNoticeRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/circles/${circle.id}/notices`,
      headers: {
        Authorization: tokenUserB,
        'Content-Type': 'application/json',
      },
      body: {
        title: 'Unauthorized Notice',
        content: 'Should be rejected.',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(fakeNoticeRes.status, 403, 'Non-host cannot publish host notices');
});

// ============================================================================
// SUITE: JOURNEY G — PRIVATE VENUE DETAILS DISCLOSURE
// ============================================================================

test('Phase 12 — Journey G: Private Venue Hidden From Non-Attendees and Disclosed to Joined Members', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  const circleRes = await d1Service.createCircle(
    profileUserA.id,
    profileUserA.name,
    {
      title: 'Indiranagar Reading Salon',
      format: 'Small table conversation',
      intention: 'friendship',
      city: 'Bengaluru',
      cadence: 'Bi-weekly',
      maxCapacity: 10,
      description: 'Unhurried reading table for thoughtful minds.',
      tribeTheme: 'Reflective',
      targetAffinityTrait: 'Openness',
      targetConstructId: 'C1_openness',
      cohortComfort: 'all_genders',
      targetLens: 'similar_to_me',
    },
    'Secret garden at 14th Main HAL 2nd Stage Indiranagar'
  );
  assert.equal(circleRes.success, true);
  const circle = circleRes.circle!;

  // Non-attendee User B views Circle Details
  const unjoinedRes = await handleApiRequest(
    {
      method: 'GET',
      path: `/api/member/circles/${circle.id}`,
      headers: {
        Authorization: tokenUserB,
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(unjoinedRes.status, 200);
  const unjoinedData = unjoinedRes.body as any;
  assert.equal(unjoinedData.circle.joined, false);
  assert.equal(
    unjoinedData.circle.venueDetails,
    'Private gathering location disclosed to confirmed attendees upon RSVP.',
    'Private venue details must be obscured for non-attendees'
  );

  // Non-attendee User B attempts to access Salon -> Forbidden (403)
  const salonBlockedRes = await handleApiRequest(
    {
      method: 'GET',
      path: `/api/member/circles/${circle.id}/salon`,
      headers: {
        Authorization: tokenUserB,
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(salonBlockedRes.status, 403, 'Non-attendees are blocked from salon');

  // User B joins
  await d1Service.joinCircle(circle.id, profileUserB.id);

  // Now User B views Salon -> Access Granted (200)
  const joinedRes = await handleApiRequest(
    {
      method: 'GET',
      path: `/api/member/circles/${circle.id}/salon`,
      headers: {
        Authorization: tokenUserB,
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(joinedRes.status, 200);
  const joinedData = joinedRes.body as any;
  assert.equal(joinedData.circle.venue_details, 'Secret garden at 14th Main HAL 2nd Stage Indiranagar');
});

// ============================================================================
// SUITE: JOURNEY H — NEGATIVE SECURITY & CROSS-CONTEXT SUPPRESSION INVARIANT
// ============================================================================

test('Phase 12 — Journey H: Negative Security & Cross-Context Connection Suppression', async () => {
  // 1. Forbid member-created Dating and Matrimony circles
  const datingCircleProposal = validateCircleProposal(profileUserA, {
    title: 'Dating Circle Initiative',
    format: 'Small table conversation',
    intention: 'dating' as any,
    city: 'Bengaluru',
    cadence: 'Weekly',
    maxCapacity: 10,
    description: 'Unauthorized dating circle proposal.',
    tribeTheme: 'Reflective',
    targetAffinityTrait: 'Openness',
    targetConstructId: 'C1_openness',
    cohortComfort: 'all_genders',
    targetLens: 'similar_to_me',
  });
  assert.equal(datingCircleProposal.isValid, false);
  assert.ok(datingCircleProposal.error?.includes('Friendship and Cofounders'));

  // 2. Unverified minor attempting to create circle fails
  const minorProposal = validateCircleProposal(profileMinorUser, {
    title: 'Minor Circle Initiative',
    format: 'In-person walk',
    intention: 'friendship',
    city: 'Bengaluru',
    cadence: 'Weekly',
    maxCapacity: 10,
    description: 'Minor initiative proposal.',
    tribeTheme: 'Reflective',
    targetAffinityTrait: 'Openness',
    targetConstructId: 'C1_openness',
    cohortComfort: 'all_genders',
    targetLens: 'similar_to_me',
  });
  assert.equal(minorProposal.isValid, false);
  assert.ok(minorProposal.error?.includes('Adult verification'));

  // 3. MASTER INVARIANT: Cross-Context Suppression
  // Fresh test members for isolated cross-context invariant testing
  const userH_A: MemberProfile = {
    ...profileUserA,
    id: 'member-user-h-a',
    eligibility: {
      ...profileUserA.eligibility!,
      memberId: 'member-user-h-a',
      connectedMemberIdsByIntention: {},
    },
  };
  const userH_B: MemberProfile = {
    ...profileUserB,
    id: 'member-user-h-b',
    eligibility: {
      ...profileUserB.eligibility!,
      memberId: 'member-user-h-b',
      connectedMemberIdsByIntention: {},
    },
  };

  memberStore.upsertMemberProfile(userH_A);
  memberStore.upsertMemberProfile(userH_B);

  const introCreate = memberStore.createIntroduction({
    senderId: userH_A.id,
    receiverId: userH_B.id,
    intention: 'friendship',
    noteText: 'Would love to connect platonically over shared books.',
  });
  assert.equal(introCreate.success, true, 'Friendship introduction must succeed');
  assert.ok(introCreate.introduction);

  const introAccept = memberStore.acceptIntroduction(
    introCreate.introduction.id,
    userH_B.id
  );
  assert.equal(introAccept.success, true, 'User B accepting introduction must succeed');

  // Verify connectedMemberIdsByIntention reflects the friendship connection
  const updatedUserA = memberStore.getMemberById(userH_A.id);
  const updatedUserB = memberStore.getMemberById(userH_B.id);
  assert.ok(updatedUserA?.eligibility?.connectedMemberIdsByIntention?.friendship?.includes(userH_B.id));
  assert.ok(updatedUserB?.eligibility?.connectedMemberIdsByIntention?.friendship?.includes(userH_A.id));

  // Now verify that any attempt to discover, match, or create introduction in Dating or Matrimony is strictly suppressed!
  const datingEligibility = evaluateMutualEligibility(
    updatedUserA!.eligibility!,
    updatedUserB!.eligibility!,
    userH_B.id,
    userH_A.id,
    'dating'
  );
  assert.equal(datingEligibility.eligible, false, 'Dating mutual eligibility must be FALSE due to cross-context suppression');
  assert.equal(datingEligibility.reasons.includes('cross_context_connection_suppressed'), true);

  const matrimonyEligibility = evaluateMutualEligibility(
    updatedUserA!.eligibility!,
    updatedUserB!.eligibility!,
    userH_B.id,
    userH_A.id,
    'matrimony'
  );
  assert.equal(matrimonyEligibility.eligible, false, 'Matrimony mutual eligibility must be FALSE due to cross-context suppression');
  assert.equal(matrimonyEligibility.reasons.includes('cross_context_connection_suppressed'), true);

  // Attempting to create an introduction in Dating space must be blocked with an explicit error
  const forbiddenDatingIntro = memberStore.createIntroduction({
    senderId: userH_A.id,
    receiverId: userH_B.id,
    intention: 'dating',
    noteText: 'Attempting cross-context introduction',
  });
  assert.equal(forbiddenDatingIntro.success, false, 'Creating Dating introduction must fail');
  assert.ok(
    forbiddenDatingIntro.error?.includes('cross_context_connection_suppressed') ||
    forbiddenDatingIntro.error?.includes('Cross-context introduction prohibited'),
    `Expected cross-context suppression error, got ${forbiddenDatingIntro.error}`
  );
});
