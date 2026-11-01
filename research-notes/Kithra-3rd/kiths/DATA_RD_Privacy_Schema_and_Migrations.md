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
