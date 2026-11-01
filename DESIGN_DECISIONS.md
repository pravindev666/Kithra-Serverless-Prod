# Kithra — Architecture, Visual Polish & Design Decisions (`DESIGN_DECISIONS.md`)

## 1. Information Architecture & Consumer Hygiene (P0)
- **Removed Public Design-Preview Bar & Staff Links:** The consumer header (`src/App.tsx`) contains only genuine product navigation (`Intentions`, `How it works`, `Compatibility`, `Membership`, `Explore member shell`, theme switcher, and `Sign in / Join`).
- **Developer-Only QA Route (`/__preview`):** The route directory and system-state switcher now live exclusively at `/__preview` (`SystemStatesView` with `isDevPreviewRoute=true`). Individual error routes (`/404`, `/403`, `/410`, `/429`, `/500`, `/503`, `/offline`, `/empty`, `/loading`, `/image-error`) render as clean, standalone product pages.
- **Dedicated Unprivileged Staff Gate (`/admin/login`):** Staff access is never linked in the consumer header. Visiting `/admin/login` displays a prominent notice that WebAuthn hardware-key MFA and RBAC are non-functional pending AGY backend integration, with an explicit link to inspect the simulated staff layout (`/admin/overview`).
- **Real Browser Pathname Routing:** Implemented via `parsePathnameToRoute`, `getPageTitleForRoute`, `window.history.pushState`, and a `popstate` listener in `src/App.tsx`, supporting deep links, browser back/forward, scroll restoration, and accessible heading focus management.

## 2. Coromandel Indigo & Ochre Visual System & Typography
- **Palette Preservation:** Strict adherence to `Kithra_Theme_Preview.html` CSS custom properties (`--bg`, `--surface`, `--surface2`, `--text`, `--heading`, `--muted`, `--line`, `--primary`, `--ochre`, `--ochre-text`, `--terracotta`, `--forest`) across both Warm Ivory Light mode and Deep Coromandel Night Dark mode.
- **Typography & Script Readiness:** `Cormorant Garamond` for editorial display headings and `DM Sans` for UI/operational workspaces, paired with `Noto Sans`, `Noto Sans Devanagari`, `Noto Sans Tamil`, and `Noto Serif` fallbacks (`src/index.css` & `index.html`) for Indian names and multilingual phrases. Base font size is raised to `16px` (`1rem`) for comfortable reading across desktop and mobile.

## 3. Photography Art Direction & Resilient SVG Fallback (P1)
- **Licensed Editorial Photography Primary:** `src/utils/editorialMedia.ts` maps each `EditorialVariant` to a curated, warmly lit editorial photograph URL (`getEditorialPhotoUrl`), with the hero portrait preloaded in `index.html` for strong LCP performance.
- **Coromandel SVG Fallback:** `EditorialImage.tsx` automatically falls back to the deterministic Coromandel SVG composition (`getEditorialSvgDataUrl`) if the network is offline, if an image fails to load, or when `forceFallback` is active (such as on `/image-error`).

## 4. 2.5D "Coromandel Threads / Connection Paths" Hero & Restrained Motion (P1)
- **Three Shallow Depth Planes:** `src/components/CoromandelThreadsHero.tsx` layers an atmospheric textile grid (`Layer 0`), an SVG connection-paths diagram (`Echo`, `Counterpoint`, `Mosaic Fit` threads) that draws once on entry (`Layer 1`), and tactile portrait/explanation cards (`Layer 2`).
- **Strict Motion Budget & Reduced Motion:** Pointer parallax is enabled only on non-touch desktop viewports (`(hover: hover) and (pointer: fine)`) and capped at `±2.5deg` / `±6px`. When `prefers-reduced-motion: reduce` is active or when the user enables the in-app **Reduced Motion** toggle (in Mobile Menu or `/member/settings`), all parallax and path animations render in their completed static state immediately.

## 5. Unresolved UX Decisions Flagged for Product / AGY Review
1. **Cross-Intention Discovery Collision Policy:** If two members have both `Dating` and `Matrimony` enabled simultaneously, should the AGY backend introduce them in only one intention context (e.g., highest-overlap intention first) or allow them to see which intentions they have in common?
2. **Minimum Reflection Threshold Before Discovery:** Currently, members can browse sample introductions immediately while completing the 100-question bank at their own pace. Product should confirm whether production requires completing at least 15 core questions (3 per theme) before unlocking full `Echo` / `Counterpoint` / `Mosaic Fit` alignment sheets.
3. **Photo Re-Moderation on Crop/Visibility Change:** When a member adjusts the 4:5 crop or enables `Matrimony` visibility on an already-approved `Friendship` photo, does AGY require re-queuing the photo in `/admin/photos` or applying instant visibility updates?
