# Kithra Master Product Business and PRD

**Kithra full-product handover · 1 November 2026 · For developer/designer implementation and legal review**



---

> **Reference:** `00_READ_FIRST/DECISIONS_AND_CONFLICTS.md`

# Kithra controlling decision register — supersedes previous iterations


- **D-01** — **Issue:** AI twins vs deterministic system; **Controlling decision:** **NO AI/LLM/twins/embeddings**. Questionnaire dimensions + rule-driven explanations and hypothetical simulations only. Do not claim brain replication or probability of behavior.; **Confidence / approval:** founder confirmed
- **D-02** — **Issue:** Existing ZIP/mock UI; **Controlling decision:** Existing Kithra prototype and historical kits are references only. New Hermes research supplies design evidence; current specification controls build.; **Confidence / approval:** founder confirmed
- **D-03** — **Issue:** MVP vs full product; **Controlling decision:** All three relationship modes and all agreed systems are in full-product contract. Staged work is permitted; omitting features is not.; **Confidence / approval:** founder confirmed
- **D-04** — **Issue:** Brand palette; **Controlling decision:** Previous midnight indigo/iris **rejected**. Hermes recommends D2 Ink & Clay; D1 Sunlit Humanist and D5 Forest & Sand remain alternatives. DO NOT claim D2 founder-approved.; **Confidence / approval:** **founder approval required**
- **D-05** — **Issue:** Typography; **Controlling decision:** Provisional Fraunces display + Inter body + locale-specific Noto Sans. Validate Tamil, Hindi and English with native reviewers.; **Confidence / approval:** provisional
- **D-06** — **Issue:** Themes; **Controlling decision:** Complete semantic light/dark roles; remember user setting; system default with explicit override; admin supports both themes.; **Confidence / approval:** approved direction
- **D-07** — **Issue:** Monetization; **Controlling decision:** **One Free/Plus/Connect entitlement** across opted-in modes; mode-specific expensive human services as optional add-ons only. Older separate Matrimony plan retired.; **Confidence / approval:** research recommendation; pricing validation pending
- **D-08** — **Issue:** Compatibility percentages; **Controlling decision:** Agreement indices based on defined measures and coverage, never "chance of marriage", guaranteed soulmate, or moral ranking.; **Confidence / approval:** mandatory truthfulness
- **D-09** — **Issue:** Mode separation; **Controlling decision:** Single auth identity; separate mode-scoped profile/consent/photo discovery and preferences, explicit per-mode activation.; **Confidence / approval:** required
- **D-10** — **Issue:** Admin entry; **Controlling decision:** Separate admin UI + allowlisted staff **and verified MFA** + server-side RBAC, case-scoped evidence; email/password alone not sufficient.; **Confidence / approval:** required
- **D-11** — **Issue:** Firebase MFA; **Controlling decision:** Base Firebase Auth and upgraded Identity Platform differ: choose Identity Platform or alternate strong identity provider if integrated MFA required. Cannot state base Firebase includes enterprise MFA.; **Confidence / approval:** verify cost/provider
- **D-12** — **Issue:** Photos; **Controlling decision:** Private R2, server-authorized signed URLs, ingest/EXIF removal/moderation, mode-scoped visibility and report/remove flows.; **Confidence / approval:** required
- **D-13** — **Issue:** Hosting; **Controlling decision:** Cloudflare Workers Static Assets preferred for new build; Pages alternative, plus portable Docker/Node/PG/Redis server deployment.; **Confidence / approval:** required
- **D-14** — **Issue:** Research evidence; **Controlling decision:** Pinterest/Reddit are inspiration, not representative user studies. Competitor UI behind login unverified. Research-paper findings are contextual, not proof of matching.; **Confidence / approval:** required
- **D-15** — **Issue:** Indian/international users; **Controlling decision:** EN baseline; HI/TA early; other languages through i18n; privacy/security reviewed by locale before launch, no assumed global legal compliance.; **Confidence / approval:** locales to approve
- **D-16** — **Issue:** True production; **Controlling decision:** Build, deploy, security-review, test accessibility and verify controls before claiming production; no fake testimonials, verified badges, E2EE or matching accuracy.; **Confidence / approval:** mandatory
- **D-17** — **Issue:** Admin visualization; **Controlling decision:** Palantir-like dense information clarity for case triage, evidence graph, relationships and audit; member UX remains warm and photograph-led.; **Confidence / approval:** design recommendation


**Escalation rule**: Where an old document says AI twins, matrimony-only subscription, mock admin OTP, or completed DPDP compliance, treat it as explicitly superseded, retain historical reference only, and record the conflict in the build ledger. No automatic implementation.

**Pending final decisions**: D2 vs D1/D5, visual approval on Indian/international five-second tests; final benefit limits/prices, specific launch geographies/locales, exact verification provider, data-retention schedule, and legal/accountant approvals. Implement configurable choices but do not fabricate sign-off.


---

> **Reference:** `00_READ_FIRST/MASTER_CONTROL_SPEC.md`

# KITHRA 2026 — CANONICAL FULL-PRODUCT MASTER CONTROL SPECIFICATION

