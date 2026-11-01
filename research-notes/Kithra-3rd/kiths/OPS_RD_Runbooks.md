# OPS-RD — On-Call, Support, Incident, Retention, Moderation

## Operating ownership
App needs actual people for abuse escalations, disputes and data rights even if Cloudflare costs little. Assign at least one accountable primary and backup responder, with formal on-call coverage proportional to high-severity report obligations; do not publish a grievance mailbox no one checks. Staffing and coverage are financial requirements, not optional infrastructure.

## Moderation playbook
Intake report → classify severity and category → acknowledge with ticket ID → safety precautions / emergency referral if necessary → collect permitted evidence (minimum) → action and reviewer note → notify involved parties within policy/law → allow appeal → close case with retention label. Maintain reporting taxonomy and abuse false-positive review; staff wellness protections; access to intimate imagery limited and monitored.

## Operations jobs
Daily: check queues/DLQ, moderation SLA, payment webhook backlog, rights requests, secret expiry, failed backups, service probes and spending. Weekly: reconcile invoices, refund ledger, image access anomaly, abuse attacks, feature flags and alert noise. Monthly: restore sample backup to isolated environment, verify permission matrix on staging, cost/retention dashboard, update dependencies and deletion reconciliation. Quarterly: staff access and consent policy review, load/security drill and vendor terms.

## Incident levels
SEV1 exposure/abuse/major outage; SEV2 payments or severe feature degradation; SEV3 isolated bug; SEV4 cosmetic. Incident log stores UTC incident ID, owner, timeline, scope, mitigation, reproducibility, customer impact, legal reporting assessment, postmortem and prevention. Never imply severity estimates are legal categories. Notification templates must be reviewed and factual.

## Disaster recovery
Encrypt offsite backups; restore procedures for both D1 snapshots/R2 and PG/WAL/S3/Redis config; test account-mode-photo access revocation after restore, reprocess deletion tombstones and payment webhooks. Migration fallback documented. Target RPO/RTO from NFR must be proven under exercises, not asserted.

## SLO & budgets
Service status dashboard: Core API, Auth, DB, R2, message delivery, queues, email, payments; map to meaningful user paths and regional latency. Cloudflare and Node telemetry standardized (OTel attributes); do not log questionnaire responses/DM bodies. Budget alerts based on request/rows/DO hours/media/SMS/verification/support tickets; notify before spending spikes.
