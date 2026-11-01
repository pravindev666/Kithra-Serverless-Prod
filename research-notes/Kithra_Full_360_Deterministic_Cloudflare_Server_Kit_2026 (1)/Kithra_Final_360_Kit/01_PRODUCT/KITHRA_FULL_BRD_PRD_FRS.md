# KITHRA — FULL PRODUCT BRD / PRD / FRS / NFR / DELIVERY CONTRACT
**Version 3.0, 1 November 2026. This document is normative. All requested functionality forms one complete product, with scheduling for engineering convenience and NO unapproved omissions.**

## Acceptance truth and product scope
The product must function end-to-end for consenting adults across three privacy-segregated modes: Friendship, Dating and Matrimony. The system is **deterministic**: no AI twins, no LLM runtime, no “brain replication” claims. The intended intellectual ambition is detailed questionnaire-derived profiles and conditional predictions about stated preferences, not a scientific reconstruction of someone's cognition. Any unvalidated question bank must remain a marked placeholder. Existing prototype designs and code are conceptual sources only; do not copy fabricated auth, score, chat or compliance behavior.

### Non-negotiable acceptance
- No mock login, OTP, fake chat, static profile match score, fake admin report counts, fake payment, pretend deletion or unverified security claims in production.
- All three modes must be built with separately visible/consented personas and mutual contact gates, not a generic feed with three labels.
- All member/admin routes need complete states, accessibility, audit, data retention, localization slots and dual-runtime contract tests.
- All planned themes have two 100-question **placeholder** banks in deliverables; only professionally reviewed items may be published and scored as psychological constructs.
- Two deploy targets are part of scope: Cloudflare and production-grade Docker/Node/PostgreSQL, with tested migration and parity.
- The authoritative creative direction is `02_DESIGN/UX_UI_DESIGN_AUTHORITY.md`, not the existing source ZIP's UI.
- Full product delivery includes safety, moderation, multi-admin RBAC, user help, consent, report/block, refunds, compliance operations and telemetry, not only visible screens.
- No pricing, psychometric accuracy, identity verification or legal guarantee may be asserted before evidence and approvals.

## Reference ZIP source findings — NOT product claims
`src/App.tsx` is a React state-driven presentation prototype. `src/data/questions.ts` has example questionnaire item/weight structures; it is not a validated psychometric instrument. `src/data/mockMatches.ts` has hardcoded example candidates/scores. Existing auth, admin, messages and deletion UIs must be replaced with working services before use. Retain concepts only if compatible with this contract.

## Scope interpretation
“Full product” means all approved modules are coded and tested in both backends; not that unreviewed science, unlawful profiling or unapproved payment products are forcibly released. Dependency-related phased construction is legitimate. Any missing final deliverable must be explicitly signed off as a scope change with reason and alternative. Performance scale, legal review and operational staffing are separate acceptance gates.


---

# BRD — Business requirements — Supporting detailed functional inventory

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

**Revised v3:** deterministic scenarios, optional localized content and family-introduction controls as approved; no AI companion or brain replica in scope.

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


---

# PRD — User experience and journeys — Supporting detailed functional inventory

> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# PRD — Product Requirements Document

**Version 1.0 — product specifications, not existing capabilities.** The supplied repository is a visual prototype with simulated auth, reports, matches, messages, billing, security and admin numbers; no mock outputs may be presented as live data.

## 1. Information hierarchy and conceptual vocabulary
- **Account:** authenticating human, internal `user_id`, lifecycle and safety state.
- **Persona:** user's mode-specific public identity: FRIEND, DATE, MATRIMONY. Each mode separately chooses display name, visibility, photos, discovery region, preferences and communication constraints.
- **Assessment:** quiz attempt using a fixed published bank version, unique order seed, explicit consent and response audit trail.
- **Profile vector:** bounded derived dimensions with confidence/coverage, not a physical "brain map".
- **Match candidate:** two eligible consenting personas subject to mutual mode, age, blocks, filters, privacy, location and risk policy.
- **Lens:** similarity/Mirror, difference/Counterpoint, complementarity/Mosaic, overall Resonance. Match score is index-based, not relationship success probability.
- **Introduction:** express mutual opt-in; creates chat authorization only after request accepted.
- **Circle:** user-created topical community with rules and permissions; optional privacy mode.
- **Case:** safety/support complaint with ticket, evidence, timestamps, dispositions, appeal rights and restricted operator access.

## 2. Product-level state machines
**Account:** `invited -> pending_verification -> active -> restricted -> suspended -> deleted` with additional `deletion_pending`. **Mode persona:** `inactive -> onboarding -> ready -> discoverable -> paused -> closed`. **Quiz attempt:** `assigned -> in_progress -> submitted -> scored` or `expired`, `withdrawn`, `invalidated`. **Introduction:** `requested -> accepted -> closed` or `declined`, `expired`, `blocked`. **Message:** `accepted -> persisted -> delivered -> seen` (read-receipt only with user preference). **Report:** `open -> triaged -> investigating -> actioned -> resolved` or `escalated`, `appealed`.

## 3. Journeys
### J01: Arrive and explore
Public landing → transparent how matching works (and its limits) → choose initial mode(s) → sign up via Firebase → verify email → adult age policy → accept current T&C and applicable notices → specify optional psychological profiling consent → choose private display details. No mandatory 100-question wall before the user knows what they will receive.

### J02: Start quiz
Quiz catalog → choose theme and consent scope → estimate time, progress and skipability → backend creates **versioned assignment** → resume across devices → submit subset/full set according to completeness rules → receive self-understanding summary with caveat, examples and score definitions. Quiz cannot claim a diagnosis.

### J03: Discover humans
Mode switcher → eligibility and preference checks → lens toggle (Mirror/Counterpoint/Mosaic) → band filter (100,90,80...10) representing descriptive *index intervals*, not precisely measured probabilities → preview profile with safe shared details → why-you-might-connect/possible friction with confidence → send request (caps and mutual eligibility) → receiver accepts/declines → optional conversation starts.

### J04: Establish trust
Any profile/message/group includes block, mute and report; block suppresses discovery, old requests and messages, without alerting blocked user; report captures safe evidence and case ID, allows immediate preservation where lawful, and acknowledgement. Report is accessible without payment.

### J05: Join/create Circle
Discover themed groups → membership request → accept rules → join thread → moderators manage members/content → creator moderation privileges limited to group, never global admin. Group invites must not expose undisclosed profile or intimate details.

### J06: Upgrade and cancel
Pricing context → clear entitlement list, taxes, renewal amount/date, cancellation → provider checkout → signed webhook to confirm entitlement → invoice and transaction history → cancel future renewal while honoring paid period → downgrade without losing core safety or user data → refund request and manual review.

### J07: Data rights
Settings → privacy control and consent dashboard → download requested structured export → edit/rectify persona → withdraw assessment sharing; delete derived scores or recalculate → request deletion with lawful retention disclosure, non-blocking progress and confirmation.

## 4. Feature epics, requirements and acceptance criteria