**Build contract:** a complete, multi-region-ready, privacy-first social compatibility system for consenting adults, with Friendship, Dating and Matrimony experiences, deterministic questionnaire matching, explainable comparison lenses, communities, messaging, payments, support and a secure admin operations center. Production deployments: Cloudflare and Docker servers with feature/API parity.

## 1. Product identity and the truthful promise
Kithra helps adults meet compatible people through consented intentions, declared preferences, deterministic questionnaire patterns and mutual human choice. Never imply a brain copy, mathematical destiny, psychotherapy, behavioral certainty, scientifically proven predictive outcomes, or entitlement to a person. "Echo" = similarity; "Counterpoint" = meaningful difference; "Mosaic Fit" = explicit rule-based complementarity; all report coverage, model version, explanation and uncertainty. Users can decline, block or withdraw at any point.

## 2. Success definition
Primary north star: mutually confirmed valuable connection (repeat voluntary interaction after 7/30 days) segmented by mode, without unsafe engagement optimizations. Guardrails: complaint resolution, no privacy leakage, mode cross-disclosure zero, account recoverability, reliable billing and no fabricated data. Registered ≠ MAU ≠ retained ≠ paying. Do not optimize only swipes/scroll time.

## 3. Complete feature domains (no MVP exclusions)
Public web and SEO; editorial landing; fully adaptive auth/sign-in/signup/recovery/verification/MFA; progressive onboarding and intent selection; locale/consent; member profiles/photos/verification; themed 100-question banks & shuffled, server-signed versioned sessions; trait scoring, comparisons, lenses, explanations, coverage bands, choices to retake and withdraw; mode home/discover/search/filters; connection requests/mutual connections; DMs/groups; Circles/events; notifications; unified subscriptions/receipts/refunds; support & grievance; rights center/export/delete; accessibility & low-data settings; staff admin with users, safety, photos, reports, evidence, anti-spam, scoring releases, support, payments, RBAC, analytics, system health and incident response; audit and backups. See `12_REGISTERS/SCREENS.csv` and `REQUIREMENTS.csv` for complete routes and acceptance mapping.

## 4. User-facing experience
Desktop landing editorial with light-first Ink & Clay (provisional); hero must answer WHAT/WHO/HOW in 5 seconds: "Find your kind of people." Primary CTA "Start with a few questions". Three equal mode cards, honest 4-step matching explanation, fictional clearly-labeled interactive comparison demo, questionnaires, photo story, safety, unified pricing, FAQ, supported locales and real entity/legal footer. No fake live user numbers, marriage stories or "scientific" badges. Mobile CTA and first real content must appear immediately.

Auth: accessible Google/email sign-in, email verification, password reset, error/locked states, 18+ gate, explicit consent, one account and mode activation. Never front-load hundreds of questions before any value. Modal flows never obscure a pending safety issue. Photo workflow: upload → crop → EXIF scrub → approve → privacy per mode → review/reorder/remove; anonymous/blur/limited-photo experience is honest, inclusive and configurable.

Member UX: one shell; mode switcher communicates scope without blending mode data. Navigation: Home, Discover, Patterns, Messages, Circles, Notifications, Profile, Safety, Settings; premium under Account, not a nagging main tab. Desktop responsive sidebar + content + contextual details; mobile bottom tabs plus More sheet; keyboard support and mobile browser back behavior tested. Always show empty/error/offline/loading/permission/blocked states.

Admin: separate /staff sub-app or admin subdomain; must not be discoverable as a working surface without a verified staff session. No "hidden link" security. Dense triage: left navigation, central list, case details in right pane; no raw private answers by default. Explicit assignment, evidence access justification, SLA, appeal, dual control on sensitive actions and immutable audit events.

## 5. Visual foundation — pending founder sign-off
Recommended research direction D2 Culture-Neutral Editorial "Ink & Clay". Light: canvas #FBFAF7, white #FFFFFF, ink #1F2320, deep teal #1F6F5C, clay #D98A3D DECORATIVE ONLY, safe clay text #8A5A1E, blue support #3E4A6B. Dark: canvas #14170F, surface #1F241D, ink #F2F2EC, teal #4FB39B, clay #E0A863. Friendship = teal; Dating = rose-clay; Matrimony = ink-blue as **labels+icons+accents**, not separate brands. Typography Fraunces display + Inter interface + Noto script-local. Token source: `13_RESEARCH_ORIGINAL/03_BRAND/design-tokens.json`; live implementation CSS source also supplied. Use all tokens; no raw scattered hex values. Test accessible contrast in all states before freeze.

## 6. Motion contract
Use `motion/react` and shared variants, `AnimatePresence` for quiz/question/wizard transitions, `layout`/`layoutId` for mode chip/selected tabs and drawers. Hero headline fade-rise ≤520ms; editorial photo reveal ≤520ms; relationship-map edge draw on interaction only; quiz horizontal transition ≤220ms; photo/modal micro transitions 120–220ms; admin 0–160ms only where it improves state recognition. Prefers-reduced-motion and low-data mode disable decorative motion; never animate safety submissions, delays, warnings or payment outcomes. No scroll-jacking, autoplay video or looping animation.

