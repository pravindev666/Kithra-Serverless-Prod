# Kithra Architecture Data Security DevOps QA

**Kithra full-product handover · 1 November 2026 · For developer/designer implementation and legal review**



---

> **Reference:** `04_ARCHITECTURE/ARCH_RD_Dual_Deployment.md`

# ARCH-RD / SYS-RD — One Full Product, Cloudflare + Server Deployments

## 1. Architecture invariants
Shared: React 19 + strict TS + Vite + Tailwind CSS + Motion `motion/react`; Hono route handlers, Zod-like validation, OpenAPI, domain events, scoring as pure functions, canonical permission policies, auth token verification, common UI package and tests. Environment-specific modules implement repositories, transactions, object store, bus/queue, websocket rooms, configuration, scheduler. Infrastructure is selected at process start, never sprinkled through domain logic. Every feature must exist in both deployment targets and pass a parity suite.

## 2. Target A: Cloudflare
`Workers Static Assets` hosts responsive web+admin bundles where supported; standalone Pages alternative allowed with parity tests. `Workers` Hono API verifies Firebase/Identity Platform JWTs; D1 SQLite for relational entities, R2 *private* for photos and exports; Durable Objects for conversation coordination and WebSockets; Queues for media scanning, notification, scoring and rights jobs; Cron Triggers for retention/expiry/reconciliation; Analytics/Logpush/structured observability. Use Turnstile or comparable abuse defense on high-risk public forms, appropriately logged. No oversized raw transcripts in D1; store small normalized answers with indexes and R2 only for necessary protected files. D1 paid/free limits verified per current official docs at release. Avoid public R2 custom domain for private media.

## 3. Target B: Docker/server
Nginx or Caddy TLS + static frontend; Node Hono API; PostgreSQL authoritative SQL with migrations and connection pool; Redis as ephemeral event/pubsub/rate-limit/queue backend, not sole authoritative chat store; BullMQ workers, WebSocket gateway with session/authz, S3-compatible private object storage (R2 allowed) and scheduler. Docker Compose for dev/staging/single host; actual production HA requires managed DB or multi-node replication, Redis persistence/HA, monitoring and distributed backups. Jenkins handles server pipeline, GitHub Actions validates and triggers reviewed deploys. Container secrets via secret manager/env injection, never committed .env.

## 4. Shared monorepo
```
apps/web/                public + member React app
apps/admin/              separate staff React app, isolated build and host
apps/api-worker/         Cloudflare Workers Hono entry
apps/api-node/           Node.js Hono entry
apps/jobs-worker/        Cloudflare Queue handlers
apps/jobs-node/          BullMQ workers
packages/contracts/     OpenAPI + validated request/response types
packages/domain/        pure business entities/events/policies
packages/matching/      deterministic calculations + fixtures
packages/repositories/  abstract storage + SQL adapters
packages/auth/          identity verification and permissions
packages/media/         upload/media policy and renditions
packages/realtime/      conversation event contract
packages/ui/            component library + accessibility
packages/design-tokens/ semantic light/dark tokens
infra/cloudflare/        wrangler, D1 migrations
infra/docker/            compose, Caddy, Dockerfiles, Jenkins
infra/postgres/          PG migration scripts
.github/workflows/       lint/test/scan/deploy
```

## 5. Adapter interfaces
`IdentityService.verifySession`, `RoleService.authorize`, `UserRepository`, `ConsentRepository`, `AssessmentRepository`, `MatchRepository`, `ConnectionRepository`, `MessageRepository`, `ModerationRepository`, `BillingRepository`, `BlobStore.putAuthorized/getAuthorized`, `RealtimeHub.publish/subscribe`, `JobPublisher.enqueue`, `TimeProvider`, `TransactionUnitOfWork`. No direct `env.DB` in React UI; no direct Cloudflare SDK in matching. Implement both SQLite and PG with contract tests for nulls, booleans, collations, uniqueness and serializable business transitions.

## 6. Messaging semantics
Persist message first in authoritative DB, then publish ordered delivery notification to DO (Cloudflare) or WS/Redis (server). WebSockets are transports, not historical record. Conversation ID + monotonic sequence; idempotent send key, attachment authorization, block gate at send/read time, retries and DLQ, rate limiting. No unsupported E2EE claims. Unauthorized users must not subscribe to room names; disconnect and revoke access upon block/mode pause.

