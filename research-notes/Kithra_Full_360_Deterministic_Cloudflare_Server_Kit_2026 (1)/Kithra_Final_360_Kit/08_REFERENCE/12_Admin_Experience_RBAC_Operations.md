> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Admin-RD — Mission Control, RBAC, Support, Moderation and Admin UX

**Product rule:** The admin dashboard is a separate privileged product, not a hidden tab accessible with a static secret. Frontend visibility is convenience; security is enforced at the Worker/API and on data access. Its scope is incident response, customer support, trust/safety, billing review, score bank governance and privacy rights—not casually reading members' personal stories.

## 1. Admin authentication and provisioning
Use `admin.kithra.[tld]` as a distinct origin (or separate `/admin` deployment behind Cloudflare Access if domain constraints), not linked in public nav. Allowed admin identities use **specific verified email accounts plus password and MFA**, backed by Firebase provider identity plus Kithra server-side allowlist and privileges. Require elevated MFA/passkey or TOTP for all admin access; if provider limitations affect this, choose a supported dedicated MFA/auth solution before launch. Restrict admin membership to invite-only, verified by superadmin with reason, expiry and approval. Admin email domain allowlist is defense-in-depth, not identity proof by itself. Optionally Cloudflare Access adds a second identity/device gate. No plain-text passwords in database/code, no common admin shared account, no default secret. Read-only auditors and safety agents have individual accounts.

## 2. RBAC permission matrix

| Action | Owner/Superadmin | Trust & Safety Lead | Safety Reviewer | Support Agent | Finance | Quiz Publisher | Analyst | Auditor |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Dashboard aggregate KPI | Y | Y | Y | Y | Y | Y | Y | Y |
| View user public account metadata | Y | Y | case only | ticket only | masked | N | aggregate | metadata only |
| Read reported chat excerpt | approval | assigned | assigned | N | N | N | N | audit ref only |
| Full raw quiz answers | N by default | N | N | N | N | N | N | N |
| Restrict account temporary | Y | Y | request | N | N | N | N | N |
| Permanent ban | dual approval | dual approval | N | N | N | N | N | N |
| View payment references | masked | N | N | masked | Y | N | aggregate | audit only |
| Refund request approval | approved threshold | N | N | create request | Y | N | N | log only |
| Publish quiz bank | Y via approval | N | N | N | N | propose/approve split | N | log only |
| Configure public feature flag | Y | limited safety | N | N | N | quiz only | N | N |
| Invite/revoke admin | dual approval | N | N | N | N | N | N | audit |
| Audit-log export | Y + justification | restricted | N | N | N | N | N | approved |
| Deletion/legal hold exception | dual approval + counsel | request | N | N | N | N | N | evidence only |

`Y` authorizes only permitted scope. Separate role and capability from organizational titles. Every capability checked per case/tenant, not just route level. Reviews require step-up authentication for high-risk actions. Data-access "break glass" logs reason, reviewer, duration and recipient alerts; default disabled.

## 3. Information architecture / admin sidebar
```
KITHRA | MISSION CONTROL
[Global case search — restricted] [Alerts] [Admin identity + MFA status]

OVERVIEW
  Operations Dashboard
  Safety Command Center
  Live Incident Alerts

TRUST & SAFETY
  Reports Queue
  Case Investigations
  Appeals
  User Restrictions
  Group Moderation
  Verification Requests (only if implemented)

SUPPORT
  Tickets Inbox
  Billing & Refunds
  Account Recovery
  Data Rights / Deletion

MATCHING & RESEARCH
  Quiz Theme Catalog
  Question Bank Review
  Scoring Model Registry
  Fairness/Outcome Monitoring

FINANCE & GROWTH
  Plans & Entitlements
  Payment Ledger (scoped)
  Acquisition/Retention (aggregated)

SYSTEM
  Feature Flags & Emergency Controls
  Roles & Invitations
  Audit Logs
  Incident Runbooks
  Settings / Provider Status
```
No direct "psychometric dossier" item. If cases require access, show narrow redacted evidence only with case justification. Admin responsive design primarily desktop 1280/1440+; tablet read-only triage; destructive actions disabled on mobile or require full reauth.

