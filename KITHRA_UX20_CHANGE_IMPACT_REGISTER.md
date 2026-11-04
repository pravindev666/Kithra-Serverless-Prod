# KITHRA — UX CHANGE IMPACT & RISK REGISTER
**Document ID:** `KITHRA_UX20_CHANGE_IMPACT_REGISTER.md`  
**Purpose:** Comprehensive Risk, Dependency & Effort Ledger for All Proposed UX Changes  
**Status:** PROPOSED CHANGE REGISTER — REQUIRING FOUNDER APPROVAL PER CHANGE ID  

---

## MASTER REGISTER TABLE

```
+--------+--------------------+--------------------------+----------+--------+--------+------+---------------------+
| ID     | Area               | Core UX Law              | Priority | Effort | Tier   | Risk | Verification        |
+--------+--------------------+--------------------------+----------+--------+--------+------+---------------------+
| UX-001 | Public Landing     | Hick's Law & Fitts's Law | P1       | Small  | A1     | Low  | Playwright E2E      |
| UX-002 | Public Landing     | Jakob's Law              | P0       | Small  | A1/A2  | Low  | Public Route Audit  |
| UX-003 | Public Landing     | Aesthetic-Usability      | P1       | Small  | A1     | Low  | Pricing Snapshot    |
| UX-004 | Onboarding         | Postel's / Adulthood Sec | P0       | Medium | A2/A3  | Med  | Security Fail-Close |
| UX-005 | Onboarding         | Miller's & Proximity     | P2       | Small  | A1     | Low  | A11y Form Checks    |
| UX-006 | Psychology Assess. | Non-Overclaim Invariant  | P0       | Small  | A2/A3  | Low  | Test Suite Invariant|
| UX-007 | Discovery Feed     | Common Region & Hierarchy| P1       | Medium | A1     | Low  | Contrast & Heatmap  |
| UX-008 | Discovery Feed     | Hick's & Progressive     | P2       | Medium | A2     | Med  | Filter Telemetry    |
| UX-009 | Conversations      | Peak-End & Safety        | P0       | Medium | A2/A3  | Med  | D1 Pair Ledger Test |
| UX-010 | Conversations      | Recognition over Recall  | P1       | Small  | A2     | Low  | Chat Header Parity  |
| UX-011 | Community Circles  | Feedback Loops & Exits   | P0       | Medium | A2/A3  | Med  | Live D1 Leave Call  |
| UX-012 | Community Circles  | Feedback Loops           | P1       | Medium | A2/A3  | Low  | Host Cancel Audit   |
| UX-013 | Admin Overview     | Miller's Law (4 Pulses)  | P1       | Medium | A1     | Low  | Staff Usability Test|
| UX-014 | Admin CRM          | Fitts's & Responsive     | P1       | Small  | A1     | Low  | Tablet Viewport Test|
| UX-015 | Shared Components  | Feedback Loops (3-Tier)  | P0       | Large  | A2/A3  | Med  | Network Drop Test   |
+--------+--------------------+--------------------------+----------+--------+--------+------+---------------------+
```

---

## DETAILED ITEM SPECIFICATIONS

### [UX-001] Streamline Hero Action Hierarchy
- **Area:** Public Landing (`src/components/KithraHero.tsx:60-120`)
- **Principle:** Hick's Law & Fitts's Law
- **Current Condition:** Three competing buttons ("Begin your profile", "Explore the weave", "How it works ↓").
- **Problem:** Dilutes conversion focus; creates hesitation for first-time visitors.
- **Proposal:** Consolidate into 1 prominent Primary Action: `[ Begin Your Journey → ]` (48px height), with a calm secondary text link: `Explore how Kithra works ↓`.
- **Impact:** Increases visitor signup velocity by eliminating decision latency.
- **Risk:** Low. No routing or security changes.
- **Dependencies:** None.
- **Effort:** Small (1 engineer hour).
- **Priority:** P1 | **Approval Tier:** **A1 (Presentation)**.
- **Verification:** Visual regression and click-through test to `/join`.

---

