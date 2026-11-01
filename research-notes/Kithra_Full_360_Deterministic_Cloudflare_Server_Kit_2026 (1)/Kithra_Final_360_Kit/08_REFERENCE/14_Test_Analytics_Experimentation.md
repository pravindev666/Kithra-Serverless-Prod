> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# QA-RD / Analytics-RD — Acceptance, Test Strategy, Instrumentation & Experiments

## 1. Quality architecture
**Unit:** scoring weights/coverage/bands, consent state transitions, eligibility predicates, billing entitlements, moderation deadlines. **Integration:** Firebase JWT verification, D1 migrations/transactions, R2 private upload, DO message state, Queue retries, Razorpay webhook. **Contract:** OpenAPI schema and generated TS client matches server on every release. **E2E:** sign-up, independent mode onboarding, quiz resume, discovery, mutual request/chat, block/report, case action, cancellation/export/delete. **Security:** IDOR/authorization and admin privilege adversarial matrix; device and browser matrix; limited load tests on paid sandbox budgets.

## 2. Prioritized full scenario matrix
| ID | Test | Required outcome |
|---|---|---|
| T01 | Fresh unauthenticated user opens `/api/v1/me` | 401, no private data |
| T02 | User activates friend only and tries matrimony discovery | empty/403 with explanation |
| T03 | Complete quiz after random order and resume from device B | stable assignment and saved response accuracy |
| T04 | Two users share 100% measured index but one blocked the other | not discoverable / cannot chat |
| T05 | Score insufficient coverage | no misleading 90% confidence outcome |
| T06 | User changes answer then recalculates | new score version, match cache invalidated |
| T07 | User withdraws profiling consent | discoverability disabled for that inference, prior cache unreadable |
| T08 | User uses AI to answer quiz | no "undetectable proof" claim; retest policy transparent |
| T09 | Message sent with expired or forged token | deny, no persistence |
| T10 | Report from free/expired/banned plan | protected reporting remains accessible through policy-safe channel |
| T11 | Admin support agent guesses moderation evidence URL | 403 + audited failed access |
| T12 | Admin role client spoof and forged email | deny via verified server permissions |
| T13 | Risky admin ban requires 2 approvals | cannot commit with one account |
| T14 | Payment webhook repeated 20 times | exactly one ledger credit and entitlement |
| T15 | Cancel subscription | no future renewal from platform while core data remains |
| T16 | Erase personal data with lawful hold | purge eligible records, retain only documented hold with restricted access |
| T17 | D1 free read limit reached | graceful nonessential throttling, alert; safety case still available via contingency |
| T18 | R2 object URL leaked | expired scoped signed URL cannot reveal other objects |
| T19 | Worker deployment rollback | previous version restores, schema forward compatibility |
| T20 | Low-end mobile + reduced motion | full functionality, no excessive animation |

## 3. Events and privacy taxonomy
Store consented, minimized aggregate usage metadata, not raw answers, private texts, mental-health labels or sexual preference as marketing analytics. Example events: `onboarding_started`, `mode_activated`, `quiz_attempt_started`, `quiz_progress_checkpoint` (counts, no answers), `quiz_submitted`, `score_viewed`, `discovery_viewed`, `connection_requested`, `connection_accepted`, `report_opened`, `report_submitted`, `block_applied`, `second_contact_confirmed_day7`, `continued_connection_confirmed_day30`, `subscription_started`, `renewal_cancelled`, `support_sla_breached`, `case_closed`. Each event includes schema version, timestamp, coarse mode, experiment variant if consented, anonymized cohort and correlation ID; never user plaintext in third-party analytics.

## 4. Primary outcomes
**North star:** day-30 mutual continuity rate = pairs with two-sided affirmative follow-up / eligible introduced pairs, with transparent missing-data denominator. Secondary: completed meaningful introductions per active local cohort, day7 repeat contact, user safety comfort score, actual group repeat participation, subscription retention, complaints/1,000 active conversations, median and p95 response/resolution time, fairness across tested groups (only where lawful and proportionate).

## 5. Scientific matching experiments
**Superseded by v3 deterministic policy:** Kithra uses only questionnaire-derived and rule-based comparisons; no AI runtime is in scope.

## 6. Release quality gates
No P0 security issue; full authz suite and admin MFA passed; no false copy; accessibility AA targeted; critical routes load tested, backup/restore verified, 30-day retention and abuse cases tested, legal/privacy reviewed, on-call acknowledged, monitoring dashboards and rollback rehearsed. Test artifacts stored with release SHA.

## 7. Reporting dashboards
Public product dashboard aggregates by city/mode and hides small counts to prevent reidentification. Admin views segmented by duty; no casual raw quiz exports. Executive weekly report: activated users per pool, qualified introductions, continued connections, conversion, safety incidents and SLA, net cash burn. Matching science report: score calibration, holdout lift, attrition, bias and caveat compliance. Finance report: settled payments, refunds/chargebacks, realized ARPPU, gross margin and spend versus ceilings.