| ID | Epic / behavior | Release | Acceptance criteria |
|---|---|---|---|
| P-001 | Create account, verify email and log in | early internal delivery phase | unverified users cannot enter discovery/chat; audited login; rate limited |
| P-002 | Configure mode personas independently | early internal delivery phase | all fields/visibility scoped to selected mode; switching mode never leaks details |
| P-003 | Quiz catalog & placeholder themes | early internal delivery phase | exactly 100 indexed placeholders per published themed set, drafts hidden |
| P-004 | Versioned assessment assignment | early internal delivery phase | server assigns seed/version; idempotent save; resume across devices |
| P-005 | Consent-aware trait synthesis | early internal delivery phase | rescoring deterministic; handles missing data; deletes on withdrawal |
| P-006 | Discovery with lens/band controls | early internal delivery phase | no blocked, ineligible, or non-discoverable users in results |
| P-007 | Explanation and uncertainty | early internal delivery phase | show evidence dimensions and confidence, not proof of guaranteed outcome |
| P-008 | Mutual connection request | early internal delivery phase | cannot message until accepted, unless consented group policy allows |
| P-009 | Private text chat | early internal delivery phase | durable server authorization, moderation triggers, delete/report |
| P-010 | Report, block and support ticket | early internal delivery phase | reporting works under every paid/free state, admin case visible |
| P-011 | Private/public themed Circles | early internal delivery phase constrained | creation gated; moderation queue and anti-spam, caps |
| P-012 | Admin RBAC and audit trail | early internal delivery phase | no admin rights from frontend or client-provided role |
| P-013 | Consent/export/deletion | early internal delivery phase | API job progresses and returns verifiable results |
| P-014 | Razorpay subscriptions | Pilot+ | signed webhook, idempotency, reconciled entitlements |
| P-015 | Multilingual quiz item bank | Post-validation | expert translation and measurement equivalence studies |
| P-016 | AI persona companion/simulated twin | Research only | separate consent, safety and model validation before shipping |
| P-017 | Voice/video calls | Later | cost, abuse, reporting and recording policies approved |
| P-018 | Family-assist matrimony introductions | Later | explicit per-participant approval; no family access by default |

## 5. Three relationship modes — deliberately different outcomes
- **Friendship:** shared interests, schedule compatibility, local region, platonic boundary, desired contact frequency; romantic approach through friendship is reportable unwanted contact after boundary communicated.
- **Dating:** adult-only, mutual declared dating intent, separate selective preference disclosure, opt-in to photos, romantic interest, family expectations where applicable; never infer sexual orientation from hidden questions.
- **Matrimony:** committed intent, voluntary family involvement, education/employment claims labeled self-declared unless independently verified, shared practical life plans, financial expectations, living arrangements; consent-based and anti-coercion safeguards. Avoid caste/religion as hidden ranking or moral merit measures; if legal counsel approves optional explicitly declared preferences, provide transparent user control and fairness monitoring.

## 6. Grouping taxonomy
Global neutral families **Origin** (introductory), **Currents** (thinking/communication), **Mosaic** (complementary roles), **Horizon** (life direction), **Rhythm** (daily habits), **Compass** (values orientation), **Bridge** (conflict repair), **Orbit** (shared interests). Localized expressions may describe preferences but must not rank communities or label them inferior, defective, high/low worth, alpha/beta. Group names must not imply mental diagnoses.

## 7. Content and notification policy
Preferences: product, safety/transactional, marketing separately; email digests default restrained and opt-out for nonessential notifications; no message-content previews on lock screens by default for dating/matrimony; safety notifications are mandatory where legally required; user can turn off activity indicators; no "your soulmate is waiting" fear-of-missing-out framing.

## 8. Edge cases
- Ambiguous self-report answers produce no definitive trait label; incomplete quizzes reduce confidence.
- Users can have multiple persona modes but must not match themselves or bypass prior blocks.
- Deleting account revokes active sessions, disappears from new discovery, and handles retained moderation/payment evidence by lawful schedule.
- Accepted chat counterpart changes mode or revokes consent → existing chat policy must remain clear; no silent mode conversion.
- Safety report against a match → immediate protection while appeal remains independent.
- Location changes → region updates opt-in, never broadcast exact coordinates.
- User under 18 at enrollment or suspected minor → restricted/closed pending safety review.
- Payment partially succeeds → entitlement only from trusted webhook, not redirect query params.
- Empty local matching pool → show transparent waitlist/interest Circles, not invented candidates.

## 9. Suggested success metrics
Eligible active pool by mode/city, quiz meaningful completion, user-reported comfort/safety, match requests accepted, 7/30-day mutual recontact, group recurring interactions, 1k-chat harm rate, complaint SLA, refund rate, 30-day paid retention, contribution margin. Segregate raw quiz telemetry and restrict analyst access.


---

# FRS/SRS — Functional and nonfunctional requirements — Supporting detailed functional inventory

> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# SRS / FRS / NFR — System & Software Requirements

Status: design targets; **not guarantees or verified benchmarks**.

## 1. Technical compatibility and environment
Client: semantic HTML, CSS/Tailwind v4, React 19 + TypeScript strict, Vite 8; TanStack Query or equivalent; React Router; `motion/react` (avoid shipping both old `framer-motion` and `motion` without reason), Zod validation. API: TypeScript Cloudflare Workers/Hono, Web Crypto and JOSE JWT verifier, Drizzle or prepared SQL for D1; separate packages for domain, identity, UI and adapters. Deploy via Wrangler, preview environments and GitHub Actions. Respect all platform runtime limitations; no assumption Node APIs work in Workers.

## 2. Functional requirement groups
**Auth:** FR-A01 verified email/password and Google; FR-A02 password reset; FR-A03 refresh token/session expiration; FR-A04 disabled-user revocation; FR-A05 brute-force protection; FR-A06 privileged admin identity plus MFA; FR-A07 data access request after reauth; FR-A08 email change verification.

**Privacy:** FR-P01 opt-in per relationship mode; FR-P02 quiz and analytics data processing notices; FR-P03 profile field-level visibility; FR-P04 redact/share summarized traits only; FR-P05 export; FR-P06 rectify; FR-P07 deletion queue; FR-P08 documented retention; FR-P09 audit consent notice version and timestamps; FR-P10 honor withdrawal and stop future matching.

**Quiz:** FR-Q01 published 100-item theme banks; FR-Q02 finite versioned attempts; FR-Q03 cryptographically random assignment order; FR-Q04 server-controlled item selection; FR-Q05 save/recover; FR-Q06 skip and revoke; FR-Q07 adaptive branching only with model governance; FR-Q08 no raw answer leakage in public APIs; FR-Q09 question localization; FR-Q10 separate quiz-author and publisher approval.

**Matching:** FR-M01 eligibility hard filters; FR-M02 similarity/difference/complementarity lenses; FR-M03 score-band filtering and counts; FR-M04 explanation; FR-M05 confidence and missing-data info; FR-M06 fairness/bias monitor; FR-M07 rate limiting; FR-M08 anti-sybil; FR-M09 respect blocks; FR-M10 opt-out/pausing.

