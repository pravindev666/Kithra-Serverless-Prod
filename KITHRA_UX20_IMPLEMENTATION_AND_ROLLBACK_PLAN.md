# KITHRA — PHASE 16 IMPLEMENTATION & ROLLBACK EXECUTION PLAN
**Document ID:** `KITHRA_UX20_IMPLEMENTATION_AND_ROLLBACK_PLAN.md`  
**Status:** PROPOSED TECHNICAL EXECUTION PLAN — AWAITING FOUNDER APPROVAL (A0 $\rightarrow$ A1-A5)  
**Safety Invariant:** All changes must be atomic, fully covered by automated regression tests, and instantly reversible via Git tags.  

---

## 1. PHASED IMPLEMENTATION ROADMAP

Once specific change IDs are approved by the founder, implementation will proceed through strictly sequenced, independent phases.

```
+---------------------------------------------------------------------------------------------------------+
|                                    SEQUENCED IMPLEMENTATION ROADMAP                                     |
+-------+-------------------------+---------------------------------+---------------+---------------------+
| Phase | Scope                   | Target Change IDs               | Approval Tier | Rollback Strategy   |
+-------+-------------------------+---------------------------------+---------------+---------------------+
| 1     | Presentation & Copy     | UX-001, UX-003, UX-005, UX-007  | Tier A1       | Clean git revert;   |
|       |                         | UX-013, UX-014                  |               | zero DB impact.     |
+-------+-------------------------+---------------------------------+---------------+---------------------+
| 2     | Navigation & Workflows  | UX-002, UX-008, UX-010          | Tier A2       | Component rollback; |
|       |                         |                                 |               | zero state loss.    |
+-------+-------------------------+---------------------------------+---------------+---------------------+
| 3     | Security & Invariants   | UX-004, UX-006                  | Tier A2/A3    | State validation    |
|       | (Adulthood & Honesty)   |                                 |               | fallback toggle.    |
+-------+-------------------------+---------------------------------+---------------+---------------------+
| 4     | Remote APIs & Ledger    | UX-009, UX-011, UX-012, UX-015  | Tier A2/A3    | D1 transaction      |
|       | (Circles & Part Ways)   |                                 |               | safety; API version.|
+-------+-------------------------+---------------------------------+---------------+---------------------+
| 5     | Staging & Verification  | Full Suite Execution (240+ tests| Tier A4       | Remote staging      |
|       |                         | + New UX20 Test Suite)          |               | smoke test suite.   |
+-------+-------------------------+---------------------------------+---------------+---------------------+
| 6     | Production Release Gate | Final Production Verification   | Tier A5       | Instant Worker      |
|       |                         | & Founder Sign-Off              |               | version rollback.   |
+-------+-------------------------+---------------------------------+---------------+---------------------+
```

---

## 2. DETAILED PHASE EXECUTION SPECIFICATIONS

### Phase 1: Presentation, Copy & Styling (Tier A1)
- **Goal:** Polish visual hierarchy, resolve 3-vs-4 intention copy inconsistencies, and implement touch-target spacing without touching application logic.
- **Actions:**
  - Update `src/components/KithraHero.tsx` to single primary CTA (`UX-001`).
  - Update `src/components/PublicViews.tsx` to include Cofounders in all copy and clarify pilot status (`UX-003`).
  - Enhance touch padding on step indicators to $\ge 44\times 44\text{px}$ in `src/index.css`.
  - Reorganize Simple View in `src/components/AdminViews.tsx` into 4 Macro Pulses (`UX-013`).
  - Add tablet card-row switcher for Member CRM (`UX-014`).
- **Validation:** Visual regression tests, `npm test` passing 240/240, Lighthouse A11y score $\ge 98$.

### Phase 2: Navigation & Member Workflows (Tier A2)
- **Goal:** Eliminate premature member route links from public landing; contextualize introduction notes; implement narrative-first candidate cards.
- **Actions:**
  - Change landing explainer step actions to educational popovers or `/join` routing (`UX-002`).
  - Add contextual breadcrumbs to received introduction notes in `MemberViews.tsx` (`UX-010`).
  - Restructure candidate match cards to emphasize qualitative lens narratives (`UX-008`).