## 7. Architecture contract
Monorepo `apps/web`, `apps/api-worker`, `apps/api-node`, `apps/admin`, `packages/domain`, `packages/contracts`, `packages/repositories`, `packages/ui`, `packages/design-tokens`, `packages/matching`, `packages/auth`, `packages/storage`, `packages/realtime`, `packages/notifications`, `infra/cloudflare`, `infra/docker`, `tests/*`.

Cloudflare: React 19 + Vite + TS + Tailwind + Motion, Workers Static Assets or supported Pages alternative, Hono API, D1, private R2, DO for real-time, Queues/Cron, transactional email vendor, Firebase identity token verification. Server: same React and domain packages, Hono Node adapter, PostgreSQL, S3/R2 media, WebSocket + Redis, BullMQ, Caddy/Nginx, Docker Compose, Jenkins and GHA. Both share OpenAPI, permissions, scoring and events, with adapters for SQL, object storage, clocks/IDs, realtime and background workers.

Database portability is NOT `replace SQLite with Postgres` blindly: two migrations, same logical schema, transaction semantics and collation tests, explicit cutover and rollback, reconciliation checks. Docker Compose is a deployment baseline, not automatically a highly available 100k-user architecture. Scalable prod requires HA PostgreSQL/Redis, object storage, observability, backups and on-call.

## 8. Security, legal, operations
18+ assumption; no covert trait inference (especially sexual orientation/religion/health). Auth tokens verified server-side, short-lived sessions, secure cookies, CSRF strategy, rate limiting, bot mitigation, session revocation, MFA for staff. RBAC+ABAC by case/mode/actor/resource with deny by default; evidence access JIT and audited. Privacy: purpose-specific notice, per-mode consent, retention and withdrawal, real exports/deletions, processor register, incident handling, verified user right responses. Different jurisdictions require local counsel review; no claim of immunity. India DPDP operational phase 2027, current IT duties 2026 and CERT-In where applicable. Verify dates and applicability at release.

## 9. Commercial model
Unified Free/Plus/Connect; Friendship/Dating/Matrimony do not have different core entrance fees. Indicative India Plus ₹149/399/749/1399 for 1/3/6/12 months and Connect ₹249/699/1299/2399. These are hypotheses, NOT validated prices or legally final tax-inclusive offers. Optional human assistance and verified review must correspond to actual staffed/provider-delivered services. Safety, eligible discovery, mutual chat and data rights remain free. Show taxes, renewal, cancellation and refund clarity before payment. No VIP "perfect match" sale.

## 10. Quality gates
All routes completed in all states; no stub buttons; no mocked auth/payment; 404/403/410/429/500/503 and offline paths; identity access matrix test; media privacy test; matching determinism property tests; mode isolation; admin staff escalation; full subscription lifecycle; CI clean and deployment both environments; a11y WCAG 2.2 AA audited; Core Web Vitals and real-device regression; load and reliability; audit/backup/restore rehearsal; UAT and independent privacy/security review. No missing module can silently be recategorized as post-launch.

## 11. Build process for AI Studio
AI Studio may generate code in bounded slices. For each slice: cite requirement IDs, output actual code + migrations + API docs + tests + screenshot, run static checks, security checks and parity, register blockers. Do not claim tests were run if tools unavailable. Always preserve full-product scope in backlog. Team may sequence work, but no "MVP" reduction. `11_AI_STUDIO/START_PROMPT.md` is the agent launch instruction; `12_REGISTERS/REQUIREMENTS.csv` is the contract ledger.

## 12. Critical external validations still required
Brand approval; scientifically review questionnaire constructs and weights; verify provider limits/prices/availability; real payment/test merchant account; admin MFA; retention schedule and law review; copyright/consents for photography; user research in India and at least one other market; measurable fairness/false-positive/false-negative performance; anti-harassment operations. Until done, present them as blockers, never as green status.


---

> **Reference:** `01_PRODUCT/BRD_Business_Requirements.md`

# BRD — Business Requirements and Operating Model

## Mission and problem
Kithra serves adults who want enduring platonic friendships, consenting dating, or serious marriage-oriented introductions without treating people as marketplace inventory. Existing alternatives often optimize discovery/screen time; Kithra's hypothesis is that transparent, consent-based behavioral alignment and complementary needs might improve the quality of introductions. **This is a hypothesis, not validated superior performance.**

## Stakeholders
Founder/product owner; ordinary members; Friendship/Dating/Matrimony participants; guardians/family participants **only where explicitly invited by adult users**; community leaders; admins/moderators/support, privacy/grievance officer, payments/finance, security engineer, infrastructure team, counsel, translators, accessibility reviewers and external data processors.

## Business objectives
B01: one account with three independent relationship intents. B02: free basic eligible discovery, safety and messaging. B03: make score meaning understandable without deceptive precision. B04: convert paying users on convenience/real-cost services rather than withholding human access. B05: work in India plus international markets via localization, compliance and payment adapters. B06: dual deployment from common code; contain marginal costs; safe rights management. B07: measure voluntary repeat connections and safety outcomes, not compulsive daily use.

