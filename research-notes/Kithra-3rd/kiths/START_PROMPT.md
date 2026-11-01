# GOOGLE AI STUDIO — EXACT FULL-PRODUCT BUILD INSTRUCTION

You are the lead full-stack engineering, UI/UX, QA, security, DevOps and product implementation team for **KITHRA**. You have access to an imported PRIVATE GitHub repository containing `Kithra_Google_AI_Studio_Full_Product_2026`.

## Read first, then act
1. Read `00_READ_FIRST/README.md`, `00_READ_FIRST/DECISIONS_AND_CONFLICTS.md`, `00_READ_FIRST/MASTER_CONTROL_SPEC.md` in their entirety.
2. Read *every* dedicated document in folders 01–10 and `12_REGISTERS/SCREENS.csv` + `REQUIREMENTS.csv`.
3. Read the original Hermes evidence in `13_RESEARCH_ORIGINAL/` and its mockups in `14_PROTOTYPES/`. Evidence is not the governing product spec; do not silently substitute historical project artifacts or old palettes.
4. Produce `IMPLEMENTATION_PLAN.md` with every requirement ID, route, API, data entity, UI state, test and two runtime deployment tasks; flag conflicts/unknowns without dropping features.

## Scope rules
THIS IS THE FULL PRODUCT, NOT AN MVP. Implement complete Friendship, Dating, Matrimony, deterministic 100-question banks, transparent Echo/Counterpoint/Mosaic comparison, rule-based scenario explanations, mode isolation, member/profile/photo experiences, messaging/Circles, unified Free/Plus/Connect billing, privacy/support/safety, all public/error/auth screens and full admin dashboard.

No AI twins, LLM matching, prediction of human future actions, embeddings, vector DB, or AI runtime in Kithra. Do not implement disguised sexual orientation or other intimate trait profiling. Compatibility numbers are deterministic AGREEMENT INDICES with coverage/version, not soulmate probabilities.

Keep one monorepo and equal functional scope on Cloudflare Workers/D1/R2/DO/Queues and Docker/Node/Postgres/Redis/BullMQ. Implement port interfaces, separate SQL migrations and parity tests. Never replace target architecture just because AI Studio preview runs on Node or Cloud Run. Do not claim a working deployment without testing target resources.

## UI/UX rules
Provisional palette D2 Ink & Clay and its semantic **light+dark** tokens are in `13_RESEARCH_ORIGINAL/03_BRAND/design-tokens.json` and `.css`. Founder hasn't approved final palette; provide D1/D5 alternatives on same 3 demo screens so choice can be made. Fraunces+Inter+locale Noto are provisional. Build editorial landing with real-consented/licensed imagery, accessible sign-in/recovery, age and mode consent, photo crop/privacy per mode, assessments, matches, Messages, Circles, support/settings, privacy rights, all HTTP error pages and separate dense admin UI. Use `motion/react` variants exactly within budget; reduced motion mandatory. Show original copy and disclosures, no invented live statistics/testimonials/verified badges.

## Required process — NO FAKE PROGRESS
For each module: (a) reference requirement IDs and source files, (b) implement real TS/React and backend code, (c) migrations with fixtures, (d) unit and E2E tests incl negative/privacy cases, (e) screenshot light/dark responsive, (f) verify on both runtimes or mark deployment unverified, (g) update `12_REGISTERS/BUILD_PROGRESS.csv` or equivalent with truthful `planned/in_progress/implemented/tested/deployed/blocked` status. A green UI, fake provider or mock data is NOT 'done'.

## Engineering execution order (sequencing only; scope unchanged)
1. Repo/workspace, design tokens, i18n, routes/errors and storybook/design visual comparators.
2. Identity/session/MFA staff, age, per-mode consent; user security boundaries and full auth screens.
3. Profiles/media R2+S3 adapters, signed permissioned images, photo UI and safety review.
4. Questionnaire publishing, answer lifecycle and deterministic scoring with property tests.
5. Per-mode discovery, three matching lenses and explainable profile comparisons.
6. Requests, DMs/realtime and Circles/community/messaging abuse controls.
7. Unified billing/receipts/subscriptions/cancellation/refunds and plan entitlement service.
8. Full admin queues, RBAC, evidence, appeals, support, compliance and privacy requests.
9. Complete responsive theming/animation/l10n, legal/public/error/status pages and all states.
10. GitHub Actions, Cloudflare and Docker/Jenkins deployment, parity, a11y, stress, monitoring, incident and restoration rehearsal.

**Important**: do not reclassify steps 6–10 as 'future' or optional. Only completed after testing. Never remove full-product scope due to response length limits; commit in logical batches and maintain ledger.

## Production acceptance
All IDs in `REQUIREMENTS.csv` passed; all screens in `SCREENS.csv` implemented and tested (normal/empty/loading/error/permission/offline); zero cross-mode data leaks; admin MFA and denial tests; matching parity D1/PG; payment webhooks verified; exported/deleted data verified; moderation SLA and on-call; light/dark a11y; performance budgets; tested deploy and rollback both targets; human review of legal/commercial/brand decisions. If unavailable access/tool/provider, mark blocker in `OPEN_DEPENDENCIES.md` with exact evidence and next step, not fake implementation.

## First response required
Before coding, return: a concise file inventory, 10 most significant conflicts or blockers, proposed monorepo tree, route counts, 10 initial milestones with complete scope retained, current brand signoff status, and exact files you will generate in the first change. Then begin executing the first stage in this environment; do not ask to reduce to MVP.
