# LANDING PAGE — COMPLETE CONTENT & MOTION BLUEPRINT

Direction: **D2 Culture-Neutral Editorial** (provisional). Breakpoints: 4/8/12
col, container 1240 px, gutter 16→24 px. All copy below is **exact candidate
text**, not advice. Motion configs reference `--k-*` tokens and
`07_MOTION/MOTION_FOR_REACT_COMPLETE_MATRIX.md`.

**Global rule:** every claim is honest, every promise bounded, every proof
either real-and-consented or explicitly illustrative.

---

## 1. Navigation + brand

- Wordmark `kithra` (lowercase, Fraunces, 600). Never a heart/lock icon.
- Links: **Explore · How it works · Safety · Pricing · Sign in · Join**.
- Right cluster: **Language** (globe → sheet), **Sign in** (ghost),
  **Join Kithra** (primary).
- Mobile: wordmark + **Join** + hamburger → full-screen sheet with the same
  links + language + legal.
- Sticky on scroll (z-sticky 100), shrinks from 76→60 px; **no** scroll-jacking.
- A11y: `nav aria-label="Primary"`, skip-link first, focus ring `--k-focus-ring`.

---

## 2. Section-by-section (desktop → mobile stacking)

### S0 — Hero  (96 vh desktop / auto mobile)
**Purpose:** place, in five seconds, *what Kithra is* and *why it differs*.

> **Eyebrow:** Friendship · Dating · Matrimony — your choice, one account
> **H1:** *Understand your patterns. Meet people who make sense to you.*
> **Sub:** Kithra is one platform with three separate intentions. Thoughtful
> questions build a private picture of how you connect — then we explain, in
> plain language, why two people might fit. No mind-reading. No guarantees.
> Just clearer introductions.
> **Primary CTA:** `Start with a few questions` → /join
> **Secondary CTA:** `See how matching works` → /how-it-works
> **Micro-trust line:** Your answers are private by default. You choose what
> each mode can see.

**Media:** one 4:5 editorial photograph of two adults in a *non-romantic*,
warm, ordinary moment (a café conversation) — deliberately ambiguous so it does
not code "dating". Illustration: none in hero.
**Motion:** eyebrow fades+rises 8 px (hero 520 ms, stagger 40 ms); H1 word-free
fade-up; the relationship-map glyph animates **only** its connecting lines,
once, ≤600 ms; reduced-motion → static.
**Desktop:** 12-col, text 5 cols left, image 6 cols right (1 offset).
**Mobile:** image collapses to a 4:5 banner *below* the copy so the headline is
first paint. Network-light: banner is a 60 KB progressive JPEG with a
solid-colour LQIP.

### S1 — Three modes  (three cards)
**Purpose:** prove the modes are separate and consensual.

> **Eyebrow:** Three intentions. One account.
> **H2:** Different connections, built on understanding.
> **Lede:** A profile is private to the modes you enable. Turning on Dating
> never exposes your Friendship profile.

Cards:
- **Friendship** — *"People for conversation, shared interests and everyday
  company — with platonic boundaries respected."* CTA *Explore Friendship*
- **Dating** — *"Meet with clear, mutual intent and a respectful pace."*
  CTA *Explore Dating*
- **Matrimony** — *"Compare shared life plans honestly — with family
  involvement only if you invite it."* CTA *Explore Matrimony*

Each card: mode glyph + label + one honest sentence + CTA. Colours: mode accents
(icon + label always, never colour alone).
**Motion:** cards rise 12 px with 60 ms stagger on scroll-into-view (once).
**Mobile:** stack; each card full-width, 16 px radius.

### S2 — How matching works  (4-step explainer)
**Purpose:** explain determinism *and* its limits before signup.

> **H2:** How matching actually works
> Steps: **1 Answer** (versioned question sets) → **2 Compare** (your answers vs
> theirs) → **3 Explain** (what's similar, what differs, what's uncertain) →
> **4 Introduce** (only when you both opt in).
> **Honesty callout:** A score of 100% means agreement across the answers
> compared — not a promise about the future. We show how much data each result
> is based on.

**Motion:** stepper lines draw left→right once; numbers count-up disabled under
reduced motion.
**Mobile:** vertical timeline.

### S3 — Signature interactive demo (relationship map)
**Purpose:** show, not tell — the explanation experience.

- An **fictional, labelled** pair ("Example: A & B — illustrative only").
- Interactive: hover/tap a dimension → explains it in one sentence.
- Shows **band** (e.g. *Similar*), **coverage**, and **"what we haven't
  measured."**
- Hard disclaimer repeated: *"Illustrative example. Score = agreement on
  compared answers, never a relationship prediction."*
- **No real user data. No claim of a guaranteed outcome.**
**Motion:** node + edge reveal on interaction only (ui 220 ms); fully static and
readable with JS/motion disabled.
**Mobile:** map becomes a vertical list of dimension rows (never a cramped
diagram).

