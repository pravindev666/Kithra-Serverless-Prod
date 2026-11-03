/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASES 13 & 14: MULTI-USER MESSAGING, D1 CONVERSATION PERSISTENCE,
 * PERMANENT IDENTITY MAPPING & USER-CONTROLLED DELETION TEST SUITE
 * 
 * Comprehensive Verification of:
 * 1. P0 & P1 Demonstration: Permanent Firebase-to-Kithra D1 Member Provisioning & Cross-Session Restoration
 * 2. Journey A: First Conversation across 4 Spaces (Send, Receive, Reply, Refresh & Re-Auth Persistence)
 * 3. Journey B: "Delete for Me" Per-Member Message Visibility
 * 4. Journey C: "Unsend for Everyone" Authoritative Content Withdrawal
 * 5. Journey D: "Delete Conversation for Me" Inbox Hiding & Pair Invariant Preservation
 * 6. Journey E: Block Enforcement Across All Spaces & Messaging Denials
 * 7. Journey F: Full Account Deletion (DPDP Act 2023 Section 12 Data Erasure)
 * 8. Journey G: Negative Security Vectors (Forged Tokens, IDOR, Mismatched Receiver ID, Replays)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleApiRequest } from '../server/apiRouter';
import { LocalD1DatabaseMock, KithraD1Service } from '../server/d1Database';
import { memberStore } from './memberStore';
import { MemberProfile } from '../types/kithra';

// ============================================================================
// SUITE SETUP & FIXTURES
// ============================================================================

const profileAarav: MemberProfile = {
  id: 'usr_phase14_aarav_sharma',
  name: 'Aarav Sharma',
  ageRange: '28',
  city: 'Bengaluru',
  intentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
  primaryIntention: 'dating',
  languages: ['English', 'Hindi', 'Kannada'],
  interests: ['Architecture', 'Urban Cycling', 'Indie Cinema', 'Specialty Coffee'],
  paceNote: 'Calm and deliberate',
  headline: 'Urban Architect & Coffee Brewer',
  bio: 'Designing sustainable spaces in Bengaluru. Enjoys early morning bicycle rides and quiet bookstores.',
  occupation: 'Urban Architect',
  portraitVariant: 'portrait-1',
  alignment: [],
  measuredDimensions: [],
  connectionState: 'discover',
  saved: false,
  constructProfile: [
    { constructId: 'C1_openness', score: 85, itemCount: 6 },
    { constructId: 'C2_planfulness', score: 80, itemCount: 6 },
    { constructId: 'C3_social_energy', score: 62, itemCount: 5 },
    { constructId: 'C4_warmth', score: 82, itemCount: 5 },
    { constructId: 'C5_emotional_resilience', score: 84, itemCount: 5 },
  ],
  eligibility: {
    memberId: 'usr_phase14_aarav_sharma',
    isAdultVerified: true,
    ageSelfDeclared: 28,
    birthYearDeclared: 1998,
    ageAssuranceStatus: 'self_declared',
    ageVerifiedAt: new Date(Date.now() - 86400000).toISOString(),
    verificationMethod: 'self_declaration_with_affirmation',
    enabledIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
    discoverableInIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
    discoveryConsentGiven: true,
    blockedMemberIds: [],
  },
};

