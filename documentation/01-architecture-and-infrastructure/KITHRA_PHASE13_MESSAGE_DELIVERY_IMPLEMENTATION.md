# KITHRA — PHASE 13: MESSAGE DELIVERY IMPLEMENTATION
## Optimistic Updates, Delivery Indicators, Retry Loops & Idempotency

**Philosophy:** Unhurried, dependable communication. Kithra does not gamify chat with typing speedruns, read-receipt pressure, or anxiety-inducing presence dots.

---

### 1. Delivery State Lifecycle

Each outgoing message in the frontend UI transitions through three explicit states:

```
[ sending ] ──(D1 Write Confirmed)──> [ sent ]
     │
     └──(Network / Worker Error)──────> [ failed ] ──(User Tap)──> [ sending ]
```

1. **`sending` (Optimistic State):**
   - Message is generated client-side with a unique `idempotency_key` (UUID v4 + timestamp).
   - Displayed immediately in the UI thread with muted typography and a subtle badge: `Sending...`.
   - The send button resets to prevent accidental duplicate submission.

2. **`sent` (Authoritative State):**
   - Cloudflare Worker confirms write to D1.
   - Message updates with server-assigned `id`, timestamp, and subtle badge: `Sent`.
   - The badge fades after 3 seconds into quiet unhurried editorial presentation.

3. **`failed` (Error State):**
   - Triggered on network disconnection, Cloudflare 5xx, or authentication timeout.
   - UI preserves message text in place and shows an amber pill: `Failed • Click to Retry`.
   - Clicking triggers `handleRetrySendMessage`, reusing the original `idempotency_key`.

---

### 2. Idempotency Key De-duplication

To eliminate duplicate message inserts caused by cellular flaky connections or aggressive retry clicks:
1. Client generates `idempotency_key = "idem_" + crypto.randomUUID()`.
2. D1 checks the `messages` table for an existing row matching `(conversation_id, sender_id, idempotency_key)`:
   ```sql
   SELECT id, sent_at FROM messages 
   WHERE conversation_id = ? AND sender_id = ? AND idempotency_key = ?;
   ```
3. If a match is found, the existing message record is returned immediately with HTTP 200 without executing a second INSERT.
4. If no match is found, the INSERT executes normally and commits the `idempotency_key`.

---

### 3. Server-Assisted Encryption & Privacy Architecture

> [!IMPORTANT]
> **No E2EE Overclaiming:** Kithra explicitly does **NOT** claim end-to-end encryption (E2EE). E2EE requires client-side asymmetric key pairs (e.g., Signal Protocol) which would contradict legal moderation obligations for adult verification and member safety reporting under Indian law.
> 
> Kithra's messaging guarantees:
> - **Transport Security:** Strict TLS 1.3 encryption between client and Cloudflare Edge.
> - **Storage Security:** AES-256 server-side encryption at rest across Cloudflare D1 storage volumes in Singapore.
> - **Zero Ad-Targeting / Third-Party Tracking:** Messages are never indexed, analyzed for advertisements, or shared with external data brokers.
> - **Zero Raw Psychology Ingestion:** Messages are strictly isolated from the psychology engine; conversations do not train AI models.