**Social:** FR-S01 mutual request and spam caps; FR-S02 user text chat; FR-S03 moderated group threads; FR-S04 report message/profile/group; FR-S05 block/mute; FR-S06 media upload gated/scanned; FR-S07 admin case evidence; FR-S08 notifications; FR-S09 user-generated content moderation & appeal; FR-S10 anti-impersonation.

**Commercial:** FR-C01 entitlement catalog; FR-C02 billing checkout; FR-C03 signed webhook and idempotent ledger; FR-C04 invoice/receipt; FR-C05 cancellation; FR-C06 refund path; FR-C07 taxation and GST settings; FR-C08 price version immutability; FR-C09 plan expiry grace policy.

**Admin:** FR-O01 invitation-only admin creation; FR-O02 scoped RBAC; FR-O03 least-privilege case access; FR-O04 two-person critical action approval; FR-O05 PII reveal requires justification; FR-O06 write-only action evidence and tamper-evident audit exports; FR-O07 support tickets; FR-O08 report SLAs; FR-O09 analytics coarse/aggregated; FR-O10 emergency stop flag.

## 3. NFR/SLO targets — controlled production validation and growth

| Dimension | Pilot target | How verified |
|---|---|---|
| API latency | p95 ≤ 700ms for simple API (excluding third-party calls), under representative regional traffic | Worker timings/trace |
| Public page UX | Core Web Vitals LCP ≤ 2.5s, CLS ≤ .1, INP ≤ 200ms on tested mid-range phones | Lighthouse + field RUM |
| Reliability | ≥99.5% monthly core API availability target, excluding documented external provider incidents | synthetic checks |
| Message delivery | >99.9% persisted for accepted messages; retriable and deduplicated | chaos and load tests |
| Data safety | automatic backups, recovery drill each quarter | restore tests |
| Encryption | TLS in transit, private media, key management & appropriate at-rest encryption | security review |
| Access | all PII endpoints authenticated and policy tested | automated permissions matrix |
| Accessibility | WCAG 2.2 AA target; reduced motion, keyboard access, contrast and live regions | axe + manual |
| Browser | current Chrome, Firefox, Safari and Edge; mobile responsive | browser matrix |
| Privacy | no raw psychological answers in client analytics or default log payloads | audit and DLP test |
| API abuse | per-route & per-identity token buckets and anomaly rules | abuse simulation |
| Data deletion | operational within published period except lawful holds | reconciliation job |

These are planning targets; calibrate on load tests and available infrastructure. No absolute 100% uptime promise.

## 4. Security acceptance contracts
Every request verifies `Authorization` token signature, issuer, audience, expiry, account active state, mode membership, operation permission, block relation and object ownership. Tokens alone never grant admin role; server DB `admin_memberships` is authoritative. Every PII read is audited at appropriate granularity. Content Security Policy, secure cookies (if session-based), strict CORS, CSRF protection where cookies used, no secrets embedded in bundles, CSP nonces/hashes, and safe HTML sanitization mandatory.

## 5. Operational error taxonomy
Return structured RFC 7807-style error with stable `code`, user-safe `title`, correlation ID, HTTP status and `retry_after` when applicable. No internal stack trace, source, other user's data or unverified probability in error. Frontend maps: invalid input 400, unauthenticated 401, unauthorized 403, invisible target 404, conflict 409, rate-limited 429, unavailable 503.

## 6. Engineering standards and definition of done
- TypeScript `strict=true`; formatting/lint; changes require reviewers, automated PR checks, migrations up/down with tested rollback; no shared production credentials.
- Every feature includes a threat model delta, event instrumentation with privacy review, empty/error/loading states, mobile accessibility, acceptance test, operator documentation.
- Automated unit, integration, contract, end-to-end, authz fuzz tests, webhook replay test and restore test.
- Deployment uses staged rollout, canary flags, documented runbooks, alert owners and incident communication templates.

## 7. Unsupported promises to prohibit
Do not label messages "Signal Protocol E2EE" without independently audited end-to-end key protocol. TLS + server-side encryption ≠ E2EE. Do not claim biometric or government-ID verification until service genuinely performs it with legitimate basis. Do not suggest "brain replica," "exact human twin," "clinical psychometrics," "scientifically guaranteed marriage" or "uncheatable quiz" in production copy.


---

# Questionnaire governance and lifecycle — Supporting detailed functional inventory

> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# QRD — Questionnaire, Psychometric Research & Assessment Engineering

**Important:** all 100 items per theme are **placeholders by design**. There is no scientific validation at present. Professional psychometric review, consent and longitudinal validation precede use of high-stakes claims.

## 1. Objectives and risks
Collect only data needed to support user-understandable compatibility, not wholesale replication of a human brain. A psychological questionnaire cannot reconstruct consciousness, predict all behaviors, or truthfully prevent respondents from using AI. No hidden sexual-orientation, religion, caste, disability, trauma or mental-health classifier. If a trait is necessary for an explicitly selected dating/matrimony feature, obtain informed, separate, revocable consent for the exact trait and processing purpose; evaluate fairness and legality.

## 2. Proposed themes, each with 100-item **future** sets

| Theme | Short slug | Intended constructs | Releases |
|---|---|---|---|
| Reasoning & Decision Style | DECIDE | uncertainty tolerance, deliberation, problem approach | later controlled production validation |
| Conversation & Conflict | CONNECT | feedback, repair, listening preference | early controlled production validation |
| Values & Trust | COMPASS | reliability, honesty expectations, boundaries | early controlled production validation |
| Emotional Coping | EQUILIBRIUM | self-reported emotion regulation and reassurance needs | expert-gated |
| Social Rhythm | RHYTHM | solitude, availability, activities, contact cadence | early controlled production validation |
| Growth & Ambition | HORIZON | learning goals, career/life goals | later controlled production validation |
| Family & Long-Term Plans | ROOTS | household/family orientation and life plans | matrimony only |
| Money & Practical Life | GROUND | spending, risk, household financial expectations | matrimony only |
| Interests & Curiosity | SPARK | books, art, technology, adventure, hobbies | early controlled production validation |
| Complementary Collaboration | MOSAIC | negotiation, role preferences, task approach | research |
| Digital Boundaries & Privacy | SHIELD | contact boundaries, sharing and safety preferences | early controlled production validation |
| Future Change & Resilience | TIDE | adaptation, moving cities, changes in commitments | later controlled production validation |

Every theme is a **catalog** of versions: `CONNECT-v1-setA` (100 placeholders), `CONNECT-v1-setB` (100 different placeholders), etc. The user asked to avoid repeated questions: achievable by rotating versioned item banks, but mathematically impossible to promise unique items indefinitely with a finite catalog. Clearly limit re-use within a configurable interval and prioritize psychometric comparability over randomness.

## 3. Question model
Required: `question_id` UUID, `theme_id`, `item_bank_version`, `item_revision`, `locale`, `body_placeholder`, `response_type`, `choices`, `construct_ids`, `weighting_version`, `reverse_coded`, `sensitivity_class`, `consent_purpose`, `estimated_seconds`, `active`, `effective_at`, `retired_at`, `psychometric_review_id`, `experiment_group`, `accessibility_label`, and `display_constraints`. All placeholder text must be rendered with **"Draft item—do not infer psychological meaning"** in nonproduction.

