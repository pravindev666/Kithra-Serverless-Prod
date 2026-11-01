# BILLING-RD — Unified Membership and Mode-Neutral Entitlements

## "Big cat / small cat" decision
Kithra must not charge separate core membership prices just because one member seeks friendship and another seeks matrimony. **One account, one Free/Plus/Connect subscription, benefits usable in every opt-in mode.** Separate charges only for genuinely delivered third-party/real-human services, not for access to valuable people. No VIP access to high-agreement matches. Core consented discovery, post-mutual-acceptance messages, blocks/reports, rights and support remain free.

| Price hypothesis (India) | 1 mo | 3 mo | 6 mo | 12 mo | Benefits |
|---|---:|---:|---:|---:|---|
| Free | ₹0 | ₹0 | ₹0 | ₹0 | Assessments, consented discovery, invitations, eligible mutual messaging, Circles, safety, rights |
| Plus | ₹149 | ₹399 | ₹749 | ₹1,399 | richer explanations, more filter convenience, increased introduction/compare usage |
| Connect | ₹249 | ₹699 | ₹1,299 | ₹2,399 | Plus + deeper side-by-side comparisons, curated circles and higher convenience limits |

**All figures provisional** and not proven profitable. Original older ₹299 Connect and separate ₹399 Matrimony Intent are superseded by Hermes unified recommendation, subject to founder final approval. Do not silently increase plan rates. Display exact benefits only if implemented; never sell badges/verification before provider live.

## International proposals
Regional price book, purchasing power/local research rather than straight USD→INR, country tax treatment, payment currency support and refund rules. Possible research price bands Plus ~€7–9 EU/UK, ~$8–10 US/CA and local India ₹149; **not approved**. No publishing speculative comparisons with competitors as facts.

## Entitlement service
`getEntitlements(userId,planVersion,atTime)` returns typed feature flags and quotas, with 0 means not available and null means unlimited as documented. Store `plan_version`, `status`, currency, billing interval, merchant provider, future effective date and region. Every read and write consults authenticated entitlement context but may not use plan to authorize personal safety or baseline messaging. Paywall banners never obstruct report/block or account deletion. Provide downgrade semantics and grace window.

## Checkout UX
Plan grid Free first, comparison per mode, monthly/quarterly/semiannual/year switch, annual savings mathematically accurate (no fictitious strike-through), tax/fees shown, renewal disclosed, authorization step, 3DS/UPI where available, webhook-based entitlement grant. State machine created→pending→paid→active, failed→retry, canceled→nonrenew, refunded/chargeback→policy; duplicate callbacks idempotent. Subscription renewal notification and one-step cancellation. Receipt/invoice download, payment method changes, proration and dispute handling.

## Add-ons
Optional consented curated activity (actual venue/event organizer and fee), human-assisted introduction for matrimonially oriented members (real assigned trained staff and contract), optional real ID review (legitimate provider, transparent privacy cost) only after legal/merchant approval. Add-ons are not substitutes for basic safety.

## Acceptance
Free member sees and can accept eligible matches in all enabled modes. Paid member does not unlock secret high match. Full user journey: start plan, provider failure, webhook duplicate, receipt, upgrade, downgrade, renewal, partial refund, chargeback, nonrenewal and membership expiration with no orphan access. Tax/accountant signoff before launch.
