# 11 — ADMIN & OPERATIONS CONSOLE REDESIGN (`/admin/*`)

## 1. Admin Console Philosophy: High-Density Operational Clarity with Zero Privacy Creep

While the Member Workspace must feel warm, calm, and effortless like Instagram or WhatsApp, the **Admin Console (`/admin/*`)** serves specialized operational staff (`Trust & Safety Analyst`, `Photo Reviewer`, `Question & Scoring Steward`, `Circle Steward`, `Support & Billing Ops`, `Privacy Officer`, `Superadmin`).

It must follow three strict architectural principles from the canonical research notes (`PALANTIR_TRANSFER_MATRIX.md` & `DECISIONS_AND_CONFLICTS.md` `D-03`, `D-04`):
1. **Collapsible Role-Aware Sidebar (`248px` <-> `72px`):** Shares the same accessible collapse/expand mechanics as the member shell, but swaps navigation items dynamically based on the active staff role.
2. **Case-Scoped JIT Access Only:** Staff never browse arbitrary private chats. Message evidence is visible **only** inside an active moderation case (`#KT-XXXX`) after selecting a mandatory audit reason (`15-minute JIT unlock`).
3. **Absolute Psychometric Privacy Wall (`view_raw_quiz_answers = FALSE`):** No staff role—including `Superadmin`—can ever inspect an individual member's raw questionnaire answers. Question Stewards view **aggregate item statistics only** (e.g., item skip rate, option distribution, clarity flags).

---

## 2. Role-Aware Admin Navigation Architecture

| Admin Route | Navigation Label | Primary Roles Authorized | Core Operational Capability |
|---|---|---|---|
| `/admin/overview` | **Overview** | All Staff Roles | SLA queue health (`<15m` critical triage, photo review backlog, DPDP requests, active Circles) and 1-click jump into priority queues |
| `/admin/reports` | **Reports & Moderation** | `Trust & Safety`, `Superadmin` | 3-pane triage table + slide-over **Case Detail Drawer** with reporter/subject history, 15m JIT scoped message unlock, and resolution actions (`Warn`, `Pause Mode`, `Suspend Account`) |
| `/admin/photos` | **Photos** | `Photo Reviewer`, `Trust & Safety`, `Superadmin` | High-speed `4:5` photo moderation grid verifying portrait safety and `EXIF stripped` status (`Approve`, `Request Recrop`, `Reject`) |
| `/admin/users` | **Users** | `Trust & Safety`, `Support Ops`, `Superadmin` | Member lookup by ID/email, per-intention status (`Active`, `Paused`, `Suspended`), verification badge management, and account standing |
| `/admin/questions` | **Questions & Scoring** *(To Add)* | `Question Steward`, `Superadmin` | **12-Theme Question Bank Steward** (`Set A` / `Set B` item text, translations, skip rates) + **Deterministic Rule Weight Inspector** (`Echo`, `Counterpoint`, `Mosaic Fit` rules & `8 Constellation Group` thresholds) |
| `/admin/groups` | **Circles & Events** | `Circle Steward`, `Trust & Safety`, `Superadmin` | Small-group Circle capacity monitoring (`12–35`), weekly prompt curation, and gathering safety checks |
| `/admin/support` | **Member Support** | `Support Ops`, `Superadmin` | Member help tickets, account recovery assistance, and onboarding feedback |
| `/admin/subscriptions` | **Subscriptions & Refunds** | `Billing Ops`, `Support Ops`, `Superadmin` | Unified `Free / Plus / Connect` subscription ledger, prorated refund processor, and **2-person co-sign workflow** for high-value adjustments |
| `/admin/privacy` | **Privacy & DPDP** | `Privacy Officer`, `Superadmin` | Statutory SLA tracker for member JSON data exports and full account erasure pipelines |
| `/admin/staff` | **Staff & RBAC** | `Superadmin`, `Security Auditor` | **10-Role Deny-by-Default Permission Matrix** clearly highlighting that `view_raw_quiz_answers` is `DENIED` across all roles |
| `/admin/audit` | **Audit Log** | `Security Auditor`, `Privacy Officer`, `Superadmin` | Immutable, hash-chained staff action log (`FNV-1a / SHA-256` chain verification) recording every case unlock, moderation decision, and role check |

---

## 3. Key Admin Screen Enhancements Over Current `src/`

### 3.1 What Current `src/` Already Implements Well (Keep)
- [`src/pages/AdminPages.tsx`](file:///c:/Users/hp/Desktop/Kithra/src/pages/AdminPages.tsx) already implements:
  - Explicit **Unprivileged Frontend Shell / WebAuthn Hardware Gate** disclosure on `/admin/login`.
  - Role filter switcher (`All`, `Trust & Safety`, `Photo Reviewer`, `Circle Steward`).
  - Clean high-density tables for `/admin/overview`, `/admin/reports` (with slide-over Case Triage Drawer), `/admin/photos`, `/admin/users`, `/admin/groups`, `/admin/support`, `/admin/subscriptions`, `/admin/privacy`, `/admin/staff`, and `/admin/audit`.
  - Full Light and Dark mode token support.

### 3.2 Two Targeted Additions to Complete the Admin Console
1. **Add `/admin/questions` (Question Bank & Personality Group Steward):**
   - Because all technical psychometric registries (`12 Canonical Themes`, `Set A / Set B`, `2,400 item slots`, `Mosaic Rule Table`, and `8 Constellation Group weights`) are being removed from the consumer UI so ordinary users aren't overwhelmed, they need a proper home in `/admin/questions`!
   - **What `/admin/questions` shows:**
     - **Tab A — 12 Canonical Themes & Question Bank:** Inspect themes (`DECIDE`, `CONNECT`, `COMPASS`, `EQUILIBRIUM`, `RHYTHM`, `HORIZON`, `ROOTS`, `GROUND`, `SPARK`, `MOSAIC`, `SHIELD`, `TIDE`), view active situational questions, inspect aggregate skip rates (`e.g., 2.4% skipped`), and preview how the *"Why we ask this"* note reads.
     - **Tab B — 8 Constellation Group Thresholds & Mosaic Rules:** Inspect the deterministic formula weights for the 8 Personality Pattern Groups and the 4 `MOSAIC_RULE_TABLE` complementarity rules (`RULE-PLAN-SPONT`, `RULE-TALK-REFLECT`, `RULE-HOST-COOK`, `RULE-SAVER-EXPERIENCE`).
     - **Explicit Privacy Guard Banner:** *"Aggregate item telemetry only. Individual member questionnaire responses are encrypted/isolated and inaccessible to all staff roles (`D-04`)."*
2. **Add 15-Minute JIT Evidence Unlock Reason Prompt in `/admin/reports` Case Drawer:**
   - Inside the existing slide-over Case Detail Drawer on `/admin/reports`, require the moderator to select a reason code (`Harassment Investigation`, `Impersonation Check`, `Scam/Financial Solicitation`) before revealing the scoped message snippet, and append that unlock event directly to the `/admin/audit` log state.

