# Kithra — Complete 360° UI/UX, Usability & Frontend Quality Audit
## `01_REPOSITORY_AND_ROUTE_INVENTORY.md`

**Audit Baseline Commit:** `e6555ce` (*"Baseline before hero/sidebar/home redesign and UX audit"*)  
**Scope:** Complete Frontend Shell (`c:\Users\hp\Desktop\Kithra`) — React 19, TypeScript, Tailwind CSS v4, `motion/react`, `lucide-react`.

---

## Phase 1 — Product Architecture & Domain Boundaries

Kithra is a human-centered social platform supporting **three independent relationship intentions** under a single account:

1. **Friendship** (`--friend`: `#3D7570` light / `#76BDB6` dark)
2. **Dating** (`--date`: `#A85858` light / `#E09898` dark)
3. **Matrimony** (`--marry`: `#823F4E` light / `#D48A9B` dark)

### Non-Negotiable Product Invariants
- **Strict Per-Intention Isolation:** Profile visibility, personal preferences, photographs (`visibleIn: Record<IntentionId, boolean>`), and discoverability are controlled independently per intention with zero automatic crossover.
- **Deterministic Questionnaire Compatibility (No AI / LLM Runtime):** Kithra uses versioned, deterministic questionnaire scoring and defined database relationships to surface **Echo** (measured similarities), **Counterpoint** (significant differences surfaced early with candour), and **Mosaic Fit** (useful complementarity). No AI twins, LLM chat agents, or predictive soulmate percentages exist anywhere in the codebase.
- **Unified Membership Ladder:** One account-wide membership (**Free**, **Plus**, **Connect**) covers all enabled intentions. Safety, blocking, reporting, and visibility controls are never paywalled.

---

## Phase 2 — Repository Inspection, Dependency Audit & Route Inventory

### 2.1 Repository File Inventory (Baseline)

