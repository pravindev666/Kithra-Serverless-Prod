# KITHRA INNOVATION IN MEANINGFUL CONNECTION — PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Document Version:** 2026.11-PRD-1.0  
**Product Mission:** *"Not who society thinks you should love. Who truly understands you."*  
**Scope:** Six Signature Connection Features Bridging Psychometric Science to Everyday Human Usability

---

## 1. Product Vision & Principles

Mainstream dating and matrimony platforms reduce human complexity to photos, bio keywords, caste, salary, and endless superficial swipes. Kithra’s mission is the opposite: to help adults discover companions through **meaningful psychological self-understanding and mutual transparency**.

### Core Product Principles:
1. **Intention Independence:** Friendship, Dating, and Matrimony are strictly decoupled. A member looking for a hiking friend is never evaluated using matrimonial children criteria.
2. **Zero Superficial Sorting:** No filtering by caste, height, skin tone, or net worth.
3. **No Red Flags / No Pathologizing:** Mismatches are framed as natural temperamental differences, never moral failings or toxic traits.
4. **Member Sovereignty & DPDP Compliance:** Every member owns their answers, can inspect what was derived, and can delete their psychological footprint instantly.

---

## 2. Feature 1: My Connection Compass

### 2.1 Overview & Value Proposition
A private, member-controlled self-reflection dashboard where users explore their own relational rhythms, emotional regulation styles, communication preferences, and core life values.

### 2.2 Key Functional Capabilities
- **14 Construct Visualizer:** Renders intuitive polar / card breakdowns across the 14 core constructs without clinical jargon or pseudoscientific typecasting.
- **Evidence-to-Insight Transparency:** Clicking any construct reveals:
  - Exact scenarios answered that contributed to the reflection.
  - Transparent confidence criteria (Provisional exploration $\to$ Developing pattern $\to$ Multi-context triangulated).
  - Explicit measurement limitations and missing contextual questions.
- **Strict Non-Clinical Invariant:** Displays the mandatory disclaimer:
  > *"Kithra self-understanding summaries are experimental, non-clinical reflections derived strictly from your self-reported scenario responses. They do not constitute psychiatric diagnoses or moral character judgments."*
- **DPDP Section 12 One-Click Erasure:** A prominent button allowing the member to delete all raw answers and derived trait vectors instantly.

---

## 3. Feature 2: Mutual Values & Boundaries Gate

### 3.1 Overview & Value Proposition
Bilateral structural clarity before emotional investment. Prevents heartbreaks caused by discovering months into dating that one person wants to live with parents or that childbearing intentions are incompatible.

### 3.2 Key Functional Capabilities
- **Pre-Discovery Structural Filtering:** Automatically verifies mutual alignment across 3 core gates:
  1. Relationship Structure (Monogamy vs Consensual Non-Monogamy).
  2. Future Children Goals (Childfree vs Desires Children vs Open).
  3. Substance & Smoking Boundaries (Strict Non-Smoking vs Socially Accepted).
- **Graceful Divergence Handling:** If two members are incompatible on a hard gate, they are simply not displayed in each other's romantic/matrimonial discovery feeds. No rejection notifications are sent.
- **Intention Isolation:** Structural gates are strictly disabled for the Friendship discovery feed.

---

## 4. Feature 3: Shared Ground Conversations

### 4.1 Overview & Value Proposition
Eliminates awkward "Hey", "Hi", "What's up?" opening lines by generating thoughtful, psychology-grounded conversation starters derived from shared scenario answers.

### 4.2 Key Functional Capabilities
- **Deterministic Alignment Extraction:** The engine compares mutually answered scenarios where both members selected identical or harmonious options.
- **Conversation Prompt Cards:** When a match is initiated, the chat window displays 3 curated conversation anchors:
  - *"You both cherish unhurried morning routines before speaking to the world. What does your ideal Sunday first hour look like?"*
  - *"You both value giving each other a 20-minute breather when disagreements become intense. How did you discover that taking space works best for you?"*
- **Privacy Preservation Invariant:** The card never reveals the other person's exact raw answer or survey option ID; it surfaces only the shared theme.