## 7. Security boundaries
Member browser cannot access D1/PG, R2 credentials, Queue tokens or raw staff endpoints. API verifies claims and role scopes. Admin lives on isolated `staff` host/subpath with MFA (base Firebase alone may not supply MFA), strict CSP/security headers, step-up for irreversible action and audited RBAC+ABAC. Audit storage logically append-only, tamper-evident hash chain if implemented and verified, not simply a UI label. PII in logs forbidden. All secrets rotated and audited.

## 8. Portability and cutover plan
Create parallel PG schema with explicit data transformations; run canary read parity; export consistent D1 snapshots/UTC IDs; transform SQLite integers/booleans/dates and text collations; bulk import PG; reconcile row counts + sampled hashes + media object inventories; pause writes for final CDC/cutover or implement proven dual-write with conflict controls; switch API endpoint+events using feature flag; keep reversible read-only D1 and backups; rehearse rollback including payments and queued messages. A "toggle" cannot provide instant zero-downtime switch automatically.

## 9. Cost/scale and limits
Workers Paid minimum $5/month subject to official terms, D1 free max 500MB/db, D1 Paid max 10GB/db as of official 2026 documentation; per-invocation query limits and R2/DO operations are more important than registration count alone. At 5,000 registered, 1,500 MAU and low media usage, Cloudflare bill could remain small but no guarantee. Monitor row reads, DO durations, R2 storage & requests, Queues, paid authentication, emails/SMS, moderation and legal work separately. Scaling to 100k needs realistic per-user workload and load test.

## 10. CI, deploy, rollback
Each PR: format/lint/TS, unit/property, database migration tests SQLite+PG, OpenAPI validation, integration E2E, dependency/secret scanners, accessibility regression, SAST. Staging preview on both platforms. Prod release requires protected branch/environment, signed artifacts, approved migrations, backups, canary smoke and rollback runbook; payment and moderation production smoke uses safe test accounts only. Deploy train and emergency hotfix policy documented.


---

> **Reference:** `05_DATA_API/DATA_RD_Privacy_Schema_and_Migrations.md`

# DATA-RD — Logical Data Model and Cross-Database Contract

## Logical entities
Identity: users, sessions, age_assertions, mode_enrollments, user_mode_preferences, mode_consents, user_profiles, field_visibility, user_blocks, user_mutes. Assessments: question_banks, questions, item_translations, scoring_versions, assessment_sessions, assessment_answers, pattern_scores, match_results, complementarity_rules, score_explanations. Interactions: connection_requests, connections, conversations, conversation_members, messages, message_receipts, circles, circle_members, circle_posts, notifications. Media: media_assets, photo_visibility, media_moderation, media_access_grants. Commerce: plans, plan_entitlements, subscriptions, invoices, payments, refunds, webhook_events. Operations: reports, moderation_cases, case_evidence_access, appeals, support_tickets, grievances, privacy_requests, audit_events, admin_memberships, admin_role_grants, outbox_events, idempotency_keys. **Every subject row includes timestamps, content retention class and deletion linkage where relevant.**

## Data classification and access
Public marketing vs profile fields vs restricted assessments vs highly restricted raw responses and reported content vs secret credentials. Every read enforces tenant/account/mode/resource boundaries; moderators do not browse raw answers; staff evidence is case-scoped with reason and time-limited grant. Profiles are `noindex` by default and photos are private. If users request data deletion, delete/transform dependent records in a defined order; legal holds represented and audited. Backups must have expiry and restoration-deletion reconciliation. Never store raw payment-card data.

## Portability contract
D1 SQL uses SQLite semantics and string UTC timestamps; PG uses timestamptz, native UUID where appropriate and constraints. For both: document normalization and indexes; make match materialization cache-invalidatable on consent/block/quiz version changes. Enforce foreign keys on D1; model ON DELETE behavior carefully for evidence/retention; no blanket CASCADE legal records. PG parity tests must exercise same application contracts. Migrations are numbered, reversible where possible, transactional if supported and checked in CI.

