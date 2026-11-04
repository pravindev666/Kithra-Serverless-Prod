# KITHRA — FOUR-SPACE DISCOVERY & COMPATIBILITY REDESIGN BLUEPRINT
**Document ID:** `KITHRA_UX20_FOUR_SPACE_DISCOVERY_REDESIGN.md`  
**Target Surface:** `src/components/MemberViews.tsx` (`DiscoveryView`, `MatchDetailView`, `IntentionSwitcher`), `src/domain/psychologyEngine.ts`  
**Status:** PROPOSED REDESIGN BLUEPRINT — PENDING FOUNDER APPROVAL (A1 / A2 / A3)  

---

## 1. STRATEGIC OBJECTIVE

Kithra fundamentally departs from the swipe-deck paradigm. Instead of endless binary judgements, Kithra presents members with a curated, unhurried discovery experience structured across four distinct human intentions: **Friendship**, **Dating**, **Matrimony**, and **Cofounders**.

This blueprint redesigns the Discovery interface to prioritize **clarity, informed choice, and qualitative comprehension** over gamified numerical scores.

---

## 2. AUDIT OF CURRENT DISCOVERY EXPERIENCE

### Key Issues Identified
1. **Intention Context Blindness (Law of Common Region):**
   - The scoped intention switcher sits at the top of the viewport, but candidate profile cards render against an unbranded, generic background. A user can easily forget which space they are viewing.
2. **Over-Emphasis on Numerical Scores (Visual Hierarchy):**
   - Match cards prominently display a huge percentage (e.g. `92%`), pushing the qualitative reason for connection into small, low-contrast text. This triggers gamified "score-shopping" rather than thoughtful consideration of values.