Response forms: forced choice, 5/7 point Likert, situational judgment, ranking, optional open text. Free-text high sensitivity requires separate opt-in, moderation/data-minimization and training-data ban by default. Randomize response-option order only when it cannot change interpretation (e.g. do not shuffle Likert scale endpoints). No deceptive "magic trick" claims.

## 4. Quiz assignment / selection
1. Server authenticates user and confirms relevant mode consent and theme eligibility.
2. Server locks a published quiz version, selects from a sufficiently large pool, uses cryptographically secure randomness to make a stable order seed, and stores an encrypted/opaque assignment ID.
3. Exclude items recently seen within policy window, while preserving required anchor items used for score comparability.
4. Deliver a small batch of signed item IDs (not trait weights); answers posted incrementally with `attempt_id`, `item_id`, `revision`, `answer`, and idempotency key.
5. On submit, server validates assignment completeness, consistency, quotas and selected validity signals. Flag anomalies for **retest**, not automatic accusation.
6. Derive traits server-side using a published scoring version; retain enough audit to reproduce the score while respecting deletion and retention schedules.
7. Recalculate all dependent matches if user withdraws consent or a scoring bug is corrected; queue updates and inform users of material changes.

## 5. Anti-gaming—what is realistic
Question-order randomization, alternate wording, scenario variations, lie/social-desirability scales only if validly assessed, test-retest drift analysis, timing anomaly flags (not simplistic AI detector), response consistency checks, rate limits, batch visibility, soft trust flags, optional corroborating experiences over time, bias review and abuse dispute. **Cannot prevent AI usage, nor prove genuine personality from answers alone**. Do not penalize disabled or slow-reading users for time spent.

## 6. Psychological validity and method
- Pre-register constructs and intended score interpretation before collecting data.
- Use peer-reviewed instruments only with license/attribution, Indian language/cultural validation and professional oversight; no diagnosis.
- Conduct cognitive interviews (what does the question mean), controlled production validation item analysis, reliability and temporal stability, dimensionality, convergent/discriminant validation, measurement invariance across relevant demographics if lawfully collected, and outcome validation.
- Avoid assuming Big Five, MBTI, attachment style, "love languages" or proprietary archetypes are interchangeable; each has a different evidentiary basis.
- Compare extended questionnaire against short baseline; report differential attrition and sample-selection effects.
- No outcome interpretation unless suitable representative holdout validation exists; all percentages labeled index agreement and model version.

## 7. Versioning & scoring integrity
`assessment_attempt` binds one exact `item_bank_version`, `scoring_version`, `consent_receipt_id`, pseudonymous member ID, assignment digest, start/end. `score_snapshot` immutable versioned derivation and optional invalidation cause; never overwrite historical score silently. API does not return weights, sensitive responses, anomaly flags or model internals to other users.

## 8. Sample machine-readable placeholder
See `scaffolds/quiz-placeholder.schema.json`. A seed generator should produce `Q001`–`Q100` for each selected theme and set, all with `status:'placeholder'`. They are **not administered in production** until author, psychometric reviewer, legal/privacy reviewer and publishing admin approve.

## 9. Definition of done for a real quiz bank
All 100 published items have clear constructs, age appropriateness, reasonable answer burden, accessibility, localized wording review, no biased or invasive hidden inference, agreed opt-out/skip behavior, validated scoring parameters, supporting documentation, consent notice, model card, adversarial retest, reproducibility tests, and a signed release approval.


---

# Matching rules and explainability — Supporting detailed functional inventory

> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# MRD — Matching, Compatibility Lenses, Identity Taxonomy & Model Governance

## 1. Governing principle
Kithra's numerical match measure is a **model-defined agreement index**, not the probability that two humans will have a successful friendship, date or marriage. `100%` means index maximum given measured dimensions with sufficient coverage; `0%` means measured divergence according to index; never "destined" or "perfect soul". Restrict scores when confidence/coverage is too low.

## 2. Proposed categories and user-friendly labels
- **Mirror Twin**: unusually similar measured scores across selected traits; not identical brains.
- **Counterpoint**: unusually different measured traits; could be interesting, not necessarily compatible.
- **Mosaic Fit**: modeled *complementarity* on a defined set of role/behavior preferences, with mandatory shared boundaries and consent.
- **Resonance**: broad mode-specific shared aims and styles.
- **Horizon Match**: shared growth and future-life goals.
- **Circle Match**: shared activity/community interest.
- **Quiet Harmony**: similar communication pace, not an innate personality class.
These are UI labels under test, not clinical diagnoses, personal worth labels or fixed human castes/classes.

## 3. Eligibility precedes scoring
`eligible(u,v,mode)` requires verified-active adult accounts, same consented mode, each discoverable and allowlisted by region/visibility, no blocks/reports requiring hold, compatible disclosed preferences, age policies, no duplicate/self, within request quotas, not fraud-restricted. Dating/matrimony must respect explicit reciprocal orientation and relationship preferences *only if voluntarily provided for that mode*; no inferred sexual orientation. All hard filters are non-negotiable; **no high score may override consent or a block**.

## 4. Example computational framework (hypothesis, not validated)
For two users, normalize psychometric traits `x_i` and `y_i` to [0,1], and derive `w_i >= 0` from mode-specific published model version. Let `present_i` reflect both having sufficient reliable data, and `confidence_i` be trust in measurement.

`similarity = 100 * Σ(w_i * confidence_i * present_i * (1 - |x_i-y_i|)) / Σ(w_i * confidence_i * present_i)`.

`difference = 100 * Σ(w_i * confidence_i * present_i * |x_i-y_i|) / Σ(w_i * confidence_i * present_i)`.

`complementarity` is NOT simply `difference`: it requires an empirically defensible pairing function for particular preference pairs, and must respect shared values and safety boundaries. Example: one prefers planning and the other prefers spontaneous activities; this may cause friction, not balance. Until validated, expose it as *possible complementary preferences* and let both humans decide.

`score_coverage = Σ(w_i * present_i) / Σ(w_i)`; do not show precision/bands when coverage below a predeclared confidence gate (initial proposal: 70%, to validate). Report rounded intervals/bands (90–100,80–89...10–19) with note "model index", not false exact numeric certainty. UI may offer `100 / 90 / ... / 10` filters only if these represent bucket upper endpoints rather than a claim of 100% psychological accuracy.

## 5. Mode-specific weights (provisional; must be tested)

| Dimension | Friendship | Dating | Matrimony |
|---|---:|---:|---:|
| Shared social activities | 20 | 10 | 5 |
| Communication & conflict | 20 | 25 | 20 |
| Values / boundaries | 25 | 25 | 25 |
| Time / geographic availability | 25 | 15 | 10 |
| Future plans / practical life | 5 | 15 | 30 |
| Complementary habits (validated only) | 5 | 10 | 10 |
| **Total** | **100** | **100** | **100** |

