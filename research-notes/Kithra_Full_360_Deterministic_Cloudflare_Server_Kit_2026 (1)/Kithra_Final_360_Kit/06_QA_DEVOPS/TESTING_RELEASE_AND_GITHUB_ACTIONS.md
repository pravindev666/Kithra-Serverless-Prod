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