## Business rules
BR-01 Users are adults 18+ and individually consent to each selected mode; no automatic exposure across modes.
BR-02 Matrimony is a user-selected intention, not proof of marriage eligibility or guaranteed marriage.
BR-03 Account, device, photo and sensitive data sharing is minimized; search engines must not index personal profiles unless explicitly designed and opted in (default is no indexing).
BR-04 Matching outputs are measured questionnaire alignment/complementarity bands, with coverage and version, not probabilities of love/behavior.
BR-05 Reports, blocks, deletion/export where applicable, privacy settings and mutual messaging are never locked behind payment.
BR-06 Subscription entitlements are account-based across selected modes; any optional professional services have transparent, separately priced terms.
BR-07 No fake scarcity, social proof, online indicators, fabricated testimonials or audit claims.
BR-08 Admin access needs least privilege, MFA and separation of duties; all case actions logged.
BR-09 All media flows need model/provider-independent controls and consent by context.
BR-10 No psychological diagnosis, addiction design or inferred sexual orientation from disguised questions.

## Stakeholder success measures & definitions
Registered user, activated user, assessed user, consented-match-eligible user, 7/30-day active, paying, safe mutually accepted introduction, 7/30-day repeat contact, completed data-rights request, harm rate, grievance SLA; no KPI shall use the same label for registrations and MAU. Conversion: paying / active eligible, not paying / total installs. Safety: reports per 1000 actives with severity mix; declines in reports alone do not prove safety.

## Market/pricing research status
Hermes reports recommend Free + Plus (₹149, ₹399, ₹749, ₹1,399) + Connect (₹249, ₹699, ₹1,299, ₹2,399) in India for month/quarter/half-year/year and optional paid real-cost services. These are **test offers**. Source findings on Pinterest/Reddit are qualitative signals with sampling limitations. India-specific demand, international willingness to pay, costs and legal readiness remain open validation items.

## Acceptance
Founder approves explicit scope and brands; pricing counsel/accountant signs checkout flows; user journey tests validate mode separation; finance approves 5-year runway sensitivities; operations owner signs on-call and safety coverage; no feature marked complete only because it renders.


---

> **Reference:** `01_PRODUCT/PRD_Product_Requirements.md`

# PRD — Full Product Experience Requirements

## Product form
Responsive PWA-ready web platform; no native-app promise unless native builds commissioned. Desktop, tablet, 320px-wide mobile and low-connectivity journeys. Modes: Friendship / Dating / Matrimony. One account, optional simultaneous activation, separate discoverability. Every screen must have empty/loading/error/unauthorized/offline/success states and safety entry points. See all original 39 member and 24 admin screen descriptions preserved under `13_RESEARCH_ORIGINAL`.

## Complete onboarding and identity journey
Landing > sign-up (email or Google; phone only after billing/verification review) > email verified > adult age gate > accessible notice + mode-specific consent > choose one or more intents > safe profile baseline > optional photo > first sample mini-assessment or explore limited public explanatory demo > full themed assessments at member pace > scoring complete > eligible matching only when reciprocal preferences + minimum coverage permit > connection request > mutual acceptance > messaging > repeat relationship outcomes. Returning user signs in directly, can resume/retake with version pinning, pause a mode without deleting their account, and revoke preferences or request data removal.

## Intent-specific journeys
Friendship: people with compatible interests and schedules, explicit platonic boundaries, Circles and shared activities, safety reminders. Dating: adult mutual preferences, consented identity/orientation filters only if volunteered, boundaries, opt-out. Matrimony: long-horizon values and life goals, no default family access, optional separate consensual family introduction, not caste/religion stereotyping. Changing mode cannot migrate previous photos, intimate answers, messages or profile visibility without explicit confirmation.

## Assessment engine UI requirements
Question catalog organized into 12 versioned themes, each with two 100-question sets reserved as placeholders. Shuffle by seeded, server-issued sequence per session; questions remain auditable by published ID. Support skip, back, save, resume, withdraw, locale and screen-reader. The adversarially resistant design must rely on response-consistency checks, diverse item forms and consented follow-up, not unsupported "AI-proof" claims. Never infer undisclosed intimate traits. No questions published without editorial, psychometric, culture, accessibility and legal reviews. User should not have to finish every set to navigate.

## Personality and discovery
My Patterns: measured dimensions, confidence/coverage, version, date and which areas are not measured. Match lens Echo (similar), Counterpoint (differences), Mosaic Fit (defined complements); compare user profiles only after eligibility checks. Decimal scores may be computed but UI shows coarse bands + explanations; no "100% soulmate". Profiles foreground photos, personal voice (text), common goals, interests and privacy; no mass swipe casino, demographic-worth scores or pressure tactics. Absent local pool → honest empty state + invite/waitlist, no fake profiles.

## Relationship and community
Requests: received/sent/declined/revoked/expired, notification preferences, safe reminders. Messaging: mutual acceptance gate, per-mode thread, reliable send/delivery/read semantics only when supported, attachments after media validation, rate limits, report/block accessible in thread header, no unsupported E2EE claim. Groups/Circles: create/join/request/moderate/leave/owner handover/archive, private/public per approved rules, invites, posts/events and member safety. Group chat moderation evidence must respect legal/consent boundaries.

