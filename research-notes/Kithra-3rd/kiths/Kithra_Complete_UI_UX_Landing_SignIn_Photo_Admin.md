# Kithra Complete UI UX Landing SignIn Photo Admin

**Kithra full-product handover · 1 November 2026 · For developer/designer implementation and legal review**



---

> **Reference:** `02_DESIGN/UIUX_RD_Complete_Design_System.md`

# UI/UX-RD — Complete Design System, Light/Dark, Screen Composition, Interaction

## 0. Design standard
Target is consumer polish on par with leading large apps in **clarity, responsiveness, useful density and fault handling**, not visual imitation. Kithra should feel approachable and culturally inclusive. Use Palantir-style relational clarity in the compatibility map and admin triage; never adopt its enterprise density in the landing or signup. All requirements support mobile, desktop, tablet, light/dark, 320–1920 px, touch, keyboard and screen readers.

## 1. Evidence-derived look and feel
Recommended-but-NOT-APPROVED D2 Ink & Clay from Hermes. D1 Sunlit Humanist is warmer but rose-coded; D5 Forest & Sand quieter. Before founder freeze, show same landing/sign-in/member card/admin frame under all 3 to avoid isolated palette decisions. D2 palette: light canvas `#FBFAF7`, surfaces `#FFFFFF`/`#F7F6F1`, text `#1F2320`, muted `#5A6159`, teal `#1F6F5C`, decoration clay `#D98A3D`, clay text `#8A5A1E`, support `#3E4A6B`; dark canvas `#14170F`, surface `#1F241D`, text `#F2F2EC`, primary `#4FB39B`, accent `#E0A863`. Modes: Friendship teal, Dating muted rose #A83E50, Matrimony support #3E4A6B, only where labels/icons clarify. Use exact source `13_RESEARCH_ORIGINAL/03_BRAND/design-tokens.json` and accompanying CSS. Contrast test disabled/muted text, focus and danger on actual surfaces: passing body roles in research does not certify every combination.

Typography: Fraunces for editorial headlines only; Inter for form controls, body, data tables; Noto Sans per active Indic script; number tables use tabular figures; JetBrains Mono for request IDs / logs only. Font licensing must be checked for distribution and self-hosting. 17 px large body and 15 px UI body default; forms no smaller than 16px on mobile; min interactive targets 44×44. Set max text measure 60–72ch. Defer brand finalization for founder approval while preserving provisional tokens. No font files bundled.

## 2. Grids and responsiveness
12-col desktop 1240px content; 8-col tablet; 4-col mobile, gutter 16px on small, 24px on desktop. Landing: generous white space and human photography. Dashboard: desktop 240px navigation, flexible 700px central canvas, optional 320px contextual panel; mobile 4–5 bottom tabs, overflow More sheet, fixed safe-area consideration and back navigation. Staff desktop minimum effective width 1024 for 3-pane queue; tablet 2-pane; phone emergency/triage one-pane (not forced microscopic tables). Page padding 16 mobile / 24 tablet / 32 desktop; sticky header keeps single CTA where appropriate.

## 3. Primitive component contract
Button (primary/secondary/ghost/destructive/text), Link, Input, PasswordField, PhoneField, GoogleSignIn, EmailCodePanel, FormError, Combobox, RadioCard, Checkbox, ConsentNotice, ModeCard, Chip, Badge, Avatar, PortraitCard, Gallery, Lightbox, FileUploader, PhotoCrop, SortablePhotoGrid, ProgressStepper, QuizQuestion, PatternBar, MatchExplain, RelationshipMap, DataTable, DataGrid, CommandSearch, Drawer, Modal, Sheet, Toast, Banner, Skeleton, OfflineIndicator, StatusTimeline, GrievanceCard, CaseEvidencePanel, AuditTrail. Every component has specified props, keyboard, disabled/error/loading/read-only, light/dark, RTL slot, high contrast, focus and reduced motion. Do NOT invent interaction only visible on hover.

