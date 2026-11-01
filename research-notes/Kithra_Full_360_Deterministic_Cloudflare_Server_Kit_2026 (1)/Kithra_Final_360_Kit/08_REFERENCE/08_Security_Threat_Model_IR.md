> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# Security-RD — Threat Model, Control Requirements, Incident Response

## 1. Highest-value assets
Real identities, addresses/regions, psychological responses, inferred traits, preferences across friendship/dating/matrimony, private messages, reports, intimate media, payment entitlements, administrator tools and security evidence. Breaches may cause stalking, coercion, discrimination, extortion or reputational harm: classify assessment data as highly confidential even where statute classifications differ.

## 2. Trust boundaries and critical threats
- Browser → API: JWT theft, CSRF/cookie misuse, forged identities, IDOR/BOLA, object injection, credential stuffing.
- User → matching pool: profile scraping, mass requests, catfishing, minors, harassment, hidden dating solicitation, deanonymization through score queries.
- Chat/groups → moderators: unsolicited sexual content, grooming, fraud, deepfakes, unlawful media, violent threats, doxxing; malicious report floods.
- Workers → D1/R2/DO: public object URLs, malformed SQL, stale permissions, insecure signed upload, message replay, unbounded cost.
- Payments → entitlements: webhook forgery, duplicate callbacks, stale subscription/grant, refunds not reflected, client-side checkout tampering.
- Admin → private data: insider overreach, mass export, privilege escalation, stolen admin session, unsupported account intervention, audit modification.
- AI/model → data: model prompt injection, exfiltration to third-party API, memorization, discriminatory profiling, unverified trait reconstruction.

## 3. Mandatory controls (MUST)
- **Auth:** Firebase verified JWT server-side, email verification, rotation/revocation model, rate limits, password recovery, admin MFA. Eliminate mock OTP/password gate entirely.
- **Authorization:** deny-by-default per action + object, persona/mode boundary; OWASP ASVS 5.0 controls; automated cross-tenant IDOR tests.
- **Admin:** invitation-only authorized identity, device/session policies, no solely client-side role checks, dual approval for mass data export/role grant/permanent ban; comprehensive append-only audit.
- **PII encryption:** TLS, service-managed encryption at rest plus envelope/field-level protection for raw answers, derived sensitive traits and report evidence; keys rotated via secrets management, access recorded; cache plaintext only transiently.
- **Messaging:** choose candid **server-accessible encrypted-at-rest messaging** for moderation-capable early internal delivery phase and inform users. End-to-end encryption is later optional and requires a separate safety design and real cryptographic implementation; no "Signal" badge by analogy.
- **Uploads:** only allowlisted MIME+magic bytes, randomized opaque object key, antivirus scanning, stripping dangerous EXIF where appropriate, size/quota cap, thumbnail generation only in approved pipeline, signed downloads, no direct public media bucket.
- **Abuse controls:** rate limit login/OTP/introductions/chat/uploads; slow mode for new accounts; bot challenge after anomaly; confidence-based trust review without public social scores.
- **Logging:** redact answers, secrets, tokens, private message bodies, government IDs and exact region; append audit state transitions, correlation ID and actor.
- **Data rights:** deletion propagation to DB, caches, R2, queues, exports and analytics with retained-lawful-hold exception; backups lifecycle and expiry policy.
- **Supply chain:** dependency scanning, lockfile pinning, secret scanning, IaC review, signed deploy artifacts, minimal service accounts, staging/prod key segregation.

## 4. Security test cases
S12 malicious question text or user-provided content must never trigger data-modifying commands or unsafe rendering.

## 5. Incident severity / response
- **SEV-0:** active intimate-data exfiltration, large breach, child exploitation emergency, confirmed admin compromise; immediate containment/on-call and counsel/regulatory escalation.
- **SEV-1:** credible severe harassment/stalking threat, major auth bypass, payment compromise; urgent investigator assignment and targeted protective suspension.
- **SEV-2:** user data export issue, moderate service disruption, repeated abusive content; bounded SLA, remediation and lessons learned.
- **SEV-3:** cosmetic defects, low severity false positives; planned fix.

Response sequence: detect → open case and immutable timeline → contain accounts/keys/routes → preserve needed evidence lawfully → assess impact and notification obligations → remediate → restore → validate → postmortem. Run tabletop exercises before launch. **CERT-In reportable incidents can trigger six-hour reporting**; future DPDP Rule 7 can require without-delay affected-person/Board notice plus a 72h detailed Board report; exact current effective dates and jurisdiction confirmed with counsel. Prewrite templates in admin console, never auto-send inaccurate claims.

## 6. Safety-policy fundamentals
Prohibit threats, fraud, impersonation, minors, nonconsensual intimate imagery, doxxing, stalking, sexual pressure after an explicit boundary, solicitation of money, hate/harassment and cheating/forced matrimonial practices where unlawful. Offer in-product block/report at all conversation touchpoints; optional mutual silence modes. Know limitations of self-report "verified" badge. For urgent threats present local emergency services instructions; Kithra is not a 24/7 emergency responder unless it truly staffs one.

## 7. Before launch sign-off
Independent application penetration test including admin, chat, D1 object IDOR and payment callbacks; evidence of restore drill; provider data processing contracts, admin permission audit, encryption key handling documentation, secure secret rotation, privacy impact assessment, live incident contacts and clear public security claims.
