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
