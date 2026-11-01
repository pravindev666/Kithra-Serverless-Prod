# 00 — FILE INVENTORY AND CONFLICT RESOLUTION LEDGER
**Kithra UX Research & Redesign 2026 · Phase 0 output**
**Date:** 1 November 2026 · **Author:** Hermes research team (independent)
**Source folder:** `/home/pravin/Videos/KITHRA-RESEARCH` (9 files, 4 unique archives)
**Working extraction:** `/home/pravin/kithra_research_work` (originals untouched)
**Output root:** `/home/pravin/KITHRA_UX_RESEARCH_REDESIGN_2026`

> Method: every archive was listed before extraction, then extracted into a
> separate working directory. No archive was executed. No script inside any
> archive was run. No dependency was installed. Hashes below are SHA-256 of the
> extracted files. Nothing in this document is claimed to have been inspected
> unless its content is quoted or summarised from an actual read.

---

## 1. What was actually in the folder

The folder contained **no Markdown, no readme, no images** at the top level —
only four unique ZIPs (two of them stored twice under "- Copy"), one plain-text
discussion log, and duplicate 360/FIN bundles. The named file
`Hermes_Kithra_Master_UX_Research_Prompt.md` **does not exist anywhere in the
folder or in any archive.** The authoritative brief is the prompt supplied in
the task text; it is treated as the controlling instruction set.

| # | File | Size | SHA-256 (prefix) | Verdict |
|---|------|------|------------------|---------|
| 1 | `Kithra-main.zip` | 144,960 | `229f0bd5b126…` | Concept reference only |
| 2 | `Kithra_Complete_360_Developer_Handover_2026.zip` | 484,412 | (dup + "- Copy") | Legacy 360 bundle |
| 3 | `Kithra_FIN_RD_Complete_Financial_Handover_2026.zip` | 109,591 | (dup + "- Copy") | Finance bundle |
| 4 | `Kithra_Full_360_Deterministic_Cloudflare_Server_Kit_2026.zip` | 1,352,595 | — | **Canonical v3 kit (newest, 15:12)** |
| 5 | `Kithra_Full_Product_2in1_Cloudflare_and_Server_Handover.zip` | 342,679 | (dup + "- Copy") | Dual-deployment bundle |
| 6 | `kithra-discussions.txt` | 41,356 | — | **Founder's own 2.0 rework plan — highest-value conflict source** |

Two pairs are byte-identical duplicates kept as "- Copy" (handover, FIN_RD).
`design-tokens.json` and `design-tokens-v3.json` inside the canonical kit are
also byte-identical (`24182e16…`) despite different names. The 5-year financial
XLSX appears identically in two bundles (`c357628e…`).

---

## 2. Canonical source-of-truth hierarchy (applied, not just quoted)

The kit's own rule (`00_START_HERE/SCOPE_CORRECTIONS_AND_README.md`) is adopted:

```
current founder instruction
  > approved explicit decisions
    > newer canonical v3 kit
      > dual-deployment kit
        > older 360 docs
          > Kithra-main prototype
            > unsupported assumptions
```

Applying it, the **controlling documents** are:
- `Kithra_Final_360_Kit/00_START_HERE/SCOPE_CORRECTIONS_AND_README.md`
- `Kithra_Final_360_Kit/KITHRA_MASTER_FULL_PRODUCT_2026.md`
- `Kithra_Final_360_Kit/01_PRODUCT/KITHRA_FULL_BRD_PRD_FRS.md`
- `Kithra_Final_360_Kit/03_MATCHING/DETERMINISTIC_BEHAVIOURAL_ENGINE.md`
- `Kithra_Final_360_Kit/04_ENGINEERING/DUAL_RUNTIME_ENGINEERING_AUTHORITY.md`
- `Kithra_Final_360_Kit/05_SECURITY_LEGAL/ADMIN_RBAC_TRUST_COMPLIANCE_LEGAL.md`
- `Kithra_Final_360_Kit/07_FINANCE/FIN_RD_COSTS_PRICING_TEAM.md`
- plus the task prompt (which overrides the design authority in at least three
  places — see conflicts C1, C2, C3).

`Kithra-main/**` is **concept/visual only**. Its auth, chat, admin counts,
billing and security UI are explicitly declared simulated. Any screenshot or
copy derived from it is labelled reference, never current truth.

---

## 3. Conflicting requirements ledger

Priority: **FOUNDER-PROMPT** (this task) > **FOUNDER-DISCUSSION**
(`kithra-discussions.txt`) > **KIT-v3** (canonical kit) > **LEGACY**.

### C1 — Visual identity (SEVERE)
- **KIT-v3** `02_DESIGN/UX_UI_DESIGN_AUTHORITY.md` + `design-tokens.json`:
  *Deep nocturnal indigo (`#14182C`) canvas, saturated iris-blue (`#4B5DDB`)
  primary CTA, ivory (`#FAF8F4`) reading surfaces, coral + mint accents.
  Manrope (display) + Plus Jakarta Sans (body).*
