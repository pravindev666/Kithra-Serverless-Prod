# KITHRA — FOUNDER APPROVAL GATE & ACTIONABLE CHECKLIST
**Document ID:** `KITHRA_UX20_FOUNDER_APPROVAL_CHECKLIST.md`  
**Status:** AWAITING FOUNDER SIGN-OFF — ZERO APPLICATION CODE HAS BEEN MODIFIED  
**Governing Rule:** No blanket approval. Each change item must be approved, rejected, or deferred individually.  

---

## 1. APPROVAL TIER DEFINITIONS

```
+---------------------------------------------------------------------------------------------------------+
|                                        FOUNDER APPROVAL TIERS                                           |
+------+-----------------------------+---------------------------------------------------+----------------+
| Tier | Description                 | Scope of Permitted Modifications                  | Risk Level     |
+------+-----------------------------+---------------------------------------------------+----------------+
| A0   | Read-Only Audit (Current)   | Research, inspection, documentation, test runs.   | Zero Risk      |
| A1   | Presentation Changes        | Copy, typography, spacing, colors, visual tokens. | Low Risk       |
| A2   | Member Workflow Changes     | Step flows, form chunking, filters, chat handles. | Medium Risk    |
| A3   | Security & Logic Changes    | Adulthood checks, pair ledger, D1 remote APIs.    | High Risk      |
| A4   | Staging Infrastructure      | Cloudflare migrations, synthetic test fixtures.   | High Risk      |
| A5   | Production Release          | Live deployment, domain updates, billing toggles. | Critical Risk  |
+------+-----------------------------+---------------------------------------------------+----------------+
```

---

## 2. ACTIONABLE FOUNDER APPROVAL REGISTER

Please check the appropriate box for each proposed change:
`[ ] APPROVE` | `[ ] REJECT` | `[ ] DEFER`

---

### BUNDLE 1: PUBLIC LANDING & BRAND POLISH (TIERS A1 / A2)

- [ ] **[UX-001] Streamline Hero Action Hierarchy**  
  *Consolidate competing hero buttons into a single 48px Primary CTA: `[ Begin Your Journey → ]` plus subtle `Explore how Kithra works ↓` link.*  
  Tier: **A1 (Presentation)** | Priority: **P1** | Effort: **Small**

- [ ] **[UX-002] Remove Premature Member Route Links from Landing Steps**  
  *Replace direct links to `/member/assessments` and `/member/photos` on public step cards with educational preview popovers or `/join` routing.*  
  Tier: **A1/A2 (Navigation)** | Priority: **P0** | Effort: **Small**

- [ ] **[UX-003] Harmonize Four-Space Landing Copy & Clarify Pilot Status**  
  *Update outdated "three intentions" copy to include Cofounders across all landing sections; declare complimentary pilot phase transparently.*  
  Tier: **A1 (Copy & Clarity)** | Priority: **P1** | Effort: **Small**

---

### BUNDLE 2: ONBOARDING & PSYCHOLOGICAL HONESTY (TIERS A1 / A2 / A3)

- [ ] **[UX-004] Lock Forward Step-Jumping in Onboarding (Adulthood Gate)**  
  *Make progress dots non-clickable visual indicators; enforce strict fail-closed 18+ adulthood certification before advancing past Step 2.*  
  Tier: **A2/A3 (Security Invariant)** | Priority: **P0** | Effort: **Medium**

- [ ] **[UX-005] Group Location & Language Selection into Structured Cards**  
  *Chunk the dense cloud of 20+ language pills into "Top 5 Spoken" and a searchable accordion; group birth year and adult check together.*  
  Tier: **A1 (Form Spacing)** | Priority: **P2** | Effort: **Small**

- [ ] **[UX-006] Enforce Psychological Non-Overclaim Invariant on Completion**  
  *Label the 5-question completion screen as a "Provisional Self-Reflection" rather than a clinical diagnosis, preserving ethical integrity.*  
  Tier: **A2/A3 (Psychological Honesty)** | Priority: **P0** | Effort: **Small**

---

### BUNDLE 3: FOUR-SPACE DISCOVERY & COMPATIBILITY (TIERS A1 / A2)

- [ ] **[UX-007] Intention Sanctuary Ambient Container**  
  *Wrap the active discovery feed in a container with a subtle 2% ambient tint of the active space's hue (Emerald, Rose, Plum, Amber).*  
  Tier: **A1 (Presentation)** | Priority: **P1** | Effort: **Medium**

- [ ] **[UX-008] Narrative-First Candidate Cards (Subordinate Numerical Scores)**  
  *Promote qualitative alignment narratives ("We Balance Each Other: Complementary daily rhythm") to primary visual prominence over raw numbers.*  
  Tier: **A1/A2 (Visual Hierarchy)** | Priority: **P2** | Effort: **Medium**

---

### BUNDLE 4: CONVERSATIONS & COMMUNITY CIRCLES (TIERS A2 / A3)

- [ ] **[UX-009] Install "Part Ways Politely" Handle (Solve Nuclear Block Trap)**  
  *Add a dignified exit button in chat that transitions `relationship_state = 'disconnected'` and restores discovery for both members without safety penalty.*  
  Tier: **A2/A3 (Pair Ledger & Safety)** | Priority: **P0** | Effort: **Medium**

- [ ] **[UX-010] Contextual Breadcrumbs on Received Introduction Notes**  
  *Render a persistent context chip in introductions and chat headers showing which question and intention space initiated the connection.*  
  Tier: **A2 (Recognition)** | Priority: **P1** | Effort: **Small**

- [ ] **[UX-011] Dedicated Gathering Salon Room with Live D1 Leave API**  
  *Render the private Gathering Salon modal with venue address, host notes, and an explicit `[ Release My Seat / Cancel RSVP ]` button calling D1.*  
  Tier: **A2/A3 (Circles Architecture)** | Priority: **P0** | Effort: **Medium**

- [ ] **[UX-012] Host "Archive / Cancel Gathering" Handle**  
  *Empower circle hosts to cancel/archive a salon with an explanatory note to attendees if bad weather or illness occurs.*  
  Tier: **A2/A3 (Circles Governance)** | Priority: **P1** | Effort: **Medium**

---

### BUNDLE 5: ADMIN DASHBOARD & FOUNDER COMMAND (TIER A1)

- [ ] **[UX-013] Founder Overview "4 Macro Pulses" in Simple View**  
  *Replace the 12-card grid in Simple View with 4 clean executive pulses (Community, Safety Alert, Infrastructure, Pilot Health); preserve Advanced View.*  
  Tier: **A1 (Executive Clarity)** | Priority: **P1** | Effort: **Medium**

- [ ] **[UX-014] Responsive Member CRM Card-Row Hybrid on Tablet**  
  *Automatically render stacked member cards with large touch targets on viewports $< 1024px$ to eliminate horizontal table scrolling.*  
  Tier: **A1 (Responsive A11y)** | Priority: **P1** | Effort: **Small**

---

### BUNDLE 6: GLOBAL NETWORK TRUTHFULNESS (TIER A2 / A3)

- [ ] **[UX-015] Standardized 3-Tier Feedback Contract Across All Remote Calls**  
  *Guarantee that every user action displays immediate pending feedback, confirms only upon HTTP 200 from D1, and provides actionable retry on error.*  
  Tier: **A2/A3 (Network Integrity)** | Priority: **P0** | Effort: **Large**

---

## 3. FOUNDER SIGN-OFF RECORD

Founder instructions / approved items:

```
Signed by: _____________________________________
Date:      _____________________________________
Notes:     _____________________________________
```

