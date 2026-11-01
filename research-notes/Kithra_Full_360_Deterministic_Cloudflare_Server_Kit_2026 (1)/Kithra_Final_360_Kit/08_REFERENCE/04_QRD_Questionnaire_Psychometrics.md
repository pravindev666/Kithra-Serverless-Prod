> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# QRD — Questionnaire, Psychometric Research & Assessment Engineering

**Important:** all 100 items per theme are **placeholders by design**. There is no scientific validation at present. Professional psychometric review, consent and longitudinal validation precede use of high-stakes claims.

## 1. Objectives and risks
Collect only data needed to support user-understandable compatibility, not wholesale replication of a human brain. A psychological questionnaire cannot reconstruct consciousness, predict all behaviors, or truthfully prevent respondents from using AI. No hidden sexual-orientation, religion, caste, disability, trauma or mental-health classifier. If a trait is necessary for an explicitly selected dating/matrimony feature, obtain informed, separate, revocable consent for the exact trait and processing purpose; evaluate fairness and legality.

## 2. Proposed themes, each with 100-item **future** sets

| Theme | Short slug | Intended constructs | Releases |
|---|---|---|---|
| Reasoning & Decision Style | DECIDE | uncertainty tolerance, deliberation, problem approach | later controlled production validation |
| Conversation & Conflict | CONNECT | feedback, repair, listening preference | early controlled production validation |
| Values & Trust | COMPASS | reliability, honesty expectations, boundaries | early controlled production validation |
| Emotional Coping | EQUILIBRIUM | self-reported emotion regulation and reassurance needs | expert-gated |
| Social Rhythm | RHYTHM | solitude, availability, activities, contact cadence | early controlled production validation |
| Growth & Ambition | HORIZON | learning goals, career/life goals | later controlled production validation |
| Family & Long-Term Plans | ROOTS | household/family orientation and life plans | matrimony only |
| Money & Practical Life | GROUND | spending, risk, household financial expectations | matrimony only |
| Interests & Curiosity | SPARK | books, art, technology, adventure, hobbies | early controlled production validation |
| Complementary Collaboration | MOSAIC | negotiation, role preferences, task approach | research |
| Digital Boundaries & Privacy | SHIELD | contact boundaries, sharing and safety preferences | early controlled production validation |
| Future Change & Resilience | TIDE | adaptation, moving cities, changes in commitments | later controlled production validation |

Every theme is a **catalog** of versions: `CONNECT-v1-setA` (100 placeholders), `CONNECT-v1-setB` (100 different placeholders), etc. The user asked to avoid repeated questions: achievable by rotating versioned item banks, but mathematically impossible to promise unique items indefinitely with a finite catalog. Clearly limit re-use within a configurable interval and prioritize psychometric comparability over randomness.

## 3. Question model
Required: `question_id` UUID, `theme_id`, `item_bank_version`, `item_revision`, `locale`, `body_placeholder`, `response_type`, `choices`, `construct_ids`, `weighting_version`, `reverse_coded`, `sensitivity_class`, `consent_purpose`, `estimated_seconds`, `active`, `effective_at`, `retired_at`, `psychometric_review_id`, `experiment_group`, `accessibility_label`, and `display_constraints`. All placeholder text must be rendered with **"Draft item—do not infer psychological meaning"** in nonproduction.

Response forms: forced choice, 5/7 point Likert, situational judgment, ranking, optional open text. Free-text high sensitivity requires separate opt-in, moderation/data-minimization and training-data ban by default. Randomize response-option order only when it cannot change interpretation (e.g. do not shuffle Likert scale endpoints). No deceptive "magic trick" claims.

## 4. Quiz assignment / selection
1. Server authenticates user and confirms relevant mode consent and theme eligibility.
2. Server locks a published quiz version, selects from a sufficiently large pool, uses cryptographically secure randomness to make a stable order seed, and stores an encrypted/opaque assignment ID.
3. Exclude items recently seen within policy window, while preserving required anchor items used for score comparability.
4. Deliver a small batch of signed item IDs (not trait weights); answers posted incrementally with `attempt_id`, `item_id`, `revision`, `answer`, and idempotency key.
5. On submit, server validates assignment completeness, consistency, quotas and selected validity signals. Flag anomalies for **retest**, not automatic accusation.
6. Derive traits server-side using a published scoring version; retain enough audit to reproduce the score while respecting deletion and retention schedules.
7. Recalculate all dependent matches if user withdraws consent or a scoring bug is corrected; queue updates and inform users of material changes.

## 5. Anti-gaming—what is realistic
Question-order randomization, alternate wording, scenario variations, lie/social-desirability scales only if validly assessed, test-retest drift analysis, timing anomaly flags (not simplistic AI detector), response consistency checks, rate limits, batch visibility, soft trust flags, optional corroborating experiences over time, bias review and abuse dispute. **Cannot prevent AI usage, nor prove genuine personality from answers alone**. Do not penalize disabled or slow-reading users for time spent.

## 6. Psychological validity and method
- Pre-register constructs and intended score interpretation before collecting data.
- Use peer-reviewed instruments only with license/attribution, Indian language/cultural validation and professional oversight; no diagnosis.
- Conduct cognitive interviews (what does the question mean), controlled production validation item analysis, reliability and temporal stability, dimensionality, convergent/discriminant validation, measurement invariance across relevant demographics if lawfully collected, and outcome validation.
- Avoid assuming Big Five, MBTI, attachment style, "love languages" or proprietary archetypes are interchangeable; each has a different evidentiary basis.
- Compare extended questionnaire against short baseline; report differential attrition and sample-selection effects.
- No outcome interpretation unless suitable representative holdout validation exists; all percentages labeled index agreement and model version.

## 7. Versioning & scoring integrity
`assessment_attempt` binds one exact `item_bank_version`, `scoring_version`, `consent_receipt_id`, pseudonymous member ID, assignment digest, start/end. `score_snapshot` immutable versioned derivation and optional invalidation cause; never overwrite historical score silently. API does not return weights, sensitive responses, anomaly flags or model internals to other users.

## 8. Sample machine-readable placeholder
See `scaffolds/quiz-placeholder.schema.json`. A seed generator should produce `Q001`–`Q100` for each selected theme and set, all with `status:'placeholder'`. They are **not administered in production** until author, psychometric reviewer, legal/privacy reviewer and publishing admin approve.

## 9. Definition of done for a real quiz bank
All 100 published items have clear constructs, age appropriateness, reasonable answer burden, accessibility, localized wording review, no biased or invasive hidden inference, agreed opt-out/skip behavior, validated scoring parameters, supporting documentation, consent notice, model card, adversarial retest, reproducibility tests, and a signed release approval.