---

## 5. Feature 4: Understand Our Differences

### 5.1 Overview & Value Proposition
In human relationships, incompatibility rarely comes from differences themselves, but from **misinterpreting differences as hostility or lack of caring**. This feature acts as an empathetic translator between contrasting temperaments.

### 5.2 Key Functional Capabilities
- **The "Different from Me" & "We Balance Each Other" Lenses:** Accessible directly on member profiles.
- **Empathetic Contrast Translations:**
  - *Scenario:* Member A prefers real-time voice calls; Member B prefers deliberate written text.
  - *Kithra Translation:* *"Member A values the warm emotional presence of voice tone; Member B processes thoughts deeply in writing. Agreeing on a quick voice note can bridge both worlds comfortably."*
  - *Scenario:* Member A is a problem-focused planner; Member B seeks emotional validation first.
  - *Kithra Translation:* *"In unexpected travel hiccups, Member A instinctively looks up flight schedules, while Member B needs a brief moment of mutual reassurance first. Giving Member B a reassuring hand squeeze allows Member A's logistical brilliance to shine without feeling dismissed."*
- **Zero Toxic Labeling:** Strictly forbids words like "controlling", "needy", "detached", "narcissistic", or "avoidant".

---

## 6. Feature 5: Connection Learning Loop

### 6.1 Overview & Value Proposition
A privacy-preserving post-encounter feedback loop that improves future recommendation quality based on real human comfort rather than app retention tricks.

### 6.2 Key Functional Capabilities
- **Unhurried Check-in:** 48 hours after a virtual coffee or in-person meetup, both members receive a private 3-question prompt:
  1. *"Did your conversation feel emotionally respectful and safe?"* (Yes / Unsure / No)
  2. *"Was the communication pacing comfortable?"* (Too fast / Just right / Too slow)
  3. *"Would you welcome another conversation?"* (Yes / Open to friendship / Not a match)
- **k-Anonymity Aggregation:** Feedback is never shown to the other person and is never tied to a visible public score. It updates internal Bayesian compatibility weights only when aggregated across at least $k = 5$ distinct encounters.
- **Safety Tripping:** An answer of "No" to emotional safety prompts a supportive, private follow-up offering the option to block, report, or connect with Kithra human trust & safety stewards.

---

## 7. Feature 6: Safe & Respectful Discovery

### 7.1 Overview & Value Proposition
A dignified, protective environment designed specifically to insulate vulnerable adults, women, and privacy-conscious professionals from harassment, unwanted advances, and data scraping.

### 7.2 Key Functional Capabilities
- **Two-Way Consent Reveal:** Profile photos and deeper reflection notes are unlocked incrementally as both parties mutually confirm comfort.
- **Intention-Specific Photo Privacy:** Members can designate specific photos as visible only to Friendship or only to Matrimony connections.
- **Zero-Tolerance Reporting & Server-Enforced Blocking:**
  - Blocking is instant, permanent, and mutual.
  - Blocked profiles disappear immediately from search, messaging, and cached states.
  - Reporting reasons include: Harassment, Inappropriate Language, Impersonation, Caste/Status Coercion.
- **HTTP 403 Raw Answer Privacy Invariant:** Raw questionnaire answers are encrypted at rest and in transit. Neither the matched companion nor customer support staff can view individual survey choices (enforced via database row-level security and server RBAC).

---

## 8. Release Roadmap & Success Metrics

| Milestone | Target Deliverable | Primary KPI |
|---|---|---|
| **Phase 9.1** | My Connection Compass & Mutual Values Gates | 100% of pilot members review self-insights before discovery |
| **Phase 9.2** | Shared Ground Conversations & Understand Differences | First-message response rate $\ge 65\%$ (vs industry $18\%$) |
| **Phase 9.3** | Connection Learning Loop & Safe Discovery | Safety report rate $< 0.5\%$; Reciprocal second meetup $\ge 50\%$ |

---
*End of KCA Innovation in Meaningful Connection PRD (Canonical Document).*