Do **not** present these as scientifically established weights. They are initial hypotheses for offline experimentation. No scoring on protected categories as proxy for worth. A user may disclose religion or other preferences voluntarily but any use in rankings must pass counsel/privacy/fairness review.

## 6. Twin, opposite and puzzle fairness
- Mirror: high similarity + adequate reliability and coverage.
- Counterpoint: high difference; the description says "interesting contrast" not "your destined anti-soulmate".
- Mosaic Fit: specific observable complementarity with **mutual confirmation**; never assert that one partner "fixes" another or can repair illness, trauma, abuse or moral deficiency.
- Population sizes: never claim there is a 100% mirror candidate if nobody meets threshold; transparent empty state.
- Avoid exposure amplification: ranking should balance relevance, new users, fairness, safety and available attention; not always promote already-popular profiles.

## 7. Pair outcome feedback and responsible learning
Collect explicit minimal feedback after actual interactions: comfortable?, mutually wish to continue?, met safely?, contact again at D7/D30? No covert analysis of private messages to infer romance/sexuality. Use consented aggregated outcome analysis to test whether scores predict continuation better than simple baseline; account for selection bias and missing responses; do not train AI models on chat content without a fresh, separate opt-in.

## 8. Match explanation design
For each candidate show: compatible mode, explainable top 3 dimensions, 1–2 possible challenges framed neutrally, data confidence, "What we have not measured," quick block/report, a note that humans are more than an index. Never expose the other's raw quiz answers; only share traits each party specifically marked public in that mode. Disabled or privacy-restricted profiles should not be included.

## 9. Offline experiments and model governance
**Superseded by v3 deterministic policy:** Kithra uses only questionnaire-derived and rule-based comparisons; no AI runtime is in scope.

## 10. Latency & scaling
Use batch match generation on quiz submit/consent change with durable queue; indexed candidate retrieval by mode/region/interest; local top-N rerank in Worker CPU budget; materialize top candidates and lens scores in D1 with model version/time-to-live. Cache non-sensitive cohort counts; never cache private scores across users. For 100k+ active users consider dedicated vector DB/Postgres and async scoring service after measurement, not preemptively.


---

# Data models and API contracts — Supporting detailed functional inventory

> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# DRD / API-RD — Data Model, API Contracts & Events

**Contract principle:** all writes server-validated and idempotent where retries are expected. All selected IDs are opaque, globally unique UUID/ULID; do not expose Firebase UID as primary. Timestamps ISO 8601 UTC. Column and endpoint names are proposals and should be synchronized with migrations / OpenAPI.

## 1. Domain database entities

| Entity | Key data and foreign keys | Important invariants |
|---|---|---|
| users | id, account_status, min_age_verified, created_at, deleted_at | one individual, unique internal ID, deletion holds |
| external_identities | id, user_id, provider, provider_subject, last_verified_at | `(provider,subject)` unique; no trust in client email |
| mode_personas | id, user_id, mode, public_name, visibility, bio, region, status | unique `(user,mode)`, mode-specific fields and blocks |
| mode_consents | id, user_id, mode, notice_version, scope, granted, occurred_at | explicit event history; withdrawal not overwritten |
| profile_fields | id, persona_id, field_key, cipher_value, visibility | privacy tiers; encrypt sensitive values |
| question_themes | id, slug, locale, status | theme is neutral and configurable |
| question_banks | id, theme_id, version, locale, publish_state | immutable after publication |
| questions | id, bank_id, ordinal, text, response_schema, construct_mapping_ref | public API strips traits/weights |
| quiz_attempts | id, user_id, bank_id, seed_ref, status, assigned_at, submitted_at | cannot switch version mid-attempt |
| quiz_assignments | id, attempt_id, question_id, sequence | stable assigned order; unique question/attempt |
| quiz_answers | id, attempt_id, question_id, encrypted_value, updated_at | at-rest application encryption, personal data |
| trait_snapshots | id, user_id, mode, model_version, coverage, encrypted_vector | private by default, immutable version |
| match_snapshots | id, source_persona, target_persona, mode, lens, score_band, model_version | server eligibility verified on retrieval |
| requests | id, from_persona, to_persona, mode, status, expires_at | idempotent duplicate handling; blocked no access |
| conversations | id, mode, membership_version, status | no cross-mode chat accidentally |
| conversation_members | conversation_id, user_id, joined_at, muted | authorized participants only |
| messages | id, conversation_id, sender_id, body_cipher_or_ref, created_at | immutable sender, per-convo sequence |
| circles | id, mode_scope, name, rules_version, visibility, moderation_status | includes privacy and admin policy |
| circle_members | circle_id, user_id, role, state | group roles not platform admin |
| circle_posts | id, circle_id, author_id, body_ref, moderation_state | reports and retention rules |
| blocks | blocker_id, blocked_id, mode_scope, created_at | immediate bilateral discovery suppression |
| reports | id, reporter_id, subject_type, subject_id, category, severity, created_at | reports retained confidentially |
| moderation_cases | id, report_id, assigned_team, priority, state, due_at | appeal and evidence trace |
| case_actions | id, case_id, actor_id, action, rationale, at | immutable-style append-only log |
| support_tickets | id, requester_id, category, state, assignee_id | minimized PII; service SLA |
| admin_memberships | admin_user_id, role_id, state, mfa_verified_at | superadmin grant only via approved workflow |
| roles, permissions, role_permissions | normalized scope, action | capability matrix centrally enforced |
| audit_events | id, actor_id, target_ref, action, metadata_redacted, at, hash_chain | no raw sensitive answers/log payloads |
| payment_customers | user_id, gateway_customer_id | provider ref only; no card data |
| plan_catalog | id, code, price_minor, currency, term_days, visibility | versioned prices/taxes |
| subscriptions | id, user_id, gateway_sub_id, plan_version, state, period_end | webhooks authoritative |
| payments | id, provider_event_id, amount_minor, currency, result | unique provider event ID |
| entitlement_grants | user_id, feature, quota, expires_at, source | no safety features gated |
| rights_requests | id, user_id, type, status, deadline, completed_at | auditable export/erasure |
| export_jobs | id, user_id, object_key, expires_at, state | expiring signed link in private bucket |
| retention_holds | id, subject_id, legal_basis, expiry, approvers | access-controlled, lawful only |
| feature_flags | id, audience, flag_key, enabled, version | no hardcoded toggles |
| notification_jobs | id, user_id, kind, state, attempts | channel preference respected |

**Data domains:** (1) identity (Firebase), (2) social/personas (D1), (3) derived assessments (D1 encrypted fields), (4) media/exports (R2 private), (5) support/audit (restricted D1 or isolated DB). Avoid exposing admin to raw quizzes in normal views; provide redacted summaries when appropriate.

## 2. Index and retention design
High-value indexes: `mode_personas(mode,status,region)`, `external_identities(provider,subject)`, `questions(bank_id,ordinal)`, `quiz_answers(attempt_id,question_id)`, `requests(to_persona,status,created_at)`, `messages(conversation_id,created_at)`, `reports(status,created_at)`, `moderation_cases(state,due_at)`, `subscriptions(user_id,state)`, `payments(provider_event_id)`, `audit_events(target_ref,at)`. Every dataset has classification, declared purpose, retention trigger, deletion mode, processor and access role. Do not add broad PII indexes without need.

