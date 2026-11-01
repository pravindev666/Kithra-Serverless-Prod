> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# PRD — Product Requirements Document

**Version 1.0 — product specifications, not existing capabilities.** The supplied repository is a visual prototype with simulated auth, reports, matches, messages, billing, security and admin numbers; no mock outputs may be presented as live data.

## 1. Information hierarchy and conceptual vocabulary
- **Account:** authenticating human, internal `user_id`, lifecycle and safety state.
- **Persona:** user's mode-specific public identity: FRIEND, DATE, MATRIMONY. Each mode separately chooses display name, visibility, photos, discovery region, preferences and communication constraints.
- **Assessment:** quiz attempt using a fixed published bank version, unique order seed, explicit consent and response audit trail.
- **Profile vector:** bounded derived dimensions with confidence/coverage, not a physical "brain map".
- **Match candidate:** two eligible consenting personas subject to mutual mode, age, blocks, filters, privacy, location and risk policy.
- **Lens:** similarity/Mirror, difference/Counterpoint, complementarity/Mosaic, overall Resonance. Match score is index-based, not relationship success probability.
- **Introduction:** express mutual opt-in; creates chat authorization only after request accepted.
- **Circle:** user-created topical community with rules and permissions; optional privacy mode.
- **Case:** safety/support complaint with ticket, evidence, timestamps, dispositions, appeal rights and restricted operator access.

## 2. Product-level state machines
**Account:** `invited -> pending_verification -> active -> restricted -> suspended -> deleted` with additional `deletion_pending`. **Mode persona:** `inactive -> onboarding -> ready -> discoverable -> paused -> closed`. **Quiz attempt:** `assigned -> in_progress -> submitted -> scored` or `expired`, `withdrawn`, `invalidated`. **Introduction:** `requested -> accepted -> closed` or `declined`, `expired`, `blocked`. **Message:** `accepted -> persisted -> delivered -> seen` (read-receipt only with user preference). **Report:** `open -> triaged -> investigating -> actioned -> resolved` or `escalated`, `appealed`.

## 3. Journeys
### J01: Arrive and explore
Public landing → transparent how matching works (and its limits) → choose initial mode(s) → sign up via Firebase → verify email → adult age policy → accept current T&C and applicable notices → specify optional psychological profiling consent → choose private display details. No mandatory 100-question wall before the user knows what they will receive.

### J02: Start quiz
Quiz catalog → choose theme and consent scope → estimate time, progress and skipability → backend creates **versioned assignment** → resume across devices → submit subset/full set according to completeness rules → receive self-understanding summary with caveat, examples and score definitions. Quiz cannot claim a diagnosis.

### J03: Discover humans
Mode switcher → eligibility and preference checks → lens toggle (Mirror/Counterpoint/Mosaic) → band filter (100,90,80...10) representing descriptive *index intervals*, not precisely measured probabilities → preview profile with safe shared details → why-you-might-connect/possible friction with confidence → send request (caps and mutual eligibility) → receiver accepts/declines → optional conversation starts.

### J04: Establish trust
Any profile/message/group includes block, mute and report; block suppresses discovery, old requests and messages, without alerting blocked user; report captures safe evidence and case ID, allows immediate preservation where lawful, and acknowledgement. Report is accessible without payment.

### J05: Join/create Circle
Discover themed groups → membership request → accept rules → join thread → moderators manage members/content → creator moderation privileges limited to group, never global admin. Group invites must not expose undisclosed profile or intimate details.

### J06: Upgrade and cancel
Pricing context → clear entitlement list, taxes, renewal amount/date, cancellation → provider checkout → signed webhook to confirm entitlement → invoice and transaction history → cancel future renewal while honoring paid period → downgrade without losing core safety or user data → refund request and manual review.

### J07: Data rights
Settings → privacy control and consent dashboard → download requested structured export → edit/rectify persona → withdraw assessment sharing; delete derived scores or recalculate → request deletion with lawful retention disclosure, non-blocking progress and confirmation.

## 4. Feature epics, requirements and acceptance criteria

