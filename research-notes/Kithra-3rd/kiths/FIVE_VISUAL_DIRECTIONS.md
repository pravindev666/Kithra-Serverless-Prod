# FIVE VISUAL DIRECTIONS — Kithra

**Starting position.** The canonical kit's midnight-indigo / iris-blue palette
is **rejected** (founder, discussion §"Kithra 2.0"). The founder's
Sunlit / Modern Bloom / Citrus hypotheses are treated as **unapproved
inspiration**, not decisions. Five *materially different* complete directions
are defined below; each is scored in `PALETTE_SCORECARD.csv`.

All contrast ratios below are **computed** (WCAG 2.2 relative-luminance
formula), not asserted. Body text target ≥4.5:1; large/UI target ≥3:1.

---

## Direction 1 — Sunlit Humanist (warm editorial)
**Personality:** generous, optimistic, human. Closest to the founder's "Sunlit
Connection" instinct, but de-pinked into a deep rose-clay.

| Role | Hex | Contrast vs bg | Note |
|---|---|---|---|
| Canvas | `#FFF9F3` | — | warm paper |
| Surface | `#FFFFFF` | — | cards |
| Text | `#2C2320` | **14.69** | ✅ |
| Muted | `#6B5B52` | **6.20** | ✅ |
| Primary | `#A83E50` | 5.79 on bg / **6.05** white-on | ✅ deep rose-clay |
| Accent | `#EFA88B` | 1.89 vs bg | decoration only, never text |
| Support | `#78846A` | — | sage |
| Border | `#EADFD6` | — | |

Strengths: warmth, emotional pull for dating.
Risks: rose-clay still reads "romance-coded"; matrimony/friendship skew.

## Direction 2 — Culture-Neutral Editorial (Ink & Clay)  ← **RECOMMENDED**
**Personality:** calm, credible, warm through *material* not *pink*. Reads as a
premium editorial product in India and internationally.

| Role | Hex | Contrast vs bg | Note |
|---|---|---|---|
| Canvas | `#FBFAF7` | — | neutral paper |
| Surface | `#FFFFFF` | — | cards |
| Text | `#1F2320` | **15.25** | ✅ |
| Muted | `#5A6159` | **6.12** | ✅ |
| Primary | `#1F6F5C` | 5.77 on bg / **6.02** white-on | ✅ deep teal |
| Accent | `#D98A3D` | 2.63 vs bg | clay — decoration only; use darkened `#8A5A1E` for text |
| Support | `#3E4A6B` | **8.76** | ink-blue for admin |
| Border | `#E4E3DC` | — | |

Strengths: mode-neutral, non-gendered, strong contrast, culture-neutral.
Risks: could read "corporate" if used with heavy grids — mitigate with
photography and generous whitespace.

## Direction 3 — Restrained Luxury (Plum & Gold)
**Personality:** mature, considered, premium. Best contrast of all (primary
11.13).

| Role | Hex | Contrast |
|---|---|---|
| Canvas `#FAF7F4` · Surface `#FFFFFF` · Text `#241E2A` | | **15.20** |
| Muted `#615868` | | 6.34 |
| Primary `#5B2A4E` (plum) | | 11.13 white-on ✅ |
| Accent `#B4873F` (gold) | | 3.04 vs bg — decoration |
| Support `#2E5D6B` | | — |

Strengths: seriousness suits matrimony; elegant.
Risks: can feel cold/exclusionary for *friendship*; gold = "wedding" coding;
skews older/upscale.

## Direction 4 — Bright Community (Coral & Teal)
**Personality:** lively, playful, plural. Highest energy.

| Role | Hex | Contrast |
|---|---|---|
| Canvas `#FDFBF7` · Text `#23282B` | | 14.41 |
| Muted `#5E6A6E` | | 5.40 |
| Primary `#E2603F` (coral) | | **3.51 — FAILS AA for normal text**; passes large-text only |
| Accent `#1E8F84` (teal) | | 3.82 vs bg |
| Support `#3C6DF0` | | — |

Strengths: warmth + pluralism; friendship-friendly.
Risks: **coral primary fails AA as a text/CTA carrier with white text at normal
size** — would need dark text on coral or a darkened coral (`#B8462A`). Also
closer to the "playful dating app" cliché.

## Direction 5 — Sophisticated Nature (Forest & Sand)
**Personality:** grounded, sincere, restful. Best combined contrast (primary
7.64).

| Role | Hex | Contrast |
|---|---|---|
| Canvas `#FBFBF7` · Text `#1E241F` | | 15.25 |
| Muted `#57614F` | | 6.27 |
| Primary `#2F5D3A` (forest) | | **7.64** white-on ✅ |
| Accent `#C98A4B` (sand) | | 2.80 vs bg — decoration |
| Support `#41677A` | | — |

Strengths: sincere, calm, excellent legibility, works across all three modes.
Risks: green can read "environmental brand"; needs warm accent to avoid
coldness.

---

## Mode-accent treatment (applies to any direction)

Never three skins — **one product, three labelled accents**. For the recommended
Direction 2 in light mode:

| Mode | Accent | On white | Use |
|---|---|---|---|
| Friendship | `#1F6F5C` (teal) | 6.02 | chips, mode badge |
| Dating | `#A83E50` (rose-clay) | 6.05 | chips, mode badge |
| Matrimony | `#3E4A6B` (ink-blue) | 8.76 | chips, mode badge |

Each mode chip **always** carries an icon + label, never colour alone
(WCAG 1.4.1).

---

## Light / dark strategy

All five directions ship **light-first** (matches warm, editorial and
data-light Indian mobile use). Dark mode is a **derived** variant for each:
canvas = near-black neutral of the same hue family; primary lightened to keep
≥4.5:1 on dark; accents preserved. Exact dark values are in
`design-tokens.json`.

## Sample treatments (same screen, five ways)

The comparative **mock tiles** produced for fair comparison live in
`11_VISUALS/` (original work, labelled "proposed vs implemented"). They show
the same landing hero + match card under each direction so the decision is made
on like-for-like, not on adjectives.
