# Kithra Billing Finance Legal and Handover

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


---

> **Reference:** `06_SECURITY_LEGAL/LEGAL_COMPLIANCE_RD_India_Global.md`

# LEGAL/COMPLIANCE-RD — India DPDP, IT Intermediary, Global Expansion

**NOT legal advice.** The policies and checklists here are drafting instructions, not immunity from Indian or other laws. Qualified counsel must issue applicable-law matrix and final signoff before production. Research checked 1 November 2026.

## India DPDP phased commencement
Official Gazette (13 Nov 2025) schedules some sections at publication, selected consent-manager-related sections after one year (13 Nov 2026), many substantive notice/consent/data principal rights/security provisions after 18 months (13 May 2027), absent later amendment. Source: https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025%3B and https://indiacode.ecourtsindia.com/rules/enforcement-timeline-for-the-dpdp-act-e1be0965/ . Existing legal duties, including SPDI Rules 2011 where applicable, continue; do not claim DPDP compliance simply due to future dates. Implement future-ready notices, consent, security, withdrawal, rights and breach workflows now.

## Required privacy operations
- Data map by purpose, lawful basis, processor, storage region, retention, transfer path and member rights; per-mode active consents separate from generic ToS acceptance.
- Plain and standalone notices at collection; no dark patterns, bundling unrelated consent or forced intimate disclosures.
- Access/correction/erasure/withdrawal/grievance flows and deadlines from applicable statute; test fulfillment via actual backend and R2/backup lifecycle.
- Strong safeguards, incident detection and defined communications; vendor contracts and transfer analysis.
- Adults-only 18+ launch and age assurance proportionate to actual risks; no child profiles or family-registered minors.
- Identity verification and biometric collection only after provider/legal assessment; "verified" badges disabled until real provider live.

## Intermediary, harmful content and grievance
The Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, as amended in 2026, may impose duties depending on Kithra's precise classification and features. Confirm applicable complaint-response, urgent intimate-content, impersonation, content take-down and designated officer obligations from official notifications; build configurable SLA timers and dedicated escalation. Do not hardcode timelines from a blog without counsel validation. Public grievance contact must use a real staffed mailbox/role.

## International expansion
A region-by-region launch matrix is mandatory. For EU/UK assess GDPR/UK GDPR legal bases, transparency, sensitive data and consent, transfers, data subject rights, cookie consent, DSA where applicable, age assurance, online safety. For US assess state privacy laws and auto-renewal rules; for other markets consider consumer payments, local language, age restrictions, content moderation and cross-border data. Do not assume Indian consent notice satisfies all territories. Gate territory availability until signoff. Brand trademark, photo licensing, identity/data processor terms and marketing claims are local legal concerns.

## Applicable business/consumer rules
Subscription checkout: clear total including taxes and payment provider fees if applicable; recurring consent/cancel; local auto-renew, Consumer Protection Act/unfair trade practice, refunds/chargebacks. Payment data minimized; Razorpay webhooks authenticated, ledger reconciled. Advertising cannot advertise "100% soulmates", secret psychological inference or exact future behavior. Respect caste/religion/sexuality-related anti-discrimination and special privacy context; no hidden profiling.

## Counsel-ready deliverable checklist
Legal entity/contact, DPO/grievance details where required, purpose-by-purpose privacy notice, ToS, Community Rules, Cookie Policy, Refunds/Cancellation, Verification policy, Photo consent/license terms, Data Retention and Breach policy, Rights workflow, Processor register, International applicability matrix, Incident notification decision tree, Staff training, evidence preservation, age assurance, subscriptions. No template is legally "airtight" without actual operations and legal review.

## Source-of-truth status
The Hermes archive `13_RESEARCH_ORIGINAL/08_SAFETY/LEGAL_DEPENDENCIES_TO_REVIEW.md` flags the same unknowns. Source evidence files are research, not final law. Recheck official law and exact provisions shortly before shipping.


---

> **Reference:** `06_SECURITY_LEGAL/DRAFT_TERMS_PRIVACY_COMMUNITY.md`

