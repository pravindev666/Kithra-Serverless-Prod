# 14 — ACCESSIBILITY (WCAG 2.2 AA) & USABILITY TEST PLAN

## 1. Inclusive Design & Accessibility Commitments (WCAG 2.2 AA)

Kithra serves users across ages (`18` to `65+`, including parents reviewing a Matrimony Family Summary Card), device tiers (from budget `₹8,000` Android phones on 3G/4G to `1440px` desktop monitors), and assistive technologies.

| Accessibility Requirement | Concrete Implementation Standard | Verification Method |
|---|---|---|
| **1. Color Contrast (`1.4.3` & `1.4.11`)** | • Body text (`--ink-1` `#172231` on `#F8F4EC`): **`14.6:1`** (Light) / **`15.1:1`** (Dark)<br>• Secondary copy (`--ink-2`): **`>= 6.4:1`**<br>• Muted metadata (`--ink-3`): **`>= 4.52:1`**<br>• Never rely on color alone to distinguish `Friendship`, `Dating`, and `Matrimony` — always pair with text label and distinct icon (`◌`, `♡`, `◇`) | Automated axe-core scan + manual token contrast table check |
| **2. Keyboard-First Navigation (`2.1.1` & `2.4.7`)** | • Full `Tab` / `Shift+Tab` traversal across all routes<br>• High-visibility `2px solid var(--ochre)` focus ring (`:focus-visible`)<br>• **Micro-Assessment Hotkeys:** Press `1`, `2`, `3`, `4` to select an option, `←` / `→` to navigate questions, `S` to skip, `Esc` to close sprint modal<br>• **Photo Crop Studio:** Arrow keys nudge crop frame; `+`/`-` adjust zoom<br>• **Drawers & Modals:** Focus trapped inside open modal and restored to trigger button on `Esc` | Manual keyboard-only walkthrough (unplug mouse) + automated Vitest keydown tests |
| **3. Touch Target Sizing (`2.5.8`)** | • Minimum interactive hit area of **`44×44px`** (and **`48×56px`** for mobile bottom navigation tabs and question answer buttons) | Viewport inspection at `360×800` and `390×844` |
| **4. Screen Reader & Landmark Semantics (`1.3.1` & `4.1.2`)** | • Semantic `<header>`, `<nav aria-label="...">`, `<main id="main-content">`, `<aside>`, and `<footer>`<br>• Skip-to-main-content link as first focusable element<br>• `aria-live="polite"` announcements when a 5-question sprint unlocks a new **Personality Pattern Group** insight or when switching active intention (`Friendship` / `Dating` / `Matrimony`)<br>• Collapsed sidebar buttons include explicit `title` and `aria-label` attributes | NVDA (Windows) / TalkBack (Android) / VoiceOver verification |
| **5. Reduced Motion & Low-Data Resilience (`2.3.3`)** | • Respects OS `prefers-reduced-motion: reduce` (renders `KithraWeave` static SVG immediately; disables slide transitions)<br>• **No-Photo / Constellation Monogram fallback** ensures slow networks or failed image loads render an editorial SVG badge instead of broken image icons | Browser DevTools `Emulate CSS prefers-reduced-motion: reduce` + `Slow 3G` throttling |

---

## 2. Responsive Breakpoint Matrix (`360px` to `1440px+`)

| Viewport Tier | Dimensions | Navigation Pattern | Discovery Layout | Micro-Assessment Layout |
|---|---|---|---|---|
| **Compact Android / iPhone Mini** | `360×800` – `390×844` | Top Intention Bar + **Persistent 5-Tab Bottom Bar** (`Home`, `Discover`, `My Pattern`, `Circles`, `Chats`) | Horizontal scrollable **Personality Group Bubbles** at top + 1-column portrait cards | Full-height centered 1-question card with thumb-zone option buttons |
| **Tablet / Foldable** | `768×1024` | Collapsible Left Sidebar (`72px` compact default) | Top/Left Group Filter + 2-column profile grid | Centered `560px` card modal |
| **Standard Desktop** | `1280×800` – `1440×900` | Collapsible Left Sidebar (`248px` expanded <-> `72px` compact, persisted in `localStorage`) | **Left Folder Rail (`240px`)** (`All`, `8 Personality Groups`, `Lenses`, `Shortlists`) + **2- or 3-column profile grid** | Centered `620px` focus card with keyboard shortcut hints (`1–4`) |

