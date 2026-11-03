# KITHRA — CUSTOMER EVIDENCE LEDGER
**Framework:** Empirical Customer Discovery & Evidence Classification  
**Status Date:** November 2, 2026  
**Master Notice:** `CUSTOMER EVIDENCE: NOT YET COLLECTED`

---

## 1. EVIDENCE CLASSIFICATION TAXONOMY

In this ledger, statements of belief are strictly divided into seven tiers of empirical validity. We do not blend software logic with customer proof:

1. **[OBS] Observed Behavior:** Real actions instrumented from non-affiliated user telemetry.
2. **[EXP] Documented Customer Experience:** Real past events described by consenting interviewees.
3. **[COM] Actual Commitment:** Voluntary exchange of money, reputation, or time.
4. **[OPN] Opinion or Compliment:** Polite, non-binding verbal enthusiasm (Zero weight).
5. **[FND] Founder Hypothesis:** Untested personal intuition of the founder.
6. **[AIH] AI-Generated Hypothesis:** Synthetic persona logic or simulated test fixtures.
7. **[MIS] Missing Evidence:** Necessary customer data that has not yet been investigated.

---

## 2. THE MASTER HYPOTHESIS & EVIDENCE LEDGER

### HYP-01: Core Pain of Psychological Misalignment
* **Description:** Indian singles experience acute frustration because existing platforms fail to capture personality, boundaries, and life pacing.
* **Target Segment:** Urban singles aged 24–35 seeking serious dating or matrimony.
* **Code Implementation:** 12 psychological domains, 125 candidate questions, and 3 discovery lenses (`psychologyEngine.ts`).
* **Existing Customer Evidence:** `[MIS] Missing Evidence`. No customer interviews have been conducted.
* **Contrary Evidence:** Millions of users actively register on Tinder, Bumble, and Shaadi.com and continue swiping despite vocal complaints.
* **Unknown Information:** Does the average user consider psychological differences a "dealbreaker" before meeting, or something they only discover after weeks of dating?
* **How It Could Be Disproven:** If 80%+ of interviewed users say their primary reason for rejecting a match was physical appearance, location distance, or education/profession.
* **Proposed Experiment:** 15 Mom Test interviews asking: *"Walk me through the last match you decided not to pursue. Why did you stop?"*
* **Research Cost & Effort:** ₹7,500 in incentives; 2 weeks of founder time.
* **Decision Influenced:** Whether to keep psychology as the primary filter, or make it a secondary layer on top of standard lifestyle criteria.
* **Confidence Level:** **VERY LOW (2/10)** — Supported only by `[FND] Founder Hypothesis`.

---

### HYP-02: Tolerance for 5-Item Starter Battery During Onboarding
* **Description:** New users will complete 5 scenario questions before viewing any matches without bouncing from the app.
* **Target Segment:** First-time mobile web / app registrants.
* **Code Implementation:** `OnboardingView` in `PublicViews.tsx` enforcing Questions 1–5 before allowing access to `/member/discover`.
* **Existing Customer Evidence:** `[MIS] Missing Evidence`. Only simulated in automated test suite (`phase9RealCloudE2E.test.ts`).
* **Contrary Evidence:** Standard mobile app analytics show that mandatory multi-step questions during onboarding increase signup drop-off by 25%–50%.
* **Unknown Information:** What is the median time to complete Questions 1–5? At which specific question do real users exit?
* **How It Could Be Disproven:** Observing $\ge 40\%$ of uncoached test users closing the browser tab before reaching Question 5.
* **Proposed Experiment:** Unmoderated screen-recording usability test with 10 real users on mobile devices.
* **Research Cost & Effort:** ₹3,000 in testing credits; 3 days.
* **Decision Influenced:** Whether to make Questions 1–5 mandatory at signup, or allow users to preview discovery first and answer questions progressively.
* **Confidence Level:** **LOW (3/10)** — Algorithm is clean, but human completion tolerance is unmeasured.

---

### HYP-03: Demand for "Different from Me" and "We Balance Each Other" Lenses
* **Description:** Users actively desire matches who have complementary or contrasting traits, rather than just identical copies of themselves.
* **Target Segment:** Singles tired of superficial "mirror-image" matching.
* **Code Implementation:** `evaluateWeBalanceEachOther` in `psychologyEngine.ts` filtering for divergent traits that provide balance.
* **Existing Customer Evidence:** `[MIS] Missing Evidence`.
* **Contrary Evidence:** Human mating research consistently demonstrates that **assortative mating** (similarity in habits, politics, intellect, and lifestyle) is what people instinctively choose in 85%+ of unions.
* **Unknown Information:** When users see someone labeled "Different from Me," do they find it intriguing, or do they immediately perceive it as a red flag?
* **How It Could Be Disproven:** If users in usability testing click "Similar to Me" 90%+ of the time and ignore "Different from Me."
* **Proposed Experiment:** Comparative A/B card presentation test: Show users 3 profile cards with different lens labels and track click-through rates.
* **Research Cost & Effort:** Prototype testing with 20 consenting pilot participants; 1 week.
* **Decision Influenced:** Whether to feature "Balance" prominently on the home screen or keep it as an exploratory secondary filter.
* **Confidence Level:** **VERY LOW (2/10)** — High theoretical beauty, zero behavioral validation.