## 3. REST API v1 (representative)

| Method | Endpoint | Permission / behavior |
|---|---|---|
| GET | `/v1/me` | logged-in profile and consent state |
| PATCH | `/v1/me` | self only, permitted fields, reauth if sensitive |
| POST | `/v1/me/modes` | activate one mode with appropriate notice |
| PATCH | `/v1/personas/{id}` | owner and matching mode only |
| GET | `/v1/quiz/themes` | public approved catalog; localization |
| POST | `/v1/quiz/attempts` | assign versioned question bank; auth |
| GET | `/v1/quiz/attempts/{id}` | owner only, no trait weights |
| PUT | `/v1/quiz/attempts/{id}/answers` | idempotent upsert; ownership + schema |
| POST | `/v1/quiz/attempts/{id}/submit` | score async and return job/status |
| GET | `/v1/reports/me?mode=friend` | own derived report only |
| GET | `/v1/discovery?mode=friend&lens=mirror&band=80` | enforce consent, blocks, fraud gate |
| POST | `/v1/introductions` | one-user request with quota |
| POST | `/v1/introductions/{id}/respond` | receiver action only |
| GET | `/v1/conversations` | members only |
| POST | `/v1/conversations/{id}/messages` | member, rate/abuse gated |
| POST | `/v1/blocks` | immediate user protection |
| POST | `/v1/reports` | reporting works free and after block |
| GET/POST | `/v1/circles`, `/v1/circles/{id}/join` | contextual membership |
| POST | `/v1/payments/checkout` | entitlement catalog + provider checkout |
| POST | `/v1/webhooks/razorpay` | signed raw body, not user-auth |
| POST | `/v1/rights/exports` | self + reauth, rate-limited |
| POST | `/v1/rights/deletion` | self + reauth + retention explanation |
| GET | `/v1/admin/cases` | admin claim + case read capability + MFA |
| POST | `/v1/admin/cases/{id}/actions` | permission, reason, audit and double-check |
| POST | `/v1/admin/invitations` | admin-management grant only; never client role |
| GET | `/v1/admin/audit` | security auditor or superadmin scoped |

See `scaffolds/routes.openapi.yaml` as minimal machine-readable skeleton; developer must expand every endpoint and generate typed clients.

## 4. Example API payloads
```json
{"mode":"friend","lens":"mirror","band":{"min":80,"max":89},"limit":20,"cursor":"opaque"}
```
```json
{"candidate_id":"p_opaque","lens":"mirror","index_band":"80-89","coverage":0.84,"explanations":["similar communication pace","shared preferred activities"],"caveat":"Compatibility index, not a relationship prediction"}
```
```json
{"question_id":"q_opaque","answer":{"choice_id":"a3"},"assignment_revision":1,"idempotency_key":"client-generated-unique"}
```
Responses must never include raw hidden item-trait weights, nonconsented protected characteristics, other users' private answers, service secrets, internal audit logs or unapproved verification artifacts.

## 5. Events, retries, eventual consistency
Events: `UserVerified`, `ModeConsentGranted`, `ModeConsentWithdrawn`, `QuizAttemptSubmitted`, `TraitSnapshotComputed`, `MatchCacheInvalidated`, `IntroductionAccepted`, `MessageSent`, `UserBlocked`, `ReportCreated`, `CaseEscalated`, `SubscriptionPaymentSettled`, `RefundIssued`, `AccountDeletionRequested`, `AccountErased`. Carry `event_id`, `schema_version`, actor, minimized payload, timestamp, aggregate ID, idempotency key. Use transactional outbox where possible; worker retries never double-charge, re-send abusive content or re-grant access. Consent withdrawal and blocks are synchronous in access policy even if cached matches update later.

## 6. D1 SQL scaffold caveat
`scaffolds/schema.sql` is only a core baseline for implementation and performance tests. It does not cover every table or encryption model described above. Security-sensitive and legal-retention behaviors must have migration review and explicit integration tests before deployment.


---

# Community, culture and growth — Supporting detailed functional inventory

> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Community-RD / Growth-RD — Circles, Social Graph, Regionalization & Healthy Network Effects

## 1. The cold-start problem
Kithra can contain hundreds of thousands of inactive accounts yet provide no useful matches in a specific gender/intent/region/age/interest pool. Report **eligible active candidate density** by selected mode, city and broad interests, not raw registration count; expose truthful waitlists. Prefer one tested launch cohort and 2–3 scheduled activities to shallow national expansion. Group programming should create a reason to return that is not an engagement addiction loop.

## 2. Independent social surfaces
- **Member social graph:** voluntary mutual connection edge; block relation overrides any edge.
- **Mode persona graph:** public discovery edge scoped by selected mode; a friendship connection does not imply dating availability.
- **Circle graph:** group membership and moderation role not proof of off-platform compatibility.
- **Quiz graph:** index derived privately, never display other users' undisclosed raw answers.
- **Offline event graph:** consent-based RSVP; default public location only, no home/real-time tracking.

## 3. Circle feature specification
`Circle` has ID, neutral name, description, primary theme, optional mode restriction, coarse location, language(s), visibility (`public_listed`, `private_unlisted`, `invite_only`), membership rules, owner, moderators, max members, creation review status, content policy version. User actions: explore, request join, accept rules, view posts, mute, leave, block member, report content, create restricted circle with quotas. Circle admin actions: approve membership, pin rules, remove content, temporarily mute, send membership announcements subject to policy. Platform admins retain safety oversight; group managers cannot see intimate quiz data or global case records.

## 4. Region-neutral personality naming
Do not categorize people into alpha/beta, high/low status, superior/inferior, religion/caste-based "types". **Universal labels** for interpretive dimensions: `Compass`, `Rhythm`, `Mosaic`, `Horizon`, `Current`, `Bridge`, `Spark`, `Anchor`. **Optional India-oriented expressive aliases** for community themes (not immutable psychological classifications): `Sangam` (confluence), `Setu` (bridge), `Lehar` (wave), `Aangan` (shared gathering place), `Udaan` (aspiration). Indian language professionals should assess meanings and accessibility; English, Hindi and Tamil expressions cannot be assumed culturally interchangeable. These names describe communities and preferences, **not ethnicity, caste, religion, worth or destiny**. All members can browse or opt out; no identity-based assignment.

## 5. More features that fit this universe (prioritized by outcome)

