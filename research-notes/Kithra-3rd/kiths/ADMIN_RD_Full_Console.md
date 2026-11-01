# ADMIN-RD — Full Staff Console, RBAC, Casework, Palantir-Inspired Operations

## Interface principle
A deliberately separate staff experience: same Kithra design tokens, denser information layout, role-aware panes, evidence and time hierarchy. Palantir-style power means **traceable relationships, filterable operational data and clear provenance**, not wholesale copy of Blueprint widgets or a public-facing corporate look.

## Shell
Staff-only URL `staff.[domain]` preferred. On route entry validate signed, MFA-verified staff session before loading any private data. Sidebar: Overview; Safety Cases; Photo Review; Members; Fraud; Messages Evidence; Circles; Assessments; Scoring; Payments; Subscriptions; Support; Privacy Requests; Grievances; Compliance; Analytics; Audit; System; Incidents; Feature Flags; Staff/RBAC; Settings. Main content queue/list with sortable and filterable 36–48px rows, top banner environment name, alerts; detail third pane with status timeline and evidence. Tablet two-pane; mobile urgent view restricted or one-pane.

## Auth & privileges
Authentication is not "special email and password" alone. Provision staff via authorized invitation, email domain or explicit identity allowlist, strong MFA through Identity Platform/other capable IDP; step-up for sensitive operations, time-bounded sessions and audit. Roles: `superadmin` (policy/config, not unrestricted content), `trust_safety`, `photo_moderator`, `support_agent`, `billing_agent`, `privacy_officer`, `psychometric_reviewer`, `auditor_readonly`, `ops_engineer`, `grievance_officer`. Roles composed from scoped permissions, not an integer hierarchy. Separation of duties for role elevation, bans/refunds above thresholds and evidence requests.

## Case lifecycle
New → triage → assigned → investigating → action proposed → approved if sensitive → actioned → member notified → appeal/closed. Each case: source report, subject ID pseudonymized where possible, severity, priority, due time, owner, queue, evidence references, admissibility/access consent/legal basis, linked events and appeals. View evidence only JIT reason/time/bounded scope, with mask/redaction defaults. Expired grant revokes immediately. Every action idempotent with who/what/when/why and previous/new status. Urgent intimate imagery complaints have dedicated fast escalation, never buried in generic support.

## Detailed module rules
- Overview: current cases/urgent SLA breaches and reliability metrics, data freshness indicators; no vanity dashboard.
- User search: exact/scoped, reason required, no default raw questionnaire disclosure, status and risk signal provenance.
- Photo review: queue/thumbnail only with legitimate moderation purpose; click full image only with scope; approve, reject with taxonomy, notify, appeal.
- Reports: filter by severity, policy, assignment, age; case SLA; linked sessions and safe evidence review.
- Fraud: rate/velocity signals and confidence caveats; no irreversible algorithm-only bans.
- Messaging evidence: narrow thread excerpt by case and time; export approval and audit; no surveillance backdoor.
- Circles/events: policy review, creator actions, suspensions, memberships and moderation.
- Assessment CMS: draft/review/legal/psychometric/publish/rollback; immutable published bank versions, localized copy validation.
- Scoring: rule version compare, replay fixtures, drift/fairness dashboard, blocked releases until reviewer approval.
- Support: ticket inbox, macros, assigned agent, status, timelines, internal notes redacted from member.
- Billing: provider ledger, verified webhooks, refund reason, approval thresholds, no manual fake entitlements.
- Privacy: consent history, export/deletion stages, lawful holds, SLA, downstream processors/backup reconciliation.
- Staff: invite/revoke, MFA assurance, quarterly access review, dual approval on privilege escalation.
- Audit: append-only/tamper-evident events only if actual verifier implemented; timeline and export.
- Analytics: minimum cohort size suppressions, no psychometric raw answer analytics.
- Incident: affected systems, severity, clock, containment, notifications and legal decision record.

## Visual states and motion
No admin auto-playing animations. Data tables have empty, skeleton, stale, failed, permission denied, conflict/stale version, redacted, rate-limit states. Triage uses labels plus icons, not severity colors alone. Motion ≤160ms in drawer, case selection and toast; no animated count-ups or delayed safety buttons. Use contrast and WCAG keyboard navigation in dense tables and evidence viewer.

## Admin negative requirements
No superadmin routine ability to read every member's intimate quiz answers, no undisclosed browsing of DMs, no backdoor impersonate-user, no secret admin login bypass, no irreversible action without reason, no paper-only audit, no unverified report deletion. Every staff permission has a test fixture and quarterly review. 24 exact admin screen layouts are preserved in source research `13_RESEARCH_ORIGINAL/06_ADMIN/`.
