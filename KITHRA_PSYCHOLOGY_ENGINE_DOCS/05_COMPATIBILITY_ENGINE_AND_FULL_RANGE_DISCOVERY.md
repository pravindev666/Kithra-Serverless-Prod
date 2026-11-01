# 05 — COMPATIBILITY ENGINE, PLAIN-ENGLISH LENSES & FULL-RANGE 0–100 SIMILARITY DISCOVERY

## 1. Updated Section 11: Plain-English Discovery Lenses (Deliverable 11)

All member-facing screens (Landing Page, Member Home, Discover, Match Details, Assessments) replace technical lens labels with natural, self-explanatory phrases via [`LENS_DISPLAY_MAP`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L44-L81) and [`SIGNAL_VOCABULARY_METADATA`](file:///c:/Users/hp/Desktop/Kithra/src/data/mockFixtures.ts#L55-L85):

| Internal Identifier | Member-Facing Lens Name | Member-Facing Subtitle | Card Summary Field |
|---|---|---|---|
| `'echo'` | **Similar to Me** | *"Discover people who share your traits, interests and values."* | **Shared Ground:** |
| `'counterpoint'` | **Different from Me** | *"Meet people who see or experience the world differently."* | **Difference:** |
| `'mosaic'` | **We Balance Each Other** | *"Find people whose strengths and preferences may complement yours."* | **Potential Balance:** |

---

## 2. Updated Section 13: Three-Stage Deterministic Compatibility Engine (Deliverable 12)

### Stage A — Mutual Eligibility Gate (Runs First)
Implemented in [`evaluateMutualEligibility`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L186-L333):
1. **Adult Verification:** Both accounts must satisfy `isAdultVerified`.
2. **Symmetric Block Enforcement:** Immediate exclusion across all intentions if either member has blocked the other (`Test 6`).
3. **Shared Intention & Discovery Permission:** Both members must have enabled the active intention (`friendship`, `dating`, or `matrimony`) and allowed discovery in that intention.
4. **Intention-Scoped Non-Negotiables (`dating` and `matrimony` only):**
   - Checks incompatible relationship structure (`exclusive_required` vs `open_required`) and essential children goal conflicts (`wants_children` vs `does_not_want_children` when marked `essential`) (`Test G`).
   - **Intention Isolation (`Test I`):** `friendship` **never** inherits romantic or matrimonial structure/children restrictions.
   - **Unknown Field Honesty (`Test H`):** If a field is `'unknown'`, `evaluateMutualEligibility` returns `eligible: true` with `hasUnknownNonNegotiables: true` rather than falsely rejecting the candidate.

### Stage C1 — Deterministic `0–100` Attribute Similarity Score
Implemented in [`computeAttributeSimilarity`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L387-L492):
- For each overlapping construct $c$ answered by both members ($n_{\text{overlap}} \ge 2$) with intention weight $w_{c,I} > 0$:
$$s_c = 100 - \left|\text{ clamp}(v_c, 0, 100) - \text{clamp}(u_c, 0, 100) \right|$$
$$\text{AttributeSimilarity}(v, u, I) = \text{round}\left( \frac{\sum_{c} w_{c,I} \cdot s_c}{\sum_{c} w_{c,I}} \right) \in [0, 100]$$
- **Missing Data Protection (`Test 7`):** If fewer than `MIN_COMPARABLE_CONSTRUCTS_FOR_SCORE` (`2`) constructs overlap, returns `status: 'insufficient_information'` and `score: null`—never `0/100`.

### Stage C2 — `We Balance Each Other` Complementarity & Boundary Protection (Deliverable 13)
Implemented in [`evaluateWeBalanceEachOther`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L514-L627):
- Evaluates moderate construct differences (`20 <= |v_c - u_c| <= 75`) **only when both members welcome complementary contrast** (`welcomesComplementarity: true`, `flexibility >= 55`, and `mutualAcceptanceOfDifference !== false`).
- **Boundary Protection Rule (`Test K`):** If `boundaryViolationFlag` or `involvesCoercionOrBoundaryViolation` is true, `qualifiesForWeBalanceEachOther` is immediately `false` and `complementaryScore` is `0`. Kithra never frames disrespect, coercion, or boundary violations as "balance."
- **Strict Independence (`Test 8`):** Qualifying for `We Balance Each Other` never alters or inflates the pair's `0–100` Attribute Similarity Score.

---

## 3. Full-Range `0–100` Attribute Similarity Discovery Controls

Implemented in [`filterProfilesByFullSimilaritySpectrum`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L681-L790) and rendered in [`MemberViews.tsx`](file:///c:/Users/hp/Desktop/Kithra/src/components/MemberViews.tsx#L962-L1140):
- **Full `0–100` Default Spectrum (`Test 2`):** Eligible members with scores `95/100`, `75/100`, `50/100`, `25/100`, and `5/100` are all discoverable when the filter is `0–100`.
- **Presets & Custom Min/Max Range (`Tests 3, 4, 5`):**
  - `All People — 0–100`
  - `Very Similar — 80–100`
  - `Somewhat Similar — 50–79`
  - `Quite Different — 0–49`
  - Custom `minSimilarity` (`0–100`) and `maxSimilarity` (`0–100`) with inclusive bounds (`min <= score <= max`).
- **Sort Options:** Default order, `Highest similarity (100 → 0)`, or `Lowest similarity (0 → 100)`.