## Minimum indexes
`users(email_hash)`, `mode_enrollments(user_id,mode,status)`, `user_profiles(mode,user_id,visibility)`, `assessment_answers(session_id,item_id)`, `pattern_scores(user_id,mode,version)`, `connection_requests(to_user,status)`, `messages(conversation_id,sequence)`, `reports(status,priority,created_at)`, `moderation_cases(assignee,status,deadline)`, `audit_events(actor_id,occurred_at)`, `webhook_events(provider,event_id UNIQUE)`, `media_assets(owner_id,state)`, `subscriptions(user_id,status)`.

## Events and idempotency
`assessment.submitted`, `score.ready`, `mode.paused`, `connection.accepted`, `message.created`, `photo.submitted`, `report.created`, `privacy.export_requested`, `privacy.delete_requested`, `payment.webhook_verified`, `subscription.cancelled`, `admin.action_performed`. Persist outbox entry and primary write atomically or document consistency. Consumer deduplication and bounded retries. Never log raw answers or media bytes.

## Migration tests
Create/increment schema SQLite and PG, seed deterministic fixtures, compare constraints, upsert/idempotency/transaction semantics; export D1 into PG staged import; compare counts, checksums and privacy permissions. Failed migration must abort app deploy, and rollback must be rehearsed. `16_SCAFFOLD` provides schematic starter artifacts but does not claim deployment readiness.


---

> **Reference:** `05_DATA_API/API_RD_and_Event_Contracts.md`

# API-RD — Resource Endpoints, WebSocket and Event Semantics

## Global requirements
API prefix `/api/v1`; JSON UTF-8; session verified server-side, CSRF protection for cookie-authenticated writes, appropriate CORS; `Idempotency-Key` on mutation where replay dangerous; `X-Request-ID` round-tripped; `application/problem+json` for errors, `code` stable, `detail` user-safe; cursor pagination, max page size and consistent ordering. No auth/age/permission leak via 404 vs 403 for private profiles. Content-type and object size validation.

## Public
`GET /health/live`, `/health/ready` authenticated internal as needed; `GET /public/config`, `/public/pricing`, `/public/matching-explainer`, `/public/locales`; `POST /contact` with bot defense. Marketing no personalized member API.

## Identity & member
`GET /me`, `PATCH /me`, `POST /me/sessions/revoke`, `GET /me/sessions`, `GET /modes`, `POST /modes/{mode}/activate`, `POST /modes/{mode}/pause`, `GET/PATCH /modes/{mode}/profile`, `GET/PUT /modes/{mode}/consent`, `GET /modes/{mode}/visibility`, `POST /me/export`, `POST /me/delete`, `GET /me/rights-requests/{id}`. Every mode operation requires entitlement/consent/eligibility.

## Assessment & matching
`GET /assessments/themes`, `GET /assessments/banks/{id}`, `POST /assessments/sessions`, `PUT /assessments/sessions/{id}/answers`, `POST /assessments/sessions/{id}/submit`, `GET /patterns`, `GET /modes/{mode}/matches?lens=echo|counterpoint|mosaic`, `GET /modes/{mode}/matches/{target}/why`, `POST /patterns/withdraw`; server returns scored version and coverage. Avoid returning raw answer set of another person.

## Social & media
`POST/GET /connections/requests`, `POST /connections/requests/{id}/accept`, `.../decline`, `GET /conversations`, `GET/POST /conversations/{id}/messages`, `GET/POST /circles`, `POST /circles/{id}/join`, `POST /media/upload-intent`, `POST /media/{id}/complete`, `GET /media/{id}/access`, `PATCH /media/{id}/visibility`, `DELETE /media/{id}`. Authz on signed GET/PUT and every conversation membership check. Media response headers must not expose upload credentials.

## Safety, support, payments
`POST /users/{id}/block`, `POST /reports`, `GET /reports/{id}/status`, `POST /appeals`, `POST /support/tickets`, `GET /billing/plans`, `POST /billing/checkout`, `POST /billing/webhooks/{provider}` with signature verification, `POST /billing/cancel`, `GET /billing/invoices`, `POST /billing/refund-request`, `GET /notifications`. 2xx webhook ACK means safely queued/durable, not successfully provisioned.

