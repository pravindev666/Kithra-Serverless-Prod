# KITHRA — ADMIN, SECURITY, INDIA COMPLIANCE & POLICY HANDOVER
Version 3.0 | 1 November 2026 | Draft requirements, not final legal advice.

## 1. Principles
Kithra handles voluntarily disclosed intimate values, behavior patterns, preferences, photos, private correspondence and possible matrimonial expectations. Minimum acceptable design is *least collection, least visibility, least privilege, demonstrable consent, reliable reporting and verified deletion*. Never describe the policies as “airtight against Indian laws”: compliance requires organizational processes, actual implementation and ongoing review. The person behind the account controls public visibility and each relationship mode; a family member does not automatically acquire access.

## 2. Role-based administration
| Role | Purpose | Default permissions |
|---|---|---|
| Platform owner | legal/accountability administration | staff roster and policy oversight; no default raw assessment reading |
| Security lead | threat/incident response | security events, credential resets, emergency suspensions; no browsing |
| Trust & safety lead | high-risk escalation | escalations, case decisions, staffed evidence access |
| Moderator | user report triage | assigned redacted cases; warn/restrict within policy |
| Support agent | user help and appeals intake | tickets, account state labels, no raw messages by default |
| Privacy officer | exports, deletions, consent issues | privacy workflows and limited compliance evidence |
| Finance operator | payments/refunds/chargebacks | ledger access, scoped refund limits, no quiz content |
| Research reviewer | question bank and scoring-method review | anonymized/consented aggregates, immutable versions |
| Community operator | Circles and event review | circle moderation within assignment |
| Auditor | control evidence | read-only audit and de-identified metrics |
| Infrastructure operator | deployment and service health | no member-content read by default |

Permission namespace examples: `cases.list`, `cases.assign`, `cases.evidence.read_redacted`, `cases.evidence.read_sensitive`, `cases.action.warn`, `cases.action.suspend`, `cases.action.permanent_ban`, `staff.invite`, `staff.role.grant`, `privacy.export.approve`, `privacy.delete.execute`, `billing.refund.limited`, `billing.refund.high_value`, `questionnaire.publish`, `matching.release`, `audit.read`, `infra.deploy`. All default deny. Scope membership by queue, geography where lawful, mode, and incident ID. Grant sensitive evidence JIT with supervisor approval, automatic expiry and purpose record. Role assignments require 2-person approval for critical permissions. Terminate staff permissions immediately on offboarding, rotate credentials and review access quarterly.

## 3. Admin entry and session workflow
`admin.<yourdomain>` only for provisioned staff, with verified approved staff email, password and mandatory MFA; second factor policy should prefer phishing-resistant methods where supported. Firebase authentication validates ID; the server then checks staff account, role grant, status, session risk and scope. `@kithra...` domain allowlist alone is insufficient, and a URL secret is NOT authentication. Optional Cloudflare Access policy provides another perimeter. Idle/absolute timeouts, privileged-action reauthentication, session audit, device/IP anomaly review, CSRF protection, no public admin signup. Staff UI displays explicit production environment indicator.

## 4. User and admin operational flows
**Abuse report intake:** create immutable case ID; capture reporting reason, person ID, mode and allowed evidence; automatically apply high-harm triage; acknowledge submission with ticket number and safety guidance; assign moderator by skill and SLA; preserve reporter's privacy. Avoid telling the reported user who reported them. Adverse actions require policy reason, affected data, actor and time, notification/appeal policy and audit record.
**High priority cases:** non-consensual intimate imagery, impersonation, threats, stalking, minors and suspected trafficking move to urgent queue. Emergency pathways do not promise a live emergency service; provide public police/emergency resources and documented escalation. Incident timelines must follow legal advice and current IT rules (some complaints are subject to accelerated obligations).
**Appeals:** independent reviewer when possible; cannot be reviewed by original actioning officer for critical cases; structured disposition and outcome notification.
**Privacy rights:** authenticated request -> identity/ownership re-verification proportional to risk -> scope report -> legal hold check -> export/correction/deletion action -> job trace -> confirmation -> follow-up; document exceptions and backups retention. Data subject requests must not force users to call a phone line for normal actions if web self-service is possible.
**Finance:** separate payment intents and settlements; admin may refund only with scoped permission and complete ledger record; dual approval on high-value or suspicious refunds. Operator cannot edit original payment events.
**Questions:** expert-proposed draft -> psychometric reviewer -> privacy review -> translation review -> staging evaluation -> signed publish approval -> version pin -> rollback plan. Never let an ordinary moderator edit scoring keys.

