# KITHRA 2026 — FULL-PRODUCT IMPLEMENTATION PLAN & ARCHITECTURE LEDGER

**Status:** Active Execution · **Scope:** Full Product (No MVP Reductions) · **Controlling Specs:** `00_READ_FIRST/DECISIONS_AND_CONFLICTS.md`, `00_READ_FIRST/MASTER_CONTROL_SPEC.md`, `11_AI_STUDIO/START_PROMPT.md`

---

## 1. Concise File Inventory & Provenance

| Layer / Archive | Key Files | Role in Build |
|---|---|---|
| **00_READ_FIRST** | `README.md`, `DECISIONS_AND_CONFLICTS.md`, `MASTER_CONTROL_SPEC.md` | Supreme controlling authority; supersedes historical prototypes (`D-01`..`D-17`). |
| **01_PRODUCT** | `BRD_Business_Requirements.md`, `PRD_Product_Requirements.md`, `SRS_and_NFR_Requirements.md`, `CONTENT_SEO_LOCALIZATION_RD.md` | Business rules (`BR-01`..`BR-10`), functional requirements (`FR-001`..`FR-016`), SLOs, WCAG 2.2 AA & Indic localization. |
| **02_DESIGN** | `UIUX_RD_Complete_Design_System.md`, `LANDING_RD_Exact_Site_Content.md`, `AUTH_PHOTO_AND_ERRORS_RD.md`, `design-tokens.css`, `ALTERNATIVE_TOKEN_SETS.md` | Provisional **D2 Ink & Clay** + **D5 Forest & Sand** + **D1 Sunlit Humanist** tokens (Light & Dark), Fraunces + Inter + Noto typography, 11-section landing blueprint, auth/photo/error states. |
| **03_BEHAVIOR** | `MATCHING_RD_Deterministic_Psychometrics.md`, `16_SCAFFOLD/tests/matching.reference.ts` | Deterministic questionnaire engine, 12 themes × 200 items (`2,400` IDs), Echo / Counterpoint / Mosaic Fit lenses, rule-based scenario explorer. |
| **04–05_ARCH_DATA** | `ARCH_RD_Dual_Deployment.md`, `API_RD_and_Event_Contracts.md`, `DATA_RD_Privacy_Schema_and_Migrations.md`, `schema_sqlite.sql`, `schema_postgres.sql`, `openapi.yaml` | Dual-runtime monorepo contract (Cloudflare Workers/D1/R2/DO/Queues + Node/Postgres/Redis/BullMQ/Docker). |
| **06–08_OPS_FIN** | `SECURITY_RD_Threat_Model.md`, `LEGAL_COMPLIANCE_RD_India_Global.md`, `ADMIN_RD_Full_Console.md`, `BILLING_RD_Unified_Pricing.md`, `FIN_RD_Sustainability_and_Costs.md` | OWASP ASVS L2 target, DPDP 2025/2027 readiness, Palantir-inspired 3-pane staff console with JIT case-scoped evidence, Architecture C unified Free/Plus/Connect pricing. |
| **09–12_REGISTERS** | `SCREENS.csv` (104 screens), `REQUIREMENTS.csv` (194 rows), `RBAC_MATRIX.csv`, `QUESTION_BANK_2400_PLACEHOLDERS.csv`, `MOTION_FOR_REACT_COMPLETE_MATRIX.md` | Screen inventory, acceptance trace, RBAC permissions, and `motion/react` animation budget matrix. |

---

## 2. Ten Most Significant Conflicts & Blockers Resolved (`DECISIONS_AND_CONFLICTS.md`)