## Account & commerce
Edit photos/visibility, individual mode pause, accessibility/language, security/password, sessions, consent dashboard, reports/appeals, receipts, subscription management, cancellation/refund, rights center/data export/delete and help/support. Purchase flow displays exact total incl applicable tax, terms, renewal, payment errors, entitlement grant only on verified backend webhook. Cancel in one clear path. Refund/chargeback changes entitlements idempotently and preserves statutory records as needed.

## Staff-facing capability (full contract)
Full staff product includes Overview, Users, Verification, Photos, Reports, Fraud, Evidence, Circles, Question Bank CMS, Score Releases, Support, Refunds, Subscriptions, Staff/RBAC, Privacy Requests, Grievances, Compliance, Audit, Analytics, System Health, Incidents, Feature Flags and Appeals. Every operation is case/time scoped and requires roles and justifications. See `07_ADMIN_OPERATIONS`.

## Notification, accessibility, internationalization
Email/in-app/push only after product/channel consent where required; no spam, default safe privacy. i18n keys not concatenated sentences; RTL capability reserved; timestamps localized, currencies not auto-converted; locale-dependent consent and policy variants; regional font assets selectively loaded. WCAG 2.2 AA, keyboard, screen readers, contrast and explicit reduced-motion.

## Negative requirements
Do not generate chatbots pretending to be users, AI twins, brain-clone models, covert sensitive-trait prediction, fake testimonials, "online now" without evidence, fake OTP, mock payment success, simulated E2EE or high-compatibility paywalls. Admin console is never reachable via a trivial hardcoded password.

## Full-product acceptance
Every numbered route and every listed state has a screenshot, business API contract, automated test, ownership, security controls and production runtime check. AI Studio progress must be evidence-backed; "designed" ≠ "implemented" ≠ "tested" ≠ "deployed".


---

> **Reference:** `01_PRODUCT/SRS_and_NFR_Requirements.md`

# SRS + NFR-RD — Engineering-Grade Functional and Quality Requirements

## Identifiers and contracts
System is event-driven but consistent on authoritative actions. Each mutation carries a request ID/idempotency key; APIs are OpenAPI-versioned; timestamps in UTC with local displays; ULID/UUID unique IDs; correlation IDs in logs; error responses application/problem+json with stable typed codes and user-safe text. APIs MUST verify identity and resource-permission on each request, never trust mode/profile identifiers sent by client.

## Core functional testable requirements
FR-001 signup/login/logout/session expiry and recovery. FR-002 verified adult age-gate and consent timeline. FR-003 per-mode activation/pause and mode-scoped profile. FR-004 per-mode media visibility and photo lifecycle. FR-005 assessment catalog, shuffle, version-pinning and saved answers. FR-006 deterministic scoring, documentation, re-score events, pair eligibility and explanations. FR-007 discovery/compare/lens and no matches truthful states. FR-008 connection request state machine, block precedence. FR-009 DM/group messaging with receipt and moderation. FR-010 Circles/events, roles and community safety. FR-011 checkout/subscriptions/refund/webhook idempotency. FR-012 notifications and unsubscribes. FR-013 rights export/deletion, legal holds and notices. FR-014 admin RBAC/JIT, reports/appeals/SLA, analytics and privacy audit. FR-015 feature flags, i18n/accessible support, full errors. FR-016 Cloudflare and Docker contract parity and deploy/rollback.

## SLO targets (engineering proposals requiring load measurement)
- Public HTML available ≥99.9% monthly post-launch (not a cloud SLA promise).
- Core read API p95 ≤400 ms under declared standard workload from target region; write p95 ≤800 ms excluding external payment/auth providers.
- Largest Contentful Paint ≤2.5s, interaction INP ≤200ms, CLS ≤0.1 at p75 field data for target mobile cohort; report by geography and network.
- Initial landing JS ≤200 KB compressed target; image LQIP/WebP/AVIF with `srcset`; no autoplay decorative videos.
- Realtime first message ack p95 ≤1.5s within tested conditions; eventual delivery with retries, monotonic order per conversation.
- Data export completion goal ≤24h for ordinary account sizes; legal/statutory deadlines override engineering objective.
- Disaster recovery objective RPO ≤24h and RTO ≤8h initially; fail rehearsals before relying on them. Higher availability requires upgraded architecture and staffing.
- 0 known critical/high OWASP ASVS findings at release; all staff actions attributable; audit gaps alert.

## Reliability and data quality
Use idempotency keys on invitations, messages, payment callbacks and rights jobs; bounded queue retries with DLQ; no duplicate charge, no duplicate notification, no ghost subscription. Mandatory reconciliation jobs for balances, media DB-vs-object list, rights jobs and mode authorization. Schema migrations forward/backward tested; rollbacks account for irreversible migrations.

## Accessibility matrix
WCAG 2.2 AA target (not a certification claim); visible focus, correct label/roles, keyboard only, 200/400% zoom, 320px width, 44px product touch target, color-blind modes, reduced-motion, screen-reader announcements for async success/errors. Test with English, Hindi and Tamil strings including long copy.

## Security and privacy NFR
OWASP ASVS 5 Level 2 as target; threat model for romance scams, impersonation, harassment, stalking, domestic abuse, coercion, fraud and unauthorized admin surveillance. Encrypt storage/transport, restrict raw assessments, rotate secrets, signed URL short TTL, device/session revocation. Backups encrypted and access controlled. Pen-test or independent security review before production data is accepted.