## 4. Navigation and information hierarchy
Public: logo / How it works / Friendship / Dating / Matrimony / Safety / Pricing / Sign in / Get started. Logged-in: Home, Discover, My Patterns, Connections, Messages, Circles, Notifications; Account overlay with Profile, Photos, Privacy, Assessments, Support, Subscription, Settings and Sign out. Explicit current intent header; switching modes uses persistent mode-scoped banners. Admin: Overview, Trust & Safety, People, Photos, Circles, Assessments, Scoring, Support, Billing, Rights, Compliance, Staff, Audit, Analytics, System, Incidents and Settings. Accessible breadcrumbs and direct-deep links; route changes preserve intended context where safe.

## 5. Portrait and photographic art direction
Authentic, consented, adult Indian and international people in everyday relationships: coffee, reading, hobby clubs, building something, walking, talking, not forced intimacy or wedding tropes. Prioritize a human moment plus clear headline, no huge collage/synthetic testimonial. Lifestyle photos alternate age, body type, region and setting without tokenizing identity. Include fallbacks for no photo, slow image, moderated/rejected, blocked or hidden photo; never expose a private image as a placeholder thumbnail. Hero landscape crop at mobile below headline; member portrait 4:5, avatar 1:1, contextual photo 16:9, server derivatives with LQIP and `srcset`.

## 6. Light/dark requirements
Honor system preference on first use, persist explicit override securely; SSR prevent flash using initial theme class. All semantic tokens must exist for dark, including focus, danger, chart categories, muted backgrounds, separators, overlays, keyboard focus, selected state. Maintain contrast AA in both; photos get scrim only where text overlays are unavoidable; admin charts must use patterns/tooltips not color alone; inspect Indian scripts in dark mode. No light mode inversion via CSS filter. Mood should stay warm and trustworthy in dark, not gamer-neon.

## 7. Whole-product states
Every route has: initial skeleton, empty, normal, filtered-empty, transient network failure with retry, offline if applicable, unauthorized, forbidden, deleted/410, conflict/409, throttled/429, maintenance/503 and severe/500 fallback. Real 404 has neutral illustration (not fake account), routes to Home and Help, search optionally. Account-specific 404 must not reveal a user's existence. Session expiry should preserve intended route after re-auth; modal stack does not destroy route history.

## 8. Accessibility + performance gates
Accessibility WCAG 2.2 AA, semantically correct headings, focus order, alt meaningful/non-redundant, keyboard / SR tested, 44px product targets, 400% zoom, 320px reflow and reduced motion. UX metrics: first impression in 5 seconds tested, signup completion, quiz drop-off, comprehension of percent-band caveat, intent leakage test, successful block/report, checkout comprehension, recovery after error. Lighthouse is indicative only; test actual mobile on 3G/4G, budget assets, ensure low data mode doesn't load motion assets.

## 9. What design team must deliver
Figma or equivalent editable design file, variables for tokens and dark/light, complete responsive screens and states, prototype clickable flows, photo art direction & license ledger, exact microcopy, component behavior/API states, annotated Motion and accessibility specs, i18n-ready strings, assets at specified aspect ratios, developer handoff and user research results. "Look like Facebook" is not an asset license and should not be translated into copying copyrighted designs.

## 10. Traceability
The dedicated source research is more granular and remains incorporated in full: `13_RESEARCH_ORIGINAL/05_USER_UX/COMPLETE_MEMBER_SCREEN_INVENTORY.md`, `WIREFRAMES_MEMBER.md`, `06_ADMIN/WIREFRAMES_ADMIN.md`, `07_MOTION/MOTION_FOR_REACT_COMPLETE_MATRIX.md`, `10_HANDOFF/DEVELOPER_COMPONENT_CONTRACTS.md`.


---

> **Reference:** `02_DESIGN/LANDING_RD_Exact_Site_Content.md`

# LANDING-RD — Pixel/Content/Motion Specification of Every Public Section

The founder specifically requires the landing page to be the soul of Kithra. The page must achieve 5-second comprehension (what / who / why) and invite without manipulation.

