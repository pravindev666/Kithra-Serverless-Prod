# KITHRA — PSYCHOMETRIC HUMAN VALIDATION PROGRAMME (STAGES A–E)

**Document Reference:** `KITHRA_PSYCHOMETRIC_VALIDATION_PLAN.md`  
**Founder Directive:** *"Engage qualified psychometric expertise. Do not invent empirical validation data. Follow International Test Commission guidance. Clearly mark all experimental heuristics."*  
**Standards Compliance:** International Test Commission (ITC) Guidelines for Technology-Based Assessment; Section 12, DPDP Act 2023.  
**Date:** November 2026

---

## 1. VALIDATION OVERVIEW & GUIDING PRINCIPLES

Psychometric tools deployed in high-stakes human matching (Dating, Matrimony, Cofounders) must undergo rigorous empirical validation. Kithra refuses to fabricate synthetic pilot data or claim certified diagnostic precision without human trials.

This validation programme establishes a 5-stage roadmap:

```mermaid
graph LR
    StageA[Stage A: Cognitive Interviews N=30] --> StageB[Stage B: Pilot Reliability N=100]
    StageB --> StageC[Stage C: Factor Structure & IRT N=300]
    StageC --> StageD[Stage D: Ecological Context EMA N=150]
    StageD --> StageE[Stage E: Longitudinal Outcomes N=500 Pairs]
```

---

## 2. THE 5-STAGE EMPIRICAL PROGRAMME

### STAGE A — COGNITIVE INTERVIEWS & COMPREHENSION (N = 30)
- **Objective:** Evaluate item clarity, wording ambiguities, and cultural resonance across urban Indian demographics (Bengaluru, Mumbai, Chennai, Delhi NCR).
- **Methodology:** Think-aloud cognitive interviews (Ericsson & Simon, 1993). Participants verbalize their thoughts while answering the pilot question bank in English, Tamil, and Hindi.
- **Key Metrics:**
  - Item Comprehension Rate ($\ge 95\%$).
  - Translation Discrepancy Index ($< 5\%$ semantic divergence).
  - Identification of confusing response anchors for immediate quarantine.

---

### STAGE B — TEST-RETEST STABILITY & INTERNAL CONSISTENCY (N = 100)
- **Objective:** Measure trait stability over time and scale reliability.
- **Methodology:** Participants complete the assessment at $T_0$, followed by re-administration at $T_1$ (14-day interval) under equivalent conditions.
- **Target Psychometric Benchmarks:**
  - **Test-Retest Stability:** Intraclass Correlation Coefficient $ICC(2,1) \ge 0.70$ for continuous trait facets.
  - **Internal Consistency:** Cronbach's $\alpha \ge 0.75$; McDonald's $\omega_t \ge 0.80$ to account for multi-faceted constructs.
  - **Categorical Stability:** Cohen's $\kappa \ge 0.85$ for discrete non-negotiable gates (monogamy, children intent).

---

### STAGE C — FACTOR STRUCTURE & IRT CALIBRATION (N = 300)
- **Objective:** Verify construct validity and calibrate Item Response Theory parameters ($a_i$ discrimination, $b_{i,k}$ threshold).
- **Statistical Procedures:**
  - **Confirmatory Factor Analysis (CFA):** Testing the 10-construct multidimensional architecture against a single-factor baseline. Fit indices target: Comparative Fit Index ($CFI \ge 0.95$), Tucker-Lewis Index ($TLI \ge 0.95$), and Root Mean Square Error of Approximation ($RMSEA \le 0.06$).
  - **Samejima Graded Response Model (GRM):** Parameter calibration for all 4-option rating items.
  - **Differential Item Functioning (DIF):** Verifying that items do not exhibit gender or language bias (Mantel-Haenszel $\chi^2$, $p > 0.05$).

---

### STAGE D — ECOLOGICAL MOMENTARY ASSESSMENT (EMA) OF CONTEXTUAL VARIANCE (N = 150)
- **Objective:** Validate the core thesis of Task 2 & 3: that within-person variance across contexts (celebrations vs work fatigue) is healthy and real.
- **Methodology:** Smartphone-based micro-prompts delivered twice weekly over 4 weeks measuring situational sociability desire and fatigue levels.
- **Analysis:** Multilevel Modeling (MLM) partitioning variance into within-person ($\sigma^2_{\text{within}}$) and between-person ($\sigma^2_{\text{between}}$) components. We hypothesize that within-person situational variance accounts for $\ge 30\%$ of total variance in social battery, scientifically disproving monolithic "introvert/extrovert" typing.

---

### STAGE E — LONGITUDINAL RELATIONAL OUTCOMES (N = 500 PAIRS)
- **Objective:** Evaluate whether measured construct alignment actually predicts relational satisfaction beyond simple explicit filters.
- **Methodology:** 3-month and 6-month follow-up surveys for consented pairs across Friendship, Dating, Matrimony, and Cofounders.
- **Metrics:** Dyadic Adjustment Scale (DAS-7), communicative friction frequency, and voluntary partnership continuation rates.

---

## 3. INTERNATIONAL TEST COMMISSION (ITC) COMPLIANCE CHECKLIST

Kithra aligns with the *ITC Guidelines on Computer-Based and Internet-Delivered Testing*:

| ITC Principle | Requirement | Kithra Architecture Compliance |
|---|---|---|
| **Guideline 1.1** | Maintain data security and confidentiality. | Cryptographic RS256 token verification; Section 12 DPDP erasure. |
| **Guideline 2.4** | Clear, honest explanation of test purpose. | Plain-English *"Why we ask this"* note on every question card. |
| **Guideline 3.2** | Avoid unwarranted claims of precision. | Continuous dimensions with explicit SEM margins ($\pm 5, \pm 9, \pm 15$). |
| **Guideline 4.5** | Guard against careless responding without prejudice. | Multi-signal safeguard engine; zero moral accusations or suspensions. |
| **Guideline 5.1** | Fair accommodation for diverse language/assistive users. | No time-limit penalties; screen-reader and multilingual support. |

---

## 4. CURRENT EXPERIMENTAL DISCLOSURES

Until Stage B data collection is complete and calibrated by qualified psychometricians:
1. All spread thresholds (28 pts consistent, 58 pts contextual) are labeled in code and telemetry as:  
   `[EXPERIMENTAL HEURISTIC — UNCALIBRATED PILOT THRESHOLD]`.
2. All archetype labels are described as:  
   `[OPTIONAL PRODUCT SUMMARY — NOT A CERTIFIED PSYCHOLOGICAL DIAGNOSIS]`.
3. All similarity evaluations carry the mandatory non-overclaim notice:  
   `"Describes self-reported preference alignment; not a probability of relationship success."`

