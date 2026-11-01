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
