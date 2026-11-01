# KITHRA — COMPLETE 360° FULL-PRODUCT & DUAL-DEPLOYMENT MASTER HANDOVER

**Version 3.0 · 1 November 2026 · No AI twins; deterministic matching only · Complete scope**

This is an implementation specification, not running product code, legal clearance, an approved psychometric instrument or a guarantee of compatibility. New v3 chapters control any earlier contradictory language.


---

## VOLUME 1: 00_START_HERE/SCOPE_CORRECTIONS_AND_README.md

# KITHRA FINAL 360° DEVELOPMENT KIT — READ THIS FIRST
**Date:** 1 November 2026 | **Version:** 3.0 (full product, two infrastructure targets)

## Binding scope, superceding every earlier document and the uploaded ZIP
1. **No AI twins, no AI runtime, no LLM-based matching, no neural brain-copy claims.** The core product is 100% deterministic, explainable questionnaires, database relations, authored rules, scored constructs and conditional, auditable behavioral scenarios. This is a *behavior-pattern model*, not a predictive replica of a human mind.
2. Kithra is **full scope**, including Friendship, Dating and Matrimony, with explicit separate mode choice, a complete user app, public marketing site, admin/moderator/support console, payments, security, privacy and compliance. Engineering scheduling may be staged but agreed requirements cannot be silently removed. Questions themselves remain clearly marked placeholders until scientifically, ethically and linguistically reviewed.
3. **Cloudflare + Server:** same frontends and domain rules. New Cloudflare build targets Workers Static Assets + Workers/Hono + D1 + R2 + Durable Objects + Queues/Cron. Server targets Node/Hono + PostgreSQL + Redis + WebSocket + S3/R2 + Docker Compose/Caddy + Jenkins. GitHub Actions handles CI and Cloudflare promotion; Jenkins deploys server images. Migrations tested, not “one click”.
4. Uploaded `Kithra-main.zip` is a **concept/reference**, not source of truth and not a production-ready backend. Prior material may contain simulated auth, scores and chats. Do not copy fabricated UI claims of verification or encryption.
5. This package includes an independent **visual and motion contract**, not merely the earlier example UI. End-to-end user/admin screen coverage, Indian/international typographic fallback, Figma deliverable checklist and separate runnable static style-preview are provided.
6. Compliance is a system of legal review, privacy-engineered functionality and actual incident response, not a clause that prevents Indian authorities applying the law.

## Source-of-truth hierarchy (conflict resolution)
`00_START_HERE` -> `03_MATCHING` for deterministic science -> `02_DESIGN` for visual and motion -> `04_ENGINEERING` for infrastructure -> `05_SECURITY_LEGAL` for controls -> `06_QA_DEVOPS` for tests -> `07_FINANCE` for assumptions -> `01_PRODUCT` for full functional inventory -> `08_REFERENCE` only for historical traceability. If exact method/wiring conflicts, top-level v3 requirements control. All old twin references in historical sources are invalid even if inadvertently present. Any new feature affecting private traits requires privacy/science approvals.

## What to give each team
- **Founder/Product:** `KITHRA_MASTER_FULL_PRODUCT_2026.md`, BRD/PRD/FRS, acceptance register and financial assumptions.
- **UI/UX designer:** `02_DESIGN/UX_UI_DESIGN_AUTHORITY.md` plus `10_PREVIEW/Kithra_Design_Direction.html`; deliver editable Figma foundations, desktop/mobile screens and motion storyboards.
- **Frontend engineer:** design authority, member/admin screen contracts, `design-tokens.json`, Motion example, i18n and a11y tests.
- **Backend engineer:** deterministic scoring, mode-privacy and API contracts, dual runtime ports, D1/Postgres migration contracts and full feature register.
- **DevOps:** workflows, Wrangler templates, Docker Compose/Jenkins/Caddy templates, pipeline and rollback test requirements.
- **Trust/moderation:** admin workflow and permission matrix, incident response, grievance and privacy policies.
- **Indian counsel:** data inventory, retention, notices, terms, digital privacy rules, consumer payments and grievance classification.
- **QA:** golden matching fixtures, parallel backend contract tests, E2E/a11y/security cases and full release gates.

## Included deliverables — practical limits
Docs are design/engineering implementation specifications and **deployment scaffolds**, not a complete working application. Configs require real accounts, IDs, secret stores, DNS, security review, tested production dependencies and application code before they will deploy. Placeholders are not finished psychological quizzes. Current public and official provider references are recorded; re-check laws/pricing before release.

## Decision freeze checklist
Founder signs business positioning, single vs multi-mode subscription, tier pricing, initial supported locales, verification provider, privacy retention schedule, regional hosting and staff operations budget. Psychometric reviewer signs construct definitions, question banks and claims. Counsel signs legal policies and escalation. DevOps confirms cloud/server capacity and recovery. UX lead approves design tokens and complete flows. QA lead confirms both deployment targets. No default “approve everything” consent.


---

## VOLUME 2: 01_PRODUCT/KITHRA_FULL_BRD_PRD_FRS.md

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

**Complete-product scope:** supervisor-reviewed communities, localized constructs, voluntary family introduction controls, audited deterministic simulation and any approved video/media features. No AI companion, AI twin or neural brain replica is in scope. High-risk biometric, mandatory Aadhaar and hidden sensitive profiling are explicitly excluded.

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

**EXCLUDED AS UNSAFE/UNSUPPORTED:** neural mind replicas, covert sensitive-trait prediction, raw quiz publication, unwarranted biometrics, mandatory Aadhaar, adult+minor matching, unmoderated anonymous groups, paid bypass of consent, guaranteed relationships. Video/voice, if approved and contracted, requires independent privacy, safety and infrastructure specifications.

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


---

## VOLUME 3: 03_MATCHING/DETERMINISTIC_BEHAVIOURAL_ENGINE.md

# KITHRA — DETERMINISTIC QUESTIONNAIRE & BEHAVIORAL SIMULATION SPECIFICATION
Version 3.0 | Science/Engineering/Trust requirement | No AI model, no AI twin, no neural replication.

## 1. Central definition
Kithra builds a **versioned, deterministic, explainable behavioral profile** from a person's consented questionnaire responses, optional explicit preferences, and user-visible self-corrections. It compares two profiles for measured agreement, selected practical constraints and hypothesized complementarity. It can run **rule-based scenario simulations** to show how *stated preferences* might interact. It does not reconstruct neural structure, read hidden intentions, guarantee behavior, infer sexuality/religion/mental health from covert questions, or determine who “deserves” whom.
The term “brain replica” is disallowed in technical API labels, terms, user-facing marketing, pricing and product UI. `BehaviorPatternSnapshot` is the domain entity. External representations may call it **My Patterns**. No LLM, embeddings, fine-tuning, agent chats, inference-billing or private twin simulation architecture is in contracted scope. AI tools used by developers to write code do not change this runtime requirement.

## 2. Why this boundary matters
Questionnaires measure reported choices under specific framing and context, often imperfectly. Repeated scenarios and response-consistency checks can improve certain measurement properties if validated; they cannot prevent human deception or answer changes. Human relationships depend on mutual attraction, circumstances, timing, reciprocal behavior, safety and growth. Kithra reports **measured agreement**, never statistical probability of a successful marriage unless independent prospective validation justifies and calibrates that exact claim. A deterministic algorithm is reproducible, not automatically scientifically valid.

## 3. Domain model and rules
Entities: `QuestionBank`, `Theme`, `Question`, `QuestionVariant`, `ScoringKey`, `QuizAssignment`, `ResponseRevision`, `AssessmentSession`, `ConstructDefinition`, `ConstructScore`, `BehaviorPatternSnapshot`, `SimulationScenario`, `SimulationRule`, `MatchSnapshot`, `MatchExplanation`, `ConsentGrant`, `PersonMode`, `MatchFeedback`, `ValidationStudy`, `FairnessReport`. All have UUIDs and immutable semantic versions; avoid global mutable answer keys. Mode-private fields are isolated by consent and storage metadata.
A questionnaire theme contains one or more **sets of 100 items**. The twelve starter placeholder themes in the supplied CSV are: Reasoning & Decision Style (DECIDE), Conversation & Conflict (CONNECT), Values & Trust (COMPASS), Emotional Coping (EQUILIBRIUM), Social Rhythm (RHYTHM), Growth & Ambition (HORIZON), Family & Long-Term Plans (ROOTS), Money & Practical Life (GROUND), Interests & Curiosity (SPARK), Complementary Collaboration (MOSAIC), Digital Boundaries & Privacy (SHIELD), Future Change & Resilience (TIDE). Each theme has Set A and B: 12×2×100=2,400 placeholders. These are **not 2,400 scientifically validated questions**. Published themes need qualified expert review, localization and validity evidence before representing scored psychological constructs.

## 4. Question schema
```ts
type ItemType = 'single_choice'|'likert'|'forced_choice'|'scenario'|'rank'|'frequency';
type Question = {
  id: string; themeId: string; bankId: string; version: string;
  locale: string; itemType: ItemType; prompt: string; options: Array<{id:string;text:string}>;
  constructIds: string[]; scoringKeyVersion: string; sensitivity: 'standard'|'elevated';
  required: boolean; reverseCoded: boolean; evidenceStatus: 'placeholder'|'draft'|'reviewed'|'validated';
  translationReviewStatus: string; accessibilityNotes?: string; retiredAt?: string;
};
```
Only reviewer-authorized item banks are publishable. `QuestionVariant` changes wording/context without changing measurement intent only after differential-item-functioning review; random question variants are not assumed equivalent.

## 5. Assignment, shuffle, caching and retest
`sessionSeed = HMAC-SHA256(secretVersion, userUuid || bankVersion || assessmentInstanceUuid)`. Use server-side SHA-based Fisher–Yates PRNG for stable item order and option order per session. User A and user B get different possible sequences; **do not promise no two users ever see the same questions**, since finite question banks cannot guarantee that. Resume shows the identical assignment; do not reshuffle on back navigation, locale switch or retries. Distinct item pools can vary by assignment where calibrated equivalent item forms exist. Keep visible optional skipped-item policy.
Session lifecycle: created -> active -> paused -> submitted -> scored -> superseded or withdrawn; server timestamps every save; idempotency key per answer revision; ETag optimistic locking on multi-device collisions; offline drafts cannot silently overwrite newer server responses. Restore/recompute uses original item bank and key versions. When scoring version changes, keep prior snapshot and show `Updated assessment available` with reasons and user choice.