# Legal copy set — DRAFT ONLY, replace placeholders after counsel review

> These drafts are starting points, not publishable legal terms. Replace `[LEGAL_ENTITY]`, `[ADDRESS]`, `[CONTACT]`, `[EFFECTIVE_DATE]`, `[COUNTRY_LIST]`, `[RETENTION_SCHEDULE]`, `[PROVIDER_LIST]`, and all missing statutory details. Legal review required. No document makes Kithra immune from law.

## Draft Terms of Service — outline and clauses
**Eligibility.** Kithra is intended for persons aged at least 18. Users must provide accurate lawful details and may activate Friendship, Dating, Matrimony separately. We may restrict access where reasonably necessary for safety or law, with an appeal route where appropriate.

**No guarantee.** Kithra provides introductions and deterministic comparisons of voluntarily supplied responses; any percentage is not a probability of love, marriage or future behavior, and should not be relied on as professional psychological or legal advice. Members choose whom to contact and whether to meet.

**Safety.** No harassment, stalking, impersonation, financial scams, unsolicited sexual content, hate, CSAM, doxxing or coercion; no collecting another member's personal details without consent. Members may block/report free. Do not meet someone if uncomfortable; follow public-place safety guidance. Emergency situations require appropriate local emergency services, not routine support.

**Member content.** User retains rights in their own content but grants `[LEGAL_ENTITY]` a limited license to operate the service under settings and privacy choices. No public marketing use of member images without separate specific consent. Respect third-party rights. Removal/review may occur under published safety policy and law, subject to notice/appeal where applicable.

**Subscriptions.** Present plan, taxes, features, renewal, cancellation and applicable refund policy clearly before purchase; cancel and refund process governed by the displayed local policy. Core safety and data-rights features are never subscription-only. Do not promise verified match outcomes or availability of local community.

**Data and liability.** Refer users to separate Privacy Policy and applicable mandatory rights; specific limitation-of-liability, dispute and governing-law clauses must be drafted by local counsel and cannot waive mandatory statutory protection.

## Draft Privacy Notice — scaffold
**Controller.** `[LEGAL_ENTITY, CONTACT, GRIEVANCE OFFICER]`. **Categories.** Identity/contact/session data; selected mode and declared preferences; uploaded photos; optional assessment responses and derived dimensions; conversations (access-restricted); payment status and invoice; safety and complaint records; technical logs. **Purposes.** Account/security, requested introductions and mode-specific discoverability, messaging and Circle management, payments, safety/moderation, support, rights handling and required recordkeeping. Explain legal basis by market and separate optional choices.

**Visibility.** Each Friendship/Dating/Matrimony mode has independent consent, display controls and photo permissions. Raw assessment answers are private by default; only consented summaries are shared where appropriate. No targeted ads based on intimate answers; no hidden inference of sexuality/religion/mental health. **Recipients.** Only contracted processors `[PROVIDER_LIST]` and legally required disclosures; specify locations and safeguards. **Rights.** Request access, correction, withdrawal, portability/export or deletion where required; some data may be retained if lawful. **Retention.** `[RETENTION_SCHEDULE]` with deletion mechanics and backups. **Security and contact.** Describe implemented controls, not hypothetical encryption claims. **Children.** Adults only; handle suspected minors through established safety policy. **Breaches.** Notify affected persons/regulators as law requires.

## Draft Community Standards
Treat others respectfully. Obtain consent before intimate messaging, sharing photographs or arranging meetings. Prohibit blackmail, harassment, stalking, hateful conduct, sexual exploitation, impersonation, non-consensual intimate images, financial solicitation scams, spam, off-platform coercion and manipulation of reports. Member may block/report free; case IDs, appropriate response, appeals and emergency reporting path are published. Moderation sanctions include warning, content removal, temporary restriction or suspension, with proportionate review and appeals.

## Draft Refunds and Cancellation
Cancellation must be available in account billing UI without contacting support. Renewal date, current billing period, any trial expiry and next charge should be displayed. Refund eligibility depends on payment rail, country and applicable consumer law; no blanket `all sales final` promise. Automated retries must not create duplicate charges. For purchased human services/event tickets, explain actual supplier, fulfillment, cancellation and refunds separately.

