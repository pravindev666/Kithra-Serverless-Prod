# SECURITY-RD — Threat Model, Authentication, Privacy and Release Controls

## Assurance target
Use OWASP ASVS 5.0 Level 2 as baseline, with elevated controls where intimate data, staff powers and sensitive disclosures create higher impact. This is an engineering target, NOT a security certification. Threat-model at least: account takeover, romance scams, extortion, stalkers, domestic abuse, minors, re-identification, covert trait profiling, media metadata leakage, harassment, shared-device privacy, report weaponization, billing fraud, insider misuse, supply-chain compromise, OAuth redirect abuse and cloud credentials exposure.

## Identity
Member signup: verified email/password or Google. Firebase Auth signs in; Workers/Node validate ID tokens via published keys/server SDK and enforce app session and mode policy. Phone OTP is optional, rate limited and cost metered. Admin MFA is mandatory: **base Firebase Auth does not automatically include MFA**; either upgrade Firebase Auth with Identity Platform (priced separately) or choose a proven MFA-capable OIDC provider. Admin route separated on a subdomain, login restricted to provisioned staff IDs/allowlist and required MFA; never accept any fixed 6-digit code or any non-empty password. Admin password alone is inadequate.

## Authorization
Policy `allow(actor,action,resource,context)` with `actor.member/admin`; mode consent/active status, adult state, target block and ownership gates, staff role, case scope/expiry, step-up assurance; deny by default. Backend checks for every route/object, including derived thumbnail URLs, WebSockets and queues. Create permission test matrix including horizontal IDOR, role escalation, cross-mode, removed-user and blocked-user access. UI hidden controls do not enforce authorization.

## Sensitive data and media
Raw quiz answers are sensitive by context and restricted even when not statutory special category. Separate member profile fields from assessment truth; encrypted transit and storage, field-level confidentiality by purpose, no raw answers in logs/analytics/ad networks; least-retention. R2 private, signed, time-limited access; metadata strip, provider scan, approved derivatives; force media delete (and cache invalidation) on policy decision. Don't promise screenshots can be prevented or that TLS means E2EE.

## Moderation and safety
Safety flows are permanently available free: block, report, mute, appeals, crisis/safety link, data controls. Safety case records have status SLA with urgency, assigned reviewer, actor, action reason, evidence pointers and retention class. CSAM pathway segregated, reporting obligations and provider rules verified by counsel. Anti-spam abuse control combines rate limits, device/account patterns under privacy rule, contact request throttles and human escalation; appeals for incorrect action. Never create a covert "predicted sexuality" field.

## Security implementation controls
CSRF (for cookie writes), CSP, HSTS, strict transport, secure cookies with SameSite, rate limiting and bot defense, password reset token expiry, OAuth state/nonce, no inline tokens in URL logs, secret vault/rotation, provenance and SBOM, dependency and SAST scans, TLS pinning only where appropriate, encrypted backup and restore procedure. Record unauthorized access attempts without exposing personal text. Hash-chain audit optional only when real chain verification/immutability is implemented.

## Incident management
Define severity, responder and regional on-call, containment checklist, preservation of evidence, restore, user comms and regulator reporting decision. CERT-In six-hour categories when applicable; DPDP staged breach duties; actual timelines verified before deployment. Threat-model and incident rehearsal are signoff deliverables. Production cannot accept real intimate data with fake deletion, mocked moderation or admin without MFA.
