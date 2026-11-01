> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# MRD — Matching, Compatibility Lenses, Identity Taxonomy & Model Governance

## 1. Governing principle
Kithra's numerical match measure is a **model-defined agreement index**, not the probability that two humans will have a successful friendship, date or marriage. `100%` means index maximum given measured dimensions with sufficient coverage; `0%` means measured divergence according to index; never "destined" or "perfect soul". Restrict scores when confidence/coverage is too low.

## 2. Proposed categories and user-friendly labels
- **Mirror Twin**: unusually similar measured scores across selected traits; not identical brains.
- **Counterpoint**: unusually different measured traits; could be interesting, not necessarily compatible.
- **Mosaic Fit**: modeled *complementarity* on a defined set of role/behavior preferences, with mandatory shared boundaries and consent.
- **Resonance**: broad mode-specific shared aims and styles.
- **Horizon Match**: shared growth and future-life goals.
- **Circle Match**: shared activity/community interest.
- **Quiet Harmony**: similar communication pace, not an innate personality class.
These are UI labels under test, not clinical diagnoses, personal worth labels or fixed human castes/classes.

## 3. Eligibility precedes scoring
`eligible(u,v,mode)` requires verified-active adult accounts, same consented mode, each discoverable and allowlisted by region/visibility, no blocks/reports requiring hold, compatible disclosed preferences, age policies, no duplicate/self, within request quotas, not fraud-restricted. Dating/matrimony must respect explicit reciprocal orientation and relationship preferences *only if voluntarily provided for that mode*; no inferred sexual orientation. All hard filters are non-negotiable; **no high score may override consent or a block**.

## 4. Example computational framework (hypothesis, not validated)
For two users, normalize psychometric traits `x_i` and `y_i` to [0,1], and derive `w_i >= 0` from mode-specific published model version. Let `present_i` reflect both having sufficient reliable data, and `confidence_i` be trust in measurement.

`similarity = 100 * Σ(w_i * confidence_i * present_i * (1 - |x_i-y_i|)) / Σ(w_i * confidence_i * present_i)`.

`difference = 100 * Σ(w_i * confidence_i * present_i * |x_i-y_i|) / Σ(w_i * confidence_i * present_i)`.

`complementarity` is NOT simply `difference`: it requires an empirically defensible pairing function for particular preference pairs, and must respect shared values and safety boundaries. Example: one prefers planning and the other prefers spontaneous activities; this may cause friction, not balance. Until validated, expose it as *possible complementary preferences* and let both humans decide.

`score_coverage = Σ(w_i * present_i) / Σ(w_i)`; do not show precision/bands when coverage below a predeclared confidence gate (initial proposal: 70%, to validate). Report rounded intervals/bands (90–100,80–89...10–19) with note "model index", not false exact numeric certainty. UI may offer `100 / 90 / ... / 10` filters only if these represent bucket upper endpoints rather than a claim of 100% psychological accuracy.

## 5. Mode-specific weights (provisional; must be tested)

| Dimension | Friendship | Dating | Matrimony |
|---|---:|---:|---:|
| Shared social activities | 20 | 10 | 5 |
| Communication & conflict | 20 | 25 | 20 |
| Values / boundaries | 25 | 25 | 25 |
| Time / geographic availability | 25 | 15 | 10 |
| Future plans / practical life | 5 | 15 | 30 |
| Complementary habits (validated only) | 5 | 10 | 10 |
| **Total** | **100** | **100** | **100** |

Do **not** present these as scientifically established weights. They are initial hypotheses for offline experimentation. No scoring on protected categories as proxy for worth. A user may disclose religion or other preferences voluntarily but any use in rankings must pass counsel/privacy/fairness review.

## 6. Twin, opposite and puzzle fairness
- Mirror: high similarity + adequate reliability and coverage.
- Counterpoint: high difference; the description says "interesting contrast" not "your destined anti-soulmate".
- Mosaic Fit: specific observable complementarity with **mutual confirmation**; never assert that one partner "fixes" another or can repair illness, trauma, abuse or moral deficiency.
- Population sizes: never claim there is a 100% mirror candidate if nobody meets threshold; transparent empty state.
- Avoid exposure amplification: ranking should balance relevance, new users, fairness, safety and available attention; not always promote already-popular profiles.

## 7. Pair outcome feedback and responsible learning
Collect explicit minimal feedback after actual interactions: comfortable?, mutually wish to continue?, met safely?, contact again at D7/D30? No covert analysis of private messages to infer romance/sexuality. Use consented aggregated outcome analysis to test whether scores predict continuation better than simple baseline; account for selection bias and missing responses; do not train AI models on chat content without a fresh, separate opt-in.

## 8. Match explanation design
For each candidate show: compatible mode, explainable top 3 dimensions, 1–2 possible challenges framed neutrally, data confidence, "What we have not measured," quick block/report, a note that humans are more than an index. Never expose the other's raw quiz answers; only share traits each party specifically marked public in that mode. Disabled or privacy-restricted profiles should not be included.

## 9. Offline experiments and model governance
**Superseded by v3 deterministic policy:** Kithra uses only questionnaire-derived and rule-based comparisons; no AI runtime is in scope.

## 10. Latency & scaling
Use batch match generation on quiz submit/consent change with durable queue; indexed candidate retrieval by mode/region/interest; local top-N rerank in Worker CPU budget; materialize top candidates and lens scores in D1 with model version/time-to-live. Cache non-sensitive cohort counts; never cache private scores across users. For 100k+ active users consider dedicated vector DB/Postgres and async scoring service after measurement, not preemptively.
