# UAT + Safety Release Gates

Every screen in `12_REGISTERS/SCREENS.csv` must have `owner`, `implemented_route`, `api`, `empty_loading_error`, `light_dark`, `motion`, `a11y`, `test_id`, `evidence_url`, `cloudflare_pass`, `server_pass`, `security_review` and `status`. Blank status means NOT DONE.

## High-impact blockers
Unauthorized staff access; missing or bypassable MFA; any raw questionnaire visible to non-user by default; photo cross-mode leak or public media URL; any message after block; incomplete cancellation/refund/data deletion; missing urgent complaint escalation; actual phone OTP not verified; fake match explanations; nonreproducible scoring; fake clinical/marriage outcome claims; secrets in repo; live payment grants without webhook signature. Any = release blocked.

## Paired review/acceptance
Product owner signs all member journeys and inclusive identity; UX lead signs accessible responsive themes/motion; backend lead signs deterministic and multi-runtime parity; trust&safety lead signs reports, emergency handling and case operations; privacy lawyer signs applicable requirements; security reviewer signs ASVS/threat model; financial lead signs pricing/taxes; SRE signs deployed monitors/backup/rollback. AI Studio-generated code cannot sign these itself.
