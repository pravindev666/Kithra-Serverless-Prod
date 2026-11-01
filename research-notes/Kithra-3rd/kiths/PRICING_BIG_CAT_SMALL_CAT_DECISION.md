# PRICING: THE BIG-CAT / SMALL-CAT DECISION

**Question put to this team:** *Are three mode-based subscription paywalls an
unnecessary "big cat / small cat" architecture? What unified or alternative
pricing architecture is fair and commercially plausible?*

**Short answer:** Yes — three mode-gated subscriptions are an artificial
architecture, and the kit's own "Matrimony Intent ₹399" tier is exactly the
"big door for the big cat" the founder warned against. Recommend
**Architecture C: one unified core membership (Free / Plus / Connect) plus
optional, genuinely-costly add-on services**, with **safety, discovery and
post-consent chat free forever**.

**Evidence:** founder discussion §7 (rejects three silos); r/match and
r/OnlineDating paywall resentment (T4); r/UX design critique of pink/gendered
defaults (T4); Bumble BFF's explicit "no paywalls" positioning (T1 store);
FTC 2022 on dark patterns (T1); Cloudflare/Razorpay vendor pricing (T1).

---

## 1. The four architectures, tested

| Arch | Shape | Fairness | Commercial | Verdict |
|---|---|---|---|---|
| **A** | 3 independent mode subscriptions | ✗ Punishes intent change; a person who starts as friend then dates must pay twice | Modest but punitive; churn on intent change | **REJECT** |
| **B** | 1 unified Free/Plus/Connect across modes | ✓ One door; intent-neutral | Good; simpler billing | **STRONG** |
| **C** | Unified core + optional costly add-ons (human-assisted, curated events, verification) | ✓✓ Pay only for real marginal cost | Best long-run; add-ons can be expensive because they *are* expensive | **RECOMMEND** |
| **D** | Free core + community/service purchases only | ✓✓ No subscription at all | Weak ARPU; hard to fund moderation | **HOLD as fallback** |

**A is rejected** because it structurally recreates the big/small door: the
matrimony-seeker pays most for "the big door", the friend pays least for "the
small door", and the product implies *worth tiers* on a human's intent —
exactly what the founder said to avoid.

---

## 2. Recommended architecture (C), in INR

> All numbers **illustrative and unvalidated**; must be tested with real
> willingness-to-pay (see thresholds in `09_VALIDATION/`). Tax handling must be
> confirmed by an accountant before publishing.

| Plan | Monthly | 3 mo | 6 mo | 12 mo | Covers |
|---|---|---|---|---|---|
| **Free** | ₹0 | ₹0 | ₹0 | ₹0 | Assessments, discovery, **blocking/reporting**, **post-consent chat**, Circles, data rights |
| **Plus** | ₹149 | ₹399 | ₹749 | ₹1,399 | Richer explanations, advanced filters, higher intro allowance |
| **Connect** | ₹249 | ₹699 | ₹1,299 | ₹2,399 | Everything in Plus + compare tools, curated Circles, insights |
| Add-on: **Verified badge review** | ₹99 one-off | — | — | — | Only if a real verification service is running |
| Add-on: **Human-assisted introduction (matrimony)** | per-service | — | — | — | Only when staffed; priced at real cost + margin |
| Add-on: **Curated real-world activity** | per-event | — | — | — | Cost-recovery pricing |

**Mode is not a price axis.** A member on Plus gets Plus entitlements in
whichever modes they have enabled. This is the direct answer to the
"big cat / small cat" criticism.

### PPP-sensitive international indicative pricing (not FX conversion)
| Market band | Plus equiv./mo | Rationale |
|---|---|---|
| India | ₹149 | Local norm |
| South/Southeast Asia (lower band) | ~₹199–249 equiv | Slightly higher |
| EU/UK | ~€7–9 | Purchasing-power, not ₹×rate |
| US/CA | ~$8–10 | Same logic |

> These bands are **proposals**, explicitly *not* derived by currency
> conversion, and require local research.

---

## 3. Entitlement matrix (core)

See `ENTITLEMENT_MATRIX.csv` for the full machine-readable grid. Governing rules:

1. **Safety is never sold.** Block, report, mute, appeals, data export and
   deletion are free at every tier and every mode.
2. **Discovery is never gated on quality.** Free members see eligible matches;
   premium affects *convenience/filters/explanations*, not *who is visible*.
3. **No selling the perfect match.** A high-agreement pair is never hidden
   behind a paywall.
4. **Post-consent chat is free** (mutual request accepted ⇒ chat allowed) for a
   baseline allowance; premium raises *rate/limits*, not the *right* to reply.
5. **No auto-renew ambiguity.** Price, renewal date and cancel button are
   shown on the same screen and in one step.
6. **No countdown timers, no fake discounts** (FTC 2022).

---

## 4. Scale scenarios (registered / active / paying)

Model **distinctly**: registered ≠ verified ≠ MAU ≠ paying. AI inference cost is
explicitly **₹0** (deterministic engine).

| Registered | MAU (30%) | Paying (3% of MAU) | Infra/mo (Cloudflare, indicative) | Notes |
|---|---|---|---|---|
| 100 | 30 | 1 | ~₹0–560 | Free tier viable; D1 <500 MB |
| 500 | 150 | 5 | ~₹560 | Workers Paid floor |
| 1,000 | 300 | 9 | ~₹560–650 | R2 still small |
| 5,000 | 1,500 | 45 | ~₹560–1,000 | The kit's ₹577 example |
| 10,000 | 3,000 | 90 | ~₹600–1,400 | media + DO grow |
| 100,000 | 30,000 | 900 | ~₹8,000–25,000+ | D1 sharding; server parity likely |

**Total company cost is not the infra bill.** Founder salary, moderation,
legal, security and support dominate (kit FIN-RD §5–8). The kit's illustrative
~₹1.26 lakh/mo at 5k includes staff — reproduce with `imputed_founder_cost` in
low/base/high cases.

**Key insight:** because marginal compute is cheap, Kithra can afford a *large
free core* — which is precisely why architecture A (paywalling intent) is
commercially unnecessary *and* unfair.

---

## 5. Sensitivity analysis

| Lever | Low | Base | High | Effect |
|---|---|---|---|---|
| Paying conversion (% MAU) | 1% | 3% | 7% | Linear on revenue |
| ARPPU (₹/mo) | ₹100 | ₹200 | ₹400 | Linear on revenue |
| Payment fee | 2% | 3% | 3.5% | Small |
| Refund rate | 1% | 4% | 10% | Material at scale |
| Moderation cost/ticket | ₹15 | ₹40 | ₹120 | Dominates at scale |
| Founder salary | ₹0 | ₹50k | ₹1L | Dominates break-even |

**Break-even** = paying subscribers whose blended net contribution covers all
fixed + variable cost incl. imputed founder cost. Express with a confidence
interval; do **not** quote a single number.

---

## 6. Recommendation (honest)

1. Ship **C**: free core + unified Plus/Connect + real-cost add-ons.
2. Keep **A dead**: no mode-specific subscription.
3. Hold **D** as a fallback if subscription retention proves poor.
4. Price in **INR** with **PPP-banded** international pricing, never FX copy.
5. Make **cancellation one step** and renewal unambiguous.
6. Re-validate all numbers with 30–50 willingness-to-pay interviews before
   publishing anything commercially.
