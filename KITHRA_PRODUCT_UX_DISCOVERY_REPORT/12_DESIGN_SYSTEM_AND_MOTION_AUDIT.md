# 12 — DESIGN SYSTEM, VISUAL IDENTITY & MOTION AUDIT

## 1. Approved Color Palette: Coromandel Indigo & Ochre (Locked)

Per Founder Directive #5, Kithra's visual identity is strictly locked to **Coromandel Indigo & Ochre** across Light and Dark modes, as currently implemented in [`src/index.css`](file:///c:/Users/hp/Desktop/Kithra/src/index.css).

### 1.1 Light Mode Tokens
| Token Name | Hex Value | Visual Role | WCAG 2.2 AA Contrast Verification |
|---|---|---|---|
| `--bg` | `#F8F4EC` | Warm Ivory Primary Canvas | Base canvas |
| `--surface-1` | `#F2ECE0` | Warm Sand Secondary Surface / Sidebar / Folder Rail | `1.08:1` subtle surface step against `--bg` |
| `--surface-2` | `#FFFFFF` | Elevated Interactive Card Surface | Crisp card elevation |
| `--ink-1` | `#172231` | Primary Body Copy & Functional UI Labels | **`14.6:1`** on `#F8F4EC` (Exceeds AAA `7:1`) |
| `--ink-2` | `#4E5A68` | Supporting Descriptions & Subtitles | **`6.4:1`** on `#F8F4EC` (Exceeds AA `4.5:1`) |
| `--ink-3` | `#667280` | Secondary Metadata & Captions | **`4.52:1`** on `#FFFFFF` (Meets AA `4.5:1`) |
| `--indigo` | `#1F2F46` | Coromandel Indigo Primary Brand & Editorial Headings | **`12.4:1`** on `#F8F4EC` (Exceeds AAA) |
| `--ochre` | `#C9962E` | Restrained Ochre Accent / Active Highlights / Weave Glow | Used for accents, borders, and dark-surface highlights |
| `--ochre-soft` | `#E7D7B7` | Soft Ochre Pill & Highlight Surface (`#172231` text on top) | **`11.2:1`** with `--ink-1` text |
| `--border` | `#DDD3C2` | Subtle Warm Hairline Border (`1px`) | Clean structural separation without harsh black boxes |

### 1.2 Dark Mode Tokens (`[data-theme="dark"]`)
| Token Name | Hex Value | Visual Role | WCAG 2.2 AA Contrast Verification |
|---|---|---|---|
| `--bg` | `#0E1722` | Deep Midnight Indigo Primary Canvas | Base canvas |
| `--surface-1` | `#142233` | Elevated Sidebar / Secondary Surface | Clean depth hierarchy |
| `--surface-2` | `#1A2B3F` | Interactive Card Surface | Distinct from background without glowing borders |
| `--ink-1` | `#F3EFE7` | Warm Parchment Primary Text | **`15.1:1`** on `#0E1722` (Exceeds AAA) |
| `--ink-2` | `#C5BEB1` | Supporting Copy | **`9.4:1`** on `#0E1722` (Exceeds AAA) |
| `--ink-3` | `#8F99A6` | Muted Metadata | **`5.3:1`** on `#0E1722` (Exceeds AA) |
| `--border` | `#283C54` | Subtle Slate-Indigo Hairline | Non-glare dark border |

### 1.3 Relationship Intention & Semantic Accent Tokens
Each relationship room has a subtle, unmistakable semantic accent badge so members always feel grounded in their active room:
- **Friendship (`--friend`):** Muted Coromandel Teal (`#3D7570` Light / `#5BA39C` Dark)
- **Dating (`--date`):** Warm Terracotta Clay (`#A85858` Light / `#D47A7A` Dark)
- **Matrimony (`--marry`):** Deep Marigold / Plum (`#823F4E` Light / `#C87A8B` Dark)
- **Semantic Status:** `--success` (`#2E6B4E`), `--warning` (`#A66B1F`), `--danger` (`#A63A3A`)

