# MATCHING-RD — Deterministic Questionnaire, Scoring, Complementarity & Simulation

## Non-negotiable distinction
This engine compares stated, versioned questionnaire responses according to explicit mathematical/logic rules. It is **not** an AI twin, a human brain replica, an accurate predictor of specific future behavior, a clinical diagnostic tool, or a scientific guarantee of marriage success. It must not infer and publish concealed sexual orientation/religion/health or other intimate characteristics. Inputs to sensitive filters should be purpose-specific and voluntary, with default private.

## Question bank
12 proposed themes, each with A/B sets of 100 **placeholder** item IDs until ethically reviewed instruments and writing are approved: communication, values & priorities, emotional regulation, social rhythms, boundaries & privacy, conflict & repair, trust & reliability, life plans, interests & learning, routines & lifestyle, community & collaboration, compatibility preferences. Each item: stable ID, canonical theme, edition, locale, reverse-scoring flag, evidence/consent classification, estimated time, active interval, scoring dimension map, validation history, content review date and retirement migration. Bank publish lifecycle DRAFT → editorial review → science/legal review → approved → published/immutable; older results remain pinned to past versions. Item order randomized per user-session using server-produced seeded permutation; can retake through new session. "Never the same questions" across everyone is neither guaranteed nor desirable for comparability; avoid promising uncheatable assessments. Server detects impossible timing and inconsistent responses **without diagnosing deception**.

## Required testable scoring process
1. Validate adult status, account, mode consent, published item-bank version and session token.
2. Reject duplicated/out-of-set answers, enforce per-item explicit skip, save atomically and idempotently.
3. Normalize approved answer types with dimension-specific keyed scoring; support reverse-keyed items (only after reviews).
4. Aggregate by theme/dimension with fixed weights from immutable `scoring_version`. Null/missing remains missing, never treated as neutral.
5. Compute coverage = weight of mutually answered comparable items / total applicable weight. If below threshold (policy configurable), show `Insufficient information`; do not invent a score.
6. Similarity (Echo): for each comparable dimension d, `s_d = 1 - abs(a_d - b_d) / dimension_range` (clamped 0–1). Weighted score = 100 × Σ(w_d × s_d) / Σ(w_d). Round only at display; store method/version.
7. Counterpoint: use explicit approved difference lens `100 × Σ(w_d × (1 - s_d)) / Σ(w_d)`; not a preference rank or quality judgement, requires mutual opt-in and respectful copy.
8. Mosaic Fit: complementarity is a distinct versioned **rule table** e.g. member A prefers planning and member B prefers spontaneity *and both permit that difference*. Award when rule predicates and **both** preference constraints hold; do not assume all opposites attract. Return matched rule identifiers and contraindications.
9. Eligibility gates run before scoring/ranking: reciprocal mode consent, user preference boundaries, block/report restrictions, geography/age if applicable, profile discoverability, minimum assessment coverage; no cross-mode leak.
10. Display breakdown, coverage, model version, key aligned dimensions, gaps/uncertainties, plain-language interpretation, options to retake/withdraw; never show confidential raw answers by default.

## Hypothetical deterministic "behavioral simulation"
Simulations are rule-based *if-then scenario explorers*: e.g. hypothetical scheduling disagreement uses publicly disclosed response preferences and shows **possible** communication friction, not what an actual person will do. Scenario templates are reviewed, deterministic for given versions/inputs, and transparent about assumptions and what the model cannot know. User controls whether any scenario summary is shown to matched partner. No synthetic agents conversing, generated psychological replicas or LLM inference costs.

## Fairness & sensitivity
Avoid caste, religion, health, sexual orientation inference via proxy questions. Preserve opt-in where certain mode preferences are legally permissible, and prohibit discriminatory ranking not justified by user choice. Compare outcome by region/language/gender only with privacy and sufficient sample protection; optimize explainability and detect scoring biases. No "score of a person's worth" labels. Independent behavioral science review recommended before psychometric accuracy claims.

## Versioning / reproducibility
Each score record stores `assessment_version`, `scoring_version`, mode, subject pair, timestamp, comparable-dimensional hash, rule matches, coverage and explainability payload reference. If rules change, old results remain auditable; rescore asynchronously with a logged migration reason. Deterministic equality across Cloudflare D1 and PostgreSQL is mandatory: identical fixtures, rounding, Unicode, null treatment, tie-break sorting.

## Acceptance fixtures
- identical input and versions → identical complete result in Cloudflare and Node runtime; fuzz 1000 generated profiles.
- swapping A and B → Echo symmetric; complementarity may be directed only where explicit.
- no common answers → no score (not 0%).
- explicit mode pause/block/consent withdrawal removes discovery in both runtimes, including cached pages and notifications.
- rules and evidence version changes documented; explainability is reproducible.
- a 100 displayed means agreement on **measured comparable dimensions**, NOT 100% real-life compatibility.