### [UX-002] Remove Premature Member Route Links from Landing Steps
- **Area:** Public Landing (`src/components/PublicViews.tsx:210-224`)
- **Principle:** Jakob's Law & Feedback Loops
- **Current Condition:** Step cards link directly to internal member URLs (`/member/assessments`, `/member/photos`).
- **Problem:** Crashes unauthenticated visitors into unexpected redirect loops.
- **Proposal:** Replace direct links with educational preview popovers or route to `/join` with context pre-set.
- **Impact:** Eliminates 404/auth-wall friction for public visitors.
- **Risk:** Low.
- **Dependencies:** UX-001.
- **Effort:** Small (2 engineer hours).
- **Priority:** P0 | **Approval Tier:** **A1/A2**.
- **Verification:** E2E unauthenticated crawler confirms zero internal `/member/*` links accessible without session.

---

### [UX-003] Harmonize Four-Space Landing Copy & Pricing Transparency
- **Area:** Public Landing (`src/components/PublicViews.tsx:188-225`, `496-555`)
- **Principle:** Aesthetic-Usability Effect
- **Current Condition:** Text refers to "three independent intentions"; pricing toggle between "Illustrative" and "Coming Soon" confuses visitors.
- **Problem:** Misrepresents product scope (omits Cofounders); leaves commercial status ambiguous.
- **Proposal:** Update all copy to reflect all 4 spaces; remove toggle and explicitly state: *"Pilot Phase: All Memberships Are Currently Complimentary."*
- **Impact:** Establishes complete brand transparency and honest expectations.
- **Risk:** Low.
- **Dependencies:** None.
- **Effort:** Small (1 engineer hour).
- **Priority:** P1 | **Approval Tier:** **A1**.
- **Verification:** Copy inspection confirming 0 occurrences of "three intentions" in public copy.

---

### [UX-004] Lock Forward Step-Jumping in Onboarding (Fail-Closed Adulthood)
- **Area:** Onboarding (`src/components/PublicViews.tsx:1528-1536`)
- **Principle:** Adulthood Security Invariant / Postel's Law
- **Current Condition:** Step indicator dots are clickable buttons allowing users to skip directly to Step 5, bypassing age certification.
- **Problem:** Critical compliance vulnerability under Indian DPDP and global child safety laws.
- **Proposal:** Make progress dots non-clickable visual indicators. Require explicit adulthood (18+) verification before Step 3 activates.
- **Impact:** Guarantees 100% legal adult verification compliance.
- **Risk:** Medium (requires strict state gating).
- **Dependencies:** None.
- **Effort:** Medium (3 engineer hours).
- **Priority:** P0 | **Approval Tier:** **A2/A3 (Security Invariant)**.
- **Verification:** Automated unit test attempting to advance without age confirmation; assert fail-closed rejection.

---

### [UX-005] Group Location & Language Selection into Structured Cards
- **Area:** Onboarding (`src/components/PublicViews.tsx:1486-1502`)
- **Principle:** Miller's Law & Law of Proximity
- **Current Condition:** Dense, unorganized cloud of 20+ language pills.
- **Problem:** Visual noise; difficult to find regional languages on mobile.
- **Proposal:** Chunk into "Top 5 Spoken Languages" + "More Languages" searchable accordion.
- **Impact:** Decreases time-to-complete Step 2 on mobile devices.
- **Risk:** Low.
- **Dependencies:** UX-004.
- **Effort:** Small (2 engineer hours).
- **Priority:** P2 | **Approval Tier:** **A1**.
- **Verification:** Keyboard navigation and mobile rendering test on 375px viewport.

---

### [UX-006] Enforce Psychological Non-Overclaim Summary Card
- **Area:** Assessment Summary (`src/components/MemberViews.tsx:1600-1650`)
- **Principle:** Psychological Honesty Invariant / Peak-End Rule
- **Current Condition:** 5-question completion displays a provisional note, but could feel abrupt.
- **Problem:** Risk of users misinterpreting experimental psychometrics as clinical diagnoses.
- **Proposal:** Explicitly label summary as: *"Provisional Self-Reflection: Experimental tool for self-discovery, not a clinical assessment."*
- **Impact:** Protects member trust and psychological integrity.
- **Risk:** Low.
- **Dependencies:** None.
- **Effort:** Small (1 engineer hour).
- **Priority:** P0 | **Approval Tier:** **A2/A3**.
- **Verification:** Assert disclaimer string present in test suite (`src/domain/phase8StagingAndPilotReadiness.test.ts`).

