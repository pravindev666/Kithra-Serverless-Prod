# KITHRA — FOUNDER ASSUMPTION REGISTER
**Framework:** *The Mom Test* (Rob Fitzpatrick)  
**Status:** Audit of Core Hypotheses, Uncertainties, Risks & Lean Validation  
**Evidence Status:** `CUSTOMER EVIDENCE: NOT YET COLLECTED`

---

## 1. EXECUTIVE OVERVIEW

Every startup begins as a collection of unproven assumptions in the founder's head. The danger is treating these assumptions as proven facts because the software code is written and passing tests.

This register catalogs the **8 Fundamental Assumptions** upon which Kithra is built, ranks their business risk, documents the current lack of evidence, and defines the exact, cheapest way to validate or disprove them.

---

## 2. THE 8 MASTER FOUNDER ASSUMPTIONS

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  ASSUMPTION SEVERITY MATRIX                                                            │
│                                                                                        │
│  FATAL IF WRONG:     [A] Core Problem Exists    [C] Psychology > Looks/Status          │
│                      [D] Willingness to Answer  [G] Willingness to Pay                 │
│                                                                                        │
│  HIGH RISK:          [B] Existing Apps Disappoint  [E] Trust & Privacy Invariance       │
│                      [F] Meaningful Interactions                                       │
│                                                                                        │
│  OPERATIONAL WASTE:  [H] Need for Enterprise CRM/BI at Day 0                           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### ASSUMPTION A: The Core Problem Exists
> *"Indian adults regularly struggle to find companions who understand their personality, values, communication style, and emotional boundaries, and this causes them acute personal pain."*

* **Founder Belief:** People are deeply lonely and misunderstood. They cannot find true partners through arranged marriage biodatas or superficial swipe apps.
* **Existing Evidence:** `NOT YET COLLECTED` (Anecdotal cultural commentary and founder intuition only).
* **Contrary Evidence / Skeptical View:** Many people complain about dating apps, yet continue to use them because physical attraction, immediate proximity, and social status are actually what drive their mating choices in practice.
* **What Could Disprove It:** In open interviews, people might reveal that their biggest problem isn't "finding someone who matches my circadian rhythm," but rather "finding someone who has a stable career, whose family approves, and who lives within 5 kilometers of me."
* **Business Impact:** **FATAL (P0)**. If the problem is merely an annoying pet peeve rather than an urgent pain, nobody will change their habits or pay.
* **Lean Validation Method:** 10 customer interviews asking: *"Tell me about the last time you tried to meet someone. What was the hardest part? What did you do to solve that?"*

---

### ASSUMPTION B: Existing Solutions Genuinely Disappoint Them
> *"Users are actively dissatisfied with Tinder, Bumble, Hinge, Shaadi.com, and matrimonial matchmakers, and are seeking an alternative approach."*

* **Founder Belief:** Users hate swiping on photos, hate caste-based matrimonial profiles, and feel burned out by current platforms.
* **Existing Evidence:** `NOT YET COLLECTED`.
* **Contrary Evidence / Skeptical View:** While users complain about Tinder or Shaadi.com, Bumble and Shaadi generate millions of dollars in India. Users often return to them because **network effects** matter more than algorithm quality. A 100% scientifically perfect algorithm with 50 users loses to a shallow app with 5,000,000 users.
* **What Could Disprove It:** Users might say: *"I find Bumble fine—I just swipe when I'm bored, and I've met two decent people last year."*
* **Business Impact:** **HIGH (P1)**. If dissatisfaction is mild, users will not overcome the friction of joining an app with a tiny user base.
* **Lean Validation Method:** Ask former dating/matrimony users: *"When was the last time you deleted an app? Why did you delete it? What did you use the next week?"*

---

### ASSUMPTION C: Psychology-First Matching Is Genuinely Valued Above Status/Appearance
> *"When choosing a long-term partner, Indian adults will prioritize psychological compatibility, conflict resolution style, and emotional pacing over appearance, height, income, and caste."*

* **Founder Belief:** People want to be understood for who they are inside, not their salary or appearance.
* **Existing Evidence:** `NOT YET COLLECTED`.
* **Contrary Evidence / Skeptical View:** **Stated preferences vs. Revealed preferences**. In surveys, everyone says: *"Personality and kindness matter most to me!"* (Stated preference). But in actual behavior on dating apps, 80%+ of swipes are dictated by photos, height, and college/job pedigree (Revealed preference). In Indian matrimony, family acceptance and financial security remain massive determinants.
* **What Could Disprove It:** In a blind test where users see a 95% psychological match with no photo versus an attractive photo with an unknown match, users overwhelmingly click the photo.
* **Business Impact:** **FATAL (P0)**. If physical attraction and social signaling are prerequisite filters before psychology can even be considered, hiding photos or de-emphasizing appearance will kill adoption.
* **Lean Validation Method:** Paper prototype / blind test offering users 3 curated profiles: one with high psychological alignment and no photo, one with attractive photo and standard bio, and observing what they actually choose to message.

---

### ASSUMPTION D: People Will Answer the Questionnaire & Return for More
> *"Users will happily complete an initial 5-question starter battery, and then voluntarily return to answer 15, 30, or 60 scenario questions to deepen their profile."*

