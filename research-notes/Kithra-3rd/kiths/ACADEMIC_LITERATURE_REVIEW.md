# ACADEMIC LITERATURE REVIEW — Kithra UX/Redesign

**Purpose:** ground Kithra's UX decisions in defensible research, state
counterevidence, and mark the limits of applicability. **No claim here is
relabelled as psychological validation of Kithra's questionnaire** — the banks
remain placeholders (see `CONTROL` conflict C5).

Evidence tiers: **T1** peer-reviewed / standards / regulator · **T2** industry
guidance · **T3** third-party analysis · **T4** anecdote.

---

## 1. Impression formation, photos, and trust

- **van der Zanden et al. (2022), Communication Research (T1).** Online dating
  profiles are read *multimodally*: pictures and text are processed differently
  and both shape first impressions; attractiveness is not the sole driver.
  → *Design implication:* Kithra cards must pair a photo with a short,
  specific self-description; a photo-only card is a known weaker format.
- **McGloin & Denes (2018), New Media & Society (T1) — "Too hot to trust."**
  Over-enhancement of profile photos can *lower* perceived trustworthiness.
  → *Implication:* discourage heavy filters; use honest photo guidance; avoid
  glamour retouching in marketing imagery that implies "typical members."
- **Beauty-filter study (2023), Computers in Human Behavior (T1).** Male
  profiles with beauty filters gained attractiveness but lost trustworthiness.
  → *Implication:* the same honesty framing for all genders.

**Counterevidence / limits:** these are largely lab and student samples in
Western contexts; effect sizes are modest and may not generalise to Indian users
or to friendship/matrimony intent. Treat as directional, not universal.

## 2. Questionnaire length and fatigue

- **Survey-fatigue systematic review, PMC (2025) (T1).** Fatigue is a
  documented limitation causing careless and lower-quality responses and reduced
  responsiveness.
- **Long-survey fatigue study, J. Development Economics (2022) (T1).**
  Measurable within-survey deterioration in long instruments.
  → *Implication:* the prompt's **100-item** banks are a serious UX risk. Kithra
  must (a) batch items, (b) show value before completion, (c) allow
  save-and-resume, (d) gate scoring on coverage rather than demanding 100%.

**Counterevidence:** fatigue magnitude depends on item relevance, engagement and
breaks; well-designed long instruments can retain quality. Kithra must **test**
its own fatigue curve rather than assume.

## 3. Progressive disclosure and cognitive load

- **Nielsen, NN/g (T2, 1995→).** Progressive disclosure defers advanced
  options to secondary surfaces, reducing error and learning cost.
  → *Implication:* mode chooser, advanced filters, and preference detail in
  Kithra live behind deliberate reveal, not on first paint.

## 4. Dark patterns and ethical persuasion

- **FTC, "Bringing Dark Patterns to Light" (2022) (T1 regulator).** Documents
  deceptive design: fake urgency, hidden costs, difficult cancellation, forced
  consent.
  → *Implication:* Kithra's paywall, cancellation and consent flows are
  designed as explicit *counter-examples* (no countdown, one-tap cancel visible,
  unchecked consent boxes).
- **Ethical-persuasion (industry, T2).** Persuasion is acceptable when it aids a
  user's own stated goal (safety, clarity), not when it manufactures anxiety.

## 5. Dating fatigue and burnout

- **Third-party data (T3):** ~90% reportedly need a break from online dating —
  **not peer-reviewed**; treat as directional.
- **Reddit qualitative (T4):** recurring burnout themes (see
  `REDDIT_COMMUNITY_RESEARCH.md`).
  → *Implication:* Kithra optimises **mutual follow-through at day 30**, not
  session time; no streaks, no engagement bait. This aligns with the kit's
  north-star metric.

## 6. Friendship science and honest limits

- **We3's own admission (T1-operator).** Social science has **not** run
  controlled experiments isolating individual friendship-compatibility factors.
  → *Implication:* Kithra must not claim a "scientifically proven" friendship
  formula. This is corroborated by the kit's MRD §1 (index ≠ probability).
- Broad psychology supports **similarity/attraction** and **self-disclosure
  reciprocity** effects, but these are *correlational averages*, not individual
  predictions. Kithra therefore frames its output as *descriptive agreement*,
  never *predictive certainty*.

## 7. Accessibility

- **WCAG 2.2 SC 2.5.8 (T1 standard).** Pointer targets ≥ 24×24 CSS px at AA
  (with spacing exception) → Kithra uses ≥44 px effective touch targets.
- **SC 2.3.3 / 2.2.2** underpin the reduced-motion and no-autoplay rules in
  `07_MOTION/`.
- **Indic script shaping / font fallback** is an engineering reliability issue,
  not merely aesthetic; covered in `03_BRAND/FONT_RESEARCH.md`.

## 8. What research does NOT justify

- ❌ "A 100% score means a happy marriage."
- ❌ "Deep questionnaires guarantee better outcomes" — **untested for Kithra**.
- ❌ "Pink/rose increases conversion" — no credible causal evidence found.
- ❌ "AI twins replicate a mind" — actively rejected.
- ❌ Any retention/accuracy statistic invented for this document.

## 9. Proposed research programme (validation, Phase 14)

1. Cognitive interviews — *what does this item mean to you?* (n≈15/segment).
2. Fatigue curve test — completion/quality vs item count.
3. Five-second first-impression tests on hero + palette variants.
4. Mode-separation comprehension test (friendship vs dating vs matrimony).
5. Photo-privacy comprehension test (what is visible in which mode).
6. Price-comprehension + cancellation-fairness test.
7. Accessibility sessions with screen-reader and low-bandwidth users.

All thresholds and sample sizes live in `09_VALIDATION/`.