- **Validation:** Unauthenticated crawler tests; component interaction tests.

### Phase 3: Security & Psychological Invariants (Tier A2 / A3)
- **Goal:** Lock forward step-jumping in onboarding; ensure fail-closed adulthood assurance; enforce psychological non-overclaim summary.
- **Actions:**
  - In `src/components/PublicViews.tsx`, convert step indicator buttons to visual-only markers; require verified age $\ge 18$ to proceed (`UX-004`).
  - Enforce provisional self-reflection disclaimer on 5-question completion screen (`UX-006`).
- **Validation:** Negative security tests attempting step jumps; assert fail-closed rejection.

### Phase 4: Remote APIs, D1 Pair Ledger & Community Circles (Tier A2 / A3)
- **Goal:** Connect live D1 leave and archive endpoints; install the "Part Ways Politely" button; implement 3-tier feedback contract.
- **Actions:**
  - Wire `[ Part Ways Politely ]` in chat to transition `relationship_state = 'disconnected'` and restore discovery (`UX-009`).
  - Render `GatheringSalonModal` with private venue address and connect `[ Release My Seat ]` to `POST /api/member/circles/:id/leave` (`UX-011`).
  - Add host archive handle (`UX-012`).
  - Implement optimistic $\rightarrow$ server confirmation $\rightarrow$ error retry pattern (`UX-015`).
- **Validation:** Real Cloudflare Worker & D1 integration tests; multi-user pair unsuppression verification.

---

## 3. COMPREHENSIVE AUTOMATED VERIFICATION PLAN

The execution plan introduces a dedicated automated test suite: `src/domain/phase16UX20Compliance.test.ts`.

### Planned Test Cases
1. **Test 16.1 — Touch Target Minimums (Fitts's Law):** Programmatically verify all button and pagination tokens possess bounding box $\ge 24\times 24\text{px}$ (and $\ge 44\times 44\text{px}$ on touch targets).
2. **Test 16.2 — Fail-Closed Adulthood Invariant:** Attempt to initialize discovery state with missing or underage birth year; verify strict rejection.
3. **Test 16.3 — Four-Space Landing Consistency:** Verify that all public landing components describe Friendship, Dating, Matrimony, and Cofounders.
4. **Test 16.4 — Connection Termination & Unsuppression:** Simulate User A and User B connected in Dating $\rightarrow$ User A clicks "Part Ways Politely" $\rightarrow$ verify both users return to `all_spaces_eligible` in the pair ledger.
5. **Test 16.5 — Gathering Salon Seat Allocation:** Simulate 10-seat circle at capacity $\rightarrow$ Member releases seat $\rightarrow$ verify capacity becomes 9/10 and waitlist is promoted.
6. **Test 16.6 — Feedback Contract Non-Regression:** Simulate network failure during message send; verify UI displays draft preservation and retry handle without emitting false success toasts.

---

## 4. INSTANT ROLLBACK PROCEDURES

```
+---------------------------------------------------------------------------------------------------------+
|                                        ROLLBACK CONTINGENCY MATRIX                                      |
+-------------------+------------------------------------------+-----------------------+------------------+
| Risk Scenario     | Detection Metric                         | Action Taken          | Recovery Time    |
+-------------------+------------------------------------------+-----------------------+------------------+
| Visual Regression | CSS layout shift or clipping on mobile   | `git revert <commit>` | < 2 minutes      |
| Onboarding Drop   | Form abandonment rate spike              | Revert step gating    | < 5 minutes      |
| API Disconnect    | D1 leave/cancel HTTP 500 error           | Fallback to local RPC | Instant fallback |
| Production Defect | Uncaught exception in Cloudflare Worker  | `wrangler rollback`   | < 30 seconds     |
+-------------------+------------------------------------------+-----------------------+------------------+
```

### Pre-Deployment Git Snapshot
Before applying any approved change bundle, a pristine Git tag will be created:
`git tag -a kithra-phase16-audit-baseline -m "Pristine baseline before Phase 16 UX modifications"`

If any issue arises during implementation, rolling back to the exact current state is guaranteed via:
`git reset --hard kithra-phase16-audit-baseline`