## Observability and testing
Structured logs without private answers/credentials/media, cost meter per provider, traces for API and queues, SLO dashboards, synthetic probes, error budgets; unit/integration/contract/E2E/property/migration/load/accessibility/abuse tests. CI must fail on code/test/contract/security gates; release gate requires human security, ops and legal approval.


---

> **Reference:** `01_PRODUCT/CONTENT_SEO_LOCALIZATION_RD.md`

# CONTENT-RD / SEO-RD / I18N-RD — Editorial Language and Globalization

## Content principle
Explain the actual service in human terms in the first viewport; make available modes clear without suggesting matrimonial brokerage is inherently superior. Prefer "Find your kind of people" to "Find your soulmate". Only publish verified statistics; labels like "illustration" for fictional example profiles. Do not claim "AI", "98% compatibility prediction", "clinically verified", or national data residency without verification.

## Page-specific content
Landing exact sections S0–S10 and CTAs from `13_RESEARCH_ORIGINAL/04_LANDING/LANDING_CONTENT_AND_MOTION_BLUEPRINT.md` and `LANDING_SECTION_SPEC_TABLE.md`. Homepage H1: "Find your kind of people." Support: "Friendship, dating, and marriage-minded connections—on your terms. Discover people through thoughtful questions and transparent comparisons." Hero CTA: "Start with a few questions"; secondary: "See how matching works". Below-fold: 3 modes; matching steps; real limitations; fictional interactive comparison; assessments; diverse photo story; privacy & safety; pricing; FAQs; languages; footer.

## Complete public route content
`/`, `/how-it-works`, `/friendship`, `/dating`, `/matrimony`, `/assessments`, `/trust-and-safety`, `/pricing`, `/about`, `/contact`, `/help`, `/accessibility`, `/privacy`, `/terms`, `/cookies`, `/community-guidelines`, `/refunds`, `/grievance`, `/data-rights`, `/status`, `/404`, `/500`, `/503`. SEO canonical, JSON-LD only for true organization facts; OG cards without member faces; sitemap excludes private account routes. Error pages include useful back / contact / report, no fingerprinted internal stack traces.

## Locale rules
Launch proposals: English, Hindi and Tamil only after reviewed translations; full architecture for Telugu, Malayalam, Kannada, Bengali and additional international languages. Locale catalogs separate content, datetime, currencies, currencies and jurisdictional legal copy. Do not claim a locale is live until native usability tests pass. Save RTL compatibility and content expansion. Avoid political, caste, religious or gender stereotypes in names and photography.

## Tone by surface
Marketing: warm and truthful. Auth: reassuring and concise. Quiz: calm/no judgement. Match explanations: factual, coverage-led. Errors: specific next steps. Billing: transparent, predictable. Admin: operational/neutral. Complaint: safety-first, no animation or marketing.

## Copy QA acceptance
Every public page has copy owner, approved locale string, legal reviewer if applicable, meta title/description, 404/offline alternative and screenshot. Prohibit legal copy delivered only via unreviewed machine translations. Audit links quarterly; compliance dates verified against official notices.


---

> **Reference:** `03_BEHAVIOR/MATCHING_RD_Deterministic_Psychometrics.md`

# MATCHING-RD — Deterministic Questionnaire, Scoring, Complementarity & Simulation

## Non-negotiable distinction
This engine compares stated, versioned questionnaire responses according to explicit mathematical/logic rules. It is **not** an AI twin, a human brain replica, an accurate predictor of specific future behavior, a clinical diagnostic tool, or a scientific guarantee of marriage success. It must not infer and publish concealed sexual orientation/religion/health or other intimate characteristics. Inputs to sensitive filters should be purpose-specific and voluntary, with default private.

## Question bank
12 proposed themes, each with A/B sets of 100 **placeholder** item IDs until ethically reviewed instruments and writing are approved: communication, values & priorities, emotional regulation, social rhythms, boundaries & privacy, conflict & repair, trust & reliability, life plans, interests & learning, routines & lifestyle, community & collaboration, compatibility preferences. Each item: stable ID, canonical theme, edition, locale, reverse-scoring flag, evidence/consent classification, estimated time, active interval, scoring dimension map, validation history, content review date and retirement migration. Bank publish lifecycle DRAFT → editorial review → science/legal review → approved → published/immutable; older results remain pinned to past versions. Item order randomized per user-session using server-produced seeded permutation; can retake through new session. "Never the same questions" across everyone is neither guaranteed nor desirable for comparability; avoid promising uncheatable assessments. Server detects impossible timing and inconsistent responses **without diagnosing deception**.

