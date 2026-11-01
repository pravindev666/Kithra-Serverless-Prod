# FINANCIAL MODEL — COMPUTED SCENARIOS

Companion to `PRICING_BIG_CAT_SMALL_CAT_DECISION.md`. **All figures are
computed** from stated assumptions (see method) and are **illustrative**, not a
forecast. **AI inference cost is ₹0 by construction** (deterministic engine).

---

## 0. Method & assumptions

```
mau                = registered × mu_rate
paying             = mau × conversion
gross              = paying × arppu
payment_fees       = gross × 3%
refunds            = gross × 4%
infrastructure     = mau × ₹1.20        (Cloudflare-scale, blended)
tickets            = (mau/1000) × 8      (support contacts per 1k MAU)
moderation         = tickets × ₹40
total_cost         = infra + moderation + fees + refunds + founder_salary + other_fixed
net                = gross − total_cost
breakeven_paying   = total_cost ÷ arppu
```
Base defaults: founder ₹50,000/mo · other fixed ₹40,000/mo (legal, tooling,
accounting, security reserve) · ARPPU ₹200 · conversion 3% of MAU · MAU = 30%
of registered.

**These are assumptions, not quotes.** Every number must be re-run with real
vendor quotes before an investment decision.

---

## 1. Scale table (computed)

| Registered | MAU (30%) | Paying (3%) | Gross ₹ | Infra ₹ | Moderation ₹ | Total cost ₹ | Net ₹ | Break-even paying subs |
|---|---|---|---|---|---|---|---|---|
| 100 | 30 | 1 | 200 | 36 | 10 | 90,060 | **−89,860** | 450 |
| 500 | 150 | 4 | 800 | 180 | 48 | 90,284 | **−89,484** | 451 |
| 1,000 | 300 | 9 | 1,800 | 360 | 96 | 90,582 | **−88,782** | 453 |
| 5,000 | 1,500 | 45 | 9,000 | 1,800 | 480 | 92,910 | **−83,910** | 465 |
| 10,000 | 3,000 | 90 | 18,000 | 3,600 | 960 | 95,820 | **−77,820** | 479 |
| 100,000 | 30,000 | 900 | 180,000 | 36,000 | 9,600 | 148,200 | **+31,800** | 741 |

### 🔴 The honest headline

**At every scale below ~100,000 registrations the business loses money under
these assumptions.** Infrastructure is trivial (₹36–36,000); **staff, moderation
and fixed costs dominate.** The kit's `₹577/month Cloudflare` figure is real —
and almost entirely irrelevant to viability.

**Break-even needs roughly 450–750 paying subscribers**, which is
**10–30× more than 10,000 registrations produce at 3% conversion of MAU.**

---

## 2. Sensitivity at 10,000 registered (computed)

| Conversion | ARPPU | Gross ₹ | Total ₹ | Net ₹ | Break-even paying |
|---|---|---|---|---|---|
| 1% | ₹100 | 3,000 | 94,770 | −91,770 | 948 |
| 1% | ₹200 | 6,000 | 94,980 | −88,980 | 475 |
| 1% | ₹400 | 12,000 | 95,400 | −83,400 | 239 |
| 3% | ₹100 | 9,000 | 95,190 | −86,190 | 952 |
| 3% | ₹200 | 18,000 | 95,820 | −77,820 | 479 |
| 3% | ₹400 | 36,000 | 97,080 | −61,080 | 243 |
| 7% | ₹100 | 21,000 | 96,030 | −75,030 | 960 |
| 7% | ₹200 | 42,000 | 97,500 | −55,500 | 488 |
| 7% | ₹400 | 84,000 | 100,440 | −16,440 | 251 |

**Finding:** **ARPPU matters more than conversion** at this cost structure.
Doubling ARPPU (₹200→₹400) roughly halves the break-even subscriber count;
doubling conversion does not, because fixed cost dominates.

## 3. Founder salary sensitivity at 5,000 registered (computed)

| Founder salary | Total cost ₹ | Net ₹ |
|---|---|---|
| ₹0 | 42,910 | **−33,910** |
| ₹25,000 | 67,910 | **−58,910** |
| ₹50,000 | 92,910 | **−83,910** |
| ₹1,00,000 | 1,42,910 | **−1,33,910** |

Even at **zero founder pay**, the base-case loss at 5,000 registered is
≈₹34,000/month — i.e. the product is a **funded/loss-making operation until it
reaches meaningful paying density**.

---

## 4. What this means for pricing architecture

1. **The "big cat / small cat" doors don't fix the economics** — they only add
   friction. Revenue comes from *scale and ARPPU*, not from gating intent.
2. **Because marginal compute is ~₹0**, a large **free core is affordable and
   strategically correct** — it lowers acquisition cost, which is the binding
   constraint.
3. **The expensive parts are human** (moderation, support, legal, safety). That
   is exactly where **add-on services** should be priced — matching cost to
   price signals fairness and funds the operation.
4. **Realistic funding posture:** treat this as a subsidised trust-building
   operation through the pilot cohorts; do not model subscriptions as the
   primary early revenue.

---

## 5. Cloudflare vs server (qualitative, no firm quotes)

| Factor | Cloudflare | Docker/Node/Postgres |
|---|---|---|
| Infra ₹ at 5k reg | ~₹560–1,000 | VPS ~₹2,000–4,000+ |
| Ops burden | low | **higher** (Jenkins, PITR, patching, on-call) |
| Portability | D1 500 MB/db ceiling forces sharding early | no ceiling; more control |
| Staff cost | lower | **higher** — dominates the comparison |

**Decision:** Cloudflare-first is cheaper *because it needs fewer human hours*,
not because compute is free. Postgres parity remains the escape hatch at
D1-ceiling scale.

---

## 6. Break-even policy (honest)

- Break-even is expressed as **paying subscribers** with a confidence interval,
  never a single point estimate.
- Include `imputed_founder_cost` so "profit" is not a salary-free illusion.
- Re-run quarterly with real vendor quotes, real refund rate and real
  moderation cost per ticket — the last is the largest unknown.
