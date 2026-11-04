# KITHRA — FOUNDER & STAFF ADMIN DASHBOARD REDESIGN BLUEPRINT
**Document ID:** `KITHRA_UX20_ADMIN_DASHBOARD_REDESIGN.md`  
**Target Surface:** `src/components/AdminViews.tsx` (`AdminShell`, `FounderOverview`, `MemberCRM`, `TrustSafetyView`, `SubscriptionView`, `PhotoReviewView`), `src/components/GeographicGrowthMap.tsx`  
**Status:** PROPOSED REDESIGN BLUEPRINT — PENDING FOUNDER APPROVAL (A1 / A2 / A3)  

---

## 1. STRATEGIC OBJECTIVE & PHILOSOPHY

The Kithra Founder Command Center and Staff Operational Suite exist to safeguard community trust, monitor platform health, and govern operations with zero surveillance intrusion into private member reflections.

### Absolute Invariants to Preserve:
1. **Preserve Simple View / Advanced View Distinction:** A founder must immediately grasp business health without wading through technical telemetry; authorized operators must retain full analytical power.
2. **Zero Raw-Answer Access Invariant:** Standard admin/support staff can *never* view raw psychometric questionnaire responses (HTTP 403 on inspection).
3. **Zero Manufactured Metrics:** Real metrics only. Kithra never invents fake sales, simulated active users, or misleading charts.
4. **Strict Role-Based Access Control (RBAC):** Navigation and data queries are strictly bounded by staff role (`Founder`, `Compliance Officer`, `Support Lead`, `Moderator`).

---

## 2. AUDIT OF CURRENT ADMIN EXPERIENCE

