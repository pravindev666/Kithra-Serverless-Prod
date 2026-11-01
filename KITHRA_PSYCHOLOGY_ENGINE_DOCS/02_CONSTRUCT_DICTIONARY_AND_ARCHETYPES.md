# 02 — CONSTRUCT DICTIONARY, MULTI-STAGE ASSESSMENT & EXPERIMENTAL ARCHETYPES

## 1. The 12-Layer Construct Dictionary (Deliverable 3)

Kithra organizes self-understanding and compatibility across **12 non-clinical, non-diagnostic psychological construct layers** (`ConstructLayerId` in [`src/types/kithra.ts`](file:///c:/Users/hp/Desktop/Kithra/src/types/kithra.ts)):

| Construct ID | Construct Name | Conceptual Layer | Low Pole (`0–30`) | High Pole (`70–100`) | Friendship Weight | Dating Weight | Matrimony Weight |
|---|---|---|---|---|---|---|---|
| `personality_traits` (`C1_openness`) | **Curiosity & Openness** | Personality | Prefers familiar routines and tried-and-true traditions | Drawn to new ideas, cultural outings, and creative exploration | `1.00` | `1.00` | `0.95` |
| `personal_values` | **Core Personal Values** | Values | Pragmatic, situational decision-making | Principle-anchored, explicit value alignment | `1.15` | `1.25` | `1.35` |
| `communication` | **Communication Cadence & Depth** | Preferences & Values | Brief, practical check-ins or action-focused talk | Reflective, letter-like, or deep one-on-one conversation | `1.25` | `1.30` | `1.30` |
| `emotional_regulation` (`C5_steadiness`) | **Emotional Steadiness** | Personality | Expressive, immediate emotional processing | Calm, even-keeled, unhurried emotional pacing | `1.00` | `1.15` | `1.20` |
| `conflict_repair` (`C4_warmth`) | **Conflict & Repair Style** | Values & Behavior | Needs extended solo cooling-off pause before talking | Prioritizes warm, curiosity-led same-day repair | `1.10` | `1.30` | `1.35` |
| `trust_reliability` | **Trust & Follow-Through** | Values | Spontaneous, flexible commitments | High predictability and explicit follow-through | `1.25` | `1.30` | `1.35` |
| `autonomy_boundaries` | **Personal Space & Boundaries** | Boundaries & Preferences | High togetherness and frequent shared time | Strong need for solo recharge and independent space | `1.10` | `1.25` | `1.25` |
| `daily_lifestyle` | **Daily Lifestyle & Routines** | Preferences | Night-owl or unstructured weekend flow | Early-riser or structured domestic rhythm | `1.00` | `1.10` | `1.20` |
| `social_friendship` (`C3_social_energy`) | **Social Energy & Community** | Personality & Preferences | Intimate 1:1 walks and quiet cafés | Group tables, hosting dinners, and lively Circles | `1.35` | `0.90` | `0.85` |
| `romantic_expectations` | **Relationship Structure & Pace** | Boundaries & Values | Slow, friendship-first romantic unfolding | Clear, intentional romantic milestones | `0.00` *(Excluded)* | `1.35` | `1.20` |
| `family_domestic` | **Family & Domestic Partnership** | Values & Boundaries | Couple-first independent household | Closely interwoven multi-generational family life | `0.25` | `0.85` | `1.40` |
| `adaptability_change` (`C2_planfulness`) | **Structure, Planning & Adaptability** | Personality & Preferences | Spontaneous improviser comfortable with detours | Structured horizon planner who maps milestones early | `1.00` | `1.10` | `1.20` |

---

## 2. Multi-Stage Assessment Model (Deliverable 4)

Implemented in [`evaluateMemberStagedPattern`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L868-L953):

| Stage | Answered Items | Estimated Time | Confidence Band | Primary/Secondary Archetype Shown? | What the Member Sees |
|---|---|---|---|---|---|
| **Pre-Stage 1** | `0–4` answers | `< 1 min` | `insufficient_for_pattern` | **No (`null`)** | Starter progress counter (`X of 5 starter questions`). |
| **Stage 1: Lightweight Onboarding** | `5–14` answers | `~1–3 mins` | `provisional_early_note` | **No (`null`) — Strictly Prohibited** | **Early Provisional Reflection Note** describing initial communication/repair tendencies, with an explicit explanation that 5 questions cannot scientifically assign a fixed personality type. |
| **Stage 2: Initial Multi-Theme Profile** | `15–29` answers | `~4–7 mins` | `developing_pattern` | **Yes (Developing & Provisional)** | **Developing Pattern Summary** (Primary + Secondary Nuance) alongside continuous construct bars and an uncertainty notice. |
| **Stage 3: Thematic Deepening** | `30–100` answers | Self-paced | `established_experimental_pattern` | **Yes (Experimental Product Summary)** | Full **Experimental Pattern Summary**, intention-specific modules (`Friendship`, `Dating`, `Matrimony`), and high-confidence `0–100` Attribute Similarity comparisons. |
| **Stage 4: Periodic Reflection Re-check** | Optional revisit (`90+` days) | `~2 mins` | Updated continuous vector | **Yes (Editable / Re-computable)** | Allows members to update answers as life circumstances or intentions evolve. |

---

## 3. The 8 Experimental Pattern Summaries (Deliverable 5)

Implemented in [`EXPERIMENTAL_ARCHETYPE_CATALOG`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L761-L853):

1. **`steady_anchor` — Steady Anchor:** *"Calm and dependable"* — Grounded in `trust_reliability`, `emotional_regulation`, and `personal_values`.
2. **`warm_bridge` — Warm Bridge:** *"Caring and understanding"* — Grounded in `communication`, `conflict_repair`, and `emotional_regulation`.
3. **`curious_spark` — Curious Spark:** *"Explorative and imaginative"* — Grounded in `personality_traits`, `adaptability_change`, and `social_friendship`.
4. **`mosaic_builder` — Mosaic Builder:** *"Practical and collaborative"* — Grounded in `daily_lifestyle`, `adaptability_change`, and `trust_reliability`.
5. **`deep_current` — Deep Current:** *"Thoughtful and reflective"* — Grounded in `communication`, `autonomy_boundaries`, and `personal_values`.
6. **`horizon_planner` — Horizon Planner:** *"Future-minded and organized"* — Grounded in `family_domestic`, `daily_lifestyle`, and `personal_values`.
7. **`calm_rhythm` — Calm Rhythm:** *"Peaceful and steady"* — Grounded in `daily_lifestyle`, `emotional_regulation`, and `autonomy_boundaries`.
8. **`circle_gatherer` — Circle Gatherer:** *"Social and community-minded"* — Grounded in `social_friendship`, `communication`, and `family_domestic`.

