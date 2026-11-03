# 04 — CONTEXTUAL TRIANGULATION, FAIR RESPONSE QUALITY & PRIVACY-PRESERVING ADMIN EVENTS

## 1. Contextual Behavioral Triangulation: Correcting the "21-Card Trick" Analogy (Deliverable 8)

### Why Psychological Assessment Is NOT a Card Trick
In a 21-card magic trick, a card has a single fixed discrete state (e.g., *Queen of Hearts*), and three deals deterministically narrow 21 possibilities to 1 (`3^3 = 27 >= 21`). Human psychology does **not** work that way:
- People are not hiding a single static card; their behavior varies meaningfully across **situational contexts** (Mischel & Shoda, 1995; Fleeson, 2001).
- Treating normal situational variation as "lying" or "contradiction" produces false accusations and punishes nuanced human beings.

### Four-Outcome Triangulation Model
Implemented in [`evaluateContextualTriangulation`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L989-L1089):

| Outcome Classification | When It Occurs | `isFlaggedAsDishonest` | Engine Action |
|---|---|---|---|
| `consistent_preference` | Multiple observations across contexts fall within a `<= 25`-point spread | `false` | High-confidence construct score |
| `plausible_situational_variation` | Observations come from genuinely different situational contexts (e.g., `crowded_celebration: 85` vs `post_work_solitude: 20` or `scenarioHasFatigueOrRoleContext: true`) | `false` | Preserves both context tags and notes normal contextual nuance (`Test C`) |
| `incomplete_measurement` | Fewer than 2 observations recorded for the construct | `false` | Marks construct as provisional until more items are answered |
| `contradiction_requiring_clarification` | Two anchor items in the **exact same context** conflict sharply (`>= 60`-point spread or `directAnchorConflictDetected: true` without fatigue/role nuance) | `false` | Offers a calm, non-accusatory clarification prompt (`Test D`) |

---

## 2. Fair, Multi-Signal Response-Quality & Anti-Gaming Specification (Deliverable 9)

Implemented in [`evaluateResponseQuality`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L1168-L1280), grounded in Meade & Craig (2012) and Curran (2016):

1. **Display Position vs. Semantic Meaning Separation:**
   - Every response logs both `displayedOptionIndex` (`0..3`) and `semanticOptionId`.
   - Because options are shuffled deterministically per session, clicking a varied display position while endorsing coherent semantic choices (`Test F`) is recognized as `valid_high_confidence`.
2. **Protection for Thoughtful Fast Readers (`Test F`):**
   - A fast reader (`~790–880ms` per item) whose semantic choices are internally coherent (`directContradictionCount === 0` and varied display positions) is **never** penalized or flagged.
3. **Multi-Signal Careless Pattern Detection (`Test E`):**
   - Only when **multiple converging signals** occur simultaneously—such as ultra-fast completion (`medianResponseTimeMs < 650ms` or `< 900ms` with contradictions) **AND** uniform straight-lining (`identicalDisplayPositionRatio >= 0.85`)—does the engine classify the session as `low_confidence_validity`.
4. **Zero Accusations, Zero Automatic Suspensions:**
   - `isAccusedOfDishonesty` is permanently `false`.
   - `isBlockedOrSuspended` is permanently `false`.
   - The member-facing prompt states calmly: *"We noticed that some of your assessment responses were completed very quickly. You can take a break, review your answers, or resume whenever you're ready."*

---

## 3. Minimal Admin Quality Events With Zero Raw Answers (Deliverable 10)

When `qualityState === 'low_confidence_validity'`, Kithra emits only a privacy-preserving metadata event (`AdminQualityReviewEvent` in [`src/types/kithra.ts`](file:///c:/Users/hp/Desktop/Kithra/src/types/kithra.ts#L430-L441)):

```json
{
  "eventType": "assessment_quality_review_recommended",
  "sessionReference": "sess-careless-1",
  "sessionId": "sess-careless-1",
  "assessmentVersion": "2026.11-psych-v2.0-deterministic",
  "broadCategory": "rapid_completion_and_uniform_pattern",
  "timestamp": "2026-11-02T02:45:00.000Z",
  "reviewStatus": "pending_optional_member_retry",
  "rawAnswersIncluded": false
}
```

### Strict Staff Access Control (`Test L`)
Implemented in [`authorizeRawAnswerAccess`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L1301-L1324):
- `authorizeRawAnswerAccess('admin_support')` → `{ allowed: false, reason: 'SERVER_SIDE_ACCESS_DENIED: ...' }`
- `authorizeRawAnswerAccess('trust_safety')` → `{ allowed: false, reason: 'SERVER_SIDE_ACCESS_DENIED: ...' }`
- `authorizeRawAnswerAccess('member_self')` → `{ allowed: true, reason: 'MEMBER_SELF_ACCESS_PERMITTED' }`

