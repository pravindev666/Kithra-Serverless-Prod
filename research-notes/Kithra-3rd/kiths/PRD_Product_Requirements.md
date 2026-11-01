# PRD — Full Product Experience Requirements

## Product form
Responsive PWA-ready web platform; no native-app promise unless native builds commissioned. Desktop, tablet, 320px-wide mobile and low-connectivity journeys. Modes: Friendship / Dating / Matrimony. One account, optional simultaneous activation, separate discoverability. Every screen must have empty/loading/error/unauthorized/offline/success states and safety entry points. See all original 39 member and 24 admin screen descriptions preserved under `13_RESEARCH_ORIGINAL`.

## Complete onboarding and identity journey
Landing > sign-up (email or Google; phone only after billing/verification review) > email verified > adult age gate > accessible notice + mode-specific consent > choose one or more intents > safe profile baseline > optional photo > first sample mini-assessment or explore limited public explanatory demo > full themed assessments at member pace > scoring complete > eligible matching only when reciprocal preferences + minimum coverage permit > connection request > mutual acceptance > messaging > repeat relationship outcomes. Returning user signs in directly, can resume/retake with version pinning, pause a mode without deleting their account, and revoke preferences or request data removal.

## Intent-specific journeys
Friendship: people with compatible interests and schedules, explicit platonic boundaries, Circles and shared activities, safety reminders. Dating: adult mutual preferences, consented identity/orientation filters only if volunteered, boundaries, opt-out. Matrimony: long-horizon values and life goals, no default family access, optional separate consensual family introduction, not caste/religion stereotyping. Changing mode cannot migrate previous photos, intimate answers, messages or profile visibility without explicit confirmation.

## Assessment engine UI requirements
Question catalog organized into 12 versioned themes, each with two 100-question sets reserved as placeholders. Shuffle by seeded, server-issued sequence per session; questions remain auditable by published ID. Support skip, back, save, resume, withdraw, locale and screen-reader. The adversarially resistant design must rely on response-consistency checks, diverse item forms and consented follow-up, not unsupported "AI-proof" claims. Never infer undisclosed intimate traits. No questions published without editorial, psychometric, culture, accessibility and legal reviews. User should not have to finish every set to navigate.

## Personality and discovery
My Patterns: measured dimensions, confidence/coverage, version, date and which areas are not measured. Match lens Echo (similar), Counterpoint (differences), Mosaic Fit (defined complements); compare user profiles only after eligibility checks. Decimal scores may be computed but UI shows coarse bands + explanations; no "100% soulmate". Profiles foreground photos, personal voice (text), common goals, interests and privacy; no mass swipe casino, demographic-worth scores or pressure tactics. Absent local pool → honest empty state + invite/waitlist, no fake profiles.

## Relationship and community
Requests: received/sent/declined/revoked/expired, notification preferences, safe reminders. Messaging: mutual acceptance gate, per-mode thread, reliable send/delivery/read semantics only when supported, attachments after media validation, rate limits, report/block accessible in thread header, no unsupported E2EE claim. Groups/Circles: create/join/request/moderate/leave/owner handover/archive, private/public per approved rules, invites, posts/events and member safety. Group chat moderation evidence must respect legal/consent boundaries.

## Account & commerce
Edit photos/visibility, individual mode pause, accessibility/language, security/password, sessions, consent dashboard, reports/appeals, receipts, subscription management, cancellation/refund, rights center/data export/delete and help/support. Purchase flow displays exact total incl applicable tax, terms, renewal, payment errors, entitlement grant only on verified backend webhook. Cancel in one clear path. Refund/chargeback changes entitlements idempotently and preserves statutory records as needed.

## Staff-facing capability (full contract)
Full staff product includes Overview, Users, Verification, Photos, Reports, Fraud, Evidence, Circles, Question Bank CMS, Score Releases, Support, Refunds, Subscriptions, Staff/RBAC, Privacy Requests, Grievances, Compliance, Audit, Analytics, System Health, Incidents, Feature Flags and Appeals. Every operation is case/time scoped and requires roles and justifications. See `07_ADMIN_OPERATIONS`.

## Notification, accessibility, internationalization
Email/in-app/push only after product/channel consent where required; no spam, default safe privacy. i18n keys not concatenated sentences; RTL capability reserved; timestamps localized, currencies not auto-converted; locale-dependent consent and policy variants; regional font assets selectively loaded. WCAG 2.2 AA, keyboard, screen readers, contrast and explicit reduced-motion.

## Negative requirements
Do not generate chatbots pretending to be users, AI twins, brain-clone models, covert sensitive-trait prediction, fake testimonials, "online now" without evidence, fake OTP, mock payment success, simulated E2EE or high-compatibility paywalls. Admin console is never reachable via a trivial hardcoded password.

## Full-product acceptance
Every numbered route and every listed state has a screenshot, business API contract, automated test, ownership, security controls and production runtime check. AI Studio progress must be evidence-backed; "designed" ≠ "implemented" ≠ "tested" ≠ "deployed".
