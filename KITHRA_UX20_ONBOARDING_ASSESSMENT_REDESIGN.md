# KITHRA — ONBOARDING & PSYCHOLOGY ASSESSMENT REDESIGN BLUEPRINT
**Document ID:** `KITHRA_UX20_ONBOARDING_ASSESSMENT_REDESIGN.md`  
**Target Surface:** `src/components/PublicViews.tsx` (`AuthView`, `OnboardingView`), `src/components/MemberViews.tsx` (`QuestionnaireView`), `src/data/mockFixtures.ts` (`ASSESSMENT_QUESTIONS`)  
**Status:** PROPOSED REDESIGN BLUEPRINT — PENDING FOUNDER APPROVAL (A1 / A2 / A3)  

---

## 1. STRATEGIC OBJECTIVE

Onboarding and the psychological questionnaire form the moral core of Kithra. In an ecosystem dominated by gamified, rapid-fire swiping, Kithra asks members to pause, reflect, and share authentic values. This blueprint resolves critical UX vulnerabilities while safeguarding legal adulthood compliance and psychological honesty.

### Key Audit Issues Identified
1. **Critical Security & Compliance Bypass in Step Navigation:**
   - In `src/components/PublicViews.tsx:1528-1536`, the 5-step progress indicators are clickable buttons:
     ```tsx
     {[1, 2, 3, 4, 5].map((idx) => (
       <button key={idx} type="button" onClick={() => setStep(idx as 1 | 2 | 3 | 4 | 5)} ... />
     ))}
     ```
     A new visitor can click Step 5 immediately, bypassing Step 1 (Intention Selection), Step 2 (Adulthood 18+ Verification & Birth Year), and Step 3 (Privacy Consent), proceeding to "Enter Discovery" using default state values (`isAdultConfirmed = true`). This violates our core safety invariant: **Adulthood Verification Must Fail-Closed**.
2. **Missing Interrupted-Onboarding Recovery:**
   - If a member closes their tab during question 3 of the 5-question starter flow, their responses are held in ephemeral React memory. Upon returning, they are forced to restart at Step 1.
