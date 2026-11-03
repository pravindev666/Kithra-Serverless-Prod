# KITHRA CONNECTION ASSESSMENT (KCA) — SCORING & MEASUREMENT CORRECTION PLAN
**Document Version:** 2026.11-REV-1.0  
**Scope:** Mathematical Scoring Models, Category Isolation, and Elimination of Pseudo-Averaging  
**Standard:** International Test Commission (ITC) Guidelines for Assessment & Psychometric Measurement Standards

---

## 1. Executive Summary & Defect Diagnosis

A critical psychometric flaw in naive assessment platforms is **unscientific ordinal conflation**: forcing qualitative stances, lifestyle choices, and values trade-offs into scalar numbers, and then averaging them together to produce a pseudo-character score.

Prior to this audit, three items in Kithra's candidate bank exhibited this defect:
1. **Q103 (`q-103-generosity-and-giving`):** Assigned option values 85, 55, and 20. A participant prioritizing disciplined capital compounding and asset security received a score of 20/100, falsely labeling them as deficient in "personal values."
2. **Q110 (`q-110-crisis-composure-anchor`):** Assigned option values 90, 55, and 20. An emotionally expressive participant seeking empathetic coregulation received 20/100, falsely framing adaptive vulnerability as an "emotional regulation" deficit.
3. **Q113 (`q-113-voice-note-nuance`):** Assigned option values 85, 55, and 20. A participant preferring unhurried written messages received 20/100, treating text communication as an interpersonal defect.
4. **Indiscriminate Averaging:** The self-understanding report engine previously averaged option values across all answered items into an `observedScore` and applied an arbitrary 3-item "established" confidence tag.

This correction plan establishes the mathematical framework, code implementations, and confidence models that eliminate these defects permanently.

---

## 2. Mathematical Models for the 8 Separated Measurement Categories

```
┌────────────────────────────────────────────────────────────────────────┐
│                   KITHRA ASSESSMENT RESPONSE ENGINE                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┴───────────────────────────┐
       ▼                                                        ▼
┌───────────────┐                                       ┌───────────────┐
│ QUANTITATIVE  │                                       │  QUALITATIVE  │
│  CONTINUOUS   │                                       │  CATEGORICAL  │
└──────┬────────┘                                       └───────┬───────┘
       │                                                        │
       ├─► CAT-1: Continuous Traits (0–100)                      ├─► CAT-2: Categorical Preferences
       ├─► CAT-5: Partner Expectations                          ├─► CAT-3: Personal Value Trade-Offs
       └─► CAT-7: Contextual Variation Spread                   ├─► CAT-4: Disclosed Behaviors
                                                                ├─► CAT-6: Essential Mutual Gates
                                                                └─► CAT-8: Connection Outcomes
```

### 2.1 Category 1: Continuous Psychological Traits
- **Mathematical Form:** $x_i \in [0, 100]$ representing an individual's position along a monotonic behavioral continuum.
- **Pairwise Attribute Similarity:**
  $$\text{Sim}_{\text{continuous}}(A, B) = 100 - \frac{1}{|K|}\sum_{k \in K} |x_{A, k} - x_{B, k}|$$
  where $K$ is the set of mutually answered continuous trait constructs.
- **Complementary Balance ("We Balance Each Other"):**
  When both members have explicitly flagged `welcomesComplementarity: true` on an item:
  $$\text{Comp}(A, B) = \min(100, 2 \times |x_{A, k} - x_{B, k}|) \quad \text{for } 30 \le |x_{A, k} - x_{B, k}| \le 70$$
  *Invariant:* Complementary balance never rewards coercion, abuse, or mismatched fundamental values.

### 2.2 Category 2: Categorical Preferences
- **Mathematical Form:** $c_i \in \{C_1, C_2, \dots, C_m\}$ (nominal qualitative choices).
- **Averaging Rule:** **STRICTLY FORBIDDEN.** Nominal categories cannot be summed, subtracted, or averaged into scalar scores.
- **Pairwise Compatibility Matrix:** Evaluated via a symmetric compatibility tensor $M(c_A, c_B) \in [0, 1]$:
  - Exact match (e.g., both prefer voice notes): $M = 1.0$.
  - Complementary pairing (e.g., Storyteller + Listener): $M = 0.9$.
  - Acceptable divergence (e.g., Phone call + Voice note): $M = 0.7$.
  - Mismatched cadence (e.g., Urgent instant reply vs weekly batch): $M = 0.2$.

### 2.3 Category 3: Personal Value Trade-Offs
- **Mathematical Form:** Multi-dimensional orientation vector $\mathbf{v}_i = (v_{\text{benevolence}}, v_{\text{security}}, v_{\text{autonomy}})$ where $\sum v_j = 1$.
- **Scoring Invariant:** Zero moral hierarchy. Asset compounding and communal generosity are both treated as prosocial, defensible orientations.
- **Dyadic Harmony:** Measured via vector cosine similarity or explicit trade-off alignment:
  $$\text{Harmony}_{\text{values}}(A, B) = \frac{\mathbf{v}_A \cdot \mathbf{v}_B}{\|\mathbf{v}_A\| \|\mathbf{v}_B\|}$$

### 2.4 Category 4: Voluntarily Disclosed Behaviors
- **Mathematical Form:** Factual lifestyle vectors (e.g., Chronotype: Lark vs Owl; Diet: Vegetarian vs Non-vegetarian; Pets: Dog vs Cat vs None).
- **Treatment:** Displayed transparently as lifestyle notes. Does not alter psychological personality similarity.

