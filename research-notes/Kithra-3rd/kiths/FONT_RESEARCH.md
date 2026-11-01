# FONT RESEARCH — Kithra typography system

**Constraints:** React 19 + Vite + Tailwind; must render at 320–360 px widths;
must cover English + Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali; must be
licensable for embedding; must support variable weights for performance.

**Method note.** Licences below are stated from the font projects' own public
documentation. **No font binaries are redistributed** in this repository.
Commercial faces (Tiempos, Modern Era) are **referenced only** — they appear in
the Hinge brand page and cannot be bundled by Kithra without a licence.

---

## 1. Candidate type families (6+)

| # | Family | Category | Licence | Variable | Numerals | Indic coverage | Verdict |
|---|---|---|---|---|---|---|---|
| F1 | **Fraunces** | display serif | OFL 1.1 | yes (opsz/wght) | old-style, distinctive | none → pair Noto | Strong display candidate |
| F2 | **Newsreader** | editorial serif | OFL 1.1 | yes | good, open | none → pair Noto | Excellent reading serif |
| F3 | **Literata** | text serif | OFL 1.1 | yes | tabular avail. | none → pair Noto | Google-book serif, highly legible |
| F4 | **Source Serif 4** | transitional serif | OFL 1.1 | yes | clear | none → pair Noto | Safe, neutral |
| F5 | **Manrope** | geometric sans | OFL 1.1 | yes | geometric | none → pair Noto | Kit default; friendly |
| F6 | **Plus Jakarta Sans** | humanist sans | OFL 1.1 | yes | clear | none → pair Noto | Kit default body |
| F7 | **DM Sans** | geometric sans | OFL 1.1 | yes | clear, low | none → pair Noto | Founder's 2.0 body pick |
| F8 | **Inter** | neo-grotesque | OFL 1.1 | yes | tabular + slashed zero | none → pair Noto | Best UI/data legibility |
| F9 | **Outfit** | geometric sans | OFL 1.1 | yes | geometric | none → pair Noto | Founder's Citrus display |
| F10 | **Noto Sans + Noto Sans {Devanagari,Tamil,Telugu,Malayalam,Kannada,Bengali}** | sans superfamily | OFL 1.1 | yes | excellent | **full** | **Mandatory fallback** |
| F11 | **Noto Serif / Noto Serif Devanagari…** | serif superfamily | OFL 1.1 | yes | excellent | full | Serif Indic option |
| F12 | **Tiempos** (Klim) | commercial serif | **commercial** | yes | — | none | Reference only |
| F13 | **Modern Era** (Family Type) | commercial sans | **commercial** | — | — | none | Reference only |

**Findings.** Every open candidate lacks native Indic glyphs → **Kithra must
always ship Noto Sans `<script>` fallbacks**; a "universal glyph set" assumption
is false. The kit's Manrope + Plus Jakarta Sans pairing is *safe but
undistinctive* and is not required by the founder.

---

## 2. Recommended system (Direction 2, provisional)

- **Display / headings:** **Fraunces** (variable, `opsz` axis) — editorial
  warmth and credibility; supplies the "premium, not clinical" signature.
- **Interface / body / data:** **Inter** — best-in-class legibility at small
  sizes, true tabular numerals and slashed zero for scores, dates and prices.
- **Indic:** **Noto Sans Devanagari / Tamil / Telugu / Malayalam / Kannada /
  Bengali** (OFL) loaded per locale; **Noto Serif** variants where a serif mood
  is needed.

Why not the founder's Fraunces + DM Sans? DM Sans is a fine geometric sans but
Inter wins on *numerals and small-size legibility*, which Kithra needs for
scores, prices and dense admin table numbers. DM Sans remains **Alt-2 body**.

### Alternative pairings (documented)
- **Alt-1 (Direction 5):** Newsreader (display) + Inter (body).
- **Alt-2 (Direction 1):** Fraunces (display) + DM Sans (body).

---

## 3. Type scale

| Token | Size / line-height | Use |
|---|---|---|
| `display-2xl` | 56/60 (fluid → 40 mobile) | landing hero |
| `display-xl` | 44/50 → 34 mobile | section hero |
| `h1` | 34/40 → 28 mobile | page title |
| `h2` | 26/32 | section heading |
| `h3` | 20/28 | card heading |
| `body-lg` | 17/28 | quiz prompt |
| `body` | 15/24 | default |
| `body-sm` | 13/20 | meta |
| `caption` | 12/16 | labels |
| `numeric` | tabular, `font-variant-numeric: tabular-nums` | scores/prices |

- **Paragraph measure:** 60–75 ch; quiz prompts capped ~48 ch for focus.
- **Letter-spacing:** display `-0.02em`; body `0`; captions `+0.01em`.
- **Weights used:** 400 / 500 / 600 / 700 only (variable) — no 800/900 sprawl.
- **Font-display:** `swap` with a metric-matched fallback stack to avoid CLS.
- **Fallback stack:**
  `font-family: 'Inter', 'Noto Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;`
  and per-script override stacks for `:lang(ta)`, `:lang(hi)`, `:lang(te)`,
  `:lang(ml)`, `:lang(kn)`, `:lang(bn)`.

---

## 4. Legibility & loading checks

- **320–360 px:** all sizes above verified as renderable at 320 px with the
  fluid clamp; quiz option rows wrap to 2 lines max.
- **Numerals:** Inter tabular ensures score columns align in admin tables.
- **Currency:** ₹ glyph verified present in Inter and Noto Sans.
- **Performance:** load 2 Latin families (Fraunces + Inter) + **one** Indic
  family per active locale; use `unicode-range` subsetting; preload only the
  hero weights.
- **CLS:** metric-matched fallbacks (`size-adjust`, `ascent-override`) required.

---

## 5. Licensing actions

- Bundle Fraunces + Inter + Noto (all OFL) with OFL notices in `licences/`.
- **Do not** bundle Tiempos or Modern Era; they are cited as competitor
  reference only.
- If a commercial display face is later desired, procurement must precede use.