## 5. Admin dashboard detailed KPIs and sidebar
Pages: Overview, Safety live queue, Reports, Appeals, Accounts, Verified profiles, Circles & Events, Case evidence (case-scoped only), Question bank governance, Matching methodology release, Billing/Refunds, Support, Privacy requests, Staff/Roles, SLA dashboards, Audit, Incidents, System health, Storage/Cloud cost, Feature flag governance, Policy & localization versioning.
Dashboard tiles with owner and freshness: open urgent cases; percent within SLA; average/median first human response; reports by mode; recurrence of blocks; privacy export/deletion pending; suspicious auth and payment webhook failure; D1 row-read surge; R2 bytes & operations; chat error rate; subscription cancellations. All metrics should avoid reidentifying small protected cohorts. Design full states: empty, no access, open/assigned/escalated, conflicting action, stale evidence, reauth required, appeal accepted, blocked media, redaction pending, offline read-only.

## 6. India DPDP and intermediary compliance checklist
The Act and final Rules have phased commencement in 2025, 2026 and 2027. From the 13 November 2025 Gazette notification: certain provisions commenced at publication, selected provisions after one year (13 Nov 2026), and central operational duties after eighteen months (13 May 2027), subject to amendment and legal interpretation. As of this document date (1 Nov 2026), 13 Nov 2026 and 13 May 2027 are in the future. **Never wait until a deadline to design controls.** Official references:
- Act commencement notification G.S.R. 843(E): https://egazette.gov.in/WriteReadData/2025/267647.pdf
- DPDP Rules G.S.R. 846(E): https://egazette.gov.in/WriteReadData/2025/267650.pdf
- MeitY DPDP information: https://www.meity.gov.in/
- Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules and 2026 amendment: https://www.meity.gov.in/ ; official Feb 2026 FAQs: https://www.meity.gov.in/static/uploads/2025/10/065b6deb585441b5ccdf8be42502a49c.pdf
- CERT-In directions and FAQs: https://www.cert-in.org.in/Directions70B.jsp

Legal counsel must classify whether Kithra is an intermediary/social media intermediary at its actual scale and features, whether it triggers additional duties, and applicable laws on consumer protection, advertising, child safety, IT Rules, security reporting and tax. Do not assume absence of AI obviates cyber, intermediary or privacy responsibilities. Evolving grievance removal/acknowledgment timelines need review against currently notified rules and platform classification. CERT-In directions can require reporting relevant incidents within 6 hours; establish on-call coverage and evidence preservation. DPDP breach reporting requirements upon their commencement include affected-person notices and board detail within prescribed periods. Identify processor/subprocessor roles for Firebase, Cloudflare, email, payment processor and hosting; update transfer/residency analysis per current law and provider region practices, never promise “stored only in India” without proof.

## 7. Data inventory, purpose, visibility and retention policy requirements
| Class | Purpose | Visibility | Retention policy decision |
|---|---|---|---|
| Identity | login, account security | user and constrained auth staff | account life + justified legal hold |
| Adult age check | eligibility/safety | limited trust staff | minimised evidence; review |
| Mode preferences | candidates and boundaries | consented modes only | withdrawable per mode |
| Raw questionnaire | scoring user-selected construct | user only; very exceptional case-scoped staff | minimal, versioned; configurable deletion |
| Derived pattern | user-selected comparison | scoped to matched context/consent | delete on withdrawal/supersession |
| Message content | mutual messaging, safety report evidence | participants; authorized case access only | stated retention and deletion exceptions |
| Photos | user expression and proof | profile scope set by user | revoked/unpublished/media cache expiry |
| Payments | financial records and consumer rights | finance staff | statutory minimum and legitimate disputes |
| Abuse reports | safety operations | scoped staff; parties per policy | documented schedule & legal holds |
| Admin audit logs | accountability | audit/security roles | tamper-evident practical retention |
| Analytics | operation and product performance | aggregated/anonymized | short, purpose-limited; no sensitive raw answers |
Privacy dashboard displays how each datum is used and where; allow distinct consent withdrawal with revocation propagation to match cache, groups and notifications. Do not use questionnaire answers in advertising targeting. Encryption in transit and at rest, key inventory, safe backup and restoration are mandatory.