## Required testable scoring process
1. Validate adult status, account, mode consent, published item-bank version and session token.
2. Reject duplicated/out-of-set answers, enforce per-item explicit skip, save atomically and idempotently.
3. Normalize approved answer types with dimension-specific keyed scoring; support reverse-keyed items (only after reviews).
4. Aggregate by theme/dimension with fixed weights from immutable `scoring_version`. Null/missing remains missing, never treated as neutral.
5. Compute coverage = weight of mutually answered comparable items / total applicable weight. If below threshold (policy configurable), show `Insufficient information`; do not invent a score.
6. Similarity (Echo): for each comparable dimension d, `s_d = 1 - abs(a_d - b_d) / dimension_range` (clamped 0–1). Weighted score = 100 × Σ(w_d × s_d) / Σ(w_d). Round only at display; store method/version.
7. Counterpoint: use explicit approved difference lens `100 × Σ(w_d × (1 - s_d)) / Σ(w_d)`; not a preference rank or quality judgement, requires mutual opt-in and respectful copy.
8. Mosaic Fit: complementarity is a distinct versioned **rule table** e.g. member A prefers planning and member B prefers spontaneity *and both permit that difference*. Award when rule predicates and **both** preference constraints hold; do not assume all opposites attract. Return matched rule identifiers and contraindications.
9. Eligibility gates run before scoring/ranking: reciprocal mode consent, user preference boundaries, block/report restrictions, geography/age if applicable, profile discoverability, minimum assessment coverage; no cross-mode leak.
10. Display breakdown, coverage, model version, key aligned dimensions, gaps/uncertainties, plain-language interpretation, options to retake/withdraw; never show confidential raw answers by default.

## Hypothetical deterministic "behavioral simulation"
Simulations are rule-based *if-then scenario explorers*: e.g. hypothetical scheduling disagreement uses publicly disclosed response preferences and shows **possible** communication friction, not what an actual person will do. Scenario templates are reviewed, deterministic for given versions/inputs, and transparent about assumptions and what the model cannot know. User controls whether any scenario summary is shown to matched partner. No synthetic agents conversing, generated psychological replicas or LLM inference costs.

## Fairness & sensitivity
Avoid caste, religion, health, sexual orientation inference via proxy questions. Preserve opt-in where certain mode preferences are legally permissible, and prohibit discriminatory ranking not justified by user choice. Compare outcome by region/language/gender only with privacy and sufficient sample protection; optimize explainability and detect scoring biases. No "score of a person's worth" labels. Independent behavioral science review recommended before psychometric accuracy claims.

## Versioning / reproducibility
Each score record stores `assessment_version`, `scoring_version`, mode, subject pair, timestamp, comparable-dimensional hash, rule matches, coverage and explainability payload reference. If rules change, old results remain auditable; rescore asynchronously with a logged migration reason. Deterministic equality across Cloudflare D1 and PostgreSQL is mandatory: identical fixtures, rounding, Unicode, null treatment, tie-break sorting.

## Acceptance fixtures
- identical input and versions → identical complete result in Cloudflare and Node runtime; fuzz 1000 generated profiles.
- swapping A and B → Echo symmetric; complementarity may be directed only where explicit.
- no common answers → no score (not 0%).
- explicit mode pause/block/consent withdrawal removes discovery in both runtimes, including cached pages and notifications.
- rules and evidence version changes documented; explainability is reproducible.
- a 100 displayed means agreement on **measured comparable dimensions**, NOT 100% real-life compatibility.


---

> **Reference:** `08_BILLING_FINANCE/BILLING_RD_Unified_Pricing.md`

# BILLING-RD — Unified Membership and Mode-Neutral Entitlements

## "Big cat / small cat" decision
Kithra must not charge separate core membership prices just because one member seeks friendship and another seeks matrimony. **One account, one Free/Plus/Connect subscription, benefits usable in every opt-in mode.** Separate charges only for genuinely delivered third-party/real-human services, not for access to valuable people. No VIP access to high-agreement matches. Core consented discovery, post-mutual-acceptance messages, blocks/reports, rights and support remain free.


- **Free** — **1 mo:** ₹0; **3 mo:** ₹0; **6 mo:** ₹0; **12 mo:** ₹0; **Benefits:** Assessments, consented discovery, invitations, eligible mutual messaging, Circles, safety, rights
- **Plus** — **1 mo:** ₹149; **3 mo:** ₹399; **6 mo:** ₹749; **12 mo:** ₹1,399; **Benefits:** richer explanations, more filter convenience, increased introduction/compare usage
- **Connect** — **1 mo:** ₹249; **3 mo:** ₹699; **6 mo:** ₹1,299; **12 mo:** ₹2,399; **Benefits:** Plus + deeper side-by-side comparisons, curated circles and higher convenience limits


**All figures provisional** and not proven profitable. Original older ₹299 Connect and separate ₹399 Matrimony Intent are superseded by Hermes unified recommendation, subject to founder final approval. Do not silently increase plan rates. Display exact benefits only if implemented; never sell badges/verification before provider live.

## International proposals
Regional price book, purchasing power/local research rather than straight USD→INR, country tax treatment, payment currency support and refund rules. Possible research price bands Plus ~€7–9 EU/UK, ~$8–10 US/CA and local India ₹149; **not approved**. No publishing speculative comparisons with competitors as facts.

## Entitlement service
`getEntitlements(userId,planVersion,atTime)` returns typed feature flags and quotas, with 0 means not available and null means unlimited as documented. Store `plan_version`, `status`, currency, billing interval, merchant provider, future effective date and region. Every read and write consults authenticated entitlement context but may not use plan to authorize personal safety or baseline messaging. Paywall banners never obstruct report/block or account deletion. Provide downgrade semantics and grace window.