| ID | Epic / behavior | Release | Acceptance criteria |
|---|---|---|---|
| P-001 | Create account, verify email and log in | early internal delivery phase | unverified users cannot enter discovery/chat; audited login; rate limited |
| P-002 | Configure mode personas independently | early internal delivery phase | all fields/visibility scoped to selected mode; switching mode never leaks details |
| P-003 | Quiz catalog & placeholder themes | early internal delivery phase | exactly 100 indexed placeholders per published themed set, drafts hidden |
| P-004 | Versioned assessment assignment | early internal delivery phase | server assigns seed/version; idempotent save; resume across devices |
| P-005 | Consent-aware trait synthesis | early internal delivery phase | rescoring deterministic; handles missing data; deletes on withdrawal |
| P-006 | Discovery with lens/band controls | early internal delivery phase | no blocked, ineligible, or non-discoverable users in results |
| P-007 | Explanation and uncertainty | early internal delivery phase | show evidence dimensions and confidence, not proof of guaranteed outcome |
| P-008 | Mutual connection request | early internal delivery phase | cannot message until accepted, unless consented group policy allows |
| P-009 | Private text chat | early internal delivery phase | durable server authorization, moderation triggers, delete/report |
| P-010 | Report, block and support ticket | early internal delivery phase | reporting works under every paid/free state, admin case visible |
| P-011 | Private/public themed Circles | early internal delivery phase constrained | creation gated; moderation queue and anti-spam, caps |
| P-012 | Admin RBAC and audit trail | early internal delivery phase | no admin rights from frontend or client-provided role |
| P-013 | Consent/export/deletion | early internal delivery phase | API job progresses and returns verifiable results |
| P-014 | Razorpay subscriptions | Pilot+ | signed webhook, idempotency, reconciled entitlements |
| P-015 | Multilingual quiz item bank | Post-validation | expert translation and measurement equivalence studies |
| P-016 | AI persona companion/simulated twin | Research only | separate consent, safety and model validation before shipping |
| P-017 | Voice/video calls | Later | cost, abuse, reporting and recording policies approved |
| P-018 | Family-assist matrimony introductions | Later | explicit per-participant approval; no family access by default |

## 5. Three relationship modes — deliberately different outcomes
- **Friendship:** shared interests, schedule compatibility, local region, platonic boundary, desired contact frequency; romantic approach through friendship is reportable unwanted contact after boundary communicated.
- **Dating:** adult-only, mutual declared dating intent, separate selective preference disclosure, opt-in to photos, romantic interest, family expectations where applicable; never infer sexual orientation from hidden questions.
- **Matrimony:** committed intent, voluntary family involvement, education/employment claims labeled self-declared unless independently verified, shared practical life plans, financial expectations, living arrangements; consent-based and anti-coercion safeguards. Avoid caste/religion as hidden ranking or moral merit measures; if legal counsel approves optional explicitly declared preferences, provide transparent user control and fairness monitoring.

## 6. Grouping taxonomy
Global neutral families **Origin** (introductory), **Currents** (thinking/communication), **Mosaic** (complementary roles), **Horizon** (life direction), **Rhythm** (daily habits), **Compass** (values orientation), **Bridge** (conflict repair), **Orbit** (shared interests). Localized expressions may describe preferences but must not rank communities or label them inferior, defective, high/low worth, alpha/beta. Group names must not imply mental diagnoses.

## 7. Content and notification policy
Preferences: product, safety/transactional, marketing separately; email digests default restrained and opt-out for nonessential notifications; no message-content previews on lock screens by default for dating/matrimony; safety notifications are mandatory where legally required; user can turn off activity indicators; no "your soulmate is waiting" fear-of-missing-out framing.

## 8. Edge cases
- Ambiguous self-report answers produce no definitive trait label; incomplete quizzes reduce confidence.
- Users can have multiple persona modes but must not match themselves or bypass prior blocks.
- Deleting account revokes active sessions, disappears from new discovery, and handles retained moderation/payment evidence by lawful schedule.
- Accepted chat counterpart changes mode or revokes consent → existing chat policy must remain clear; no silent mode conversion.
- Safety report against a match → immediate protection while appeal remains independent.
- Location changes → region updates opt-in, never broadcast exact coordinates.
- User under 18 at enrollment or suspected minor → restricted/closed pending safety review.
- Payment partially succeeds → entitlement only from trusted webhook, not redirect query params.
- Empty local matching pool → show transparent waitlist/interest Circles, not invented candidates.

## 9. Suggested success metrics
Eligible active pool by mode/city, quiz meaningful completion, user-reported comfort/safety, match requests accepted, 7/30-day mutual recontact, group recurring interactions, 1k-chat harm rate, complaint SLA, refund rate, 30-day paid retention, contribution margin. Segregate raw quiz telemetry and restrict analyst access.
