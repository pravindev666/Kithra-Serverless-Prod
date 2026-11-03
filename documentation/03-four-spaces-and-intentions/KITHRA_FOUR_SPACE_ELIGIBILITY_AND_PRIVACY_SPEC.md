# 🛡️ KITHRA — FOUR-SPACE ELIGIBILITY, PRIVACY FIREWALL & ISOLATION SPECIFICATION
**Document Reference:** `KITHRA_FOUR_SPACE_ELIGIBILITY_AND_PRIVACY_SPEC.md`  
**Version:** 2026.11 (DPDP Act 2023 & Cross-Context Security Architecture)  
**Workspace:** `C:\Users\hp\Desktop\Kithra`  
**Founder Directive:** *"Four distinct connection spaces. Complete isolation. Fail-closed defaults."*  

---

## 1. The Four Independent Connection Spaces

Kithra hosts four distinct spaces under a single user account, each governed by its own independent eligibility criteria, privacy boundaries, and matching philosophy:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            KITHRA MEMBER ACCOUNT                            │
│  (Verified Adult Identity · Encrypted Vault · Central Privacy Preferences)  │
└──────┬──────────────────┬──────────────────┬──────────────────┬─────────────┘
       │                  │                  │                  │
       ▼                  ▼                  ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  FRIENDSHIP  │   │    DATING    │   │  MATRIMONY   │   │  COFOUNDERS  │
│  Platonic    │   │  Intentional │   │   Marriage   │   │ Professional │
│  Shared Life │   │  Romance     │   │ Domestic Fit │   │ Enterprise   │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

### Space Isolation Principles
1. **Independent Opt-In:** An account does not become visible in any space without explicit, separate opt-in consent for that specific space.
2. **Non-Inference:** Enabling Friendship **never** implies interest in Dating. Connecting in Cofounders **never** exposes romantic history or matrimonial preferences.
3. **Dedicated Match Cards:** Photos, bio details, and answers displayed in one space are strictly scoped to that space.

---

## 2. Space-Specific Eligibility Rule Matrix

Every connection space enforces distinct Stage A precondition gates before similarity scoring occurs:

| Eligibility Rule | Friendship | Dating | Matrimony | Cofounders |
| :--- | :---: | :---: | :---: | :---: |
| **Adult Age Verification** | ✅ Required (Fail-Closed) | ✅ Required (Fail-Closed) | ✅ Required (Fail-Closed) | ✅ Required (Fail-Closed) |
| **Mutual Space Opt-In** | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| **Discovery Authorization** | ✅ Required | ✅ Required | ✅ Required | ✅ Required |
| **Symmetric Global Block** | ✅ $0\text{ms}$ Rejection | ✅ $0\text{ms}$ Rejection | ✅ $0\text{ms}$ Rejection | ✅ $0\text{ms}$ Rejection |
| **Anti-Self-Matching** | ✅ Rejection | ✅ Rejection | ✅ Rejection | ✅ Rejection |
| **Dating Relationship Purpose** | ❌ Ignored | ✅ Enforced (`committed_long_term`) | ❌ (Overridden by Marriage) | ❌ Strictly Ignored |
| **Exclusivity Structure (Q38)** | ❌ Strictly Ignored | ✅ Enforced (Monogamous vs Open) | ✅ Enforced (Monogamous vs Open) | ❌ Strictly Ignored |
| **Children Preference (Q50)** | ❌ Strictly Ignored | ⚠️ Checked if Essential | ✅ Enforced if Essential | ❌ Strictly Ignored |
| **Partner Smoking (Q63)** | ⚠️ Platonic Comfort | ⚠️ Romantic Requirement | ⚠️ Domestic Requirement | ❌ Strictly Ignored |
| **Business Funding Strategy** | ❌ Strictly Ignored | ❌ Strictly Ignored | ❌ Strictly Ignored | ✅ Enforced (Bootstrapped vs VC) |
| **Time Commitment Horizon** | ❌ Strictly Ignored | ❌ Strictly Ignored | ❌ Strictly Ignored | ✅ Enforced (Full-Time vs Part-Time) |
| **Two-Way Skill Complement** | ❌ Strictly Ignored | ❌ Strictly Ignored | ❌ Strictly Ignored | ✅ Evaluated (Directional Matrix) |