| Experience | User need | Phase | Safety and cost caveat |
|---|---|---|---|
| Small-group icebreaker Circles | avoid awkward one-to-one beginnings | early internal delivery phase after moderation | group reporting & boundaries |
| Mutual conversation starters | help first meaningful dialogue | early internal delivery phase | optional, not auto-sent AI |
| Shared reading/learning challenge | repeat organic contact | post-controlled production validation | avoid leaderboard pressure |
| City newcomers board | discover local safe groups | post-controlled production validation | coarse location only |
| Co-working/creator collaborations | productive friendship | post-controlled production validation | anti-scam and IP policy |
| Quiet affinity groups | accessible low-pressure friendships | post-controlled production validation | privacy, member choice |
| Intent-specific date planning | safer date logistics | later | venue info, no live tracking |
| Shared-life-planning conversation guide | matrimony mutual expectations | later | self-declared, no guarantee |
| Community-host toolkit | partnerships and repeat meetups | later | host identity and liability review |
| Conversation follow-up reminder | reduce ghosting with consent | post-controlled production validation | no spam or guilt prompts |
| Compatibility change tracker | self-reflection over time | later | privacy and scoring drift |
| AI-summarized preference card | opt-in clarity | research | third-party data processing |
| Video/voice groups | online social presence | much later | high moderation/media costs |
| Moderated real-world events | strengthen ties | later | event safety and organizer vetting |
| Professional peer circles | founder and tech collaborations | post-controlled production validation | job/scam solicitation checks |

## 6. Gamification limits
Reward *mutual, useful outcomes* like attending agreed small groups or completing a conversation guide, not message volume, streaks, harmful self-disclosure, desirability ranking or coercive endorsements. No visible scores that indicate higher personal value. Referral campaigns must be opt-in, anti-spam, without revealing who uses matrimonial mode. Every new social mechanic must report harassment and exclusion risks.

## 7. Messaging and notifications economics
Allow member-generated invitations only within quotas; message dispatch via DO and persistence in D1; attachment lifecycle to R2; opt-in email summaries, low-frequency suggestions and a single configurable quiet-hours setting. No paid unlock for receiving basic messages from a mutual consented match. If push notifications are eventually built, respect mode concealment on lock screens.

## 8. Localization and inclusion
Support multilingual UI separately from psychometric translation: UI labels can be translated with ordinary QA; psychological questions require cognitive interviews and item-level measurement equivalence analysis. Right-to-left ready components if expanding internationally; avoid culturally biased labels, no photographs of fictitious people labeled as current members, avoid assumptions of family authority in matrimony. Regional data retention/sharing assessed for all chosen providers.

## 9. Growth experiments
Test: `city-newcomer circles`, `interest cohort`, `founder/learning club`, `serious relationship conversation prompts` as separate cohorts. Measure invite→active conversion, safe mutual introductions, repeat contact, circle active member concentration, moderation cost per 100 active participants. Partner with clubs only when a real co-host and safety point of contact exists; never claim vendor endorsement without contract.


---

# Roadmap and full feature backlog — Supporting detailed functional inventory

> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Delivery-RD — Dependency-aware Delivery, Roadmap & Developer Backlog

**This is a recommended phased roadmap, not an estimate that one person can complete all of it in 90 days.** Three relationship modes, psychometrics, chat, public groups and an operating moderation console are a multi-disciplinary product; avoid committing to a calendar that substitutes for staff/clinical/legal work.

## 1. Workstream dependencies
1. Product/legal gates and safety policy before collecting intimate answers.
2. Auth/identity, consent, mode persona and admin roles before quizzes/discovery/chat.
3. Question bank review/permissioning before psychological scoring can represent anything meaningful.
4. Matching policy and score contract before candidate discovery.
5. Report/block/moderation capacity before stranger chat/groups/media.
6. Billing ledger and cancellation tested before paid plans.
7. App metrics and safety analytics before feature expansion.
8. Migration abstraction before major DB growth, not after vendor lock-in.

## 2. Planning calendar for a small team
**Phase 0 — 0–30 days: research and controlled validation.** 20–30 interviews per initial segment, safe concierge matching, separate positioning tests for three modes, opinionated legality/data map, architecture spike, brand prototype. **Exit:** evidence of repeat contact and trust with consenting adults; no full public launch.

**Phase 1 — 30–60 days: secure skeleton.** Monorepo, design tokens/story components, CI/CD, identity/JWT verification, mode-scoped personas, D1 migrations, admin invitation + MFA, consent log, rights request scaffold, private R2 upload, safety report pipeline, worker observability and audit logging. **Exit:** demonstrated deny-by-default auth and data boundaries.

**Phase 2 — 60–90 days: restricted experience.** Approved limited theme quiz, server-side scoring with transparent caveat, match candidate batch, discovery, requests, text chat, blocks/reports, moderated private Circles, admin case triage, consent withdrawal and data export/deletion end-to-end. Security review and controlled production validation readiness gate. **Exit:** approved adult invite-only controlled production validation with staff safety coverage.

**Phase 3 — 90–150 days: validate and harden.** cohort science, accessibility/bias/security fixes, stable messaging and SLA alerts, backup/restore, full customer support, moderation staff training and billing gateway test. Only then consider subscriptions, public Circles, staged cities, additional themed banks.

**Phase 4 — internal delivery sequencing, not optional scope:** localization, question reviews, community growth and server cutover. Every agreed feature remains in the full-product delivery contract, subject to lawful operation.

## 3. Developer sprint epics / estimation units

| Epic ID | Scope | Dependency | Relative size | Release acceptance |
|---|---|---|---|---|
| E00 | repo assessment, remove simulated claims, architecture setup | none | M | no demo auth in production |
| E01 | Firebase identity + JWT and account mapping | E00 | L | all invalid tokens rejected |
| E02 | mode consent, profiles & field ACL | E01 | XL | cross-mode isolation tested |
| E03 | public UX and component design | E00 | L | responsive, WCAG tests |
| E04 | question catalog/banks/attempts | E01,E02 | XL | deterministic versioning and resume |
| E05 | scoring engine + explanations | E04 + scientific approval | XL | reproduce all scores; caveats |
| E06 | matching discovery + cache + consent | E05,E02 | XL | hard safety filters enforced |
| E07 | connection requests + text chat | E06,E08 | XL | mutual consent and report tools |
| E08 | moderator/admin cases, roles, complaints | E01,E02 | XL | first/second-line safety flows |
| E09 | Circles & group controls | E07,E08 | XL | group-specific moderation |
| E10 | data rights, deletion and retention | E02,E04,E08 | XL | verified end-to-end erasure jobs |
| E11 | payment entitlements + renewals | E08,E10 | L | reconciled webhook/cancel |
| E12 | security/observability/backup | all | XL | incident drill and pentest |
| E13 | outcome analytics & experiments | E06,E07 | M | 7/30-day outcome reports |
| E14 | multilingual coverage, validated deterministic scenarios, optional media | approval gates | XXL | full product scope where legally/operationally allowed |

Relative sizes XS/S/M/L/XL/XXL represent comparative effort, not person-day promises. Milestone timing must be re-estimated after staffing and prototype tests.

## 4. Full feature priority table
**MUST before public launch:** authenticated accounts, verified adult eligibility policy, profile privacy by mode, opt-in quiz consent, scoring caveat, discovery hard filters, mutual request, text-only safe chat, block/report, support desk, basic moderation + on-call, admin MFA/RBAC, consent rights, accurate terms/privacy, backup/restore, operational logs, security audit, error handling and accessibility.

**SHOULD after controlled production validation:** varied question sets, natural-language score explanations from approved traits, moderated Circles and meetups, payment plans, in-app notifications, user feedback, better insight graphs, verified claimed facts with provider-approved flow.