### 2.5 Category 5: Partner Expectations
- **Mathematical Form:** Directional expectation vector $E_{A \to B}$ (what member A desires from partner) compared with self-described traits of member B ($T_B$).
- **Fulfillment Score:**
  $$\text{Sat}(A \to B) = 1 - \frac{\|E_{A \to B} - T_B\|}{100}$$
  Evaluated directionally so that $A$'s satisfaction with $B$ is decoupled from $B$'s satisfaction with $A$.

### 2.6 Category 6: Essential Mutual Eligibility Gates
- **Mathematical Form:** Boolean predicate $G(A, B) \in \{0, 1\}$.
  $$G(A, B) = g_{\text{structure}}(A, B) \land g_{\text{children}}(A, B) \land g_{\text{substance}}(A, B)$$
- **Enforcement Rule:** If $G(A, B) = 0$, the pair is **ineligible for romantic/matrimonial discovery**, regardless of whether their continuous attribute similarity is 99/100.
- **Friendship Exception:** Gate evaluations for relationship structure and children goals are isolated and bypassed for Friendship discovery.

### 2.7 Category 7: Contextual Variation & Triangulation Spread
- **Mathematical Form:** Difference between paired situational items:
  $$D_{\text{cluster}} = |S_{\text{context1}} - S_{\text{context2}}|$$
- **Interpretation Standards:**
  - $D \le 28$: **Consistent Stance** across varied life scenarios.
  - $29 \le D \le 58$: **Plausible Situational Nuance** (e.g., festive in crowds, quiet when tired).
  - $D \ge 59$: **Clarification Recommended** (elicits an optional follow-up without punitive labels).

### 2.8 Category 8: Observed Connection Outcomes
- **Mathematical Form:** Empirical Bayesian post-connection feedback parameters:
  $$\theta_{\text{post}} \sim \text{Beta}(\alpha + \text{positive\_encounters}, \beta + \text{discomfort\_reports})$$
- **Usage:** Adjusts recommendation weights in the Connection Learning Loop without altering user self-reported survey answers.

---

## 3. Remediation of Q103, Q110 & Q113

The code was updated in `src/data/expandedCandidateBank.ts` and `src/types/kithra.ts`:

```typescript
// Q103 Correction:
id: 'q-103-generosity-and-giving',
scoringType: 'value_tradeoff', // REMEDIATED: No longer a continuous trait

// Q110 Correction:
id: 'q-110-crisis-composure-anchor',
scoringType: 'categorical_preference', // REMEDIATED: Coping style is categorical

// Q113 Correction:
id: 'q-113-voice-note-nuance',
scoringType: 'categorical_preference', // REMEDIATED: Media channel is categorical
```

In `src/domain/psychologicalInsightsEngine.ts`, the numerical scoring loop was updated:
```typescript
// Only continuous traits contribute to numerical scores:
const isContinuous = !q.scoringType || q.scoringType === 'continuous_trait';
if (isContinuous && typeof opt.normalizedValue === 'number') {
  sumScore += opt.normalizedValue;
  scoredItemsCount++;
  hasContinuous = true;
} else {
  hasCategoricalOrTradeoff = true;
}
```
**Outcome:** When a member answers Q103, Q110, or Q113, their choices are presented as qualitative reflections and value stances. They are **never** averaged into a continuous trait score.

---

## 4. Replacement of Arbitrary "Established" Confidence Labels

Prior code assigned `confidenceBand = 'established'` after just 3 answered questions. Psychometrically, 3 self-report responses cannot establish a trait.

### 4.1 Dual Confidence Model
To maintain UI compatibility while adhering to ITC scientific standards, Kithra now operates a **Dual Confidence Model**:

1. **User Interface Badge (`confidenceBand`):**
   - 1 Answer: `provisional` (Initial exploration)
   - 2 Answers: `developing` (Emerging pattern)
   - 3+ Answers: `established` (Consistent self-report pattern within platform UI)

2. **Scientific Empirical Criteria (`empiricalConfidenceCriteria`):**
   - `level`:
     - 0 Answers: `insufficient`
     - 1 Answer: `provisional_exploration`
     - 2 Answers: `developing_pattern`
     - 3+ Answers across contexts: `multi_context_triangulated`
   - `scientificValidationStatus`: `'PRE_EMPIRICAL_PILOT'`
   - `requiredPilotSampleSize`: `300` participants with test-retest reliability ($r_{tt} \ge 0.70$) and confirmatory factor analysis ($CFI \ge 0.95$).

---

## 5. Preservation of the 0–100 Attribute Similarity Spectrum

Kithra does not force a binary "compatible / incompatible" threshold. Human relationships thrive on diverse dynamics:
- **Full Spectrum Visibility:** In accordance with the Founder directive, members with attribute similarity 95, 75, 50, 25, and 5 are all discoverable when the member sets their slider to 0–100.
- **Custom Range Filters:** Members can explore specific ranges:
  - High similarity: 80–100 (Shared worldviews).
  - Mid-range similarity: 40–70 (Balanced perspectives).
  - Low similarity: 0–30 (Growth through contrast).
- **The Three Discovery Lenses:**
  1. *Similar to Me:* High attribute similarity across shared temperaments.
  2. *Different from Me:* Substantially divergent attributes that introduce fresh perspectives.
  3. *We Balance Each Other:* Complementary traits (e.g., Storyteller + Listener, Spontaneous Planner + Detailed Navigator) that fit together harmoniously without inflating artificial similarity scores.

---
*End of KCA Scoring & Measurement Correction Plan (Canonical Document).*