1. **D-01 · No AI Twins / LLMs / Brain Clones:** Historical references to "AI reflections" or "predictive twins" are purged. All matching and simulations are 100% deterministic rule evaluations over declared questionnaire responses (`₹0` AI inference cost).
2. **D-04 · Brand Palette Sign-Off Gate:** Old midnight-indigo and unvalidated teal/gold prototypes are superseded by **D2 Culture-Neutral Editorial ("Ink & Clay")** as provisional default, with live **D5 ("Forest & Sand")** and **D1 ("Sunlit Humanist")** token switching on the same screens pending founder sign-off.
3. **D-07 · Unified Pricing ("No Big Cat / Small Cat"):** Retired old `₹369 Essential OS` / `₹696 Master OS` and separate `₹399 Matrimony Intent` tiers. Implemented **Architecture C**: one unified account membership (`Free ₹0` / `Plus ₹149/mo` / `Connect ₹249/mo`, provisional) valid across all enabled modes, with safety, discovery, and post-consent chat free forever.
4. **D-08 · Honest Compatibility Scores:** Compatibility percentages are explicitly labeled as **Agreement Indices** across compared answers with **Band + Coverage (`n/100`) + Model Version (`v1.2`) + "Not a prediction" caveat**—never "100% soulmate".
5. **D-09 · Strict Mode Separation:** One identity, three independent relationship modes (**Friendship**, **Dating**, **Matrimony**). Each mode has separate unchecked consent, separate bio/preferences, per-photo visibility ACLs, and isolated discovery pools.
6. **D-10 & D-11 · Admin Entry & Staff MFA:** Admin console (`/staff`) requires verified staff identity + MFA assurance + deny-by-default RBAC (`RBAC_MATRIX.csv`). Raw questionnaire responses are never visible to any staff role (including `superadmin`).
7. **D-12 & D-16 · Truthful Media & Messaging Security:** Removed unsupported claims of client-side Signal E2EE or mandatory Aadhaar/biometric live verification where providers are not yet contracted. Media uses private bucket semantics with per-mode ACLs and honest screenshot deterrence copy; verification badges are labeled `pending provider integration`.
8. **D-05 · Typography & Indic Scripts:** Upgraded from Manrope/Plus Jakarta Sans to **Fraunces** (editorial display) + **Inter** (UI & tabular numerals) + **Noto Sans Devanagari / Tamil** script fallbacks + **JetBrains Mono** (audit/request IDs).
9. **Motion Contract (`MOTION_FOR_REACT_COMPLETE_MATRIX.md`):** Enforced strict animation budgets (`hero ≤ 520ms`, `ui ≤ 220ms`, `quiz ≤ 200ms`, `micro ≤ 140ms`, `admin ≤ 140ms`, list stagger capped at `8`), `useReducedMotion()` + Low-Data override, and **0ms instant execution** on all safety actions (Block, Report, Cancel).
10. **Psychometric & Legal Sign-Off Gates:** Question bank items carry explicit `"Draft item — shown for illustration only"` labels until psychometric and legal counsel sign-off (`OPEN_DEPENDENCIES.md`).

---

## 3. Monorepo & Application Tree

