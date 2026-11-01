# Kithra — AGY Backend Integration Handoff (`AGY_BACKEND_HANDOFF.md`)

**Scope of this repository:** Pure frontend UI/UX shell built with React 19, TypeScript, Tailwind CSS v4, and `motion/react`.
**Boundary:** No production backend, database, Firebase, Cloudflare Workers, live authentication, real file upload storage, payment gateway, or AI/LLM matching service is implemented in this repository. All unused AI/backend dependencies (`@google/genai`, `express`, `dotenv`) have been removed.

---

## 1. Frontend Pathname Route Contract (`src/utils/kithraLogic.ts`)

The shell uses real browser pathname routing (`window.history.pushState` + `popstate` listener) parsed deterministically via `parsePathnameToRoute(pathname)`. Configure the hosting edge (Cloudflare Pages / Nginx / CDN) to rewrite all non-asset requests to `/index.html`.

| Route Path | Frontend Component | Backend / API Seam for AGY |
|---|---|---|
| `/` | `LandingView` + `CoromandelThreadsHero` | Public cacheable marketing shell; supports `/#intentions`, `/#how-it-works`, `/#compatibility` anchors |
| `/signin`, `/join`, `/forgot-password`, `/verify-email`, `/locked` | `AuthView` | Connect to passwordless email OTP / passkey / session endpoints (`POST /api/v1/auth/*`) |
| `/onboarding` | `OnboardingView` (5 steps) | Persist initial `activeIntentions`, `pacePreference`, and primary city (`PUT /api/v1/me/onboarding`) |
| `/pricing` | `PricingView` | Render regional pricing tiers (`Free`, `Plus`, `Connect`) and initiate checkout (`POST /api/v1/billing/checkout`) |
| `/member` | `MemberShell` (`activeTab="home"`) | Fetch member summary, active intentions, and daily curated reflections (`GET /api/v1/me/dashboard`) |
| `/member/discover` | `MemberShell` (`activeTab="discover"`) | Fetch intention-scoped discovery profiles (`GET /api/v1/discover?intention=friendship\|dating\|matrimony`) |
| `/member/match/:id` | `MemberShell` (`activeTab="match"`) | Fetch deterministic `Echo`, `Counterpoint`, and `Mosaic Fit` explanation + optional Measured Alignment sheet (`GET /api/v1/matches/:id/explanation`) |
| `/member/assessments` | `MemberShell` (`activeTab="assessments"`) | Fetch/save responses across the 5-theme 100-question reflection bank (`PUT /api/v1/me/assessments/:questionId`) |
| `/member/messages` | `MemberShell` (`activeTab="messages"`) | Intention-tagged conversation threads (`GET /api/v1/threads`, `POST /api/v1/threads/:id/messages`) |
| `/member/groups` | `MemberShell` (`activeTab="groups"`) | Moderated small-group Circles & RSVP endpoints (`POST /api/v1/circles/:id/rsvp`) |
| `/member/photos` | `MemberShell` (`activeTab="photos"`) | Presigned upload URL + 4:5 crop transform + per-intention visibility matrix (`PATCH /api/v1/me/photos/:id`) |
| `/member/privacy` | `MemberShell` (`activeTab="privacy"`) | DPDP/GDPR JSON export, per-intention history clear, account pause/delete (`POST /api/v1/me/privacy/*`) |
| `/member/settings` | `MemberShell` (`activeTab="settings"`) | Update active intentions, pace note, theme, and reduced-motion preference |
| `/member/more` | `MemberShell` (`activeTab="more"`) | Mobile secondary navigation hub linking to Reflections, Circles, Privacy, Settings, and Membership |
| `/admin/login` | `AdminLoginView` | Dedicated staff WebAuthn / FIDO2 login gate (`POST /api/v1/staff/webauthn/challenge`) |
| `/admin/overview` .. `/admin/audit` | `AdminShell` | Role-gated staff queues (Reports, Photo Review, Users, Circles, Support, Subscriptions, Privacy, RBAC, Audit) |
| `/404`, `/403`, `/410`, `/429`, `/500`, `/503`, `/offline`, `/empty`, `/loading`, `/image-error` | `SystemStatesView` (`isDevPreviewRoute=false`) | Clean standalone product error & fallback pages |
| `/__preview` | `SystemStatesView` (`isDevPreviewRoute=true`) | Developer-only QA route & clickable route inventory (exclude or gate in production edge config) |

---

## 2. Relationship Design Vocabulary & Deterministic Matching Contract (`Echo`, `Counterpoint`, `Mosaic Fit`)

Kithra **never** uses LLM/AI compatibility predictions, "AI twins", or guaranteed soulmate percentages. Instead, the backend rules engine compares versioned questionnaire responses across the 100-question bank and returns structured qualitative signals plus optional non-predictive alignment bands:

```ts
export type RelationshipSignalKind = 'echo' | 'counterpoint' | 'mosaic';

export interface MeasuredAlignmentDimension {
  id: string;
  theme: string; // e.g. 'Daily Rhythm & Domestic Life'
  kind: RelationshipSignalKind;
  bandLabel: string; // e.g. 'High alignment band (80–90% questionnaire overlap)' — never a predictive outcome score
  memberAnswerSummary: string;
  candidateAnswerSummary: string;
  whyItMatters: string;
  conversationPrompt: string;
}
```

- **Echo (`kind: 'echo'`)**: Measured similarities in daily rhythm, communication cadence, or values.
- **Counterpoint (`kind: 'counterpoint'`)**: Significant differences surfaced early so neither person is surprised later.
- **Mosaic Fit (`kind: 'mosaic'`)**: Complementary strengths where two different habits balance each other constructively.

---

## 3. Photo Studio, 4:5 Crop Transform & Intention Visibility Contract (`/member/photos`)

The frontend `PhotoManager` supports local file selection (`URL.createObjectURL` preview), client-side 4:5 crop/zoom/pan/rotation adjustments (`applyPhotoCropAdjustment`), primary photo designation, reorder, delete confirmation, and independent per-intention visibility switches (`friendship`, `dating`, `matrimony`) with **zero automatic crossover**.

When AGY connects object storage (e.g., Cloudflare R2 / S3 with signed URLs):
1. Request presigned upload URL (`POST /api/v1/me/photos/upload-url`).
2. Persist crop metadata and intention visibility (`PUT /api/v1/me/photos/:photoId`):
   ```json
   {
     "caption": "Morning filter coffee on the verandah",
     "isPrimary": true,
     "crop": { "zoom": 1.15, "panX": -10, "panY": 5, "rotation": 0 },
     "visibility": {
       "friendship": true,
       "dating": false,
       "matrimony": true
     }
   }
   ```
3. Enforce server-side authorization so a photo where `visibility[intention] === false` is never returned in discovery or match payloads for that intention.
