/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHASE 10: FOUR-INTENTION ARCHITECTURE, CROSS-CONTEXT PRIVACY FIREWALL & PERMUTATION TESTS
 * 
 * Tests:
 * 1. Task 3: User A and User B exact scenario (Friendship, Dating, Matrimony, Cofounders).
 * 2. Task 4: Complete exhaustive 15x15 intention subset permutation generator (900 evaluation points).
 * 3. Task 5: Cross-Context Privacy Firewall (Cofounder connection auto-suppression in Dating/Matrimony).
 * 4. Task 10: Intention-locked introduction state machine (Draft -> Sent -> Accepted / Declined / Withdrawn).
 * 5. Invariants: Adult verification fail-closed, 'all' discovery eligibility enforcement, zero cross-context leakage.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateMutualEligibility,
  filterProfilesByFullSimilaritySpectrum,
} from './psychologyEngine';
import { memberStore } from './memberStore';
import {
  ExtendedIntentionId,
  IntentionId,
  MemberEligibilityRequirements,
  MemberProfile,
} from '../types/kithra';

test('Phase 10 — Task 3: User A and User B Exact Scenario (Both Viewing Directions)', () => {
  // User A: Friendship (Y), Dating (Y), Matrimony (N), Cofounders (N)
  const userA: MemberEligibilityRequirements = {
    memberId: 'user-a',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating'] as IntentionId[],
    discoverableInIntentions: ['friendship', 'dating'] as IntentionId[],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
  };

  // User B: Friendship (N), Dating (Y), Matrimony (Y), Cofounders (N)
  const userB: MemberEligibilityRequirements = {
    memberId: 'user-b',
    isAdultVerified: true,
    enabledIntentions: ['dating', 'matrimony'] as IntentionId[],
    discoverableInIntentions: ['dating', 'matrimony'] as IntentionId[],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
  };

  const spaces: ExtendedIntentionId[] = ['friendship', 'dating', 'matrimony', 'cofounders'];

  // Test Direction 1: A viewing B
  for (const space of spaces) {
    const res = evaluateMutualEligibility(userA, userB, 'user-b', 'user-a', space as IntentionId);
    if (space === 'dating') {
      assert.strictEqual(res.eligible, true, 'User A and B must be eligible in Dating');
      assert.strictEqual(res.reasons.length, 0);
    } else {
      assert.strictEqual(
        res.eligible,
        false,
        `User A and B must NOT be discoverable in ${space}`
      );
      assert.ok(
        res.reasons.includes('intention_not_mutually_enabled'),
        `Reason in ${space} must be intention_not_mutually_enabled`
      );
    }
  }

  // Test Direction 2: B viewing A
  for (const space of spaces) {
    const res = evaluateMutualEligibility(userB, userA, 'user-a', 'user-b', space as IntentionId);
    if (space === 'dating') {
      assert.strictEqual(res.eligible, true, 'User B and A must be eligible in Dating');
      assert.strictEqual(res.reasons.length, 0);
    } else {
      assert.strictEqual(
        res.eligible,
        false,
        `User B and A must NOT be discoverable in ${space}`
      );
      assert.ok(
        res.reasons.includes('intention_not_mutually_enabled'),
        `Reason in ${space} must be intention_not_mutually_enabled`
      );
    }
  }
});

test('Phase 10 — Task 4: Exhaustive Permutation Matrix (15x15 subsets x 4 spaces = 900 points)', () => {
  const allSpaces: ExtendedIntentionId[] = ['friendship', 'dating', 'matrimony', 'cofounders'];

  // Generate all 15 non-empty subsets of the 4 spaces (2^4 - 1 = 15)
  const nonZeroSubsets: ExtendedIntentionId[][] = [];
  for (let mask = 1; mask < 1 << allSpaces.length; mask++) {
    const subset: ExtendedIntentionId[] = [];
    for (let i = 0; i < allSpaces.length; i++) {
      if ((mask & (1 << i)) !== 0) {
        subset.push(allSpaces[i]);
      }
    }
    nonZeroSubsets.push(subset);
  }
  assert.strictEqual(nonZeroSubsets.length, 15, 'Must generate exactly 15 non-empty subsets');

  let evaluatedPoints = 0;
  let discoverablePoints = 0;

  for (const subsetA of nonZeroSubsets) {
    for (const subsetB of nonZeroSubsets) {
      const memberA: MemberEligibilityRequirements = {
        memberId: `perm-a-${subsetA.join('-')}`,
        isAdultVerified: true,
        enabledIntentions: subsetA as IntentionId[],
        discoverableInIntentions: subsetA as IntentionId[],
        blockedMemberIds: [],
        relationshipStructure: 'flexible_either',
      };

      const memberB: MemberEligibilityRequirements = {
        memberId: `perm-b-${subsetB.join('-')}`,
        isAdultVerified: true,
        enabledIntentions: subsetB as IntentionId[],
        discoverableInIntentions: subsetB as IntentionId[],
        blockedMemberIds: [],
        relationshipStructure: 'flexible_either',
      };

      for (const space of allSpaces) {
        evaluatedPoints++;
        const res = evaluateMutualEligibility(
          memberA,
          memberB,
          memberB.memberId!,
          memberA.memberId!,
          space as IntentionId
        );

        const bothShared = subsetA.includes(space) && subsetB.includes(space);
        if (bothShared) {
          assert.strictEqual(
            res.eligible,
            true,
            `Expected eligible when both share ${space} (A: [${subsetA}], B: [${subsetB}])`
          );
          discoverablePoints++;
        } else {
          assert.strictEqual(
            res.eligible,
            false,
            `Expected ineligible when not both sharing ${space} (A: [${subsetA}], B: [${subsetB}])`
          );
        }
      }
    }
  }

  assert.strictEqual(evaluatedPoints, 900, 'Evaluated exactly 15 x 15 x 4 = 900 permutation points');
  assert.ok(discoverablePoints > 0, 'Discovered valid intersection points across subsets');
});