```text
Kithra-3rd/
├── IMPLEMENTATION_PLAN.md                 # Full traceability & execution plan
├── OPEN_DEPENDENCIES.md                   # External human/legal/provider blockers
├── BUILD_PROGRESS.csv                     # Module-by-module implementation ledger
├── index.html                             # Fraunces + Inter + Noto + JetBrains Mono
├── package.json                           # React 19, Vite, Tailwind 4, motion/framer-motion
├── src/
│   ├── index.css                          # D2 (default), D5, D1 light/dark semantic tokens
│   ├── types.ts                           # Full domain, mode, screen, RBAC & state types
│   ├── lib/
│   │   ├── motion.ts                      # Motion budget presets, variants & reduced-motion hook
│   │   └── i18n.ts                        # EN / HI / TA / TE / ML / KN / BN locale dictionary
│   ├── domain/
│   │   ├── matching.ts                    # Deterministic Echo, Counterpoint, Mosaic & Simulator
│   │   └── rbac.ts                        # Staff RBAC/ABAC policy & hash-chained audit verifier
│   ├── data/
│   │   ├── questions.ts                   # 12 themes, versioned items & 2,400-item bank registry
│   │   ├── mockMatches.ts                 # Mode-isolated Friendship, Dating & Matrimony profiles
│   │   ├── mockReport.ts                  # Deterministic pattern dimensions & coverage data
│   │   └── faq.ts                         # Honest FAQ & legal/privacy draft copy
│   └── components/
│       ├── Navbar.tsx                     # Sticky editorial nav, palette/locale/theme switchers
│       ├── LandingPage.tsx                # S0–S10 complete editorial landing & interactive map
│       ├── HeroSplitScreen.tsx            # Interactive Relationship Map SVG & 4:5 editorial frame
│       ├── ConstellationViz.tsx           # Declared-dimension node/edge graph (Palantir P3 transfer)
│       ├── RadarChart.tsx                 # 8-dimension pattern balance chart
│       ├── LoginPage.tsx                  # Full-screen /sign-in with all 9 auth states
│       ├── SignupPage.tsx                 # /sign-up + 18+ gate + 3-mode consent onboarding
│       ├── UserSidebar.tsx                # 240px desktop rail + 5-tab mobile bottom bar
│       ├── UserTopHeader.tsx              # Mode switcher chip, palette/theme/low-data & ⌘K
│       ├── HomeDashboardView.tsx          # MEM-001 mode summary, coverage & next actions
│       ├── AssessmentView.tsx             # MEM-009..011 12-theme catalog & directional quiz
│       ├── CompatibilityReportView.tsx    # MEM-008/012 "My Patterns", coverage & withdraw flow
│       ├── MatchesView.tsx                # MEM-002..007 mode-isolated Discover, 3 lenses & simulator
│       ├── MessagingView.tsx              # MEM-018..021 mutual requests, 1:1 chat & 1-tap safety
│       ├── JournalView.tsx                # MEM-022..024 Circles & Communities + Reflections
│       ├── InsightsView.tsx               # Scenario simulator & pattern history
│       ├── ProfileView.tsx                # MEM-026..027 per-mode persona & 4:5 photo ACL gallery
│       ├── BillingView.tsx                # MEM-032..035 Unified Free/Plus/Connect & 1-step cancel
│       ├── SecurityView.tsx               # MEM-028..031, 038 Consent dashboard, Export & Delete
│       ├── SettingsView.tsx               # MEM-036..037 A11y, Language, Support & HTTP Error Pages
│       └── AdminView.tsx                  # ADM-000..023 3-pane staff console, JIT evidence & audit
```

---

## 4. Route & Screen Counts (`SCREENS.csv` — 104 Total Screens)

- **Public & Error Surface (`PUB-001`..`PUB-027`):** **27 screens** (Landing `S0`–`S10`, How It Works, Friendship, Dating, Matrimony, Assessments, Safety Center, Pricing, About, Contact, Help, Accessibility, Privacy, Terms, Cookies, Community Guidelines, Refunds, Grievance, Data Rights, Status, plus HTTP `404`, `403`, `410`, `429`, `500`, `503`, `Offline`).
- **Authentication & Progressive Onboarding (`AUTH-001`..`AUTH-014`):** **14 screens** (`Sign in`, `Create account`, `Verify email`, `Forgot password`, `Reset password`, `OAuth callback`, `Session expired`, `18+ Age gate`, `Relationship Mode chooser`, `Per-mode Consent`, `Base profile`, `Privacy intro`, `Onboarding complete`, `Staff MFA sign-in`).
- **Authenticated Member Surface (`MEM-001`..`MEM-039`):** **39 screens** (Home, Mode-Scoped Discover, Search/Filters, Side-by-Side Compare, Echo, Counterpoint, Mosaic Fit, My Patterns, Theme Catalog, Questionnaire Progress, Directional Quiz Item, Scored Results, Interests, Mode Switcher, Friendship/Dating/Matrimony Mode Homes, Connection Requests, Mutual Matches, Inbox, 1:1 Messaging, Group Chats, Circles, Circle Creation, Notifications, Per-Mode Profile Edit, Photo Gallery & Crop/ACL, Privacy Consent Center, Safety Center, 4-Step Report/Block, Appeals, Unified Subscriptions, Receipts, Plan Change, One-Step Cancel/Refund, Help/Support, Accessibility/Language, DPDP Export/Delete, Honest Verification Status).
- **Staff Admin Operations (`ADM-000`..`ADM-023`):** **24 screens** (Admin MFA Sign-In, Overview/SLA Health, Case-Scoped User Search, Trust/Verification, Photo Moderation, Reports & Urgent Safety, Anti-Spam/Fraud, JIT Messaging Abuse Evidence, Circles Moderation, Question Bank CMS, Scoring Version Release Gate, Support Inbox, Payments/2-Person Refunds, Subscriptions, Staff/RBAC, Privacy/DPDP Jobs, Grievance Handling, Compliance Reports, Hash-Chained Audit Logs, Cohort-Safe Analytics, System Health, Incident Response, Feature Flags, Operational Settings/Appeals).