3. **Overwhelming Form Density in Step 2:**
   - Step 2 packs location, language selection (with dozens of unorganized pills), and birth year into an unchunked card, triggering high cognitive load (Miller's Law).
4. **Presentation of Clarification Questions:**
   - When conflicting answers occur, clarification items currently look identical to standard questions, which can feel repetitive or accusatory.

---

## 2. DETAILED REDESIGN SPECIFICATIONS

### Phase 1: Authentication & Account Creation (`/signin`, `/join`)
- **Single-Purpose Form (Hick's Law):** Keep email and password inputs clean, auto-trimming whitespace (Postel's Law).
- **Google / Social Auth:** Clear, distinct button: `[ Continue with Google ]` with standard Google identity branding.
- **Fail-Closed Adulthood Check:** Move the 18+ confirmation to the initial registration form itself. No account can be created without an explicit, un-ticked confirmation: *"I confirm that I am at least 18 years old and agree to Kithra's Terms of Respect."*

### Phase 2: Sequential 5-Step Intention Onboarding (`/onboarding`)
- **Lock Forward Step Jumping:** The step progress dots become non-clickable visual indicators of progress. Users can navigate **Back** to previous completed steps, but cannot jump forward without passing validation.
- **Step 1: Choose Your Active Intentions:**
  - Clear multi-select cards: Friendship, Dating, Matrimony, Cofounders.
  - User must select at least one space before the "Continue →" button activates.
- **Step 2: Location & Communication Preferences:**
  - Searchable city dropdown (Bengaluru, Mumbai, Delhi NCR, Chennai, Hyderabad, Pune, Kolkata, etc.).
  - Languages chunked into "Top Languages" ($n=5$) and "More Languages" accordion.
  - Birth year input with instant age calculation and friendly inline warning if age $< 18$.
- **Step 3: Conversational Pace & Boundary Consent:**
  - Pacing options: Unhurried (1–2 days per reply), Balanced (daily), Active (multiple times a day).
  - Explicit DPDP Privacy Consent checkbox: *"I consent to Kithra processing my reflections strictly within my chosen intention spaces."*
- **Step 4: Portrait & 4:5 Framing Guidelines:**
  - Explains the Kithra portrait philosophy (calm natural light, 4:5 editorial aspect ratio, zero filters).
  - Optional upload or skip: *"You can explore discovery immediately and add your portrait later."*
- **Step 5: Starter Reflection (Question 1 of 5):**
  - Seamlessly bridges onboarding into the initial psychological questionnaire.

### Phase 3: The 5-Question Starter Assessment & Psychological Honesty
- **One Question at a Time (Miller's & Hick's Laws):** Each question occupies its own tranquil card with generous typography.
- **Four Distinct, Meaningful Answer Choices:** Each option reflects an authentic human orientation (e.g. social energizer vs. restorative solitude), completely avoiding "good vs. bad" moral grading.
- **Clarification Handling (Non-Accusatory):**
  - When a user's answer in a social context differs from an earlier reflection, the system renders a gentle clarification card: *"Human nature is wonderfully nuanced. When thinking about quiet weekends vs. social festivals, which scenario resonates more often?"*
- **Fatigue & Break Offer:**
  - After 10 optional deep questions, the interface presents a serene pause card: *"You have answered 10 thoughtful reflections. Take a break, explore your matches, and return whenever you wish."*
- **Scientific Non-Overclaim Invariant:**
  - Upon completing 5 questions, the summary card explicitly states:
    > *"Provisional Self-Reflection: Based on 5 starter questions, this note reflects your initial pacing and social preferences. Kithra’s psychometric models are experimental tools for self-discovery, not clinical evaluations."*

---

## 3. BEFORE / AFTER SCREENSHOT MOCKUPS (ASCII / WIREFRAME)

### Onboarding Step 2: Location & Adulthood Gate

#### BEFORE (Unchunked, Clickable Step Dots Vulnerability)
```
+-------------------------------------------------------------------------+
| Intention onboarding · Step 2 of 5            (o) (o) [O] (o) (o)       |
| Where are you based, and which languages feel like home?                |
| (VULNERABILITY: Step dots are clickable, allowing users to skip to 5)   |
|                                                                         |
| City: [ Bengaluru        v ]                                            |
|                                                                         |
| Languages: (Dense unorganized pill cloud)                               |
| [x] English  [x] Tamil  [x] Hindi  [ ] Kannada  [ ] Telugu  [ ] Bengali |
| [ ] Marathi  [ ] Gujarati [ ] Malayalam [ ] Punjabi [ ] Odia ...        |
|                                                                         |
| Birth year: [ 1998 ]     [x] I confirm I am 18 or older                 |
|                                                                         |
| [ Continue to Step 3 -> ]                                               |
+-------------------------------------------------------------------------+
```

#### AFTER (Gated, Chunked, Non-Bypassable Progress)
```
+-------------------------------------------------------------------------+
| INTENTION ONBOARDING                          Step 2 of 5               |
| [====                  ] 40% Complete                                  |
|                                                                         |
| Where are you based and how do you speak?                               |
|                                                                         |
| +--- Location --------------------------------------------------------+ |
| | City: [ Bengaluru                                             v ]   | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| +--- Languages (Commonly Spoken) ------------------------------------+ |
| | [x] English      [x] Tamil        [x] Hindi                         | |
| | [ ] Kannada      [ ] Telugu       [ + Add more languages ]          | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| +--- Age Verification (Strict 18+ Requirement) -----------------------+ |
| | Birth Year: [ 1998 ]  -> Verified Adult (Age 28)                    | |
| | [x] I legally certify that I am at least 18 years of age.           | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| [ <- Back ]                                  [ Continue to Step 3 -> ]  |
+-------------------------------------------------------------------------+
```

---

### Psychological Question Presentation (1-at-a-Time)

#### AFTER (Calm, Focused, Accessible Question Card)
```
+-------------------------------------------------------------------------+
| QUESTION 03 OF 05 · SOCIAL ENERGIES & SOLITUDE                          |
| [======                ] Unhurried Starter Flow                         |
|                                                                         |
| "When a demanding work week concludes, what activity truly             |
| restores your energy for the days ahead?"                               |
|                                                                         |
| +---------------------------------------------------------------------+ |
| | [A] An energetic dinner or gathering with a lively group of friends  | |
| +---------------------------------------------------------------------+ |
| | [B] Quiet solitude at home—reading, cooking, or listening to music   | |
| +---------------------------------------------------------------------+ |
| | [C] One-on-one conversation with a close friend over coffee         | |
| +---------------------------------------------------------------------+ |
| | [D] Exploring a new neighborhood, museum, or outdoor walking trail  | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| [ <- Previous Question ]       [ Skip for now ]       [ Next Question -> ]|
+-------------------------------------------------------------------------+
```

---

## 4. IMPACT, RISK AND VERIFICATION

- **Primary Impact:** Guarantees 100% legal compliance with adulthood (18+) requirements; prevents drop-off through auto-saving progress; provides a calm, pressure-free psychological reflection experience.
- **Risk Analysis:** Disabling clickable forward step dots prevents "power users" from rushing through onboarding, which is an intentional safety feature for Kithra.
- **Approval Tier:** **A2 (Member Workflow) & A3 (Adulthood & Security Invariant)**.
- **Verification Plan:**
  1. Automated test attempting to submit Step 5 without Step 2 birth year certification; verify HTTP 403 / UI block.
  2. Keyboard navigation verification: 100% operable via `Tab`, `Space`, `Enter`, and `Esc`.
  3. Verify provisional reflection disclaimer renders accurately without claiming diagnostic certainty.