| File Path | Lines | Role & Audit Findings |
|---|---:|---|
| `package.json` | 33 | **Defect Found & Fixed:** `devDependencies.esbuild` was pinned to `^0.25.0`, conflicting with `vite@^8.3.0`'s peer requirement (`^0.27.0 \|\| ^0.28.0`) and breaking `npm install`. Updated to `^0.27.0`. Unused `autoprefixer` devDependency noted (Tailwind v4 `@tailwindcss/vite` handles vendor prefixing natively). |
| `index.html` | 21 | Loads Google Fonts (`Cormorant Garamond`, `DM Sans`, `Noto Sans`). **Defect Found & Fixed:** Contained `<link rel="preload" as="image" href="https://images.unsplash.com/...">` for the old photographic hero, wasting bandwidth now that the hero uses inline vector artwork (`KithraWeave`). |
| `src/index.css` | 101 | Defines Coromandel Indigo & Ochre CSS custom properties (`:root` and `html.dark`), focus-visible outlines (`3px solid var(--ochre)`), and `.reduce-motion` overrides. Extended with `--weave-indigo`, `--weave-teal`, `--weave-clay`, `--weave-ochre`, `--sidebar-expanded: 248px`, and `--sidebar-collapsed: 72px`. |
| `src/App.tsx` | 737 | Root router (`parsePathnameToRoute`, `window.history.pushState`, `popstate`), theme/reduced-motion state, and global consumer header/footer. **Defect Found:** Wrapped both Public marketing pages and Authenticated Member/Admin workspaces in the same `max-w-[1160px]` centered container with a public marketing header (`Explore member shell`, `Photo studio`) and marketing footer, making the Member and Admin workspaces feel like embedded preview widgets inside a marketing page rather than a true application shell. |
| `src/components/CoromandelThreadsHero.tsx` | 242 | **Defect Found & Replaced:** Used 2.5D pointer-parallax (`rotateX`/`rotateY`), two overlapping Unsplash photographs, dashed SVG lines, and a floating caption card. Replaced with `KithraHero.tsx` + `KithraWeave.tsx`. |
| `src/components/PublicViews.tsx` | 1,461 | Contains `LandingView`, `AuthView`, `OnboardingView`, and `PricingView`. Audited for copy clarity, FAQ completeness, password visibility controls, and reduced-motion compliance. |
| `src/components/MemberViews.tsx` | 2,617 | Contains `MemberShell` across 11 member tabs (`home`, `discover`, `connections`, `match`, `messages`, `circles`, `assessments`, `photos`, `profile`, `privacy`, `settings`, `more`). **Defects Found:** Non-collapsible `225px` sidebar; Member Home looked like a technical status dashboard (`100-question reflection bank`, `Photos & 4:5 crop studio`, `Independent intentions` status boxes, `Simulated member workspace · Overview` eyebrow); excessive uppercase metadata and developer terminology (`Simulated profile`, `reflection bank`, `Preview moderation states`). |
| `src/components/AdminViews.tsx` | 962 | Contains `AdminLoginView` and `AdminShell` across 10 operational tabs (`overview`, `reports`, `photos`, `users`, `groups`, `support`, `subscriptions`, `privacy`, `staff`, `audit`) + slide-over Case Triage Drawer. **Defect Found:** Used a non-collapsible `225px` sidebar and lacked role-aware navigation filtering or a dedicated theme toggle once inside the full-height admin shell. |
| `src/components/SystemStatesView.tsx` | 408 | Standalone error/system state views (`404`, `403`, `410`, `429`, `500`, `503`, `offline`, `empty`, `loading`, `image-fallback`, `validation`) and developer-only `/__preview` route directory. |
| `src/components/EditorialImage.tsx` | 89 | Resilient portrait component with automatic SVG data-URI fallback (`getEditorialSvgDataUrl`) and offline fallback card. |
| `src/data/mockFixtures.ts` | 1,190 | Deterministic fixtures for intentions, signal vocabulary, 5-theme question map, 6 member profiles, 3 member photos, 5 interactive assessment questions, 2 conversation threads, 4 community Circles, 4 staff cases, 2 photo moderation items, audit log, and route inventory. |
| `src/utils/kithraLogic.ts` & `.test.ts` | 385 / 275 | Pure functions and 5 node:test suites covering route parsing, profile filtering, auth validation, photo visibility/reordering/crop math, signal grouping, staff case filtering, and assessment progress. |

---

### 2.2 Complete Accessible Route & State Inventory

Every route below is reachable via real browser pathnames (`window.location.pathname` + `popstate`) and verified for keyboard, screen-reader, and responsive behavior:

| Pathname | Shell | Screen / Component | Key Interactive & Demonstration States |
|---|---|---|---|
| `/` | Public | `LandingView` + `KithraHero` (`KithraWeave`) | Hero CTA (`Get started`, `How it works`), Three Intentions cards, 4-step How It Works, Interactive Echo/Counterpoint/Mosaic Fit lens switcher, Per-intention boundary preview, Unified Membership preview (`Free`/`Plus`/`Connect`), FAQ accordion, Quiet Footer |
| `/signin` | Public | `AuthView` (`mode="signin"`) | Email/password validation, show/hide password toggle, Google sign-in demonstration state, invalid credentials & expired link preview triggers, forgot-password link |
| `/join` | Public | `AuthView` (`mode="join"`) | Name, primary city, email, password with show/hide toggle, consent & policy acknowledgement checkbox |
| `/forgot-password` (`/recover`) | Public | `AuthView` (`mode="recover"`) | Account recovery email validation & reset link instructions state |
| `/verify-email` | Public | `AuthView` (`mode="verify-email"`) | 6-digit verification code input, expired link recovery state, resend code feedback |
| `/locked` | Public | `AuthView` (`mode="locked"`) | 30-minute safety cooldown notice with password-reset recovery path |
| `/onboarding` | Public | `OnboardingView` (Steps 1–5) | Step 1: Intention selector; Step 2: City & languages; Step 3: Conversational pace & visibility; Step 4: Optional photo introduction (skippable); Step 5: Single sample question (non-blocking — never forces 100 questions upfront) |
| `/pricing` | Public | `PricingView` | Unified Free / Plus / Connect comparison table + Illustrative vs Coming-soon toggle |
| `/member` (`/member/home`) | Member (`AppShell`) | `MemberShell` (`activeTab="home"`) | **Redesigned Human-Centered Home:** 1. Greeting & active relationship intention switcher; 2. Discover people (prioritized cards); 3. Recent conversations; 4. Relevant Circles & communities; 5. Continue your assessment (secondary); 6. Complete your profile & photos (secondary); 7. Privacy & account controls link |
| `/member/discover` | Member (`AppShell`) | `MemberShell` (`activeTab="discover"`) | Single clear relationship intention selector with boundary indicator, city/keyword/saved filters, profile cards with primary information priority, expandable Echo/Counterpoint/Mosaic summary, thoughtful introduction note modal |
| `/member/connections` | Member (`AppShell`) | `MemberShell` (`activeTab="connections"`) | Mutual connections, sent introduction notes, and saved profiles across intentions |
| `/member/match/:id` | Member (`AppShell`) | `MemberShell` (`activeTab="match"`) | Member switcher (`member-aarav`, `member-meera`, etc.), signal filter tabs (`All`, `Echo`, `Counterpoint`, `Mosaic Fit`), collapsible Measured Alignment Details Sheet |
| `/member/messages` | Member (`AppShell`) | `MemberShell` (`activeTab="messages"`) | Intention-badged thread list, active conversation history, starter prompt chips, message composer |
| `/member/circles` | Member (`AppShell`) | `MemberShell` (`activeTab="circles"`) | Hosted walks, listening rooms, and small-table conversations with Join/Leave RSVP state |
| `/member/assessments` | Member (`AppShell`) | `MemberShell` (`activeTab="assessments"`) | 5-theme overview, interactive question cards with "Why we ask this" explanation, save & return anytime |
| `/member/photos` | Member (`AppShell`) | `MemberShell` (`activeTab="photos"`) | Local file preview (`URL.createObjectURL`), 4:5 crop/zoom/rotate/nudge studio, per-intention visibility switches (`Friendship`, `Dating`, `Matrimony`) with zero automatic crossover, reorder, delete confirmation, lightbox |
| `/member/profile` | Member (`AppShell`) | `MemberShell` (`activeTab="profile"`) | Live profile editor paired with side-by-side per-intention appearance preview (`Friendship`, `Dating`, `Matrimony`) |
| `/member/privacy` | Member (`AppShell`) | `MemberShell` (`activeTab="privacy"`) | Per-intention visibility matrix, discoverability toggles, and portable JSON archive export preview |
| `/member/settings` | Member (`AppShell`) | `MemberShell` (`activeTab="settings"`) | Light/Dark theme switch, Reduced-motion switch, active relationship intentions, conversational pace |
| `/admin/login` | Admin | `AdminLoginView` | Unprivileged staff WebAuthn / FIDO2 login gate specification |
| `/admin` (`/admin/overview` .. `/admin/audit`) | Admin (`AppShell`) | `AdminShell` | **Collapsible sidebar (`248px` / `72px`)**, role-aware navigation selector (`All Staff Queues`, `Trust & Safety Specialist`, `Photo Reviewer`, `Circle Steward`), overview metric cards, reports & moderation queue table, slide-over case-detail drawer, photo review cards, users & groups tables, support, subscriptions, privacy, RBAC matrix, and live audit trail |
| `/404`, `/403`, `/410`, `/429`, `/500`, `/503`, `/offline`, `/empty`, `/loading`, `/image-error` | System States | `SystemStatesView` | Standalone product error/fallback screens |
| `/__preview` | Developer QA | `SystemStatesView` (`isDevPreviewRoute=true`) | Clickable route inventory & state inspector |

---

## Phase 3 — Visual Identity & Accessibility Audit

