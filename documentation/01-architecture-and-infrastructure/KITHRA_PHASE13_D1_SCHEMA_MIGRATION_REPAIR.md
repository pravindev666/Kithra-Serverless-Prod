# KITHRA — PHASE 13: D1 SCHEMA MIGRATION REPAIR & TABLE TRANSFORMATION
## Root Cause Analysis and Authoritative Migration Fix

**Target Database:** Cloudflare D1 `kithra-d1-staging` (`29e46034-e38b-4ca3-ad04-1174aa7d3e0f`, Singapore APAC colo)  
**Issue:** SQLite Schema Collision during index creation on legacy `conversations` / `messages` tables.

---

### 1. Root Cause Analysis

In earlier iterations of Kithra, `migrations/0002_phase4_production_auth_d1.sql` had defined prototype tables for `conversations` and `messages`. These prototype tables had fields such as `member_one_id` and lacked the relational keys required by the Phase 11 & Phase 13 pair architecture (`pair_id`, `is_unsent`, `unsent_at`, `idempotency_key`, `sent_at`).

When `migrations/0004_phase11_pair_relationships_and_introductions.sql` executed `CREATE TABLE IF NOT EXISTS conversations (...)` followed by:
```sql
CREATE INDEX IF NOT EXISTS idx_conversations_pair ON conversations(pair_id);
```
SQLite encountered an error:
```
Error: near line 51: no such column: pair_id
```
Because the table already existed without the `pair_id` column, `IF NOT EXISTS` silently skipped table creation, causing index creation on the missing column to fail fatally.

---

### 2. Migration Repair Strategy

To ensure zero downtime, idempotency, and compatibility with Cloudflare D1 and SQLite engines, we implemented an authoritative table transformation pattern:

1. **Temporary Staging Tables:** Created `conversations_v2` and `messages_v2` with complete relational constraints, foreign keys to `pair_relationships(pair_id)` and `users(id)`, and indexes.
2. **Safe Data Migration:** Copied existing conversation records where applicable.
3. **Atomic Table Swapping:** Dropped legacy tables and renamed `conversations_v2` $\rightarrow$ `conversations`, and `messages_v2` $\rightarrow$ `messages`.
4. **Visibility & Participation Ledgers:** Created `conversation_participants` and `message_visibility` tables with foreign keys and compound unique keys.

The repaired migrations were applied to Cloudflare D1 staging:
- `migrations/0004_phase11_pair_relationships_and_introductions.sql` (Replaced with table-transformation migration)
- `migrations/0005_phase13_message_visibility_and_suppression.sql` (Idempotent visibility ledger and indices)

Both migrations executed successfully with exit code 0.

---

### 3. Production Schema Definition

```sql
-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  pair_id TEXT NOT NULL,
  space TEXT NOT NULL CHECK (space IN ('friendship', 'dating', 'matrimony', 'cofounders')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (pair_id) REFERENCES pair_relationships(pair_id) ON DELETE CASCADE
);

-- Conversation Participants Ledger
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  is_hidden INTEGER NOT NULL DEFAULT 0,
  unread_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (conversation_id, member_id),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at INTEGER NOT NULL,
  delivered_at INTEGER,
  read_at INTEGER,
  is_unsent INTEGER NOT NULL DEFAULT 0,
  unsent_at INTEGER,
  idempotency_key TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Message Visibility Ledger (Delete for Me)
CREATE TABLE IF NOT EXISTS message_visibility (
  message_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  is_hidden INTEGER NOT NULL DEFAULT 0,
  hidden_at INTEGER,
  PRIMARY KEY (message_id, member_id),
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);
```
