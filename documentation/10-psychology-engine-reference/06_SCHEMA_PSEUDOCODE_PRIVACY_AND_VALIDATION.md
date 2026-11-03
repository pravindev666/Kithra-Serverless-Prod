# 06 — DATABASE SCHEMA, PRIVACY, VALIDATION PLAN, RISK REGISTER & FOUNDER DECISIONS

## 1. Cloudflare D1 / PostgreSQL Schema Specification (Deliverable 14)

```sql
-- 1. Versioned Assessment Item Bank
CREATE TABLE assessment_items (
  item_id TEXT PRIMARY KEY,
  version TEXT NOT NULL DEFAULT '2026.11-psych-v2.0-deterministic',
  theme_id TEXT NOT NULL,
  construct_id TEXT NOT NULL,
  format_type TEXT NOT NULL,
  stage INTEGER NOT NULL CHECK (stage IN (1, 2, 3, 4)),
  intention_scope TEXT NOT NULL,
  reverse_keyed INTEGER NOT NULL DEFAULT 0,
  validation_status TEXT NOT NULL DEFAULT 'ORIGINAL / UNVALIDATED',
  prompt_en TEXT NOT NULL,
  prompt_ta TEXT,
  prompt_hi TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Semantic Options (Separated from Visual Display Order)
CREATE TABLE assessment_item_options (
  option_id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES assessment_items(item_id),
  semantic_id TEXT NOT NULL UNIQUE,
  normalized_value INTEGER NOT NULL CHECK (normalized_value BETWEEN 0 AND 100),
  welcomes_complementarity INTEGER NOT NULL DEFAULT 1,
  context_tag TEXT DEFAULT 'general',
  label_en TEXT NOT NULL,
  label_ta TEXT,
  label_hi TEXT
);

-- 3. Member Private Raw Responses (Strictly Isolated from Staff/Admin Views)
CREATE TABLE member_raw_responses (
  response_id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES assessment_items(item_id),
  semantic_option_id TEXT NOT NULL,
  displayed_option_index INTEGER NOT NULL CHECK (displayed_option_index BETWEEN 0 AND 3),
  response_time_ms INTEGER NOT NULL,
  engine_version TEXT NOT NULL,
  answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(member_id, item_id)
);

-- 4. Derived Continuous Construct Vectors (Used for Deterministic Matching)
CREATE TABLE member_construct_vectors (
  member_id TEXT NOT NULL,
  construct_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  confidence REAL NOT NULL CHECK (confidence BETWEEN 0.0 AND 1.0),
  flexibility INTEGER NOT NULL DEFAULT 75 CHECK (flexibility BETWEEN 0 AND 100),
  welcomes_complementarity INTEGER NOT NULL DEFAULT 1,
  answered_item_count INTEGER NOT NULL DEFAULT 0,
  engine_version TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (member_id, construct_id)
);

-- 5. Privacy-Preserving Admin Quality Events (Zero Raw Answers)
CREATE TABLE admin_assessment_quality_events (
  event_id TEXT PRIMARY KEY,
  session_reference TEXT NOT NULL,
  assessment_version TEXT NOT NULL,
  broad_category TEXT NOT NULL,
  raw_answers_included INTEGER NOT NULL DEFAULT 0 CHECK (raw_answers_included = 0),
  review_status TEXT NOT NULL DEFAULT 'pending_optional_member_retry',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Empirical Validation & Calibration Plan (Deliverable 17)

Because all 60 pilot items are newly authored for Kithra, they carry `validationStatus: 'ORIGINAL / UNVALIDATED'` until the following 4-stage calibration protocol is completed on consented adult cohorts (`N >= 300` across English, Tamil, and Hindi):
1. **Cognitive Interviewing (`N = 24–30` across Bengaluru, Chennai, Mumbai, Delhi):** Verify that prompts and options in English, Tamil, and Hindi are interpreted identically without cultural stigma or ceiling effects.
2. **Item Distribution & Internal Consistency (`N >= 300`):** Compute item endorsement frequencies (retiring any item where `> 80%` choose one option), McDonald's omega ($\omega$), and Cronbach's alpha ($\alpha$) per construct layer.
3. **2-to-4 Week Test–Retest Reliability (`N >= 120`):** Verify stability of continuous construct scores ($r \ge 0.70$) and measure how often Stage 2/3 experimental pattern summaries shift.
4. **Dyadic Outcome Calibration:** Collect optional, consented post-conversation feedback (*"Did our Shared Ground and Difference notes feel accurate?"*) to calibrate domain weights transparently across versions.

---

## 3. Privacy, Ethics, DPDP Act 2023 & Indian Cultural Risk Register (Deliverable 18)

| Risk ID | Risk Description | Severity | Mitigation Enforced in Code & Architecture |
|---|---|---|---|
| `R-01` | **5-Question Overclaim Risk:** Assigning fixed personality types after only 5 onboarding answers | High | Enforced in [`evaluateMemberStagedPattern`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L868-L953) (`Test A`): `< 15` answers always returns `assignedPrimaryArchetype: null` and `provisional_early_note`. |
| `R-02` | **False "Lie Detector" Accusation Risk:** Flagging normal contextual variation or fast readers as dishonest | High | Enforced in [`evaluateContextualTriangulation`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L989-L1089) (`Test C`) and [`evaluateResponseQuality`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L1168-L1280) (`Tests D, E, F`). Never accuses or suspends. |
| `R-03` | **Filter Bubble / Hidden Low-Similarity Risk:** Secretly hiding eligible people who differ from the viewer | High | Enforced in [`filterProfilesByFullSimilaritySpectrum`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L681-L790) (`Tests 2–5`): full `0–100` spectrum is open and controllable by the member. |
| `R-04` | **Harmful Complementarity Risk:** Framing boundary violations or coercion as "We Balance Each Other" | Critical | Enforced in [`evaluateWeBalanceEachOther`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L514-L627) (`Test K`): boundary violation flags immediately zero out complementarity. |
| `R-05` | **Cross-Intention Leakage Risk:** Using matrimony/romantic criteria inside Friendship discovery | High | Enforced in [`evaluateMutualEligibility`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L186-L333) (`Test I`): `friendship` is strictly isolated from romantic/matrimony gates. |
| `R-06` | **Staff Voyeurism / Raw Answer Exposure Risk:** Moderators or support staff reading private questionnaire answers | Critical | Enforced in [`authorizeRawAnswerAccess`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L1301-L1324) (`Test L`) and [`AdminViews.tsx`](file:///c:/Users/hp/Desktop/Kithra/src/components/AdminViews.tsx#L959-L967). |
| `R-07` | **DPDP Act 2023 Consent Withdrawal Risk:** Retaining derived vectors or caches after consent withdrawal | Critical | Enforced in [`applyConsentWithdrawalOrDeletion`](file:///c:/Users/hp/Desktop/Kithra/src/domain/psychologyEngine.ts#L1340-L1381) (`Test M`): purges raw answers, derived vectors, archetypes, and pairwise caches. |
| `R-08` | **Covert Sensitive Attribute Inference:** Inferring caste, religion, sexual orientation, or mental health | Critical | Strictly prohibited; zero covert inference or clinical/diagnostic scoring exists anywhere in the engine. |

---

## 4. Founder Decision Register (Deliverable 20)

| Decision ID | Decision Question | Recommended Default Implemented | Founder Action Needed |
|---|---|---|---|
| `FD-01` | Minimum comparable constructs before showing a numerical `0–100` Attribute Similarity Score | `MIN_COMPARABLE_CONSTRUCTS_FOR_SCORE = 2` (returns `insufficient_information` below 2) | Confirm `2` for early preview vs. raising to `4` in production after onboarding |
| `FD-02` | Minimum answered questions before showing a developing experimental pattern summary | `15` answered questions (`Stage 2`); `5–14` answers show only an early provisional note | Approved per Section 5 & 14 guardrails |
| `FD-03` | Default Discovery Similarity Range when opening `/member/discover` | `All People — 0–100` (with 1-click presets for `80–100`, `50–79`, `0–49`, and custom `min/max`) | Approved per Change 2 specification |
| `FD-04` | Multilingual rollout sequence for the 60-item pilot bank | Launch with **English (`en`)**, **Tamil (`ta`)**, and **Hindi (`hi`)** side-by-side switcher | Confirm additional Indian languages for Phase 3 (e.g., Kannada, Malayalam, Telugu) |

