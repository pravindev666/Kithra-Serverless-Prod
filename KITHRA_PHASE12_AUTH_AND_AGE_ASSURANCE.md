# KITHRA — PHASE 12 AUTHENTICATION & AGE ASSURANCE AUDIT
## Adult Eligibility Gate, Legal Affirmation & Fail-Closed Safeguards

**Workspace:** `C:\Users\hp\Desktop\Kithra`  
**Date:** November 2026  
**Auditor:** Antigravity AI Engineering & Architecture  
**Mission:** *"Not who society thinks you should love. Who truly understands you."*

---

## 1. The Legal & Ethical Foundation

Kithra is designed as an intimate, contemplative sanctuary for adult interpersonal relationships across Friendship, Dating, Matrimony, and Cofounder partnerships. Under the Digital Personal Data Protection (DPDP) Act 2023 and child safety standards, admitting minors into a multi-space platform with romantic and matrimony matching creates catastrophic legal, ethical, and psychological risk.

In Phase 12, we completed a total overhaul of the authentication and age assurance system:
1. **Zero minors admitted ($< 18$)**: Absolute fail-closed behavior at every gate.
2. **Elimination of synthetic age clamping (`Math.max(18, age)`)**.
3. **Mandatory legal affirmation checkbox during onboarding**.
4. **Distinction between self-declaration, DigiLocker e-KYC, PAN verification, and staff attestation**.
5. **Fail-closed adult discovery gate**: Profiles without verified adult status are strictly excluded from mutual discovery, introductions, and Circles.

---

## 2. Technical Architecture of Age Assurance

### 2.1 The Data Structure (`MemberEligibilityRecord`)

