# 08 — PERSONALITY PATTERN GROUPS, QUESTIONNAIRE ARCHITECTURE, PLAIN-ENGLISH LENSES & 0–100 SIMILARITY DISCOVERY

## 1. Psychological & UX Foundation: Continuous Dimensions First, Experimental Pattern Summaries Second

In psychometric science and consumer product design, Kithra separates **continuous psychological measurement** from **human-readable product summaries**:

1. **Five Separate Psychological Concepts (Never Collapsed Into One Vague Percentage):**
   - **Personality:** Relatively stable tendencies in social energy, curiosity, steadiness, and structure.
   - **Values:** Core life priorities such as honesty, egalitarian partnership, autonomy, and family warmth.
   - **Preferences:** Everyday tastes and routines (weekend pace, reply cadence, morning vs. evening hours).
   - **Boundaries & Non-Negotiables:** Explicit requirements (relationship structure `exclusive_required` vs. `open_required`, essential children goals, intention scope).
   - **Compatibility:** How two eligible people's traits, values, preferences, and boundaries interact within a specific intention (`friendship`, `dating`, or `matrimony`).

2. **Multi-Stage Assessment Guardrail (No 5-Answer Archetype Overclaim):**
   - **Stage 1 (`5–14` answered questions):** Unlocks an **Early Provisional Reflection Note** (`confidenceBand: 'provisional_early_note'`, `assignedPrimaryArchetype: null`). Five questions cannot scientifically classify a human being into a fixed personality type.
   - **Stage 2 (`15–29` answered questions):** Unlocks a **Developing Experimental Pattern Summary** (`Primary Pattern` + `Secondary Nuance`), explicitly labeled as an evolving descriptive summary rather than a fixed identity.
   - **Stage 3 (`30+` answered questions):** Unlocks an **Established Experimental Pattern Summary** across multiple life chapters, while all discovery and compatibility calculations continue to operate on underlying continuous dimensions.

---

## 2. The 8 Kithra Experimental Pattern Summaries (Stage 2+ Only)

| Pattern ID | Member-Facing Name | Tagline | Core Construct Drivers | Plain-Language Summary |
|---|---|---|---|---|
| `steady_anchor` | **Steady Anchor** | Calm and dependable | `trust_reliability`, `emotional_regulation`, `personal_values` | Calm, dependable, and grounded in consistent commitments. |
| `warm_bridge` | **Warm Bridge** | Caring and understanding | `communication`, `conflict_repair`, `emotional_regulation` | Caring, understanding, and attentive to gentle conflict repair. |
| `curious_spark` | **Curious Spark** | Explorative and imaginative | `personality_traits`, `adaptability_change`, `social_friendship` | Explorative, imaginative, and open to new perspectives. |
| `mosaic_builder` | **Mosaic Builder** | Practical and collaborative | `daily_lifestyle`, `adaptability_change`, `trust_reliability` | Practical, collaborative, and comfortable coordinating shared routines. |
| `deep_current` | **Deep Current** | Thoughtful and reflective | `communication`, `autonomy_boundaries`, `personal_values` | Thoughtful, reflective, and drawn to unhurried one-on-one conversation. |
| `horizon_planner` | **Horizon Planner** | Future-minded and organized | `family_domestic`, `daily_lifestyle`, `personal_values` | Future-minded, organized, and clear about long-term life goals. |
| `calm_rhythm` | **Calm Rhythm** | Peaceful and steady | `daily_lifestyle`, `emotional_regulation`, `autonomy_boundaries` | Peaceful, steady, and restorative in everyday routines. |
| `circle_gatherer` | **Circle Gatherer** | Social and community-minded | `social_friendship`, `communication`, `family_domestic` | Social, hospitable, and energized by bringing communities together. |

> **Scientific Honesty Rule:** These eight groups are **experimental Kithra product summaries** derived from continuous dimensions—never presented as clinically validated diagnoses or permanent labels.

---

## 3. Plain-English Discovery Lenses (Replaced Technical Jargon)

All member-facing screens use warm, everyday phrases instead of internal technical terms (`Echo`, `Counterpoint`, `Mosaic Fit`), while preserving `'echo' | 'counterpoint' | 'mosaic'` internally for deterministic backend compatibility:

| Internal Key | Old Technical Term | Member-Facing Lens Name | Member-Facing Subtitle | Card Summary Label |
|---|---|---|---|---|
| `'echo'` | ~~Echo~~ | **Similar to Me** | *"Discover people who share your traits, interests and values."* | `Shared Ground:` |
| `'counterpoint'` | ~~Counterpoint~~ | **Different from Me** | *"Meet people who see or experience the world differently."* | `Difference:` |
| `'mosaic'` | ~~Mosaic Fit~~ | **We Balance Each Other** | *"Find people whose strengths and preferences may complement yours."* | `Potential Balance:` |

---

## 4. Full-Range `0–100` Attribute Similarity Discovery

Instead of hiding people with lower similarity scores, Kithra gives members full agency over the **entire `0–100` Attribute Similarity spectrum** among mutually eligible members:

1. **Stage A Mutual Eligibility First:**
   - Before any similarity filter or lens is applied, Stage A checks adult verification, mutual intention enablement (`friendship`, `dating`, `matrimony`), symmetric block rules, and non-negotiable relationship structure / essential children goals (in `dating` and `matrimony` only; `friendship` never inherits romantic restrictions).
2. **Full `0–100` Attribute Similarity Score:**
   - Computed deterministically across comparable answered constructs (`score: 0..100`, or `null` / `insufficient_information` when fewer than 2 comparable constructs are answered; missing answers are never treated as `0/100` dissimilarity).
   - Eligible members across the full spectrum (`95/100`, `75/100`, `50/100`, `25/100`, `5/100`) remain discoverable.
3. **Member-Controlled Range Filter, Presets & Sort in `/member/discover`:**
   - **Quick Presets:**
     - `All People — 0–100`
     - `Very Similar — 80–100`
     - `Somewhat Similar — 50–79`
     - `Quite Different — 0–49`
   - **Custom Range Inputs:** `Minimum Similarity (0–100)` and `Maximum Similarity (0–100)` with inclusive endpoints (`[min, max]`).
   - **Sort Controls:** Default order, `Highest similarity (100 → 0)`, or `Lowest similarity (0 → 100)`.
   - **Strict Independence:** `We Balance Each Other` evaluates mutually welcomed complementary traits (and never rewards boundary violations or coercion) without artificially inflating the raw `0–100` Attribute Similarity Score.
