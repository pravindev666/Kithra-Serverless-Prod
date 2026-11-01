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