### 3.1 Approved Coromandel Indigo & Ochre Palette Verification
- **Light Mode:** Background `#F8F4EC`, Surface `#FFFFFF`, Elevated/Secondary Surface `#F0E7D8` (warm sand), Primary Indigo `#1F2F46`, Ochre Accent `#C9962E`, Accessible Ochre Text `#6E4B08` (contrast ratio `6.4:1` on `#F8F4EC`, exceeding WCAG AA `4.5:1`).
- **Dark Mode:** Background `#0E1722`, Surface `#142233`, Elevated Surface `#1A2B3F` / `#1C2E44`, Primary Text `#F3EFE7`, Heading `#F7F4EE`, Ochre Accent `#C9962E` / `#E5B957`, Muted Text `#D0C9BD` (contrast ratio `10.1:1` on `#142233`).
- **The Kithra Weave Palette:** Uses Coromandel Indigo (`--weave-indigo`), muted teal (`--weave-teal`), soft clay (`--weave-clay`), and restrained ochre (`--weave-ochre`) with theme-adapted luminance so the artwork looks balanced on both warm parchment (`#F8F4EC`) and deep night indigo (`#0E1722`).

### 3.2 Typography & Hierarchy Corrections
- **Cormorant Garamond (`.font-serif-editorial`):** Reserved strictly for major editorial headings (landing hero & section headlines, page titles, and member names on profile cards). Previously overused on small stat counters (`32 of 100 saved`, `3 portraits configured`), sidebar titles, and minor card subheadings.
- **DM Sans (`.font-sans-ui`):** Used for all body copy (`16px` / `1rem` base, line-height `1.6`), navigation items, form labels, tables, buttons, badges, and the entire Admin Console.
- **Eliminated Tiny Uppercase Metadata Overload:** Replaced repetitive `10px–11px` uppercase developer eyebrows (`SIMULATED MEMBER WORKSPACE · OVERVIEW`, `SIMULATED PROFILE · FICTIONAL PREVIEW DATA`, `STEP 1 · CHOOSE ACTIVE DISCOVERY SCOPE`) with calm, readable human subtitles.

---

## Phase 4 — Intuitive UX & Cognitive Load Audit

### Key Usability Defects Identified & Resolved

1. **Defect — Double Navigation Bars in Member & Admin Views:**
   - *Before:* `App.tsx` rendered a public marketing top header (`Member home`, `Discover`, `Your photos`, `Reflections`, `Membership`, `Photo studio` CTA) *above* `MemberShell`'s sidebar, and rendered the public marketing header above `AdminShell`'s staff sidebar. Users faced two competing navigation bars with different items and anconstrained `1160px` wrapper that left wide empty gutters on `1280px` and `1440px` screens.
   - *Resolution:* Member (`/member/*`) and Admin (`/admin/*`, except `/admin/login`) now render inside the dedicated full-viewport `AppShell` with a single, cohesive collapsible sidebar (`248px` expanded / `72px` collapsed) on desktop and a clean top header + accessible drawer / bottom bar on mobile. Content expands smoothly across the available viewport with zero wasted gutter.

2. **Defect — Member Home Looked Like an Internal Project Dashboard:**
   - *Before:* Member Home opened with three equal status boxes: `Independent intentions`, `100-question reflection bank (34 of 100 saved)`, and `Photos & 4:5 crop studio (3 portraits configured)`, followed by raw text rows. People were buried below configuration metrics.
   - *Resolution:* Redesigned Member Home around human priorities:
     1. **Friendly greeting & single active relationship intention switcher** (Friendship, Dating, Matrimony) showing the active privacy boundary in plain English.
     2. **Discover people** — visually prioritized portrait cards for the active intention right at the top of the home workspace.
     3. **Recent conversations** — direct preview of active threads with one-click reply.
     4. **Relevant Circles & communities** — upcoming small-group gatherings in the member's city.
     5. **Continue your assessment & Complete your profile** — quiet, secondary cards below the social experience.
     6. **Privacy and account controls** — cleanly linked in their proper section without cluttering the top of the screen.

