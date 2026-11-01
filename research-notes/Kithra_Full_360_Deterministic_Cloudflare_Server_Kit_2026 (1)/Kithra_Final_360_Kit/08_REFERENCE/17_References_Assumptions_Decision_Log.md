> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Evidence Register, Assumptions, Open Decisions & Source Traceability

**Checked:** 1 November 2026. Search results and product/vendor prices may change after that. URLs are starting points; official text and signed legal opinion outrank this report. This register clearly separates primary source evidence, concept ZIP, recommended design decisions and unvalidated assumptions.

## A. Uploaded source evidence
`Kithra-main.zip` extracted and inspected by file path:
- `package.json`: React 19, TypeScript, Vite 8, Tailwind 4, `framer-motion`, `motion`, `@google/genai`, Express dependency. This is the current concept stack, not proof of backend deployment.
- `src/App.tsx`: default mocked psychometric report and matches, stateful view navigation.
- `src/components/AssessmentView.tsx`: localStorage answers and `DEFAULT_REPORT` on completion.
- `src/data/questions.ts`: current template bank with 100 questions distributed over eight domains and ad-hoc weighting; **future question banks are new specification**.
- `src/data/mockMatches.ts`: fictional candidates and percentages.
- `src/components/AuthModal.tsx`: mock six-digit OTP and admin password condition accepting any nonempty value; not secure.
- `src/components/AdminView.tsx`: static sample metrics, verification and navigation tabs.
- `src/components/MessagingView.tsx`: simulated conversation features and unverified encryption imagery.
- `src/components/SecurityView.tsx`: simulated export and misleading E2EE copy.
- `src/components/BillingView.tsx`: plan visual design, not actual payment processing.
- `WORK_DONE.md`: self-described UI work, not independently verified production feature completion.
- `README.md`, `.env.example`: generic app notes and Gemini/APP_URL placeholders; no evidence of functional Worker/D1/R2 infrastructure.
- User-supplied ChatGPT shared link: https://chatgpt.com/share/6ae65881-aae0-83e8-b306-4fc4a1e96887 had a title only and **no readable page lines**; not used as a substantive source.

## B. Official provider technical source links (verified)
1. Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/ — 100k requests/day and 10ms CPU Free; min $5/mo Workers Paid as of check.
2. Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/ — runtime/resource constraints.
3. Cloudflare D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/ — 5M rows read/day, 100k written/day, 5GB total Free storage.
4. Cloudflare D1 limits: https://developers.cloudflare.com/d1/platform/limits/ — **500MB max per database Free**, 10GB paid individual DB.
5. Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/ — 10GB-month Standard free, Class A/B operations.
6. Cloudflare Durable Objects pricing: https://developers.cloudflare.com/durable-objects/platform/pricing/ — SQLite DO Free availability.
7. Cloudflare Queues pricing: https://developers.cloudflare.com/queues/platform/pricing/ — Free 10k ops/day, retention limits.
8. Firebase pricing: https://firebase.google.com/pricing — phone SMS billed, identity billing tiers.
9. Identity Platform pricing: https://cloud.google.com/identity-platform/pricing — Tier 1 first 50k MAU free if using Identity Platform pricing structure; inspect SKU/plan.
10. Firebase server-side token verification: https://firebase.google.com/docs/auth/admin/verify-id-tokens — validate public certificate, issuer/audience/expiry.
11. Supabase pricing: https://supabase.com/pricing — 50k MAU on Free; Free project paused after inactivity, 500MB DB.
12. Supabase JWT: https://supabase.com/docs/guides/auth/jwts — asymmetric JWKS verification.
13. Motion for React: https://motion.dev/docs/react — preferred `motion/react` API.
14. OWASP ASVS 5.0: https://asvs.owasp.org/ — authentication/access control testing baseline.
15. Cloudflare D1 data location: https://developers.cloudflare.com/d1/configuration/data-location/ — default automatic location, jurisdiction controls not an India-localization guarantee.

## C. India laws and official information
1. DPDP Act commencement Gazette G.S.R. 843(E): https://egazette.gov.in/WriteReadData/2025/267647.pdf ; inspected English second page screenshot and text. 13 Nov 2025 initial, 13 Nov 2026 one-year, 13 May 2027 eighteen-month provisions.
2. DPDP Rules 2025 Gazette G.S.R. 846(E), reproduced text: https://indiacode.ecourtsindia.com/rules/digital-personal-data-protection-dpdp-rules-2025-fe07b131/ ; use official eGazette canonical PDF before counsel approval.
3. MeitY DPDP rules overview (PIB): https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014
4. IT Intermediary Guidelines 2021, amended Feb 2026 consolidated MeitY link: https://master-meity.digifootprint.gov.in/documents/act-and-policies/information-technology-intermediary-guidelines-and-digital-media-ethics-code-rules-2021-it-rules-2021-IjM5QjMtQWa
5. 2026 synthetic-media duty overview: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2245053
6. CERT-In directions: https://www.cert-in.org.in/Directions70B.jsp
7. CERT-In 6h FAQs: https://www.cert-in.org.in/PDF/FAQs_on_CyberSecurityDirections_May2022.pdf
8. Consumer Protection e-commerce law portal: https://consumeraffairs.gov.in/pages/consumer-protection-acts
9. Consumer Protection E-Commerce 2026 changes: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308759 — announced effective 1 Jan 2027; ask counsel applicability.

## D. Competitor primary/recent sources
- https://www.we3app.com/how-it-works/ ; https://www.we3app.com/faq/
- https://boo.world/faq ; https://www.dimensional.me/
- https://konvo.space/ ; https://www.okcupid.com/
- https://schmooze.in/ ; https://www.aisle.co/ ; https://www.betterhalf.ai/
- https://www.business-standard.com/companies/start-ups/ai-led-dating-platform-schmooze-raises-4-million-series-a-round-124091701179_1.html
- https://inc42.com/company/trulymadly/financials/

## E. Assumptions needing founder approval
`A08` No AI model, AI twin, LLM inference or hidden neural replication: matching is deterministic and auditable.

## F. Open decisions / decision rights
**Founder:** market segment/launch city, intended modes and rollout order, investment/ads goals, acceptable quiz length, pricing structure, product naming and brand IP. **Psychometrics advisor:** trait constructs, question permissions, scoring, model validation and honest claims. **Counsel:** Indian DPDP/IT Rules, user policies, privacy basis, cross-border, matrimonial obligations, payment/regulatory conditions. **Engineering lead:** Worker data architecture, R2 encryption, JWT verification, DB migration, backups, error budget, app security. **Trust lead:** staffing, report categories, escalation, evidence retention, appeals. **Designer:** user tests, brand, responsive and accessible prototypes. None may unilaterally bypass a legal/safety gate.

## G. Recommendation versus verification
**Verified from ZIP:** UI prototypes and insecure mocked logic. **Verified from public current docs:** provider allowances, regulatory commencement instruments, competitor descriptions and some company-reported metrics. **Recommended architecture:** not implemented or load-tested. **Mathematical examples:** not psychometrically validated. **Pricing and operating costs:** hypothetical; require testing. **Legal drafts:** placeholders; not airtight and cannot substitute legal advice.
