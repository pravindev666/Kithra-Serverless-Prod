# 02 — Founder Intentions, Controlling Decisions & Conflict Register

## 1. Confirmed Founder Intentions (Primary Source of Truth)

From the founder's explicit product direction and the controlling decision registers (`DECISIONS_AND_CONFLICTS.md`, `SCOPE_CORRECTIONS_AND_README.md`), the following principles are **confirmed and non-negotiable**:

1. **Consumer-Grade Effortless UX ("Simple on the Surface, Sophisticated Underneath"):**
   - Kithra must feel as immediately intuitive to an ordinary person as **Facebook, Instagram, WhatsApp, Swiggy, or Zomato**—requiring zero instruction manuals, zero psychometric jargon, and zero engineering dashboard clutter.
   - New users must understand what Kithra does within **5 seconds** and complete their first meaningful action within **60 seconds**.
2. **Approved Visual Identity — Coromandel Indigo & Ochre:**
   - **Light theme:** Background `#F8F4EC`, Surface `#FFFFFF`, Primary Indigo `#1F2F46`, Ochre Accent `#C9962E`, Sand `#E7D7B7`.
   - **Dark theme:** Background `#0E1722`, Surface `#142233`, Elevated `#1A2B3F`, Text `#F3EFE7`, Ochre Accent `#C9962E`.
   - **Typography:** `Cormorant Garamond` for selected major editorial headings only; `DM Sans` for all application UI, body text, navigation, buttons, forms, and tables.
3. **One Account, Three Independently Controlled Intentions:**
   - **Friendship**, **Dating**, and **Matrimony** coexist under one login, but each intention has its own **activation toggle, pause toggle, bio/prompts, photo visibility switches, and discovery pool**.
   - Being active in Friendship **never** exposes a user's profile or photos in Dating or Matrimony unless the user explicitly enables and consents to those modes (`D-09`, `KTH-0115`).
4. **Deterministic Psychological Compatibility (Zero AI Twins / Zero LLM Runtime):**
   - Matching is 100% deterministic, reproducible, and auditable (`D-01`).
   - **No AI twins, no LLM chatbots pretending to be a user, and no neural brain-replication claims.**
   - Compatibility is expressed through three complementary lenses—**Echo** (shared rhythm & values), **Counterpoint** (healthy, stimulating contrast on flexible traits when core boundaries align), and **Mosaic Fit** (complementary strengths such as Planner + Spontaneous Explorer)—plus **Personality Pattern Groups** that help users browse "their kind of people" naturally.
   - Percentages/bands represent **measured questionnaire agreement across shared answered items**, never a guarantee of attraction or marriage success (`D-08`).
5. **Understandable Personality Pattern Groups (Inspired by the Old Concept, Upgraded for Rigor):**
   - Users should be organized into warm, non-stigmatizing, understandable **Personality Pattern Groups / Archetype Constellations** (backed by dimensional scores across the 12 core themes) so they can explore people with similar patterns, complementary patterns, or shared life rhythms—without rigid boxes or superior/inferior labels.
6. **Unified Membership ("One Door for One Account"):**
   - Rejects the "big-cat / small-cat" error of charging separate subscriptions for Friendship, Dating, and Matrimony (`D-07`, `PRICING_BIG_CAT_SMALL_CAT_DECISION.md`).
   - Uses a unified **Free / Plus / Connect** membership across all enabled intentions, while keeping **all safety controls (block, mute, report, appeals, privacy boundaries) and post-consent 1:1 messaging 100% free forever**.
7. **Dual Deployment Readiness (Cloudflare + Portable Server):**
   - Frontend and domain logic remain portable across **Cloudflare** (Workers Static Assets + Hono + D1 + R2 + Durable Objects + Queues) and **Self-Hosted Server** (Docker Compose + Node/Hono + PostgreSQL + Redis + S3/R2 + Caddy).

---

## 2. Source-of-Truth Conflict Register

Where the inspected archives, specifications, and prototypes disagree, we record each conflict explicitly rather than silently picking one:

| Conflict ID | Topic | Source A (Older / Kit v3) | Source B (Hermes Rework / Old Prototype) | Source C (Latest Founder Instruction) | Controlling Resolution |
|---|---|---|---|---|---|
| **CONF-01** | **Visual Theme & Fonts** | Kit v3 `UX_UI_DESIGN_AUTHORITY.md`: Nocturnal Indigo `#14182C` + Iris `#4B5DDB`, Manrope + Plus Jakarta Sans. | `Kiths` D2: Ink & Clay `#FBF8F3` + Teal `#1F5E5B`, Fraunces + Inter. Old Concept: Alabaster + Sage `#0D9488`, Outfit + Newsreader. | **Founder Prompt:** Approved **Coromandel Indigo & Ochre** (`#F8F4EC` / `#1F2F46` / `#C9962E` / `#0E1722`) + **Cormorant Garamond & DM Sans**. | **Founder Instruction Governs.** Keep Coromandel Indigo & Ochre + Cormorant Garamond & DM Sans. |
| **CONF-02** | **Personality Types vs. Pure Continuous Dimensions** | `DETERMINISTIC_BEHAVIOURAL_ENGINE.md`: Continuous construct scores ($0\text{--}100$) + 8 neutral family clusters (`Origin`, `Currents`, `Mosaic`, `Horizon`, `Rhythm`, `Compass`, `Bridge`, `Orbit`); warns against rigid MBTI-style boxes. | `Kithra-main-OLD-CONCEPT.zip`: Grouped matches into browsable Compatibility Tier Folders (`MatchesView.tsx`) and gave users named attachment/conflict profiles (`CompatibilityReportView.tsx`). | **Founder Prompt:** *"We group the people to personality types... organize people into understandable personality-pattern groups."* | **Hybrid Dimensional-Archetype Model:** Compute continuous dimensional scores underneath, and surface **8 human-friendly Personality Pattern Groups (Constellations)** + **3 Matching Lenses (Echo, Counterpoint, Mosaic Fit)** on the surface so users get intuitive group browsing without pseudoscientific rigidity. |
| **CONF-03** | **Discovery Card Density & Score Percentages** | `Kithra-3rd`: Shows Echo %, Counterpoint %, Mosaic %, coverage ratio (`12/12`), model version (`v1.2`), and caveat on every discovery card. | `Kithra-main-OLD-CONCEPT`: Shows 1 clean alignment badge (`90% Alignment` or `Complementary`), 1 tagline quote, and 3 value pills; deep analysis opens in a modal. | **Founder Prompt:** *"Current user experience sucks and not intuitive, too overwhelming for a simple mind... comparison details might be accessible after opening a person's profile."* | **Progressive Disclosure:** Discovery cards show Photo, Name/Age/City, Personality Group badge, 1 human compatibility badge (e.g., `Strong Echo · Shared Rhythm`), and 1 sentence of *why you click*. Full percentages, coverage, and model version live inside the **Compatibility Sheet** when opened. |
| **CONF-04** | **Subscription Tiers & Prices** | Kit v3 `FIN_RD`: 4 tiers — Free, Plus (`₹149`), Connect (`₹299`), and separate **Matrimony Intent (`₹399/mo`)**. | `BILLING_RD_Unified_Pricing.md`: Unified 3 tiers — Free (`₹0`), Plus (`₹149/mo`), Connect (`₹249/mo`) across all modes + optional real-cost add-ons. | **Founder Prompt:** *"Our current preferred direction is Free / Plus / Connect across all three intentions. Do not finalize prices without examining financial research."* | **Unified 3-Tier Structure (Free / Plus / Connect)** across all modes; exact Connect price (`₹249/mo` vs `₹299/mo`) flagged in `16_FOUNDER_DECISION_REGISTER.md` for founder sign-off. |
| **CONF-05** | **AI Digital Twins vs. Deterministic Scenarios** | Legacy `18_AIR_Digital_Twins_Ethics_and_Architecture.md`: LLM agents simulating first-date chats. | `SCOPE_CORRECTIONS_AND_README.md` & `D-01`: AI Twins completely banned (`₹0` AI cost); replaced by deterministic **If-Then Everyday Scenario Cards**. | **Founder Prompt:** *"There is no AI twin, LLM personality model or generative AI matching engine in the planned product runtime."* | **Zero AI Twins.** Keep and simplify the **Everyday Scenario Cards** (e.g., *"How we handle a last-minute weekend change"*) as a fun, 1-tap interactive comparison inside a match profile. |
| **CONF-06** | **Question Bank Size & Presentation** | Kit v3 `04_QRD`: 12 themes × 2 sets × 100 items = `2,400` placeholder items; 50–70% coverage threshold. | `Kithra-main-OLD-CONCEPT`: "Today's Mission: Complete 7 Diagnostic Questions (Est. 3 mins)" + 8 visual domain cards + 1-question-at-a-time auto-advancing card. | **Founder Prompt:** *"Make these manageable without abandoning the intended depth... short resumable sessions."* | **Micro-Sessions ("Daily 5–7 Question Bite")** on the surface, backed by the 12-theme × 100-item versioned bank underneath. Never show "2,400 questions remaining" to a user! |
| **CONF-07** | **Fake Verification & E2EE Badges** | `Kithra-main-OLD-CONCEPT`: Showed `"Signal E2E Chat active"` and gold verified shields on mock profiles. | `DECISIONS_AND_CONFLICTS.md` (`D-16`, `C7`): Strictly forbids claiming Signal E2EE or verified identity until real cryptographic E2EE / KYC provider is live. | **Founder Prompt:** *"Do not invent testimonials, fake user numbers, real-world success rates or claims of scientific certainty."* | **Truthful Trust Signals Only:** Show real per-mode privacy controls and photo visibility boundaries; never claim Signal E2EE or government ID verification in the frontend shell unless backed by a live provider. |

