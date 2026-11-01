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
