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
