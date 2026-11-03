# Kithra — Coromandel Indigo & Ochre Frontend Shell

A warm, unhurried, human-centered relationship and community platform for India and the global Indian diaspora—bringing **Friendship**, **Dating**, and **Matrimony** together under one account with strict per-intention privacy and photo visibility boundaries.

> **Frontend Shell Boundary:** This project is a pure React + TypeScript + Tailwind CSS v4 frontend specification prepared for AGY backend integration. It contains **no** Firebase, Cloudflare, database, live authentication, real payment processing, or AI/LLM dependencies.

## Key Capabilities Implemented

- **Real Pathname Client-Side Routing:** Supports browser back/forward (`popstate`), deep links, reloads, meaningful page titles, scroll restoration, and heading focus management across `/`, `/signin`, `/join`, `/forgot-password`, `/verify-email`, `/locked`, `/onboarding`, `/pricing`, `/member`, `/member/discover`, `/member/match/:id`, `/member/assessments`, `/member/messages`, `/member/groups`, `/member/photos`, `/member/privacy`, `/member/settings`, `/member/more`, `/admin/login`, `/admin/*`, error pages (`/404`, `/403`, `/410`, `/429`, `/500`, `/503`, `/offline`, `/empty`, `/loading`, `/image-error`), and the developer-only QA directory (`/__preview`).
- **2.5D "Coromandel Threads / Connection Paths" Hero:** Built with `motion/react` and CSS perspective across three shallow depth layers with one-time SVG path draw and complete reduced-motion static support.
- **Echo, Counterpoint & Mosaic Fit Vocabulary:** Qualitative relationship explanations paired with an optional Measured Alignment Details Sheet showing non-predictive questionnaire overlap bands across the 5-theme, 100-question reflection bank.
- **Complete Frontend Photo Studio (`/member/photos`):** Local file picker (`URL.createObjectURL` preview), interactive 4:5 crop/zoom/pan/rotate studio with keyboard nudge controls, primary photo selector, caption editor, gallery reordering, delete confirmation dialog, moderation badge previewer, and independent `Friendship` / `Dating` / `Matrimony` visibility toggles.
- **Licensed Editorial Photography + Coromandel SVG Fallback:** Warm editorial portraits with automatic offline/error fallback to deterministic Coromandel SVG compositions.

## Project Documentation

All specifications, architectural blueprints, psychometric models, and release audits are organized under [`documentation/`](file:///C:/Users/hp/Desktop/Kithra/documentation/INDEX.md):

* **[01-architecture-and-infrastructure](file:///C:/Users/hp/Desktop/Kithra/documentation/01-architecture-and-infrastructure)** — Cloudflare D1 schemas, migrations, conversation REST APIs, R2 storage.
* **[02-psychology-and-matching-engine](file:///C:/Users/hp/Desktop/Kithra/documentation/02-psychology-and-matching-engine)** — KCA construct dictionaries, adaptive selection, item bank provenance, triangulation.
* **[03-four-spaces-and-intentions](file:///C:/Users/hp/Desktop/Kithra/documentation/03-four-spaces-and-intentions)** — 4 intention spaces, cofounder synergy, cross-context privacy firewall.
* **[04-circles-and-tribes](file:///C:/Users/hp/Desktop/Kithra/documentation/04-circles-and-tribes)** — Tribe Hive sanctuary, community circles, 6 sovereign exit handles.
* **[05-security-privacy-and-compliance](file:///C:/Users/hp/Desktop/Kithra/documentation/05-security-privacy-and-compliance)** — DPDP Act Section 12 erasure, RBAC, age assurance, block firewalls.
* **[06-phase-audits-and-release-gates](file:///C:/Users/hp/Desktop/Kithra/documentation/06-phase-audits-and-release-gates)** — Cloud release gates, code reality audits, E2E test reports (Phases 9–14).
* **[07-founder-eli5-and-workflows](file:///C:/Users/hp/Desktop/Kithra/documentation/07-founder-eli5-and-workflows)** — Plain-English explainers, data flow diagrams, user journey workflows.
* **[08-business-and-market-research](file:///C:/Users/hp/Desktop/Kithra/documentation/08-business-and-market-research)** — Pricing tiers, subscription research, user segment roadmap.
* **[09-product-ux-discovery](file:///C:/Users/hp/Desktop/Kithra/documentation/09-product-ux-discovery)** — 17-part UX discovery report and information architecture redesign.
* **[10-psychology-engine-reference](file:///C:/Users/hp/Desktop/Kithra/documentation/10-psychology-engine-reference)** — Academic literature reviews, construct specs, and scoring pseudocode.
* **[11-mom-test-customer-evidence](file:///C:/Users/hp/Desktop/Kithra/documentation/11-mom-test-customer-evidence)** — Customer discovery interview scripts and customer evidence ledgers.
* **[12-ux-audit](file:///C:/Users/hp/Desktop/Kithra/documentation/12-ux-audit)** — Route inventories and navigation state matrices.

*See the master catalog in [documentation/INDEX.md](file:///C:/Users/hp/Desktop/Kithra/documentation/INDEX.md).*

## Local Development & Verification

```bash
# Install dependencies
npm install

# Run unit tests (pathname routing, photo visibility, crop math, Echo/Counterpoint/Mosaic grouping)
npm test

# Type-check & lint
npm run lint

# Build production bundle
npm run build

# Start Vite dev server on port 3000
npm run dev
```