---

## 3. Confirmed Requirements vs. Historical Ideas vs. Open Questions

### A. Confirmed Requirements (Must Ship in Full-Product Architecture)
- Single account with 3 isolated relationship intentions (**Friendship, Dating, Matrimony**).
- Per-intention discoverability toggle, instant pause, separate bio/prompts, and per-photo intention visibility switches, plus **No-Photo Mode** (`KTH-0153` for privacy-first users like Persona `P5 Fatima`).
- Progressive, bite-sized questionnaire sessions (`5–7 questions` per micro-session, keyboard `1–4` + touch auto-advance, skip/prefer-not-to-answer, save & resume) feeding 12 core psychometric themes.
- Understandable **Personality Pattern Groups** + **Echo / Counterpoint / Mosaic Fit** matching lenses with transparent "Why you align" and "What to keep in mind" explanations.
- Mutual opt-in introduction requests (optional short note) before opening 1:1 messaging.
- Mode-scoped **Circles & Communities** (small hobby/book/city walks and topic groups, online & offline events).
- **Matrimony Autonomy Guardrail:** Adult-led account where family never gets login access to private chats or raw answers, paired with an optional, 1-click revocable **Read-Only Family Summary Card** (`HomeDashboardView.tsx` in `Kithra-3rd`).
- Self-reflection space (**My Patterns & Private Reflection Journal** from `Kithra-main-OLD-CONCEPT`).
- Unified **Free / Plus / Connect** membership with 1-click cancellation and free safety/privacy rights.
- Role-aware **Admin & Moderator Console** (Overview, Safety Reports, Photo Moderation, Users, Circles, Question Bank & Scoring Steward, Billing/Refunds, Privacy/DPDP Requests, Staff RBAC, Audit Log).

### B. Historical Ideas (Superseded — Do Not Reintroduce)
- LLM "Digital Personality Twins" that chat on behalf of users (`18_AIR_Digital_Twins`).
- Separate ₹399/month Matrimony-only subscription (`FIN_RD` v1).
- Unverified "Signal E2E Encrypted" and "Gottman Clinical Blueprint" marketing claims (`Kithra-main-OLD-CONCEPT`).
- Enterprise SaaS terminology in member UI (`Workspace OS`, `Mission Control`, `OS Command Center`, `12-Theme Registry (2,400 Slots)`, `0ms Mode Consent`).

### C. Open Founder Decisions (Detailed in `16_FOUNDER_DECISION_REGISTER.md`)
1. Approval of the **8 Kithra Personality Pattern Group names** (and whether to enable optional Indian regional aliases like *Sangam / Setu / Lehar* in localized views).
2. Final **Connect Tier Monthly Price** (`₹249/mo` per Hermes unified model vs. `₹299/mo` per original financial workbook) and international PPP bands.
3. Selection of the **3-Step Progressive Onboarding Flow** (Recommended Option B: Intention -> 5-Question Starter Taste -> Immediate People & Pattern Preview).
4. Approval of the **5-Item Primary Member Navigation** (`Home`, `Discover`, `Messages`, `Circles`, `My Patterns & Profile`) vs. 9+ sidebar links.
5. Launch locales (`English + Hindi + Tamil` at launch vs. English-first staged rollout).

