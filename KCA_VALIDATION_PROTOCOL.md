# KITHRA CONNECTION ASSESSMENT (KCA) — EMPIRICAL RESEARCH VALIDATION PROTOCOL
**Document Version:** 2026.11-REV-1.0  
**Methodological Standards:** American Educational Research Association (AERA), American Psychological Association (APA), National Council on Measurement in Education (NCME) *Standards for Educational and Psychological Testing* & International Test Commission (ITC) Guidelines  
**Ethical Review:** Indian Council of Medical Research (ICMR) Ethical Guidelines for Biomedical and Health Research Involving Human Participants & Digital Personal Data Protection (DPDP) Act 2023

---

## 1. Executive Summary & Research Mandate

Kithra is committed to scientific integrity:
> **Core Principle:** Software unit tests verify system execution and data pipelines. They do **NOT** constitute empirical psychometric validation.

Commercial overclaims and unvalidated personality labels violate ethical research standards. This document specifies the canonical **Four-Stage Empirical Validation Protocol** required to transition the Kithra Connection Assessment (KCA) from an *experimental, research-informed prototype* into a *scientifically validated psychometric instrument*.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   KCA 4-STAGE EMPIRICAL VALIDATION ROADMAP              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│ STAGE 1: QUALITATIVE & COGNITIVE     │        │ STAGE 2: QUANTITATIVE PILOT          │
│ • Expert Psychometric Review         │───────►│ • Statistical Power N Calculation    │
│ • Think-Aloud Cognitive Interviews   │        │ • Item-Total Correlations & EFA      │
│ • Ambiguity & Cultural Screening     │        │ • Differential Item Functioning      │
└──────────────────────────────────────┘        └──────────────────┬───────────────────┘
                                                                   │
    ┌──────────────────────────────────────────────────────────────┘
    ▼                                                               ▼
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│ STAGE 3: CONFIRMATORY VALIDATION     │        │ STAGE 4: CONNECTION USEFULNESS       │
│ • Confirmatory Factor Analysis (CFA) │───────►│ • Pre-Post Dyadic Conversation Study │
│ • Measurement Invariance (Config/Met)│        │ • Psychological Safety vs Swipes     │
│ • Omega (ω), Alpha (α), Test-Retest  │        │ • Second-Meetup Reciprocity Rate     │
└──────────────────────────────────────┘        └──────────────────────────────────────┘
```

---

## 2. Stage 1: Expert Review & Cognitive Interview Protocol

### 2.1 Independent Expert Review Board
- **Composition:** 5 independent doctoral-level psychologists and psychometricians specializing in relationship science, cross-cultural psychology, and South Asian family dynamics.
- **Review Rubric:** Content validity ratio (CVR; Lawshe 1975). Items must achieve $CVR \ge 0.70$ across:
  1. Construct fidelity (does the scenario truly measure the target construct?).
  2. Cultural ecological validity (does it reflect authentic modern Indian life?).
  3. Neutrality of response options (absence of socially sanctioned "right answers").

### 2.2 Cognitive Interview Protocol (Think-Aloud Methodology)
- **Sample Size:** $N = 30$ adult participants stratified across:
  - Gender: 15 Men, 15 Women (inclusive of non-binary participants).
  - Age: 21–45 years.
  - Geographic diversity: Tier-1 Metros (Bengaluru, Chennai, Mumbai) and Tier-2 Cities (Coimbatore, Indore, Kochi).
  - Linguistic background: Bilingual English-Tamil and English-Hindi speakers.
- **Procedure:**
  1. Participant reads the scenario and answer options aloud.
  2. *Concurrent Probe:* "What went through your mind when you read Option B?"
  3. *Retrospective Probe:* "Did any option feel like the 'obviously good' answer?"
  4. *Cultural Check:* "Would your peers in your hometown understand this scenario, or does it feel foreign or imported?"
- **Exit Criteria:** Zero items flagged for linguistic ambiguity or moral embarrassment.

---

## 3. Stage 2: Quantitative Pilot & Statistical Power Calculation

### 3.1 Sample Size ($N$) Determination via Power Analysis
Under Structural Equation Modeling (SEM) and factor analysis standards (MacCallum, Browne, & Sugawara 1996; Wolf et al. 2013), minimum sample size for testing root mean square error of approximation (RMSEA) is computed based on degrees of freedom:
- For a 14-construct model with 3 to 5 indicators per factor ($df \approx 700$ to $900$):
  - Null hypothesis: $H_0: \text{RMSEA} = 0.05$ (close fit).
  - Alternative hypothesis: $H_1: \text{RMSEA} = 0.08$ (mediocre fit).
  - Significance level: $\alpha = 0.05$.
  - Target Statistical Power: $1 - \beta = 0.80$.
- **Required Minimum Sample:** $N = 350$.
- **Planned Target Sample with 15% Attrition Buffer:** **$N = 450$ Participants**.

### 3.2 Quantitative Pilot Battery & Administration
- **Design:** Double-blind randomized administration of all 125 candidate items split into two 15-minute sessions to avoid cognitive fatigue.
- **Participant Compensation:** Fair honorarium conforming to ICMR ethical guidelines.
- **Statistical Analyses Conducted:**
  1. *Item Difficulty & Distribution:* Skewness ($< 2.0$) and kurtosis ($< 7.0$).
  2. *Item-Total Correlation ($r_{\text{it}}$):* Items with $r_{\text{it}} < 0.30$ are flagged for rewrite or retirement.
  3. *Exploratory Factor Analysis (EFA):* Minimum rank factor analysis with oblimin rotation to verify factor loading patterns ($\lambda \ge 0.40$, cross-loadings $\le 0.20$).
  4. *Differential Item Functioning (DIF):* Mantel-Haenszel tests to ensure items do not discriminate by gender or linguistic version (English vs Tamil vs Hindi).

---

## 4. Stage 3: Confirmatory Validation, Invariance & Reliability

### 4.1 Confirmatory Factor Analysis (CFA) Fit Criteria
Using maximum likelihood estimation with robust standard errors (MLR) in `lavaan` / R:

| Fit Statistic | Target Benchmark | Standard Reference |
|---|---|---|
| **CFI** (Comparative Fit Index) | $\ge 0.95$ | Hu & Bentler (1999) |
| **TLI** (Tucker-Lewis Index) | $\ge 0.95$ | Hu & Bentler (1999) |
| **RMSEA** (Root Mean Square Error of Approximation) | $\le 0.05$ ($90\% \text{ CI} \le 0.06$) | Browne & Cudeck (1993) |
| **SRMR** (Standardized Root Mean Square Residual) | $\le 0.06$ | Hu & Bentler (1999) |

### 4.2 Measurement Invariance Testing
Multi-group CFA across:
- **Gender Groups:** Men vs Women.
- **Linguistic Formats:** English vs Tamil vs Hindi.
- **Relationship Intentions:** Friendship vs Dating vs Matrimony.

**Invariance Levels Required:**
1. *Configural Invariance:* Same factor structure across all groups ($\Delta CFI \le 0.01$).
2. *Metric (Weak) Invariance:* Equal factor loadings across groups.
3. *Scalar (Strong) Invariance:* Equal item intercepts across groups (enabling valid comparison of latent means without cultural bias).

### 4.3 Psychometric Reliability Standards
- **Internal Consistency:**
  - McDonald’s Omega Total ($\omega_t \ge 0.80$) and Omega Hierarchical ($\omega_h \ge 0.70$) preferred over Cronbach’s $\alpha$ due to tau-equivalence assumptions.
  - Cronbach’s $\alpha \ge 0.75$ for continuous subscales.
- **Test-Retest Stability:**
  - Administered to a subsample of $N = 100$ after a 4-week interval.
  - Intraclass Correlation Coefficient (ICC $(2, 1) \ge 0.70$).

---

## 5. Stage 4: Match Usefulness Evaluation Against Baseline

Psychometric consistency is meaningless if the resulting introductions do not create genuine human understanding. Stage 4 evaluates real-world dyadic connection outcomes.

### 5.1 Study Design: Randomized Controlled Dyadic Trial
- **Participants:** $N = 120$ adult pairs matched across Friendship ($n = 40$), Dating ($n = 40$), and Matrimony ($n = 40$).
- **Experimental Groups:**
  - **Group 1 (KCA Psychology Engine):** Matched using KCA 14-construct similarity, complementary balance lenses, and mutual eligibility gating.
  - **Group 2 (Control / Baseline):** Matched using conventional platform criteria (geography, age bracket, and self-selected superficial interests/keywords).

### 5.2 Interaction Protocol
- Both groups engage in an initial structured 45-minute conversation (either virtual video coffee or guided in-person café walk).
- Participants are provided with Kithra's **Shared Ground Conversation Cards** derived from their mutually aligned values.

### 5.3 Outcome Metrics & Hypotheses
1. **Perceived Psychological Safety:** Measured via Edmondson’s Psychological Safety Scale (adapted for dyadic interactions).  
   *Hypothesis:* $M_{\text{KCA}} > M_{\text{Control}}$ ($p < 0.001$, Cohen’s $d \ge 0.60$).
2. **Conversational Depth & Absence of Awkwardness:** Measured via Aron’s Closeness and Self-Disclosure Inventory.  
   *Hypothesis:* KCA pairs report significantly higher depth and faster rapport establishment.
3. **Mutual Second-Meetup Willingness (Reciprocal Reciprocity):** Both members independently vote "yes" to meeting again without knowing the other's vote.  
   *Hypothesis:* KCA reciprocal second-date rate $\ge 60\%$ vs Baseline $\le 30\%$.
4. **Post-Encounter Boundary Respect:** Zero safety incidents, unwanted harassment, or ghosting following explicit boundary setting.

---

## 6. Research Governance, Ethics & DPDP Compliance

1. **Institutional Review Board (IRB) / Ethics Committee:** Protocol submitted to an independent ICMR-recognized ethics board for human behavioral research.
2. **Informed Consent & Voluntary Withdrawal:** Full digital consent explaining research aims, non-clinical nature, data anonymization, and unconditional right to withdraw and delete data under Section 12 of the DPDP Act 2023.
3. **Open Science Disclosures:** Pre-registration of hypotheses and analytical plans on Open Science Framework (OSF) to prevent p-hacking or publication bias.

---
*End of KCA Empirical Research Validation Protocol (Canonical Document).*

