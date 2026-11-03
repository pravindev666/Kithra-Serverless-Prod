# KITHRA — CROSS-CONTEXT PRIVACY FIREWALL SPECIFICATION
**Document Reference:** `KITHRA_CROSS_CONTEXT_PRIVACY_SPEC.md`  
**Phase:** 10 (Multi-Intention Architecture & Trust & Safety)  
**Standard:** Pair-Level Suppression, Boundary Protection & Zero Collateral Exposure  

---

## 1. The Core Threat Model

When a single consumer platform accommodates distinct relationship dimensions—such as **Cofounders (Professional)**, **Friendship (Platonic)**, **Dating (Romantic)**, and **Matrimony (Family/Marital)**—the most destructive privacy failure is **Context Contamination**:

```
  THE AWKWARD CONTAMINATION SCENARIO:
  ┌────────────────────────────────────────────────────────────────────────┐
  │ 1. Alice and Bob meet as Cofounders to build a Fintech startup.         │
  │ 2. They communicate professionally about cap tables and MVP features.  │
  │ 3. Three weeks later, Bob opens Kithra Dating or Matrimony...          │
  │ 4. 🚨 DISASTER: Alice's dating profile & private marital questions      │
  │    are recommended to Bob!                                             │
  │ 5. Outcome: Professional trust shattered. Extreme awkwardness.         │
  └────────────────────────────────────────────────────────────────────────┘
```

To eliminate this vulnerability permanently, Kithra institutes the **Cross-Context Privacy Firewall**.

---

## 2. The Core Policy: "Connected in One Space = Auto-Hidden in Others"

### Default System Setting
```json
{
  "hideCrossContextConnectionsByDefault": true
}
```
* **Rule:** If Member $A$ and Member $B$ have an established relationship (accepted connection, active conversation, or pending introduction) in Intention Space $X$, Kithra **automatically suppresses** Member $A$ and Member $B$ from ever appearing in each other’s discovery feeds in Intention Spaces $Y$ and $Z$.
* **Transparency:** Both members are presented with a clear privacy notice upon connecting:
  > *"Because you are connected as Cofounders, Kithra automatically keeps your personal Dating and Matrimony spaces private from each other."*

---

## 3. The 3 Explicit Member Privacy Controls

In addition to the automatic firewall, every member has access to three granular controls on any profile card or message thread:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MEMBER PRIVACY CONTROL PALETTE                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. [ Hide in this space ]                                              │
│    • Suppresses the pair only within the current active intention.     │
│    • Scope: 'space_specific' (e.g. excludedSpace: 'dating')            │
│    • Leaves other spaces unaffected if mutually enabled.               │
│                                                                        │
│ 2. [ Hide across all Kithra spaces ]                                   │
│    • Suppresses the pair from all discovery directories.               │
│    • Scope: 'all_spaces'                                               │
│    • Preserves existing accepted chat threads without showing profiles │
│      in new recommendations.                                           │
│                                                                        │
│ 3. [ Block across all Kithra ]                                         │
│    • Symmetric, immediate 0ms blackout across the entire platform.     │
│    • Revokes all chat access, hides past messages, cancels pending     │
│      invitations, and renders both accounts mutually nonexistent.      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Behavior of Existing Artifacts on Exclusion Activation

When a Cross-Context Privacy Exclusion or Space-Specific Hide is activated:

| Platform Artifact | Behavior on Exclusion Activation |
| :--- | :--- |
| **Existing Accepted Chat Thread** | **Preserved in its original space.** If Alice and Bob connected in Cofounders, their Cofounder work chat remains completely accessible. |
| **Discovery Recommendations** | **Instantly Purged.** Neither member will ever be shown in discovery feeds for excluded spaces. |
| **Direct Profile URLs / API Calls** | **HTTP 404 / 403.** Attempting to fetch the other party's profile in the excluded space fails closed with `PROFILE_UNAVAILABLE`. |
| **Saved / Bookmarked Profiles** | **Soft-Disabled.** If Alice previously saved Bob's profile, it is grayed out with a neutral note: *"This profile is no longer available in this space."* |
| **Pending Introductions** | **Automatically Expired / Withdrawn.** Any unaccepted request in an excluded space is terminated without revealing reasons. |
| **Promotional & Push Notifications**| **Suppressed.** No cross-context digests or "Someone you may know" alerts are ever generated for the pair. |

---

## 5. Can Two People Ever Transition Contexts?

What if two Cofounders or two Friends genuinely develop romantic feelings over time?

* **Strict Non-Negotiable Rule:** **Never unilateral. Double opt-in only.**
* Friendship or business collaboration **must never be interpreted as romantic consent**.
* If Kithra ever supports multi-context transitions:
  1. A member must submit a private, unbadged request: *"Open to exploring Dating."*
  2. The other party receives **no notification** of this request unless they *independently* express the exact same desire.
  3. If both parties independently opt in, a new, separate conversation thread is created for Dating, leaving the professional or platonic thread intact.
  4. If either party declines or ignores it, **zero feedback is given**. No awkwardness, no retaliation, and no ruined working relationship.

---

## 6. Implementation Verification in Code

* **Data Schema:** `PairExclusionRule` in `src/types/kithra.ts`.
* **Execution Logic:** `evaluateMutualEligibility()` in `src/domain/psychologyEngine.ts` (Lines 310–343).
* **Store Integration:** `memberStore.addPairExclusion()` and `memberStore.removePairExclusion()` in `src/domain/memberStore.ts`.
* **Test Verification:** Verified in `src/domain/phase10FourIntentionAndPrivacyFirewall.test.ts` (Passed).

