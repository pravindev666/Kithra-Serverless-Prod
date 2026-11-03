# KITHRA — PHASE 14: PAIR CONVERSATION RECORD OWNERSHIP
## Multi-User Ownership, Access Control & Authorization Matrix

**Core Principle:** A conversation is not owned by an arbitrary host or server; it is co-owned strictly by the two verified members of an accepted canonical pair.

---

### 1. Ownership & Participation Verification Rules

Every conversation record in D1 is governed by three relational integrity invariants:

1. **Canonical Pair Anchor:**
   `conversations.pair_id` references `pair_relationships.pair_id`.
   A conversation cannot exist without a valid parent pair record.
2. **Explicit Participant Ledger:**
   `conversation_participants` holds exactly two records for a 1:1 conversation:
   `(conv_id, member_a_id)` and `(conv_id, member_b_id)`.
3. **Zero Third-Party Inspection:**
   No other user (even with a valid JWT token) can query or mutate messages belonging to a conversation they are not explicitly joined to in `conversation_participants`.

---

### 2. Authorization Flow Matrix

```
Client Request -> Worker Router -> Authentication Guard (JWT Validated)
                                           │
                                           ▼
                            Derive callerId from token
                                           │
                                           ▼
                        Inspect conversation_participants
                       (conversation_id, callerId)
                                     /             \
                             Found /                 \ Not Found
                                  /                   \
                                 ▼                     ▼
                       Authorize Operation     404 Not Found (Denied)
```

| Action | Caller Condition | DB Check | Result if False |
| :--- | :--- | :--- | :--- |
| **Fetch Messages** | Must be participant | `conversation_participants.member_id == callerId` | `404 Not Found` |
| **Send Message** | Must be participant & unblocked | `conversations.status == 'active'` AND participant | `403 Forbidden` / `404` |
| **Delete for Me** | Must be participant | Message belongs to conversation where caller is participant | `403 Forbidden` |
| **Unsend** | Must be original author | `messages.sender_id == callerId` | `403 Forbidden` |
| **Hide Conversation** | Must be participant | `conversation_participants.member_id == callerId` | `404 Not Found` |
| **Block Partner** | Must be participant | Caller is either `member_a_id` or `member_b_id` of pair | `403 Forbidden` |
