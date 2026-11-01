# D1 ↔ PostgreSQL migration contract (implementation checklist)
`contracts/schema.sql` is a starter D1 schema with 31 validated SQLite tables. `postgres/0001_parity_starter.sql` is a **representative subset**, not a parity-complete migration. Do not deploy production until every D1 domain entity, index, retention job, access rule and query is implemented in PostgreSQL and verified in CI.

1. Audit canonical data dictionary (`08_REFERENCE/07_DRD...`) and check requirements register. Maintain explicit migrations for SQLite and PostgreSQL; never apply SQLite DDL to PostgreSQL by blind string replacement.
2. Map SQLite `TEXT` UUIDs to PG UUID and any booleans to `boolean`; map integer epoch time to timezone-aware UTC timestamps; money in integer minor units; JSON to JSONB with consistent ordering/semantic comparison; treat null and foreign-key constraints explicitly.
3. Build both repository adapters behind the same TypeScript ports and run the same 150 acceptance requirements and golden scoring datasets.
4. For migration: pause writes or implement a rigorously tested outbox/high-water mark, export D1, transform, import to PG, verify counts/referential integrity/cryptographic row hashes by privacy-safe partition, reconcile payment ledgers, reset/restore websocket state and job queue while preserving idempotency.
5. Canary on staging with synthetic 100/1K/5K/100K datasets; measure performance and storage; test cutover and rollback under failures.
6. Reconcile opt-in modes, delete/withdrawn users, blocks and staff RBAC before enabling discovery; do not reactivate deleted profiles because of an export snapshot.
7. Automate restore drills and record owner approvals. Neither migration nor the Docker Compose project in this kit is production-complete without this work.