- **FOUNDER-DISCUSSION** (`kithra-discussions.txt` §"Kithra 2.0"): explicitly
  *"The previous midnight-indigo and iris-blue combination looked too much like
  an enterprise SaaS application… rejected."* Shortlists **Sunlit Connection,
  Modern Bloom, Citrus & Clay**; proposes **Fraunces (display) + DM Sans (body)**.
- **FOUNDER-PROMPT**: *"The founder explicitly rejected the old midnight-indigo
  / iris-blue strict-officer corporate look… Previous rose, sunlit, bloom and
  citrus proposals are hypotheses only, not approvals."*
- **RESOLUTION:** Old indigo/iris is **REMOVED** as an approved direction.
  Sunlit/Bloom/Citrus are **evidence-tier hypotheses**, not approvals. Five
  fresh directions are generated in `03_BRAND/FIVE_VISUAL_DIRECTIONS.md` and
  scored; **founder sign-off gate** required before declaring final.

### C2 — Subscription architecture (SEVERE)
- **KIT-v3** `07_FINANCE/FIN_RD_COSTS_PRICING_TEAM.md`: four tiers — Free /
  **Plus** ₹149 / **Connect** ₹299 / **Matrimony Intent** ₹399 (monthly), with
  a mode-flavoured "Matrimony Intent" tier implying a separate matrimony door.
- **FOUNDER-DISCUSSION** §7: *"the big-cat, small-cat analogy is exactly the
  problem… redesign around one membership system, not three competing
  subscription silos."*
- **FOUNDER-PROMPT** Phase 12: test four architectures; preserve free safety,
  reports, blocking, meaningful discovery and post-consent chat; *"do not sell
  the right to safety or artificially hide perfect matches."*
- **RESOLUTION:** Mode-gated "Matrimony Intent" subscription is **REMOVED**.
  A unified membership + optional genuinely-costly services is recommended, with
  INR + PPP-localised pricing (see `02_STRATEGY/PRICING_BIG_CAT_SMALL_CAT_DECISION.md`).

### C3 — AI twins (BLOCKING / already resolved in kit, re-asserted)
- **LEGACY** `18_AIR_Digital_Twins_Ethics_and_Architecture.md` and older 360
  volumes reference "AI personality twins" and an `P-016 AI persona companion`
  epic.
- **KIT-v3** + **FOUNDER-PROMPT**: *"no AI twins, no LLM-matching, no AI
  inference billing."* The `P-016` epic survives in the PRD as **"Research
  only"** and must be struck from the shipping scope.
- **RESOLUTION:** AI-twin architecture **REMOVED** from all shipping scope.
  The legacy twin doc is retained **only** as historical evidence of a claim the
  founder has now superseded. Deterministic engine governs.

### C4 — Matching score semantics (HIGH)
- **Kithra-main** `mockMatches.ts` / `CompatibilityReportView.tsx`: hardcoded
  scores presented as relationship probability.
- **KIT-v3** + **FOUNDER-PROMPT**: the number is a **model-defined agreement
  index**, never a probability of success. `100%` = maximum agreement *on the
  compared items*, not a soulmate certainty.
- **RESOLUTION:** all copy and UI must display band + coverage + model version
  + "not a guarantee". Mock scores are **REMOVED** as truth.

### C5 — Question bank reality (HIGH)
- **Kithra-main** `questions.ts`: 64 authored English items + generated padding
  to 100, with inline `traitWeight = (idx+1)*25` — i.e. **positional pseudo-weights**,
  not validated loadings.
- **KIT-v3** `quiz_2400_placeholder_items.csv`: 2,400 items, all
  `[PLACEHOLDER — …; author and validate before use]`, all `status:'placeholder'`.
- **RESOLUTION:** treat both as placeholder. Neither is a validated instrument.
  No psychometric accuracy is claimed anywhere in the redesign.

### C6 — Palantir / admin visual language (MEDIUM)
- Prompt Phase 4/11 wants Palantir-inspired operational clarity **without**
  surveillance aesthetics; must not expose intimate questionnaires to all
  moderators.
- **KIT-v3** admin section partially agrees (RBAC, least privilege) but the
  preview admin mixes public brand tone into the console.
- **RESOLUTION:** admin gets a **separate density/tone contract**
  (`06_ADMIN/ADMIN_DESIGN_AND_RBAC.md`), case-scoped evidence only.

### C7 — Storage / media privacy claims (MEDIUM)
- **Kithra-main** `SecurityView.tsx` shows encryption/E2EE-style badges that the
  kit itself forbids (`FRS §7`: "TLS + server-side encryption ≠ E2EE").
- **RESOLUTION:** no E2EE claims. R2 private bucket + signed URLs + EXIF strip +
  AV/moderation pipeline, described honestly (`05_USER_UX/PHOTO_MEDIA_SYSTEM.md`).

### C8 — Deployment dual-target (LOW / informational)
- Prompt requires Cloudflare **and** portable Docker/Node/Postgres parity. Kit
  agrees but flags the Postgres parity starter as representative-only.