## 4. Admin visual guidance
Different from public Kithra's welcoming canvas, but related token system: deep slate `#111B24`, surface `#1C2A35`, ink `#F3F7F7`, teal action `#6DBFC2`, amber `#F1BB68`, red `#F28C93`; case badges neutral unless genuine urgency. Left rail 248px, top bar 68px, central table with filter/search, right 360px context drawer with evidence timelines and policy guidance. Dense but legible: body 14/20, 12px metadata, 32px data figures. Motions limited to 160ms drawer crossfade and table row highlights; no attention-grabbing landing effects. All audit actions show plain-language consequence and undo only when genuinely reversible.

## 5. Dashboard metrics
Queue backlog by priority/category, time to first response, time to investigation/resolution, emergency breach warnings, appeal overturn, repeat offenders, review staff available, unreconciled payments, user support CSAT, deleted-account backlog, matching fairness tests status, current free-tier usage/budget, last backup and restore test, system health. Metrics must come from actual persisted data and freshness timestamp, not fake counts.

## 6. Moderation case runbook
**Report creation:** write immutable report and state synchronously; assign `case_id`, hold relevant evidence only lawfully, anonymize reporter information from subject. **Triage:** severity based on specific harm, age, ongoing exposure, repeat pattern. **Investigate:** redact defaults, open only scoped excerpts, record each evidence access and reason, corroborate before punitive action. **Action:** educate/warn, remove content, restrict features, suspend, ban, refer to authorities where required; avoid automatic global punishments without review. **Notify:** give reporter meaningful safety update, avoid exposing private investigation; provide subject accessible reasons and appeal path where feasible and lawful. **Appeal:** reviewer not original investigator, record rationale. **Close:** documented final state, scheduled evidence disposal or justified retention.

### SLA engine
At minimum implement category-aware deadlines and escalations, not one global timer. Contingent internal schedule: immediate `critical` handoff and emergency policy, specialized intimate-image/impersonation cases as legally applicable within 2h, content grievances 36h where applicable, general acknowledgements 24h and general resolutions 7d where applicable (verify current consolidated 2026 IT Rules with counsel). Show colored state only after precise deadline type and on-call capacity are known. Automatic overdue escalation via cron/queue with backup recipient, no false claim of resolution if case is simply marked read.

## 7. Support case UX
Inbox queues `New / Assigned / Waiting for user / Escalated / Resolved / Appeal`; category filters, severity, mode, age of ticket; keyboard shortcuts available but dangerous actions always explicit. Conversation history redacts identity and notifies agent when private material accessed. Suggested macros are human-reviewed, not auto-sent for legal/security harms. Support agent can request proof of account ownership using secure channel but never ask for password or full card number. Evidence attachments quarantined and object-scoped.

## 8. Admin roles and invite lifecycle
First trusted superadmin created out-of-band via setup script or privileged audited migration. Addition requires existing superadmin plus reviewer approval for elevated roles. Invite token one-time and short-lived, bound to verified email address; account enrolls MFA before privilege activation. Remove/revoke token on suspension, employment termination, expiration, account compromise; session revocation at API boundary. Roles are capability sets, nonrecursive; `owner` role is not a wildcard bypass of privacy safeguards.

## 9. Admin UX flows and acceptance
- **A01 access:** non-admin trying admin host → generic unauthorized, no information leakage; even successful Firebase login not enough.
- **A02 case report:** support can open and assign own tickets but not read unreported messages.
- **A03 ban:** moderator recommends, safety lead approves, system logs two distinct human identities.
- **A04 sensitive export:** only permitted auditor, step-up auth, documented reason, time-limited result, alert owner.
- **A05 quiz publication:** draft → independent science reviewer → privacy reviewer → publisher → canary; trace revisions; rollback.
- **A06 feature flag:** disable discovery/chat immediately while leaving help, safety and data-rights accessible.
- **A07 admin offboarding:** revoked role reflected across fresh requests and socket sessions; signed action logs retained.
- **A08 payment case:** finance refunds only through signed gateway API with two-person approval above threshold; ledger reconciliation.

## 10. Operational staffing requirement
An owner must be reachable for urgent law/safety cases at all times the public platform operates, or product scope (uploads/public messaging) must be limited accordingly. Cloud services cannot substitute for human investigation. Staffing, duty rotation, vendor/legal escalation and incident tabletop are launch dependencies rather than optional polish.
