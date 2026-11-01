# KITHRA — FIN-RD: PRICING, COSTS, STAFFING, CASH RUNWAY & PORTABILITY
Version 3.0 | All values illustrative pending vendor quotes, tax advice and real consumption.

## 1. Financial contract
Kithra has **zero AI-inference, AI-twin, LLM and vector database runtime costs**. Its deterministic questionnaire profile scoring creates ordinary SQL/compute and support costs instead. A small Cloudflare bill is not a low-cost full company: personal moderation, operations, safety, support, security, legal and founder time can dominate. Count registered accounts, verified accounts, monthly active users, paying users and paid plan churn separately; a “5,000 registered users” infrastructure quote alone is unreliable.

## 2. Planned offer — proposal, not finalized prices
| Tier | Monthly | 3 months | 6 months | 12 months | Limits concept |
|---|---:|---:|---:|---:|---|
| Free | ₹0 | ₹0 | ₹0 | ₹0 | assessments, basic matches, mutual chat, Circles, all protections |
| Plus | ₹149 | ₹399 | ₹749 | ₹1,399 | richer explanations, advanced search, higher introduction allowance |
| Connect | ₹299 | ₹799 | ₹1,499 | ₹2,799 | advanced discovery, curated circles, enhanced insights |
| Matrimony Intent | ₹399 | ₹1,099 | ₹2,099 | ₹3,899 | intent-specific filters, life-planning sections, optional guided introductions |
One profile may opt into Friendship/Dating/Matrimony with separate privacy; tiers and entitlements should be explicit per mode or transparently combined after research. Safety controls, blocking/reporting, consent and legal data rights are always free. No lifetime unlimited promise without liability model. Price cards show tax inclusion/exclusion accurately, renewal, trial and refund policy, payment processing in minor units.

## 3. Infrastructure cost drivers
Cloudflare Paid Workers minimum $5 USD/month plus applicable usage and taxes. Workers request/CPU, D1 rows read/written and occupied bytes, DO websocket messages/duration, R2 GB-month and Class A/B operations, Queues operations and logging costs all matter. D1 Free per-database 500 MB; Paid max 10 GB/database, so scaling may require sharding or migration. R2 Standard 10GB free storage subject to current plan terms. Server comparisons: single VPS for controlled traffic, or high-availability multi-server with PostgreSQL PITR, Redis, monitoring, backups, ingress/WAF and Jenkins maintenance. These options are not equivalent in uptime or staff workload. Reference official schedules at https://developers.cloudflare.com/workers/platform/pricing/ and https://developers.cloudflare.com/d1/platform/limits/ ; verify on procurement day.

## 4. Finance worksheet architecture / editable inputs
Monthly model needs separate rows for users: registrations, verified, DAU, MAU, assessment starts/finishes, matches served, connection requests, message counts, file uploads/retention, reports, payments and chargebacks. Compute: `paying_users = MAU × conversion_rate`; `gross_billings = sum(active_subs_by_plan × recognized_monthly_price)`; `payment_fees = processed_volume × gateway_rate + refunds/chargebacks` (actual gateway tax treatment separately); `revenue_ex_indirect_taxes` based on applicable GST advice; `gross_contribution = revenue_ex_tax - gateway - infrastructure - variable verification/notification`; `operating_profit = gross_contribution - payroll - moderation - marketing - security - legal - overhead`; `cash_flow = operating_cash - capex - taxes_paid +/- working_capital`.
Input sensitivity scenarios: founder salary 0/25k/50k/100k INR monthly; staffing by role, DAU:MAU 0.1–0.5, paid conversion 1/3/7%, weighted ARPPU ₹100/₹200/₹400, media per member 0.1–3 GB, messages per DAU 5–100, legal/audit reserves, support tickets per 1K MAU, payment refund rate, CAC, churn, dollar exchange, GST. Run low/base/high cases; do not use a $5 Workers bill as proxy for full product deployment.

## 5. Founder salary and staffing
Solo founder pay is not discretionary if evaluating true long-run profitability. Include engineering lead, frontend designer, moderation coverage, part-time privacy counsel, security review, operations support, accountant, community manager and backup on-call where required by platform obligations. Model contractor costs when full-time hires are impossible. In an “unpaid founder” cash-flow case, show separate `imputed_founder_cost` for economic profit; similarly treat volunteer moderation as a safety capacity risk.

## 6. Scale-specific scenarios
Build and regularly recompute 100, 500, 1K, 5K, 10K, 25K, 100K registered accounts under DAU/MAU assumptions. Cloudflare vs VPS comparison outputs: request and row budgets, media storage, websocket concurrency, alert needs, estimated vendor charges and mandatory paid switches. Report total company cost after salaries, support, legal, marketing and taxes separately. Crossing D1 500MB free per DB or growing image storage can make “₹0 Cloudflare” impossible even at low registration counts.

## 7. Controls and finance permissions
Budget owner sets alert at 50/75/90% monthly cloud spend; pause nonessential media transformations or activity only after preserving emergency/reporting services. Do not silently suspend mandatory safety operations because free quota exhausted. Cost reports aggregate by Workers calls, D1, R2, DO, Queues, Firebase email/phone, mail provider, payment, backups, logs. Finance RBAC controls refunds, chargeback evidence and reconciliation; no support agent may change plan entitlements directly. Avoid price manipulation by clients; server chooses entitlements after verified payment webhook.

## 8. Business risk and break-even policy
A complete platform is not profitable just because deterministic scoring is cheap. Test acquisition cost, retention, local matching liquidity, safety operations, conversion and renewal. Break-even target: paid active subscribers required to cover all fixed and variable costs at blended net contribution, expressed with confidence intervals and founder salary. Actual answer changes significantly if 1% versus 5% of 5K registrants subscribe. Don't treat earlier illustrative ₹577 Cloudflare and ₹1.26 lakh total operating cost as universally accurate: those are scenario outputs dependent on user activity and fixed staffing.

## 9. Existing workbook handover
The previously created Kithra 5-year financial workbook is included as a **baseline scenario artifact**, not a verified forecast. Accountant/financial analyst must re-audit its formulas, current prices, FX, GST, employer cost, compliance staffing and cash-runway assumptions. It never represents a final commercial offer. Cross-check current Razorpay transaction rate and promotion terms; the official pricing page can change: https://razorpay.com/pricing/ .