---

## 3. The Cross-Context Privacy Firewall (Auto-Suppression)

### The "Coworker / Founder Embarrassment" Hazard
If Member A and Member B meet as prospective business cofounders, neither party wants their romantic dating profile or matrimony criteria (e.g., family caste preferences, dating pace, physical affection preferences) visible to their prospective business partner.

### The Firewall Invariant ([`psychologyEngine.ts#L323-L345`](file:///C:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L323-L345))
When `hideCrossContextConnectionsByDefault: true` (the platform-wide default):
```typescript
const spaces = ['friendship', 'dating', 'matrimony', 'cofounders'] as const;
for (const sp of spaces) {
  if (sp === intention) continue;
  const vConnected = viewer.connectedMemberIdsByIntention?.[sp] ?? [];
  const cConnected = candidate.connectedMemberIdsByIntention?.[sp] ?? [];
  if (vConnected.includes(candidateId) || cConnected.includes(viewerId)) {
    return {
      eligible: false,
      status: 'ineligible_intention_or_privacy',
      intention,
      reasons: ['cross_context_connection_suppressed'],
      neutralMemberExplanation: 'This profile is not available in discovery.',
    };
  }
}
```

**Outcome:**
* Connecting as Cofounders **instantly and automatically suppresses** both members from appearing in each other's Dating and Matrimony discovery feeds.
* The suppression occurs at $0\text{ms}$ with zero information leakage (the reason returned to the client is simply *"This profile is not available in discovery"*).

---

## 4. The 4x4 Mutual Intention Permutation Matrix

Discovery requires **mutual, explicit authorization**. If Member A has spaces $\{F, D\}$ and Member B has spaces $\{D, M\}$, they can **only discover each other in Dating ($D$)**:

```
                       EXHAUSTIVE MUTUAL DISCOVERY MATRIX
                       
  Candidate Space ──►     Friendship (F)      Dating (D)      Matrimony (M)    Cofounders (C)
  Viewer Space ▼
 ┌──────────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
 │ Friendship (F)       │  ✅ Discoverable │  ❌ Quarantined │  ❌ Quarantined │  ❌ Quarantined │
 ├──────────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
 │ Dating (D)           │  ❌ Quarantined │  ✅ Discoverable │  ❌ Quarantined │  ❌ Quarantined │
 ├──────────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
 │ Matrimony (M)        │  ❌ Quarantined │  ❌ Quarantined │  ✅ Discoverable │  ❌ Quarantined │
 ├──────────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
 │ Cofounders (C)       │  ❌ Quarantined │  ❌ Quarantined │  ❌ Quarantined │  ✅ Discoverable │
 └──────────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Verified Exhaustive Permutation Suite
In [`phase10FourIntentionAndPrivacyFirewall.test.ts#L40-L80`](file:///C:/Users/hp/Desktop/Kithra/src/domain/phase10FourIntentionAndPrivacyFirewall.test.ts#L40-L80), all **900 subsets** ($15 \times 15 \times 4$) were tested:
* Zero leakage across mismatched intention spaces.
* A member who selects "All" discovery still only views members who have explicitly enabled matching shared spaces.

---

## 5. Security Invariants: Fail-Closed Protection

1. **Adult Verification Invariant:** If `isAdultVerified` is undefined or false, discovery is rejected immediately (`adult_verification_required_fail_closed`).
2. **Discovery Permission Invariant:** If `discoverableInIntentions` is omitted, the engine requires explicit intention enablement (`viewerHasIntention`) or fails closed.
3. **Global Block Invariant:** Adding a member ID to `blockedMemberIds` takes immediate effect across all 4 spaces simultaneously, invalidating cached discovery feeds.
4. **Staff Data Protection:** Raw questionnaire responses, millisecond telemetry, and draft intros return `HTTP 403 Forbidden` (`SERVER_SIDE_ACCESS_DENIED`) when inspected by administrative staff.

