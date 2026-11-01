# 13 — MEMBERSHIP, PRICING ARCHITECTURE & ETHICAL MONETIZATION UX

## 1. Resolving the "Big Cat / Small Cat" Pricing Problem (`D-07`)

In the canonical research notes (`PRICING_BIG_CAT_SMALL_CAT_DECISION.md` and `FIN_RD`), the founder identified a classic multi-intention pricing trap and solved it with **Isaac Newton's "Big Cat / Small Cat" principle**:
- **The Mistake to Avoid:** Charging separate subscriptions for Friendship (`₹99`), Dating (`₹299`), and Matrimony (`₹999`) forces the user to manage 3 separate bills ("cutting three holes in the door") and makes the product feel greedy and confusing.
- **The Locked Founder Solution (Architecture C — Unified Account Membership + Real-Cost Add-Ons):**
  1. **One Unified Account Subscription** unlocks your tier benefits across **all three intentions (`Friendship`, `Dating`, and `Matrimony`) simultaneously**.
  2. **Zero Paywalls on Core Self-Discovery or Safety:** Taking assessments, discovering your **Personality Pattern Group**, viewing your **My Pattern** blueprint, browsing compatible people, and using all safety/privacy controls (`No-Photo Mode`, `Block`, `Pause`) are **100% free forever**.
  3. **Pay Only for Depth of Connection & Real-Cost Services:** Paid tiers (`Plus` and `Connect`) unlock deeper scenario comparisons, unlimited thoughtful introductions, and full theme-by-theme breakdowns, while **Add-Ons** are strictly limited to services with real external marginal cost (government/live ID verification, human-facilitated introductions, or small-group Circle event tickets).

---

## 2. Canonical Unified Membership Matrix (`Free` / `Plus` / `Connect`)

| Feature / Capability | **Kithra Free (`₹0`)** | **Kithra Plus (`₹149 / mo`)** | **Kithra Connect (`₹249 / mo`)* ** |
|---|---|---|---|
| **Multi-Month Billing Bundles** | Always `₹0` | • **1 Month:** `₹149`<br>• **3 Months:** `₹399` *(Save 11%)*<br>• **6 Months:** `₹749` *(Save 16%)*<br>• **12 Months:** `₹1,399` *(Save 22%)* | • **1 Month:** `₹249` *(or `₹299` per D-07 lock)*<br>• **3 Months:** `₹699`<br>• **6 Months:** `₹1,299`<br>• **12 Months:** `₹2,399` |
| **Intentions Covered** | All 3 (`Friendship`, `Dating`, `Matrimony`) | All 3 (`Friendship`, `Dating`, `Matrimony`) | All 3 (`Friendship`, `Dating`, `Matrimony`) |
| **Self-Discovery & Question Decks** | Full access to 60-second Question Decks, your **Personality Pattern Group**, and **My Pattern** overview | Everything in Free + **Full 12-Chapter Personal Blueprint & Private Reflection Journal** | Everything in Plus + **Printable / Exportable Personal & Pairing Summaries** |
| **Discovery & Folder Browsing** | Browse by **Personality Pattern Groups**, `Shared Ground`, `Healthy Balance`, and `Teamwork Fit` | Everything in Free + **Custom Shortlist Folders** & **Side-by-Side 2-Person Comparison** | Everything in Plus + **Priority filter by specific completed life chapters** |
| **Compatibility Story & Everyday Scenarios** | Level 1 Card Summary + Level 2 **"Why You Fit" Story** (`Echo`, `Counterpoint`, `Mosaic`) + **1 Everyday Scenario Card** | All **4 Everyday Life Scenario Cards** (*Weekend plans*, *Conflict repair*, *Budget*, *Boundaries*) | All 4 Everyday Scenarios + **Level 3 Full Theme-by-Theme Alignment Sheet** |
| **Introductions & Messaging** | **5 thoughtful Introduction Notes / week** + Unlimited replies in accepted chats | **15 thoughtful Introduction Notes / week** + Trait-based Icebreaker chips | **Unlimited thoughtful Introduction Notes** + Read receipts & priority Circle RSVP |
| **Matrimony Family-Safe Summary Link** | Preview 1 sample card | Generate **Read-Only Family Summary Links** (with 7-day expiry & 1-click revoke) | Unlimited Family Summary Links with custom field controls |
| **Circles & Small-Group Gatherings** | Join up to **2 Circles** + participate in weekly prompts | Join **unlimited Circles** + create member reflection threads | Priority RSVP to **12–22 person curated gatherings** |

*\*Note on Decision `FD-03` in `16_FOUNDER_DECISION_REGISTER.md`: `PRICING_BIG_CAT_SMALL_CAT_DECISION.md` sets Connect monthly at `₹249/mo` while `FIN_RD_01` modeled `₹299/mo` (`₹699/3mo`, `₹1,299/6mo`, `₹2,399/12mo` are identical in both). Both options are parameterized in a single config object so the founder can lock `₹249` or `₹299` with one toggle.*

---

## 3. Optional Real-Cost Add-Ons (Never Artificial Microtransactions)

Kithra explicitly rejects predatory dating-app microtransactions (*"Buy 1 Super-Rose for ₹199"*, *"Pay ₹299 to boost your face for 30 minutes"*, *"Pay to unblur who liked you"*). The only optional one-time purchases are services with real operational cost:

| Optional Service | Indicative India Price | Why It Exists |
|---|---|---|
| **1. Fast-Track Live Identity & Credential Verification** | `₹99` (One-time) | Covers third-party KYC / live verification check cost once backend provider is connected |
| **2. Curated Circle Gathering / Workshop Ticket** | `₹199 – ₹499` per event | Covers venue/tea/host cost for in-person or moderated small-table gatherings (`12–22` people) |
| **3. Facilitated Human Introduction (Matrimony / Curated)** | Per-service fee | Optional human-assisted introduction call for members who want guided family/partner facilitation |

---

## 4. Financial Viability & Unit Economics Summary (From `FIN_RD`)

- **Blended Paid ARPPU:** `~₹215.65 / month` (across Plus and Connect multi-month cohorts).
- **Variable Cost per Active User:** Low deterministic compute cost (`<₹1.50/MAU/mo`) because Kithra uses **pure deterministic TypeScript/SQL math** instead of expensive per-message LLM token calls!
- **Simplified Break-Even Target:** **`~31,518 MAU`** (`~105,060` registered users at `7%` blended paid conversion) covers full lean engineering, moderation, and infrastructure overhead (`~₹4.10L/mo` fixed base).

---

## 5. Ethical Billing & Zero-Dark-Pattern Checkout UX (`/pricing` & `/member/membership`)

1. **No Surprise Auto-Renewals:** Every multi-month plan clearly states the renewal date and supports **UPI AutoPay / One-Time Pass** options for Indian consumers who dislike recurring card charges.
2. **True 1-Click Self-Serve Cancellation:** Inside `/member/membership`, clicking **`Cancel plan renewal`** immediately cancels future billing in **1 click** and shows the exact date benefits remain active until—with **zero guilt-trip popups or 5-screen retention mazes**.
3. **Contextual, Respectful Upgrade Prompts:** If a Free member clicks the 2nd Everyday Scenario Card or their 6th weekly Intro Note, a calm inline card explains: *"Unlock all 4 Everyday Scenarios and 15 weekly introductions across Friendship, Dating, and Matrimony with Kithra Plus (₹149/mo)"*—never locking them out of their existing chats or their own personality story.

