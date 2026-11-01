# KITHRA — UI/UX DESIGN AUTHORITY & ART DIRECTION
Version 3.0 | 1 November 2026 | Status: design contract; all new design decisions supersede ZIP and older drafts.

## 0. The one-page creative brief
**Product:** Kithra: three distinct destinations for adult Friendship, Dating and Matrimony; one humane and transparent deterministic behavioral-comparison engine.
**Visual thesis:** *Different by nature. Connected by understanding.* The design should feel like a premium global editorial product with the warmth and legibility needed for Indian mobile-first users. Human, intelligent, calm, trustworthy and culturally adaptable. Not a clinical assessment, astrology app, gaming leaderboard or dating-app clone.
**Brand promise:** “Know your patterns. Find your people.” This is marketing copy subject to trademark/advertising and user testing; never claim to read minds or guarantee marriage outcomes.
**Creative direction:** deep nocturnal indigo canvas for key discovery moments, parchment/ivory surfaces for sustained reading, saturated iris-blue for primary CTAs, restrained coral and mint for secondary meaning. Generous whitespace and purposeful contours. Soft connecting threads appear only when they denote actual comparable dimensions.
**Primary UX principles:** privacy before curiosity; users choose their relationship mode; no hidden cross-mode visibility; real consent; understanding rather than diagnosis; explainable scores; fairness across culture, language, disability, religion and geography; interactions clear without animation; users can leave, block or opt out at every stage.
**Do not implement:** roulette-like swipes, rankings of human worth, artificial confidence, “the algorithm knows your sexuality,” dark-pattern scarcity/countdown, manipulative streaks, always-on autoplay, personality caste hierarchy, stock-portrait mosaics suggesting fabricated active members.

## 1. Audience, voice and narrative
Personas: (a) 24-year-old early-career worker looking for friends after moving to Pune; (b) 29-year-old woman seeking respectful, intentional dating in Bengaluru; (c) 32-year-old considering marriage with family involvement but choosing what parents can access; (d) returning NRI using the service across time zones; (e) moderator clearing harassment cases; (f) accessibility and low-bandwidth users.
Copy voice: empathetic but never infantilizing, plain Indian/global English, translatable, nonjudgmental, never moralize about lifestyles or personalities. Avoid “scientifically proven soulmate,” “we read your brain,” “destined,” and “guaranteed 100%.” Prefer “100% measured agreement across the answers compared.”

## 2. Absolute design tokens — light and dark
### 2.1 Color system
| Token | Hex | Where to use | Restrictions |
|---|---|---|---|
| ink-950 | #14182C | dark hero, app dark background, desktop nav | never pair with low-contrast muted copy |
| ink-850 | #232A47 | dark cards, nav and admin header | keep controls clearly bounded |
| iris-600 | #4B5DDB | main CTA, active navigation, focus accents | text on color must be tested |
| iris-500 | #6675ED | links on dark, diagram anchors | avoid low contrast on white for normal text |
| iris-100 | #E8EBFF | active chips and descriptions | not success/error states |
| ivory-050 | #FAF8F4 | light page background | broad canvas |
| ivory-100 | #F1ECE4 | editorial panels and separators | subdued backgrounds |
| paper-000 | #FFFFFF | forms, cards, admin data surfaces | dark text required |
| graphite-900 | #232736 | light-theme primary text | primary text |
| graphite-600 | #53596B | secondary text | validate AA contrast |
| graphite-400 | #858B98 | tertiary/supporting labels only | never small essential text |
| coral-500 | #DB755F | human illustration, warm highlight | not sole error signifier |
| mint-500 | #2E8C78 | supportive confirmation, reciprocity | not the only way to signal status |
| amber-600 | #A76A21 | caution and admin queue severity | always pair with text |
| danger-650 | #B53848 | blocking, destructive action, incident state | require confirm dialog |
| border-light | #DCDDE7 | form boundaries, separators | 1px stroke |
| border-dark | #424963 | dark surfaces | 1px stroke |