- **RESOLUTION:** design tokens/components remain runtime-agnostic; not a
  conflict, carried forward as a constraint.

### C9 — Age / adult-only framing (LOW)
- Prompt: adults only, inclusive age-gating, no stereotyping. Kit agrees (18+).
- **RESOLUTION:** aligned; implement accessible age gate, no hard upper age cut.

### C10 — "Soul twin" wording (MEDIUM)
- Kit tolerates "soul twin" as a *marketing metaphor*. Prompt forbids implying
  predestination or hidden sensitive-trait inference.
- **RESOLUTION:** remove "soul twin"/"destined" from product copy; keep only in
  a footnote explaining why it is avoided.

---

## 4. Duplicate / superseded map

| Duplicate hash | Locations | Action |
|---|---|---|
| `c357628e…` XLSX | FIN_RD bundle + Final_360_Kit/07_FINANCE | Keep one; re-audit |
| `24182e16…` JSON | `design-tokens.json` == `design-tokens-v3.json` | One file; superseded by new tokens |
| `1cdedd69…` SQL | 3× `schema.sql` (dev-handover, dual, final) | Keep canonical; expand |
| `80726ced…` JSON | 3× `quiz-placeholder.schema.json` | Keep canonical |
| `da61511d…` YAML | 3× `routes.openapi.yaml` | Keep canonical |
| `14067827…` CSV | 3× `quiz_2400_placeholder_items.csv` | Keep canonical |
| legacy `01..19` docs | dev-handover + dual + final (nearly identical) | Treat final's `08_REFERENCE` as the preserved set |

---

## 5. What was NOT found (honest gaps)

- `Hermes_Kithra_Master_UX_Research_Prompt.md` — **absent**; brief taken from task text.
- No real user photographs, no licensed imagery, no Figma files, no fonts bundled.
- No validated psychometric instruments or licenses.
- No real competitor screenshots captured yet (Phase 3 will capture, with attribution).
- No verified price points beyond the kit's own illustrative numbers.
- `Kithra_Complete_Full_Product_Dual_Deployment_Master.docx` present as binary;
  not yet rendered (LISTED, not yet read) — flagged for Phase 15 parity check.

---

## 6. Requirement crosswalk (source → requirement → deliverable)

| ID | Source idea | Path/section | Verdict | New deliverable |
|---|---|---|---|---|
| R1 | Three consented modes, one account | KIT `02_PRD` §4 | KEEP | `05_USER_UX/USER_FLOWS.md` |
| R2 | Mode-independent privacy | KIT `05_SECURITY` §7 | KEEP | `08_SAFETY/CONSENT_PRIVACY…md` |
| R3 | Deterministic engine, Echo/Counterpoint/Mosaic | KIT `03_MATCHING` | KEEP | `09_VALIDATION`, match screens |
| R4 | 100-item themed banks (placeholder) | KIT `04_QRD` | KEEP-PLACEHOLDER | quiz UX in `05_USER_UX` |
| R5 | Indigo/iris tokens | KIT `02_DESIGN` §2.1 | **REMOVE** | `03_BRAND/*` |
| R6 | Manrope + Plus Jakarta Sans | KIT tokens | REPLACE-CANDIDATE | `03_BRAND/FONT_RESEARCH.md` |
| R7 | 4-tier mode-flavoured pricing | KIT `07_FINANCE` §2 | **REMOVE/CHANGE** | `02_STRATEGY/PRICING…md` |
| R8 | RBAC, MFA, least privilege admin | KIT `05_SECURITY` §2–3 | KEEP | `06_ADMIN/*` |
| R9 | Motion for React matrix | KIT `11_UIUX` | EXPAND | `07_MOTION/*` |
| R10 | Palantir-style ops | prompt Phase 4/11 | ADAPT | `02_STRATEGY/PALANTIR_TRANSFER_MATRIX.md` |
| R11 | AI twins | LEGACY `18_*` | **REMOVE** | noted in C3 |
| R12 | R2 private media | KIT `04_ENG` | KEEP | `05_USER_UX/PHOTO_MEDIA_SYSTEM.md` |
| R13 | DPDP phased dates | KIT `05_SECURITY` §6 | KEEP-VERIFY | `08_SAFETY/LEGAL_DEPENDENCIES…md` |
| R14 | Unified membership | FOUNDER-DISCUSSION §7 | ADOPT | `02_STRATEGY/PRICING…md` |
| R15 | Sunlit/Bloom/Citrus | FOUNDER-DISCUSSION §2 | HYPOTHESIS | `03_BRAND/FIVE_VISUAL_DIRECTIONS.md` |

---

## 7. Integrity note

- Originals in `/home/pravin/Videos/KITHRA-RESEARCH` were **not modified**.
- Extraction target `/home/pravin/kithra_research_work` was created fresh.
- No archive member contained a path-traversal or symlink escape on listing.
- No executable from any archive was run.
- All hashes in this folder were computed on the extracted copies
  (`sha256sum`), reproducible with:
  `cd /home/pravin/kithra_research_work && find . -type f -exec sha256sum {} \;`
