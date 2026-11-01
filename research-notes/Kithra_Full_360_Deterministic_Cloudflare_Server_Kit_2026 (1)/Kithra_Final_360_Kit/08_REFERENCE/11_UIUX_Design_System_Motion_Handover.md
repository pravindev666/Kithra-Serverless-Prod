> **Historical basis — updated for v3.** For conflicts, the new v3 authorities prevail. This file is supporting detail, not a claim of working code.

# UXR / UID / Design-RD — Kithra Complete UI/UX & Motion Handover

**Audience:** UI/UX designers, design system engineer, front-end developer, accessibility reviewer. **Source ZIP is a product concept only**. Do not inherit its design uncritically; all colors, type, layout and interactions below are a fresh coherent recommendation. Deliver high-fidelity Figma responsive prototypes and implementable components with explicit states.

## 1. Product experience principles
1. **Human first, not algorithm first.** Display a human profile before an invented perfection badge. Use compatibility as an explanation, not value ranking.
2. **One identity, three quiet worlds.** Intent-specific Friendship, Dating and Matrimony contexts, visually distinct only where it clarifies context; never leak one persona into another.
3. **Discovery through mutual choice.** Avoid swipe-addiction, infinite scarcity/fear framing and fake urgency.
4. **Trust without surveillance theater.** Explain exactly what has and has not been verified, security implemented and user visibility.
5. **Respect highly private data.** Reveal only summaries the member chose; privacy controls next to disclosure, not buried.
6. **Friction where it protects.** Slow down intimate consent, public sharing, privilege grants and risky actions; reduce friction for routine browsing.
7. **A calm living experience.** Tactile microinteraction, not screenfuls of continuous motion. Reduced-motion accessible parity.

## 2. Brand territories and visual concept
**Positioning:** modern, insightful, warm and trustworthy; avoid occult/soulmate certainty, clinical diagnosis, cosmic mysticism too strongly or matrimonial stereotypes. Visual metaphor: **connecting facets**—slightly asymmetrical geometric shapes, which align through deliberate choices, not a literal brain scan. Use soft field gradients and editorial portraits only when appropriately licensed and consented; no AI-generated member photos falsely presented as real.

### Color tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| background | `#F7F7F3` | `#0F1822` | neutral canvas |
| surface | `#FFFFFF` | `#182430` | cards and sheets |
| surface-muted | `#EEF0EE` | `#22313D` | secondary panels |
| ink | `#18252A` | `#F2F5F2` | primary text |
| ink-muted | `#56636B` | `#ACB7BE` | secondary text |
| brand-deep | `#264D56` | `#8FD0CC` | headings/logo accent |
| teal-action | `#147C82` | `#57BCC0` | primary CTA |
| teal-hover | `#105E64` | `#8DD6D8` | interaction |
| coral-soft | `#D99683` | `#E5AB98` | warm human accent |
| lilac | `#9389BF` | `#B0A5DB` | alternate visual lens |
| positive | `#207D62` | `#74C9A4` | successful controlled states |
| warning | `#AA6B20` | `#F2C070` | caution notices |
| danger | `#B73C4A` | `#FF8A94` | abuse/confirmation destructive |
| border | `#D9E0DF` | `#34444B` | hairline separators |

Accent palettes for **mode identification**: Friendship teal `#147C82`, Dating rose `#B75D77`, Matrimony indigo `#655AA9` (with accessible text variants on respective themes). Colors identify the current mode but never indicate caste, gender, attractiveness or psychological worth.

### Typography, icons and layout
Use **Manrope** (display), **Inter** (body/interface), optional **Newsreader** italic for 1–2 editorial hero words (do not overdo). Fallback system fonts. Display 64/72 desktop, 38/44 mobile; H1 48/56 desktop; H2 36/44; H3 24/32; body 16/26; compact UI 14/20; captions ≥12/18 sparingly. Use a consistent 8pt spacing grid with 4pt increments; radii 12/16/24/32; 1px borders; subtle non-colored shadows, not neon glows everywhere. Icons Lucide or custom 24px stroke with semantic labels. User photos are circular/soft-square; no fake verified marks. Max readable text width 70ch. Public page grid 12 columns, max 1280px, 24–48px gutter. Workspace desktop sidebar 252px; contextual details panel 320px; content max 1180px. Mobile 360px baseline and 44px minimum targets; use bottom nav for 4–5 high-frequency destinations.