test('Phase 10 — Task 5: Cross-Context Privacy Firewall (Cofounder Connection Auto-Suppression)', () => {
  // Member A and Member B connect as Cofounders
  const memberA: MemberEligibilityRequirements = {
    memberId: 'cofounder-alice',
    isAdultVerified: true,
    enabledIntentions: ['dating', 'matrimony'] as IntentionId[],
    discoverableInIntentions: ['dating', 'matrimony'] as IntentionId[],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    // Connected to Bob in cofounders!
    connectedMemberIdsByIntention: {
      cofounders: ['cofounder-bob'],
    },
    hideCrossContextConnectionsByDefault: true,
  };

  const memberB: MemberEligibilityRequirements = {
    memberId: 'cofounder-bob',
    isAdultVerified: true,
    enabledIntentions: ['dating', 'matrimony'] as IntentionId[],
    discoverableInIntentions: ['dating', 'matrimony'] as IntentionId[],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    connectedMemberIdsByIntention: {
      cofounders: ['cofounder-alice'],
    },
    hideCrossContextConnectionsByDefault: true,
  };

  // 1. Both have Dating and Matrimony enabled and compatible
  // BUT because they are cofounder connections, Cross-Context Firewall MUST suppress them in Dating and Matrimony!
  const datingRes = evaluateMutualEligibility(
    memberA,
    memberB,
    'cofounder-bob',
    'cofounder-alice',
    'dating'
  );
  assert.strictEqual(datingRes.eligible, false);
  assert.ok(
    datingRes.reasons.includes('cross_context_connection_suppressed'),
    'Must be suppressed by Cross-Context Privacy Firewall'
  );

  const matrimonyRes = evaluateMutualEligibility(
    memberA,
    memberB,
    'cofounder-bob',
    'cofounder-alice',
    'matrimony'
  );
  assert.strictEqual(matrimonyRes.eligible, false);
  assert.ok(
    matrimonyRes.reasons.includes('cross_context_connection_suppressed'),
    'Must be suppressed in Matrimony'
  );

  // 2. Explicit Pair-Level Exclusion Control ("Hide this person in this space")
  const memberC: MemberEligibilityRequirements = {
    memberId: 'friend-charlie',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating'] as IntentionId[],
    discoverableInIntentions: ['friendship', 'dating'] as IntentionId[],
    blockedMemberIds: [],
    pairExclusions: [
      {
        id: 'excl-1',
        memberIdA: 'friend-charlie',
        memberIdB: 'friend-dan',
        scope: 'space_specific',
        excludedSpace: 'dating',
        reason: 'user_hidden',
        createdAt: Date.now(),
      },
    ],
  };

  const memberD: MemberEligibilityRequirements = {
    memberId: 'friend-dan',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating'] as IntentionId[],
    discoverableInIntentions: ['friendship', 'dating'] as IntentionId[],
    blockedMemberIds: [],
  };

  // Friendship: Discoverable!
  const friendshipRes = evaluateMutualEligibility(
    memberC,
    memberD,
    'friend-dan',
    'friend-charlie',
    'friendship'
  );
  assert.strictEqual(friendshipRes.eligible, true);

  // Dating: Suppressed by space-specific exclusion!
  const datingExclRes = evaluateMutualEligibility(
    memberC,
    memberD,
    'friend-dan',
    'friend-charlie',
    'dating'
  );
  assert.strictEqual(datingExclRes.eligible, false);
  assert.ok(datingExclRes.reasons.includes('pair_privacy_exclusion_active'));
});