### S4 — Why questions
> **H2:** Why we ask questions
> **Body:** Questionnaires can't read minds and can't promise outcomes — so we
> don't pretend they can. What they *can* do is surface how two people describe
> their rhythms, values and expectations, so a first conversation starts
> somewhere real. Every set is versioned, and you can stop or withdraw at any
> time.
> **Sample theme cards:** Conversation & Conflict · Values & Trust · Social
> Rhythm · Growth & Ambition · Interests & Curiosity · Digital Boundaries &
> Privacy.
> **Honest label on every sample item:** *"Draft item — shown for illustration
> only."*
**Motion:** theme cards fade-in stagger; not a carousel.

### S5 — Photography-led storytelling
> **H2:** Real people, ordinary moments
> **Body:** Friendship looks like shared activities. Dating looks like a good
> conversation. Matrimony looks like planning a life. None of them look like a
> wedding catalogue.
> Media: 3 photographs — friends, a couple (non-intimate), a two-person planning
> scene. **All must be genuine consented participants or a clearly labelled
> licensed/illustrative set.** Never a fabricated testimonial.
> **If real participants are used:** first name + city + consent line.
> **If illustrative:** visible `Illustrative image` caption.

### S6 — Trust & safety (must be honest)
> **H2:** Safety is not a premium feature
> B1: **Block and report are free, always.** B2: **Adults only (18+).** B3:
> **Mode-specific visibility** — you decide what each mode sees. B4: **You own
> your data** — export and delete from settings.
> **Label honestly:** features not yet live are marked *"planned"*, not implied
> as shipped.
**Motion:** plain reveal; no animation on safety content (clarity first).

### S7 — Pricing preview
> **H2:** Fair, simple membership
> **Body:** Discovery, your assessments, blocking/reporting and chatting with a
> mutual match are free. Paid plans add convenience — richer explanations,
> advanced filters and compare tools. **We never hide your most compatible
> people behind a paywall.**
> Plan chips: **Free ₹0 · Plus ₹149/mo · Connect ₹249/mo** (+ see full pricing).
> Link: *See what's always free →*
**Motion:** plan cards, subtle border highlight on focus; **no countdown, no
fake discount**.

### S8 — FAQ (accordion, 8–10 items)
Real questions incl.: *Is Kithra an AI app?* (No — deterministic), *Does a 100%
score mean we're soulmates?* (No), *Can I use only friendship?* (Yes),
*Will my dating profile show in friendship?* (No), *Can I delete my data?*
(Yes), *Do you sell my answers?* (No), *Is it free?* (Core is free),
*Can family join my matrimony profile?* (Only if you invite them).

### S9 — Languages & accessibility
> **H2:** Built to be usable
> Body: English, हिन्दी, தமிழ், తెలుగు, മലയാളം, ಕನ್ನಡ, বাংলা (as they ship);
> WCAG 2.2 AA target; screen-reader and keyboard support; low-data mode.
> Honest: mark which languages are live vs planned.

### S10 — Footer
Columns: Product, Safety, Company, Legal (Terms, Privacy, Community Standards,
Grievance Officer, Cookie settings), Contact, Language, Social.
Statement: *"Kithra is an introductions platform. We do not guarantee
friendship, romance or marriage outcomes."*

---

## 3. The three hero narratives (tested head-to-head)

| # | Narrative | H1 candidate | Strength | Risk |
|---|---|---|---|---|
| H-A | **Belonging / friendship-first** | *"New city? Meet people who make sense to you."* | Strong for friendship; concrete | Under-serves dating/matrimony |
| H-B | **"Your kind of people"** | *"Find your kind of people — and understand why."* | Broad, warm, mode-neutral | Slightly vague; needs the explainer |
| H-C | **Three journeys, one platform** | *"Friendship, dating or marriage — one honest platform."* | Clear scope, SEO-strong | Reads feature-first, less emotional |

**Recommendation — test H-B first.** It is mode-neutral (protects all three
modes), emotionally warm (matches the founder brief), and immediately rewards
the *explanation* differentiator. H-C is the safer SEO variant; H-A is the
strongest single-mode test. All three must be tested with five-second
first-impression studies before lock (`09_VALIDATION/FIRST_IMPRESSION_TESTS.md`).

---

## 4. Media, SEO, performance, consent

- **OG/Twitter:** 1200×630 card, headline + wordmark, **no faces** (privacy).
- **Structured data:** `Organization`, `FAQPage`, `WebSite` with
  `SearchAction`; **no** fake `AggregateRating`.
- **Performance budget:** LCP ≤2.5 s mid-range Android; JS ≤180 KB gz initial;
  LCP image ≤120 KB; CLS ≤0.1 via metric-matched font fallbacks.
- **Slow-network:** text-first hero; images lazy; low-data mode flag.
- **Localisation:** all copy in i18n keys; no baked-in English; RTL-ready
  primitives though no RTL locale is launched initially.
- **Analytics:** privacy-respecting, no raw answer data, no ad targeting on
  questionnaire content; consent-aware (see `08_SAFETY/`).
- **Cookie/consent:** minimal, non-deceptive, reject as easy as accept.
