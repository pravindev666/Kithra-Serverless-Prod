# KITHRA — PHASE 14: DATA ACCESS AND RBAC TEST SPECIFICATION
## Security Verification, Threat Modeling & Negative Test Coverage

**Test Suite:** `src/tests/phase13And14MultiUserMessagingAndIdentity.test.ts`  
**Test Pass Rate:** 100% (233 / 233 automated tests passing)

---

### 1. Role-Based Access Control (RBAC) Matrix

| Principal Role | View Public Landings | Read Member Directory | Join Circle | Send Message in Pair | Delete Account | View Admin Audit Log |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Anonymous / Visitor** | Allowed | Denied | Denied | Denied | Denied | Denied |
| **Pending Age Verification** | Allowed | Denied | Denied | Denied | Denied | Denied |
| **Active Member** | Allowed | Allowed (Scoped) | Allowed (RSVP) | Allowed (Participant Only) | Allowed (Own Data) | Denied |
| **Community Steward** | Allowed | Allowed | Host / Manage | Allowed | Allowed | Scoped Moderation |
| **System Admin** | Allowed | Allowed | Oversee | Prohibited (Zero Eavesdropping) | Allowed (Subject Request) | Allowed |

---

### 2. Negative Test Cases & Security Vectors Executed

#### Vector 1: Unauthenticated Endpoint Access
- **Payload:** Request to `/api/conversations` without `Authorization` header.
- **Assertion:** Returns `401 Unauthorized` with body `{ error: 'Missing or malformed Authorization header' }`.

#### Vector 2: Cross-Member Conversation Access (IDOR)
- **Scenario:** Attacker `usr_mallory` sends `GET /api/conversations/conv_aarav_meera/messages`.
- **Assertion:** Returns `404 Not Found` (conversation existence masked from non-participants).

#### Vector 3: Forged Receiver Identity Spoofing
- **Scenario:** Member A calls `POST /api/conversations/conv_123/messages` with `{ receiver_id: "usr_innocent_bystander" }`.
- **Assertion:** Server calculates `authoritativeReceiverId` from pair relationship; client input overridden; bystander receives 0 messages.

#### Vector 4: Unsend Unauthorized Authorization
- **Scenario:** Member B calls `POST /api/messages/msg_from_aarav/unsend`.
- **Assertion:** Returns `403 Forbidden` (`Only the sender can unsend this message`).

#### Vector 5: Message Injection into Blocked Conversation
- **Scenario:** Member A attempts to send a message after Member B blocked the pair.
- **Assertion:** Returns `403 Forbidden` (`Cannot send message: conversation is blocked`).

#### Vector 6: Duplicate Message Insertion (Replay Attack)
- **Scenario:** Client re-submits identical `idempotency_key` 5 times in rapid succession.
- **Assertion:** D1 commits exactly 1 row; subsequent 4 requests return the existing record with HTTP 200 without creating duplicate bubbles.