3. **Filter Clutter (Hick's Law):**
   - The discovery header simultaneously displays: 4 intention buttons, 3 lens tabs, a 0–100 similarity slider, city filters, language chips, text search, and saved profile toggles.
4. **Cofounder Skill Gap Presentation:**
   - In Cofounders, skill complementarity (e.g. Technical Builder paired with Business Growth) was previously rendered identically to personal lifestyle traits, obscuring vital founder attributes like equity expectations and commitment levels.
5. **Pair Suppression Invariant Reassurance:**
   - Members are often anxious that connecting with someone in Cofounders might reveal their Dating profile. The UI currently does not explicitly reassure members of the Cross-Context Privacy Firewall.

---

## 3. REDESIGN SPECIFICATIONS

### A. The Intention Sanctuary Container (Common Region & Color Coding)
Each intention space possesses an unmistakable visual ambiance:
- 🟢 **Friendship:** Warm Sage & Forest Emerald accents (`#2D6A4F`). Tagline: *"Companionship, shared passions, and lively discussions."*
- 🔴 **Dating:** Terracotta & Rosewood accents (`#9D4edd`). Tagline: *"Mutual attraction and emotional resonance at an unhurried pace."*
- 🟣 **Matrimony:** Coromandel Plum & Royal Gold accents (`#5E35B1`). Tagline: *"Lifelong commitment, family rhythms, and shared future vision."*
- 🟡 **Cofounders:** Warm Ochre & Amber accents (`#8F520A`). Tagline: *"Complementary execution skills, shared work ethic, and venture alignment."*

The discovery feed is wrapped in a container with a subtle 2% ambient tint of the active space's hue, eliminating cross-intention ambiguity.

### B. The Three Qualitative Lenses (Replacing Raw Numbers)
Rather than sorting people into a single "best match" ranking, Kithra exposes three authentic relationship lenses:
1. **Similar to Me (Echo):** Shared core values, similar social energies, aligned daily lifestyle rhythms.
2. **Different from Me (Perspective):** Healthy contrasting worldviews, different creative backgrounds, intellectually stimulating divergence.
3. **We Balance Each Other (Complementarity):** Where one member's strength supports another's need (e.g., spontaneous explorer paired with an archival planner; product architect paired with enterprise distribution leader).

### C. Restructured Candidate Profile Cards (Visual Hierarchy)
```
+-------------------------------------------------------------------------+
| [Portrait 4:5]  Meera Ramachandran, 29 · Bengaluru                     |
|                 Architectural Historian · Tamil, English                |
|                                                                         |
| LENS: We Balance Each Other (Complementary Daily Rhythm)                |
| "Your archival research background and her field documentation offer     |
| complementary ways of discovering the city."                           |
|                                                                         |
| KEY SHARED REFLECTIONS:                                                 |
| - High mutual appreciation for quiet weekend mornings                   |
| - Aligned unhurried communication cadence (replies in 1-2 days)         |
|                                                                         |
| [ View Full Profile & Reflections ]            [ Send Thoughtful Note ] |
+-------------------------------------------------------------------------+
```
- **Numerical score** is moved to a discreet tag inside the detail drawer (`"88% construct alignment"`).
- **Primary emphasis** is placed on the *human narrative* explaining why this person appears in the member's feed.

### D. Cofounder-Specific Synergy Matrix
In Cofounder Discovery, candidate cards replace generic biodata with:
1. **Role Complementarity:** e.g., `[Technical Architect] + [Enterprise Sales Leader]`.
2. **Capability Check:** Clearly flags when two founders share identical skill gaps (`"Caution: Both founders identify marketing as a development area"`).
3. **Venture Alignment:** Commitment level (Full-time vs. Nights/Weekends), runway tolerance, and equity split philosophy.

### E. Cross-Context Privacy Firewall Indicator
At the bottom of every candidate profile, a serene privacy shield note appears:
> 🛡️ *Kithra Privacy Firewall Active: Connecting with Meera in Friendship will never expose your Dating, Matrimony, or Cofounder profiles. If you connect, discovery in other spaces will be gently suppressed to preserve unhurried focus.*

---

## 4. BEFORE / AFTER SCREENSHOT MOCKUPS (ASCII / WIREFRAME)

### Candidate Match Card: Visual Hierarchy Comparison

#### BEFORE (Score-Dominant, Gamified Layout)
```
+-------------------------------------------------------------------------+
| [Photo]  MEERA RAMACHANDRAN · 29                                        |
|          BENGALURU · ARCHITECTURAL HISTORIAN                            |
|                                                                         |
|          ================ 92% COMPATIBLE ================               |
|          (Huge prominent percentage dominating visual attention)        |
|                                                                         |
|          Archetype: The Architect of Warmth                             |
|          Lens: Similar to Me                                            |
|          Diet: Vegetarian · Smoking: Never · Drinking: Socially         |
|                                                                         |
|          [ Send Introduction ]                                          |
+-------------------------------------------------------------------------+
```

#### AFTER (Narrative-First, Human Dignity Layout)
```
+-------------------------------------------------------------------------+
| +----------+   Meera Ramachandran, 29                                   |
| |          |   Architectural Historian · Bengaluru                      |
| | 4:5 Crop |   Languages: Tamil, English, Kannada                       |
| | Portrait |                                                            |
| |          |   ✦ We Balance Each Other                                  |
| +----------+   "Your preference for reflective writing balances her    |
|                fieldwork documentation; both prioritize unhurried time."|
|                                                                         |
|   DAILY RHYTHM ALIGNMENT                                                |
|   • Weekend Cadence: Quiet mornings, cultural walks                     |
|   • Conversational Pace: Unhurried (replies within 1–2 days)            |
|                                                                         |
|   [ View Full Reflections ]                   [ Send Thoughtful Note ]  |
+-------------------------------------------------------------------------+
```

---

## 5. IMPACT, RISK AND VERIFICATION

- **Primary Impact:** Elevates the dignity of discovery; prevents algorithmic swiping habits; fosters genuine curiosity based on narrative compatibility.
- **Risk Analysis:** Members seeking rapid, volume-based matches may find the unhurried layout slower than traditional dating platforms. This is an intentional product design choice.
- **Approval Tier:** **A1 (Card Layout) & A2 (Discovery Filters & Lens Switching)**.
- **Verification Plan:**
  1. Unit tests verifying all 4 spaces strictly isolate candidates based on enabled intentions.
  2. Verification that pair suppression rules execute cleanly upon sending or accepting notes.
  3. Responsive testing of candidate card rendering on 320px, 375px, 768px, and 1440px displays.