---

## 5. Ten Execution Milestones (Full Scope Retained)

1. **M1 — Workspace, Semantic Tokens (`D2`/`D5`/`D1`), Typography & Motion Engine:** Complete CSS token system (light/dark + 3 founder palettes), `motion/react` budget presets, and `useReducedMotion` + Low-Data hooks.
2. **M2 — Deterministic Matching, Complementarity Rules & RBAC Domain Core:** Pure TS `echoAgreement`, `counterpointIndex`, `mosaicFit`, `simulateDeterministicScenario`, mode isolation guard, and deny-by-default staff RBAC + hash-chained audit log.
3. **M3 — Public Editorial Landing (`S0`–`S10`), Palette Comparator & Error Pages (`PUB-001`..`027`):** Full 11-section D2 editorial landing, interactive Relationship Map demo, H-A/H-B/H-C headline tester, and all HTTP error states (`404/403/410/429/500/503/offline`).
4. **M4 — Full-Screen Auth, 18+ Gate & Per-Mode Consent Onboarding (`AUTH-001`..`014`):** Desktop split / mobile banner sign-in with all 9 validation/network states, signup with unchecked 18+ gate, and independent Friendship/Dating/Matrimony consent onboarding.
5. **M5 — Member Shell, Mode Switcher & Mode-Isolated Home (`MEM-001, 014..017`):** Persistent 240px sidebar + 5-tab mobile bar, top-bar mode switcher with `layoutId`, mode-specific guidance cards, and zero cross-mode data leakage.
6. **M6 — 12-Theme Question Bank, Directional Quiz & "My Patterns" (`MEM-008..013`):** 2,400-placeholder bank registry, directional `AnimatePresence` quiz item flow (`≤200ms`), save/resume/skip, draft-item honesty badges, and My Patterns with withdraw control.
7. **M7 — Mode-Scoped Discover, Echo/Counterpoint/Mosaic Lenses & Compare (`MEM-002..007`):** Candidate cards with band + coverage + model version `v1.2`, side-by-side compare, deterministic scenario simulator, and match detail drawer.
8. **M8 — Photo Gallery (`4:5` Crop & Per-Mode ACLs), Mutual Messaging & Circles (`MEM-018..027`):** Per-photo mode visibility matrix, EXIF/moderation pipeline states, mutual-request-gated 1:1 messaging with 0ms safety bar, and mode-scoped Circles.
9. **M9 — Unified Membership (`Free`/`Plus`/`Connect`), One-Step Cancel & DPDP Rights (`MEM-028..039`):** Architecture C unified pricing, 1/3/6/12-month billing, one-step cancel/refund, 4-step safety report (`KT-xxxx`), JSON data export, and account deletion.
10. **M10 — 3-Pane Palantir-Inspired Staff Admin Console (`ADM-000`..`023`) & Verification:** Staff MFA gate, 10-role RBAC switcher, SLA queue, Case Entity Graph, JIT redacted evidence grant, 2-person refund approval, and tamper-evident audit chain verification.