## Draft Cookie and Communication Notice
Describe strictly necessary sessions and security, optional analytics/marketing cookies by region, clear settings, no pre-checked consent when invalid; record opt-in/opt-out. Non-transactional notifications optional with unsubscribe. A cookie notice cannot substitute for the platform's privacy/consent system.

## Required legal review status fields
`draft_owner`, `jurisdictions`, `version`, `reviewed_by`, `effective_from`, `published_url`, `source_law_checked_at`, `translation_reviewed_at`. Never ship blank placeholders.


---

> **Reference:** `11_AI_STUDIO/START_PROMPT.md`

# GOOGLE AI STUDIO — EXACT FULL-PRODUCT BUILD INSTRUCTION

You are the lead full-stack engineering, UI/UX, QA, security, DevOps and product implementation team for **KITHRA**. You have access to an imported PRIVATE GitHub repository containing `Kithra_Google_AI_Studio_Full_Product_2026`.

## Read first, then act
1. Read `00_READ_FIRST/README.md`, `00_READ_FIRST/DECISIONS_AND_CONFLICTS.md`, `00_READ_FIRST/MASTER_CONTROL_SPEC.md` in their entirety.
2. Read *every* dedicated document in folders 01–10 and `12_REGISTERS/SCREENS.csv` + `REQUIREMENTS.csv`.
3. Read the original Hermes evidence in `13_RESEARCH_ORIGINAL/` and its mockups in `14_PROTOTYPES/`. Evidence is not the governing product spec; do not silently substitute historical project artifacts or old palettes.
4. Produce `IMPLEMENTATION_PLAN.md` with every requirement ID, route, API, data entity, UI state, test and two runtime deployment tasks; flag conflicts/unknowns without dropping features.

## Scope rules
THIS IS THE FULL PRODUCT, NOT AN MVP. Implement complete Friendship, Dating, Matrimony, deterministic 100-question banks, transparent Echo/Counterpoint/Mosaic comparison, rule-based scenario explanations, mode isolation, member/profile/photo experiences, messaging/Circles, unified Free/Plus/Connect billing, privacy/support/safety, all public/error/auth screens and full admin dashboard.

No AI twins, LLM matching, prediction of human future actions, embeddings, vector DB, or AI runtime in Kithra. Do not implement disguised sexual orientation or other intimate trait profiling. Compatibility numbers are deterministic AGREEMENT INDICES with coverage/version, not soulmate probabilities.

Keep one monorepo and equal functional scope on Cloudflare Workers/D1/R2/DO/Queues and Docker/Node/Postgres/Redis/BullMQ. Implement port interfaces, separate SQL migrations and parity tests. Never replace target architecture just because AI Studio preview runs on Node or Cloud Run. Do not claim a working deployment without testing target resources.

## UI/UX rules
Provisional palette D2 Ink & Clay and its semantic **light+dark** tokens are in `13_RESEARCH_ORIGINAL/03_BRAND/design-tokens.json` and `.css`. Founder hasn't approved final palette; provide D1/D5 alternatives on same 3 demo screens so choice can be made. Fraunces+Inter+locale Noto are provisional. Build editorial landing with real-consented/licensed imagery, accessible sign-in/recovery, age and mode consent, photo crop/privacy per mode, assessments, matches, Messages, Circles, support/settings, privacy rights, all HTTP error pages and separate dense admin UI. Use `motion/react` variants exactly within budget; reduced motion mandatory. Show original copy and disclosures, no invented live statistics/testimonials/verified badges.

## Required process — NO FAKE PROGRESS
For each module: (a) reference requirement IDs and source files, (b) implement real TS/React and backend code, (c) migrations with fixtures, (d) unit and E2E tests incl negative/privacy cases, (e) screenshot light/dark responsive, (f) verify on both runtimes or mark deployment unverified, (g) update `12_REGISTERS/BUILD_PROGRESS.csv` or equivalent with truthful `planned/in_progress/implemented/tested/deployed/blocked` status. A green UI, fake provider or mock data is NOT 'done'.