## 6. Score construction (illustrative, NOT validated)
For construct `c`, let `w_j` = signed reviewer-approved item loading and `r_j` = coded respondent answer (normalized 0..1) for nonmissing items. `s_c = sum(w_j*r_j)/sum(abs(w_j))`, with version-specific transformation into 0–100 bounded display. Handle negative/reverse keys with explicitly tested transform; never let unused items silently contribute 0. Require minimum answered items and confidence/coverage guardrails per construct. Missing, invalid and skipped items reduce coverage and may disable scoring.
Pairwise similarity `A_c(u,v) = max(0, 1 - abs(s_uc - s_vc)/100)`; evidence weighted average over overlapping, comparably calibrated constructs. Do not claim 100 if construct overlap below threshold. Compute a practical constraint gate first (`age >=18`, mutual mode opt-in, location/privacy boundaries, blocked lists, visibility, requested gender/relationship preferences for Dating/Matrimony where explicitly selected). If gate fails: no candidate in results, even if trait similarity is high.
Similarity lens (“**Echo**”): `100 × sum(w_c * A_c)/sum(w_c)` over compatible constructs, with coverage and methodology version. “**Counterpoint**”: rank intentional trait contrasts separately, with user opt-in, and explain precise differences; it is **not** `100 − Echo`, and not a score of opposition as virtue or defect. “**Mosaic Fit**”: compute complementarity only for *predefined consensual, useful pairings* (e.g., one likes planning, the other likes improvisation if both prefer that dynamic). Mathematically `100 × sum(v_k * f_k(u,v))/sum(v_k)` where `f_k` is bounded, documented rule, `v_k` is approved pair weight; defaults to `not evaluated` when no validation. All three scores are descriptive constructs, not probabilities.
Return score to 1 decimal internally; UI can display decade bands if product preference. Visible 100% means all compared items/constructs under that lens align at scoring resolution; NEVER “you have found your identical brain/soul”. UI must display `Based on n answered comparable items; model vX.Y; not a guarantee of connection.`

## 7. Deterministic behavioral scenarios
Examples: a last-minute changed plan, how to respond to conflict after stress, how frequently to message, how to share hobbies, expectations around caregiving or joint finances (only Matrimony with explicit consent). Each scenario has named inputs, rule version, threshold/lookup mapping, explanation template and caveat. Two people's scenarios can be combined into a **possible friction/support map**. E.g. if person A chooses “check-in every day” and B chooses “check-in weekly,” explain that they may wish to discuss communication cadence. Do not simulate fabricated exact quotes from users, infer likely sexual orientation or output “this user WILL do X.” Phrase “Responses suggest A may prefer X when Y; ask them directly.”
Scenario engine runs as a pure TypeScript function without network calls, clock dependency or randomness. Generated outputs include trace: ruleIds, input response IDs or construct snapshots, version, and a user-friendly audit explanation. Do not expose raw answers unless both users specifically consent for those items; do not reveal how protected attributes could be deduced.

## 8. Match ranking pipeline and complexity
1. Filter eligible candidates by explicit mode, consent, verified adulthood, visibility, blocking/muting, distance/category, language and account status. 2. Query precomputed derived `PersonMode` + `BehaviorPatternSnapshot` indexes; avoid querying private answer tables per candidate. 3. Compute cheap trait similarity for candidate pool. 4. Apply mode-specific rules and optional complementary lens. 5. Apply diversity controls to prevent the same pool dominating; never use caste or inferred religion as ranking axes. 6. Sort by explainable tuple `(consent eligibility, scoreBand, relevant local availability, freshness)` with seeded tie break independent of personal identifiers. 7. Cache only non-sensitive derived ranking in TTL-bound mode partitions and invalidate on block, consent withdrawal, quiz re-score or privacy change. 8. Explain and log algorithm version for every visible match.
Scale path: D1 indexed normalized tables for early workload, precomputed snapshots, batch updates via Queues, use SQL row-read and write cost counters; sharding as appropriate for per-db limit; PostgreSQL read indexes after migration. No vector database required.

## 9. Anti-manipulation and fraud: the honest scope
Do: stable session shuffle, user-specific bank assignments, attention/consistency signals reviewed by psychometrician, repeated construct variants if validated, rate limits, suspicious velocity reviews, device/session safeguards with consent, versioned response edits, no high-value paywall incentives for “correct” answers. Do not: assert AI can never answer, punish culturally different responses, use covert traps or demand private disclosures. Users can rehearse or lie; results remain self-reports. If mismatch flags arise, label scores as limited confidence rather than branding users dishonest. Per-question privacy labels and withdrawal are required.

## 10. Fairness, privacy and cultural validity
Review every construct for translation bias and cultural assumptions: extended vs nuclear families, rural/urban availability, religion and marriage customs, gender-role stereotypes, socioeconomic opportunity, disability, sexuality, family arrangements, language proficiency. Provide `not applicable` and `prefer not to answer` where lawful and sensible. Sensitive optional fields must be purpose-specific (e.g., explicit partner preference in Dating). Never derive concealed orientation, caste, religion or diagnosis from scenario response patterns. Include consent lineage and redaction. Do not give parents/family agents automatic access to a user's response data in Matrimony mode.

## 11. Validation program and science governance
Baseline is explicit-interest/availability matching. Pre-register primary metric: **mutual meaningful follow-up at day 30** for Friendship; Dating mutual willingness to meet again and safety; Matrimony mutual continuation of introductions, not predicted marriage success. Compare deep scoring against baseline with same eligibility and safety filters. Publish aggregate confidence intervals and subgroup harms; do not use mock data as evidence. Any new scoring rule: dataset provenance, hypothesis, approval by responsible researcher, offline evaluation, fairness audit, staged release, rollback threshold, audit record, public method update. There is NO “accuracy %” without a defined ground truth and independent evaluation.

## 12. Contract API, example
`POST /v1/assessments/{id}/responses` -> `{responseVersion, savedAt}`; `POST /v1/assessments/{id}/submit` returns `{snapshotId, scoringVersion, state}`; `GET /v1/patterns/me?mode=friendship` returns selected derived constructs only; `GET /v1/matches?lens=echo&mode=friendship` returns candidates with `eligible=true`, scoreBand, coverageCount, explanationIds; `GET /v1/matches/{personId}/explanation` returns human-readable methodology and rule trace, never raw private answer arrays; `DELETE /v1/assessments/{id}` withdraws per retention and deletes dependent derived snapshots and indexed candidates. All read/write endpoints require server-enforced ownership and mode-specific consent.

## 13. Minimum test and sign-off inventory
Determinism/golden fixtures; all question formats; reverse coding; missing responses; score normalization and zero denominators; locale invariance; matching symmetry where formula requires; cache invalidation on block and withdrawal; no cross-mode profile exposure; 100% measured agreement disclaimer; no concealed-sensitive inference; zero-match states; race conditions; resume from multiple devices; past version recompute; dataset access grants; moderation redaction; export/delete correctness. Signatures: psychometric reviewer, data-protection lead, lead backend engineer, accessibility designer, founder.


---

## VOLUME 4: 02_DESIGN/UX_UI_DESIGN_AUTHORITY.md

# KITHRA — UI/UX DESIGN AUTHORITY & ART DIRECTION
Version 3.0 | 1 November 2026 | Status: design contract; all new design decisions supersede ZIP and older drafts.

## 0. The one-page creative brief
**Product:** Kithra: three distinct destinations for adult Friendship, Dating and Matrimony; one humane and transparent deterministic behavioral-comparison engine.
**Visual thesis:** *Different by nature. Connected by understanding.* The design should feel like a premium global editorial product with the warmth and legibility needed for Indian mobile-first users. Human, intelligent, calm, trustworthy and culturally adaptable. Not a clinical assessment, astrology app, gaming leaderboard or dating-app clone.
**Brand promise:** “Know your patterns. Find your people.” This is marketing copy subject to trademark/advertising and user testing; never claim to read minds or guarantee marriage outcomes.
**Creative direction:** deep nocturnal indigo canvas for key discovery moments, parchment/ivory surfaces for sustained reading, saturated iris-blue for primary CTAs, restrained coral and mint for secondary meaning. Generous whitespace and purposeful contours. Soft connecting threads appear only when they denote actual comparable dimensions.
**Primary UX principles:** privacy before curiosity; users choose their relationship mode; no hidden cross-mode visibility; real consent; understanding rather than diagnosis; explainable scores; fairness across culture, language, disability, religion and geography; interactions clear without animation; users can leave, block or opt out at every stage.
**Do not implement:** roulette-like swipes, rankings of human worth, artificial confidence, “the algorithm knows your sexuality,” dark-pattern scarcity/countdown, manipulative streaks, always-on autoplay, personality caste hierarchy, stock-portrait mosaics suggesting fabricated active members.

## 1. Audience, voice and narrative
Personas: (a) 24-year-old early-career worker looking for friends after moving to Pune; (b) 29-year-old woman seeking respectful, intentional dating in Bengaluru; (c) 32-year-old considering marriage with family involvement but choosing what parents can access; (d) returning NRI using the service across time zones; (e) moderator clearing harassment cases; (f) accessibility and low-bandwidth users.
Copy voice: empathetic but never infantilizing, plain Indian/global English, translatable, nonjudgmental, never moralize about lifestyles or personalities. Avoid “scientifically proven soulmate,” “we read your brain,” “destined,” and “guaranteed 100%.” Prefer “100% measured agreement across the answers compared.”

## 2. Absolute design tokens — light and dark
### 2.1 Color system
| Token | Hex | Where to use | Restrictions |
|---|---|---|---|
| ink-950 | #14182C | dark hero, app dark background, desktop nav | never pair with low-contrast muted copy |
| ink-850 | #232A47 | dark cards, nav and admin header | keep controls clearly bounded |
| iris-600 | #4B5DDB | main CTA, active navigation, focus accents | text on color must be tested |
| iris-500 | #6675ED | links on dark, diagram anchors | avoid low contrast on white for normal text |
| iris-100 | #E8EBFF | active chips and descriptions | not success/error states |
| ivory-050 | #FAF8F4 | light page background | broad canvas |
| ivory-100 | #F1ECE4 | editorial panels and separators | subdued backgrounds |
| paper-000 | #FFFFFF | forms, cards, admin data surfaces | dark text required |
| graphite-900 | #232736 | light-theme primary text | primary text |
| graphite-600 | #53596B | secondary text | validate AA contrast |
| graphite-400 | #858B98 | tertiary/supporting labels only | never small essential text |
| coral-500 | #DB755F | human illustration, warm highlight | not sole error signifier |
| mint-500 | #2E8C78 | supportive confirmation, reciprocity | not the only way to signal status |
| amber-600 | #A76A21 | caution and admin queue severity | always pair with text |
| danger-650 | #B53848 | blocking, destructive action, incident state | require confirm dialog |
| border-light | #DCDDE7 | form boundaries, separators | 1px stroke |
| border-dark | #424963 | dark surfaces | 1px stroke |

