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
| Route | Title | Member action | Backend condition | Accessibility |
|---|---|---|---|---|
| catch-all `*` | `This page wandered off.` | Home, Explore, Help | unknown path | H1, correct 404 HTTP |
| `/forbidden` | `You don't have access to this page.` | Switch mode, Account, Support | authz denial | 403, do not reveal private user |
| `/gone` | `This content is no longer available.` | Return, Support | removed content | 410 |
| `/rate-limited` | `Too many tries. Please try again later.` | timer if known; Help | 429 with Retry-After | screen reader countdown no noisy updates |
| `/error` | `Something went wrong.` | Retry, Help, incident reference | 500 | no stack trace |
| `/maintenance` | `We'll be back soon.` | status page, retry | 503 | ETA only if verified |
| `/offline` | `You're offline.` | reconnect, cached approved content | navigator network status | avoid false "saved" claims |
| `/blocked` | `This connection is unavailable.` | Safety centre | block/decline | don't reveal which side blocked |

All error pages designed separately in light/dark at 320/768/1440, with copy localized and no whimsical animation during safety/payment failures.

## Motion behaviors
Sign-in: subtle 150–220ms form state only; no looping photo pan. Validation errors instant except subtle shake prohibited (can feel punitive). Profile photo gallery: 180ms fade or shared layout but no image zoom beyond safe areas; full-screen Lightbox closes with Esc/back; respect reduced motion. Mode selection 180ms border/scale and focus indicator; quiz steps ≤220ms via AnimatePresence mode wait; 404 original tiny static artwork and no forced animation. Use Motion APIs, never invent external plugin dependencies.

## Testing acceptance
Full Playwright routes across 3 viewport classes, keyboard-only sign-in/reset/choose mode/upload/crop/delete/report, screen readers, network interruption, expired signed URL, blocked media retrieval, mode visibility, EXIF no GPS, photo rejection and appeals, offline retry and reduced motion. A screenshot preview is insufficient; assert DOM interactions and backend HTTP statuses.
