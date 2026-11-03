# KITHRA — PHASE 13: MESSAGE DELETE AND UNSEND
## Technical Implementation: "Delete for Me" vs "Unsend for Everyone"

**Philosophy:** Human communication requires grace, discretion, and the ability to correct mistakes without awkward residue.

---

### 1. Architectural Comparison

| Dimension | "Delete for Me" (`deleteMessageForMember`) | "Unsend for Everyone" (`unsendEligibleMessage`) |
| :--- | :--- | :--- |
| **User Intent** | "I want to clean up my screen / declutter my personal history." | "I made a typo or sent something by mistake and want it withdrawn." |
| **Who Can Trigger** | Either participant for any message in the conversation. | Only the original sender of the message. |
| **D1 Table Affected** | `message_visibility` (`INSERT ... ON CONFLICT DO UPDATE`) | `messages` (`UPDATE ... SET is_unsent = 1`) |
| **Message Content in DB** | Content remains intact in `messages` table for the partner. | Raw content is **immediately overwritten** with neutral placeholder. |
| **Partner Visibility** | Partner sees the message completely unaffected. | Partner sees `[Message un-sent by sender]` in muted italicized font. |
| **Time Limit** | Indefinite (available at any time). | Configurable withdrawal window (or unhurried grace period). |

---

### 2. "Delete for Me" Flow & Ledger Design

When Member A taps "Delete for Me" on message `msg_123`:
1. The client calls `POST /api/messages/msg_123/delete-for-me`.
2. The server confirms Member A is a participant in the message's conversation.
3. The server writes to the `message_visibility` ledger:
   ```sql
   INSERT INTO message_visibility (message_id, member_id, is_hidden, hidden_at)
   VALUES (?, ?, 1, ?)
   ON CONFLICT(message_id, member_id) DO UPDATE SET is_hidden = 1, hidden_at = excluded.hidden_at;
   ```
4. Subsequent fetches by Member A execute a filtered query:
   ```sql
   SELECT m.* FROM messages m
   WHERE m.conversation_id = ?
     AND m.id NOT IN (
       SELECT message_id FROM message_visibility 
       WHERE member_id = ? AND is_hidden = 1
     )
   ORDER BY m.sent_at ASC;
   ```
5. Member B's query does not match Member A's `member_id`, so Member B continues to see `msg_123` seamlessly.

---

### 3. "Unsend for Everyone" Flow & Content Sanitization

When Member A taps "Unsend" on message `msg_123`:
1. The client calls `POST /api/messages/msg_123/unsend`.
2. The server verifies `callerId === message.sender_id`. If another member attempts this, the request fails with `403 Forbidden`.
3. The server executes an authoritative D1 update:
   ```sql
   UPDATE messages
   SET is_unsent = 1,
       unsent_at = ?,
       content = '[Message un-sent by sender]'
   WHERE id = ? AND sender_id = ?;
   ```
4. **Permanent Content Removal:** The original message text is wiped from the database column. Even direct database inspections or memory dumps show only `[Message un-sent by sender]`.
5. Frontend UI renders unsent messages in a calm, non-accusatory italic tone:
   ```tsx
   <div className={`text-xs italic ${isMine ? 'text-stone-300' : 'text-stone-400'}`}>
     {msg.content}
   </div>
   ```
   Unsend and Delete actions are removed from unsent message bubbles.
