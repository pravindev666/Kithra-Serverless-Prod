> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# DRD / API-RD — Data Model, API Contracts & Events

**Contract principle:** all writes server-validated and idempotent where retries are expected. All selected IDs are opaque, globally unique UUID/ULID; do not expose Firebase UID as primary. Timestamps ISO 8601 UTC. Column and endpoint names are proposals and should be synchronized with migrations / OpenAPI.

## 1. Domain database entities

| Entity | Key data and foreign keys | Important invariants |
|---|---|---|
| users | id, account_status, min_age_verified, created_at, deleted_at | one individual, unique internal ID, deletion holds |
| external_identities | id, user_id, provider, provider_subject, last_verified_at | `(provider,subject)` unique; no trust in client email |
| mode_personas | id, user_id, mode, public_name, visibility, bio, region, status | unique `(user,mode)`, mode-specific fields and blocks |
| mode_consents | id, user_id, mode, notice_version, scope, granted, occurred_at | explicit event history; withdrawal not overwritten |
| profile_fields | id, persona_id, field_key, cipher_value, visibility | privacy tiers; encrypt sensitive values |
| question_themes | id, slug, locale, status | theme is neutral and configurable |
| question_banks | id, theme_id, version, locale, publish_state | immutable after publication |
| questions | id, bank_id, ordinal, text, response_schema, construct_mapping_ref | public API strips traits/weights |
| quiz_attempts | id, user_id, bank_id, seed_ref, status, assigned_at, submitted_at | cannot switch version mid-attempt |
| quiz_assignments | id, attempt_id, question_id, sequence | stable assigned order; unique question/attempt |
| quiz_answers | id, attempt_id, question_id, encrypted_value, updated_at | at-rest application encryption, personal data |
| trait_snapshots | id, user_id, mode, model_version, coverage, encrypted_vector | private by default, immutable version |
| match_snapshots | id, source_persona, target_persona, mode, lens, score_band, model_version | server eligibility verified on retrieval |
| requests | id, from_persona, to_persona, mode, status, expires_at | idempotent duplicate handling; blocked no access |
| conversations | id, mode, membership_version, status | no cross-mode chat accidentally |
| conversation_members | conversation_id, user_id, joined_at, muted | authorized participants only |
| messages | id, conversation_id, sender_id, body_cipher_or_ref, created_at | immutable sender, per-convo sequence |
| circles | id, mode_scope, name, rules_version, visibility, moderation_status | includes privacy and admin policy |
| circle_members | circle_id, user_id, role, state | group roles not platform admin |
| circle_posts | id, circle_id, author_id, body_ref, moderation_state | reports and retention rules |
| blocks | blocker_id, blocked_id, mode_scope, created_at | immediate bilateral discovery suppression |
| reports | id, reporter_id, subject_type, subject_id, category, severity, created_at | reports retained confidentially |
| moderation_cases | id, report_id, assigned_team, priority, state, due_at | appeal and evidence trace |
| case_actions | id, case_id, actor_id, action, rationale, at | immutable-style append-only log |
| support_tickets | id, requester_id, category, state, assignee_id | minimized PII; service SLA |
| admin_memberships | admin_user_id, role_id, state, mfa_verified_at | superadmin grant only via approved workflow |
| roles, permissions, role_permissions | normalized scope, action | capability matrix centrally enforced |
| audit_events | id, actor_id, target_ref, action, metadata_redacted, at, hash_chain | no raw sensitive answers/log payloads |
| payment_customers | user_id, gateway_customer_id | provider ref only; no card data |
| plan_catalog | id, code, price_minor, currency, term_days, visibility | versioned prices/taxes |
| subscriptions | id, user_id, gateway_sub_id, plan_version, state, period_end | webhooks authoritative |
| payments | id, provider_event_id, amount_minor, currency, result | unique provider event ID |
| entitlement_grants | user_id, feature, quota, expires_at, source | no safety features gated |
| rights_requests | id, user_id, type, status, deadline, completed_at | auditable export/erasure |
| export_jobs | id, user_id, object_key, expires_at, state | expiring signed link in private bucket |
| retention_holds | id, subject_id, legal_basis, expiry, approvers | access-controlled, lawful only |
| feature_flags | id, audience, flag_key, enabled, version | no hardcoded toggles |
| notification_jobs | id, user_id, kind, state, attempts | channel preference respected |

**Data domains:** (1) identity (Firebase), (2) social/personas (D1), (3) derived assessments (D1 encrypted fields), (4) media/exports (R2 private), (5) support/audit (restricted D1 or isolated DB). Avoid exposing admin to raw quizzes in normal views; provide redacted summaries when appropriate.

