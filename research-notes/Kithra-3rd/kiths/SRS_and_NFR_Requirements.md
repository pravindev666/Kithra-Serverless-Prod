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
