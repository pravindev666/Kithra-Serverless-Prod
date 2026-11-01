# USER PERSONAS, JOBS-TO-BE-DONE & CULTURAL RESEARCH

**Rule:** these are *research personas* for design, not statistical claims about
India or any group. Age bands are design cohorts, not eligibility rules
(enrolment is 18+ with no upper age cut). Cultural notes are hypotheses to test.

Evidence types tagged as in the lit review. Nothing here asserts a measured
prevalence.

---

## 1. Eight inclusive personas

| ID | Persona | Situation | Core mode | Fears | Desired outcome | Privacy need | Device/network | Success criterion |
|---|---|---|---|---|---|---|---|---|
| P1 | **Ananya, 24, Pune** | New to city after first job | Friendship | Unwanted romantic approach; awkwardness | 1–2 real local friends | Wants separate friend persona, no photos public at first | Mid Android, 4G, low data cap | Attends ≥1 meetup; day-30 recontact |
| P2 | **Rahul, 29, Bengaluru** | Introverted, wants deeper conversation | Friendship | Ghosting; surface chat | A conversational *friend*, not small talk | Pseudonym ok; answers private | Flagship phone, wifi | ≥3 sustained conversations |
| P3 | **Meera, 31, Chennai** | Intentional dating, career-focus | Dating | Catfishing; stalking; wasted time | A respectful, clear-intent relationship | Separate dating profile; selective photo visibility | Mid Android | Mutual date, safe, day-30 continues |
| P4 | **Arjun, 34, Delhi** | Considering marriage, family involved | Matrimony | Dowry/coercion; false claims | A serious, honest match with shared life plans | Best-effort: family involvement opt-IN only | iPhone, good network | Mutual intentional conversation |
| P5 | **Fatima, 27, Hyderabad** | Privacy-conscious, does not want face online | Any (likely friendship first) | Exposure to family/community; harassment | Connection without public photos | **No-photo mode**, group-first discovery | Mid Android | Feels safe; continues contact |
| P6 | **Devan, 33, Coimbatore** | Low-vision; uses screen reader + magnification | Dating | Inaccessible UI blocks everything | Equal access to discovery + chat | Standard | Android TalkBack | Completes full journey unassisted |
| P7 | **Kiruthika, 26, Madurai** | Tamil-first, limited English | Friendship | English-only exclusion | Tamil interface; local friends | Standard | Budget phone, 3G/spotty | Comprehension + completion in Tamil |
| P8 | **Sofia, 30, Berlin (intl.)** | Expat, cross-cultural | Dating | Local vs global mismatch | Like-minded people in her city | GDPR-aware; wants export/delete | iPhone, 5G | Day-30 mutual follow-through |

Operations personas (non-member):
**M1 Safety reviewer** (triage harm without seeing raw intimate answers),
**M2 Support agent** (payments/access, minimal privilege),
**M3 Psychometric steward** (publish defensible banks, monitor bias),
**M4 Privacy officer** (DPDP export/deletion/grievance).

---

## 2. Twelve jobs-to-be-done

| JTBD | Statement | Primary personas | Screen impact |
|---|---|---|---|
| J1 | *When I move to a new city, help me find a few people I actually click with.* | P1, P7 | Discover/Friendship, Circles |
| J2 | *When I'm tired of small talk, help me reach people who want depth.* | P2 | Discover, match explanation |
| J3 | *When dating, help me filter for genuine intent so I don't waste weeks.* | P3, P8 | Dating mode, intent card |
| J4 | *When considering marriage, help me compare shared life plans honestly.* | P4 | Matrimony mode, life-plan compare |
| J5 | *Let me connect without putting my face online.* | P5 | Photo privacy, group-first |
| J6 | *Let me use this fully with a screen reader / large text.* | P6 | a11y spec, all screens |
| J7 | *Let me use this in my own language.* | P7 | i18n, font fallback |
| J8 | *Show me why you think we'd connect — and what you don't know.* | all | Match explanation + coverage |
| J9 | *Let me block/report instantly and be sure it's free.* | all | Safety free-tier guarantee |
| J10 | *Let me change or pause my intent without leaking my other profile.* | P1–P5, P8 | Mode switcher, consent model |
| J11 | *(Ops) Let me resolve a report fairly without reading intimate answers.* | M1, M4 | Admin case-scoped evidence |
| J12 | *(Ops) Let me refund/cancel transparently with an audit trail.* | M2 | Admin billing + audit |

---

## 3. Cultural and accessibility research notes (hypotheses to test)

**India.**
- OTP-first sign-in is the local norm (Aisle, TrulyMadly, Jeevansathi,
  Schmooze all lead with mobile OTP). Kithra supports OTP **and** email/Google.
- Price sensitivity is high; a genuinely free core is a competitive necessity
  (r/OnlineDating demand; Aisle/BFF positioning).
- Family involvement in matrimony exists but must be **opt-in per participant**;
  never default. Anti-coercion and anti-dowry safeguards are functional, not
  cosmetic.
- Do not treat "Indian users" as homogeneous: language (Tamil, Hindi, Telugu,
  Malayalam, Kannada, Bengali) and city tier change the experience materially.

**International.**
- GDPR-style expectations (export, delete, withdraw consent) are baseline, not
  extras.
- Do not assume Western aesthetics are universal; test the warm-editorial
  direction in-market.

**Accessibility (T1 standards).** WCAG 2.2 AA target: ≥4.5:1 body contrast,
≥24×24 (we use ≥44) targets, visible focus, reduced-motion, screen-reader
labels, error identification with instructions.

**Anti-stereotyping rules.**
- No gendered colour default; no bridal imagery to mean matrimony.
- No caste/religion ranking or hidden inference.
- No assumption that "friendship" means "pre-dating".

---

## 4. Ethical research plan to validate (Phase 14 summary)

- 20–30 moderated interviews per initial segment (India Tier-1, Tier-2, intl.).
- Task-based usability tests for: mode activation, quiz progress, match
  explanation comprehension, photo privacy comprehension, report flow.
- **Never** substitute stereotype for evidence; quotas by language + ability,
  not only by age/gender.

Full test design + thresholds: `09_VALIDATION/`.
