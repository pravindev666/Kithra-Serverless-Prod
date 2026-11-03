# KITHRA — PHASE 13: CROSS-CONTEXT CHAT SECURITY
## IDOR Prevention, Spoofing Countermeasures & Pair Isolation

**Security Standard:** Strict zero-trust backend authorization. Client headers or payload parameters are never trusted to establish identity or routing.

---

### 1. Vector 1: Client Receiver ID Spoofing (Defeated)

#### The Vulnerability
In naïve messaging systems, the client sends `{ conversation_id: "conv_1", receiver_id: "usr_victim", content: "..." }`. A malicious client could alter `receiver_id` to route messages or bypass access controls.

#### Kithra's Authoritative Defense
In `apiRouter.ts`, the server **ignores** any client-provided `receiverId`:
```typescript
// Look up canonical conversation
const conv = await d1Service.getConversationById(convId);
// Look up canonical pair
const pair = await d1Service.getPairRelationshipById(conv.pair_id);

// Derive authoritative partner from the pair relationship
const authoritativeReceiverId = (pair.member_a_id === callerId) 
  ? pair.member_b_id 
  : pair.member_a_id;

// Persist message with server-derived receiver
await d1Service.sendMessage(convId, callerId, authoritativeReceiverId, content, idempotencyKey);
```
Even if an attacker sends `receiver_id: "usr_attacker"`, the message is irrevocably bound and delivered only to the canonical pair partner.

---

### 2. Vector 2: Insecure Direct Object References (IDOR) on Conversations (Defeated)

#### The Vulnerability
An authenticated member (Attacker) guesses or enumerates a `conversation_id` belonging to Members B and C and attempts `GET /api/conversations/:id/messages`.

#### Kithra's Authoritative Defense
Before returning any messages, the server inspects the `conversation_participants` ledger:
```typescript
const participant = await d1.prepare(`
  SELECT 1 FROM conversation_participants 
  WHERE conversation_id = ? AND member_id = ?
`).bind(convId, callerId).first();

if (!participant) {
  return c.json({ error: 'Conversation not found or unauthorized' }, 404);
}
```
If the caller is not an explicit participant in the conversation, the server returns `404 Not Found`, denying existence and preventing unauthorized read access.

---

### 3. Vector 3: Cross-Space Intent Bleed & Replay (Defeated)

#### The Invariant
Members connected in `dating` must not have accidental conversational overlap with `cofounders` or `friendship`.
1. **Space Lock:** Each conversation row has an immutable `space` column matching the `active_space` of the parent `pair_relationships` row.
2. **Four-Space Suppression Invariant:** When `pair_relationships.relationship_state = 'accepted_connection'`, `suppression_status` is locked to `'all_spaces_suppressed'`.
3. Neither user can be matched or receive introductions in any other space while their primary connection is active.
4. Any attempt to forge an introduction or initiate a parallel conversation in another space returns `409 Conflict`.
