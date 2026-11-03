# KITHRA — FEATURE PRIORITIZATION: KEEP, IMPROVE, DEFER, REMOVE
**Framework:** Lean Product Prioritization & Anti-Bloat Audit  
**Goal:** Stop building features users have not asked for; focus 100% on core connection validation.  
**Audit Date:** November 2, 2026

---

## 1. THE 5-CATEGORY ACTION CLASSIFICATION

Every capability in the repository is evaluated through a strict Mom Test filter:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  DECISION FRAMEWORK                                                                    │
│                                                                                        │
│  [KEEP]            ── Essential for core loop, safety, or legal compliance.            │
│  [IMPROVE]         ── Critical, but current UX has high friction or wrong vocabulary.  │
│  [VALIDATE FIRST]  ── Core assumption that must be tested before further coding.       │
│  [DEFER]           ── Good idea for scale, but completely unnecessary for 50 users.   │
│  [REMOVE]          ── Distraction, theater, or premature over-engineering.             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. FEATURE-BY-FEATURE VERDICT TABLE

| Subsystem / Feature | Verdict | Why / Mom Test Justification | Supporting Evidence |
| :--- | :--- | :--- | :--- |
| **5-Question Starter Battery** | **KEEP** | Core onboarding mechanic. 5 questions is the absolute maximum a new mobile user will tolerate. | Industry norm; lower drop-off than 20 items. |
| **Section 27 DPDP Data Erasure** | **KEEP** | Legally mandatory under Indian Digital Personal Data Protection Act 2023. Non-negotiable. | Statutory compliance requirement. |
| **Hard Non-Negotiables (Children/Monogamy)**| **KEEP** | Prevents devastating life mismatches early. True human value. | Common sense relationship dealbreakers. |
| **Safety Reporting & Blocking** | **KEEP** | Essential trust & safety hygiene for female users in India. | Critical for community protection. |
| **Cryptographic Staff Auth & MFA** | **KEEP** | Protects participant data from unauthorized breaches. | P0 security release gate. |
| **Onboarding Language & Copy** | **IMPROVE** | Current language is too academic (*"Construct gap"*, *"Circadian reply pacing"*). Needs plain ELI5 rewrite. | Cognitive overload in non-technical users. |
| **Discovery Lens Presentation** | **IMPROVE** | Users do not intuitively grasp *"We Balance Each Other"*. Needs clear visual metaphors and concrete examples. | Unprompted confusion in preliminary review. |
| **Mobile Web Viewport & Touch** | **IMPROVE** | Interface has desktop-heavy tables. In India, 95%+ of dating traffic is mobile touchscreens. | Indian consumer browsing telemetry. |
| **3 Independent Intentions (Friendship/Dating/Matrimony)** | **VALIDATE FIRST** | Do Indian singles want friendship and matrimony in the same app? Or do they perceive it as an identity crisis? | Untested assumption. May need brand separation. |
| **Self-Understanding Insights Dashboard** | **VALIDATE FIRST** | Do members actually care about reading paragraphs about their traits, or do they only care about who they can meet? | Unproven desirability. |
| **"Different from Me" Matching Lens** | **VALIDATE FIRST** | Do users actually like divergent partners in practice, or do they immediately reject them for being incompatible? | High psychological risk; assortative mating preference. |
| **Questions 16 to 60 (Pilot Bank)** | **DEFER** | Valuable for deeper profiling, but completely unneeded for a user's first 48 hours on the app. | Test Starter Battery first. |
| **Indian Payment Gateway Integration** | **DEFER** | Do not write Razorpay/Cashfree webhook code until real users explicitly ask to pay for introductions. | Premature monetization. Zero sales to date. |
| **Community Circles Group Feature** | **DEFER** | Managing group dynamics and unmoderated circles requires a large community. A ghost town circle kills trust. | Network effect prerequisite missing. |
| **Questions 61 to 125 (Expanded Bank)** | **REMOVE** | Zero justification for 125 questions. Massive bloat. Waste of psychometric translation effort. | Nobody will answer 125 items. |
| **Interactive Leaflet Density Map** | **REMOVE (from active roadmap)** | Viewing geographic clusters on a map is useless when you have 25 pilot users in Bengaluru. Complete theater. | Premature operational complexity. |
| **Power BI-Style Cohort Retention Matrix** | **REMOVE (from active roadmap)** | When you have 15 pilot users, you can write their names on a whiteboard. You do not need a cohort retention matrix. | Over-engineering distraction. |
| **8-Role Staff Operations Hierarchy** | **FREEZE** | Retain code for security, but stop spending engineering time on internal staff roles. The founder is the only staff member today. | Day-0 resource misallocation. |

---

## 3. WHAT TO STOP BUILDING IMMEDIATELY

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  🛑 THE "STOP BUILDING" LIST                                                           │
│                                                                                        │
│  1. STOP writing new psychometric questions (125 is already 65 too many).              │
│  2. STOP building admin dashboards, geographic maps, and executive BI charts.          │
│  3. STOP tweaking the similarity algorithm decimal places (92.4% vs 91.8% is meaningless).│
│  4. STOP designing complex recurring subscription tiers before collecting ₹1.         │
│  5. START talking to real Indian adults who are actively struggling to meet someone.  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

