> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Billing-RD / Financial Model — Pricing, Entitlements, and Economics

Prices below are **proposed validation hypotheses**, not competitor-derived willingness to pay or profit forecasts. Use user interviews and live gateway/tax rates before publication. Legal and safety controls remain free.

## 1. Proposed plans (controlled production validation)

| Tier | Monthly | 3 months | 6 months | 12 months | Primary entitlements |
|---|---:|---:|---:|---:|---|
| Free | ₹0 | ₹0 | ₹0 | ₹0 | basic quiz, profile, useful discovery, limited requests, mutual chat, groups, report/block, full privacy controls |
| Plus | ₹149 | ₹399 | ₹749 | ₹1,399 | extra monthly introductions, multi-lens deeper explanations, advanced search, saved profiles |
| Connect | ₹299 | ₹799 | ₹1,499 | ₹2,799 | higher but capped intro quota, curated group features, additional filters and report comparisons |
| Matrimony Intent (later, optional) | ₹399 | ₹1,099 | ₹2,099 | ₹3,899 | serious-intent tools, opt-in life-planning comparison and guided introductions, no guarantees |

**Important:** initial early internal delivery phase should launch Free only or test a clearly disclosed nominal paid controlled production validation; do not commit engineering to all four tiers before demand exists. All above prices are illustrative *before final GST handling*, discounts relative to monthly are not implied auto-renew consent. The user may purchase one shared subscription with per-mode entitlements later, or separate modes, but never silently activate a different relationship mode when upgrading.

## 2. Never paywall
Blocking, reporting, privacy and consent withdrawal, access/correction/export/deletion where rights apply, basic interaction after mutual acceptance, emergency help, abuse appeal and complaint responses. Avoid paid bypass of someone's preferences, "priority access" to people who opted out, or refunds withheld for unsafe service.

## 3. Billing lifecycle
`draft_checkout -> pending_gateway -> payment_confirmed -> entitlement_granted -> active -> renewal_pending -> renewed/grace/past_due -> cancelled/expired/refunded`. Upgrade/downgrade proration and refund policies must be decided and disclosed. Gateway failure must not strip user privacy/safety or existing paid access prematurely. Persist `price_version`, `tax_calculation`, consent timestamp, renewal election, provider refs and finalized invoice metadata. User can download invoice and cancel future renewals without agent intervention.

## 4. Razorpay engineering requirements
Payment methods/recurring constraints depend on actual merchant setup and live Indian rails. Use subscription mandates only with required informed consent, pre-debit communications and legal compliance. Stripe-like instant card recurring assumptions may not apply to UPI/card mandates. Razorpay signed webhook verification on raw body, event ID unique index, idempotent ledger, server-confirmed payment status, reconciliation, retry/outbox, back-office refund approvals and masked details. Do not store PAN, CVV or UPI credentials.

## 5. Illustrative unit economics (not forecasts)
Assume Registered → MAU = 30%, Paid conversion of MAU = 3%, subscription realized ARPPU ₹149/month, gateway+indirect processing allowance 3% (placeholder), monthly fixed ops ₹7,500 baseline, variable support/moderation ₹1.5 per MAU, variable infra/email ₹0.4 per MAU. Gross margin before paid acquisition and tax = revenue − gateway − fixed − variable.

| Registrations | MAU | Paying | Gross ₹/mo | Approx modeled contribution ₹/mo |
|---:|---:|---:|---:|---:|
| 100 | 30 | 1 | 149 | -7,412 |
| 1,000 | 300 | 9 | 1,341 | -6,769 |
| 5,000 | 1,500 | 45 | 6,705 | -3,846 |
| 10,000 | 3,000 | 90 | 13,410 | -192 |
| 100,000 | 30,000 | 900 | 134,100 | 65,577 |

**Superseded by v3 deterministic policy:** Kithra uses only questionnaire-derived and rule-based comparisons; no AI runtime is in scope.

## 6. Cohort and pricing experiments
Experiment price versus conversion ethically through clearly disclosed offers: Plus ₹99/149/199; no dark pattern, fake scarcity, deceptive fake charges, or incompatible payment mandates. Collect willingness-to-pay before checkout; measure refund complaints and 30/90-day retention. Pricing roadmap requires segment-specific India evidence and competition validation.

## 7. Cost guardrails
Feature flags for photo uploads, AI models, large answer-set retention, group/member quotas. Approx average 10 profile photos × 300KB × 5,000 accounts ≈15GB before versions/backups; R2 Standard 10GB-month free allowance would be exceeded. Even compressed images and read operations incur resource use; script quota alerts. Long conversations/media and identity/SMS cost can dominate modest subscription revenue. Human support at 24/7 scale cannot be assumed free. Set monthly spend thresholds with graceful degradation of nonessential features, not safety.

## 8. Subscription edge cases
Refund granted after entitlement expiration; duplicate payment webhook; subscription payment success but email failed; wrong price version; gift/referral fraud; user banned with paid time; deceased user account; cancellation near renewal boundary; tax invoice correction; expired mandate; payment dispute; deletion request with financial retention. Each gets deterministic state machine and reconciled audit record.