Light: `--bg:#FAF8F4; --surface:#FFFFFF; --text:#232736; --muted:#53596B; --border:#DCDDE7; --action:#4B5DDB; --actionText:#FFFFFF`. Dark: `--bg:#14182C; --surface:#232A47; --text:#F5F4F1; --muted:#C0C5D5; --border:#424963; --action:#6675ED; --actionText:#101326`. Cross-mode accents are supplementary: Friendship = iris, Dating = coral, Matrimony = deep teal (#217B75), *never* three unrelated product UIs. Status badges use icons and explicit labels.
Before final adoption run automated checks on every token/text pairing to WCAG 2.2 AA (4.5:1 text; 3:1 large text and non-text required contrast). A color being in this palette does not automatically make every pairing accessible.

### 2.2 Typography — exact recommended system
- Display and marketing H1: **Manrope**, weight 600/700, 1.02–1.12 line-height, tracking -0.035em. Character: sculptural but human. Hero 62–84px desktop, 40–50px tablet, 36–42px mobile using `clamp()`; NEVER overflow 320px viewport.
- UI/body: **Plus Jakarta Sans**, 400/500/600/700; 16px mobile/body minimum and 17–18px reading layouts; line-height 1.55–1.7. Data dense admin 14px minimum, 15–16px preferred.
- Indian script fallbacks: **Noto Sans Devanagari, Noto Sans Tamil, Noto Sans Telugu, Noto Sans Bengali, Noto Sans Malayalam, Noto Sans Kannada** selected per locale. Test line heights and actual glyph runs for every supported script; do not embed English-centric font metrics into Indic localizations.
- Numeric scores: Jakarta Sans 600 tabular numerals `font-variant-numeric: tabular-nums`, no display-serif numerals for values.
- Font distribution: source from authorized font providers or self-host license-compliant WOFF2 subsets; preload only above-the-fold weights; never distribute proprietary font binaries without rights. Fallback `system-ui, sans-serif`.

Type scale: label 12/16; caption 13/18; small 14/20; body 16/25; lead 18/28; h4 21/28; h3 28/35; h2 40/46; h1 desktop 72/78; h1 mobile 40/45. Keep meaningful section hierarchy.

### 2.3 Layout architecture
8px spacing system with 4px microsteps; radii 8 chips, 12 inputs, 16 cards, 24 editorial story cards; button min height 48px (mobile); visible focus 3px; default card shadow `0 10px 36px rgba(20,24,44,.07)` only on interactive/raised surfaces; grid 12 desktop / 8 tablet / 4 mobile. Public max width 1240px, text measure 60–70ch. Desktop gutters 64px at 1440, 32px at 1024; mobile 20px at 390 and 16px at 320. Mobile breakpoints 375/390/430, tablet 768, laptop 1024/1280, desktop 1440/1920; test all. Sticky headers height 76 desktop / 64 mobile; preserve content scroll position.
Use real accessible iconography (Lucide outline 1.75–2 stroke) and bespoke simple SVG connection diagrams; no misleading charts, arbitrary astrology glyphs, or decoration masquerading as science. Neutral face portraits of consenting real users only; no fake user avatars on a live product. Designer may use clearly labeled demo profiles in mockups.

## 3. The landing page — specified as a 10-beat scroll story
**Global composition:** desktop 1440x900 reference, off-white nav, hero in deep ink 950 with gentle iris bloom; site transitions into warm ivory editorial feature panels. An animated constellation-like diagram connects *dimensions* (not random stars). Mobile hero readable above fold with full CTA and a static/low-motion diagram below.

### Beat 01 — Navigation (0–76px)
Logo left: Kithra custom wordmark plus connected K symbol. Desktop links: Why Kithra / How it works / Three ways to connect / Circles / Safety / Pricing; right: language selector, Log in, CTA “Find your people”. Mobile: logo, Log in, hamburger -> accessible full-height drawer; language selector in drawer. Sticky at scroll>80, blur effect only if contrast remains. If logged in, dashboard link instead of signup.
### Beat 02 — Hero (immediately visible)
Eyebrow `FRIENDSHIP · DATING · MATRIMONY` in spaced microtype. Hero display copy exactly: **“Meet people who make sense to you.”** Support: “Discover meaningful connections through thoughtful questions, shared values and transparent comparisons—whether you're seeking friends, dating or a life partner.” Primary CTA “Explore your connections”; secondary “See how matching works”. Micro trust line: “You choose what to share. Your answers stay private.” Right/under heading: signature responsive *relationship map*: center circle `You`, 4 satellite circles labeled `Shared values`, `Communication`, `Everyday rhythms`, `Future goals`; connections draw only between relevant nodes, with 3 outer rings denoting Friend / Dating / Matrimony. This is an educational illustration, never actual compatibility calculation. Fine-grained hover/tap explanation of each dimension.
Desktop split 48/52, visual never pushes H1 beyond viewport. Mobile headline first, buttons stacked, visual 230–310px high, no auto movement beyond reduced-motion rules. Hero min-height `calc(100svh - 76px)` desktop but never full-height-lock on 320px mobile.
### Beat 03 — Mode selection: Three intentions, one place
Ivory section with heading “Different connections. Your choice.” Three equal editorial cards: Friendship (`Find people to share life with.`), Dating (`Meet with clarity and mutual intent.`), Matrimony (`Explore long-term compatibility thoughtfully.`). Each has eligibility statement, 3 short sample traits, small illustration, primary “Explore Friendship / Dating / Matrimony”. Card switch is not an automatic opt-in; CTA opens mode explanation.
### Beat 04 — How Kithra works
Three numbered steps with real content: (1) Choose your intention. (2) Answer thoughtfully; revisit anytime. (3) Compare your patterns, then decide if you'd like to connect. Beside it, a truthful example compare panel with `Measured agreement 82%` and explanatory note `This reflects responses compared, not a prediction of relationship success.` No invented testimonials.
### Beat 05 — Matching lenses as editorial carousel
Four interactive cards, accessible as stacked blocks on mobile: **Echo** (similarly measured patterns), **Counterpoint** (meaningful contrasts), **Mosaic Fit** (potential complementary preferences), **Neighbors** (practical filters and shared plans). A “100%” sample may be shown ONLY with precise `100% agreement on compared items` caption. Avoid an alleged soul-twin promise. Each card opens concise transparency accordion.
### Beat 06 — The questionnaire
Show a stepper with 3 believable *placeholder* question cards, “Save your place”, “Skip if optional”, “Why we ask”, and a toggle showing scope sharing. Explain `100 questions per set; more sets are optional until they are validated and published`. Never fabricate a scientific outcome. A 100-question set needs estimated time verified by usability tests, not invented “5 minutes.”
### Beat 07 — Connection beyond matching
Split panel of safe mutual invitation, one-to-one chat, private Circles, and real-world plans. Use visual flow `View compatibility -> Request introduction -> Mutual acceptance -> Message` with relevant icons; users can block/report anywhere. State safety in measured terms; not “perfectly safe”.
### Beat 08 — Privacy / trust
Darker section, visually quieter: “Your most personal answers aren't your public profile.” Explain separate modes, consent review, hidden answers, controls and reports. Small layered diagram `Raw answers (private) -> Derived explanations (permissioned) -> Public profile (controlled)`. Include “Read our safety approach” link; no unsupported E2EE/Aadhaar claims.
### Beat 09 — Pricing and FAQs
4 tier cards: Free, Plus, Connect, Matrimony Intent; indicate proposed price testing and monthly/3/6/12 month selector; full fees, renewals, cancellation, refunds and taxes must be shown before checkout. FAQs: Can I use only Friendship? Can I hide a mode? What does 100% mean? Can I delete answers? Is matching deterministic? Are there hidden intimate inferences? Is Kithra a matrimony guarantee? Answers truthful, non-coercive.
### Beat 10 — Closing CTA, footer
“People aren't puzzles to solve. Connections are worth understanding.” CTA “Begin with what matters to you”. Footer navigation grouped Product / Trust / Help / Company / Policies / Languages, contact and grievance links, current jurisdiction, accurate entity legal name when incorporated; avoid fake corporate claims.

## 4. Motion for React — precise implementation matrix
Use **`motion/react`** imports (`motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useReducedMotion`, `LayoutGroup`). Avoid mixing legacy `framer-motion` and `motion` packages in the same codebase. Motion is *enhancement*, not task completion.
| Surface | API/technique | Timing | Trigger | Reduced-motion fallback |
|---|---|---|---|---|
| Hero title | motion staggered line reveal `opacity/y` | 420–650ms easeOut; stagger 90ms | first paint after font stabilization | all text immediate |
| Hero connection map | SVG pathLength (only meaningful paths) | 850–1200ms, one cycle | first visible | static diagram |
| Sticky nav | CSS transform/background transition | 180ms | scroll threshold | instant |
| Three mode cards | `whileInView` opacity/y | 320ms, stagger 70ms | section enters | static cards |
| How it works | `whileInView` step sequencing | 280–380ms per step | scroll to section | no sequence |
| Matching-lens tabs | `LayoutGroup` `layoutId` active underline | spring 280–360ms damping 28 | click/keyboard | snap |
| Accordion | `AnimatePresence` content height/opacity | 170–230ms | click | immediate |
| Pricing selector | `layoutId` pill, number crossfade | 180–250ms | click | instant |
| Dashboard nav | shared-layout indicator | 220ms | route change | instant |
| Quiz questions | `AnimatePresence mode='wait'` opacity/x 8px | 200ms; never directionally imply right/wrong | next/previous | instant |
| Quiz progress | CSS width/transform | 220ms | response saved server-side | instant |
| Match cards | subtle opacity/y and focus elevation | 180–260ms | filter update | immediate |
| Match explanations | `layout` reveal | 220–300ms | open | immediate |
| Chat message arrival | opacity/y 6px | 120–160ms | confirmed event | no animation |
| Group join | checkmark/label confirmation | 120ms | accepted mutation | textual success |
| Toast/dialog | `AnimatePresence` | 130–190ms | relevant action | immediate |
| Admin queue reordering | `layout` position only | 130–220ms | ticket priority change | no animation |
| Admin crisis surface | **no motion** | 0 | incident alert | persistent accessible banner |

Do not continuously animate orbs, count scores up to fabricated percentages, autoplay parallax on assessment screens, or animate danger actions for fun. Scroll-driven subtle section reveal is allowed but entire page content must remain crawlable and accessible without JS animation. Performance budget: target LCP <=2.5s p75 on representative mobile, CLS <=0.1, avoid hydration/font shift; page animation must not delay interaction. `prefers-reduced-motion` disables all decorative motion and path drawing. Respect contrast and focus even in motion.

Example (illustrative, subject to package API/version tests):
```tsx
import { motion, useReducedMotion } from 'motion/react';
export function HeroCopy() {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, y: 12 }}
     animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52 }}>
     <h1>Meet people who make sense to you.</h1>
  </motion.div>;
}
```

## 5. Full end-to-end member information architecture
Desktop sidebar: Home; Discover; Matching lenses; Assessments; My patterns; Connections; Messages; Circles; Plans & events; Saved; Notifications; [mode selector]; Membership; Support; Privacy & safety; Settings. Badge counts only if real. Mobile primary bottom nav: Home / Discover / Connections / Messages / More; secondary drawer for assessments, Circles, settings; persistent profile access. Modes must be unmistakably identified via label + accent, not color alone; switching requires confirmation if revealing previously private intent.

### 5.1 Screen-by-screen required deliverables
Design Figma desktop 1440 and mobile 390 for **every row**, tablet 768 for complex grid screens, and dark variants for key paths; document normal, loading, empty, error, blocked, offline, permission-denied, no-matches and expired-plan states.
| Screen | Mandatory content and interactions | Red flags |
|---|---|---|
| Public home | hero, modes, methodology, safety, pricing, FAQ | no invented active-user numbers |
| About matching | score definition, measured dimensions, limits | no mental-health diagnosis |
| Login/signup | email password, Google, reset, verification, terms | no prechecked consent |
| Age eligibility | age validation, underage exit, false-age handling | no unnecessary ID uploads |
| Choose mode | consequences, disclosure scopes, opt-in only | no auto-activation |
| Onboarding | language, broad location, goals, boundary settings, privacy | never mandatory sensitive traits |
| Profile photo | privacy, crop, alt text, moderation status, remove | no image shown preapproval |
| Assessment catalog | themes, version, requirements, estimated duration, consent | don't claim unvalidated psychometrics |
| 100 question reader | single question / desktop distraction-free panel, 1–100 progress, pause/resume, 'why asked', skip policy | no forced rapid choices |
| Quiz review | unanswered required, self-changed responses, submit | save idempotency |
| Assessment history | completed sets, versions, revise/retake, delete | no silent recompute |
| My patterns | domain chart, confidence/missing data, explainers, visibility switches | not a diagnosis |
| Mirror / Echo | similarity candidates, explanation, uncertainty | no guaranteed soul twin |
| Counterpoint | substantive differences, opt-in view | no demonization |
| Mosaic Fit | potential complementary preferences, tradeoffs | not gender stereotypes |
| Discover | filter chips, language, proximity bands, compatibility lenses, eligibility | privacy and blocks respected |
| Candidate profile | about, mode intent, shared grounds, differences, boundaries, request, block, report | raw answers hidden |
| Compatibility details | comparison dimension table, scoring method, question counts, version, caveats | not 'destiny probability' |
| Send invitation | template suggestions, optional personal note, frequency limits | no spam |
| Invitations | received/sent, accept/decline, expire | no forced response |
| Messages | mutual DM, attachments, mute/block/report, accessibility | no fake E2EE claims |
| Circles directory | browse/group safety, categories, moderation labels | no unsafe open group by default |
| Circle home | rules, channels, membership, roles, recent threads | policy enforced server side |
| Create Circle | scope, purpose, rules, invite limits, moderator needs | safe defaults |
| Events/plans | public venue guidance, RSVP, host obligations, cancellation | no precise address exposure |
| Notifications | grouped activity, granular settings, digest | never disclose sensitive match details in push |
| Subscription | tiers, comparison, billing cycles, payment/renewal text | no surprise paywall |
| Billing history | invoices, refunds, cancel, grace, dispute | no fake settled payments |
| Trust center | report, block list, consent controls, help | always available free |
| Account data | download, correct, delete, retention exceptions, reauth | real backend actions |
| Support center | FAQ, ticket, case status, appeals | accessible grievance contact |
| Account recovery | reset, lock, suspend, appeal flow | no mode leak |

### 5.2 Assessment screen — exact anatomy
Top fixed/subtle: Kithra logomark (left), `Theme: Communication · Set 2` (middle), `Save & exit` (right). Progress `Question 37 of 100`, progress bar text alternative. Question h2 with 60–75 character line cap. Optional context appears in collapsible “Why we're asking”. Answers: 4–5 choice cards minimum 52px high, radio-control semantics, space/arrow support, no randomized position that changes on back navigation; optional “I prefer not to answer” when appropriate. Footer prev / next anchored mobile with safe-area padding. Autosave on answer; show `Saved` only after server acknowledgement. Help menu clear concern/report question. End: review summary of skipped and changed items; explicit completion consent, report generation state; no fake accuracy percentage. Offline: local encrypted or restricted draft strategy; no unsafely cached sensitive text on shared devices.
### 5.3 Match card anatomy
Photograph (approved user), verified status *only when true*, mode label, coarse city, shared hobbies, one sentence “Why you may get along”, visible score definition tooltip, buttons View reasoning / Send request, overflow Hide/Block/Report. Display descriptive score category if insufficient responses; show separate Echo, Counterpoint, Mosaic Fit; never multiply them into an unexplained master score.
### 5.4 Messaging anatomy
Desktop 28% conversation rail / 72% main, mobile list→thread with back. Header person + report/Block/mute. Message bubbles distinct sender, timestamps, sending/sent/failed states, media upload preview, retry controls, explicit privacy policy. Typing indicators opt-in. Server enforces both sides are in mutual accepted state. Deleted/blocked user state remains understandable without exposing personal data.
### 5.5 International and Indian localization
English initial reference; provide locale-ready design for hi-IN, ta-IN, te-IN, bn-IN, ml-IN, kn-IN, and international en-GB/en-US (actual shipped translations require qualified translators). No flag icons for languages, no Indian-exotic decorative motifs or caste/religion stereotypes. Support name pronunciation, chosen name and multiword names, India city aliases and location radius approximations, all INR pricing disclosed with tax rules, and timezone aware dates. Test longer Indian-script line heights and numerals. Do not force family participation or assume all users are heterosexual.

## 6. Admin UX — separate visual discipline, same brand DNA
Admin visual direction: less decorative; ivory/white/graphite surfaces, iris for selection, strong incident severity. Persistent 264px sidebar desktop, collapsible to 72px icon rail; tablet drawer; mobile admin supports urgent review only if policy allows, never disables crucial permissions checks. Header includes environment pill (Production/Staging), global case search, alerts, staff availability, MFA/session; admin access via dedicated origin `admin.kithra.example` **example placeholder only**.
Admin primary sidebar ordering:
1 Overview | 2 Moderation queue | 3 Urgent safety | 4 Reports & appeals | 5 User accounts | 6 Profiles & verification | 7 Messages/evidence (case-scoped only) | 8 Circles & events | 9 Assessments/question bank | 10 Matching versions & explanations | 11 Payments & refunds | 12 Support inbox | 13 Privacy requests | 14 Admins, teams & roles | 15 Analytics & experiments | 16 Audit trail | 17 Incident center | 18 System health/usage/budgets | 19 Configuration/feature flags.
Each destination requires permission-gated visibility *and* backend enforcement. No all-seeing moderator browsing raw answers.

Admin dashboard (1440 reference): top 4 operational KPIs (Open safety reports, Urgent overdue, Data-rights backlog, API/system health) with data as-of timestamps; row 2 SLA queue trends and moderation disposition; row 3 assignment/ownership panel and recent interventions; row 4 provider costs/abuse alarms. Avoid prioritizing registrations over safety incidents in staff overview.

Admin case detail 3-zone: (1) metadata/risk/assigned/SLA strip (2) evidence timeline with redacted artifacts (3) action rail: warn, restrict, suspend, ban, refer, dismiss, request more info, escalate. Every action requires reason code, optional note, audit ID, policy version and user notification decision. Staff can open restricted sensitive evidence only through just-in-time grant with dual approval, minimum access and audit, ideally separate security role. Disposition undo/appeal where appropriate. No irreversible delete without guarded procedure.

## 7. Figma deliveries and design QA acceptance
Required files: `Kithra Foundations` (tokens, icons, typography, grids, motion), `Kithra Marketing` (all 10 sections & responsive), `Kithra Member` (screen inventory & modes), `Kithra Admin` (roles, queues, cases), `Prototypes` (all critical flows), `Content/i18n`, `Assets/Source Rights`, `Usability/Research`, `Accessibility Audit`. Use component properties for interactive/disabled/loading/error/focus/hover and text variants. Supply dev annotations, token IDs, CSS value references, interaction storyboards, keyboard tab order, screen-reader announcements and privacy guardrails. All components must match generated design-tokens JSON.
Required user tests: first glance (what is product, what is not), mode isolation, 100-question persistence, score explanation comprehension, request/accept/block, delete/cancel, moderator emergency case review. Acceptance: at least 5 moderated tests across varied devices and locally relevant language preferences; document issues and fixes, not unsupported claims of broad population validation. No stock portraits represented as active users.

## 8. Creator handoff signature
Designer signs: [name/date] | Content reviewer: [ ] | Accessibility reviewer: [ ] | Psychology reviewer for assessment wording: [ ] | Trust and safety reviewer: [ ] | Founder design approval: [ ]. A beautiful site that misstates the matching science, makes privacy incomprehensible, or blocks user safety tasks fails acceptance.


---

## VOLUME 5: 04_ENGINEERING/DUAL_RUNTIME_ENGINEERING_AUTHORITY.md

# KITHRA — FULL-STACK ENGINEERING AUTHORITY (CLOUDFLARE + DOCKER SERVER)
Version 3.0 | Complete product, no MVP feature deletions | No AI/LLM runtime.

## 1. Technology decisions and invariants
Frontend: React 19 + TypeScript strict + Vite, Tailwind CSS v4, TanStack Query for request state, React Hook Form + Zod for validated forms, Router choice locked in ADR, Motion for React via `motion/react`, i18n through `i18next`/React adapter, Lucide, accessible component primitives (Radix or equivalent), Playwright/axe. API: TypeScript, Hono, OpenAPI/Zod contracts, single semantic API version. Dependencies pin lockfile and verify compatibility before coding. Matching: pure TypeScript and SQL deterministic transforms, not AI.
**One monorepo, two deployment adapters, no duplicate business rules.** Cloudflare uses Workers Static Assets (new projects recommended; Pages can remain an optional adapter), Workers API, D1, R2, Durable Objects, Queues/Cron. Server uses Node/Hono, PostgreSQL, Redis/BullMQ, WebSockets, Caddy, private R2 or S3-compatible object store. Firebase Auth email/password + Google identity used for both, internal Kithra IDs stored separately; username/email/password alone never authorize staff roles. Razorpay provider adapter for payment with signed webhooks; alternatives only if merchant approved.

## 2. Repository blueprint
```text
apps/web/                         React public + member experience
apps/admin/                       Separate Vite admin application
apps/api/                         Hono routes, middleware, adapters
apps/realtime-cloudflare/         DO WebSocket room coordination
apps/realtime-node/               Node ws + Redis broker
apps/jobs-cloudflare/             Queue/Cron consumers
apps/jobs-node/                   BullMQ processors + scheduling
packages/domain/                  Pure deterministic business logic
packages/scoring/                 Questionnaire keys, immutable scoring versions
packages/contracts/               Shared Zod schemas and OpenAPI generation
packages/db-ports/                Repository interfaces, transactional boundaries
packages/adapters-d1/             D1 query and transaction semantics
packages/adapters-postgres/       PostgreSQL adapters and migrations
packages/auth/                    JWT validation and internal user mapping
packages/payments/                Billing ledger and gateway interfaces
packages/storage/                 R2 / S3 object-store port
packages/messaging/               Delivery idempotency and policy engine
packages/safety/                  Trust, reporting, case routing, policy decisions
packages/ui/                      Accessible design system and tokens
infra/cloudflare/                 Wrangler, binding map, secrets/rollback
infra/server/                     Compose, Docker, Caddy, Jenkins, backups
migrations/sqlite/                Explicit D1-compatible migrations
migrations/postgresql/            Explicit Postgres migrations
tests/contract/ e2e/ security/ perf/ migration/ accessibility/
docs/adr/ runbooks/ privacy/ legal/ release/
```
Hono handlers call `application` use-cases. Business rules take plain typed objects; never import D1 binding, Redis, Firebase Admin SDK or Cloudflare APIs into domain rules. Database semantics must match in the two engines; golden contract tests verify both rather than assuming syntactic SQL conversion is enough.

## 3. Two-target infrastructure mapping
| Capability | Cloudflare target | Server target | Behavior invariant |
|---|---|---|---|
| Marketing/member SPA | Workers Static Assets, optional Pages | Caddy serves same build | same UI and URLs |
| Admin SPA | separate Workers Static Assets origin | separate protected Caddy origin | same authorization |
| API | Hono Worker | Hono on Node | same OpenAPI / status / body |
| Database | D1 SQLite, shard on measured need | PostgreSQL 16+ (tested supported major) | same entity and privacy contracts |
| Search | indexed D1 queries | indexed PG queries | identical filters and ordering tie rules |
| Images/files | Private R2, signed access | R2 or S3 API-compatible MinIO | virus scan/quarantine; private by default |
| Chat | DO/WebSocket hibernation, durable DB | ws + Redis; PG durable ledger | message IDs, ACL, retention and acknowledgements |
| Background | Cloudflare Queues, DLQ, Cron | BullMQ/Redis, DLQ, scheduler | idempotent jobs and retry states |
| Email | external transactional mail provider | same | templates and tracking |
| Identity | Firebase | Firebase | same user ID and mode roles |
| Billing | Razorpay signed webhooks | same | ledger, replay defense |
| Observability | Workers Logs/analytics | OTel, Prometheus/Grafana/Loki optional | redaction, request IDs and SLOs |
| CI/CD | GitHub Actions + Wrangler | GitHub Actions CI, Jenkins deploy | protected releases and rollback |

**Critical Cloudflare constraints:** D1 Free single database maximum 500 MB; Paid max 10 GB/database and currently substantial higher account limit. D1 Free request/query CPU and row limits can exhaust with many heavy joins. R2 is not free unlimited media; model object operations and retention. Durable Objects handle presence/state, but the durable chat message record must not disappear when a room sleeps. Queues may redeliver: all handlers idempotent. Use Workers paid where production feature reliability/limits require, independent of registered-user count. Official live checks 2026-11-01: https://developers.cloudflare.com/d1/platform/limits/ https://developers.cloudflare.com/workers/platform/pricing/ https://developers.cloudflare.com/workers/static-assets/ .

## 4. Identity, authentication and admin
Consumers: email/password+verified email and Google OAuth; email verification required before discovery and messaging. Optional phone OTP with explicit cost/rate controls, not mandatory. Firebase ID token validated with issuer/audience/JWKS, lifetime/revocation strategy; app maps provider subject to immutable `user_uuid`. Session risk flags stored server-side; blocked/disabled accounts lose Worker and WebSocket access. Admin origin `admin.<your-real-domain>` is an example until domain purchased. Admin roles provisioned in back office; allowlist of verified approved emails is an *additional prerequisite*, never sole authorization. Firebase login + phishing-resistant MFA for staff where supported by chosen stack and license, server-side signed claims checked against central RBAC table on every action. Root cannot grant itself sensitive permissions without second approval; add staff lifecycle, deprovision, temporary elevation expiry. Cloudflare Access can additionally gate admin origin, but not replace application RBAC. No shared accounts.

## 5. Database entities and index strategy
Core identities: `users`, `sessions`, `mode_personas`, `profiles`, `profile_visibility`, `media_assets`, `user_consents`, `blocked_users`, `languages`, `user_preferences`.
Questionnaires: `question_themes`, `question_banks`, `question_bank_versions`, `items`, `item_variants`, `item_scoring_keys`, `assessment_sessions`, `assigned_items`, `answer_revisions`, `scoring_runs`, `trait_snapshots`, `simulation_rules`, `simulation_outputs`.
Discovery: `match_indexes`, `match_scores`, `match_explanations`, `match_feedback`, `connection_requests`, `connections`, `privacy_scope_grants`.
Social: `chat_rooms`, `chat_members`, `messages`, `message_receipts`, `chat_attachments`, `circles`, `circle_members`, `circle_channels`, `circle_posts`, `events`, `event_attendees`, `notifications`.
Safety/admin: `reports`, `report_evidence`, `moderation_cases`, `case_actions`, `appeals`, `admin_staff`, `roles`, `role_permissions`, `staff_grants`, `staff_sessions`, `audit_events`, `privacy_requests`, `legal_holds`, `security_incidents`.
Billing/ops: `product_plans`, `subscriptions`, `plan_entitlements`, `payment_intents`, `payment_webhook_events`, `invoices`, `refunds`, `tax_config`, `usage_daily`, `cost_budgets`, `feature_flags`, `job_outbox`, `schema_versions`.
Each table needs owner, legal basis/purpose, retention class, delete/cascade/legal hold, indexes and admin access policy. Indices: `(mode, city_band, visible, last_active)` on eligible persona search; `(user_id, theme_id, bank_version)` assessment; `(chat_id, created_at, message_id)` messages; `(severity, status, due_at)` reports; `(actor_id, created_at)` audit. Avoid storing unbounded raw quiz history in D1 or maintaining public profiles in Redis caches. Multiple D1 shards must not allow nonconsented cross-shard joins.

## 6. Web and API contracts
`/v1/auth/session`, `/v1/me`, `/v1/modes/{mode}/consent`, `/v1/profiles`, `/v1/profiles/{id}/visibility`, `/v1/assessments/catalog`, `/v1/assessments/sessions`, `/v1/assessments/{id}/responses`, `/v1/assessments/{id}/submit`, `/v1/patterns/me`, `/v1/matches`, `/v1/matches/{id}/explanation`, `/v1/requests`, `/v1/connections`, `/v1/chats`, `/v1/chats/{id}/messages`, `/v1/circles`, `/v1/events`, `/v1/reports`, `/v1/support/tickets`, `/v1/billing/checkout`, `/v1/billing/webhooks/razorpay`, `/v1/privacy/export`, `/v1/privacy/delete`, `/v1/admin/cases`, `/v1/admin/actions`, `/v1/admin/staff`, `/v1/admin/audit`.
For every endpoint: OpenAPI request schema, authentication, mode/privacy context, role, limits, idempotency, pagination and errors. Error body `{error:{code,message,requestId,retryable}}`. Never leak user existence via differential error where inappropriate. Sort pagination stable under concurrent writes; cursor-based chats and queues. Signature verification uses raw gateway body before parsing. Do not trust client-provided compatibility %, plan entitlements, verified flags or admin role.

## 7. Messaging and consistency
Transport != source of truth. Each send: authenticate -> conversation ACL and block check -> reject oversize/unsafe attachment -> dedup by clientMsgId -> write durable message once -> publish sequence -> ACK canonical messageId. A blocked user cannot continue through a preexisting WS session: revoke membership or check auth scope at every send and periodic heartbeat. Handle offline queues, no ghost 'sent' status if DB fails, message retention and evidence holds. Presence and read receipts optional and revocable. Group messages require membership state and permissions. No claim of true end-to-end encryption unless an audited protocol with key management is actually implemented; default TLS in transit and encryption at rest.

## 8. Migration from Cloudflare to server
Stages: (1) define canonical semantic schema and exact D1-to-PG type map (text UUID, boolean, timestamp epoch/UTC, JSON, numeric money minor units); (2) implement both repo adapters behind flags, contract tests; (3) take consistent D1 logical export with write barrier/high-water mark; (4) migrate with checksums/row counts/referential integrity and privacy redactions; (5) incremental dual-write or event-outbox **only when proved safe**, otherwise maintenance cutover; (6) backfill media object refs, job state, open chat sessions; (7) cut over traffic with token-compatible sessions and DNS TTL; (8) observe error/latency and reconciliations; (9) rollback within agreed bounded window with replay plan. Dual-write is high risk: do not recommend unguarded production dual writes across independent DBs. Test 100/1K/5K/100K fixture migrations (synthetic) and failures.

## 9. Engineering quality and SLO targets (provisional)
Availability target 99.9% monthly for member API once paid production architecture budget supports it; p95 API GET <=450ms for simple indexed endpoints from target India region (measure, do not promise); matchmaking p95 <=1500ms after materialized snapshot, chat publish receipt <=2s under representative load; restore RPO <=24h, RTO <=8h initially (tighten with budget). WCAG 2.2 AA target; OWASP ASVS L2 intended security baseline where applicable. No personally sensitive data in logs/analytics; rotate secrets, audit billing and admin events, track incident alerts. Establish budgets and fail-safe on unexpected cloud charges.

## 10. Environment contract and deployment
Environments: local / test / staging / production. Distinct Firebase projects, D1 databases, R2 buckets, role stores, keys and payment webhook endpoints; **never** use production data in development without deidentification and legal basis. GitHub Actions CI -> artifact/contract test -> protected staging -> manual promotion production on both targets. Cloudflare release via Wrangler (least-privilege token, production environment approval). Server release via OCI images signed/attested, Jenkins gated by approval, Docker Compose or orchestrator, migration backup, health check, smoke, roll back. Cloudflare Access optional defense in depth for staff. Jenkins itself should live on separate hardened control plane with MFA/backup; don't expose UI publicly without restriction.

## 11. Security and legal non-negotiables
Mode isolation is **both** storage and API authorization; audit sensitive staff evidence access; verify image upload MIME, size, malware, metadata strip, private R2 ACL, signed URLs short TTL, abuse report and moderation. Keep 18+ age policy while obtaining legal guidance on age assurance. Distinct consent for sensitive optional disclosures, no hidden sexual orientation prediction. DPDP staged commencement dates require current verification before public launch. Handle grievances with statutory timelines where applicable; do not rely on founder manually being online. Commercial policies need India counsel approval; no absolute legal immunity. See `05_SECURITY_LEGAL/`.

## 12. Architecture decision log (approved baseline)
ADR-001 Workers Static Assets over starting new Pages project, Pages preserved as supported option. ADR-002 Firebase Auth over Supabase Auth initially; D1 stays main datastore; portability maintained. ADR-003 Hono as shared API router. ADR-004 SQL D1 and PG separate adapters and tested migrations. ADR-005 Cloudflare DO vs Node+Redis real-time. ADR-006 Cloudflare Queues vs BullMQ. ADR-007 Razorpay isolated gateway adapter. ADR-008 no AI model, no AI twin, no LLM scoring. ADR-009 privacy/eligibility before any matching. ADR-010 no concealed intimate-attribute inference. ADR-011 single user can opt into multiple modes, never cross-publish by default. ADR-012 owner-visible scoring methodology and versioned reporting.


---

## VOLUME 6: 05_SECURITY_LEGAL/ADMIN_RBAC_TRUST_COMPLIANCE_LEGAL.md

# KITHRA — ADMIN, SECURITY, INDIA COMPLIANCE & POLICY HANDOVER
Version 3.0 | 1 November 2026 | Draft requirements, not final legal advice.

## 1. Principles
Kithra handles voluntarily disclosed intimate values, behavior patterns, preferences, photos, private correspondence and possible matrimonial expectations. Minimum acceptable design is *least collection, least visibility, least privilege, demonstrable consent, reliable reporting and verified deletion*. Never describe the policies as “airtight against Indian laws”: compliance requires organizational processes, actual implementation and ongoing review. The person behind the account controls public visibility and each relationship mode; a family member does not automatically acquire access.

## 2. Role-based administration
| Role | Purpose | Default permissions |
|---|---|---|
| Platform owner | legal/accountability administration | staff roster and policy oversight; no default raw assessment reading |
| Security lead | threat/incident response | security events, credential resets, emergency suspensions; no browsing |
| Trust & safety lead | high-risk escalation | escalations, case decisions, staffed evidence access |
| Moderator | user report triage | assigned redacted cases; warn/restrict within policy |
| Support agent | user help and appeals intake | tickets, account state labels, no raw messages by default |
| Privacy officer | exports, deletions, consent issues | privacy workflows and limited compliance evidence |
| Finance operator | payments/refunds/chargebacks | ledger access, scoped refund limits, no quiz content |
| Research reviewer | question bank and scoring-method review | anonymized/consented aggregates, immutable versions |
| Community operator | Circles and event review | circle moderation within assignment |
| Auditor | control evidence | read-only audit and de-identified metrics |
| Infrastructure operator | deployment and service health | no member-content read by default |

Permission namespace examples: `cases.list`, `cases.assign`, `cases.evidence.read_redacted`, `cases.evidence.read_sensitive`, `cases.action.warn`, `cases.action.suspend`, `cases.action.permanent_ban`, `staff.invite`, `staff.role.grant`, `privacy.export.approve`, `privacy.delete.execute`, `billing.refund.limited`, `billing.refund.high_value`, `questionnaire.publish`, `matching.release`, `audit.read`, `infra.deploy`. All default deny. Scope membership by queue, geography where lawful, mode, and incident ID. Grant sensitive evidence JIT with supervisor approval, automatic expiry and purpose record. Role assignments require 2-person approval for critical permissions. Terminate staff permissions immediately on offboarding, rotate credentials and review access quarterly.

## 3. Admin entry and session workflow
`admin.<yourdomain>` only for provisioned staff, with verified approved staff email, password and mandatory MFA; second factor policy should prefer phishing-resistant methods where supported. Firebase authentication validates ID; the server then checks staff account, role grant, status, session risk and scope. `@kithra...` domain allowlist alone is insufficient, and a URL secret is NOT authentication. Optional Cloudflare Access policy provides another perimeter. Idle/absolute timeouts, privileged-action reauthentication, session audit, device/IP anomaly review, CSRF protection, no public admin signup. Staff UI displays explicit production environment indicator.

## 4. User and admin operational flows
**Abuse report intake:** create immutable case ID; capture reporting reason, person ID, mode and allowed evidence; automatically apply high-harm triage; acknowledge submission with ticket number and safety guidance; assign moderator by skill and SLA; preserve reporter's privacy. Avoid telling the reported user who reported them. Adverse actions require policy reason, affected data, actor and time, notification/appeal policy and audit record.
**High priority cases:** non-consensual intimate imagery, impersonation, threats, stalking, minors and suspected trafficking move to urgent queue. Emergency pathways do not promise a live emergency service; provide public police/emergency resources and documented escalation. Incident timelines must follow legal advice and current IT rules (some complaints are subject to accelerated obligations).
**Appeals:** independent reviewer when possible; cannot be reviewed by original actioning officer for critical cases; structured disposition and outcome notification.
**Privacy rights:** authenticated request -> identity/ownership re-verification proportional to risk -> scope report -> legal hold check -> export/correction/deletion action -> job trace -> confirmation -> follow-up; document exceptions and backups retention. Data subject requests must not force users to call a phone line for normal actions if web self-service is possible.
**Finance:** separate payment intents and settlements; admin may refund only with scoped permission and complete ledger record; dual approval on high-value or suspicious refunds. Operator cannot edit original payment events.
**Questions:** expert-proposed draft -> psychometric reviewer -> privacy review -> translation review -> staging evaluation -> signed publish approval -> version pin -> rollback plan. Never let an ordinary moderator edit scoring keys.

## 5. Admin dashboard detailed KPIs and sidebar
Pages: Overview, Safety live queue, Reports, Appeals, Accounts, Verified profiles, Circles & Events, Case evidence (case-scoped only), Question bank governance, Matching methodology release, Billing/Refunds, Support, Privacy requests, Staff/Roles, SLA dashboards, Audit, Incidents, System health, Storage/Cloud cost, Feature flag governance, Policy & localization versioning.
Dashboard tiles with owner and freshness: open urgent cases; percent within SLA; average/median first human response; reports by mode; recurrence of blocks; privacy export/deletion pending; suspicious auth and payment webhook failure; D1 row-read surge; R2 bytes & operations; chat error rate; subscription cancellations. All metrics should avoid reidentifying small protected cohorts. Design full states: empty, no access, open/assigned/escalated, conflicting action, stale evidence, reauth required, appeal accepted, blocked media, redaction pending, offline read-only.

## 6. India DPDP and intermediary compliance checklist
The Act and final Rules have phased commencement in 2025, 2026 and 2027. From the 13 November 2025 Gazette notification: certain provisions commenced at publication, selected provisions after one year (13 Nov 2026), and central operational duties after eighteen months (13 May 2027), subject to amendment and legal interpretation. As of this document date (1 Nov 2026), 13 Nov 2026 and 13 May 2027 are in the future. **Never wait until a deadline to design controls.** Official references:
- Act commencement notification G.S.R. 843(E): https://egazette.gov.in/WriteReadData/2025/267647.pdf
- DPDP Rules G.S.R. 846(E): https://egazette.gov.in/WriteReadData/2025/267650.pdf
- MeitY DPDP information: https://www.meity.gov.in/
- Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules and 2026 amendment: https://www.meity.gov.in/ ; official Feb 2026 FAQs: https://www.meity.gov.in/static/uploads/2025/10/065b6deb585441b5ccdf8be42502a49c.pdf
- CERT-In directions and FAQs: https://www.cert-in.org.in/Directions70B.jsp

Legal counsel must classify whether Kithra is an intermediary/social media intermediary at its actual scale and features, whether it triggers additional duties, and applicable laws on consumer protection, advertising, child safety, IT Rules, security reporting and tax. Do not assume absence of AI obviates cyber, intermediary or privacy responsibilities. Evolving grievance removal/acknowledgment timelines need review against currently notified rules and platform classification. CERT-In directions can require reporting relevant incidents within 6 hours; establish on-call coverage and evidence preservation. DPDP breach reporting requirements upon their commencement include affected-person notices and board detail within prescribed periods. Identify processor/subprocessor roles for Firebase, Cloudflare, email, payment processor and hosting; update transfer/residency analysis per current law and provider region practices, never promise “stored only in India” without proof.

## 7. Data inventory, purpose, visibility and retention policy requirements
| Class | Purpose | Visibility | Retention policy decision |
|---|---|---|---|
| Identity | login, account security | user and constrained auth staff | account life + justified legal hold |
| Adult age check | eligibility/safety | limited trust staff | minimised evidence; review |
| Mode preferences | candidates and boundaries | consented modes only | withdrawable per mode |
| Raw questionnaire | scoring user-selected construct | user only; very exceptional case-scoped staff | minimal, versioned; configurable deletion |
| Derived pattern | user-selected comparison | scoped to matched context/consent | delete on withdrawal/supersession |
| Message content | mutual messaging, safety report evidence | participants; authorized case access only | stated retention and deletion exceptions |
| Photos | user expression and proof | profile scope set by user | revoked/unpublished/media cache expiry |
| Payments | financial records and consumer rights | finance staff | statutory minimum and legitimate disputes |
| Abuse reports | safety operations | scoped staff; parties per policy | documented schedule & legal holds |
| Admin audit logs | accountability | audit/security roles | tamper-evident practical retention |
| Analytics | operation and product performance | aggregated/anonymized | short, purpose-limited; no sensitive raw answers |
Privacy dashboard displays how each datum is used and where; allow distinct consent withdrawal with revocation propagation to match cache, groups and notifications. Do not use questionnaire answers in advertising targeting. Encryption in transit and at rest, key inventory, safe backup and restoration are mandatory.

## 8. Security threat model and control plan
Risks: signup/OTP bypass, token replay, IDOR of assessment, cross-mode leakage, content scraping, grooming and abuse, unmoderated groups, conversation stalking, unauthorized admin escalation, evidence abuse, malicious attachments, webhook replay, Redis cache leakage, D1 SQL injection, R2 public URL exposure, queue poisoning, secret leakage, SSRF, account deletion gaps, denial of service, price tampering, deployment supply-chain compromise. Controls: server-side authorization checks for each resource, strict DTO schemas, queries parameterized, CSRF/CORS config, rate limits and risk challenges, signed short-lived private object URLs, media type verification/size limits and antivirus pipeline, abuse queue and human staffing, explicit payment ledger and webhook signature replay-store, SAST/DAST/dependency scanning, audit logs, backups and restore drills, secret management, security review before deployment, quarterly access reviews, annual independent penetration testing budget when feasible. Staff cannot access questionnaire answers simply by becoming Super Admin.

## 9. Draft legal-facing content (counsel must localize and approve)
### A. Terms of Service — starting clauses
Kithra is a technology platform that introduces consenting adults based on stated preferences and questionnaire-derived descriptive profiles. The service does not guarantee friendship, romantic compatibility, marriage, identity authenticity or behavior. Users must be adults, may use only the relationship modes they activate, must not harass, impersonate, solicit money fraudulently or disclose others' data without permission. The service may moderate content and restrict accounts following published policies and review/appeal mechanisms. Subscription renewal, cancellation, refund eligibility, grievance contact, consumer remedies, applicable governing law/jurisdiction and company address must be populated with verified details. Arbitration/unilateral disclaimers may not defeat mandatory consumer rights; legal counsel decides enforceability.
### B. Privacy Notice — starting clauses
Identify legal entity and contact, purposes and categories of data (identity, questionnaire answers, derived traits, preferences, photos, messaging, payments, reports, event participation), each processor and retention class, mode-specific sharing controls, optional disclosure limits, rights requests, consents, withdrawal and complaints. Describe scoring truthfully: deterministic questionnaire/data matching; no AI twin, LLM or neural replication. State international transfers only where supported by facts. No hidden inference of intimate characteristics. Specify children's exclusion and age handling. Publish version and material-change notification.
### C. Community Standards — starting clauses
No sexual harassment, threats, hate speech, unwanted sexual content, catfishing, financial scams, coercive family involvement, stalking, distribution of private images, minor participation or misrepresentation of consent; respectful group and offline interaction; easy reporting/blocking; confidential review where possible. Staff can remove or restrict harmful content under policy but cannot promise instant global risk elimination.
### D. Consent snippets — examples
`[ ] I understand that my answers will be used to build my personal behavioral-pattern report. My raw answers are private by default.`
`[ ] I want my Friendship profile to be discoverable by eligible members in Friendship.`
`[ ] I separately want to appear in Dating.`
`[ ] I separately want to appear in Matrimony.`
`[ ] Show selected derived trait explanations to a person after I approve a connection request.`
Never precheck optional boxes. Ask explicit consent only for processing that actually requires consent under current legal classification; separate notices per purpose.
### E. Refund/cancellation
Show plan name, price, tax handling, auto-renewal, next billing date, cancellation effective date, features retained on cancellation, eligibility for statutory refunds and grievance path. Payments must be reconciled and invalid webhooks not honored. No deceptive “lifetime forever” without liability analysis.
### F. Rights and grievance policy
Self-service export/deletion where applicable, identity verification proportionate, retention exceptions, request tracker, grievance officer contact and statutory escalation. Staff training and response time under applicable updated rules. Specific hours/addresses filled with real operational commitments, not invented credentials.

## 10. Evidence and release sign-offs
Attach signed privacy impact assessment, retention table, processor contracts, incident runbook, IT rules applicability memo, accessibility audit, abuse escalation staffing schedule, penetration test remediation list, signed technical release, counsel-approved policies, live contact verification. Release blocker: mocked deletion, fake E2EE, mandatory unreviewed intimate questions, unguarded admin login, no reporting escalation, or unsupported marriage guarantee.


---

## VOLUME 7: 06_QA_DEVOPS/TESTING_RELEASE_AND_GITHUB_ACTIONS.md

# KITHRA — QA, GITHUB ACTIONS, JENKINS, RELEASE & OPERATIONS HANDBOOK
Version 3.0 | Full product two-target parity | Template CI configs are scaffolds pending application implementation.

## 1. Quality strategy / environment matrix
Environments: LOCAL for rapid work, TEST with synthetic data, STAGING same topology and managed secrets as production but separate datasets, PRODUCTION requiring approval. Targets: Workers+D1+R2+DO+Queues and Docker+PostgreSQL+Redis+S3. The same API contract, scoring fixtures, policy tests, user journeys and screen/a11y expectations must pass for each; adapters may have provider-specific tests. Never use real user psychological answers in CI.
Test types: static/TypeScript strict; formatter/linter; unit rules; property-based matching; Zod schema; integration D1/PostgreSQL; WebSocket disconnection/resumption; Firebase auth negative cases; RBAC; payments signed webhook; data export/delete; contract OpenAPI; E2E Playwright; axe accessibility; localization; performance/load; resiliency and chaos drills; security SAST/SCA/container/secrets; restore; migration; release smoke and rollback.

## 2. Full mandatory contract acceptance paths
| ID | Scenario | Required result |
|---|---|---|
| AUTH-01 | fake OTP or fabricated token | rejected with no session |
| AUTH-02 | unverified email enters discovery | blocked pending verification |
| AUTH-03 | revoked session sends WS message | rejected; socket revoked |
| MODE-01 | Friendship user searches Dating without explicit opt-in | no record revealed |
| MODE-02 | Matrimony invite cannot reveal private friend chats | hard deny |
| QUIZ-01 | 100-item assignment stored | stable after refresh and resuming |
| QUIZ-02 | two sessions same seeded data | deterministic scores and trace |
| QUIZ-03 | scoring version changes | old snapshot preserved; new explicit |
| QUIZ-04 | 2400 placeholders | not publishable as validated questionnaires |
| MATCH-01 | blocked user matches high | never displayed |
| MATCH-02 | 100% alignment | measured-agreement disclaimer |
| MATCH-03 | missing answers below threshold | insufficient evidence, not fabricated score |
| MATCH-04 | counterpoint > echo | no inferred ethical/human worth labels |
| SIM-01 | simulated response to scenario | rule trace and conditional language |
| SIM-02 | unsupported sensitive inference | never generated or stored |
| CHAT-01 | one-sided invite before acceptance | DM denied |
| CHAT-02 | message duplicate idempotency key | one durable message |
| CHAT-03 | block during active WS | send forbidden immediately |
| CHAT-04 | inappropriate attachment | quarantine and private ACL |
| CIRCLE-01 | nonmember private group read | denied |
| CIRCLE-02 | Circle moderator removes abusive content | documented action and appeal |
| BILL-01 | forged Razorpay callback | rejected no paid entitlement |
| BILL-02 | replayed valid webhook | one ledger transaction |
| BILL-03 | subscription expires / chargeback | correct grace and entitlement state |
| ADMIN-01 | staff login with email-only | denied |
| ADMIN-02 | support agent accesses raw quiz | denied, logged |
| ADMIN-03 | temporary evidence grant expires | denied after expiry |
| ADMIN-04 | moderator suspends user | reason, case linkage and audit persisted |
| PRIV-01 | withdraw Dating consent | all Dating indexes/cache/search removed |
| PRIV-02 | user exports data | complete scoped export without others' data |
| PRIV-03 | user deletion | cascade and backup retention policy verified |
| SEC-01 | media object guessable key | inaccessible without authorized signed read |
| SEC-02 | cross-site/browser CSRF attempt | denied |
| OPS-01 | D1 unavailable or PG failover | bounded errors, retries, alert |
| OPS-02 | Queue redelivery | idempotent job outcome |
| MIG-01 | D1→PG fixture migration | matching row totals and hashes |
| A11Y-01 | reduced motion, keyboard, 320px display | functional all core flows |
| I18N-01 | Tamil/Devanagari long labels | no clipping/overlap |

Add at least one negative abuse test for every endpoint with a user's private data. Maintain an executable requirement traceability sheet `requirement -> endpoint -> screen -> test -> deployment result -> sign-off` with NO blank deployed requirement.

## 3. CI/CD architecture
Pull request on main: install locked deps -> type/lint -> unit -> contract -> security scanning -> build web/admin/api -> dual DB tests -> Playwright + axe -> compatibility checks -> publish artifact/test reports. Do not deploy PRs to production. `main` or tags: protected staging after required checks. Production: `workflow_dispatch` with GitHub Environment approval, least-privilege secrets and explicit release tag. Jenkins is server deployment orchestration from signed GHCR images, not a second independent build of unreviewed source; it verifies digest, performs backups/migrations and health checks. Do not expose credential values in logs. Pin actions by verified immutable SHA in real repo (sample uses major versions for readability and must be pinned before production).

## 4. Cloudflare deployment gates
Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; separate restricted staging/prod tokens. Wrangler named environments and DB/R2/DO/Queue bindings, no checked-in IDs or API keys. `wrangler deploy --env staging` after tests, staging smoke -> human approval -> `wrangler deploy --env production` and verified version. D1 migration: backup/time-travel snapshot before applying `wrangler d1 migrations apply ... --remote`; check schema version and roll-forward compatibility. Preview environment must not use production Firebase account or Razorpay keys. Verify DNS/TLS, CSP, Turnstile, bucket policies, rate caps, budget alarms, retention, logs and emergency page.

## 5. Server deployment gates
Signed/container-scanned images to GHCR, Jenkins retrieves immutable digest in locked environment. Docker Compose production includes API, web, admin, WebSocket, background jobs, PostgreSQL, Redis, Caddy; optional MinIO/S3-compatible data storage; separate backup job and metric collectors. Health probes and restart policy mandatory. Secrets from Jenkins credentials or secret manager, not `.env` in git; production Compose examples are templates. Before cutover: encrypted PG dump + WAL strategy, object-store versioning or backup, schema migration dry-run, migrate jobs plan, reverse proxy certs, anti-DDOS edge policy, admin network protection. Staging integration tests again on deployed URL.

## 6. Observability and incident operations
Every request has correlation ID; metrics: 5xx, p95/p99, WebSocket drop/reconnect, queues delayed/DLQ, D1 row reads/writes and DB size, R2 bytes/operations, payment webhook failures, staff SLA backlog, user reports by severity, quiz submit/recompute errors, privacy revocation latency, error budgets. Never log raw questionnaire answers, auth tokens or full private chats. On-call document: roles, severity, incident runbook, communication templates, forensic preservation, relevant CERT-In/DPDP notice decisions with counsel. Tabletop exercise quarterly and annual restore/penetration drill as budgets permit.

## 7. Release definition — FULL PRODUCT NOT MVP
All agreed customer/admin features must be built and evaluated before full launch. Implementation in phases is scheduling, not scope elimination. A module waiting on psychometric validation, gateway account approval or legal review is an explicit release blocker/feature not offered to users—not silently advertised as functional. Each completed feature has production implementation in both targets, responsive design, accessibility, error states, documented permission/consent, monitoring, negative tests, rollback and owner sign-off. The operator must be staffed enough to honor grievance and safety obligations; “we built it serverless” is not a substitute.

## 8. Test owner and evidence checklist
Design lead: component screenshots/accessibility and content/locale review. Backend lead: contract tests, DB parity, deterministic fixtures. Security lead: token/RBAC IDOR tests, penetration remediation, incident readiness. Privacy/legal lead: privacy notice, DPDP implementation, retention, consumer disputes. Founder/product: no-omission feature register and real-world product comprehension. DevOps: staging/prod promotion evidence, backup restoration, cutover runbook. Evidence retained with release tag, not exposed to members. Source docs: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/ https://docs.github.com/en/actions https://motion.dev/docs/react https://www.w3.org/TR/wcag/ .


---

## VOLUME 8: 07_FINANCE/FIN_RD_COSTS_PRICING_TEAM.md

# KITHRA — FIN-RD: PRICING, COSTS, STAFFING, CASH RUNWAY & PORTABILITY
Version 3.0 | All values illustrative pending vendor quotes, tax advice and real consumption.

## 1. Financial contract
Kithra has **zero AI-inference, AI-twin, LLM and vector database runtime costs**. Its deterministic questionnaire profile scoring creates ordinary SQL/compute and support costs instead. A small Cloudflare bill is not a low-cost full company: personal moderation, operations, safety, support, security, legal and founder time can dominate. Count registered accounts, verified accounts, monthly active users, paying users and paid plan churn separately; a “5,000 registered users” infrastructure quote alone is unreliable.

## 2. Planned offer — proposal, not finalized prices
| Tier | Monthly | 3 months | 6 months | 12 months | Limits concept |
|---|---:|---:|---:|---:|---|
| Free | ₹0 | ₹0 | ₹0 | ₹0 | assessments, basic matches, mutual chat, Circles, all protections |
| Plus | ₹149 | ₹399 | ₹749 | ₹1,399 | richer explanations, advanced search, higher introduction allowance |
| Connect | ₹299 | ₹799 | ₹1,499 | ₹2,799 | advanced discovery, curated circles, enhanced insights |
| Matrimony Intent | ₹399 | ₹1,099 | ₹2,099 | ₹3,899 | intent-specific filters, life-planning sections, optional guided introductions |
One profile may opt into Friendship/Dating/Matrimony with separate privacy; tiers and entitlements should be explicit per mode or transparently combined after research. Safety controls, blocking/reporting, consent and legal data rights are always free. No lifetime unlimited promise without liability model. Price cards show tax inclusion/exclusion accurately, renewal, trial and refund policy, payment processing in minor units.

## 3. Infrastructure cost drivers
Cloudflare Paid Workers minimum $5 USD/month plus applicable usage and taxes. Workers request/CPU, D1 rows read/written and occupied bytes, DO websocket messages/duration, R2 GB-month and Class A/B operations, Queues operations and logging costs all matter. D1 Free per-database 500 MB; Paid max 10 GB/database, so scaling may require sharding or migration. R2 Standard 10GB free storage subject to current plan terms. Server comparisons: single VPS for controlled traffic, or high-availability multi-server with PostgreSQL PITR, Redis, monitoring, backups, ingress/WAF and Jenkins maintenance. These options are not equivalent in uptime or staff workload. Reference official schedules at https://developers.cloudflare.com/workers/platform/pricing/ and https://developers.cloudflare.com/d1/platform/limits/ ; verify on procurement day.

## 4. Finance worksheet architecture / editable inputs
Monthly model needs separate rows for users: registrations, verified, DAU, MAU, assessment starts/finishes, matches served, connection requests, message counts, file uploads/retention, reports, payments and chargebacks. Compute: `paying_users = MAU × conversion_rate`; `gross_billings = sum(active_subs_by_plan × recognized_monthly_price)`; `payment_fees = processed_volume × gateway_rate + refunds/chargebacks` (actual gateway tax treatment separately); `revenue_ex_indirect_taxes` based on applicable GST advice; `gross_contribution = revenue_ex_tax - gateway - infrastructure - variable verification/notification`; `operating_profit = gross_contribution - payroll - moderation - marketing - security - legal - overhead`; `cash_flow = operating_cash - capex - taxes_paid +/- working_capital`.
Input sensitivity scenarios: founder salary 0/25k/50k/100k INR monthly; staffing by role, DAU:MAU 0.1–0.5, paid conversion 1/3/7%, weighted ARPPU ₹100/₹200/₹400, media per member 0.1–3 GB, messages per DAU 5–100, legal/audit reserves, support tickets per 1K MAU, payment refund rate, CAC, churn, dollar exchange, GST. Run low/base/high cases; do not use a $5 Workers bill as proxy for full product deployment.

## 5. Founder salary and staffing
Solo founder pay is not discretionary if evaluating true long-run profitability. Include engineering lead, frontend designer, moderation coverage, part-time privacy counsel, security review, operations support, accountant, community manager and backup on-call where required by platform obligations. Model contractor costs when full-time hires are impossible. In an “unpaid founder” cash-flow case, show separate `imputed_founder_cost` for economic profit; similarly treat volunteer moderation as a safety capacity risk.

## 6. Scale-specific scenarios
Build and regularly recompute 100, 500, 1K, 5K, 10K, 25K, 100K registered accounts under DAU/MAU assumptions. Cloudflare vs VPS comparison outputs: request and row budgets, media storage, websocket concurrency, alert needs, estimated vendor charges and mandatory paid switches. Report total company cost after salaries, support, legal, marketing and taxes separately. Crossing D1 500MB free per DB or growing image storage can make “₹0 Cloudflare” impossible even at low registration counts.

## 7. Controls and finance permissions
Budget owner sets alert at 50/75/90% monthly cloud spend; pause nonessential media transformations or activity only after preserving emergency/reporting services. Do not silently suspend mandatory safety operations because free quota exhausted. Cost reports aggregate by Workers calls, D1, R2, DO, Queues, Firebase email/phone, mail provider, payment, backups, logs. Finance RBAC controls refunds, chargeback evidence and reconciliation; no support agent may change plan entitlements directly. Avoid price manipulation by clients; server chooses entitlements after verified payment webhook.

## 8. Business risk and break-even policy
A complete platform is not profitable just because deterministic scoring is cheap. Test acquisition cost, retention, local matching liquidity, safety operations, conversion and renewal. Break-even target: paid active subscribers required to cover all fixed and variable costs at blended net contribution, expressed with confidence intervals and founder salary. Actual answer changes significantly if 1% versus 5% of 5K registrants subscribe. Don't treat earlier illustrative ₹577 Cloudflare and ₹1.26 lakh total operating cost as universally accurate: those are scenario outputs dependent on user activity and fixed staffing.

## 9. Existing workbook handover
The previously created Kithra 5-year financial workbook is included as a **baseline scenario artifact**, not a verified forecast. Accountant/financial analyst must re-audit its formulas, current prices, FX, GST, employer cost, compliance staffing and cash-runway assumptions. It never represents a final commercial offer. Cross-check current Razorpay transaction rate and promotion terms; the official pricing page can change: https://razorpay.com/pricing/ .


---

## VOLUME 9: 08_REFERENCE/SOURCES_AND_PROVENANCE.md


# Source Register, Reproducibility and Ownership

- **Uploaded concept**: Kithra-main.zip; static inspection of `src/App.tsx`, `src/data/questions.ts`, `src/data/mockMatches.ts`, `src/components/AdminView.tsx`, `src/components/AuthModal.tsx`. No production-readiness inference from mock UI.
- **Official Cloudflare current docs**: https://developers.cloudflare.com/workers/static-assets/ ; https://developers.cloudflare.com/workers/platform/pricing/ ; https://developers.cloudflare.com/d1/platform/limits/ ; https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/ (reviewed 2026-11-01).
- **Official Firebase**: https://firebase.google.com/docs/auth/ ; https://firebase.google.com/pricing ; https://firebase.google.com/docs/auth/limits (reviewed 2026-11-01).
- **Motion**: https://motion.dev/docs/react ; https://motion.dev/docs/react-layout-animations ; https://motion.dev/docs/react-use-scroll (reviewed 2026-11-01).
- **India Gazette**: https://egazette.gov.in/WriteReadData/2025/267647.pdf ; https://egazette.gov.in/WriteReadData/2025/267650.pdf ; CERT-In https://www.cert-in.org.in/Directions70B.jsp (reviewed 2026-11-01).
- **Accessibility**: https://www.w3.org/TR/wcag/ (reviewed 2026-11-01).
- **Payments**: https://razorpay.com/pricing/ (reviewed 2026-11-01).

All source-specific price/rule statements are time-bound. Project estimates and design color/font choices are recommendations, not externally verified facts. Legal and psychometric drafts are subject to specialist approval.

---

# D1 ↔ PostgreSQL migration contract (implementation checklist)
`contracts/schema.sql` is a starter D1 schema with 31 validated SQLite tables. `postgres/0001_parity_starter.sql` is a **representative subset**, not a parity-complete migration. Do not deploy production until every D1 domain entity, index, retention job, access rule and query is implemented in PostgreSQL and verified in CI.

1. Audit canonical data dictionary (`08_REFERENCE/07_DRD...`) and check requirements register. Maintain explicit migrations for SQLite and PostgreSQL; never apply SQLite DDL to PostgreSQL by blind string replacement.
2. Map SQLite `TEXT` UUIDs to PG UUID and any booleans to `boolean`; map integer epoch time to timezone-aware UTC timestamps; money in integer minor units; JSON to JSONB with consistent ordering/semantic comparison; treat null and foreign-key constraints explicitly.
3. Build both repository adapters behind the same TypeScript ports and run the same 150 acceptance requirements and golden scoring datasets.
4. For migration: pause writes or implement a rigorously tested outbox/high-water mark, export D1, transform, import to PG, verify counts/referential integrity/cryptographic row hashes by privacy-safe partition, reconcile payment ledgers, reset/restore websocket state and job queue while preserving idempotency.
5. Canary on staging with synthetic 100/1K/5K/100K datasets; measure performance and storage; test cutover and rollback under failures.
6. Reconcile opt-in modes, delete/withdrawn users, blocks and staff RBAC before enabling discovery; do not reactivate deleted profiles because of an export snapshot.
7. Automate restore drills and record owner approvals. Neither migration nor the Docker Compose project in this kit is production-complete without this work.