---

## 2. Typography System: Cormorant Garamond + DM Sans (Locked)

| Typography Role | Font Family | Allowed Usage | Prohibited Usage |
|---|---|---|---|
| **Editorial Display & Major Section Headings (`--font-serif`)** | **Cormorant Garamond** (`500`, `600`, `700`) | • Landing page hero & section titles<br>• Member greeting (*"Good evening, Kavya"*)<br>• Personality Pattern Group titles (*"The Steady Anchor"*)<br>• Match Pairing Headline | Never use for tiny badges, table cells, form inputs, settings toggles, or long multi-paragraph technical text |
| **Functional UI, Body Copy, Cards, Forms & Tables (`--font-sans`)** | **DM Sans** (`400`, `500`, `600`, `700`) | • All navigation items, buttons, pills, and tabs<br>• Question cards and answer options<br>• Profile bios, compatibility bullet points, and chat messages<br>• All Admin Console tables, filters, and drawers | Avoid `10px` all-caps tracking walls (`text-[10px] uppercase tracking-widest`); minimum functional badge size is `12px` (`0.75rem`) |

### Type Scale & Spacing Discipline (`8px` Grid)
- **Body Copy:** `15px–16px` (`0.9375rem–1rem`), line-height `1.6`, max line width `65ch`.
- **Card Titles:** `18px–20px` (`1.125rem–1.25rem`), line-height `1.35`.
- **Section Headings:** `24px–32px` (`1.5rem–2rem` Cormorant Garamond).
- **Spacing Rhythm:** Strictly `8px` multiples (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`). Maximum **3 data points per card row** and **1 primary button per card**.

---

## 3. Motion & Animation Budget Audit (`motion/react`)

Every animation in Kithra must serve **spatial orientation, tactile feedback, or calm brand delight**—never perpetual distraction.

| Surface / Interaction | Animation Spec (`motion/react`) | Duration & Easing | Reduced-Motion (`prefers-reduced-motion: reduce`) Fallback |
|---|---|---|---|
| **1. Landing Hero (`KithraWeave.tsx`)** | One-shot SVG `pathLength` (`0 -> 1`) draw across the 3 interwoven strands, staggered by `180ms`, followed by soft fade-in of central ochre meeting point | **`1.4s–1.5s` total**, `easeOut` (`[0.22, 1, 0.36, 1]`). **Zero infinite loops.** | Renders completed static SVG immediately (`pathLength: 1, opacity: 1`) |
| **2. Collapsible Sidebar (`AppShell`)** | Smooth width transition (`248px <-> 72px`) + label opacity fade | **`200ms`**, cubic-bezier `[0.22, 1, 0.36, 1]` | Instant width snap (`0ms`) |
| **3. 1-Question-at-a-Time Micro-Card Auto-Advance** | Option tap highlights ochre check (`150ms`), pauses briefly (`100ms` so user sees confirmation), then cross-slides (`x: 16 -> 0`, `opacity: 0 -> 1`) to next card | **`250ms` advance delay + `180ms` card transition** | Instant card swap (`opacity` only, `0ms` slide) |
| **4. 5-Question Completion Micro-Reward Card** | Subtle scale & fade entrance (`scale: 0.97 -> 1`, `opacity: 0 -> 1`) | **`220ms`** | Instant appear |
| **5. Slide-Over Drawers (Match Details, Family Summary, Admin Case Triage)** | Right-hand sheet slide (`x: 24px -> 0`, `opacity: 0 -> 1`) with backdrop fade | **`180ms`** | Instant appear |
| **6. Safety & Privacy Controls (`Block`, `Report`, `Pause Mode`, `Revoke Family Link`)** | **Zero decorative animation (`0ms`)** — Safety state changes must execute and confirm instantaneously | **`0ms` (Instant)** | **`0ms` (Instant)** |

