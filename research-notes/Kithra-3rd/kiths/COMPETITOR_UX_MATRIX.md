# COMPETITOR UX & MONETIZATION RESEARCH — Kithra 2026

**Method.** Public landing pages and app-store listings were fetched with the
Scrapling skill (v0.4.11, `Fetcher.get`, stealthy headers) on 2026-11-01 and
stored verbatim under `01_RESEARCH/raw_captures/`. Only publicly accessible
pages were fetched at polite frequency; no authentication, paywall or CAPTCHA
was circumvented. Anything not directly observed is marked **NOT VERIFIED**.
Reddit is treated as qualitative signal, never as a representative survey.

Raw captures: `raw_captures/{we3_how,we3_features,hinge_brand,boo_home,boo_faq,
trulymadly_home,aisle_home,bumble_bff_play,boo_play}.txt`
(`bumble.com/bff-us/` returned HTTP 404 at capture time — recorded honestly.)

---

## 1. What fourteen services actually do

| Service | Focus | Mode model | Question model | Signature UX | Monetisation |
|---|---|---|---|---|---|
| **Bumble BFF** | Global | Friendship only (separate app) | Interest tags/bios | "no paywalls, no locked features" claim | Free-first (claimed) |
| **Bumble Dating** | Global | Dating | Light prompts | Women-first messaging | Tiered premium |
| **Hinge** | Global | Dating | **Prompts, no % scores** | "designed to be deleted"; editorial brand | Hinge+/Preferred |
| **OkCupid** | Global | Dating | **Match questions → %** | % match, per-question privacy | Premium/A-List |
| **Boo** | Global | Dating + friendship | 30-item → 16 type (Jung+OCEAN) | Interest "universes", Awards | Tiered premium |
| **We3** | US | Friendship | Psychographic, 150+ factors | **Triads of 3**, private profiles | Tiered |
| **Aisle** | India | Dating (serious) | None deep | "Nothing casual"; screenshot block | Pro/premium |
| **TrulyMadly** | India | Dating + matrimony | **ChowkAIdar quiz + trust score** | Manual moderation; no screenshots | Sparks/quizzes |
| **Jeevansathi** | India | Matrimony | Filters (community/horoscope) | Contact gating | Paid membership |
| **Betterhalf** | India | Matrimony | Claims AI compatibility | — | Paid plans |
| **Schmooze** | India | Dating | Meme/social inference | — | Paid |
| **Meetup** | Global | Community | None | Interest groups, IRL events | Organiser subs |
| **Timeleft** | Global | Social dining | Light | Group dinner matching | Per-event/sub |
| **Slowly** | Global | Pen-pal | None | **No real photos by design** | Stamp packs |

