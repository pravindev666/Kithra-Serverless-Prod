> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Delivery-RD — Dependency-aware Delivery, Roadmap & Developer Backlog

**This is a recommended phased roadmap, not an estimate that one person can complete all of it in 90 days.** Three relationship modes, psychometrics, chat, public groups and an operating moderation console are a multi-disciplinary product; avoid committing to a calendar that substitutes for staff/clinical/legal work.

## 1. Workstream dependencies
1. Product/legal gates and safety policy before collecting intimate answers.
2. Auth/identity, consent, mode persona and admin roles before quizzes/discovery/chat.
3. Question bank review/permissioning before psychological scoring can represent anything meaningful.
4. Matching policy and score contract before candidate discovery.
5. Report/block/moderation capacity before stranger chat/groups/media.
6. Billing ledger and cancellation tested before paid plans.
7. App metrics and safety analytics before feature expansion.
8. Migration abstraction before major DB growth, not after vendor lock-in.

## 2. Planning calendar for a small team
**Phase 0 — 0–30 days: research and controlled validation.** 20–30 interviews per initial segment, safe concierge matching, separate positioning tests for three modes, opinionated legality/data map, architecture spike, brand prototype. **Exit:** evidence of repeat contact and trust with consenting adults; no full public launch.

**Phase 1 — 30–60 days: secure skeleton.** Monorepo, design tokens/story components, CI/CD, identity/JWT verification, mode-scoped personas, D1 migrations, admin invitation + MFA, consent log, rights request scaffold, private R2 upload, safety report pipeline, worker observability and audit logging. **Exit:** demonstrated deny-by-default auth and data boundaries.

**Phase 2 — 60–90 days: restricted experience.** Approved limited theme quiz, server-side scoring with transparent caveat, match candidate batch, discovery, requests, text chat, blocks/reports, moderated private Circles, admin case triage, consent withdrawal and data export/deletion end-to-end. Security review and controlled production validation readiness gate. **Exit:** approved adult invite-only controlled production validation with staff safety coverage.

**Phase 3 — 90–150 days: validate and harden.** cohort science, accessibility/bias/security fixes, stable messaging and SLA alerts, backup/restore, full customer support, moderation staff training and billing gateway test. Only then consider subscriptions, public Circles, staged cities, additional themed banks.

**Phase 4 — internal delivery sequencing, not optional scope:** localization, question reviews, community growth and server cutover. Every agreed feature remains in the full-product delivery contract, subject to lawful operation.

## 3. Developer sprint epics / estimation units

| Epic ID | Scope | Dependency | Relative size | Release acceptance |
|---|---|---|---|---|
| E00 | repo assessment, remove simulated claims, architecture setup | none | M | no demo auth in production |
| E01 | Firebase identity + JWT and account mapping | E00 | L | all invalid tokens rejected |
| E02 | mode consent, profiles & field ACL | E01 | XL | cross-mode isolation tested |
| E03 | public UX and component design | E00 | L | responsive, WCAG tests |
| E04 | question catalog/banks/attempts | E01,E02 | XL | deterministic versioning and resume |
| E05 | scoring engine + explanations | E04 + scientific approval | XL | reproduce all scores; caveats |
| E06 | matching discovery + cache + consent | E05,E02 | XL | hard safety filters enforced |
| E07 | connection requests + text chat | E06,E08 | XL | mutual consent and report tools |
| E08 | moderator/admin cases, roles, complaints | E01,E02 | XL | first/second-line safety flows |
| E09 | Circles & group controls | E07,E08 | XL | group-specific moderation |
| E10 | data rights, deletion and retention | E02,E04,E08 | XL | verified end-to-end erasure jobs |
| E11 | payment entitlements + renewals | E08,E10 | L | reconciled webhook/cancel |
| E12 | security/observability/backup | all | XL | incident drill and pentest |
| E13 | outcome analytics & experiments | E06,E07 | M | 7/30-day outcome reports |
| E14 | multilingual coverage, validated deterministic scenarios, optional media | approval gates | XXL | full product scope where legally/operationally allowed |

Relative sizes XS/S/M/L/XL/XXL represent comparative effort, not person-day promises. Milestone timing must be re-estimated after staffing and prototype tests.

## 4. Full feature priority table
**MUST before public launch:** authenticated accounts, verified adult eligibility policy, profile privacy by mode, opt-in quiz consent, scoring caveat, discovery hard filters, mutual request, text-only safe chat, block/report, support desk, basic moderation + on-call, admin MFA/RBAC, consent rights, accurate terms/privacy, backup/restore, operational logs, security audit, error handling and accessibility.

**SHOULD after controlled production validation:** varied question sets, natural-language score explanations from approved traits, moderated Circles and meetups, payment plans, in-app notifications, user feedback, better insight graphs, verified claimed facts with provider-approved flow.

**COULD after evidence:** verified organizers, official curated group sessions, discovery quality learning, long-term compatibility research, advanced conversation prompts, localized cohorts, optional family-assisted matrimony.

**Excluded:** neural mind replicas, hidden sensitive-trait inference, publishing raw answers, intrusive biometrics, mandatory Aadhaar, adult+minor matching, unmoderated anonymous groups, consent bypass, guaranteed soulmates. Other scoped features still require appropriate security and privacy design.

## 5. Cost-aware feature flags and graceful modes
- `public_discovery_enabled`, `new_signups_enabled`, `media_upload_enabled`, `private_groups_enabled`, `matching_compute_enabled`, `payments_enabled`, `ai_simulation_enabled=false`, `read_only_mode`.
- On Cloudflare limit exhaustion protect help and reporting via alternative documented contact; do not hide safety system behind rate limit. Offline/retry states must not create duplicate payments or messages.
- Configure per-month spend caps/alerts for R2/Worker/DO, account creation SMS email and moderation time.

## 6. Deliverables for each discipline
**Founder:** persona interview log, revenue assumptions, acceptance and risk signoffs. **Psychology:** construct map, survey licenses, item validation, model card and unfairness tests. **Designer:** all Figma screens, tokens, responsive prototypes and content guidance. **Engineer:** tested code, API spec, migration scripts, ops dashboards, secrets, CI and runbooks. **Security:** threat model, pentest, checklist, incident tabletop. **Legal:** signed policies, data map, record of applicability, grievance procedures. **Moderator:** documented queue, escalation, appeals and training simulations. **QA:** traceability matrix and defect severity ledger.

## 7. Definition of a shippable vertical slice
A real authorized user (not mocked) activates friendship mode, completes a **valid published** safe assessment, receives a clearly caveated index, sees only eligible and opt-in candidate(s), sends/receives a request, exchanges a persisted text message, reports abuse, has a human respond via authenticated case handling, and withdraws profiling consent such that further matching ceases; all actions audited/tested and legal review complete.

## 8. Explicit next decisions
D01 city/cohort for launch; D02 invitation-only vs open beta; D03 timeline and staff coverage; D04 science advisor and research protocol; D05 first published theme approval; D06 starting plan price research; D07 host region/vendor contracts; D08 moderated image capability; D09 identity verification policy; D10 whether any paid/matrimonial family tools are delayed; D11 brand/domain clearance and Indian company identity; D12 responsible officer contact.