---

## 3. Eight-Persona Usability Testing Protocol

To prove that an ordinary person can use Kithra as effortlessly as Instagram, WhatsApp, or Swiggy, every core flow is tested against the **8 canonical Kithra personas** (`PERSONAS_AND_JOURNEYS.md`):

| Persona | Background & Tech Comfort | Primary Intention | Core Task to Complete Without Help | Quantitative Success Target |
|---|---|---|---|---|
| **1. Kavya (27, Bengaluru)** | Product Designer; tired of shallow dating apps | `Dating` + `Friendship` | Complete 5-card onboarding, discover her **Personality Group**, and compare 2 matches by **Everyday Scenarios** | Complete onboarding + first match story in **`< 3 minutes`** |
| **2. Arvind (31, Chennai)** | Civil Engineer; straightforward, dislikes clinical jargon | `Matrimony` | Browse compatible profiles by **Personality Group folder** and generate a **Read-Only Family Summary Card** to share with his parents on WhatsApp | Generate & revoke Family Summary Link in **`< 45 seconds`** with zero confusion |
| **3. Meera (25, Kochi / Mumbai)** | Privacy-conscious; does not want her photo public on Day 1 | `Dating` (No-Photo Mode) | Enable **Intentional No-Photo Mode**, browse matches, accept an introduction, and grant photo access to 1 trusted connection | Find & toggle No-Photo Mode in **`< 20 seconds`** |
| **4. Dev (29, Hyderabad)** | New to the city; looking for weekend hiking & book friends | `Friendship` + `Circles` | Switch to `Friendship`, join a local **Circle**, reply to the weekly prompt, and see which Circle members share his Personality Group | Join Circle & view member groups in **`< 60 seconds`** |
| **5. Saira (34, Delhi)** | Busy doctor; only has 60 seconds between shifts | `Matrimony` | Open `/member/home`, answer **Today's 60-Second Reflection (5 quick cards)** using 1-tap auto-advance, and read her unlocked insight | Complete 5-question sprint in **`< 60 seconds`** (`< 12s` per question) |
| **6. Mrs. Lakshmi (58, Parent Viewer)** | Uses WhatsApp & YouTube on an Android phone (`125%` font size) | Viewing shared **Matrimony Family Summary Link** | Open the read-only summary card shared by her son/daughter and understand why the two candidates fit without seeing any app clutter | **100% comprehension** in 15 seconds; zero horizontal scroll at `360px` |
| **7. Kabir (23, Pune)** | Keyboard-heavy power user | `Friendship` | Navigate Discover, Assessments (`1–4` hotkeys), and Photo Crop studio using only the keyboard | **Zero keyboard traps**; 100% visible focus rings |
| **8. Nisha (Trust & Safety Analyst)** | Staff Moderator | `/admin/reports` | Triage an urgent harassment report, unlock scoped evidence with an audit reason, block the offender, and verify that raw quiz answers are inaccessible | Triage & log resolution in **`< 90 seconds`** |

---

## 4. Five-Second Comprehension & Cognitive Load Acceptance Gates

Before any screen is marked production-ready, it must pass these four quantitative gates:
1. **The 5-Second Landing Test:** A first-time visitor shown `/` for 5 seconds can accurately state: (a) what Kithra is for (*Friendship, Dating, and Matrimony*), and (b) how it works (*groups people by personality & compatibility rather than swipe selfies*).
2. **The Maximum 5-Tab Navigation Rule:** Primary member navigation never exceeds **5 top-level items** (`Home`, `Discover`, `My Pattern`, `Circles`, `Messages`).
3. **The 60-Second Sprint Rule:** No questionnaire session ever forces a user to answer more than **5 cards (`~60 seconds`)** before rewarding them with a personal insight and letting them stop or continue freely.
4. **The Zero Jargon Rule:** Zero occurrences of internal specification strings (`Set A/B`, `2,400 slots`, `Model v1.2`, `0ms consent`, `BOUN_001`, `overlap band`) on any consumer screen.