## Admin (server RBAC enforced)
`GET /staff/cases`, `GET /staff/cases/{id}`, `POST /staff/cases/{id}/assign`, `POST /staff/cases/{id}/action`, `POST /staff/cases/{id}/evidence-grant`, `GET /staff/photos/pending`, `POST /staff/photos/{id}/review`, `POST /staff/roles/grants`, `GET /staff/audit`, `GET /staff/rights`, `POST /staff/rights/{id}/resolve`, `POST /staff/assessments/banks/{id}/publish`, `POST /staff/scoring/{id}/release`, `POST /staff/billing/refunds/{id}`. Require staff reauth for privileged operations; segregation of duties as policy.

## Realtime and jobs
`GET /realtime/token` issues short-lived room-scoped auth for DO or Node WebSocket, verified at handshake AND revocation. Events: `message.created`, `message.read`, `connection.accepted`, `report.status_changed`, `user.mode_paused`, `moderation.content_removed`. Per-conversation sequence monotonic, reconnection gets messages from cursor; backpressure and rate limit. Queue jobs idempotent with bounded retry and DLQ; no personal data in webhook logs.

## Implementation quality
Generate OpenAPI from tested route schemas. Contract tests run against Cloudflare local and Node API; prohibit ghost endpoints and mock-only promises. See `16_SCAFFOLD/openapi.yaml` for baseline route inventory, not substitute for full request/response schema implementation.


---

> **Reference:** `06_SECURITY_LEGAL/SECURITY_RD_Threat_Model.md`

# SECURITY-RD — Threat Model, Authentication, Privacy and Release Controls

## Assurance target
Use OWASP ASVS 5.0 Level 2 as baseline, with elevated controls where intimate data, staff powers and sensitive disclosures create higher impact. This is an engineering target, NOT a security certification. Threat-model at least: account takeover, romance scams, extortion, stalkers, domestic abuse, minors, re-identification, covert trait profiling, media metadata leakage, harassment, shared-device privacy, report weaponization, billing fraud, insider misuse, supply-chain compromise, OAuth redirect abuse and cloud credentials exposure.

## Identity
Member signup: verified email/password or Google. Firebase Auth signs in; Workers/Node validate ID tokens via published keys/server SDK and enforce app session and mode policy. Phone OTP is optional, rate limited and cost metered. Admin MFA is mandatory: **base Firebase Auth does not automatically include MFA**; either upgrade Firebase Auth with Identity Platform (priced separately) or choose a proven MFA-capable OIDC provider. Admin route separated on a subdomain, login restricted to provisioned staff IDs/allowlist and required MFA; never accept any fixed 6-digit code or any non-empty password. Admin password alone is inadequate.

## Authorization
Policy `allow(actor,action,resource,context)` with `actor.member/admin`; mode consent/active status, adult state, target block and ownership gates, staff role, case scope/expiry, step-up assurance; deny by default. Backend checks for every route/object, including derived thumbnail URLs, WebSockets and queues. Create permission test matrix including horizontal IDOR, role escalation, cross-mode, removed-user and blocked-user access. UI hidden controls do not enforce authorization.

## Sensitive data and media
Raw quiz answers are sensitive by context and restricted even when not statutory special category. Separate member profile fields from assessment truth; encrypted transit and storage, field-level confidentiality by purpose, no raw answers in logs/analytics/ad networks; least-retention. R2 private, signed, time-limited access; metadata strip, provider scan, approved derivatives; force media delete (and cache invalidation) on policy decision. Don't promise screenshots can be prevented or that TLS means E2EE.

## Moderation and safety
Safety flows are permanently available free: block, report, mute, appeals, crisis/safety link, data controls. Safety case records have status SLA with urgency, assigned reviewer, actor, action reason, evidence pointers and retention class. CSAM pathway segregated, reporting obligations and provider rules verified by counsel. Anti-spam abuse control combines rate limits, device/account patterns under privacy rule, contact request throttles and human escalation; appeals for incorrect action. Never create a covert "predicted sexuality" field.

## Security implementation controls
CSRF (for cookie writes), CSP, HSTS, strict transport, secure cookies with SameSite, rate limiting and bot defense, password reset token expiry, OAuth state/nonce, no inline tokens in URL logs, secret vault/rotation, provenance and SBOM, dependency and SAST scans, TLS pinning only where appropriate, encrypted backup and restore procedure. Record unauthorized access attempts without exposing personal text. Hash-chain audit optional only when real chain verification/immutability is implemented.