### Implementation tokens
Use `scaffolds/design-tokens.json` as the source for CSS custom properties, Figma variables, theme switch and component states. Include focus ring, breakpoint and motion primitives. Never derive contrast from a hue without testing WCAG 2.2 AA.

## 3. Public landing page — art direction and scroll narrative
**Section L1 / first fold:** minimalist navigation left Kithra wordmark; right "How it works", "Safety", "Our approach", "Pricing", "Log in"; CTA "Explore connections". Hero line **"People are more than profiles."** secondary "Discover friends, dates and potential life partners through thoughtful questions and mutual choice." Three mode chips displayed as clearly different intents. Hero illustration: four subtle translucent tessellated facets approach one another and form a flexible whole; **not brains, souls or medical imagery**. On mobile replace with simple static/low-motion graphic. Public hero does not claim X% success.

**L2 / Explain the three worlds:** Friendship / Dating / Matrimony cards, each with expectations and an independently opt-in selector; a mode focus toggle updates copy, does not autoplay huge transitions.

**L3 / How it works:** Choose intention → Answer optional questions → View clear compatibility lens → Make mutual connection → Build real relationship. Animated path with descriptive relationship connectors only, scrolling under reduced motion static.

**L4 / Compatibility lens demo:** sample fictional match report with switcher `Mirror / Counterpoint / Mosaic`, human-friendly explanation and caveat "Scores summarize answers, not certainty." No fabricated testimonials.

**L5 / Privacy promise:** transparent raw-answer privacy, opt-in sharing, boundaries, blocking, report, human moderation. Badges only for implemented audited features. Link to legal center.

**L6 / Circle communities:** small facilitated topic-focused groups; screenshots/mockups explicitly labeled illustrative until real.

**L7 / Pricing:** Free + optional upgrades, month/quarter/half-year/year toggle, full GST and auto-renew clarity, cancel anytime meaning explained.

**L8 / Frequently asked:** is Kithra dating? do I need 100 questions? can I skip? are scores guaranteed? can I hide myself? can I delete? which data other users see? can admin see chats? who handles reports?

**L9 / Footer:** official entity, contact, legal, privacy, data rights, community guidelines, help, accessibility, security disclosures and status page.

## 4. Motion system (Framer Motion / `motion/react`)
**Motion goal:** purposeful, calm, performant and accessible; use CSS transforms and opacity, never scroll-jacking.

| Motion token | Parameters | Where |
|---|---|---|
| enter | 260ms, ease `[0.22,1,0.36,1]`, `y: 12 → 0`, opacity `0 → 1` | card entrance |
| appear | 180ms ease-out, opacity only | dialogs and data updates |
| softSpring | `type:'spring', stiffness:260, damping:28` | tab indicator / small affordance |
| pageTransition | 220ms crossfade, `y:6 → 0` | workspace panes |
| hoverScale | 120ms, scale to 1.015 max | CTA/cards |
| reducedMotion | all nonessential transform animations disabled, opacity short or instant | accessibility |

Suggested snippets (pseudocode, confirm installed version):
```tsx
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
const reduced = useReducedMotion();
<motion.section initial={reduced ? false : {opacity:0,y:12}} whileInView={{opacity:1,y:0}}
 viewport={{once:true,amount:0.15}} transition={{duration:0.26,ease:[0.22,1,0.36,1]}} />
```
Hero facets animate **once** with 350–600ms sequence stagger, then remain still. Focus changes by reduced-motion-safe crossfade. Hero load must not be blocked by large video/WebGL; no particles that increase GPU cost. Avoid infinite shimmering 3D "soul twin" animation, 100 parallax layers, forced scroll snapping, content that moves while typing, layout shifts or distraction in admin. Use `LazyMotion` and bundle splitting; test 30fps+ mid-tier mobile and preserve full function with JavaScript animation disabled.