test('Phase 10 — Task 10: Real Intention-Locked Introduction State Machine', () => {
  // Create introduction between Kavya and Aarav in Friendship
  const introRes = memberStore.createIntroduction({
    senderId: 'member-kavya',
    receiverId: 'member-aarav',
    intention: 'friendship',
    noteText: 'Hello Aarav, I appreciated your reflection on quiet tea and typography walks.',
  });

  assert.strictEqual(introRes.success, true);
  assert.ok(introRes.introduction);
  assert.strictEqual(introRes.introduction.state, 'sent');
  assert.strictEqual(introRes.introduction.intention, 'friendship');

  // Prevent duplicate while sent
  const dupRes = memberStore.createIntroduction({
    senderId: 'member-kavya',
    receiverId: 'member-aarav',
    intention: 'friendship',
    noteText: 'Trying to send another note before response...',
  });
  assert.strictEqual(dupRes.success, false);
  assert.ok(dupRes.error?.includes('already exists'));

  // Accept introduction
  const acceptRes = memberStore.acceptIntroduction(introRes.introduction.id, 'member-aarav');
  assert.strictEqual(acceptRes.success, true);
  assert.strictEqual(acceptRes.introduction?.state, 'accepted');

  // Check that cross-context connection record was created in member store
  const kavya = memberStore.getMemberById('member-kavya');
  assert.ok(
    kavya?.eligibility?.connectedMemberIdsByIntention?.friendship?.includes('member-aarav')
  );

  // Anti-Self Matching
  const selfRes = memberStore.createIntroduction({
    senderId: 'member-kavya',
    receiverId: 'member-kavya',
    intention: 'friendship',
    noteText: 'Note to myself',
  });
  assert.strictEqual(selfRes.success, false);
  assert.ok(selfRes.error?.includes('yourself'));
});

test('Phase 10 — Invariant: Adult Verification Fails Closed', () => {
  const adultViewer: MemberEligibilityRequirements = {
    memberId: 'adult-v',
    isAdultVerified: true,
    enabledIntentions: ['dating'] as IntentionId[],
    discoverableInIntentions: ['dating'] as IntentionId[],
    blockedMemberIds: [],
  };

  const unverifiedCandidate: MemberEligibilityRequirements = {
    memberId: 'unverified-c',
    // Neither isAdult nor isAdultVerified is true
    isAdultVerified: false,
    enabledIntentions: ['dating'] as IntentionId[],
    discoverableInIntentions: ['dating'] as IntentionId[],
    blockedMemberIds: [],
  };

  const res = evaluateMutualEligibility(
    adultViewer,
    unverifiedCandidate,
    'unverified-c',
    'adult-v',
    'dating'
  );
  assert.strictEqual(res.eligible, false);
  assert.ok(res.reasons.includes('adult_verification_required_fail_closed'));
});

test('Phase 10 — Invariant: "all" Discovery Never Bypasses Mutual Eligibility (Finding C)', () => {
  const viewer: MemberEligibilityRequirements = {
    memberId: 'viewer-monogamous',
    isAdultVerified: true,
    enabledIntentions: ['dating'] as IntentionId[],
    discoverableInIntentions: ['dating'] as IntentionId[],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
  };

  const candidateConflicting: MemberProfile = {
    id: 'cand-open',
    name: 'Conflicting Candidate',
    city: 'Bengaluru',
    intentions: ['dating'],
    primaryIntention: 'dating',
    alignment: [],
    compatibilityMetrics: [] as any,
    similarityScore: 98, // Very high similarity!
    eligibility: {
      memberId: 'cand-open',
      isAdultVerified: true,
      enabledIntentions: ['dating'],
      discoverableInIntentions: ['dating'],
      blockedMemberIds: [],
      relationshipStructure: 'open_required', // Conflict!
      relationshipStructureImportance: 'essential_dealbreaker',
    },
  } as unknown as MemberProfile;

  // Filter with intention === 'all'
  const results = filterProfilesByFullSimilaritySpectrum([candidateConflicting], {
    intention: 'all',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
    viewerEligibility: viewer,
    viewerId: 'viewer-monogamous',
  });

  // MUST NOT BYPASS! Candidate has essential conflict in Dating, so even under 'all' they must be excluded!
  assert.strictEqual(
    results.length,
    0,
    'Candidate with conflicting non-negotiables must be filtered out under "all"'
  );
});

test('Phase 10 — Invariant: Global Block Instantly Overrides All 4 Spaces', () => {
  const spaces: ExtendedIntentionId[] = ['friendship', 'dating', 'matrimony', 'cofounders'];

  const memberA: MemberEligibilityRequirements = {
    memberId: 'blocker-a',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating', 'matrimony'] as IntentionId[],
    discoverableInIntentions: ['friendship', 'dating', 'matrimony'] as IntentionId[],
    blockedMemberIds: ['blocked-b'],
  };

  const memberB: MemberEligibilityRequirements = {
    memberId: 'blocked-b',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating', 'matrimony'] as IntentionId[],
    discoverableInIntentions: ['friendship', 'dating', 'matrimony'] as IntentionId[],
    blockedMemberIds: [],
  };

  for (const space of spaces) {
    const resA = evaluateMutualEligibility(
      memberA,
      memberB,
      'blocked-b',
      'blocker-a',
      space as IntentionId
    );
    assert.strictEqual(resA.eligible, false);
    assert.ok(resA.reasons.includes('member_block_active'));

    const resB = evaluateMutualEligibility(
      memberB,
      memberA,
      'blocker-a',
      'blocked-b',
      space as IntentionId
    );
    assert.strictEqual(resB.eligible, false);
    assert.ok(resB.reasons.includes('member_block_active'));
  }
});
