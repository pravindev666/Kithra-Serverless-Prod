# 🧪 KITHRA — ITEM-LEVEL SCIENTIFIC REVIEW, EXPERIMENT DESIGN & VALIDATION ROADMAP
**Document Reference:** `KITHRA_ITEM_REVIEW_BACKLOG_AND_VALIDATION_ROADMAP.md`  
**Version:** 2026.11 (Psychometric Governance & Experimental Protocol)  
**Workspace:** `C:\Users\hp\Desktop\Kithra`  
**Audience:** Psychometricians, Research Scientists, Engineering Leadership  

---

## 1. Item-Level Scientific Audit of the 125-Item Candidate Bank

Every item in the Kithra question bank ($63$ pilot items + $62$ expanded candidate items = $125\text{ total items}$) was audited across 6 scientific dimensions:
1. **Construct Validity:** Whether the item measures an established psychological construct (e.g., Five-Factor Model, Relational Autonomy, Cognitive Flexibility).
2. **Measurement Format:** Continuous rating scale (Likert 1–5), Situational Judgment Test (SJT), Values Tradeoff, or Forced Choice.
3. **Scoring Nature:** Continuous trait dimensional score (0–100) vs. Discrete categorical eligibility gate (Pass/Fail).
4. **Contextual Triangulation Status:** Whether the item belongs to a paired cluster designed to isolate situational variance.
5. **Cultural & Linguistic Review Status:** Whether the item has undergone Indian cultural localization (joint families, festivals, multilingual translations in Hindi/Tamil/Telugu).
6. **Empirical Calibration Status:** Expert-reviewed pilot draft vs. IRT-calibrated ($a, b, c$).

### Detailed Audit Summary by Cluster

| Item Range | Primary Construct | Format Type | Scoring Nature | Scientific Basis & Literature | Cultural Review Notes | Calibration Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Q1–Q5** | Communication & Reply Rhythm | Direct Preference / SJT | Continuous (0–100) | Walther (1996) Hyperpersonal Communication Theory | Highly applicable across urban Indian messaging rhythms. | Expert Reviewed (Pilot) |
| **Q6–Q15** | Daily Organization & Routines | Situational Judgment | Continuous (0–100) | Costa & McCrae (1992) Conscientiousness / Orderliness | Needs weekend joint family vs nuclear family localization. | Expert Reviewed (Pilot) |
| **Q16–Q25** | Social Energy & Solitude | Contextual Trait / SJT | Continuous (0–100) | Introversion-Extraversion (Eysenck, 1967; Cain, 2012) | Must distinguish family festival crowds from office socializing. | Expert Reviewed (Pilot) |
| **Q26–Q37** | Conflict De-escalation & Repair | Situational Judgment | Continuous (0–100) | Gottman & Silver (1999) Relationship Repair Mechanisms | Addressed high-pressure domestic and workplace scenarios. | Pilot Reviewed |
| **Q38** | Relationship Exclusivity Gate | Direct Preference | **Discrete Gate** | Conley et al. (2012) Relationship Agreements | Critical non-negotiable; never blended into trait averages. | Validated Gate |
| **Q39–Q49** | Romantic Progression & Vulnerability | Values Tradeoff / SJT | Continuous (0–100) | Hazan & Shaver (1987) Adult Attachment | Needs careful translation to avoid Western cultural bias. | Research Draft |
| **Q50** | Children & Family Goals Gate | Direct Preference | **Discrete Gate** | Cherlin (2004) De-institutionalization of Marriage | Essential matrimonial filter across Indian demographics. | Validated Gate |
| **Q51–Q62** | In-Law Boundaries & Finances | Situational Judgment | Continuous & Gate | Sonawat (2001) Indian Joint Family Dynamics | Essential for Indian matrimony; balances autonomy & family duty. | High Priority Review |
| **Q63** | Smoking & Vaping Requirement | Direct Preference | **Discrete Gate** | Public Health Lifestyle Standards | Distinguishes social smoking, regular smoking, and vaping. | Validated Gate |
| **Q64–Q75** | Confidentiality & Discretion | Situational Judgment | Continuous (0–100) | Relational Ethics & Social Boundary Theory | Cross-context paired items (Friendship vs Workplace). | Triangulation Linked |
| **Q76–Q95** | Values Tradeoffs & Ambition | Forced Choice / Tradeoff | Continuous (0–100) | Schwartz (1992) Basic Human Values | Career vs personal balance; avoids social desirability bias. | Research Draft |
| **Q96–Q110** | Situational Crisis & Adaptability | Situational Judgment | Continuous (0–100) | Pulakos et al. (2000) Adaptability Dimensions | Tests resilience when scheduled plans are disrupted. | Pilot Reviewed |
| **Q111–Q125** | Cofounder Authority & Risk | Forced Choice / SJT | Continuous & Gate | Wasserman (2012) The Founder's Dilemmas | Equity split, bootstrap vs VC, tie-breaking authority. | Professional Pilot |