## 5. App-wide information architecture
### Desktop sidebar
```
[Logo] Kithra
[Intent switcher: Friendship ▾]      (always visible)

DISCOVER
  Overview
  Discover People
  Match Lenses (Mirror / Counterpoint / Mosaic)
  Connections & Requests
  Circles

CONNECT
  Messages
  Notifications
  Saved Profiles

DISCOVER YOURSELF
  Quiz Library
  My Assessments
  My Compatibility Profile
  Growth Notes (optional, private)

ACCOUNT
  My Mode Profiles
  Membership & Billing
  Privacy & Consent
  Safety & Help
  Settings
```
On narrow tablet: compact icon rail with tooltips and accessible labels. Mobile: bottom nav **Discover / Connections / Circles / Messages / Me**; quiz library via Me/discover prominent banner; switch intent via top-bar pill; prevent accidental cross-mode switch by clearly changing header/canvas marker. Do not force all destinations as 14 visible mobile tabs.

## 6. End-to-end user screen inventory & edge states
**U01 Landing:** interactive hero, scroll narrative, copy and CTA; disclose limits.
**U02 Sign-up/log-in:** email & password, Google, forgot password, confirm email, terms/age separate; loading/error/rate limit states; no silent account linking by email.
**U03 Intent onboarding:** choose one or more, explain visibility boundaries; empty selection cannot proceed to discovery.
**U04 Create mode persona:** display name, age validation, coarse city, interests, pronouns optional, photos optional, audience/visibility, safety preference; preview as another user.
**U05 Privacy & consent:** consent cards by mode/quiz, data sharing diagram, toggle explanation, consent history and withdraw all; no hidden default consent.
**U06 Quiz library:** category tiles by theme, number of valid published item sets, estimated duration, relevance by mode and progress.
**U07 Quiz run:** one question at a time, question `x/100`, save indicator, back/skip/quit, keyboard radio navigation, edit response, context tooltip and sensitive-question warning where relevant; mobile sticky Next; no timer penalties.
**U08 Quiz resume/error:** previously saved partial, pending sync, offline, recovered attempts, locked published version; recovery path.
**U09 My psychological profile:** plain-language traits and coverage/confidence, adjustable visibility, evidence explanation, no clinical diagnosis or surveillance implication.
**U10 Discover people:** list/grid/mapless city pool, mode/lens/band controls; truthful pool count; minimal filters; reasons + risks; skeleton/empty/blocked/restricted states.
**U11 Detailed match profile:** public photo optional, mode, human story, consented compatibility highlights, mutual interest, report/block shortcuts, non-scientific caveats; avoid "opposite fixes you".
**U12 Connection inbox:** pending incoming/outgoing, accepted, expired, declined; reject without penalty or disclosure; manage request volume.
**U13 Messages:** desktop split conversation list/main thread/optional details; mobile single chat view; ability to block/report from header, message action and profile; text first, attachments later; clear transport security disclosure, no fake E2E.
**U14 Circles index:** themes, local/remote, public/private, member counts, moderation rules, filter by mode.
**U15 Circle detail:** feed, conversation, rules, moderators, invitations, report, leave, member role; no unsolicited mode transfer.
**U16 Create a Circle:** name/description/topic/moderation setting/location scope, member admissions, creator responsibilities, permissions.
**U17 Activity events (later):** participant cap, public location guidance, RSVP, cancellation and safety review.
**U18 Membership:** available plans, entitlement comparison, GST/renewal rules, gateway redirect, receipts/cancel/refund.
**U19 Account settings:** notifications, region and language, account, security/session log, connected identity, delete/export/consent.
**U20 Safety Center:** transparent verified security features, report tracker, help desk, appeals, safety guides, legal requests contact.
**U21 Support ticket:** category, problem description, optional attachments, attachments privacy disclosure, ticket status.
**U22 System states:** blocked/suspended/quiz-version-deprecated/score-incomplete/empty local pool/internet failure/consent withdrawn; each has a constructive next step.

