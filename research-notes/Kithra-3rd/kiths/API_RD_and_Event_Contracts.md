# API-RD — Resource Endpoints, WebSocket and Event Semantics

## Global requirements
API prefix `/api/v1`; JSON UTF-8; session verified server-side, CSRF protection for cookie-authenticated writes, appropriate CORS; `Idempotency-Key` on mutation where replay dangerous; `X-Request-ID` round-tripped; `application/problem+json` for errors, `code` stable, `detail` user-safe; cursor pagination, max page size and consistent ordering. No auth/age/permission leak via 404 vs 403 for private profiles. Content-type and object size validation.

## Public
`GET /health/live`, `/health/ready` authenticated internal as needed; `GET /public/config`, `/public/pricing`, `/public/matching-explainer`, `/public/locales`; `POST /contact` with bot defense. Marketing no personalized member API.

## Identity & member
`GET /me`, `PATCH /me`, `POST /me/sessions/revoke`, `GET /me/sessions`, `GET /modes`, `POST /modes/{mode}/activate`, `POST /modes/{mode}/pause`, `GET/PATCH /modes/{mode}/profile`, `GET/PUT /modes/{mode}/consent`, `GET /modes/{mode}/visibility`, `POST /me/export`, `POST /me/delete`, `GET /me/rights-requests/{id}`. Every mode operation requires entitlement/consent/eligibility.

## Assessment & matching
`GET /assessments/themes`, `GET /assessments/banks/{id}`, `POST /assessments/sessions`, `PUT /assessments/sessions/{id}/answers`, `POST /assessments/sessions/{id}/submit`, `GET /patterns`, `GET /modes/{mode}/matches?lens=echo|counterpoint|mosaic`, `GET /modes/{mode}/matches/{target}/why`, `POST /patterns/withdraw`; server returns scored version and coverage. Avoid returning raw answer set of another person.

## Social & media
`POST/GET /connections/requests`, `POST /connections/requests/{id}/accept`, `.../decline`, `GET /conversations`, `GET/POST /conversations/{id}/messages`, `GET/POST /circles`, `POST /circles/{id}/join`, `POST /media/upload-intent`, `POST /media/{id}/complete`, `GET /media/{id}/access`, `PATCH /media/{id}/visibility`, `DELETE /media/{id}`. Authz on signed GET/PUT and every conversation membership check. Media response headers must not expose upload credentials.

## Safety, support, payments
`POST /users/{id}/block`, `POST /reports`, `GET /reports/{id}/status`, `POST /appeals`, `POST /support/tickets`, `GET /billing/plans`, `POST /billing/checkout`, `POST /billing/webhooks/{provider}` with signature verification, `POST /billing/cancel`, `GET /billing/invoices`, `POST /billing/refund-request`, `GET /notifications`. 2xx webhook ACK means safely queued/durable, not successfully provisioned.

## Admin (server RBAC enforced)
`GET /staff/cases`, `GET /staff/cases/{id}`, `POST /staff/cases/{id}/assign`, `POST /staff/cases/{id}/action`, `POST /staff/cases/{id}/evidence-grant`, `GET /staff/photos/pending`, `POST /staff/photos/{id}/review`, `POST /staff/roles/grants`, `GET /staff/audit`, `GET /staff/rights`, `POST /staff/rights/{id}/resolve`, `POST /staff/assessments/banks/{id}/publish`, `POST /staff/scoring/{id}/release`, `POST /staff/billing/refunds/{id}`. Require staff reauth for privileged operations; segregation of duties as policy.

## Realtime and jobs
`GET /realtime/token` issues short-lived room-scoped auth for DO or Node WebSocket, verified at handshake AND revocation. Events: `message.created`, `message.read`, `connection.accepted`, `report.status_changed`, `user.mode_paused`, `moderation.content_removed`. Per-conversation sequence monotonic, reconnection gets messages from cursor; backpressure and rate limit. Queue jobs idempotent with bounded retry and DLQ; no personal data in webhook logs.

## Implementation quality
Generate OpenAPI from tested route schemas. Contract tests run against Cloudflare local and Node API; prohibit ghost endpoints and mock-only promises. See `16_SCAFFOLD/openapi.yaml` for baseline route inventory, not substitute for full request/response schema implementation.