---

### HYP-04: Willingness to Pay ₹1,299/Month ($15 USD) for Unhurried Discovery
* **Description:** Indian singles will pay ₹1,299/month for a service that restricts swiping, emphasizes deep matching, and protects privacy.
* **Target Segment:** Affluent working professionals in Tier-1 metros (Bengaluru, Mumbai, Gurugram).
* **Code Implementation:** `INDIAN_PRICING_PLANS` in `founderCommandCenterService.ts` and `PricingView` in `PublicViews.tsx`.
* **Existing Customer Evidence:** `[MIS] Missing Evidence`. ₹0 collected.
* **Contrary Evidence:** Dating app monetization in India is driven by impulsive male purchases for immediate visibility (Boosts) or unblurring photos, not for "unhurried contemplation." Furthermore, women in India pay virtually nothing for dating apps due to favorable gender ratios.
* **Unknown Information:** Has any target user ever paid more than ₹500/month for an online dating product? Who actually pulls out the card—the single individual or their parents?
* **How It Could Be Disproven:** Offering 50 active pilot users a 50% discounted launch price (₹649) and achieving 0 paid conversions.
* **Proposed Experiment:** A smoke-test landing page or manual concierge payment test during the pilot.
* **Research Cost & Effort:** ₹0; executed during Stage A pilot.
* **Decision Influenced:** Radical pricing model redesign (e.g. freemium with pay-per-introduction vs. monthly subscription vs. concierge fee).
* **Confidence Level:** **NEAR ZERO (1/10)** — Supported entirely by `[FND] Founder Hypothesis`.

---

### HYP-05: Absolute Privacy (Zero Raw Answers) as a Competitive Moat
* **Description:** Users will choose Kithra over competitors specifically because staff and administrators cannot view their individual quiz answers.
* **Target Segment:** Privacy-conscious Indian professionals, women concerned about safety, high-profile singles.
* **Code Implementation:** `authorizeRawAnswerAccess` in `psychologyEngine.ts` enforcing HTTP 403 access denial.
* **Existing Customer Evidence:** `[MIS] Missing Evidence`.
* **Contrary Evidence:** The general public frequently trades privacy for convenience (e.g., using Truecaller, Instagram location tags, TikTok). Most users do not understand or verify backend cryptographic claims.
* **Unknown Information:** Does privacy protection actively drive user signups, or is it merely an expected hygiene factor that doesn't influence platform choice?
* **How It Could Be Disproven:** Interviewing users and finding that privacy was not mentioned among their top 5 criteria when choosing a dating/matrimony app.
* **Proposed Experiment:** Mom Test interviews asking: *"What information do you deliberately hide or avoid putting on your dating/matrimony profile? Why?"*
* **Research Cost & Effort:** Covered in Segment 1 & 2 interview guides.
* **Decision Influenced:** How much marketing space should be devoted to privacy vs. connection outcomes.
* **Confidence Level:** **MODERATE (4/10)** — Privacy is legally required by DPDP Act 2023, but its power as a customer acquisition engine is unproven.

---

## 3. EVIDENCE LEDGER SUMMARY TABLE

| Hypothesis ID | Category | Current Evidence Status | Real Evidence Count | Fatal Risk If Wrong? | Validation Action Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HYP-01** (Core Problem) | Problem Validation | `[MIS] Missing Evidence` | 0 real interviews | **YES** | 15 Mom Test discovery interviews |
| **HYP-02** (5-Question Tolerance) | Product Usability | `[MIS] Missing Evidence` | 0 real screen tests | **YES** | 10 unmoderated mobile usability sessions |
| **HYP-03** (Balance / Nuance Lens) | Value Proposition | `[MIS] Missing Evidence` | 0 user choices | NO (Can adjust) | A/B profile selection experiment |
| **HYP-04** (₹1,299/mo Pricing) | Business Viability | `[MIS] Missing Evidence` | ₹0 collected | **YES** | Historical spending research + pilot test |
| **HYP-05** (Privacy Moat) | Competitive Position | `[MIS] Missing Evidence` | 0 user quotes | NO (Hygiene) | "What do you withhold?" interview probe |
| **HYP-06** (Intention Tri-Split) | Architecture | `[MIS] Missing Evidence` | 0 real user accounts| NO (Can decouple) | Test whether users actually switch modes |
| **HYP-07** (Conversation Quality) | Retention Engine | `[MIS] Missing Evidence` | 0 real chats sent | **YES** | 5 manual concierge introductions |
| **HYP-08** (Need for Enterprise CRM)| Operational Overhead| `[REFUTED] Premature` | 0 real customers | NO (Waste only) | Freeze CRM; focus 100% on users |