## 2. Index and retention design
High-value indexes: `mode_personas(mode,status,region)`, `external_identities(provider,subject)`, `questions(bank_id,ordinal)`, `quiz_answers(attempt_id,question_id)`, `requests(to_persona,status,created_at)`, `messages(conversation_id,created_at)`, `reports(status,created_at)`, `moderation_cases(state,due_at)`, `subscriptions(user_id,state)`, `payments(provider_event_id)`, `audit_events(target_ref,at)`. Every dataset has classification, declared purpose, retention trigger, deletion mode, processor and access role. Do not add broad PII indexes without need.

## 3. REST API v1 (representative)

| Method | Endpoint | Permission / behavior |
|---|---|---|
| GET | `/v1/me` | logged-in profile and consent state |
| PATCH | `/v1/me` | self only, permitted fields, reauth if sensitive |
| POST | `/v1/me/modes` | activate one mode with appropriate notice |
| PATCH | `/v1/personas/{id}` | owner and matching mode only |
| GET | `/v1/quiz/themes` | public approved catalog; localization |
| POST | `/v1/quiz/attempts` | assign versioned question bank; auth |
| GET | `/v1/quiz/attempts/{id}` | owner only, no trait weights |
| PUT | `/v1/quiz/attempts/{id}/answers` | idempotent upsert; ownership + schema |
| POST | `/v1/quiz/attempts/{id}/submit` | score async and return job/status |
| GET | `/v1/reports/me?mode=friend` | own derived report only |
| GET | `/v1/discovery?mode=friend&lens=mirror&band=80` | enforce consent, blocks, fraud gate |
| POST | `/v1/introductions` | one-user request with quota |
| POST | `/v1/introductions/{id}/respond` | receiver action only |
| GET | `/v1/conversations` | members only |
| POST | `/v1/conversations/{id}/messages` | member, rate/abuse gated |
| POST | `/v1/blocks` | immediate user protection |
| POST | `/v1/reports` | reporting works free and after block |
| GET/POST | `/v1/circles`, `/v1/circles/{id}/join` | contextual membership |
| POST | `/v1/payments/checkout` | entitlement catalog + provider checkout |
| POST | `/v1/webhooks/razorpay` | signed raw body, not user-auth |
| POST | `/v1/rights/exports` | self + reauth, rate-limited |
| POST | `/v1/rights/deletion` | self + reauth + retention explanation |
| GET | `/v1/admin/cases` | admin claim + case read capability + MFA |
| POST | `/v1/admin/cases/{id}/actions` | permission, reason, audit and double-check |
| POST | `/v1/admin/invitations` | admin-management grant only; never client role |
| GET | `/v1/admin/audit` | security auditor or superadmin scoped |

See `scaffolds/routes.openapi.yaml` as minimal machine-readable skeleton; developer must expand every endpoint and generate typed clients.

## 4. Example API payloads
```json
{"mode":"friend","lens":"mirror","band":{"min":80,"max":89},"limit":20,"cursor":"opaque"}
```
```json
{"candidate_id":"p_opaque","lens":"mirror","index_band":"80-89","coverage":0.84,"explanations":["similar communication pace","shared preferred activities"],"caveat":"Compatibility index, not a relationship prediction"}
```
```json
{"question_id":"q_opaque","answer":{"choice_id":"a3"},"assignment_revision":1,"idempotency_key":"client-generated-unique"}
```
Responses must never include raw hidden item-trait weights, nonconsented protected characteristics, other users' private answers, service secrets, internal audit logs or unapproved verification artifacts.

## 5. Events, retries, eventual consistency
Events: `UserVerified`, `ModeConsentGranted`, `ModeConsentWithdrawn`, `QuizAttemptSubmitted`, `TraitSnapshotComputed`, `MatchCacheInvalidated`, `IntroductionAccepted`, `MessageSent`, `UserBlocked`, `ReportCreated`, `CaseEscalated`, `SubscriptionPaymentSettled`, `RefundIssued`, `AccountDeletionRequested`, `AccountErased`. Carry `event_id`, `schema_version`, actor, minimized payload, timestamp, aggregate ID, idempotency key. Use transactional outbox where possible; worker retries never double-charge, re-send abusive content or re-grant access. Consent withdrawal and blocks are synchronous in access policy even if cached matches update later.

## 6. D1 SQL scaffold caveat
`scaffolds/schema.sql` is only a core baseline for implementation and performance tests. It does not cover every table or encryption model described above. Security-sensitive and legal-retention behaviors must have migration review and explicit integration tests before deployment.