---

### [UX-007] Intention Sanctuary Ambient Container in Discovery
- **Area:** Discovery Feed (`src/components/MemberViews.tsx:870-920`)
- **Principle:** Law of Common Region & Visual Hierarchy
- **Current Condition:** Intention banner sits at top; candidate cards render on generic neutral background.
- **Problem:** Members forget which intention space (Friendship vs. Dating) they are currently browsing.
- **Proposal:** Wrap the feed in an ambient container carrying a subtle 2% wash of the intention's brand color.
- **Impact:** Instant visual orientation; prevents accidental cross-intention interactions.
- **Risk:** Low. Contrast must pass WCAG 2.2 AA (4.5:1).
- **Dependencies:** None.
- **Effort:** Medium (2 engineer hours).
- **Priority:** P1 | **Approval Tier:** **A1**.
- **Verification:** Color contrast ratio analysis across light and dark modes.

---

### [UX-008] Narrative-First Candidate Cards (Subordinating Numerical Scores)
- **Area:** Discovery Cards (`src/components/MemberViews.tsx:1150-1280`)
- **Principle:** Visual Hierarchy & Aesthetic-Usability Effect
- **Current Condition:** Prominent bold percentage (`92%`) dominates the card.
- **Problem:** Encourages gamified swiping habits rather than thoughtful evaluation of shared values.
- **Proposal:** Promote the qualitative narrative ("We Balance Each Other: Complementary daily rhythm") to primary focus; subordinate numerical percentage to a secondary tag.
- **Impact:** Fosters unhurried human connection.
- **Risk:** Medium (adjusts user expectations).
- **Dependencies:** UX-007.
- **Effort:** Medium (3 engineer hours).
- **Priority:** P2 | **Approval Tier:** **A1/A2**.
- **Verification:** Visual snapshot regression test.

---

### [UX-009] Install "Part Ways Politely" Handle (Solving Nuclear Block Trap)
- **Area:** Conversations (`src/components/MemberViews.tsx:2360-2410`, `src/server/apiRouter.ts`)
- **Principle:** Peak-End Rule & Master Safety Invariant
- **Current Condition:** Chat header only has "Delete" (local hide) and "Block" (punitive safety report). Connected users remain suppressed across all spaces forever unless blocked.
- **Problem:** Members trapped in connection suppression; blocking an amicable acquaintance causes emotional distress.
- **Proposal:** Install a dignified `[ Part Ways Politely ]` button. Transitions `relationship_state = 'disconnected'` and automatically restores discovery for both members without safety stigma.
- **Impact:** Critical usability and emotional safety improvement.
- **Risk:** Medium (requires database transition verification).
- **Dependencies:** D1 pair relationships table.
- **Effort:** Medium (4 engineer hours).
- **Priority:** P0 | **Approval Tier:** **A2/A3**.
- **Verification:** Full end-to-end pair ledger test confirming discovery unsuppression for both users.

---

### [UX-010] Contextual Breadcrumb in Introduction Notes
- **Area:** Connections & Chat (`src/components/MemberViews.tsx:2030-2090`)
- **Principle:** Recognition Rather Than Recall
- **Current Condition:** Received note displays text but omits which reflection or space prompted the note.
- **Problem:** Recipient is forced to remember or hunt for the sender's profile context.
- **Proposal:** Render a persistent context chip: `[Dating] · Connected via reflection on 'Solitude vs. Community'`.
- **Impact:** Removes memory burden; creates instant conversational rapport.
- **Risk:** Low.
- **Dependencies:** None.
- **Effort:** Small (2 engineer hours).
- **Priority:** P1 | **Approval Tier:** **A2**.
- **Verification:** Check header context rendering across mock and live D1 conversations.

---