**Page hierarchy desktop**: 1240px max, nav at top, 2-column 5:6 hero, copy before media on mobile. One photograph of consented non-romantic human connection. No fake screenshots presented as live profiles.


- **S0** — **Section:** Hero; **Exact default copy/asset role:** Eyebrow `CONNECTIONS THAT MAKE SENSE`; H1 `Find your kind of people.`; subhead `Friendship, dating and marriage-minded introductions—through thoughtful questions and transparent comparisons.`; primary `Start with a few questions`, secondary `See how it works`; hero 4:5 photo + small "Illustrative" where applicable; **Interaction:** CTA to signup, secondary anchor; **Motion (when allowed):** headline 520ms fade-rise, photo 520ms fade; no word-by-word hidden text; **Mobile:** copy and CTA visible first; photo after copy ≤240px tall
- **S1** — **Section:** Three paths; **Exact default copy/asset role:** `Three ways to connect. One account. Your choice.` Cards: Friendship `Meet people you can be yourself around.`; Dating `Find shared intention beyond a swipe.`; Matrimony `Explore values and plans for a lasting partnership.`; **Interaction:** Each route education + consent-friendly get started; **Motion (when allowed):** 60ms stagger card entrance, once; **Mobile:** stack all 3
- **S2** — **Section:** Matching; **Exact default copy/asset role:** `Thoughtful questions. Clearer conversations.` Four steps: Choose your intent → Answer at your pace → Understand patterns → Decide together; **Interaction:** Opens matching transparency page; **Motion (when allowed):** one-time line-draw, ≤600ms; **Mobile:** vertical stepper
- **S3** — **Section:** Explainable map demo; **Exact default copy/asset role:** `A percentage isn't the whole person.` Two fictional example profiles, Echo / Counterpoint / Mosaic, 5 dimension rows, coverage; disclaimer `Illustrative comparison—not a prediction or guarantee.`; **Interaction:** interactive tabs, accessible buttons; **Motion (when allowed):** ≤200ms node/edge reveal on tab change; **Mobile:** row comparison instead of node graph
- **S4** — **Section:** Assessments; **Exact default copy/asset role:** `More than a list of interests.` Sample theme cards values, communication, rhythms, conflict, boundaries, aspirations etc; `Question bank still under review` until authored; **Interaction:** Explore sample assessment; **Motion (when allowed):** stagger 40ms, no forced auto-progress; **Mobile:** 2→1-col
- **S5** — **Section:** Human photos; **Exact default copy/asset role:** `Real connections take time.` Three story slots: sharing an activity, meaningful conversation, thoughtful partnership; caption photos are licensed/consented; **Interaction:** none; **Motion (when allowed):** fade-once 320ms; **Mobile:** vertical full-width
- **S6** — **Section:** Trust; **Exact default copy/asset role:** `Your safety isn't a premium feature.` Block, report, mode privacy, data choices; never falsely claim encryption standard or verification; **Interaction:** link Safety Centre; **Motion (when allowed):** no animation on critical text; **Mobile:** stacked facts
- **S7** — **Section:** Pricing; **Exact default copy/asset role:** `One membership. Every mode you choose.` Free/Plus/Connect preview; exact limitations, taxes and refund route; **Interaction:** pricing comparison; **Motion (when allowed):** low-key focus border; **Mobile:** cards with all benefits
- **S8** — **Section:** FAQ; **Exact default copy/asset role:** Can I use only Friendship? Is my photo private? How are scores calculated? Can I skip questions? Are high matches guaranteed? Can I cancel? Can I delete my data? Are there verified accounts?; **Interaction:** accessible accordions; **Motion (when allowed):** height only if no reduced motion; **Mobile:** single column
- **S9** — **Section:** Language / accessibility; **Exact default copy/asset role:** `Built for different ways of connecting.` Show only LIVE supported languages; explain captions, keyboard, reduced motion, low-data; **Interaction:** language selector; **Motion (when allowed):** none; **Mobile:** list
- **S10** — **Section:** Footer; **Exact default copy/asset role:** Product, Support & Safety, Legal, Company/contact, country/locale; real business/grievance info once verified; **Interaction:** internal nav; **Motion (when allowed):** none; **Mobile:** collapsible logical groups


