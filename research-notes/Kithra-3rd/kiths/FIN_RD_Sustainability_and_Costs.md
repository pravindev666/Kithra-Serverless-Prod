# FIN-RD — Complete Financial Requirements (No AI Inference)

## Model principles
AI/LLM/twin/embedding costs are **exactly zero** by product design, unless the founder changes scope in a new signed contract. Costs depend on active users, photo storage, messages, DB rows and operational risks; registered count alone is not a billing meter. Build a 60-month P&L, cash flow, founder salary and runway with pessimistic/base/optimistic scenarios and deployment comparison. Price/tax and costs must remain editable and source-linked.

## Cost centers
1 Cloudflare minimum and overages: Workers requests/CPU, D1 rows/storage and per-db cap, Durable Objects connection duration/requests, R2 storage/Class A/B operations, Queues/Cron. 2 Server: VPS/containers, PostgreSQL/backup/PITR, Redis, object storage, traffic/CDN, monitoring, Jenkins agent/registry. 3 Firebase/Identity Platform MAU, MFA, optional phone OTP, email/SMS provider and abuse prevention. 4 Razorpay/merchant percentage and fixed fees, currency conversion and chargebacks. 5 media moderation provider/human review, support, grievance response and incidents. 6 founder salary, engineering, DevOps, security, design/content, translators, counsel, accounting and insurance. 7 marketing/CAC/retention, taxes (including GST based on applicability), depreciation/capitalized product build, working capital and emergency reserves.

## Proposed scenario axes
Registrations: 100, 500, 1,000, 5,000, 10,000, 100,000. MAU %: 10/30/50. Paid conversion of MAU: 1/3/7%. Blended realized subscription ARPPU ₹100/₹200/₹400 excluding tax as appropriate. Founder salary ₹0/₹25k/₹50k/₹100k monthly. Moderation tickets per 1000 MAU and cost/ticket ₹15/₹40/₹120. Hosting options Cloudflare paid, one VPS, scaled server. Show sensitivity ranges, not a point prediction.

## Illustrative example only
5,000 registered × 30% MAU = 1,500 active, ×3% paid = 45 paid, ×₹200 blended realized ARPPU = ₹9,000 gross subscription revenue/month before refunds/payment/tax. A scenario with ₹50,000 founder compensation and staffed moderation/legal can lose substantially more than the Cloudflare infrastructure fee. Past estimate of roughly ₹577 Cloudflare/month and roughly ₹1.26 lakh full company cost at 5k registrations were **hypothetical workload/budget models**, not vendor quotes.

## Monitoring
Per active user capture API calls, DB rows read/written, GB stored and media ops, messages/user-day, DO connection-minutes, queue jobs, SMS sends, failed payment rate, refunds, report rate, support time, cost per paying member. An event's privacy-safe cost tag must not contain user content. Reconcile invoice to allocation monthly. Alert on cost-budget utilization thresholds, billing failures, unusually high abuse costs.

## Break-even logic
`Contribution per paying user = net realized ARPPU - processing/refunds/usage-variable cost`; `monthly operating surplus = paying_users*contribution - fixed salaries/ops/legal/marketing - unpaid-user variable cost`. Scenarios by month, plan mix, payback period, CAC, churn, lifetime, hosting strategy. Show cash burn/runway and taxes separately from contribution. Don't conflate corporate profit with founder take-home.

## Procurement decisions
Architecture choice should be driven by measured use and operations expertise; free-tier is not a compliance/security waiver. Server may look cheaper per unit yet cost more through maintenance, backup, failover and incident staffing. Cloudflare may be economical at moderate traffic but R2, DO, email and auth can dominate under media-heavy usage.

## Release commercial gate
Final prices and international availability require founder approval, accurate taxes and payment integration, contractual refund policy, valid merchant credentials and monitoring. Forecasts must label sources and assumptions; no market-size or revenue numbers invented. For 5-year workbook, the build team should link actual invoices after launch and preserve last forecast as an immutable version.
