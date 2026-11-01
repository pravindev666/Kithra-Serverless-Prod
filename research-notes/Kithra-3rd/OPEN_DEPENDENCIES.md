# KITHRA 2026 — OPEN EXTERNAL DEPENDENCIES & HUMAN SIGN-OFF GATES

Per `00_READ_FIRST/MASTER_CONTROL_SPEC.md` §12 and `11_AI_STUDIO/RESEARCH_GAPS_AND_SIGNOFFS.md`, the following external validations and human sign-offs cannot be fabricated by code and remain explicit release gates:

| ID | Dependency / Sign-Off Gate | Owner | Current Status | Go / No-Go Effect |
|---|---|---|---|---|
| **DEP-01** | **Founder Brand Palette Freeze (`D2` vs `D5` vs `D1`)** | Founder / Design Lead | **PROVISIONAL (`D2 Ink & Clay` default; `D5` & `D1` live in UI switcher)** | Required before freezing marketing assets; app supports instant token swap. |
| **DEP-02** | **Psychometric Instrument & Weight Validation** | Behavioral Science Reviewer | **DRAFT PLACEHOLDERS (`v1.2-draft`)** | Items carry `"Draft item — shown for illustration only"` badge until reviewed. |
| **DEP-03** | **Legal Counsel Review (India DPDP 2025/2027, IT Rules 2026, GDPR)** | Qualified Legal Counsel | **DRAFT SCAFFOLD** | Required before accepting production personal data in each launch jurisdiction. |
| **DEP-04** | **Enterprise Staff MFA Provider (Firebase Identity Platform / OIDC)** | Security / Infra Lead | **SANDBOX / SIMULATED GATE** | Base Firebase Auth lacks enterprise MFA; upgrade or OIDC provider required before prod staff access. |
| **DEP-05** | **Payment Merchant & Tax/GST Sign-Off (Razorpay / Stripe)** | Finance Lead / Chartered Accountant | **PROVISIONAL HYPOTHESIS (`₹0 / ₹149 / ₹249`)** | Prices and GST/VAT treatment are hypotheses (`BILLING_RD_Unified_Pricing.md`); live checkout requires signed webhooks. |
| **DEP-06** | **Identity / Age Verification Provider Contract** | Trust & Safety / Legal | **DISABLED / LABELLED UNAVAILABLE** | Per `PHOTO_MEDIA_SYSTEM.md` §5, no fake "Government ID Verified" badge is claimed without a live contracted provider. |
| **DEP-07** | **Consented Editorial Photography Releases** | Brand / Legal | **ILLUSTRATIVE PLACEHOLDERS** | All preview imagery is explicitly captioned `Illustrative image` until model releases are filed. |
| **DEP-08** | **Native Linguistic & Cultural Review (`HI`, `TA`, `TE`, `ML`, `KN`, `BN`)** | Localization Reviewers | **EN BASELINE + HI/TA UI PREVIEW** | Full 2,400-item translations require human linguistic & cultural equivalence sign-off. |
| **DEP-09** | **On-Call Trust & Safety Staffing & Grievance Officer Mailbox** | Operations Lead | **RUNBOOK DEFINED (`OPS_RD_Runbooks.md`)** | Real human responders must staff urgent safety & statutory grievance queues prior to public launch. |
| **DEP-10** | **Production Cloud Credentials (Cloudflare D1/R2/DO & Managed Postgres/Redis)** | DevOps / SRE | **LOCAL & ADAPTER PARITY TESTED** | Production deployment requires target Cloudflare account bindings and server secrets injected via CI. |