### [UX-011] Dedicated Gathering Salon Room with Live D1 Leave API
- **Area:** Community Circles (`src/components/MemberViews.tsx:3380-3450`, `src/server/apiRouter.ts`)
- **Principle:** Feedback Loops & Law of Common Region
- **Current Condition:** RSVP previously displayed a toast, but omitted the actual Gathering Salon Room. No explicit "Cancel RSVP" button existed to call D1.
- **Problem:** Confirmed attendees cannot view the private venue address; cannot free up their seat if plans change.
- **Proposal:** Render the dedicated Gathering Salon modal showing private venue details, host notes, and an explicit `[ Release My Seat / Cancel RSVP ]` button calling `POST /api/member/circles/:id/leave`.
- **Impact:** Complete end-to-end real-world gathering workflow.
- **Risk:** Medium.
- **Dependencies:** Cloudflare D1 circle attendance schema.
- **Effort:** Medium (4 engineer hours).
- **Priority:** P0 | **Approval Tier:** **A2/A3**.
- **Verification:** Test seat count increment on join, decrement on leave, and verify waitlist promotion.

---

### [UX-012] Host "Archive / Cancel Gathering" Handle
- **Area:** Community Circles (`src/components/MemberViews.tsx:3460-3500`)
- **Principle:** Feedback Loops & Error Prevention
- **Current Condition:** Circle hosts were trapped if weather or illness struck; backend prevented leaving without notice.
- **Problem:** Hosts unable to cancel an event gracefully.
- **Proposal:** Add `[ Archive Gathering ]` with a prompt to explain to confirmed guests why the salon is cancelled.
- **Impact:** Gives circle organizers full control over unforeseen changes.
- **Risk:** Low.
- **Dependencies:** UX-011.
- **Effort:** Medium (3 engineer hours).
- **Priority:** P1 | **Approval Tier:** **A2/A3**.
- **Verification:** Verify circle status updates to 'cancelled' and attendees receive notice.

---

### [UX-013] Founder Overview "4 Macro Pulses" (Simple View)
- **Area:** Founder Admin (`src/components/AdminViews.tsx:740-830`)
- **Principle:** Miller's Law & Von Restorff Effect
- **Current Condition:** 12 flat KPI cards in Simple View; pending safety reports blend in.
- **Problem:** Executive cognitive overload; urgent safety escalations go unnoticed.
- **Proposal:** Reorganize Simple View into 4 Macro Pulses: 1. Community Growth, 2. Trust & Safety (with visual alert isolation), 3. Infrastructure, 4. Pilot Health.
- **Impact:** Sub-second triage for founders; clear separation from Advanced View.
- **Risk:** Low (Advanced View preserves all 12+ metrics).
- **Dependencies:** None.
- **Effort:** Medium (3 engineer hours).
- **Priority:** P1 | **Approval Tier:** **A1**.
- **Verification:** Role-based access and simple/advanced toggle test.

---

### [UX-014] Responsive Member CRM Card-Row Hybrid on Tablet
- **Area:** Admin CRM (`src/components/AdminViews.tsx:1020-1100`)
- **Principle:** Fitts's Law & Responsive Design
- **Current Condition:** Horizontal table scrolling on viewports $< 1024px$.
- **Problem:** Slow operational inspection for staff on iPads or mobile devices.
- **Proposal:** At $< 1024px$, automatically render stacked member cards with large touch targets.
- **Impact:** High staff mobility and operational speed.
- **Risk:** Low.
- **Dependencies:** None.
- **Effort:** Small (2 engineer hours).
- **Priority:** P1 | **Approval Tier:** **A1**.
- **Verification:** Responsive testing at 768px and 430px viewports.

---

### [UX-015] Standardized 3-Tier Feedback Contract Across All Remote Actions
- **Area:** Global Architecture (`src/App.tsx`, `src/components/MemberViews.tsx`, `src/server/apiRouter.ts`)
- **Principle:** Feedback Loops & Doherty Threshold
- **Current Condition:** Local state sometimes updates ahead of server confirmation without clear pending/failed states.
- **Problem:** User trust broken when network issues cause desynchronization.
- **Proposal:** Standardize 3-tier contract: 1. Optimistic pending indicator $\rightarrow$ 2. Server confirmation $\rightarrow$ 3. Actionable retry on error.
- **Impact:** Guarantees absolute truthfulness across all UI actions.
- **Risk:** Medium (requires network error interceptors).
- **Dependencies:** UX-009, UX-011.
- **Effort:** Large (6 engineer hours).
- **Priority:** P0 | **Approval Tier:** **A2/A3**.
- **Verification:** Simulated network drop tests verifying zero false success toasts.

