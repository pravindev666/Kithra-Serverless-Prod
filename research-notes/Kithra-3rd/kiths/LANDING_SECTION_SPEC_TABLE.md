# LANDING SECTION SPEC TABLE

Companion to `LANDING_CONTENT_AND_MOTION_BLUEPRINT.md`. Adds the per-section
**objective · proof needed · CTA priority · media composition · layout
dimensions · mobile stacking · motion · reduced-motion · a11y** columns the
brief requires.

Grid: 12 col desktop (1240 container, 24 gutter) · 8 col tablet · 4 col mobile
(16 gutter).

---

| § | Section | Message objective | Proof needed | CTA priority | Media composition | Desktop layout | Mobile stacking |
|---|---|---|---|---|---|---|---|
| S0 | Hero | *What + why different in 5s* | none (claim-free) | 1º Start · 2º How it works | 1× 4:5 editorial photo (non-intimate) or LQIP | text 5col / image 6col (+1 offset), 96vh | image **below** copy; 4:5 banner ≤240px |
| S1 | Three modes | Modes are separate & consensual | none | 3 equal, per-mode | 3 mode glyphs (SVG, no people) | 3× 4col cards | stack, full-width, 16px radius |
| S2 | How matching works | Determinism **and** limits | none | 1º How it works | stepper lines (SVG) | 4 steps, 3col each | vertical timeline |
| S3 | Interactive demo | Show explanation, not hype | **fictional labelled pair** | 1º Try the demo | dimension nodes (SVG) | 7col demo / 5col copy | dimension **rows**, no diagram |
| S4 | Why questions | Justify the quiz honestly | sample theme cards labelled "draft" | link to Assessments | 6 theme chips/cards | 6× 2col cards | 2-col → 1-col |
| S5 | Photography storytelling | Human, non-stereotyped | **consented or labelled illustrative** | none | 3 photos: friends / conversation / planning | 3× 4col, 4:5 | stack; each ≤360px tall |
| S6 | Trust & safety | Safety is free; adults only | none (feature facts) | 1º Safety page | icons only, no photos | 2×2 fact grid (6col) | stack |
| S7 | Pricing preview | Fairness | none | 1º See pricing | 3 plan chips | 3× 4col cards | stack; Free first |
| S8 | FAQ | Remove objections | accurate answers | none | none | 2 columns of accordions | single column |
| S9 | Languages & a11y | Inclusivity | **list live vs planned** | none | none | 2 col | stack |
| S10 | Footer | Navigate + legal | real entity/grievance details | none | wordmark | 5 col | accordion groups |

---

## CTA priority rules

- **One primary CTA per viewport.** The hero CTA (`Start with a few questions`)
  is the only filled button above the fold.
- Secondary CTAs are ghost/outline.
- No CTA competes with safety links; **Safety is always reachable from nav**.

## Media rules (all sections)

- All imagery: consented participants **or** captioned `Illustrative`.
- **No faces in the OG/Twitter card** (privacy).
- No bridal imagery; no forced intimacy; Indian + international adults
  interleaved.
- Every image has explicit width/height (CLS ≤ 0.1) and a `srcset`.

## Motion per section (summary; full detail in `07_MOTION/`)

| § | Motion | Reduced motion |
|---|---|---|
| S0 | headline fade+rise 520ms; photo fade 520ms; map line-draw once ≤600ms | static |
| S2 | stepper line draw, once | static |
| S3 | node reveal on interaction only (200ms) | instant |
| S1/S4/S7 | card rise + stagger 40–60ms (cap 8) | all visible |
| S6/S8/S9/S10 | none (clarity sections) | none |

## Accessibility notes per section

- S0: `<h1>` is the first heading; hero image `alt` describes the *moment*, not
  "image of people".
- S2: ordered list semantics for the steps.
- S3: interactive demo is **fully operable by keyboard**; a static text
  equivalent is provided for the map.
- S6: safety facts are a definition list; never colour-only.
- S7: plan comparison uses a real `<table>` at desktop, cards at mobile with
  equivalent labels.
- S8: accordions use `button` + `aria-expanded` + `aria-controls`.
- All: focus visible, ≥44px targets, contrast AA, `lang` per locale.