### Key Issues Identified
1. **Simple View Information Overload (Miller's Law):**
   - In `AdminViews.tsx:740-830`, the Founder Simple View displays 12 individual metric cards in a flat grid, alongside 14 operational breakdown badges. Key signals (such as 2 pending safety reports) have the exact same visual prominence as total registered users.
2. **Geographic Map Controls on Mobile & Tablet:**
   - On viewports $< 1024px$, the Leaflet growth map container struggles with touch pinch-to-zoom gestures, occasionally capturing page scroll.
3. **CRM Directory Table Readability:**
   - On 768px tablet screens, the Member CRM table scrolls horizontally with 8 columns, requiring awkward side-swiping to reach the "Inspect" button.
4. **Subscription Pricing Reality Disclosure:**
   - The current billing tab displays Indian payment gateway integrations (Razorpay & Cashfree architecture) well, but could present pilot phase subscription statuses more cleanly.

---

## 3. SECTION-BY-SECTION REDESIGN SPECIFICATIONS

### A. Executive Founder Overview: The "4 Macro Pulses" (Simple View)
In **Simple View**, replace the 12-card wall with **4 Essential Operational Pulses**:
1. **Pulse 1: Community Growth & Momentum:**
   - Total Verified Members (`1,248`) · `+14%` this week · 88% Basic Profile Readiness.
   - Plain English ELI5: *"Healthy organic adoption across Bengaluru and Mumbai. Members are actively completing starter questions."*
2. **Pulse 2: Trust & Safety Status (Von Restorff Isolation):**
   - Pending Incident Reports (`2 Needs Review`) · `0 Unresolved Escalations`.
   - Actionable CTA: `[ Review Safety Queue → ]` in soft coral alert styling.
3. **Pulse 3: Platform & Cloudflare Infrastructure:**
   - D1 Replication: Singapore Primary (`Active · 28ms latency`) · Worker Uptime: `99.98%` · Zero 5xx Errors in last 24h.
4. **Pulse 4: Financial & Pilot Health:**
   - Complimentary Pilot Memberships (`1,248`) · Zero fake revenue. Indian Payment Gateways (Razorpay/Cashfree) architected and standing by for commercial launch.

### B. Analytical Deep Dive (Advanced View)
When toggled to **Advanced View**, the full power suite expands seamlessly:
- **Interactive Cohort Funnels:** Visitor $\rightarrow$ Join $\rightarrow$ 5-Question Starter $\rightarrow$ First Discovery $\rightarrow$ Accepted Connection $\rightarrow$ 30-Day Retention.
- **Dimensional Psychometric Health:** Aggregate construct balance curves across populations (e.g. Social Energy distribution) without exposing individual identities.
- **Date Range Selectors & CSV Export:** 7D, 30D, 90D, All-Time, with immutable audit logging on export actions.

### C. Member CRM: Responsive Card-Table Hybrid
- **Desktop ( $\ge 1024px$ ):** Dense, high-information table with quick filters by city, intention, readiness, and account status.
- **Tablet & Mobile ( $< 1024px$ ):** Automatically morphs into stacked **Member Profile Cards**, placing the "Inspect Member" handle in the top-right thumb zone (Fitts's Law).
- **Member Detail Drawer:**
  - Displays: Verified email, adulthood status, join date, enabled intentions, photo review status, and staff notes.
  - **Zero Raw Answers Invariant Enforced:** Displays derived archetype and readiness score; raw responses are strictly absent from the payload.

### D. Trust & Safety Incident Hub
- **Severity Triage:** P0 (Harassment / Coercion), P1 (Inappropriate Photo), P2 (Spam / Fake Account).
- **Actions:** 1-Click "Temporary Discovery Pause", "Formal Warning", "Full Account Suspension", or "Dismiss False Report".
- Every staff moderation decision requires an immutable audit note saved to `admin_audit_logs`.

---

## 4. BEFORE / AFTER SCREENSHOT MOCKUPS (ASCII / WIREFRAME)

### Founder Overview: Simple View Redesign

#### BEFORE (12-Card Grid Overload in Simple View)
```
+-------------------------------------------------------------------------+
| FOUNDER COMMAND CENTER · OVERVIEW             [Simple View] [Advanced]  |
| Simple, visual numbers explaining how Kithra is growing...              |
|-------------------------------------------------------------------------|
| [ Total Members: 1,248 ]  [ New This Week: 142 ]  [ Readiness: 88% ]    |
| [ Active Matches: 412 ]   [ Circles Hosted: 18 ]  [ RSVPs: 94 ]         |
| [ Support Open: 4 ]       [ Safety Reports: 2 ]   [ Photos Queue: 6 ]   |
| [ D1 Uptime: 99.9% ]      [ Pilot Sales: ₹0 ]     [ Gateways: Ready ]   |
|                                                                         |
| (12 flat cards with equal visual weight; urgent safety alert lost)      |
+-------------------------------------------------------------------------+
```

#### AFTER (4 Clean Macro Pulses with Actionable Exception Triage)
```
+-------------------------------------------------------------------------+
| FOUNDER COMMAND CENTER                        [★ Simple] [   Advanced]  |
| Executive Pulse · Bengaluru Headquarters · Pilot Stage                  |
|-------------------------------------------------------------------------|
|                                                                         |
| +--- PULSE 1: COMMUNITY ------+   +--- PULSE 2: TRUST & SAFETY -------+ |
| | 1,248 Verified Members      |   | 2 Reports Awaiting Review         | |
| | +14% weekly growth rate     |   | [!] 1 Urgent Dating Harassment    | |
| | "Healthy steady momentum"   |   | [ Review Safety Queue → ] (Amber) | |
| +-----------------------------+   +-----------------------------------+ |
|                                                                         |
| +--- PULSE 3: INFRASTRUCTURE -+   +--- PULSE 4: PILOT REVENUE --------+ |
| | Singapore D1: Optimal (24ms)|   | Pilot Phase: Complimentary Passes | |
| | Worker Uptime: 99.98%       |   | Razorpay & Cashfree Ready         | |
| | Zero fail-closed errors     |   | Zero synthetic revenue injected   | |
| +-----------------------------+   +-----------------------------------+ |
|                                                                         |
| [ View All Operational Modules & Breakdowns ↓ ]                         |
+-------------------------------------------------------------------------+
```

---

### Member CRM on Tablet (768px Viewport)

#### BEFORE (Horizontal Overflow & Awkward Scrolling)
```
+-------------------------------------------------------------+
| Member Directory                                           |
| Search: [ Meera            ]  City: [ All Cities v ]       |
|-------------------------------------------------------------|
| Name       | Email        | City       | Intention | Stat...->
| Meera R.   | meera@ki...  | Bengaluru  | Dating    | Acti...->
| Aarav S.   | aarav@ki...  | Mumbai     | Friend... | Acti...->
| (Requires horizontal table scrolling to find "Inspect" btn) |
+-------------------------------------------------------------+
```

#### AFTER (Responsive Card-Row with Direct Touch Targets)
```
+-------------------------------------------------------------+
| MEMBER CRM (1,248 Members)                                  |
| [ Search members...          ] [ Filter by City v ]         |
|-------------------------------------------------------------|
| +---------------------------------------------------------+ |
| | Meera Ramachandran · Bengaluru           [ Inspect -> ] | |
| | meera.r@kithra.in · Joined Oct 2026                     | |
| | Intentions: [Dating] [Friendship] · Readiness: 100%     | |
| | Status: Active · 0 Safety Incidents                     | |
| +---------------------------------------------------------+ |
| +---------------------------------------------------------+ |
| | Aarav Sharma · Mumbai                    [ Inspect -> ] | |
| | aarav.s@kithra.in · Joined Nov 2026                     | |
| | Intentions: [Cofounders] · Readiness: 85%               | |
| | Status: Active · 0 Safety Incidents                     | |
| +---------------------------------------------------------+ |
+-------------------------------------------------------------+
```

---

## 5. IMPACT, RISK AND VERIFICATION

- **Primary Impact:** Drastically reduces cognitive fatigue for founders; enables sub-second triage of urgent safety reports; guarantees responsive usability on mobile and tablet devices.
- **Risk Analysis:** None. Advanced operational details are strictly preserved in "Advanced View."
- **Approval Tier:** **A1 (Dashboard Layout) & A2 (CRM Card Switcher)**.
- **Verification Plan:**
  1. Role-Based Access Control test: Log in as Support Lead $\rightarrow$ verify Finance and Audit tabs return 403 / are hidden.
  2. Privacy test: Inspect member record $\rightarrow$ verify response JSON contains zero raw psychological questionnaire answers.
  3. Tablet rendering test: Verify CRM displays card mode at 768px with zero horizontal scroll overflow.

