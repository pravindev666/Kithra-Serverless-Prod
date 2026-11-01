> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Compliance-RD / PIA — India Data Protection, Platform Operations & Legal Readiness

**As of 1 November 2026. Legal drafting aid only; not legal advice or legal immunity.** India-specific status must be reverified immediately before launch. The platform cannot contract out of statutory duties. Build policies and controls around actual deployment and actual corporate entity.

## 1. Timeline you must not confuse
- **DPDP Act, 2023** notified staged commencement on **13 November 2025** under G.S.R. 843(E). Initial institutional/other provisions commenced then.
- Provisions scheduled **13 November 2026**: one-year items including Act s6(9) and specified rule(s) regarding consent managers. This does not itself force every ordinary startup to register as a consent manager.
- Major substantive processing/rights/security/breach provisions scheduled **13 May 2027** (18 months from 13 November 2025) under Act and DPDP Rules, 2025, G.S.R. 846(E). Compliance program should be ready before that date, not deferred until after.
- Existing **IT Act / 2011 SPDI rules**, where applicable, cover sensitive personal data categories including sexual orientation and mental health; exact transitional status/overlap requires counsel.
- **IT Intermediary Guidelines 2021 as amended 2026**, including February 2026 corrigendum, may govern Kithra if it qualifies as an intermediary hosting user content. Duties differ by classification and facts; do not label every platform a "significant social media intermediary" without threshold analysis.
- **CERT-In Directions dated 28 April 2022:** report specified cyber incidents within 6 hours, with additional requirements for certain entities/logs and applicable retention; implement reporting readiness. Other legal obligations may apply (consumer protection, payments, intellectual property, Indian criminal laws regarding stalking, obscenity, impersonation, dowry, etc.).
- **Consumer Protection (E-Commerce) Amendment Rules 2026**, as announced 10 September 2026, have an intended 1 January 2027 start; scope/application to Kithra subscriptions must be assessed.

## 2. Primary official evidence
DPDP commencement Gazette: https://egazette.gov.in/WriteReadData/2025/267647.pdf ; DPDP Rules text indexed: https://indiacode.ecourtsindia.com/rules/digital-personal-data-protection-dpdp-rules-2025-fe07b131/ ; MeitY/PIB explanatory release: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014 ; Consolidated IT Intermediary 2026: https://master-meity.digifootprint.gov.in/documents/act-and-policies/information-technology-intermediary-guidelines-and-digital-media-ethics-code-rules-2021-it-rules-2021-IjM5QjMtQWa ; CERT-In https://www.cert-in.org.in/Directions70B.jsp ; E-commerce updates: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2308759 .

## 3. Privacy impact assessment: map every processing purpose

| Collection | Purpose | Access | Sharing | Default retention idea (NOT legal conclusion) |
|---|---|---|---|---|
| Email, provider UID | account and recovery | identity service + restricted support | Firebase and transactional provider | while account + lawful records |
| Adult age confirmation | enforce 18+ enrollment | automated safety | no public display | minimum evidence necessary |
| Mode-specific display profile | chosen discovery | matched viewers per field policy | consented other users | active mode + deletion grace |
| Quiz raw answers | derive assessments | scoring service only | **never by default to another user** | until purpose fulfilled/withdrawal + lawful holds |
| Derived traits/model scores | matching | scoring service and owner | consented trait summaries only | current version; retire superseded snapshots |
| Exact location | not required for early internal delivery phase | none | none | **do not collect** |
| City/region | local relevance | discovery service | coarse region if opted in | mode active |
| Chat messages | agreed correspondence, abuse evidence | participants; limited escalation staff | participants / specific legal process | published configurable schedule |
| Reports and case evidence | safety grievance, lawful evidence | assigned moderation team | required authorities where applicable | proportionate incident retention |
| Device/IP/rate-limit data | anti-fraud and security | security staff | hosting providers | necessity-based; counsel-reviewed |
| Subscription references | billing/legal audit | finance support | payment gateway | tax/accounting legal minimum |
| AI persona training | **off by default** | none until opt-in | approved processor only | separately documented, revocable |

## 4. DPDP control-by-control rollout
**Notice** clear, accessible, standalone explanation of personal data and purpose before consent; multilingual/localized variants and link to rights/contact. **Consent** freely given, specific, informed, unambiguous affirmative action; separate from T&C and granular by mode/quiz, AI, notifications, public trait sharing; withdrawal as easy as giving consent. **Purpose limitation** no resale of quiz answers to advertisers or covert inference. **Data minimization** no mandatory religion/caste/sexuality details or biometric scans for friendship, no hidden classifier. **Accuracy and rights** allow editing and complaint handling; score recomputation when changed. **Security** measures per Rule 6, including encryption, access, monitoring, backups, vendor contracts and appropriate logs. **Breach** draft ready-made notices and decision tree for Rule 7 from its effective date: notify affected individuals/Board without delay, detailed Board information within 72h unless extended; CERT-In separately as applicable. **Children** begin 18+; consider proportionate age assurance and a response procedure when minor detected; if minors allowed later, parent-consent and restrictions substantially increase complexity. **Retention** document schedules and apply applicable Rule 8 statutory retention/erasure provisions, with potential lawful holds and back-up limits. **International processors** keep data maps and contract protections; legal restrictions and transfers are jurisdiction- and future-notification-sensitive.