## Incident management
Define severity, responder and regional on-call, containment checklist, preservation of evidence, restore, user comms and regulator reporting decision. CERT-In six-hour categories when applicable; DPDP staged breach duties; actual timelines verified before deployment. Threat-model and incident rehearsal are signoff deliverables. Production cannot accept real intimate data with fake deletion, mocked moderation or admin without MFA.


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

> **Reference:** `07_ADMIN_OPERATIONS/OPS_RD_Runbooks.md`

# OPS-RD — On-Call, Support, Incident, Retention, Moderation

## Operating ownership
App needs actual people for abuse escalations, disputes and data rights even if Cloudflare costs little. Assign at least one accountable primary and backup responder, with formal on-call coverage proportional to high-severity report obligations; do not publish a grievance mailbox no one checks. Staffing and coverage are financial requirements, not optional infrastructure.

## Moderation playbook
Intake report → classify severity and category → acknowledge with ticket ID → safety precautions / emergency referral if necessary → collect permitted evidence (minimum) → action and reviewer note → notify involved parties within policy/law → allow appeal → close case with retention label. Maintain reporting taxonomy and abuse false-positive review; staff wellness protections; access to intimate imagery limited and monitored.

## Operations jobs
Daily: check queues/DLQ, moderation SLA, payment webhook backlog, rights requests, secret expiry, failed backups, service probes and spending. Weekly: reconcile invoices, refund ledger, image access anomaly, abuse attacks, feature flags and alert noise. Monthly: restore sample backup to isolated environment, verify permission matrix on staging, cost/retention dashboard, update dependencies and deletion reconciliation. Quarterly: staff access and consent policy review, load/security drill and vendor terms.

## Incident levels
SEV1 exposure/abuse/major outage; SEV2 payments or severe feature degradation; SEV3 isolated bug; SEV4 cosmetic. Incident log stores UTC incident ID, owner, timeline, scope, mitigation, reproducibility, customer impact, legal reporting assessment, postmortem and prevention. Never imply severity estimates are legal categories. Notification templates must be reviewed and factual.

## Disaster recovery
Encrypt offsite backups; restore procedures for both D1 snapshots/R2 and PG/WAL/S3/Redis config; test account-mode-photo access revocation after restore, reprocess deletion tombstones and payment webhooks. Migration fallback documented. Target RPO/RTO from NFR must be proven under exercises, not asserted.

## SLO & budgets
Service status dashboard: Core API, Auth, DB, R2, message delivery, queues, email, payments; map to meaningful user paths and regional latency. Cloudflare and Node telemetry standardized (OTel attributes); do not log questionnaire responses/DM bodies. Budget alerts based on request/rows/DO hours/media/SMS/verification/support tickets; notify before spending spikes.


---

> **Reference:** `09_QUALITY_TESTING/QA_RD_Full_Test_and_Release.md`

# QA-RD / TEST-RD — Full-Product Verification Matrix

## Test pyramid and coverage
- Unit (Vitest): scoring, permissions, taxes, content validation, states, i18n formatters and pure reducers.
- Property-based (fast-check equivalent): deterministic score symmetry, coverage bounds, complementarity direction, idempotency, no privacy leak invariants.
- Contract: OpenAPI validation, Cloudflare Workers vs Node Hono same payloads/status/errors; SQL D1 vs PG parity; gateway WebSocket semantics.
- Integration: Firebase tokens/Identity Platform staff MFA (sandbox), D1/PG, R2/S3, DO/Redis, Queues/BullMQ, payment webhooks, email provider.
- E2E (Playwright): all routes, modes, sign-in, photos, quizzes, match explanation, messaging, billing, user reports, blocked profile, rights requests, appeals and admin role-scope.
- Visual regression: light/dark/EN/HI/TA at 320, 375, 768, 1024, 1440 + zoom 200/400%, no overflow.
- A11y: axe automated and manual keyboard, NVDA/VoiceOver, reduced motion, contrast, tap targets and locale copy.
- Nonfunctional: p95 latency, LCP, INP, CLS, CPU budgets, mobile networks, 1k concurrent chat connections workload (test/proposal), queue failover, backups/restore.
- Security: ASVS 5 L2, IDOR, auth session/CSRF, XSS, upload malware/EXIF, admin MFA/privilege escalation, signed URL leak, webhook forgery, spam, privacy deletion and incident drill.