## 8. Security threat model and control plan
Risks: signup/OTP bypass, token replay, IDOR of assessment, cross-mode leakage, content scraping, grooming and abuse, unmoderated groups, conversation stalking, unauthorized admin escalation, evidence abuse, malicious attachments, webhook replay, Redis cache leakage, D1 SQL injection, R2 public URL exposure, queue poisoning, secret leakage, SSRF, account deletion gaps, denial of service, price tampering, deployment supply-chain compromise. Controls: server-side authorization checks for each resource, strict DTO schemas, queries parameterized, CSRF/CORS config, rate limits and risk challenges, signed short-lived private object URLs, media type verification/size limits and antivirus pipeline, abuse queue and human staffing, explicit payment ledger and webhook signature replay-store, SAST/DAST/dependency scanning, audit logs, backups and restore drills, secret management, security review before deployment, quarterly access reviews, annual independent penetration testing budget when feasible. Staff cannot access questionnaire answers simply by becoming Super Admin.

## 9. Draft legal-facing content (counsel must localize and approve)
### A. Terms of Service — starting clauses
Kithra is a technology platform that introduces consenting adults based on stated preferences and questionnaire-derived descriptive profiles. The service does not guarantee friendship, romantic compatibility, marriage, identity authenticity or behavior. Users must be adults, may use only the relationship modes they activate, must not harass, impersonate, solicit money fraudulently or disclose others' data without permission. The service may moderate content and restrict accounts following published policies and review/appeal mechanisms. Subscription renewal, cancellation, refund eligibility, grievance contact, consumer remedies, applicable governing law/jurisdiction and company address must be populated with verified details. Arbitration/unilateral disclaimers may not defeat mandatory consumer rights; legal counsel decides enforceability.
### B. Privacy Notice — starting clauses
Identify legal entity and contact, purposes and categories of data (identity, questionnaire answers, derived traits, preferences, photos, messaging, payments, reports, event participation), each processor and retention class, mode-specific sharing controls, optional disclosure limits, rights requests, consents, withdrawal and complaints. Describe scoring truthfully: deterministic questionnaire/data matching; no AI twin, LLM or neural replication. State international transfers only where supported by facts. No hidden inference of intimate characteristics. Specify children's exclusion and age handling. Publish version and material-change notification.
### C. Community Standards — starting clauses
No sexual harassment, threats, hate speech, unwanted sexual content, catfishing, financial scams, coercive family involvement, stalking, distribution of private images, minor participation or misrepresentation of consent; respectful group and offline interaction; easy reporting/blocking; confidential review where possible. Staff can remove or restrict harmful content under policy but cannot promise instant global risk elimination.
### D. Consent snippets — examples
`[ ] I understand that my answers will be used to build my personal behavioral-pattern report. My raw answers are private by default.`
`[ ] I want my Friendship profile to be discoverable by eligible members in Friendship.`
`[ ] I separately want to appear in Dating.`
`[ ] I separately want to appear in Matrimony.`
`[ ] Show selected derived trait explanations to a person after I approve a connection request.`
Never precheck optional boxes. Ask explicit consent only for processing that actually requires consent under current legal classification; separate notices per purpose.
### E. Refund/cancellation
Show plan name, price, tax handling, auto-renewal, next billing date, cancellation effective date, features retained on cancellation, eligibility for statutory refunds and grievance path. Payments must be reconciled and invalid webhooks not honored. No deceptive “lifetime forever” without liability analysis.
### F. Rights and grievance policy
Self-service export/deletion where applicable, identity verification proportionate, retention exceptions, request tracker, grievance officer contact and statutory escalation. Staff training and response time under applicable updated rules. Specific hours/addresses filled with real operational commitments, not invented credentials.

## 10. Evidence and release sign-offs
Attach signed privacy impact assessment, retention table, processor contracts, incident runbook, IT rules applicability memo, accessibility audit, abuse escalation staffing schedule, penetration test remediation list, signed technical release, counsel-approved policies, live contact verification. Release blocker: mocked deletion, fake E2EE, mandatory unreviewed intimate questions, unguarded admin login, no reporting escalation, or unsupported marriage guarantee.
