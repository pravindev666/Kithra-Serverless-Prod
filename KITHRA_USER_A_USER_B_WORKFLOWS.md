# KITHRA — USER A & USER B WORKFLOW SPECIFICATION
**Document Reference:** `KITHRA_USER_A_USER_B_WORKFLOWS.md`  
**Phase:** 10 (Multi-Intention Architecture)  
**Core Benchmark:** The User A vs. User B Canonical Scenario  

---

## 1. The Canonical Profile Setup

```
┌────────────────────────────────────────┐       ┌────────────────────────────────────────┐
│             USER A (Kavya)             │       │             USER B (Meera)             │
├────────────────────────────────────────┤       ├────────────────────────────────────────┤
│ • Friendship:   ✅ ENABLED (Active)     │       │ • Friendship:   ❌ DISABLED            │
│ • Dating:       ✅ ENABLED (Active)     │       │ • Dating:       ✅ ENABLED (Active)     │
│ • Matrimony:    ❌ DISABLED            │       │ • Matrimony:    ✅ ENABLED (Active)     │
│ • Cofounders:   ❌ DISABLED            │       │ • Cofounders:   ❌ DISABLED            │
├────────────────────────────────────────┤       ├────────────────────────────────────────┤
│ Preferences:                           │       │ Preferences:                           │
│ • Dating Pace:  Unhurried evening msgs │       │ • Dating Pace:  Thoughtful reflections │
│ • Structure:    Monogamous (Essential) │       │ • Structure:    Monogamous (Essential) │
│ • City:         Bengaluru              │       │ • City:         Bengaluru              │
└────────────────────────────────────────┘       └────────────────────────────────────────┘
```

---

## 2. Space-by-Space Mutual Discovery Breakdown

### Space 1: Friendship (`friendship`)
* **User A Perspective:** User A browses the Friendship directory looking for community circle participants or reading companions.
  - **Does User A see User B?** **NO.** User B has disabled Friendship.
  - **Why:** User B's account is completely suppressed from Friendship queries. User A never knows User B exists on Kithra in this space.
* **User B Perspective:** User B cannot even open the Friendship directory without activating the space.
  - **Does User B see User A?** **NO.**
* **Result:** **Zero Discovery.** Friendship boundaries are 100% airtight.

---

### Space 2: Dating (`dating`)
* **User A Perspective:** User A opens the Dating tab.
  - **Does User A see User B?** **YES (Potentially).**
  - **Criteria Checked:**
    1. Both are verified adults (`isAdultVerified === true`).
    2. Both have `dating` in `enabledIntentions`.
    3. Both have `dating` in `discoverableInIntentions`.
    4. Mutual relationship structure check passes (both are monogamous).
    5. Neither has blocked the other.
    6. No cross-context privacy exclusions exist.
  - **What User A sees:** User B's Dating portrait (solo 4:5), bio written for Dating, conversational pace note, and shared psychological ground (echoes, counterpoints, and mosaic traits).
  - **What is HIDDEN from User A:** User B's Matrimony in-law living preferences, dowry/joint finance perspectives, and family biodata.
* **User B Perspective:** User B opens the Dating tab.
  - **Does User B see User A?** **YES (Symmetric).**
  - **What User B sees:** User A's Dating profile and attribute similarity score.
  - **What is HIDDEN from User B:** The fact that User A is active in the Friendship space.
* **Result:** **Valid Mutual Discovery.** Both parties intentionally consented to romance.

---

### Space 3: Matrimony (`matrimony`)
* **User A Perspective:** User A has not enabled Matrimony.
  - **Does User A see User B?** **NO.** User A cannot discover marriage candidates.
* **User B Perspective:** User B opens the Matrimony directory.
  - **Does User B see User A?** **NO.** User A has disabled Matrimony.
  - **Why:** User A will **never** be presented to User B as a potential marriage candidate, even though User A is visible to User B in Dating!
* **Result:** **Zero Discovery.** Dating interest does not automatically imply marriage availability.

---

### Space 4: Cofounders (`cofounders`)
* **User A Perspective:** Disabled.
* **User B Perspective:** Disabled.
* **Result:** **Zero Discovery.**

---

## 3. End-to-End Interaction Flow

```
Step 1: DISCOVERY IN DATING
  User A sees User B in the Dating tab.
  Similarity: 84/100 (Similar to Me: Reflective communicators).
  Mutual Non-Negotiable Gate: Both require monogamy -> PASS.

Step 2: INTENTION-STAMPED INVITATION
  User A clicks "Send Thoughtful Note".
  Modal explicitly displays: [ 💫 DATING INTRODUCTION · Isolated to Dating ]
  User A writes: "Loved your reflection on quiet reading and weekend markets."
  Server executes memberStore.createIntroduction({ intention: 'dating' }).
  State transition: 'draft' -> 'sent' (14-day expiry window).

Step 3: INCOMING NOTIFICATION FOR USER B
  User B receives an introduction notification.
  Badge: 💫 DATING INVITATION from Kavya Sundaram.
  User B opens the invitation inside the DATING workspace.
  Notice: No Matrimony prompts or Friendship circles are mixed into this view.

Step 4: ACCEPTANCE & INTENTION-LOCKED CHAT
  User B clicks "Accept Introduction".
  State transition: 'sent' -> 'accepted'.
  Chat thread created: Thread ID conv-kavya-meera.
  Intention Lock: Permanently stamped with [ 💫 DATING ].
  Cross-Context Registry: kavya and meera added to connectedMemberIdsByIntention['dating'].

Step 5: CROSS-CONTEXT PRIVACY FIREWALL ACTIVATION
  If User A later decides to enable Matrimony, or User B enables Friendship:
  Default Firewall: "Hide people I already connected with in another Kithra space."
  Outcome: Kavya and Meera will NOT appear in each other's Friendship or Matrimony discovery!
  Their Dating conversation continues uninterrupted, but their other spaces remain private.
```

---

## 4. Key Security Invariants Enforced

1. **Symmetric Evaluation:** $A \rightarrow B$ returns the exact same discovery eligibility as $B \rightarrow A$.
2. **No Reverse Leakage:** Being visible in Dating does not reveal or grant access to Matrimony family guides or Friendship circle RSVPs.
3. **No Unilateral Promotion:** A cannot convert the Dating conversation into a Matrimony biodata exchange without B's explicit mutual opt-in.
4. **Instant Blocking:** If either member blocks the other at any point, all visibility and chat access vanish across all spaces in under 1 millisecond.