## Must-test end-to-end scripts
QA01 anonymous landing→signup→verified email→friendship only: Dating/Matrimony invisible and photos not leaked.
QA02 member enables Dating later with separate consent and can pause without erasing friendship; old URLs deny access.
QA03 100-question versioned session saves, skips, resumes across devices, identical deterministic outcome on Worker and Node; malformed/duplicate answers rejected.
QA04 compare Echo/Counterpoint/Mosaic with fictional fixtures, see coverage and no "100% soulmate".
QA05 connection request mutual accept and blocked state; no DM after either blocks; attempts return safe error.
QA06 photo from upload to signed GET: metadata scrubbed, approved only, per-mode authorization enforced, delete and cached derivative revoked.
QA07 report via DM, moderator assignment, JIT evidence case, action, member notification, appeal, signed and time-scoped event log.
QA08 plan purchase test mode, duplicate webhook, cancel, refund, entitlement replay; no hidden match paywall.
QA09 data export contains account-owned data; deletion erases media/derived patterns per policy and reconciles backup restores/legal holds.
QA10 admin email/password without valid MFA denies; staff member cannot promote self, read raw answers, access unrelated case or refund above threshold.
QA11 homepage/FAQ/404/403/410/429/500/503 and offline states in all themes/locales.
QA12 fail D1/PG, R2, Redis/DO, Queues, payment provider; errors remain human-readable and no ghost success.

## Quality measurable gates
- 100% routes in route registry implemented with source/owner and E2E positive + negative tests; exceptions documented and founder signed, not silently marked optional.
- All 150 original feature domains reconciled with newer screen source; generated traceability document contains every route, requirement, API, test case, implementation status and screenshot path.
- Unit and domain policy ≥90% line coverage *target*, but tested high-risk access/consent/business rules 100% scenario coverage; overall number not proof of security.
- 0 critical/high open security findings, 0 unaddressed cross-mode/privacy leak tests; review severe known issues.
- Stable workflows for deploy/rollback on both platforms; smoke tests require actual deployed staging; no claims of tests when not executed.
- WCAG 2.2 AA audit + assistive technology manual report; no blockers.
- Performance field data benchmark p75 and synthetic budgets in `01_PRODUCT/SRS_and_NFR_Requirements.md`.
- Legal+privacy/ops/payment/provider acceptance signed; actual support contact staffed.

## Report structure per test run
Test ID, date/commit, runtime, dataset/locale/device/browser, precondition, steps, expected, actual, evidence (screens/log hashes), owner, defect severity, retest status and waiver reviewer if applicable. No personal production data in test fixtures or screenshots.

## Usability tests required
5-second hero comprehension; intent-mode differentiation; sign-in recovery; photo visibility; score caveat understanding; report ease; pricing fairness/cancel clarity. Test Indians across multiple linguistic and age contexts and non-Indian international samples, with inclusive accessibility cohort, **without claiming samples represent entire nations**. Founder signs D2 only after alternatives compared on same screen.


---

> **Reference:** `09_QUALITY_TESTING/UAT_SCREEN_AND_INCIDENT_MATRIX.md`

# UAT + Safety Release Gates

Every screen in `12_REGISTERS/SCREENS.csv` must have `owner`, `implemented_route`, `api`, `empty_loading_error`, `light_dark`, `motion`, `a11y`, `test_id`, `evidence_url`, `cloudflare_pass`, `server_pass`, `security_review` and `status`. Blank status means NOT DONE.

## High-impact blockers
Unauthorized staff access; missing or bypassable MFA; any raw questionnaire visible to non-user by default; photo cross-mode leak or public media URL; any message after block; incomplete cancellation/refund/data deletion; missing urgent complaint escalation; actual phone OTP not verified; fake match explanations; nonreproducible scoring; fake clinical/marriage outcome claims; secrets in repo; live payment grants without webhook signature. Any = release blocked.

## Paired review/acceptance
Product owner signs all member journeys and inclusive identity; UX lead signs accessible responsive themes/motion; backend lead signs deterministic and multi-runtime parity; trust&safety lead signs reports, emergency handling and case operations; privacy lawyer signs applicable requirements; security reviewer signs ASVS/threat model; financial lead signs pricing/taxes; SRE signs deployed monitors/backup/rollback. AI Studio-generated code cannot sign these itself.