## Engineering execution order (sequencing only; scope unchanged)
1. Repo/workspace, design tokens, i18n, routes/errors and storybook/design visual comparators.
2. Identity/session/MFA staff, age, per-mode consent; user security boundaries and full auth screens.
3. Profiles/media R2+S3 adapters, signed permissioned images, photo UI and safety review.
4. Questionnaire publishing, answer lifecycle and deterministic scoring with property tests.
5. Per-mode discovery, three matching lenses and explainable profile comparisons.
6. Requests, DMs/realtime and Circles/community/messaging abuse controls.
7. Unified billing/receipts/subscriptions/cancellation/refunds and plan entitlement service.
8. Full admin queues, RBAC, evidence, appeals, support, compliance and privacy requests.
9. Complete responsive theming/animation/l10n, legal/public/error/status pages and all states.
10. GitHub Actions, Cloudflare and Docker/Jenkins deployment, parity, a11y, stress, monitoring, incident and restoration rehearsal.

**Important**: do not reclassify steps 6–10 as 'future' or optional. Only completed after testing. Never remove full-product scope due to response length limits; commit in logical batches and maintain ledger.

## Production acceptance
All IDs in `REQUIREMENTS.csv` passed; all screens in `SCREENS.csv` implemented and tested (normal/empty/loading/error/permission/offline); zero cross-mode data leaks; admin MFA and denial tests; matching parity D1/PG; payment webhooks verified; exported/deleted data verified; moderation SLA and on-call; light/dark a11y; performance budgets; tested deploy and rollback both targets; human review of legal/commercial/brand decisions. If unavailable access/tool/provider, mark blocker in `OPEN_DEPENDENCIES.md` with exact evidence and next step, not fake implementation.

## First response required
Before coding, return: a concise file inventory, 10 most significant conflicts or blockers, proposed monorepo tree, route counts, 10 initial milestones with complete scope retained, current brand signoff status, and exact files you will generate in the first change. Then begin executing the first stage in this environment; do not ask to reduce to MVP.


---

> **Reference:** `11_AI_STUDIO/RESEARCH_GAPS_AND_SIGNOFFS.md`

# Unresolved research & human signoffs (do not make up answers)

- Founder visual identity: compare D2 Ink & Clay, D5 Forest & Sand, D1 Sunlit Humanist using same landing, sign-in, member card and admin dashboard; D2 is recommended only, not approved.
- First-user preference testing India + at least one international market; past Reddit summaries have blocked full-text retrieval and Pinterest inspirations cannot establish market preference.
- Full production copy approved in Hindi/Tamil and additional launch locales; language support alone isn't localized research or compliance.
- Psychometric validity of question instruments, construct definitions, reverse-scoring, fairness, stability, explanatory claims. Until reviewed, retain placeholders and disable claim-rich results for real members.
- Adult identity assurance provider, actual MFA provider and cost, email/SMS deliverability contracts; no fake identity badge.
- Safety moderation staffing and legal response windows by applicable Indian intermediary category and international geographies.
- Legal counsel review of 2025 DPDP notification and 2026 intermediary changes, SPDI, CERT-In, consumer/subscription, privacy/terms, account deletion, processor agreements, cross-border risks.
- Payment provider acceptance, GST, localized international VAT and refunds; subscription price validation and cost sensitivities.
- Data residency/Cloudflare resource locality and processor policies; independent security review.
- Real photography licences/consent and community content rights; do not scrape Pinterest imagery for production use.
- Budget and hosting capacity under actual usage, paid cloud services and staff salaries; full 60-month financial forecast with quotes.
- CI and deployment accounts required: GitHub, Cloudflare, Firebase/Identity Platform, email/SMS, Razorpay, Docker registry, Jenkins, monitoring, DNS and incident channel.

For each gap report owner, evidence needed, risk, latest decision, expiry/recheck and go/no-go effect. Don't fill blanks with guesses.