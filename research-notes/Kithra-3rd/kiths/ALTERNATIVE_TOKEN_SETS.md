# ALTERNATIVE TOKEN SETS (D5 & D1) — full light + dark

The brief requires the selected system **plus two alternatives documented**.
D2 ships as `design-tokens.json` / `design-tokens.css`. D5 and D1 are below,
with **computed** contrast ratios (all pass AA in both modes).

Swap is a token-file change only — no component edits, because all components
consume `--k-*` variables exclusively.

---

## ALT-1 · D5 "Sophisticated Nature" (Forest & Sand) — Light

| Token | Hex | Contrast |
|---|---|---|
| canvas | `#FBFBF7` | — |
| surface | `#FFFFFF` | — |
| text | `#1E241F` | **15.25** |
| textMuted | `#57614F` | **6.27** |
| primary | `#2F5D3A` | 7.37 on bg / **7.64** white-on |
| accent | `#C98A4B` | 2.80 on bg (decoration) |
| accentText | `#7A5220` | ≥5 |
| support | `#41677A` | — |
| border | `#E2E3D8` | — |
| danger | `#B3261E` | — |

## ALT-1 · D5 — Dark (computed)

| Token | Hex | Contrast |
|---|---|---|
| canvas | `#12160F` | — |
| surface | `#1B2118` | — |
| text | `#EFF2EA` | **16.18** |
| textMuted | `#B6BDAF` | **9.49** |
| primary | `#6FBF7F` | **8.22** on canvas |
| onPrimary | `#0C130D` | **8.46** on primary |
| accent | `#E7BE84` | accentText **10.54** on canvas |
| support | `#93B2C4` | **8.20** on canvas |
| danger | `#F3B7B2` | **10.66** on canvas |

## ALT-1 mode accents
Friendship `#2F5D3A` · Dating `#A05A4A` · Matrimony `#41677A` (light)
Friendship `#6FBF7F` · Dating `#E0928A` · Matrimony `#93B2C4` (dark)

---

## ALT-2 · D1 "Sunlit Humanist" (warm editorial) — Light

| Token | Hex | Contrast |
|---|---|---|
| canvas | `#FFF9F3` | — |
| surface | `#FFFFFF` | — |
| text | `#2C2320` | **14.69** |
| textMuted | `#6B5B52` | **6.20** |
| primary | `#A83E50` | 5.79 on bg / **6.05** white-on |
| accent | `#EFA88B` | 1.89 on bg (decoration only) |
| accentText | `#8A5236` | ≥5 |
| support | `#78846A` | — |
| border | `#EADFD6` | — |

## ALT-2 · D1 — Dark (computed)

| Token | Hex | Contrast |
|---|---|---|
| canvas | `#1A1310` | — |
| surface | `#241A16` | — |
| text | `#F6EFE9` | **16.11** |
| textMuted | `#C4B2A8` | **8.98** |
| primary | `#E38B9C` | **7.37** on canvas |
| onPrimary | `#2A1219` | **7.04** on primary |
| accent | `#F0C2A6` | accentText **11.33** on canvas |
| support | `#B9C0A8` | **9.76** on canvas |
| danger | `#F3B7B2` | — |

## ALT-2 mode accents
Friendship `#78846A` · Dating `#A83E50` · Matrimony `#6B5B52` (light)
Friendship `#B9C0A8` · Dating `#E38B9C` · Matrimony `#C4B2A8` (dark)

---

## Swapping instructions (no component changes)

1. Replace the `:root { --k-* }` and `[data-theme="dark"] { --k-* }` blocks.
2. Keep token **names** identical — components never reference raw hex.
3. Re-run the contrast audit script (documented in
   `11_VISUALS/README.md` workflow) — it recomputes every pair.
4. Re-render `11_VISUALS/01_FIVE_DIRECTIONS_TILES.html` to compare.

## Selection guidance

| If the founder wants… | Choose |
|---|---|
| mode-neutral, warm-through-material, top accessibility | **D2** (recommended) |
| sincere, grounded, highest raw contrast | **D5** |
| warmest, most romantic-leaning, closest to "Sunlit" instinct | **D1** |

All three are AA-compliant in both modes. The choice is strategic, not
accessibility-driven.