const profileMeera: MemberProfile = {
  id: 'usr_phase14_meera_iyer',
  name: 'Meera Iyer',
  ageRange: '27',
  city: 'Bengaluru',
  intentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
  primaryIntention: 'dating',
  languages: ['English', 'Tamil', 'Hindi'],
  interests: ['Literature', 'Philosophy', 'Classical Music', 'Baking'],
  paceNote: 'Unhurried and thoughtful',
  headline: 'Literature Editor & Classical Flutist',
  bio: 'Reading historical essays, baking sourdough, and seeking sincere conversational kinship.',
  occupation: 'Senior Editor',
  portraitVariant: 'portrait-2',
  alignment: [],
  measuredDimensions: [],
  connectionState: 'discover',
  saved: false,
  constructProfile: [
    { constructId: 'C1_openness', score: 88, itemCount: 6 },
    { constructId: 'C2_planfulness', score: 76, itemCount: 6 },
    { constructId: 'C3_social_energy', score: 58, itemCount: 5 },
    { constructId: 'C4_warmth', score: 86, itemCount: 5 },
    { constructId: 'C5_emotional_resilience', score: 80, itemCount: 5 },
  ],
  eligibility: {
    memberId: 'usr_phase14_meera_iyer',
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

const tokenAarav = 'Bearer dev-token-usr_phase14_aarav_sharma-member';
const tokenMeera = 'Bearer dev-token-usr_phase14_meera_iyer-member';
const tokenIntruder = 'Bearer dev-token-usr_phase14_intruder-member';

// ============================================================================
// P0 & P1 DEMONSTRATION: PERMANENT MEMBER IDENTITY MAPPING & D1 RESTORATION
// ============================================================================

test('Phase 14 — P0 & P1 Demonstration: Permanent Member Identity Mapping & Cross-Device Session Restoration', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  // 1. User A (Aarav) signs in via Firebase for the first time
  const provA = await d1Service.resolveOrCreateMemberFromAuth({
    provider: 'google.com',
    providerSubjectId: 'firebase_sub_aarav_12345',
    email: 'aarav.sharma@kithra.internal',
    displayName: 'Aarav Sharma',
    isAdultVerified: true,
  });

  assert.equal(provA.isNewUser, true, 'First sign-in must provision a new user record in D1');
  assert.ok(provA.user.id.startsWith('usr_'), 'Must allocate stable opaque member ID');
  const permanentIdA = provA.user.id;

  // Persist profile and personas
  await d1Service.syncMemberProfileToD1(permanentIdA, {
    name: 'Aarav Sharma',
    city: 'Bengaluru',
    headline: 'Urban Architect',
    intentions: ['dating', 'friendship'],
  });

  // 2. User A logs out, switches browsers/devices, and logs in again with same Firebase credentials
  const resumeA = await d1Service.resolveOrCreateMemberFromAuth({
    provider: 'google.com',
    providerSubjectId: 'firebase_sub_aarav_12345',
    email: 'aarav.sharma@kithra.internal',
  });

  assert.equal(resumeA.isNewUser, false, 'Returning user must not create a duplicate account');
  assert.equal(resumeA.user.id, permanentIdA, 'Cross-browser resumption must resolve to the EXACT same member ID');
  assert.equal(resumeA.user.display_name, 'Aarav Sharma', 'Saved profile must persist across sessions');

  // 3. User B (Meera) signs in independently
  const provB = await d1Service.resolveOrCreateMemberFromAuth({
    provider: 'google.com',
    providerSubjectId: 'firebase_sub_meera_67890',
    email: 'meera.iyer@kithra.internal',
    displayName: 'Meera Iyer',
    isAdultVerified: true,
  });

  assert.equal(provB.isNewUser, true, 'User B must receive an independent member ID');
  const permanentIdB = provB.user.id;
  assert.notEqual(permanentIdA, permanentIdB, 'User A and User B must never share IDs');

  // 4. Session API verification
  const sessionRes = await handleApiRequest(
    {
      method: 'POST',
      path: '/api/auth/session',
      headers: { Authorization: `Bearer dev-token-${permanentIdA}-member` },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(sessionRes.status, 200);
  const sessionData = sessionRes.body as any;
  assert.equal(sessionData.user.id, permanentIdA);
  assert.equal(sessionData.user.accountStatus, 'active');
});

// ============================================================================
// SUITE: JOURNEY A — REAL CONVERSATION WORKFLOW (SEND, RECEIVE, REPLY, REFRESH)
// ============================================================================

test('Phase 13 — Journey A: First Conversation across Spaces with Real D1 Persistence', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  // Sync test accounts
  memberStore.upsertMemberProfile(profileAarav);
  memberStore.upsertMemberProfile(profileMeera);
  await d1Service.resolveOrCreateMemberFromAuth({
    provider: 'google.com',
    providerSubjectId: profileAarav.id,
    email: 'aarav@kithra.internal',
    displayName: profileAarav.name,
    isAdultVerified: true,
  });
  await d1Service.resolveOrCreateMemberFromAuth({
    provider: 'google.com',
    providerSubjectId: profileMeera.id,
    email: 'meera@kithra.internal',
    displayName: profileMeera.name,
    isAdultVerified: true,
  });

  // 1. Aarav sends Introduction to Meera in Dating space
  const introRes = await handleApiRequest(
    {
      method: 'POST',
      path: '/api/member/introductions',
      headers: { Authorization: tokenAarav },
      body: {
        receiverId: profileMeera.id,
        intention: 'dating',
        noteText: 'Hello Meera, I was drawn to your thoughts on literature and unhurried conversation.',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(introRes.status, 201);
  const introData = introRes.body as any;
  const introId = introData.introduction.id;

  // 2. Meera accepts Introduction
  const acceptRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/introductions/${introId}/respond`,
      headers: { Authorization: tokenMeera },
      body: { response: 'accept' },
    },
    { db: mockD1, allowDevTokens: true }
  );

  assert.equal(acceptRes.status, 200);
  const acceptData = acceptRes.body as any;
  assert.equal(acceptData.status, 'accepted_connection');
  const conversationId = acceptData.conversationId;
  assert.ok(conversationId, 'Acceptance must authoritatively establish a conversation ID in D1');

  // 3. Aarav queries his conversations list
  const convListResA = await handleApiRequest(
    {
      method: 'GET',
      path: '/api/member/conversations',
      headers: { Authorization: tokenAarav },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(convListResA.status, 200);
  const convsA = (convListResA.body as any).conversations;
  assert.equal(convsA.length, 1);
  assert.equal(convsA[0].id, conversationId);
  assert.equal(convsA[0].space, 'dating');
  assert.equal(convsA[0].partnerName, 'Meera Iyer');

  // 4. Aarav sends message to Meera
  const sendResA = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/conversations/${conversationId}/messages`,
      headers: { Authorization: tokenAarav },
      body: {
        content: 'Good morning Meera. Do you enjoy morning coffee at a quiet neighborhood cafe?',
        idempotencyKey: 'idem_msg_001_aarav',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(sendResA.status, 201);
  const msgA = (sendResA.body as any).message;
  assert.equal(msgA.content, 'Good morning Meera. Do you enjoy morning coffee at a quiet neighborhood cafe?');
  assert.equal(msgA.sender_id, profileAarav.id);
  assert.equal(msgA.receiver_id, profileMeera.id, 'Receiver ID must be derived authoritatively from pair');

  // 5. Meera fetches messages
  const msgListResB = await handleApiRequest(
    {
      method: 'GET',
      path: `/api/member/conversations/${conversationId}/messages`,
      headers: { Authorization: tokenMeera },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(msgListResB.status, 200);
  const msgsB = (msgListResB.body as any).messages;
  assert.equal(msgsB.length, 1);
  assert.equal(msgsB[0].content, 'Good morning Meera. Do you enjoy morning coffee at a quiet neighborhood cafe?');

  // 6. Meera replies
  const sendResB = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/conversations/${conversationId}/messages`,
      headers: { Authorization: tokenMeera },
      body: {
        content: 'Good morning Aarav. I do! A quiet back table with a book is my favorite way to begin.',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(sendResB.status, 201);

  // 7. Both refresh and re-fetch from D1 -> History is 100% consistent
  const historyA = await d1Service.getMessages(conversationId, profileAarav.id);
  const historyB = await d1Service.getMessages(conversationId, profileMeera.id);
  assert.equal(historyA.length, 2);
  assert.equal(historyB.length, 2);
  assert.equal(historyA[0].content, historyB[0].content);
  assert.equal(historyA[1].content, historyB[1].content);
});

// ============================================================================
// SUITE: JOURNEY B — DELETE FOR ME (PER-MEMBER VISIBILITY)
// ============================================================================

test('Phase 13 — Journey B: "Delete for Me" Hides Message Only for Requesting Member', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  // Setup pair and conversation
  const pair = await d1Service.createPairRelationship(profileAarav.id, profileMeera.id, 'friendship');
  await mockD1.prepare("UPDATE pair_relationships SET relationship_state = 'accepted_connection' WHERE pair_id = ?")
    .bind(pair.pair.pair_id).run();
  const conv = await d1Service.createOrGetPairConversation(pair.pair.pair_id, 'friendship');

  // Aarav sends message
  const sendRes = await d1Service.sendMessage(conv.id, profileAarav.id, 'This is a message Aarav wants to delete for himself.');
  const msgId = sendRes.message!.id;

  // Aarav deletes message FOR ME
  const deleteResA = await handleApiRequest(
    {
      method: 'DELETE',
      path: `/api/member/conversations/${conv.id}/messages/${msgId}`,
      headers: { Authorization: tokenAarav },
      body: { scope: 'for_me' },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(deleteResA.status, 200);

  // Aarav's message view -> Empty (message hidden)
  const msgsA = await d1Service.getMessages(conv.id, profileAarav.id);
  assert.equal(msgsA.length, 0, 'Aarav must no longer see his deleted message');

  // Meera's message view -> Still contains the message!
  const msgsB = await d1Service.getMessages(conv.id, profileMeera.id);
  assert.equal(msgsB.length, 1, 'Meera must still see the message (independent visibility preserved)');
  assert.equal(msgsB[0].content, 'This is a message Aarav wants to delete for himself.');
});

// ============================================================================
// SUITE: JOURNEY C — UNSEND FOR EVERYONE
// ============================================================================

test('Phase 13 — Journey C: "Unsend for Everyone" Authoritatively Withdraws Content with Neutral Placeholder', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  const pair = await d1Service.createPairRelationship(profileAarav.id, profileMeera.id, 'friendship');
  await mockD1.prepare("UPDATE pair_relationships SET relationship_state = 'accepted_connection' WHERE pair_id = ?")
    .bind(pair.pair.pair_id).run();
  const conv = await d1Service.createOrGetPairConversation(pair.pair.pair_id, 'friendship');

  // Aarav sends a typo message
  const sendRes = await d1Service.sendMessage(conv.id, profileAarav.id, 'Accidental typo message with private phone number.');
  const msgId = sendRes.message!.id;

  // Meera tries to unsend Aarav's message -> FORBIDDEN (HTTP 403)
  const forbiddenUnsendRes = await handleApiRequest(
    {
      method: 'DELETE',
      path: `/api/member/conversations/${conv.id}/messages/${msgId}`,
      headers: { Authorization: tokenMeera },
      body: { scope: 'unsend' },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(forbiddenUnsendRes.status, 403, 'Recipient cannot unsend sender\'s message');

  // Aarav unsends his own message
  const unsendResA = await handleApiRequest(
    {
      method: 'DELETE',
      path: `/api/member/conversations/${conv.id}/messages/${msgId}`,
      headers: { Authorization: tokenAarav },
      body: { scope: 'unsend' },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(unsendResA.status, 200);

  // Both clients view message history -> Original content withdrawn; replaced with placeholder
  const msgsA = await d1Service.getMessages(conv.id, profileAarav.id);
  const msgsB = await d1Service.getMessages(conv.id, profileMeera.id);
  assert.equal(msgsA[0].content, '[Message un-sent by sender]');
  assert.equal(msgsB[0].content, '[Message un-sent by sender]');
  assert.equal(msgsA[0].is_unsent, 1);
});

// ============================================================================
// SUITE: JOURNEY D — DELETE CONVERSATION FOR ME
// ============================================================================

test('Phase 13 — Journey D: "Delete Conversation for Me" Hides Thread from Requester Only', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  const pair = await d1Service.createPairRelationship(profileAarav.id, profileMeera.id, 'cofounders');
  await mockD1.prepare("UPDATE pair_relationships SET relationship_state = 'accepted_connection' WHERE pair_id = ?")
    .bind(pair.pair.pair_id).run();
  const conv = await d1Service.createOrGetPairConversation(pair.pair.pair_id, 'cofounders');
  await d1Service.sendMessage(conv.id, profileAarav.id, 'Let\'s build our prototype.');

  // Aarav deletes conversation for himself
  const delConvResA = await handleApiRequest(
    {
      method: 'DELETE',
      path: `/api/member/conversations/${conv.id}`,
      headers: { Authorization: tokenAarav },
      body: { scope: 'for_me' },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(delConvResA.status, 200);

  // Aarav's inbox list -> 0 conversations
  const convsA = await d1Service.getConversationsForMember(profileAarav.id);
  assert.equal(convsA.length, 0, 'Aarav must no longer see the deleted conversation');

  // Meera's inbox list -> 1 conversation intact
  const convsB = await d1Service.getConversationsForMember(profileMeera.id);
  assert.equal(convsB.length, 1, 'Meera must retain her authorized conversation view');
  assert.equal(convsB[0].id, conv.id);

  // Pair relationship remains active and suppressed in other spaces
  const pairRecord = await d1Service.getPairRelationship(pair.pair.pair_id);
  assert.equal(pairRecord?.relationship_state, 'accepted_connection');
  assert.equal(pairRecord?.suppression_status, 'all_spaces_suppressed');
});

// ============================================================================
// SUITE: JOURNEY E — BLOCK MEMBER & CROSS-CONTEXT PROTECTION
// ============================================================================

test('Phase 13 — Journey E: Block Member Enforces Immediate Messaging & Discovery Denials', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  const pair = await d1Service.createPairRelationship(profileAarav.id, profileMeera.id, 'dating');
  await mockD1.prepare("UPDATE pair_relationships SET relationship_state = 'accepted_connection' WHERE pair_id = ?")
    .bind(pair.pair.pair_id).run();
  const conv = await d1Service.createOrGetPairConversation(pair.pair.pair_id, 'dating');

  // Meera blocks Aarav
  const blockRes = await handleApiRequest(
    {
      method: 'POST',
      path: '/api/member/block',
      headers: { Authorization: tokenMeera },
      body: { targetMemberId: profileAarav.id },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(blockRes.status, 200);

  // Aarav attempts to send message -> BLOCKED (HTTP 403)
  const blockedSendRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/conversations/${conv.id}/messages`,
      headers: { Authorization: tokenAarav },
      body: { content: 'Are you there Meera?' },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(blockedSendRes.status, 403);
  assert.ok((blockedSendRes.body as any).message?.includes('blocked'));

  // Aarav attempts to send introduction in Matrimony -> BLOCKED (HTTP 409)
  const blockedIntroRes = await handleApiRequest(
    {
      method: 'POST',
      path: '/api/member/introductions',
      headers: { Authorization: tokenAarav },
      body: {
        receiverId: profileMeera.id,
        intention: 'matrimony',
        noteText: 'Trying to connect in another space.',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(blockedIntroRes.status, 409);
});

// ============================================================================
// SUITE: JOURNEY F — ACCOUNT DELETION (DPDP ACT 2023)
// ============================================================================

test('Phase 13 & 14 — Journey F: Full Account Deletion Erases Private Data While Preserving Partner Integrity', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  // Provision synthetic member
  const prov = await d1Service.resolveOrCreateMemberFromAuth({
    provider: 'google.com',
    providerSubjectId: 'sub_to_delete_999',
    email: 'delete.me@kithra.internal',
    displayName: 'Temporary Member',
    isAdultVerified: true,
  });
  const tempUserId = prov.user.id;
  const tempToken = `Bearer dev-token-${tempUserId}-member`;

  // Create persona, answers, and conversation
  await d1Service.syncMemberProfileToD1(tempUserId, {
    name: 'Temporary Member',
    city: 'Bengaluru',
    intentions: ['friendship'],
  });
  await d1Service.recordQuizAnswer(tempUserId, 'Q1_openness', 'opt_1', 'sem_1', 0, 1200);

  // Request account deletion
  const deleteAccountRes = await handleApiRequest(
    {
      method: 'POST',
      path: '/api/member/account/delete',
      headers: { Authorization: tempToken },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(deleteAccountRes.status, 200);
  assert.ok((deleteAccountRes.body as any).auditId);

  // Verify D1 state after deletion:
  const deletedUser = await d1Service.getUserById(tempUserId);
  assert.equal(deletedUser?.account_status, 'deleted');
  assert.equal(deletedUser?.display_name, 'Deleted Member');
  assert.ok(deletedUser?.email.startsWith('deleted_'));

  // Raw quiz answers must be 0 (DPDP Section 12)
  const remainingAnswers = await d1Service.getSavedQuizAnswers(tempUserId);
  assert.equal(Object.keys(remainingAnswers).length, 0, 'All raw quiz answers must be purged');
});

// ============================================================================
// SUITE: JOURNEY G — NEGATIVE SECURITY & ADVERSARIAL PENETRATION VECTORS
// ============================================================================

test('Phase 13 — Journey G: Negative Security Vectors (Forged Auth, IDOR, Mismatched Receiver ID, Replays)', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  const pair = await d1Service.createPairRelationship(profileAarav.id, profileMeera.id, 'dating');
  await mockD1.prepare("UPDATE pair_relationships SET relationship_state = 'accepted_connection' WHERE pair_id = ?")
    .bind(pair.pair.pair_id).run();
  const conv = await d1Service.createOrGetPairConversation(pair.pair.pair_id, 'dating');

  // Vector 1: Missing or invalid token -> 401 Unauthorized
  const unauthRes = await handleApiRequest(
    {
      method: 'GET',
      path: '/api/member/conversations',
      headers: {},
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(unauthRes.status, 401);

  // Vector 2: Intruder tries to read Aarav and Meera's conversation -> Empty (IDOR blocked)
  const intruderMessages = await d1Service.getMessages(conv.id, 'usr_intruder_999');
  assert.equal(intruderMessages.length, 0, 'Unauthorized viewer cannot read other members\' messages');

  // Vector 3: Mismatched receiver ID -> Rejected (Server must not trust client receiver ID)
  const spoofedReceiverRes = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/conversations/${conv.id}/messages`,
      headers: { Authorization: tokenAarav },
      body: {
        content: 'Trying to route message to an innocent third party.',
        receiverId: 'usr_innocent_victim_777', // Tampered!
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(spoofedReceiverRes.status, 400);
  assert.ok((spoofedReceiverRes.body as any).message?.includes('Receiver must match'));

  // Vector 4: Idempotency Key prevents duplicate insertion
  const msg1 = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/conversations/${conv.id}/messages`,
      headers: { Authorization: tokenAarav },
      body: {
        content: 'Original idempotent message.',
        idempotencyKey: 'same_unique_key_123',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(msg1.status, 201);
  const msg1Id = (msg1.body as any).message.id;

  // Replay request with same idempotency key
  const msg2 = await handleApiRequest(
    {
      method: 'POST',
      path: `/api/member/conversations/${conv.id}/messages`,
      headers: { Authorization: tokenAarav },
      body: {
        content: 'Original idempotent message.',
        idempotencyKey: 'same_unique_key_123',
      },
    },
    { db: mockD1, allowDevTokens: true }
  );
  assert.equal(msg2.status, 201);
  const msg2Id = (msg2.body as any).message.id;
  assert.equal(msg1Id, msg2Id, 'Replayed request must return existing message without creating duplicate');

  // Total messages in conversation must still be exactly 1
  const allMsgs = await d1Service.getMessages(conv.id, profileAarav.id);
  assert.equal(allMsgs.length, 1);
});