## Checkout UX
Plan grid Free first, comparison per mode, monthly/quarterly/semiannual/year switch, annual savings mathematically accurate (no fictitious strike-through), tax/fees shown, renewal disclosed, authorization step, 3DS/UPI where available, webhook-based entitlement grant. State machine created→pending→paid→active, failed→retry, canceled→nonrenew, refunded/chargeback→policy; duplicate callbacks idempotent. Subscription renewal notification and one-step cancellation. Receipt/invoice download, payment method changes, proration and dispute handling.

## Add-ons
Optional consented curated activity (actual venue/event organizer and fee), human-assisted introduction for matrimonially oriented members (real assigned trained staff and contract), optional real ID review (legitimate provider, transparent privacy cost) only after legal/merchant approval. Add-ons are not substitutes for basic safety.

## Acceptance
Free member sees and can accept eligible matches in all enabled modes. Paid member does not unlock secret high match. Full user journey: start plan, provider failure, webhook duplicate, receipt, upgrade, downgrade, renewal, partial refund, chargeback, nonrenewal and membership expiration with no orphan access. Tax/accountant signoff before launch.


---

> **Reference:** `08_BILLING_FINANCE/FIN_RD_Sustainability_and_Costs.md`

# FIN-RD — Complete Financial Requirements (No AI Inference)

## Model principles
AI/LLM/twin/embedding costs are **exactly zero** by product design, unless the founder changes scope in a new signed contract. Costs depend on active users, photo storage, messages, DB rows and operational risks; registered count alone is not a billing meter. Build a 60-month P&L, cash flow, founder salary and runway with pessimistic/base/optimistic scenarios and deployment comparison. Price/tax and costs must remain editable and source-linked.

## Cost centers
1 Cloudflare minimum and overages: Workers requests/CPU, D1 rows/storage and per-db cap, Durable Objects connection duration/requests, R2 storage/Class A/B operations, Queues/Cron. 2 Server: VPS/containers, PostgreSQL/backup/PITR, Redis, object storage, traffic/CDN, monitoring, Jenkins agent/registry. 3 Firebase/Identity Platform MAU, MFA, optional phone OTP, email/SMS provider and abuse prevention. 4 Razorpay/merchant percentage and fixed fees, currency conversion and chargebacks. 5 media moderation provider/human review, support, grievance response and incidents. 6 founder salary, engineering, DevOps, security, design/content, translators, counsel, accounting and insurance. 7 marketing/CAC/retention, taxes (including GST based on applicability), depreciation/capitalized product build, working capital and emergency reserves.

## Proposed scenario axes
Registrations: 100, 500, 1,000, 5,000, 10,000, 100,000. MAU %: 10/30/50. Paid conversion of MAU: 1/3/7%. Blended realized subscription ARPPU ₹100/₹200/₹400 excluding tax as appropriate. Founder salary ₹0/₹25k/₹50k/₹100k monthly. Moderation tickets per 1000 MAU and cost/ticket ₹15/₹40/₹120. Hosting options Cloudflare paid, one VPS, scaled server. Show sensitivity ranges, not a point prediction.

## Illustrative example only
5,000 registered × 30% MAU = 1,500 active, ×3% paid = 45 paid, ×₹200 blended realized ARPPU = ₹9,000 gross subscription revenue/month before refunds/payment/tax. A scenario with ₹50,000 founder compensation and staffed moderation/legal can lose substantially more than the Cloudflare infrastructure fee. Past estimate of roughly ₹577 Cloudflare/month and roughly ₹1.26 lakh full company cost at 5k registrations were **hypothetical workload/budget models**, not vendor quotes.

## Monitoring
Per active user capture API calls, DB rows read/written, GB stored and media ops, messages/user-day, DO connection-minutes, queue jobs, SMS sends, failed payment rate, refunds, report rate, support time, cost per paying member. An event's privacy-safe cost tag must not contain user content. Reconcile invoice to allocation monthly. Alert on cost-budget utilization thresholds, billing failures, unusually high abuse costs.

## Break-even logic
`Contribution per paying user = net realized ARPPU - processing/refunds/usage-variable cost`; `monthly operating surplus = paying_users*contribution - fixed salaries/ops/legal/marketing - unpaid-user variable cost`. Scenarios by month, plan mix, payback period, CAC, churn, lifetime, hosting strategy. Show cash burn/runway and taxes separately from contribution. Don't conflate corporate profit with founder take-home.

## Procurement decisions
Architecture choice should be driven by measured use and operations expertise; free-tier is not a compliance/security waiver. Server may look cheaper per unit yet cost more through maintenance, backup, failover and incident staffing. Cloudflare may be economical at moderate traffic but R2, DO, email and auth can dominate under media-heavy usage.

## Release commercial gate
Final prices and international availability require founder approval, accurate taxes and payment integration, contractual refund policy, valid merchant credentials and monitoring. Forecasts must label sources and assumptions; no market-size or revenue numbers invented. For 5-year workbook, the build team should link actual invoices after launch and preserve last forecast as an immutable version.