* **Founder Belief:** Because the questions are interesting scenarios ("How do you react when someone breaks an heirloom?"), users will enjoy answering them and treat it like self-discovery.
* **Existing Evidence:** `NOT YET COLLECTED`.
* **Contrary Evidence / Skeptical View:** Consumer apps suffer catastrophic drop-offs on every additional question asked during onboarding. In consumer mobile apps, every extra step loses 10%–25% of users. Even 5 questions can cause a 40% bounce rate if the user doesn't immediately see a payoff.
* **What Could Disprove It:** Real user onboarding logs showing 60%+ abandonment between Question 2 and Question 5.
* **Business Impact:** **FATAL (P0)**. If users abandon the assessment, the matching engine has no vector data to compute similarity.
* **Lean Validation Method:** Unmoderated usability test with 10 real users on mobile devices: measure exact time to complete, skips, and drop-off rate on Questions 1–5.

---

### ASSUMPTION E: Members Will Trust Kithra With Their Private Psychological Boundaries
> *"Users are willing to candidly disclose their conflict reactions, financial habits, family boundary issues, and intimacy pacing to a digital platform."*

* **Founder Belief:** Because Kithra enforces Section 27 DPDP compliance and zero raw-answer access, users will feel safe and open up.
* **Existing Evidence:** `NOT YET COLLECTED`.
* **Contrary Evidence / Skeptical View:** Most users do not read privacy policies or understand cryptographic SHA-256 JWT invariants. If a question feels intrusive or socially embarrassing, users will either lie (social desirability bias) to look like a "good catch," or skip it entirely.
* **What Could Disprove It:** Users choosing option B repeatedly because it sounds the most "noble" or "mature," corrupting the psychological variance of the data.
* **Business Impact:** **HIGH (P1)**. If answers are performative rather than authentic, the matching scores will be completely bogus.
* **Lean Validation Method:** Interview users after taking the 5 questions: *"Did any question make you feel uncomfortable or make you wonder who would see your answer?"*

---

### ASSUMPTION F: Algorithmic Matching Leads to Mutually Welcomed Interactions
> *"When Kithra recommends a match based on psychological similarity or balance, it will lead to a warm, meaningful conversation rather than awkward silence or ghosting."*

* **Founder Belief:** High psychological alignment eliminates conversational friction.
* **Existing Evidence:** `NOT YET COLLECTED`.
* **Contrary Evidence / Skeptical View:** The hardest part of dating and friendship apps is not matching—it is **initiating and sustaining a conversation**. Even two psychologically compatible introverts will often stare at a blank chat box and send *"Hey"* before ghosting after 3 messages.
* **What Could Disprove It:** In a trial with 10 matched pairs, fewer than 2 pairs exchange more than 5 messages.
* **Business Impact:** **HIGH (P1)**. If matches don't lead to actual connection, members churn immediately.
* **Lean Validation Method:** Manually introduce 5 pairs of pre-screened compatible individuals via email/WhatsApp with an explicit conversation prompt and observe whether they converse for 48 hours.

---

### ASSUMPTION G: Members Will Pay ₹1,299/Month for This Solution
> *"Indian singles will pay ₹1,299/month ($15 USD) or ₹2,999/quarter for an unhurried, psychology-first matching service."*

* **Founder Belief:** Because quality relationships are life-changing, people will gladly pay for a thoughtful service that doesn't waste their time.
* **Existing Evidence:** `NOT YET COLLECTED` (₹0 collected to date).
* **Contrary Evidence / Skeptical View:** In India, consumer willingness to pay for software subscriptions is notoriously low outside of video streaming (Netflix/Hotstar) and utility food delivery (Swiggy One). On dating apps, 95%+ of Indian users are entirely free-tier. Men pay primarily to **unblur photos** or **boost profile visibility**; women almost never pay for dating apps in India. Matrimonial sites charge families, not the singles themselves. ₹1,299/month is on the high end even for Tier-1 Bengaluru/Mumbai professionals.
* **What Could Disprove It:** When given the option to upgrade, 0% of pilot participants click or authorize payment.
* **Business Impact:** **FATAL (P0)**. If unit economics fail and users refuse to pay, the platform cannot survive as an independent business.
* **Lean Validation Method:** The Mom Test interview question: *"What was the last software, app, or dating/matrimony service you actually paid for with your own credit card or UPI during the last 12 months? How much was it, and why did you decide to pay?"*

---

### ASSUMPTION H: Business Operations Require the Proposed Enterprise CRM & BI Dashboard
> *"At Day 0, the company requires an 8-role operational staff hierarchy, Power BI-style cohort analytics, and an interactive Leaflet geographic growth map."*

* **Founder Belief:** We must be architected for enterprise-scale operations, investor due diligence, and country-wide management from day one.
* **Existing Evidence:** `REFUTED BY LEAN STARTUP REALITY`.
* **Contrary Evidence / Skeptical View:** When an early-stage startup has between 0 and 100 users, the founder knows every single user by first name. You do not need a Leaflet cluster map to tell you that you have 4 users in Indiranagar, Bengaluru. Building complex BI dashboards before you have paying customers is classic **premature optimization** and productive procrastination.
* **What Could Disprove It:** The founder realizes they haven't opened the Admin Map or Cohort Retention table for real operational decisions in 3 weeks.
* **Business Impact:** **OPERATIONAL DRAIN (P2)**. High engineering overhead spent building staff consoles instead of talking to real human customers.
* **Lean Validation Method:** Replace complex dashboards with a simple Google Sheet or D1 SQL query until the platform reaches 500 active users.