Light: `--bg:#FAF8F4; --surface:#FFFFFF; --text:#232736; --muted:#53596B; --border:#DCDDE7; --action:#4B5DDB; --actionText:#FFFFFF`. Dark: `--bg:#14182C; --surface:#232A47; --text:#F5F4F1; --muted:#C0C5D5; --border:#424963; --action:#6675ED; --actionText:#101326`. Cross-mode accents are supplementary: Friendship = iris, Dating = coral, Matrimony = deep teal (#217B75), *never* three unrelated product UIs. Status badges use icons and explicit labels.
Before final adoption run automated checks on every token/text pairing to WCAG 2.2 AA (4.5:1 text; 3:1 large text and non-text required contrast). A color being in this palette does not automatically make every pairing accessible.

### 2.2 Typography — exact recommended system
- Display and marketing H1: **Manrope**, weight 600/700, 1.02–1.12 line-height, tracking -0.035em. Character: sculptural but human. Hero 62–84px desktop, 40–50px tablet, 36–42px mobile using `clamp()`; NEVER overflow 320px viewport.
- UI/body: **Plus Jakarta Sans**, 400/500/600/700; 16px mobile/body minimum and 17–18px reading layouts; line-height 1.55–1.7. Data dense admin 14px minimum, 15–16px preferred.
- Indian script fallbacks: **Noto Sans Devanagari, Noto Sans Tamil, Noto Sans Telugu, Noto Sans Bengali, Noto Sans Malayalam, Noto Sans Kannada** selected per locale. Test line heights and actual glyph runs for every supported script; do not embed English-centric font metrics into Indic localizations.
- Numeric scores: Jakarta Sans 600 tabular numerals `font-variant-numeric: tabular-nums`, no display-serif numerals for values.
- Font distribution: source from authorized font providers or self-host license-compliant WOFF2 subsets; preload only above-the-fold weights; never distribute proprietary font binaries without rights. Fallback `system-ui, sans-serif`.

Type scale: label 12/16; caption 13/18; small 14/20; body 16/25; lead 18/28; h4 21/28; h3 28/35; h2 40/46; h1 desktop 72/78; h1 mobile 40/45. Keep meaningful section hierarchy.

### 2.3 Layout architecture
8px spacing system with 4px microsteps; radii 8 chips, 12 inputs, 16 cards, 24 editorial story cards; button min height 48px (mobile); visible focus 3px; default card shadow `0 10px 36px rgba(20,24,44,.07)` only on interactive/raised surfaces; grid 12 desktop / 8 tablet / 4 mobile. Public max width 1240px, text measure 60–70ch. Desktop gutters 64px at 1440, 32px at 1024; mobile 20px at 390 and 16px at 320. Mobile breakpoints 375/390/430, tablet 768, laptop 1024/1280, desktop 1440/1920; test all. Sticky headers height 76 desktop / 64 mobile; preserve content scroll position.
Use real accessible iconography (Lucide outline 1.75–2 stroke) and bespoke simple SVG connection diagrams; no misleading charts, arbitrary astrology glyphs, or decoration masquerading as science. Neutral face portraits of consenting real users only; no fake user avatars on a live product. Designer may use clearly labeled demo profiles in mockups.

## 3. The landing page — specified as a 10-beat scroll story
**Global composition:** desktop 1440x900 reference, off-white nav, hero in deep ink 950 with gentle iris bloom; site transitions into warm ivory editorial feature panels. An animated constellation-like diagram connects *dimensions* (not random stars). Mobile hero readable above fold with full CTA and a static/low-motion diagram below.

### Beat 01 — Navigation (0–76px)
Logo left: Kithra custom wordmark plus connected K symbol. Desktop links: Why Kithra / How it works / Three ways to connect / Circles / Safety / Pricing; right: language selector, Log in, CTA “Find your people”. Mobile: logo, Log in, hamburger -> accessible full-height drawer; language selector in drawer. Sticky at scroll>80, blur effect only if contrast remains. If logged in, dashboard link instead of signup.
### Beat 02 — Hero (immediately visible)
Eyebrow `FRIENDSHIP · DATING · MATRIMONY` in spaced microtype. Hero display copy exactly: **“Meet people who make sense to you.”** Support: “Discover meaningful connections through thoughtful questions, shared values and transparent comparisons—whether you're seeking friends, dating or a life partner.” Primary CTA “Explore your connections”; secondary “See how matching works”. Micro trust line: “You choose what to share. Your answers stay private.” Right/under heading: signature responsive *relationship map*: center circle `You`, 4 satellite circles labeled `Shared values`, `Communication`, `Everyday rhythms`, `Future goals`; connections draw only between relevant nodes, with 3 outer rings denoting Friend / Dating / Matrimony. This is an educational illustration, never actual compatibility calculation. Fine-grained hover/tap explanation of each dimension.
Desktop split 48/52, visual never pushes H1 beyond viewport. Mobile headline first, buttons stacked, visual 230–310px high, no auto movement beyond reduced-motion rules. Hero min-height `calc(100svh - 76px)` desktop but never full-height-lock on 320px mobile.
### Beat 03 — Mode selection: Three intentions, one place
Ivory section with heading “Different connections. Your choice.” Three equal editorial cards: Friendship (`Find people to share life with.`), Dating (`Meet with clarity and mutual intent.`), Matrimony (`Explore long-term compatibility thoughtfully.`). Each has eligibility statement, 3 short sample traits, small illustration, primary “Explore Friendship / Dating / Matrimony”. Card switch is not an automatic opt-in; CTA opens mode explanation.
### Beat 04 — How Kithra works
Three numbered steps with real content: (1) Choose your intention. (2) Answer thoughtfully; revisit anytime. (3) Compare your patterns, then decide if you'd like to connect. Beside it, a truthful example compare panel with `Measured agreement 82%` and explanatory note `This reflects responses compared, not a prediction of relationship success.` No invented testimonials.
### Beat 05 — Matching lenses as editorial carousel
Four interactive cards, accessible as stacked blocks on mobile: **Echo** (similarly measured patterns), **Counterpoint** (meaningful contrasts), **Mosaic Fit** (potential complementary preferences), **Neighbors** (practical filters and shared plans). A “100%” sample may be shown ONLY with precise `100% agreement on compared items` caption. Avoid an alleged soul-twin promise. Each card opens concise transparency accordion.
### Beat 06 — The questionnaire
Show a stepper with 3 believable *placeholder* question cards, “Save your place”, “Skip if optional”, “Why we ask”, and a toggle showing scope sharing. Explain `100 questions per set; more sets are optional until they are validated and published`. Never fabricate a scientific outcome. A 100-question set needs estimated time verified by usability tests, not invented “5 minutes.”
### Beat 07 — Connection beyond matching
Split panel of safe mutual invitation, one-to-one chat, private Circles, and real-world plans. Use visual flow `View compatibility -> Request introduction -> Mutual acceptance -> Message` with relevant icons; users can block/report anywhere. State safety in measured terms; not “perfectly safe”.
### Beat 08 — Privacy / trust
Darker section, visually quieter: “Your most personal answers aren't your public profile.” Explain separate modes, consent review, hidden answers, controls and reports. Small layered diagram `Raw answers (private) -> Derived explanations (permissioned) -> Public profile (controlled)`. Include “Read our safety approach” link; no unsupported E2EE/Aadhaar claims.
### Beat 09 — Pricing and FAQs
4 tier cards: Free, Plus, Connect, Matrimony Intent; indicate proposed price testing and monthly/3/6/12 month selector; full fees, renewals, cancellation, refunds and taxes must be shown before checkout. FAQs: Can I use only Friendship? Can I hide a mode? What does 100% mean? Can I delete answers? Is matching deterministic? Are there hidden intimate inferences? Is Kithra a matrimony guarantee? Answers truthful, non-coercive.
### Beat 10 — Closing CTA, footer
“People aren't puzzles to solve. Connections are worth understanding.” CTA “Begin with what matters to you”. Footer navigation grouped Product / Trust / Help / Company / Policies / Languages, contact and grievance links, current jurisdiction, accurate entity legal name when incorporated; avoid fake corporate claims.

## 4. Motion for React — precise implementation matrix
Use **`motion/react`** imports (`motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useReducedMotion`, `LayoutGroup`). Avoid mixing legacy `framer-motion` and `motion` packages in the same codebase. Motion is *enhancement*, not task completion.
| Surface | API/technique | Timing | Trigger | Reduced-motion fallback |
|---|---|---|---|---|
| Hero title | motion staggered line reveal `opacity/y` | 420–650ms easeOut; stagger 90ms | first paint after font stabilization | all text immediate |
| Hero connection map | SVG pathLength (only meaningful paths) | 850–1200ms, one cycle | first visible | static diagram |
| Sticky nav | CSS transform/background transition | 180ms | scroll threshold | instant |
| Three mode cards | `whileInView` opacity/y | 320ms, stagger 70ms | section enters | static cards |
| How it works | `whileInView` step sequencing | 280–380ms per step | scroll to section | no sequence |
| Matching-lens tabs | `LayoutGroup` `layoutId` active underline | spring 280–360ms damping 28 | click/keyboard | snap |
| Accordion | `AnimatePresence` content height/opacity | 170–230ms | click | immediate |
| Pricing selector | `layoutId` pill, number crossfade | 180–250ms | click | instant |
| Dashboard nav | shared-layout indicator | 220ms | route change | instant |
| Quiz questions | `AnimatePresence mode='wait'` opacity/x 8px | 200ms; never directionally imply right/wrong | next/previous | instant |
| Quiz progress | CSS width/transform | 220ms | response saved server-side | instant |
| Match cards | subtle opacity/y and focus elevation | 180–260ms | filter update | immediate |
| Match explanations | `layout` reveal | 220–300ms | open | immediate |
| Chat message arrival | opacity/y 6px | 120–160ms | confirmed event | no animation |
| Group join | checkmark/label confirmation | 120ms | accepted mutation | textual success |
| Toast/dialog | `AnimatePresence` | 130–190ms | relevant action | immediate |
| Admin queue reordering | `layout` position only | 130–220ms | ticket priority change | no animation |
| Admin crisis surface | **no motion** | 0 | incident alert | persistent accessible banner |

Do not continuously animate orbs, count scores up to fabricated percentages, autoplay parallax on assessment screens, or animate danger actions for fun. Scroll-driven subtle section reveal is allowed but entire page content must remain crawlable and accessible without JS animation. Performance budget: target LCP <=2.5s p75 on representative mobile, CLS <=0.1, avoid hydration/font shift; page animation must not delay interaction. `prefers-reduced-motion` disables all decorative motion and path drawing. Respect contrast and focus even in motion.

Example (illustrative, subject to package API/version tests):
```tsx
import { motion, useReducedMotion } from 'motion/react';
export function HeroCopy() {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, y: 12 }}
     animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.52 }}>
     <h1>Meet people who make sense to you.</h1>
  </motion.div>;
}
```

## 5. Full end-to-end member information architecture
Desktop sidebar: Home; Discover; Matching lenses; Assessments; My patterns; Connections; Messages; Circles; Plans & events; Saved; Notifications; [mode selector]; Membership; Support; Privacy & safety; Settings. Badge counts only if real. Mobile primary bottom nav: Home / Discover / Connections / Messages / More; secondary drawer for assessments, Circles, settings; persistent profile access. Modes must be unmistakably identified via label + accent, not color alone; switching requires confirmation if revealing previously private intent.

### 5.1 Screen-by-screen required deliverables
Design Figma desktop 1440 and mobile 390 for **every row**, tablet 768 for complex grid screens, and dark variants for key paths; document normal, loading, empty, error, blocked, offline, permission-denied, no-matches and expired-plan states.
| Screen | Mandatory content and interactions | Red flags |
|---|---|---|
| Public home | hero, modes, methodology, safety, pricing, FAQ | no invented active-user numbers |
| About matching | score definition, measured dimensions, limits | no mental-health diagnosis |
| Login/signup | email password, Google, reset, verification, terms | no prechecked consent |
| Age eligibility | age validation, underage exit, false-age handling | no unnecessary ID uploads |
| Choose mode | consequences, disclosure scopes, opt-in only | no auto-activation |
| Onboarding | language, broad location, goals, boundary settings, privacy | never mandatory sensitive traits |
| Profile photo | privacy, crop, alt text, moderation status, remove | no image shown preapproval |
| Assessment catalog | themes, version, requirements, estimated duration, consent | don't claim unvalidated psychometrics |
| 100 question reader | single question / desktop distraction-free panel, 1–100 progress, pause/resume, 'why asked', skip policy | no forced rapid choices |
| Quiz review | unanswered required, self-changed responses, submit | save idempotency |
| Assessment history | completed sets, versions, revise/retake, delete | no silent recompute |
| My patterns | domain chart, confidence/missing data, explainers, visibility switches | not a diagnosis |
| Mirror / Echo | similarity candidates, explanation, uncertainty | no guaranteed soul twin |
| Counterpoint | substantive differences, opt-in view | no demonization |
| Mosaic Fit | potential complementary preferences, tradeoffs | not gender stereotypes |
| Discover | filter chips, language, proximity bands, compatibility lenses, eligibility | privacy and blocks respected |
| Candidate profile | about, mode intent, shared grounds, differences, boundaries, request, block, report | raw answers hidden |
| Compatibility details | comparison dimension table, scoring method, question counts, version, caveats | not 'destiny probability' |
| Send invitation | template suggestions, optional personal note, frequency limits | no spam |
| Invitations | received/sent, accept/decline, expire | no forced response |
| Messages | mutual DM, attachments, mute/block/report, accessibility | no fake E2EE claims |
| Circles directory | browse/group safety, categories, moderation labels | no unsafe open group by default |
| Circle home | rules, channels, membership, roles, recent threads | policy enforced server side |
| Create Circle | scope, purpose, rules, invite limits, moderator needs | safe defaults |
| Events/plans | public venue guidance, RSVP, host obligations, cancellation | no precise address exposure |
| Notifications | grouped activity, granular settings, digest | never disclose sensitive match details in push |
| Subscription | tiers, comparison, billing cycles, payment/renewal text | no surprise paywall |
| Billing history | invoices, refunds, cancel, grace, dispute | no fake settled payments |
| Trust center | report, block list, consent controls, help | always available free |
| Account data | download, correct, delete, retention exceptions, reauth | real backend actions |
| Support center | FAQ, ticket, case status, appeals | accessible grievance contact |
| Account recovery | reset, lock, suspend, appeal flow | no mode leak |

### 5.2 Assessment screen — exact anatomy
Top fixed/subtle: Kithra logomark (left), `Theme: Communication · Set 2` (middle), `Save & exit` (right). Progress `Question 37 of 100`, progress bar text alternative. Question h2 with 60–75 character line cap. Optional context appears in collapsible “Why we're asking”. Answers: 4–5 choice cards minimum 52px high, radio-control semantics, space/arrow support, no randomized position that changes on back navigation; optional “I prefer not to answer” when appropriate. Footer prev / next anchored mobile with safe-area padding. Autosave on answer; show `Saved` only after server acknowledgement. Help menu clear concern/report question. End: review summary of skipped and changed items; explicit completion consent, report generation state; no fake accuracy percentage. Offline: local encrypted or restricted draft strategy; no unsafely cached sensitive text on shared devices.
### 5.3 Match card anatomy
Photograph (approved user), verified status *only when true*, mode label, coarse city, shared hobbies, one sentence “Why you may get along”, visible score definition tooltip, buttons View reasoning / Send request, overflow Hide/Block/Report. Display descriptive score category if insufficient responses; show separate Echo, Counterpoint, Mosaic Fit; never multiply them into an unexplained master score.
### 5.4 Messaging anatomy
Desktop 28% conversation rail / 72% main, mobile list→thread with back. Header person + report/Block/mute. Message bubbles distinct sender, timestamps, sending/sent/failed states, media upload preview, retry controls, explicit privacy policy. Typing indicators opt-in. Server enforces both sides are in mutual accepted state. Deleted/blocked user state remains understandable without exposing personal data.
### 5.5 International and Indian localization
English initial reference; provide locale-ready design for hi-IN, ta-IN, te-IN, bn-IN, ml-IN, kn-IN, and international en-GB/en-US (actual shipped translations require qualified translators). No flag icons for languages, no Indian-exotic decorative motifs or caste/religion stereotypes. Support name pronunciation, chosen name and multiword names, India city aliases and location radius approximations, all INR pricing disclosed with tax rules, and timezone aware dates. Test longer Indian-script line heights and numerals. Do not force family participation or assume all users are heterosexual.

## 6. Admin UX — separate visual discipline, same brand DNA
Admin visual direction: less decorative; ivory/white/graphite surfaces, iris for selection, strong incident severity. Persistent 264px sidebar desktop, collapsible to 72px icon rail; tablet drawer; mobile admin supports urgent review only if policy allows, never disables crucial permissions checks. Header includes environment pill (Production/Staging), global case search, alerts, staff availability, MFA/session; admin access via dedicated origin `admin.kithra.example` **example placeholder only**.
Admin primary sidebar ordering:
1 Overview | 2 Moderation queue | 3 Urgent safety | 4 Reports & appeals | 5 User accounts | 6 Profiles & verification | 7 Messages/evidence (case-scoped only) | 8 Circles & events | 9 Assessments/question bank | 10 Matching versions & explanations | 11 Payments & refunds | 12 Support inbox | 13 Privacy requests | 14 Admins, teams & roles | 15 Analytics & experiments | 16 Audit trail | 17 Incident center | 18 System health/usage/budgets | 19 Configuration/feature flags.
Each destination requires permission-gated visibility *and* backend enforcement. No all-seeing moderator browsing raw answers.

Admin dashboard (1440 reference): top 4 operational KPIs (Open safety reports, Urgent overdue, Data-rights backlog, API/system health) with data as-of timestamps; row 2 SLA queue trends and moderation disposition; row 3 assignment/ownership panel and recent interventions; row 4 provider costs/abuse alarms. Avoid prioritizing registrations over safety incidents in staff overview.

Admin case detail 3-zone: (1) metadata/risk/assigned/SLA strip (2) evidence timeline with redacted artifacts (3) action rail: warn, restrict, suspend, ban, refer, dismiss, request more info, escalate. Every action requires reason code, optional note, audit ID, policy version and user notification decision. Staff can open restricted sensitive evidence only through just-in-time grant with dual approval, minimum access and audit, ideally separate security role. Disposition undo/appeal where appropriate. No irreversible delete without guarded procedure.

## 7. Figma deliveries and design QA acceptance
Required files: `Kithra Foundations` (tokens, icons, typography, grids, motion), `Kithra Marketing` (all 10 sections & responsive), `Kithra Member` (screen inventory & modes), `Kithra Admin` (roles, queues, cases), `Prototypes` (all critical flows), `Content/i18n`, `Assets/Source Rights`, `Usability/Research`, `Accessibility Audit`. Use component properties for interactive/disabled/loading/error/focus/hover and text variants. Supply dev annotations, token IDs, CSS value references, interaction storyboards, keyboard tab order, screen-reader announcements and privacy guardrails. All components must match generated design-tokens JSON.
Required user tests: first glance (what is product, what is not), mode isolation, 100-question persistence, score explanation comprehension, request/accept/block, delete/cancel, moderator emergency case review. Acceptance: at least 5 moderated tests across varied devices and locally relevant language preferences; document issues and fixes, not unsupported claims of broad population validation. No stock portraits represented as active users.

## 8. Creator handoff signature
Designer signs: [name/date] | Content reviewer: [ ] | Accessibility reviewer: [ ] | Psychology reviewer for assessment wording: [ ] | Trust and safety reviewer: [ ] | Founder design approval: [ ]. A beautiful site that misstates the matching science, makes privacy incomprehensible, or blocks user safety tasks fails acceptance.