3. **Defect — Developer & QA Jargon in Consumer UI:**
   - *Before:* User-facing screens contained phrases like `"Explore member shell"`, `"reflection bank"`, `"100-Question Reflection Map"`, `"Simulated profile"`, `"Preview moderation states on selected photo"`.
   - *Resolution:* Replaced with natural, human-centered language (`"Discover people"`, `"Your connections"`, `"Continue getting to know yourself"`, `"Conversations"`, `"Explore Circles"`, `"Questions & values"`, `"Photos"`).

---

## Phase 5 — Landing Page & Kithra Weave Hero Audit

- **Removed:** `CoromandelThreadsHero.tsx` (2.5D pointer tilt, Unsplash portraits in the hero, dashed flowchart lines, floating caption box).
- **Created:** `KithraWeave.tsx` & `KithraHero.tsx`.
  - Three interwoven organic strokes (Coromandel Indigo, muted teal, soft clay) with genuine over-under Borromean crossings and a warm, restrained ochre central meeting point.
  - Animates once via `motion/react` `pathLength` (staggered `0s`, `0.12s`, `0.24s`, duration `0.95s`) and fades the central overlap in by `1.4s` total — well within the ~1.5s budget, with zero perpetual loops or 3D rotations.
  - Respects both system `prefers-reduced-motion: reduce` and the in-app Reduced Motion toggle (`initial={false}` renders the completed static artwork immediately).
  - Left column uses exact required copy:
    - Eyebrow: `CONNECTIONS WITH INTENTION`
    - Headline: `Find your kind of people.`
    - Supporting description about friendship, dating and matrimony
    - Primary CTA: `Get started`
    - Secondary CTA: `How it works`
  - Added a clear **Frequently Asked Questions (FAQ)** section on the landing page addressing cross-intention privacy, how Echo/Counterpoint/Mosaic Fit work without AI, and unified membership.

---

## Phase 6 — Authentication & Onboarding UX Audit

- **Password Visibility Toggle:** Added accessible `Show password` / `Hide password` button (`Eye` / `EyeOff`) on Sign In and Create Account forms.
- **Explicit Demonstration States:** Added quick, clearly labeled demonstration triggers for **Invalid credentials**, **Expired verification/reset link**, **Email verification**, and **Account cooldown** so reviewers can inspect every authentication edge state without pretending a live backend session exists.
- **Consent & Policy Acknowledgement:** Added clear terms and per-intention privacy boundary acknowledgement on account creation.
- **Unhurried Onboarding:** Clearly labels which steps are required vs optional (photo upload and the 100-question assessment can be completed anytime later).

---

## Phase 7 — Collapsible Sidebar & Admin Console Architecture

- **Reusable `AppShell` (`src/components/AppShell.tsx`):**
  - **Desktop (`>= 1024px`):** `248px` expanded width, `72px` collapsed width (`--sidebar-expanded`, `--sidebar-collapsed`).
  - **Toggle Control:** Keyboard-accessible button in the sidebar header (`aria-expanded`, `aria-controls`, visible `3px solid var(--ochre)` focus ring).
  - **Persistence:** Saves `"expanded"` / `"collapsed"` to `localStorage` (`kithra-member-sidebar`, `kithra-admin-sidebar`) and restores automatically on reload.
  - **Tooltips:** Compact mode displays clean icons and shows accessible floating tooltips on both pointer hover and keyboard focus (`onMouseEnter`, `onFocus`, dismissible with `Escape`).
  - **Mobile (`< 1024px`):** No permanently fixed desktop sidebar. Renders a compact top bar + 5-slot bottom navigation bar (for members) and a slide-over modal navigation drawer (`role="dialog"`, `aria-modal="true"`) that traps focus, closes on navigation or `Escape`, and restores focus to the trigger button.
- **Role-Aware Admin Console (`src/components/AdminViews.tsx`):**
  - Uses the same `AppShell` architecture with `contentMaxWidth="100%"` for operational density.
  - Adds a **Staff Role Filter** (`All Staff Queues`, `Trust & Safety Specialist`, `Photo Reviewer`, `Circle Steward`) in the sidebar header that dynamically scopes visible navigation items to match the RBAC matrix while keeping all 10 administrative queues accessible.