## 7. Component catalog
Button (primary, secondary, quiet, danger), IconButton, Tabs, SegmentedControl, IntentModeSwitcher, AccessiblePopover, DropdownMenu, ProfileCard, MatchLensCard, TrustBadge (strict criteria), ScoreBandBadge with help, ConfidenceIndicator (when supported), ConsentToggle, QuizChoiceGroup, QuizProgress, ResumeCard, MemberAvatar, ConnectionRequest, MessageBubble, ReportDialog, NotificationToast, InfoDisclosure, AlertBanner, SkeletonCard, EmptyState, ConfirmationDialog, Pagination, FilterSheet, SearchAutocomplete, Date/LocationInput, AdminRiskPill, AuditEventRow, CaseTimeline, RoleMatrix. For each Figma component define variants, interaction, error, focus, disabled, high-contrast and dark state, screen-reader output and motion specification.

## 8. Core screen specs for UX handoff
### Discovery list
Header mode switch and large human-focused heading, visible lens explanation, small live list and deferred filters. On card show name, general city, chosen public interests, *descriptive* band, explanation; request action not available until eligible. 100/90/80...10 bands are optional advanced filter and refer to index ranges; do not show "100% chance".

### Match detailed panel
Split: left human story/intent, right `Why you might connect`, `How you differ`, `What the model doesn't know`, confidence and mutual contact CTA. On mobile stack, persistent CTA only after reading essential boundaries. Raw answers never displayed without separate sender approval.

### Quiz 100-question journey
Question progress must be honest: `18 of 100`, ability to finish later. 100 continuous questions can cause fatigue; design checkpoints every 20, transparent skip policy, summary after completion or after validated short subset, no false gamification streak. Zero items production ready until vetted. Keep completion autosave even on network disruptions.

### Messaging
Request gate before conversation; unread, sending, failed/retry, deleted, reported, blocked states. Provide easy exit, plain content warnings, media safety controls and limitations of moderation privacy; do not design fake voice-call buttons for unbuilt features.

### Matrimony context
Sober copy, serious intent, voluntary family visibility, separate sensitive preference consent, clear marital status self-report vs verified. No dowry filters or discriminatory psychological type names. Add explicit mismatch/boundary disclosures; family contact cannot appear unless both persons independently authorize.

## 9. Microcopy and accessibility
Never say "100% perfect person", "clinically verified soulmate", "brain replica", "Aadhaar verified" without a real legal process. Prefer "Strong measured alignment in 5 shared areas" with model explanation. Errors are specific and respectful; avoid blaming users who skip personal questions. All controls keyboard accessible, form labels real, logical focus restoration, visible indicators, alt text for meaningful imagery, AA contrast, no information purely color-coded, 200% zoom and reduced motion tested. Maintain layouts under English plus Hindi/Tamil string expansion; do not localize official scoring labels without expert review.

## 10. Figma handover checklist
Deliver `00 Foundations`, `01 Components`, `02 Public Landing`, `03 Onboarding`, `04 Friendship`, `05 Dating`, `06 Matrimony`, `07 Quiz`, `08 Discovery & Matching`, `09 Messaging & Groups`, `10 Safety & Billing`, `11 Admin Console`, `12 Responsive/States`, `13 Prototype Motion`, `14 Content & Translations`; light/dark as applicable. Name variants consistently; include token export and motion specs, component interaction matrices, annotated error/empty/privacy states, 360/768/1024/1440px breakpoints. For development: Storybook (optional), Chromatic visual regression, automated a11y tests, performance budget and no unbuilt feature decoration.

## 11. Design acceptance criteria
A first-time user understands mode separation within 20s; all flows have privacy explanation and easy cancel; every matching explanation shows uncertainty; a report/block reachable in ≤2 interactions from chat and profile; data deletion available without payment; no navigation dead ends; admin safety functions visually distinguish urgency; test on lower-end Android, keyboard-only, screen reader, reduced-motion and low bandwidth.
