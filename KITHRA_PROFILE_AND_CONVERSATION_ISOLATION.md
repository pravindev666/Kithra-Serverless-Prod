# KITHRA — PROFILE & CONVERSATION ISOLATION ARCHITECTURE
**Document Reference:** `KITHRA_PROFILE_AND_CONVERSATION_ISOLATION.md`  
**Phase:** 10 (Data Architecture & Backend Invariants)  
**Standard:** Strict Context-Segregated Storage & Server-Enforced Access Boundaries  

---

## 1. Single Authenticated Account, Multiple Isolated Profiles

In Kithra, a member has **one secure identity** (one Google/Email login, one verified adult identity, one subscription billing record), but holds **isolated, intention-scoped sub-profiles**:

```
                       ┌─────────────────────────────────────────┐
                       │        CENTRAL VERIFIED ACCOUNT         │
                       │ • Account ID: member-kavya-1029         │
                       │ • Phone & Email Verified (DPDP Act)     │
                       │ • Adult Verified: YES (Strict Fail-Safe)│
                       │ • Billing / Entitlement: 1-Year Pass    │
                       └────────────────────┬────────────────────┘
                                            │
         ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
         ▼                  ▼                               ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ FRIENDSHIP SCOPE │ │   DATING SCOPE   │ │ MATRIMONY SCOPE  │ │ COFOUNDER SCOPE  │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│ • Platonic Bio   │ │ • Romantic Bio   │ │ • Long-term Bio  │ │ • Executive Bio  │
│ • Reading/Hikes  │ │ • Pace: Evening  │ │ • Family Living  │ │ • Tech/GTM Stage │
│ • Casual Photos  │ │ • Solo Portrait  │ │ • Traditional Pic│ │ • Cap Table/Deck │
│ • Circle RSVPs   │ │ • Monogamy Gate  │ │ • In-Law Boundary│ │ • Weekly Hours    │
│ • Platonic Chats │ │ • Romantic Chats │ │ • Matrimony Kits │ │ • Work Slack/Chat│
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 2. Server-Enforced Field Quarantine Matrix

| Profile Attribute | Friendship Scope | Dating Scope | Matrimony Scope | Cofounder Beta Scope | Isolation Invariant |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Full Legal Name** | Hidden (First only) | Hidden (First only) | Optional Verified | Visible on verified connection | Never public to unauthenticated crawlers. |
| **Photos** | Per-Photo Switch | Per-Photo Switch | Per-Photo Switch | Professional headshot only | Every photo stores `visibleIn: Record<Space, boolean>`. |
| **Relationship Structure** | ❌ Ignored | **✅ Enforced Gate** | **✅ Enforced Gate** | ❌ Strictly Prohibited | Monogamy/open gates NEVER affect friendship. |
| **Children Preference** | ❌ Ignored | **✅ Enforced Gate** | **✅ Enforced Gate** | ❌ Strictly Prohibited | Family goals only evaluated in romance/marriage. |
| **In-Law Living Views** | ❌ Quarantined | ❌ Quarantined | **✅ Discoverable** | ❌ Strictly Prohibited | In-law expectations NEVER leak outside Matrimony. |
| **Financial Runway / Equity**| ❌ Quarantined | ❌ Quarantined | ❌ Quarantined | **✅ Discoverable** | Cap table data strictly isolated to Cofounders. |

---

## 3. Real Intention-Locked Introductions State Machine

Simulated preview toasts are replaced with a real, persisted state machine across the client store and server router:

```
               [ DRAFT ] ── (Member submits note)
                   │
                   ▼
               [ SENT ] ── (14-day expiry window)
              /   │    \
             /    │     \
   (Receiver)     │      (Sender)
  [ ACCEPTED ] [ DECLINED ] [ WITHDRAWN ]
       │
       ▼
 [ CONVERSATION ] ── (Permanently locked to intention)
```

### State Transition Definitions

1. **`draft`:** Note being composed in client modal. Not visible to recipient.
2. **`sent`:** Cryptographically validated, signed by sender's session, stored in backend. Active for exactly 14 calendar days.
3. **`accepted`:** Recipient consents to connect. Automatically registers cross-context connection in `connectedMemberIdsByIntention`, initializes conversation thread, and triggers notification.
4. **`declined`:** Recipient declines note. Closed neutrally with zero notification or feedback to sender (prevents harassment/badgering).
5. **`withdrawn`:** Sender revokes unread note before response. Purged from recipient's pending feed.
6. **`expired`:** Note unread/unanswered after 14 days. Soft-archived without penalty to either party.

---

## 4. Six-Point Authorization Checkpoint

Mutual eligibility is not just a UI badge. It is verified on the backend across 6 distinct interaction points:

```
Checkpoint 1: DISCOVERY QUERY ──────────> Fails closed if not mutually enabled/discoverable
Checkpoint 2: PROFILE RETRIEVAL ────────> Re-verifies no blocking or pair suppression
Checkpoint 3: INVITATION SUBMISSION ────> Enforces no self-matching & non-negotiable gates
Checkpoint 4: INVITATION ACCEPTANCE ────> Confirms recipient session identity
Checkpoint 5: CHAT THREAD INITIALIZATION ─> Binds thread permanently to intention
Checkpoint 6: MESSAGE TRANSMISSION ─────> Re-validates neither member blocked the other
```

If a member attempts to forge an API request (e.g. sending a message in a conversation where the other party subsequently blocked them or withdrew consent), the API Router returns **HTTP 403 Forbidden** immediately.