---

## 2. Four-Arm Experimental Design: Measuring Matching Value (Task 8)

To prove scientifically that Kithra's psychological and skills matching delivers genuine value—without manufacturing claims—we define a **pre-registered 4-arm randomized trial**:

```
                       4-ARM RANDOMIZED MATCHING EXPERIMENT
                       
                  Consented Cohort of Members (N = 600)
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
  │   ARM 1:    │            │   ARM 2:    │            │   ARM 3:    │
  │  Explicit   │            │  Explicit   │            │  Explicit   │
  │ Preferences │            │ + Continuous│            │+ Psychology │
  │    Alone    │            │  Psychology │            │+ Explanations
  └─────────────┘            └─────────────┘            └─────────────┘
  (Baseline Control)         (Algorithmic Match)        (Full Kithra Experience)
                                                               │
                                                               ▼
                                                        ┌─────────────┐
                                                        │   ARM 4:    │
                                                        │ (Cofounders)│
                                                        │ Skills Alone│
                                                        │ vs. Skills  │
                                                        │ + Work-Style│
                                                        └─────────────┘
```

### Measured Real-World Outcome Metrics:
1. **Introduction Acceptance Rate:** Percentage of delivered match cards that lead to a mutually welcomed introduction.
2. **First Conversation Longevity:** Percentage of accepted conversations that exchange $\ge 20$ meaningful messages.
3. **Perceived Match Quality:** Post-introduction single-question survey: *"Did you feel this person fundamentally understood your preferences?"* (1–5 Likert).
4. **Boundary Disrespect Incidence:** Number of Trust & Safety complaints or blocking events per 1,000 matches.
5. **Cofounder Collaboration Success (Arm 4):** Percentage of cofounder pairs who mutually agree to undertake a 30-day trial project and complete at least Week 2 milestones.

> [!CAUTION]
> **No Manufactured Claims:** If Arm 2 or Arm 3 fails to show statistically significant ($p < 0.05$) superiority over Arm 1 in pilot cohorts, Kithra will transparently report the findings, simplify the model, and prune uninformative questionnaire items.

---

## 3. Prioritized Implementation & Validation Roadmap

```
                          FIVE-STAGE VALIDATION ROADMAP
                          
  [Stage 1: Cognitive Interviews] ──► [Stage 2: Pilot Calibration] ──► [Stage 3: DIF Analysis]
  • 30 in-depth qualitative            • N = 100-300 cohort              • Differential Item
    think-aloud sessions.                in Bengaluru & Chennai.           Functioning across
  • Identify confusing wording         • Compute preliminary             Hindi, Tamil, English.
    and cultural misalignments.          Cronbach's alpha & IRT a,b.     • Eliminate cultural bias.
                                                                                 │
                                                                                 ▼
  [Stage 5: Longitudinal Retention] ◄── [Stage 4: 4-Arm Clinical A/B Testing] ◄──┘
  • 6-month relationship and            • Measure real intro acceptance
    startup partnership survival.         and safety incident rates.
```

### Roadmap Milestones:
* **Stage 1 (Weeks 1–4):** Cognitive interviewing with 30 diverse Indian adults (urban working professionals, entrepreneurs, family-oriented singles).
* **Stage 2 (Weeks 5–8):** Closed private pilot ($N = 200$) in Bengaluru. Item-level response frequency analysis, identification of floor/ceiling effects, and pruning of uninformative items.
* **Stage 3 (Weeks 9–12):** Translation verification in Hindi and Tamil; Differential Item Functioning (DIF) to ensure items measure the same underlying construct across linguistic groups.
* **Stage 4 (Weeks 13–20):** Execution of the 4-Arm randomized trial across Friendship, Dating, and Cofounders.
* **Stage 5 (Ongoing):** Post-match outcome tracking to evaluate long-term partnership durability.