**Sticky nav**: state changes only after scroll threshold; no distracting sticky app download; privacy and support available without registration. On dark mode, photos carefully color-grade for contrast, maintain warmth.

**SEO & social**: Index public education and policy pages; no indexing member profiles/quiz responses/admin. OG has abstract original illustration (no user's face), correct 1200x630 export; one title and description per route, sitemap, accessible canonical URLs. Never publish founder claim without evidence/legal review.

**Non-negotiable QA**: five-second comprehension across 3 Indian and 2 non-Indian audiences, light/dark snapshots 320/375/768/1024/1440; no cumulative layout shift from media, photo licensing log, all CTAs working, 404 from bad route, WCAG screen-reader navigation and reduced motion tested.

*Detailed section dimensions, original researcher analysis and three alternative hero narratives are retained verbatim in `13_RESEARCH_ORIGINAL/04_LANDING/`.*


---

> **Reference:** `02_DESIGN/AUTH_PHOTO_AND_ERRORS_RD.md`

# AUTH/PHOTO/ERROR UI-RD — Screen-Level Handoff (all states)

## Sign-in: separate full-screen experience, NOT a single modal
Route `/sign-in`. Desktop 12-col composition: left 5.5–6 cols brand photo panel with short credible value proposition, right 6-col form max 430px. Clear `Welcome back` H1, `Continue with Google`, separator `or`, email/password, password show/hide, forgot password, email verification support, primary `Sign in`, `Create an account` link, terms/privacy accessible. Brand photography cannot include staged romance as default; a group-friendship photo keeps every mode welcome. Optional quiet trust line `Your relationship choices stay private until you choose to share them.` only if implemented.

Mobile ≤480px: logo, compact image/banner (or none in low-data), H1 and primary method above fold, 16px min input text, 48px form controls, submit remains visible without keyboard overlap. Keyboard and safe area tested; don't require scroll to sign in. Tablet single centered form with upper horizontal photo.

Auth surfaces `/sign-up`, `/verify-email`, `/forgot-password`, `/reset-password`, `/auth/callback`, `/session-expired`, `/onboarding/age`, `/onboarding/intent`, `/onboarding/consent`, `/onboarding/profile`, `/onboarding/privacy`, `/onboarding/complete`. States: email invalid, existing account, unverified, provider down, wrong credentials, network offline, locked/rate limited, suspicious login, account deleted, reset link expired, MFA step, session expired; each has plain copy, accessible live region, clear recovery action, no enumeration leaks. Google fallback to email. No fake pass-any-OTP. Phone optional with real provider and abuse/cost controls. Adult 18+ age assurance proportional and reviewed; exact verification process TBD.

Mode chooser shows Friendship, Dating, Matrimony **as equal-value selectable cards**, explaining exposure and data boundaries, with one or more selectable and an explicit Continue; show current selected count and ability to change later. Consent is separate per mode and per sensitive optional field, not hidden in marketing checkbox. Onboarding progressive: get first user value without forcing every 100-item bank. Save-and-resume with version pinning, idempotent updates and conflict UI.

## Photo gallery / avatars
Profile hero 4:5 portrait; thumbnail 1:1; context/event 16:9. Upload slot with drag-and-drop desktop and camera/library mobile; client previews and accessible file picker; edit crop/zoom, alt/caption, reorder, set as primary, mode visibility per photo, remove, report, review status, visibility preview showing `Visible in Friendship only` etc. Photo grid skeleton and private/no-photo alternatives. Media states: selected → upload progress → processing/scan/moderation → approved/held/rejected → deleted. Include reason codes and appeals where lawful.

Privacy: protected signed GET only after backend authz and content rights check; NEVER use permanent public R2 link. Short-lived PUT into private staging with byte/type/content checks; server-side EXIF/GPS stripping, malware scanning, derived renditions, signed GET, CDN caching constrained by entitlement, audit. Screenshot prevention impossible: don't promise it. Before admin evidence access to intimate photos, case/role/justification + audit. No "verified" glyph without integrated verification provider + policy.

**Profile photo UX by relationship mode**: identity stays the same but discoverable photo visibility is **separate**. If the member hides a photo in Dating it must stay hidden in Dating even if public in Friendship; use per-photo ACL rows. A hidden photo cannot leak via `/media/{id}`, search thumbnails, generated derivatives, link previews, cached objects or notifications. On block, revoke access instantly or within clearly declared bounded cache invalidation SLA, tested.

## Complete error and lifecycle pages

- **catch-all `*`** — **Title:** `This page wandered off.`; **Member action:** Home, Explore, Help; **Backend condition:** unknown path; **Accessibility:** H1, correct 404 HTTP
- **`/forbidden`** — **Title:** `You don't have access to this page.`; **Member action:** Switch mode, Account, Support; **Backend condition:** authz denial; **Accessibility:** 403, do not reveal private user
- **`/gone`** — **Title:** `This content is no longer available.`; **Member action:** Return, Support; **Backend condition:** removed content; **Accessibility:** 410
- **`/rate-limited`** — **Title:** `Too many tries. Please try again later.`; **Member action:** timer if known; Help; **Backend condition:** 429 with Retry-After; **Accessibility:** screen reader countdown no noisy updates
- **`/error`** — **Title:** `Something went wrong.`; **Member action:** Retry, Help, incident reference; **Backend condition:** 500; **Accessibility:** no stack trace
- **`/maintenance`** — **Title:** `We'll be back soon.`; **Member action:** status page, retry; **Backend condition:** 503; **Accessibility:** ETA only if verified
- **`/offline`** — **Title:** `You're offline.`; **Member action:** reconnect, cached approved content; **Backend condition:** navigator network status; **Accessibility:** avoid false "saved" claims
- **`/blocked`** — **Title:** `This connection is unavailable.`; **Member action:** Safety centre; **Backend condition:** block/decline; **Accessibility:** don't reveal which side blocked


All error pages designed separately in light/dark at 320/768/1440, with copy localized and no whimsical animation during safety/payment failures.

## Motion behaviors
Sign-in: subtle 150–220ms form state only; no looping photo pan. Validation errors instant except subtle shake prohibited (can feel punitive). Profile photo gallery: 180ms fade or shared layout but no image zoom beyond safe areas; full-screen Lightbox closes with Esc/back; respect reduced motion. Mode selection 180ms border/scale and focus indicator; quiz steps ≤220ms via AnimatePresence mode wait; 404 original tiny static artwork and no forced animation. Use Motion APIs, never invent external plugin dependencies.

## Testing acceptance
Full Playwright routes across 3 viewport classes, keyboard-only sign-in/reset/choose mode/upload/crop/delete/report, screen readers, network interruption, expired signed URL, blocked media retrieval, mode visibility, EXIF no GPS, photo rejection and appeals, offline retry and reduced motion. A screenshot preview is insufficient; assert DOM interactions and backend HTTP statuses.


---

> **Reference:** `07_ADMIN_OPERATIONS/ADMIN_RD_Full_Console.md`

# ADMIN-RD — Full Staff Console, RBAC, Casework, Palantir-Inspired Operations

## Interface principle
A deliberately separate staff experience: same Kithra design tokens, denser information layout, role-aware panes, evidence and time hierarchy. Palantir-style power means **traceable relationships, filterable operational data and clear provenance**, not wholesale copy of Blueprint widgets or a public-facing corporate look.

## Shell
Staff-only URL `staff.[domain]` preferred. On route entry validate signed, MFA-verified staff session before loading any private data. Sidebar: Overview; Safety Cases; Photo Review; Members; Fraud; Messages Evidence; Circles; Assessments; Scoring; Payments; Subscriptions; Support; Privacy Requests; Grievances; Compliance; Analytics; Audit; System; Incidents; Feature Flags; Staff/RBAC; Settings. Main content queue/list with sortable and filterable 36–48px rows, top banner environment name, alerts; detail third pane with status timeline and evidence. Tablet two-pane; mobile urgent view restricted or one-pane.

## Auth & privileges
Authentication is not "special email and password" alone. Provision staff via authorized invitation, email domain or explicit identity allowlist, strong MFA through Identity Platform/other capable IDP; step-up for sensitive operations, time-bounded sessions and audit. Roles: `superadmin` (policy/config, not unrestricted content), `trust_safety`, `photo_moderator`, `support_agent`, `billing_agent`, `privacy_officer`, `psychometric_reviewer`, `auditor_readonly`, `ops_engineer`, `grievance_officer`. Roles composed from scoped permissions, not an integer hierarchy. Separation of duties for role elevation, bans/refunds above thresholds and evidence requests.

## Case lifecycle
New → triage → assigned → investigating → action proposed → approved if sensitive → actioned → member notified → appeal/closed. Each case: source report, subject ID pseudonymized where possible, severity, priority, due time, owner, queue, evidence references, admissibility/access consent/legal basis, linked events and appeals. View evidence only JIT reason/time/bounded scope, with mask/redaction defaults. Expired grant revokes immediately. Every action idempotent with who/what/when/why and previous/new status. Urgent intimate imagery complaints have dedicated fast escalation, never buried in generic support.

## Detailed module rules
- Overview: current cases/urgent SLA breaches and reliability metrics, data freshness indicators; no vanity dashboard.
- User search: exact/scoped, reason required, no default raw questionnaire disclosure, status and risk signal provenance.
- Photo review: queue/thumbnail only with legitimate moderation purpose; click full image only with scope; approve, reject with taxonomy, notify, appeal.
- Reports: filter by severity, policy, assignment, age; case SLA; linked sessions and safe evidence review.
- Fraud: rate/velocity signals and confidence caveats; no irreversible algorithm-only bans.
- Messaging evidence: narrow thread excerpt by case and time; export approval and audit; no surveillance backdoor.
- Circles/events: policy review, creator actions, suspensions, memberships and moderation.
- Assessment CMS: draft/review/legal/psychometric/publish/rollback; immutable published bank versions, localized copy validation.
- Scoring: rule version compare, replay fixtures, drift/fairness dashboard, blocked releases until reviewer approval.
- Support: ticket inbox, macros, assigned agent, status, timelines, internal notes redacted from member.
- Billing: provider ledger, verified webhooks, refund reason, approval thresholds, no manual fake entitlements.
- Privacy: consent history, export/deletion stages, lawful holds, SLA, downstream processors/backup reconciliation.
- Staff: invite/revoke, MFA assurance, quarterly access review, dual approval on privilege escalation.
- Audit: append-only/tamper-evident events only if actual verifier implemented; timeline and export.
- Analytics: minimum cohort size suppressions, no psychometric raw answer analytics.
- Incident: affected systems, severity, clock, containment, notifications and legal decision record.

## Visual states and motion
No admin auto-playing animations. Data tables have empty, skeleton, stale, failed, permission denied, conflict/stale version, redacted, rate-limit states. Triage uses labels plus icons, not severity colors alone. Motion ≤160ms in drawer, case selection and toast; no animated count-ups or delayed safety buttons. Use contrast and WCAG keyboard navigation in dense tables and evidence viewer.

## Admin negative requirements
No superadmin routine ability to read every member's intimate quiz answers, no undisclosed browsing of DMs, no backdoor impersonate-user, no secret admin login bypass, no irreversible action without reason, no paper-only audit, no unverified report deletion. Every staff permission has a test fixture and quarterly review. 24 exact admin screen layouts are preserved in source research `13_RESEARCH_ORIGINAL/06_ADMIN/`.


---

> **Reference:** `10_DEVOPS/DEVOPS_RD_Cloudflare_Docker_GHA_Jenkins.md`

# DEVOPS-RD — GitHub Actions, Cloudflare, Docker/Jenkins, Backup and Migration

## Source control and build contract
Private monorepo, protected main, required PR review, CODEOWNERS for security/legal/migrations, conventional changesets, semantic API versioning, dependency lockfile, SBOM, secret detection, signed artifacts where practical. Never push `.env`, production credentials, user data or media. Use environments `dev`, `staging`, `production` for each hosting target with distinct secrets and databases.

## GitHub Actions pipelines
- `ci.yml`: format, ESLint, strict TypeScript, Vitest, matcher property tests, D1 & PG migration in containers, OpenAPI lint, Playwright E2E on preview, a11y/visual snapshots, dependency and secret scan. A passed CI is a gate, not a full external pentest.
- `deploy-cloudflare.yml`: protected `production` environment with reviewers, Wrangler deploy worker assets/API, D1 migrations with preflight/backup, smoke via real staging and prod endpoints, rollback artifact/route on fail. Cloudflare token minimally scoped; no guessed account/resource IDs.
- `deploy-server.yml`: build immutable images, scan+push registry by digest, trigger Jenkins job / SSH deploy with secrets injected, backup PG, migrate, Docker Compose pull+up/canary, health check and rollback. Build once promote digest, do not rebuild prod from local workstation.
- `security-nightly.yml`: scheduled dependency, ZAP-safe scan against staging, artifact/report retention; no aggressive scan on live members.
- `parity.yml`: boot Cloudflare local worker and Node API, shared fixture suite, compare hashes/errors/permissions and websocket events; block release on drift.

## Jenkins responsibility
For server environment only: checkout signed/immutable tag, verify provenance and CI run, pull image by digest, preflight secrets/db and available disk, backup + migration, `docker compose up -d --wait` with timeout, smoke and rollback, notifications. Jenkins UI itself MFA/SSO and restricted agents. Do not store production env values in Jenkinsfile.

## Cloudflare release
Create named D1/R2/DO/Queue resources for each env. Worker bindings in `wrangler.jsonc` with placeholder account/database names; DO migrations tracked; don't try to deploy a guessed config. Build static React; upload static assets with API Worker if supported. Time Travel backup/restore tested. R2 private; CORS restricted; image processing server. Monitor DB read/write and DO usage as billing hazards. Do not assume 5,000 registered users equals a particular monthly bill.

## Server release
Compose baseline includes API, web, admin, worker, PostgreSQL, Redis and Caddy with healthchecks, named volumes, no host-exposed PG/Redis, resource limits. Production hardening must add managed secrets/monitoring, HA and offsite backups; single VPS is not equivalent to Facebook availability. Database connection pooling, object store external or backed up, graceful shutdown of websocket drain, message persistence before ack.

## Data migration/recovery
Two schema migrations and one logical contract; seed local fixtures without personal data. D1→PG export/transform, verify constraints and row hashes, replay event outbox idempotently, reissue signed media links, cutover with rollback window and delete reconciliation. Backup restore tests quarterly and prior to major migrations.

## Observability
OTel traces, provider usage metrics, service status, errors, SLA compliance, payment reconciliation and rights jobs. Alerts to actual on-call. Dashboard is privacy-safe. Audit events have actor, action, resource, case, reason and non-PII metadata.

## Minimum secrets register
`FIREBASE_PROJECT_ID`, Firebase public config in frontend if appropriate; Firebase credentials as secret, `DATABASE_URL` server only, Cloudflare D1/R2 bindings, R2 signing and bucket controls, Redis password, billing webhook signing secret, encryption keys, email/SMS provider credentials, observability ingest, allowed admin issuer/audience, deployment tokens. Document owner/rotation and never hardcode values.

## Provenance note
Files in `16_SCAFFOLD` are templates. Actual deployment must supply project source, secrets, account IDs, DNS records, auth provider config, migration history, paid resources and executable tests. Do not claim deployed from syntax-valid YAML.