## 5. Sensitive inference: special design rule
Do **not** covertly infer sexual orientation, mental health, religion or comparable intimate categories from innocuous answers. Assessment data can be sensitive even when no inferred label is displayed. Kithra uses deterministic, versioned rule-based behavioral profiles, not AI.

## 6. Intermediary / user-generated content duties
Counsel must classify whether/how Rule 3 obligations apply, establish grievance officer details where required, operational routes for unlawful-content orders and notices, complaint SLAs by category under amended law, evidence preservation only as permitted/required, user policies, periodic updates and appeals. Internal proposed targets deliberately stricter than needed until confirmed: **acknowledge grievances within 24h**, general resolution **≤7 days**, specialized takedown **≤36h**, intimate-image/impersonation **≤2h when provision applies**. These are contingent category timelines; do not promise all tickets a two-hour resolution. Escalate severe child safety and imminent threats urgently irrespective of user plan.

## 7. Identity and matrimonial responsibility
Kithra is NOT a licensed match guarantee, a clinical diagnosis provider or a marriage registrar. State plainly that members' claims are self-reported unless independently verified. Do not indiscriminately demand Aadhaar or store government ID scans. Marriage eligibility (age, current marital status, individual consent, permitted age/legal limits, prohibited relationships) requires carefully worded declarations and potentially documentary review with consent and counsel, never an algorithmic guarantee. Do not allow family profiles to control adults without the adult's authorization, or publish protected characteristics in discriminatory hierarchies.

## 8. Payments and consumer rights
Show complete price, GST/taxes and renewal terms before payment; explicit auto-renew consent where applicable; easily accessible cancellation and refund policy; no dark patterns (prechecked renewal/hidden terms); actual payment processor handles cards/UPI; invoices and dispute records; respond to grievances and charges fairly. Merchant/provider policies and RBI card/UPI e-mandate requirements can change; confirm with provider before publishing pricing.

## 9. Privacy risk scoring (illustrative)

| Risk | Impact | Likelihood if uncontrolled | Mitigation and owner |
|---|---|---|---|
| Raw quiz response leak | Critical | high in insecure prototype | encrypt, access checks, vault, security lead |
| Admin insider profiling | Critical | medium | per-case access, dual approval, audit |
| Stalking through discovery | High | medium/high | coarse location, blocking, ratelimits, safety owner |
| Involuntary orientation inference | Critical | high if designed | ban hidden inference, consent review, privacy lead |
| Matrimony coercion/fraud | High | medium | separate mode, reporting, warnings, human moderation |
| Fake user verification claims | High | high in prototype | remove false UI badges, truthful statements |
| Payment/renewal complaints | Medium | medium | webhooks/reconciliation, visible cancellation |

## 10. Launch compliance checklist with evidence
- [ ] Legal entity name, registered address, official grievance/business contacts and principal controller established.
- [ ] Counsel-signed data map, current-law applicability, DPDP launch-gap register, vendor contracts and international transfer review.
- [ ] Per-mode/quiz consent versioning and logs tested; default most-private settings.
- [ ] Privacy/T&C/community/payment/refund/cookie notices reviewed, versions recorded and localized.
- [ ] Data export, correction, withdrawal, deletion and retention-hold workflows function end-to-end.
- [ ] No hidden trait inference, fabricated claims, unauthorized media publication or unmoderated public stranger chat.
- [ ] Moderator staff availability, emergency escalation, grievance processes and appeal paths staffed/tested.
- [ ] Threat model, pentest, incident tabletop, backups and recovery drills completed.
- [ ] Payment gateway and e-mandate technical/legal verification; actual cancellation and invoices tested.
- [ ] All vendor and cloud free-tier limits reviewed for release date; alert budget and failure responses configured.

## 11. Counsel decision log to complete
C01 intermediary status and significant threshold; C02 scope of 2011 SPDI rules and DPDP transition; C03 consent design for assessment/matching modes; C04 retention + compelled disclosure policy; C05 moderation response duties; C06 cross-border data transfer/cloud hosting; C07 matrimony representation and minimum age checks; C08 tax/invoice and renewals; C09 synthetic-avatar handling under 2026 IT Rules; C10 user-generated media safety and law-enforcement protocol. Each requires owner, date, written opinion and revised product behavior.