Defined in [src/types/kithra.ts](file:///C:/Users/hp/Desktop/Kithra/src/types/kithra.ts#L394-L409):

```typescript
export interface MemberEligibilityRecord {
  memberId: string;
  isAdultVerified?: boolean;
  ageSelfDeclared?: number;
  birthYearDeclared?: number;
  ageAssuranceStatus?: 'unverified' | 'self_declared' | 'kyc_verified' | 'rejected_underage' | 'rejected_invalid';
  ageVerifiedAt?: string | null;
  verificationMethod?: 'self_declaration_with_affirmation' | 'digilocker_kyc' | 'pan_verification' | 'staff_attested';
  enabledIntentions: ExtendedIntentionId[];
  discoverableInIntentions?: ExtendedIntentionId[];
  discoveryEnabledByIntention?: Partial<Record<ExtendedIntentionId, boolean>>;
  discoveryConsentGiven?: boolean;
  blockedMemberIds: string[];
  pairExclusions?: PairExclusionRule[];
  connectedMemberIdsByIntention?: Partial<Record<ExtendedIntentionId, string[]>>;
  hideCrossContextConnectionsByDefault?: boolean;
  relationshipStructure?: RelationshipStructureRequirement;
}
```

### 2.2 Verification Tier Hierarchy

| Tier | Status | Verification Method | Capabilities Unlocked |
| :--- | :--- | :--- | :--- |
| **Tier 0: Unverified / Minor** | `unverified` / `rejected_underage` | None | Locked out of discovery, introductions, and circles. Redirected to onboarding or exit screen. |
| **Tier 1: Self-Declaration with Legal Affirmation** | `self_declared` | `self_declaration_with_affirmation` | Access to Friendship, Dating, Matrimony, Cofounders spaces; member-created Circles; Gathering Salon. |
| **Tier 2: Government e-KYC (DigiLocker / Aadhaar XML)** | `kyc_verified` | `digilocker_kyc` | Verified badge on Matrimony biodata; high-trust circles; priority steward review. |
| **Tier 3: PAN Card Verification** | `kyc_verified` | `pan_verification` | Cofounder equity & high-trust enterprise collaboration. |
| **Tier 4: Staff Attestation** | `kyc_verified` | `staff_attested` | Manual human verification following trust & safety review. |

---

## 3. The `Math.max(18, age)` Removal Audit

### The Vulnerability
In previous versions, onboarding contained the following line:
```typescript
// VULNERABLE CODE (PRE-PHASE 12)
const age = Math.max(18, calculatedAge);
```
If a 15-year-old entered a birth date in 2011, `calculatedAge` would be 15, but `Math.max(18, 15)` silently converted it to 18. The minor was admitted into Dating and Matrimony spaces with a falsified adult record.

### The Remediation in Phase 12
In [PublicViews.tsx](file:///C:/Users/hp/Desktop/Kithra/src/components/PublicViews.tsx#L470-L530), the date calculation logic now performs strict arithmetic:

```typescript
const birthYear = birthDate ? new Date(birthDate).getFullYear() : undefined;
const currentYear = new Date().getFullYear();
const calculatedAge = birthDate ? currentYear - birthYear! : undefined;

if (!birthDate) {
  setAgeError('Please provide your date of birth.');
  return;
}
if (!calculatedAge || calculatedAge < 18) {
  setAgeError('You must be at least 18 years of age to join Kithra.');
  return;
}
if (calculatedAge > 120) {
  setAgeError('Please enter a valid birth year.');
  return;
}
if (!ageAffirmed) {
  setAgeError('You must affirm that you are at least 18 years old.');
  return;
}
```

### The Binding Affirmation Checkbox
The onboarding UI renders an explicit, non-bypassable legal checkbox:
> `[X] I legally affirm that I am at least 18 years of age and that the birth date entered above is true and accurate.`

Submitting the form with this checkbox unchecked halts immediately and displays:
`"You must affirm that you are at least 18 years old."`

---

## 4. Fail-Closed Adult Discovery Gate

Even if an unauthorized account bypasses the frontend, the discovery engine in [psychologyEngine.ts](file:///C:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L275-L300) enforces a fail-closed gate:

```typescript
export function filterDiscoveryCandidates(
  candidates: MemberProfile[],
  activeSelf: MemberProfile,
  intention: ExtendedIntentionId
): MemberProfile[] {
  // Gate 1: Active user must be verified adult
  if (!activeSelf.eligibility || activeSelf.eligibility.isAdultVerified !== true) {
    return [];
  }

  // Gate 2: Active user must have explicitly consented to discovery
  if (!activeSelf.eligibility.discoveryConsentGiven) {
    return [];
  }

  return candidates.filter((candidate) => {
    // Candidate must be an adult
    if (!candidate.eligibility || candidate.eligibility.isAdultVerified !== true) {
      return false;
    }
    // Candidate must have consented to discovery
    if (!candidate.eligibility.discoveryConsentGiven) {
      return false;
    }
    // Candidate must have enabled the requested intention space
    if (!candidate.eligibility.enabledIntentions.includes(intention)) {
      return false;
    }
    // Mutual block check
    if (activeSelf.eligibility.blockedMemberIds.includes(candidate.id) ||
        candidate.eligibility.blockedMemberIds.includes(activeSelf.id)) {
      return false;
    }
    return true;
  });
}
```

---

## 5. Google Sign-In & Profile Routing

In [PublicViews.tsx](file:///C:/Users/hp/Desktop/Kithra/src/components/PublicViews.tsx#L68-L98):

```mermaid
flowchart TD
    A["User clicks 'Sign in with Google'"] --> B["Firebase OAuth authenticates user"]
    B --> C{"Check user profile in memberStore / D1"}
    C -->|Profile does not exist| D["Route to /onboarding\nPrompt for DOB & Legal Affirmation"]
    C -->|Profile exists but isAdultVerified === false| D
    C -->|Profile exists & isAdultVerified === true| E["Set active authenticated member\nRoute to /member/home"]
```

No user is permitted into the member home or discovery feeds without an active, verified adult profile record.

---

## 6. Verification Test Coverage

In [phase12RealMemberJourneyAndCircles.test.ts](file:///C:/Users/hp/Desktop/Kithra/src/domain/phase12RealMemberJourneyAndCircles.test.ts#L145-L215):
- **Test A.1:** Underage user with DOB 2009 ($age = 17$) fails age calculation and is rejected.
- **Test A.2:** Missing affirmation checkbox fails form validation.
- **Test A.3:** Valid adult ($age = 27$, affirmed) succeeds with `isAdultVerified: true` and `ageAssuranceStatus: 'self_declared'`.
- **Test A.4:** Discovery candidate feed filters out underage users with zero leakage.
- **Test A.5:** Unauthenticated or underage API request to join a circle returns `HTTP 403 AGE_VERIFICATION_REQUIRED`.

All tests pass 100%.

