> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# BRD — Business Requirements Document

**Revision:** 1.0 | **Owner:** Founder | **Status:** proposed, not validated

## 1. Executive definition
Kithra is a consent-based human-connection network with three autonomous intention modes: **Friendship**, **Dating**, and **Matrimony**. Members answer versioned questionnaires to receive evidence-informed *descriptions* of similarities, differences, potential friction and complementary preferences, then mutually opt into introductions, conversations and groups. One login and wallet may serve the modes, but matching eligibility, profile visibility, consent, communications and paywalls must be independently configurable **per mode**. A marriage search must never be inferred from friendship participation.

### North-star outcome
**Mutually confirmed continued connection at day 30**, measured separately by friendship (recontact/shared activity), dating (mutual desire to continue), and matrimony (mutual intentional conversation and appropriate next step). Do not optimize time-on-app, endless swiping or survey completion alone.

### Economic reality
The product is a two-sided local-density network, a moderation service and a high-trust data custodian. A polished algorithm with 100,000 inactive accounts fails if compatible participants are not active in each relevant pool. Indian consumers are price-sensitive and matching promises face substantiation risk; initial revenue assumptions must be validated.

## 2. People and jobs to be done

| Persona | Need | Non-negotiable risk | Core mode |
|---|---|---|---|
| New-to-city adult (23–35) | Reliable hobby companion | unwanted romantic solicitation | Friendship |
| Introverted adult seeking serious friends | Low-pressure, compatible introductions | harassment/ghosting | Friendship |
| Intentional dating adult (21–38) | Mutual values and expectations | stalking/catfishing | Dating |
| Matrimony-seeking adult | Serious shared-life preferences, family involvement only with consent | coercion, dowry, caste discrimination, unverified claims | Matrimony |
| Safety reviewer | Triage credible harm without uncontrolled access to intimate answers | privacy misuse/unsafe content | Operations |
| Support agent | Resolve payments, account access, appeals | excessive privileges | Operations |
| Psychometrics steward | Publish defensible question-bank versions and monitor bias | pseudoscience, overinterpretation | Research |

Age ranges are research cohorts, not hard exclusions. Product enrollment initially **18+**; adults should not be excluded merely by age. Questionnaires should work in English and later Indian languages with tested translations rather than machine-translated psychometric claims.

## 3. Business objectives (provisional gates)
- **B01** Demonstrate sustained connection: at least 20% of consenting introduced pairs mutually confirm a second interaction at day 30 in controlled cohort; threshold is an experiment target, not a market benchmark.
- **B02** Measure matching lift: test deep questionnaire vs interest/availability-only control on 30-day continued connections; launch deep-model differentiation only if measurable net benefit.
- **B03** Establish trust: safety incidents per 1,000 conversations, complaint acknowledgement, resolution times, repeat-offender rate and verified appeal outcomes; zero tolerated unaddressed critical incidents.
- **B04** Maintain economically sustainable operation: positive contribution per paying cohort after payment fees, infrastructure, fraud, refunds, human moderation and support—not just gross subscription receipts.
- **B05** Meet applicable Indian requirements and avoid data overcollection before launch.
- **B06** Preserve provider portability so D1/Workers can eventually be replaced without changing user domain concepts.

## 4. Product strategy: one account, three guarded contexts
- User chooses at least one intention, can change them, and can pause each independently.
- Never expose a friendship profile in the matrimonial pool automatically; no cross-mode message access, recommendations, group auto-enrollment or sensitive-profile reuse without explicit permission.
- Each mode has separate intent, visibility, answer-sharing rules, eligibility, filtering, discovery permissions and communication request workflows.
- Shared immutable identifiers and authentication reduce friction; distinct **mode persona** records reduce accidental exposure.
- No assurances that a user is a spouse, safe, truthful, eligible for marriage or medically/psychologically compatible merely because they complete a quiz.

## 5. Competitive alternatives and differentiated hypothesis
Comparable features exist in **OkCupid** (question compatibility), **We3** (friendship psychographics), **Boo** (personality matching), **Dimensional** (trait profiling), **TrulyMadly**, **Aisle**, **Schmooze**, **Betterhalf**, **Hinge**, plus existing **WhatsApp/Discord/Meetup** communities. AI-twin vendors claim similar avatar matching, but independently validated Indian outcome data is scarce. Kithra's defensible difference, *if proven*, is clearer three-context intent separation, explainable complementarity, practical safety and observed continuation of real relationships. The word "soul twin" is a user-friendly metaphor, not evidence of neurological identity.

## 6. Scope and exclusions

**Initial validated early internal delivery phase:** account registration, mode consents and personas, limited quiz placeholders backed by versioned definitions, precomputed non-clinical trait summaries, mode-scoped match discovery, mutual requests, basic private chat, blocking/reporting, limited moderated groups, settings/data-rights, administrative triage, paid entitlements only after trust flows.

**early internal delivery phase+ (after 90 days):** question bank expansions, score-band explainers, friend activities, notification digests, paid tiers, admin quiz publishing and blinded A/B evaluation.

**Revised v3:** deterministic simulations only, with new consent and validation. No AI companion/brain twin in scope.

## 7. Revenue strategy, acquisition and risks
- Free core: taking assessments, seeing basic summaries, discovering a useful number of users, blocking/reporting, deleting account, baseline chat after mutual connection.
- Premium: advanced filters, extended but rate-limited introductions, detailed opt-in comparison reports, private circles, non-safety convenience features; no priority to bypass other users' preferences.
- Matrimony may have separate paid plan later, but **must not bundle guaranteed match or marriage outcomes**.
- Acquisition: city/college-alumni/professional-cohort launches with a local density plan; referrals through genuinely useful shared experiences, not pressure.
- Key risks: adverse selection, ghosting, low women's safety confidence, cultural/marriage coercion, deceptive profiles, privacy catastrophe with intimate data, spurious psychometric certainty, high customer acquisition cost, payment disputes.

## 8. Operating model
Roles: founder/product owner; part-time moderator/on-call safety owner; qualified privacy counsel; independent security reviewer; psychometric advisor; technical owner. An unstaffed complaint channel is not acceptable for a live strangers-connected-to-strangers product. Establish availability and escalation coverage before wide launch.

**Business approvals required:** early internal delivery phase positioning; allowed age; all three distinct mode eligibility policies; legal entity/contact details; controlled production validation budget; moderation coverage; first price experiment; marketing claims; cancellation/refund policy; decision to permit profile photos and uploads.

## 9. Release/investment gates
**Gate A:** 20–30 interviews, 50+ opted-in adult controlled production validation registrations, evidence of user-need. **Gate B:** controlled cohort with safe introductions and follow-up evidence. **Gate C:** engineer/legal/security sign-off for paid public beta. **Gate D:** expand matching categories only after no worsening in safety and demonstrable improved connection outcome. Each gate has recorded go/no-go decision.
