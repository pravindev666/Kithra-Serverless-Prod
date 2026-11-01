# REDDIT COMMUNITY RESEARCH — qualitative signals

**Method.** Threads were surfaced via public web search and cited by URL and
date. Reddit content is **self-selected qualitative anecdote (Tier 4)** — it is
NOT a representative survey and is never used to state a rate or proportion.
Where a thread body could not be read without login, only the title and public
snippet are quoted and the limitation is stated.

**Access limitation recorded:** Reddit blocks anonymous programme­matic body
extraction in many cases; the capture attempts for thread bodies returned 403 or
an internal-address block. Findings below therefore rest on **titles + public
search snippets**, which is stated honestly rather than papered over.

---

## 1. Threads referenced

| # | Community | Thread | Date | Signal |
|---|---|---|---|---|
| R1 | r/UXDesign | "Pink umbrella: from Hong Kong classifieds to dating app…" | 2020 | Critique of over-pink dating palettes; designers push back on gendered colour |
| R2 | r/dating | "Dating App Fatigue, anyone else?" | 2022 | Burnout, swiping exhaustion, conversation drop-off |
| R3 | r/match | "Working around Match's paywall" | 2024 | Users actively circumvent paywalls |
| R4 | r/match | "why is literally everything locked behind a paywall???" | 2024 | Paywall resentment; "destroyed dating" framing |
| R5 | r/OnlineDating | "Any popular dating site that's not behind a pay wall?" | 2025 | Demand for a genuinely free core |
| R6 | r/UXDesign | (board) general dating-app design review threads | 2024–25 | Colour clutter, need for faces over attributes |
| R7 | r/dating (general) | Dating burnout cycle threads (multiple) | 2022–25 | Need for breaks, low signal-to-noise |

## 2. Themes that recur (qualitative)

1. **Fatigue is about *signal quality*, not volume.** Users report too many low-
   effort conversations, not too few profiles (R2, R7).
2. **Paywall resentment is strongest when *access to compatible people* is
   gated**, not when convenience features are gated (R3, R4, R5).
3. **Designers reject default pink/gendered palettes** for products serving
   multiple genders (R1, R6).
4. **Users want to see people, not attribute lists** — bios and real faces
   matter more than tags (R6).
5. **Trust collapses when profiles look fake or over-filtered** (R6 + the
   peer-reviewed filter studies in the lit review).

## 3. How this maps to Kithra decisions

| Signal | Kithra decision | Where |
|---|---|---|
| Fatigue = low signal | Optimise day-30 mutual follow-through; no streaks | PRD north-star; `09_VALIDATION/` |
| Paywall resentment | Free core: discovery, safety, blocking/reporting, post-consent chat | `02_STRATEGY/PRICING_…md` |
| Reject pink | Gender-neutral warm base + mode accents | `03_BRAND/FIVE_VISUAL_DIRECTIONS.md` |
| People > attributes | Photo + specific self-description card | `05_USER_UX/COMPLETE_MEMBER_SCREEN_INVENTORY.md` |
| Fake/over-filtered = distrust | Honest photo guidance + optional verification | `05_USER_UX/PHOTO_MEDIA_SYSTEM.md` |

## 4. Honest limitations

- No claim of statistical prevalence is made from these threads.
- Reddit skews English-speaking, tech-literate and younger; Indian and
  matrimony-intent voices are under-represented here and must be gathered
  through direct moderated interviews (Phase 14), not inferred from Reddit.
- r/India and city-community threads specific to friendship/dating were searched;
  bodies were not retrievable without login at capture time — recorded as a gap.