---

> **Reference:** `10_DEVOPS/DEVOPS_RD_Cloudflare_Docker_GHA_Jenkins.md`

# DEVOPS-RD — GitHub Actions, Cloudflare, Docker/Jenkins, Backup and Migration

## Source control and build contract
Private monorepo, protected main, required PR review, CODEOWNERS for security/legal/migrations, conventional changesets, semantic API versioning, dependency lockfile, SBOM, secret detection, signed artifacts where practical. Never push `.env`, production credentials, user data or media. Use environments `dev`, `staging`, `production` for each hosting target with distinct secrets and databases.

## GitHub Actions pipelines
- `ci.yml`: format, ESLint, strict TypeScript, Vitest, matcher property tests, D1 & PG migration in containers, OpenAPI lint, Playwright E2E on preview, a11y/visual snapshots, dependency and secret scan. A passed CI is a gate, not a full external pentest.
- `deploy-cloudflare.yml`: protected `production` environment with reviewers, Wrangler deploy worker assets/API, D1 migrations with preflight/backup, smoke via real staging and prod endpoints, rollback artifact/route on fail. Cloudflare token minimally scoped; no guessed account/resource IDs.
- `deploy-server.yml`: build immutable images, scan+push registry by digest, trigger Jenkins job / SSH deploy with secrets injected, backup PG, migrate, Docker Compose pull+up/canary, health check and rollback. Build once promote digest, do not rebuild prod from local workstation.
- `security-nightly.yml`: scheduled dependency, ZAP-safe scan against staging, artifact/report retention; no aggressive scan on live members.
- `parity.yml`: boot Cloudflare local worker and Node API, shared fixture suite, compare hashes/errors/permissions and websocket events; block release on drift.

## Jenkins responsibility
For server environment only: checkout signed/immutable tag, verify provenance and CI run, pull image by digest, preflight secrets/db and available disk, backup + migration, `docker compose up -d --wait` with timeout, smoke and rollback, notifications. Jenkins UI itself MFA/SSO and restricted agents. Do not store production env values in Jenkinsfile.

## Cloudflare release
Create named D1/R2/DO/Queue resources for each env. Worker bindings in `wrangler.jsonc` with placeholder account/database names; DO migrations tracked; don't try to deploy a guessed config. Build static React; upload static assets with API Worker if supported. Time Travel backup/restore tested. R2 private; CORS restricted; image processing server. Monitor DB read/write and DO usage as billing hazards. Do not assume 5,000 registered users equals a particular monthly bill.

## Server release
Compose baseline includes API, web, admin, worker, PostgreSQL, Redis and Caddy with healthchecks, named volumes, no host-exposed PG/Redis, resource limits. Production hardening must add managed secrets/monitoring, HA and offsite backups; single VPS is not equivalent to Facebook availability. Database connection pooling, object store external or backed up, graceful shutdown of websocket drain, message persistence before ack.

## Data migration/recovery
Two schema migrations and one logical contract; seed local fixtures without personal data. D1→PG export/transform, verify constraints and row hashes, replay event outbox idempotently, reissue signed media links, cutover with rollback window and delete reconciliation. Backup restore tests quarterly and prior to major migrations.

## Observability
OTel traces, provider usage metrics, service status, errors, SLA compliance, payment reconciliation and rights jobs. Alerts to actual on-call. Dashboard is privacy-safe. Audit events have actor, action, resource, case, reason and non-PII metadata.

## Minimum secrets register
`FIREBASE_PROJECT_ID`, Firebase public config in frontend if appropriate; Firebase credentials as secret, `DATABASE_URL` server only, Cloudflare D1/R2 bindings, R2 signing and bucket controls, Redis password, billing webhook signing secret, encryption keys, email/SMS provider credentials, observability ingest, allowed admin issuer/audience, deployment tokens. Document owner/rotation and never hardcode values.

## Provenance note
Files in `16_SCAFFOLD` are templates. Actual deployment must supply project source, secrets, account IDs, DNS records, auth provider config, migration history, paid resources and executable tests. Do not claim deployed from syntax-valid YAML.