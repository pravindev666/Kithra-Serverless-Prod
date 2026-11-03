# KITHRA — PHASE 11: 16 SYNTHETIC ADULT PERSONA FIXTURES
**Comprehensive Data Dictionary & Psychological Calibration Profiles**
*Repository Workspace:* `C:\Users\hp\Desktop\Kithra`
*Version:* `Phase 11.0.0-PROD-STAGING`
*Test Suite Source:* [`src/domain/phase11FourSpaceAndPairLedger.test.ts`](file:///C:/Users/hp/Desktop/Kithra/src/domain/phase11FourSpaceAndPairLedger.test.ts)

---

## 1. Persona Roster Overview

To rigorously validate multi-space matching, cross-context suppression, and fail-closed edge cases, Kithra defines 16 calibrated adult synthetic personas. Each persona contains concrete psychological construct vectors, explicit lifestyle non-negotiables, intention permissions, and cofounder skill matrices.

| Persona ID | Name | Age | City | Gender | Enabled Spaces | Adulthood Verified | Discovery Consent | Active Role / Scenario Assignment |
| :--- | :--- | :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **`p01-priya`** | Priya Sharma | 28 | Bengaluru | Female | All 4 Spaces | **YES** (True) | **YES** | Master Pair 1 (`friendship` connected with P02) |
| **`p02-ananya`** | Ananya Iyer | 29 | Bengaluru | Female | All 4 Spaces | **YES** (True) | **YES** | Master Pair 1 (`friendship` connected with P01) |
| **`p03-kabir`** | Kabir Mehta | 31 | Mumbai | Male | All 4 Spaces | **YES** (True) | **YES** | Master Pair 2 (`dating` connected with P04) |
| **`p04-meera`** | Meera Sen | 30 | Mumbai | Female | All 4 Spaces | **YES** (True) | **YES** | Master Pair 2 (`dating` connected with P03) |
| **`p05-vikram`** | Vikram Patel | 34 | Ahmedabad | Male | Matrimony | **YES** (True) | **YES** | Master Pair 3 (`matrimony` connected with P06) |
| **`p06-sunita`** | Sunita Joshi | 32 | Ahmedabad | Female | Matrimony | **YES** (True) | **YES** | Master Pair 3 (`matrimony` connected with P05) |
| **`p07-arjun`** | Arjun Rao | 27 | Bengaluru | Male | All 4 Spaces | **YES** (True) | **YES** | Master Pair 4 (`cofounder` connected with P08; Tech CTO) |
| **`p08-zara`** | Zara Khan | 28 | Bengaluru | Female | All 4 Spaces | **YES** (True) | **YES** | Master Pair 4 (`cofounder` connected with P07; GTM CEO) |
| **`p09-rohan`** | Rohan Das | 26 | Delhi | Male | All 4 Spaces | **YES** (True) | **YES** | Active Introductions Initiator (Intro to P10; Pure Tech) |
| **`p10-ishaan`** | Ishaan Varma | 27 | Delhi | Male | All 4 Spaces | **YES** (True) | **YES** | Active Introductions Receiver (Intro from P09; Pure Tech) |
| **`p11-kavita`** | Kavita Nair | 33 | Pune | Female | Matrimony | **YES** (True) | **YES** | Matrimony Pool (High planfulness, family-first) |
| **`p12-aditya`** | Aditya Reddy | 35 | Hyderabad | Male | Matrimony | **YES** (True) | **YES** | Matrimony Pool (Complementary planfulness, prudent) |
| **`p13-divya`** | Divya Kapoor | 25 | Bengaluru | Female | All 4 Spaces | **YES** (True) | **YES** | General Pool Candidate (High openness, creative) |
| **`p14-tanvi`** | Tanvi Bose | 26 | Kolkata | Female | All 4 Spaces | **YES** (True) | **YES** | General Pool Candidate (High warmth, balanced) |
| **`p15-aryan`** | Aryan Malhotra | 17 | Delhi | Male | All 4 Spaces | **NO (FALSE)** | **YES** | Negative Security Target: Unverified Adulthood (P0) |
| **`p16-rahul`** | Rahul Verma | 30 | Mumbai | Male | All 4 Spaces | **YES** (True) | **NO (FALSE)** | Negative Security Target: Paused Discovery Consent (P0) |

---

## 2. Granular Persona Profiles & Calibrated Vectors

### Persona 1: Priya Sharma (`p01-priya`)
- **Demographics:** Age 28, Bengaluru, Female.
- **Psychological Constructs:**
  - `C1_openness`: 82 / 100 ($N=14$, confidence 0.88). High curiosity, love for arts, books, cultural events.
  - `C2_planfulness`: 68 / 100 ($N=12$, confidence 0.85). Organized, values structure and punctual agreements.
  - `C3_social_energy`: 78 / 100 ($N=15$, confidence 0.90). High social battery, thrives in collaborative dinners.
  - `C4_warmth`: 85 / 100 ($N=14$, confidence 0.89). Empathetic, active listener, highly supportive.
- **Lifestyle & Gates:** Vegetarian, non-smoker, occasional social drinker.
- **Active Connections:** Connected with $P_{02}$ (`p02-ananya`) in **`friendship`**.

### Persona 2: Ananya Iyer (`p02-ananya`)
- **Demographics:** Age 29, Bengaluru, Female.
- **Psychological Constructs:**
  - `C1_openness`: 80 / 100 ($N=14$, confidence 0.86).
  - `C2_planfulness`: 72 / 100 ($N=12$, confidence 0.87).
  - `C3_social_energy`: 75 / 100 ($N=15$, confidence 0.88).
  - `C4_warmth`: 88 / 100 ($N=14$, confidence 0.91).
- **Alignment Note with P01:** High mutual similarity ($87.5 / 100$) across social energy and warmth. Both bonded over literature and hiking.
- **Active Connections:** Connected with $P_{01}$ (`p01-priya`) in **`friendship`**.

### Persona 3: Kabir Mehta (`p03-kabir`)
- **Demographics:** Age 31, Mumbai, Male.
- **Psychological Constructs:**
  - `C1_openness`: 74 / 100 ($N=12$, confidence 0.82).
  - `C2_planfulness`: 60 / 100 ($N=12$, confidence 0.80).
  - `C3_social_energy`: 70 / 100 ($N=14$, confidence 0.85).
  - `C4_warmth`: 80 / 100 ($N=12$, confidence 0.84).
- **Dating Gates:** Seeks exclusive long-term relationship, values direct communication and clear boundaries.
- **Active Connections:** Connected with $P_{04}$ (`p04-meera`) in **`dating`**.

### Persona 4: Meera Sen (`p04-meera`)
- **Demographics:** Age 30, Mumbai, Female.
- **Psychological Constructs:**
  - `C1_openness`: 78 / 100 ($N=12$, confidence 0.85).
  - `C2_planfulness`: 64 / 100 ($N=12$, confidence 0.82).
  - `C3_social_energy`: 68 / 100 ($N=14$, confidence 0.83).
  - `C4_warmth`: 82 / 100 ($N=12$, confidence 0.86).
- **Alignment Note with P03:** Mutual dating purpose (Long-Term Committed). Dynamic similarity $84.0 / 100$.
- **Active Connections:** Connected with $P_{03}$ (`p03-kabir`) in **`dating`**.

### Persona 5: Vikram Patel (`p05-vikram`)
- **Demographics:** Age 34, Ahmedabad, Male.
- **Enabled Spaces:** `matrimony` only.
- **Psychological Constructs:**
  - `C1_openness`: 55 / 100 ($N=10$, confidence 0.78). Pragmatic, traditional, values stability.
  - `C2_planfulness`: 92 / 100 ($N=16$, confidence 0.94). Extremely methodical, structured financial plans.
  - `C3_social_energy`: 50 / 100 ($N=12$, confidence 0.80). Moderate social circle, values family gatherings.
  - `C4_warmth`: 75 / 100 ($N=12$, confidence 0.82). Reliable, protective, grounded.
- **Matrimony Gates:** Marriage timeline 6–12 months, vegetarian, non-smoker, values joint family harmony.
- **Active Connections:** Connected with $P_{06}$ (`p06-sunita`) in **`matrimony`**.

### Persona 6: Sunita Joshi (`p06-sunita`)
- **Demographics:** Age 32, Ahmedabad, Female.
- **Enabled Spaces:** `matrimony` only.
- **Psychological Constructs:**
  - `C1_openness`: 58 / 100 ($N=10$, confidence 0.79).
  - `C2_planfulness`: 88 / 100 ($N=16$, confidence 0.92).
  - `C3_social_energy`: 52 / 100 ($N=12$, confidence 0.81).
  - `C4_warmth`: 78 / 100 ($N=12$, confidence 0.84).
- **Alignment Note with P05:** High shared planfulness ($90.0 / 100$). Identical marital timeline and lifestyle non-negotiables.
- **Active Connections:** Connected with $P_{05}$ (`p05-vikram`) in **`matrimony`**.

### Persona 7: Arjun Rao (`p07-arjun`)
- **Demographics:** Age 27, Bengaluru, Male.
- **Role in Cofounders:** Technical Co-Founder / System Architect / CTO.
- **Psychological Constructs:**
  - `C1_openness`: 85 / 100. Innovative, explores emerging distributed systems.
  - `C2_planfulness`: 76 / 100. Methodical engineering practices, CI/CD, test coverage.
  - `C3_social_energy`: 45 / 100. Introverted engineer, prefers deep-focus blocks over sales calls.
  - `C4_warmth`: 70 / 100. Direct, honest code review culture.
- **Cofounder Skill Matrix:**
  - *Skills Offered:* Frontend (Expert), Backend (Expert), System Architecture (Expert), DevOps (Proficient).
  - *Skills Needed:* Go-To-Market / Sales (Seeker), Pitching / Investor Relations (Seeker), Operations (Seeker).
  - *Commitment & Equity:* Full-Time (100%), 50/50 Equal Equity Philosophy.
- **Active Connections:** Connected with $P_{08}$ (`p08-zara`) in **`cofounder`**.

### Persona 8: Zara Khan (`p08-zara`)
- **Demographics:** Age 28, Bengaluru, Female.
- **Role in Cofounders:** Commercial Co-Founder / CEO / Go-To-Market.
- **Psychological Constructs:**
  - `C1_openness`: 80 / 100. Market-oriented, rapid experimenter.
  - `C2_planfulness`: 74 / 100. Milestone-driven, OKR-focused.
  - `C3_social_energy`: 90 / 100. High social battery, pitches customers and angels tirelessly.
  - `C4_warmth`: 82 / 100. Charismatic, empathetic leader.
- **Cofounder Skill Matrix:**
  - *Skills Offered:* Go-To-Market (Expert), Enterprise Sales (Expert), Fundraising (Expert), Product Marketing (Expert).
  - *Skills Needed:* Backend Engineering (Seeker), System Architecture (Seeker), Cloud Ops (Seeker).
  - *Commitment & Equity:* Full-Time (100%), 50/50 Equal Equity Philosophy.
- **Alignment Note with P07:** Perfect complementary synergy ($94.5 / 100$). Zero skill overlap, complete mutual gap coverage.
- **Active Connections:** Connected with $P_{07}$ (`p07-arjun`) in **`cofounder`**.

### Personas 9 & 10: Rohan Das (`p09-rohan`) & Ishaan Varma (`p10-ishaan`)
- **Demographics:** Rohan (26, Delhi), Ishaan (27, Delhi).
- **Cofounder Capability Gap Case:**
  - Both offer: Full-Stack Engineering, Mobile Apps.
  - Both need: Enterprise Sales, Angel Fundraising, Marketing.
  - *Engine Verdict:* Correctly flagged as **Capability Gap** ($32.0 / 100$ synergy). Missing commercial leadership.
- **Dating Space Case:** Active pending introduction ($P_{09} \rightarrow P_{10}$) testing state machine transitions and withdrawal.

### Personas 11 & 12: Kavita Nair (`p11-kavita`) & Aditya Reddy (`p12-aditya`)
- **Demographics:** Kavita (33, Pune, Matrimony), Aditya (35, Hyderabad, Matrimony).
- **Purpose:** Serve as unattached, eligible Matrimony candidates demonstrating dynamic similarity filters and discovery in the absence of active connections.

### Personas 13 & 14: Divya Kapoor (`p13-divya`) & Tanvi Bose (`p14-tanvi`)
- **Demographics:** Divya (25, Bengaluru), Tanvi (26, Kolkata).
- **Purpose:** Serve as broad multi-space candidates demonstrating full-spectrum similarity filtering ($0-100$) across the three discovery lenses.

### Persona 15: Aryan Malhotra (`p15-aryan`) — Security Target P0
- **Demographics:** Age 17, Delhi, Male.
- **Verification Status:** `isAdultVerified: false` (Explicitly unverified minor).
- **Expected Engine Behavior:** Instant fail-closed rejection across 100% of discovery queries and introduction dispatches.

### Persona 16: Rahul Verma (`p16-rahul`) — Security Target P0
- **Demographics:** Age 30, Mumbai, Male.
- **Verification Status:** `isAdultVerified: true`, but `discoveryConsentGiven: false`.
- **Expected Engine Behavior:** Excluded from discovery for all viewing members; attempts by other members to send introductions fail closed.

---

## 3. Fixture Validation Script & Integrity Signature
All 16 fixtures are instantiated deterministically in [`src/domain/phase11FourSpaceAndPairLedger.test.ts`](file:///C:/Users/hp/Desktop/Kithra/src/domain/phase11FourSpaceAndPairLedger.test.ts). Every test execution re-verifies schema conformance, type safety, and mathematical invariants with zero mock drift.