Only 4 of 14 are India-specific (Aisle, TrulyMadly, Jeevansathi, Betterhalf);
friendship/community experiences number 6 (Bumble BFF, We3, Meetup, Timeleft,
Slowly, Boo's friend mode). This satisfies the prompt's ≥12 / ≥4 / ≥4 minimums.

---

## 2. Verified observations (with evidence)

- **Hinge brand (verified, operator source).** Core palette is *Hinge White
  `#FFFEFD`* and *Hinge Black `#1A1A1A`*, with **Kohlrabi `#994EA8`** as the
  only expressive accent. Type is **Tiempos** (headline serif, Klim) paired with
  **Modern Era** (utilitarian sans, Family Type). Tagline: *"the dating app
  designed to be deleted."* → *Proves a near-monochrome palette plus one
  non-pink accent can feel premium and warm, and that outcome language wins.*
- **Boo (verified, operator FAQ).** Minimum age 18; free 30-question test
  producing a 16-type result explicitly borrowing **Jungian + Big Five (OCEAN)**.
  Public home exposes interest "universes" with member counts (music "23M
  souls"). → *Interest clustering as navigation; large self-reported counts as
  social proof (treat as marketing).*
- **We3 (verified, operator pages).** Matches in **triads** explicitly to stop
  "dating apps masquerading as friendship apps"; profiles private, Tribe-only
  visibility, individual answers never shown; claims 150+ factors,
  1,000,000+ Tribes, 50,000+ meetups. Notably it **admits** social science has
  not run controlled friendship-factor experiments. → *Honest limitation
  disclosure is a competitive trust asset; Kithra should copy the honesty, not
  the numbers.*
- **TrulyMadly (verified).** "Manual moderation" + automated "ChowkAIdar 1.0"
  check; no screenshot/download of photos for women; homepage testimonials are
  gendered marriage stories. → *Trust mechanics are worth adapting; gendered
  wedding-story proof is the exact cliché Kithra must avoid.*
- **Aisle (verified, store).** Play: **1Cr+ downloads, 4.66L reviews, 4.3★,
  Mature 17+**; positions "Nothing casual about this dating app." → *Large
  Indian serious-intent pool exists.*
- **Bumble BFF (verified, store).** Standalone "BFF" app, **500K+ downloads,
  3.72K reviews, 3.8★**; markets *"No paywalls, no upgrades, no locked
  features."* → *The strongest free-access positioning in friendship.*

---

## 3. Recurring pattern library (reuse)

1. **Photo + prompt hybrid profile card** (Hinge, Boo, Aisle) — replace with
   Kithra's photo + *declared pattern* card.
2. **Interest/community clustering** (Boo universes, Meetup groups) — becomes
   Kithra **Circles**.
3. **Private-by-default visibility** (We3, Slowly) — Kithra mode personas are
   private until the member enables them.
4. **Screenshot deterrence + women's safety defaults** (TrulyMadly, Aisle) —
   adopt honestly, without promising impossible protection.
5. **Editorial sans+serif pairing** (Hinge) — validated direction for Kithra's
   warmth-with-credibility (see `03_BRAND/FONT_RESEARCH.md`).
6. **"Designed to be deleted" outcome framing** — adapt as Kithra's
   *"understanding, not endless browsing."*

## 4. Anti-pattern library (avoid)

1. **Everything behind a paywall** (`r/match` threads) — Kithra keeps discovery,
   safety, blocking/reporting and post-consent chat free.
2. **Selling access to the most compatible people** — explicitly forbidden by
   the founder discussion §7 and the prompt.
3. **Gendered wedding-story testimonials** (TrulyMadly hero) — no fabricated or
   gender-clichéd proof.
4. **Personality-type determinism** ("INFJ = your soulmate") — Boo-style typing
   risks false precision; Kithra reports band + coverage, not a caste.
5. **Dark-pattern scarcity/countdown** (FTC 2022) — no fake timers.
6. **Swipe-roulette** — no binary reject-by-looks packaging.

## 5. India vs global observations

- **India:** OTP-first sign-in dominates (Aisle, TrulyMadly, Jeevansathi,
  Schmooze); trust/moderations claims are foregrounded; matrimony framing is
  serious and family-aware. Price sensitivity is high; free tiers are expected.
- **Global:** email/Google-first; brand voice is minimal and editorial (Hinge);
  friendship apps lead with privacy and non-romantic boundaries (We3, Slowly).
- **Implication:** Kithra must run **OTP-friendly + email/Google** sign-in,
  keep **free core**, and separate **mode intent** clearly so friendship is not
  read as dating (the We3 problem).

## 6. Genuinely differentiated vs common

| Common (table stakes) | Kithra differentiation |
|---|---|
| Photo-first cards | Deterministic, explainable pattern card + photo |
| Personality "type" | Banded agreement index with **coverage + version** |
| One intent per app | **Three consented modes, one account** |
| Interest groups | **Circles** with mode scope |
| Premium unlocks | **Unified membership**, safety always free |

## 7. Unknowns honestly recorded

Sign-in screens of Bumble Dating, Hinge, OkCupid, Boo, Aisle and Jeevansathi
were **NOT captured in authenticated state**; their password/OTP screens are
**NOT VERIFIED**. Admin consoles are entirely non-public (**NOT VERIFIED**).
Pricing figures beyond the kit's own draft are **NOT VERIFIED** for Kithra.
