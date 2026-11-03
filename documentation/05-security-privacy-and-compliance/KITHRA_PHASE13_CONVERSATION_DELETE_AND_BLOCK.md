# KITHRA — PHASE 13: CONVERSATION DELETE AND BLOCK
## Technical Implementation: Inbox Suppression vs Bilateral Safety Block

**Mission Invariant:** Safety is fail-closed. A member must have sovereign control over who can contact them and what appears in their inbox.

---

### 1. "Delete Conversation for Me" (Inbox Suppression)

When a member wants to remove an entire thread from their active inbox without breaking their partner's thread or violating the canonical pair invariant:

1. **User Action:** Member taps "Delete Thread" in the chat thread header.
2. **API Endpoint:** `POST /api/conversations/:id/hide`.
3. **Database Ledger Update:**
   ```sql
   UPDATE conversation_participants
   SET is_hidden = 1,
       updated_at = ?
   WHERE conversation_id = ? AND member_id = ?;
   ```
4. **Behavioral Invariants:**
   - **Requester View:** The conversation is excluded from `GET /api/conversations` query (`WHERE is_hidden = 0`). The active thread closes and returns to the empty inbox state.
   - **Partner View:** Partner's inbox and message history remain completely intact (`is_hidden = 0` for partner).
   - **Suppression Invariant Preserved:** The pair relationship status remains `accepted_connection` with `suppression_status = 'all_spaces_suppressed'`. This prevents accidental duplicate pairings or re-introductions while the relationship is alive.

---

### 2. "Block Member" (Bilateral Safety Enforcement)

When a member triggers a block, safety takes precedence over conversational continuity:

1. **User Action:** Member taps "Block" in the chat thread header or confirmation dialog.
2. **API Endpoint:** `POST /api/members/:id/block`.
3. **Transactional Database Enforcement:**
   ```sql
   -- 1. Terminate pair relationship
   UPDATE pair_relationships
   SET relationship_state = 'blocked',
       updated_at = ?
   WHERE (member_a_id = ? AND member_b_id = ?) 
      OR (member_a_id = ? AND member_b_id = ?);

   -- 2. Freeze conversation status
   UPDATE conversations
   SET status = 'blocked',
       updated_at = ?
   WHERE pair_id = ?;

   -- 3. Record in authoritative blocks audit table
   INSERT INTO blocks (id, blocker_id, blocked_id, reason, created_at)
   VALUES (?, ?, ?, 'user_initiated_block', ?);
   ```

4. **Multi-Space Cascade:**
   - **Messaging Immediately Terminated:** Any subsequent call to `POST /api/conversations/:id/messages` returns `403 Forbidden` (`Cannot send message: conversation is blocked`).
   - **Introductions Blocked:** Any attempt to send introductions between the two members returns `403 Forbidden`.
   - **Discovery Suppression:** Both members are permanently excluded from candidate pools across all four spaces (`friendship`, `dating`, `matrimony`, `cofounders`). Neither profile will ever appear in the other's recommendations.
   - **Zero Retaliatory Leaks:** The blocked member is not notified with an aggressive alert. The thread quietly freezes into a read-only blocked state.
