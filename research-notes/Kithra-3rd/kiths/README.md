# KITHRA — FINAL FULL-PRODUCT GOOGLE AI STUDIO HANDOVER

Version: 1.0 · 1 November 2026 · Status: **Complete design/engineering specification; application not built**.

## What to give Google AI Studio
Import the **entire extracted folder** as a private GitHub repository. Then paste `11_AI_STUDIO/START_PROMPT.md`. Read `00_READ_FIRST/DECISIONS_AND_CONFLICTS.md` and `00_READ_FIRST/MASTER_CONTROL_SPEC.md` first; follow the cross-references. `13_RESEARCH_ORIGINAL/` contains the research archive and **is evidence, not automatically approved product policy**.

## Authority order
1. Security, actual law, platform limits and truthful behavior always override aesthetics.
2. `00_READ_FIRST/DECISIONS_AND_CONFLICTS.md` resolves historic contradictions.
3. `00_READ_FIRST/MASTER_CONTROL_SPEC.md` controls deliverable scope and quality.
4. Dedicated numbered requirements documents control details (PRD/BRD/SRS/UI-RD/etc.).
5. Registries, source research and illustrative prototypes assist implementation; never override #1–4.
6. Existing Kithra ZIP (if separately provided) is inspiration, **not** implementation truth.

## Absolute requirements
- **FULL PRODUCT**, not MVP: friendship + dating + matrimony + deterministic assessments/matching + groups + in-app chat + payments + admin/safety + exports/deletion + localization + light/dark, deployed to both targets.
- **NO AI twins, LLMs, embeddings, or predictive brain replicas.** A deterministic decision simulator describes rule outcomes for specified questionnaire inputs; it cannot predict a person's future behavior with certainty.
- **ONE identity; SEPARATE mode consent, profile visibility, preferences and discovery pools**; no cross-mode disclosure by default.
- **One membership architecture**, not different base charges for Friendship/Dating/Matrimony. Safety, eligible discovery, mutual messaging and privacy rights free.
- **Both runtimes**: Cloudflare Workers/Hono/D1/R2/DO/Queues, plus Node/Hono/PostgreSQL/Redis/BullMQ/Docker/Caddy/Jenkins. One codebase through adapters, parity tested. Cloudflare Workers Static Assets preferred; Pages an optional alternative.
- UI benchmark: polished consumer product + Palantir-like information clarity for pattern explanations and administrative workflows; **do not copy others' designs/assets**.

## Important difference: "documented" vs "implemented"
Files in `16_SCAFFOLD/` are developer **templates**, NOT a working production backend. A generated AI Studio preview is NOT proof of production completeness. No green check may appear on a requirement without linked tests and a deployed environment check.

## Starting order
1. Read the decision log and research evidence matrix.
2. Reproduce **all supplied D2 mockups** (light + dark, desktop + mobile) and demonstrate D1/D5 alternatives in one shared view; founder approval gate remains open.
3. Implement common design primitives, route inventory, auth, mode isolation and safety.
4. Implement all feature groups using the milestone ledger; sequence ≠ scope reduction.
5. Prove dual-runtime contract tests, security tests, data export/deletion and incident controls.

## Research provenance
Primary evidence: uploaded `KITHRA_UX_RESEARCH_REDESIGN_2026.zip` (Nov 2026). The Hermes report itself noted that competitor-gated screens were not captured, Reddit posts were often inferred from snippets, prices and success claims were not validated, and founder brand approval is pending. Preserve those caveats.

## Deliverable directory
- `01_PRODUCT`: BRD / PRD / SRS / NFR / journeys / content
- `02_DESIGN`: UX/UI requirements, landing/sign-in/photos/navigation, dark/light and Motion
- `03_BEHAVIOR`: deterministic questionnaire, rule simulation, testing
- `04_ARCHITECTURE`: system design, Cloudflare/server parity, threat boundaries
- `05_DATA_API`: schema, endpoints, migration contracts
- `06_SECURITY_LEGAL`: security controls + India/international legal review list and *draft* legal copy
- `07_ADMIN_OPERATIONS`: complete staff console and operations runbooks
- `08_BILLING_FINANCE`: unified pricing, entitlements and full operating economics
- `09_QUALITY_TESTING`: test plans, accessibility, performance, UAT release gates
- `10_DEVOPS`: GitHub Actions, Jenkins, IaC/deployment/backup/rollback
- `11_AI_STUDIO`: precise agent kickoff, prompts and execution ledger
- `12_REGISTERS`: screen inventory, acceptance trace, source register, risks, approvals
- `13_RESEARCH_ORIGINAL`: untouched provided research (for auditability)
- `14_PROTOTYPES`: provided Hermes HTML/PNG design concepts (not a functioning app)
- `15_DOCX`: selected editable Word handovers
- `16_SCAFFOLD`: reference configuration and test/data starter files.

## Explicit artifacts to inspect first

- `KITHRA_CANONICAL_ALL_IN_ONE.md`: consolidated 26-chapter implementation brief.
- `15_DOCX/`: four polished editable Word handovers, with a light/dark visual appendix in the UI/UX volume.
- `08_BILLING_FINANCE/Kithra_Editable_5_Year_Cost_Model.xlsx`: 60-month formula-based scenarios; **assumption-driven**, not a forecast or quotation.
- `14_PROTOTYPES/Kithra_Light_Dark_Experience_Preview.html`: seven tabs for Landing, Sign in, Photos, Member, Pricing, Admin and 404, with light/dark switch. Illustrative data only.
- `12_REGISTERS/SCREENS.csv`: 104 screens; `REQUIREMENTS.csv`: 194 acceptance rows; `QUESTION_BANK_2400_PLACEHOLDERS.csv`: 2400 unique IDs; `RBAC_MATRIX.csv`: staff permissions.
- `16_SCAFFOLD/`: starter D1/PG schemas and sample GitHub Actions, Wrangler, Compose, Jenkins and OpenAPI. NOT production ready.

**No fonts or licensed competitor images are redistributed.** Visual previews use original abstract illustration and clearly identified placeholders; actual photographed people require release/licensing.