**COULD after evidence:** verified organizers, official curated group sessions, discovery quality learning, long-term compatibility research, advanced conversation prompts, localized cohorts, optional family-assisted matrimony.

**Excluded:** mind replicas, concealed protected-trait prediction, public raw answers, intrusive biometric collection, mandatory Aadhaar, adult+minor matching, unmoderated anonymous groups, paid consent bypass and guarantees.

## 5. Cost-aware feature flags and graceful modes
- `public_discovery_enabled`, `new_signups_enabled`, `media_upload_enabled`, `private_groups_enabled`, `matching_compute_enabled`, `payments_enabled`, `ai_simulation_enabled=false`, `read_only_mode`.
- On Cloudflare limit exhaustion protect help and reporting via alternative documented contact; do not hide safety system behind rate limit. Offline/retry states must not create duplicate payments or messages.
- Configure per-month spend caps/alerts for R2/Worker/DO, account creation SMS email and moderation time.

## 6. Deliverables for each discipline
**Founder:** persona interview log, revenue assumptions, acceptance and risk signoffs. **Psychology:** construct map, survey licenses, item validation, model card and unfairness tests. **Designer:** all Figma screens, tokens, responsive prototypes and content guidance. **Engineer:** tested code, API spec, migration scripts, ops dashboards, secrets, CI and runbooks. **Security:** threat model, pentest, checklist, incident tabletop. **Legal:** signed policies, data map, record of applicability, grievance procedures. **Moderator:** documented queue, escalation, appeals and training simulations. **QA:** traceability matrix and defect severity ledger.

## 7. Definition of a shippable vertical slice
A real authorized user (not mocked) activates friendship mode, completes a **valid published** safe assessment, receives a clearly caveated index, sees only eligible and opt-in candidate(s), sends/receives a request, exchanges a persisted text message, reports abuse, has a human respond via authenticated case handling, and withdraws profiling consent such that further matching ceases; all actions audited/tested and legal review complete.

## 8. Explicit next decisions
D01 city/cohort for launch; D02 invitation-only vs open beta; D03 timeline and staff coverage; D04 science advisor and research protocol; D05 first published theme approval; D06 starting plan price research; D07 host region/vendor contracts; D08 moderated image capability; D09 identity verification policy; D10 whether any paid/matrimonial family tools are delayed; D11 brand/domain clearance and Indian company identity; D12 responsible officer contact.


---

# Competitors, research and validation — Supporting detailed functional inventory

> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Competitive-RD / Market Validation — Product Reality in India and Abroad

**Research status 1 November 2026.** Available downloads/revenue claims do not prove psychological matching efficacy. Kithra's overlap is strong; AI-persona matching is not new. Always separate self-reported figures, public marketing, verified financial results and independent outcomes.

## 1. Competitors with clear functional overlap

| Competitor | Overlap with Kithra | Evidence and interpretation |
|---|---|---|
| OkCupid | deep questionnaire + match percentages | established questionnaire compatibility; not guaranteed success; https://www.okcupid.com/ |
| We3 | psychographic questions, friendship groups and explanations | site describes hundreds of factors and triadic introduction; reported >1M tribes and 50k+ in-person meetups **self-reported**, not independently audited: https://www.we3app.com/how-it-works/ |
| Boo | personality-based friends + dating with communities | official FAQ says 30-question test, personality matches and friend/date modes; https://boo.world/faq |
| Dimensional | >200 psychological traits, compare relationship dimensions | official site reports 200+ traits; https://www.dimensional.me/ |
| TrulyMadly | Indian dating, compatibility and verification | Inc42 financial breakdown FY25 approx revenue ₹12.3 crore and net loss ₹1 crore; source is third-party financial compilation, not outcomes: https://inc42.com/company/trulymadly/financials/ |
| Aisle | India-focused serious dating, curated discovery | current features/revenue/scale should be rechecked from company and filings, no high-certainty psychological claim; https://www.aisle.co/ |
| Schmooze | indirect preference inference from memes, Indian product | Business Standard Sep 2024: company reported 1M Indian users in 10 months, raised $4M; not proven relationship outcomes: https://www.business-standard.com/companies/start-ups/ai-led-dating-platform-schmooze-raises-4-million-series-a-round-124091701179_1.html |
| Konvo | **AI twins** converse and preview potential matches | site advertises AI twin chats/virtual dates and made-for-India positioning; claims have not been independently validated: https://konvo.space/ |
| Betterhalf | India-oriented matrimony with algorithmic claims | adjacent paid serious-intent audience; https://www.betterhalf.ai/ |
| Hinge | prompt-driven relationship discovery | broader intent-based discovery; https://hinge.co/ |
| Meetup | activity-led friendships | actual group activities, no long psychometrics; https://www.meetup.com/ |
| Discord / WhatsApp | organic communities and conversations | substitute for social infrastructure; https://discord.com/ and https://www.whatsapp.com/ |

## 2. Relevant competitor counterstrategies
- **Against OkCupid:** show why a score is meaningful, mode separation, consent and real continuation, not merely more questions.
- **Against We3:** explore one-to-one and group friendship formats with actual 7/30-day mutual outcomes, friend boundaries, local density and better privacy clarity.
- **Against Boo:** clear choice of friendship/dating/matrimony and measurable connection quality, not personality type stereotypes.
- **Against Dimensional:** practical voluntary introductions and safety rather than just a dashboard of traits.
- **Against Konvo:** avoid premature AI replica promise, provide validated consented behavioral insights and a transparent data-governance advantage.
- **Against Indian dating incumbents:** build trust and resolve safety issues operationally, without pretending algorithmic compatibility removes human uncertainty.

## 3. India readiness and true success test
Evidence of downloads/registrations is **not** evidence of active compatible matches. For each operator evaluate: India monthly active users in target city and mode, gender/intent composition where publicly verified, 30-day retention, share of mutual conversations, repeat contact and outcomes, subscription conversion/paid refunds, user complaints and moderation capacity. Most private startups do not publish reliable causal success data; label unknown rather than estimate a number.

## 4. Field validation program
**Superseded by v3 deterministic policy:** Kithra uses only questionnaire-derived and rule-based comparisons; no AI runtime is in scope.

## 5. Falsifiable go / change / stop rules
**GO to secure beta:** user demand plus positive evidence of safe repeat interactions and willingness to participate without exaggerated claims. **CHANGE matching:** questionnaire burden increases abandonment with no credible lift over simple interests. **CHANGE niche:** no local active compatible density despite reasonable acquisition; move to narrower age/community/language pool. **STOP or pause:** unmanaged abuse, inability to staff legal safety response, high privacy risks that cannot be mitigated, deceptive model explanation dependence, unsustainable per-active-member economics. These are decision rules, not predictions.

## 6. What cannot honestly be claimed
No proven competitor was identified with independently verified "100% brain replication", "90% relationship success" or certainty of opposite/puzzle-fit marriage outcome in India. Commercial marketing may use soulmate language; Kithra must not equate such claims with science.
