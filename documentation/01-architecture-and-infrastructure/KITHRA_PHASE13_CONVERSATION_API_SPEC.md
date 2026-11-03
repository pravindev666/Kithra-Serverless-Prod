# KITHRA — PHASE 13: CONVERSATION API SPECIFICATION
## RESTful Endpoints, Schemas, & Security Guardrails

**Base URL:** `https://kithra-staging.<workers.dev>`  
**Auth Requirement:** `Authorization: Bearer <Firebase_ID_Token>` on all routes.

---

### 1. `GET /api/conversations`
Retrieves all active, non-hidden conversations for the authenticated member.

#### Request Headers
```http
GET /api/conversations HTTP/1.1
Authorization: Bearer <token>
```

#### Response `200 OK`
```json
{
  "success": true,
  "conversations": [
    {
      "id": "conv_84920491",
      "pair_id": "pair_usr_1_usr_2",
      "space": "friendship",
      "status": "active",
      "partner_id": "usr_meera_9402",
      "partner_name": "Meera Iyer",
      "partner_avatar": null,
      "unread_count": 0,
      "created_at": 1793710000000,
      "updated_at": 1793710500000,
      "last_message": {
        "id": "msg_001",
        "sender_id": "usr_meera_9402",
        "content": "Looking forward to our walk at Cubbon Park.",
        "sent_at": 1793710500000,
        "is_unsent": 0
      }
    }
  ]
}
```

---

### 2. `POST /api/conversations/pair`
Initializes or fetches the canonical conversation associated with an accepted pair connection.

#### Request Body
```json
{
  "partner_id": "usr_meera_9402",
  "space": "dating"
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "conversation": {
    "id": "conv_84920491",
    "pair_id": "pair_usr_1_usr_2",
    "space": "dating",
    "status": "active"
  }
}
```
*Note: Returns `404 Not Found` if no `accepted_connection` exists between the caller and partner.*

---

### 3. `GET /api/conversations/:id/messages`
Retrieves message history for a conversation. Automatically applies caller's `message_visibility` filters and placeholder replacements for unsent messages.

#### Request Parameters
- `limit` (optional, default `50`): Maximum messages to return.
- `before` (optional): Timestamp cursor for pagination.

#### Response `200 OK`
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_001",
      "conversation_id": "conv_84920491",
      "sender_id": "usr_aarav_1029",
      "receiver_id": "usr_meera_9402",
      "content": "Hi Meera!",
      "sent_at": 1793710000000,
      "is_unsent": 0,
      "is_mine": true
    },
    {
      "id": "msg_002",
      "conversation_id": "conv_84920491",
      "sender_id": "usr_meera_9402",
      "receiver_id": "usr_aarav_1029",
      "content": "[Message un-sent by sender]",
      "sent_at": 1793710100000,
      "is_unsent": 1,
      "is_mine": false
    }
  ]
}
```

---

### 4. `POST /api/conversations/:id/messages`
Sends a message within an active conversation.

#### Request Body
```json
{
  "content": "Would you like to meet at 4 PM?",
  "idempotency_key": "idem_uuid_48204"
}
```

#### Response `201 Created`
```json
{
  "success": true,
  "message": {
    "id": "msg_9841024",
    "conversation_id": "conv_84920491",
    "sender_id": "usr_aarav_1029",
    "receiver_id": "usr_meera_9402",
    "content": "Would you like to meet at 4 PM?",
    "sent_at": 1793710600000,
    "status": "sent",
    "is_unsent": 0
  }
}
```

#### Error Responses
- `403 Forbidden`: `Cannot send message: conversation is blocked.` (When either member has blocked the relationship).
- `404 Not Found`: Conversation does not exist or caller is not a participant.

---

### 5. `POST /api/messages/:id/delete-for-me`
Deletes a message from the caller's view without affecting the partner's thread.

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Message deleted from your view."
}
```

---

### 6. `POST /api/messages/:id/unsend`
Permanently overwrites message content with neutral notice for both participants. Only executable by original sender.

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Message un-sent for everyone."
}
```
*Note: Returns `403 Forbidden` if caller is not the sender.*

---

### 7. `POST /api/conversations/:id/hide`
Hides the conversation thread from caller's inbox ("Delete Conversation for Me").

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Conversation removed from your inbox."
}
```

---

### 8. `POST /api/members/:id/block`
Bilateral block terminating conversation, introductions, and discovery across all four spaces.

#### Response `200 OK`
```json
{
  "success": true,
  "message": "Member blocked successfully."
}
```
