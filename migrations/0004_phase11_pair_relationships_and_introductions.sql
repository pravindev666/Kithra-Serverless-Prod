-- Migration: 0004_phase11_pair_relationships_and_introductions.sql
-- Kithra Phase 11 & Phase 13: Authoritative Pair Relationship Ledger, Introductions & Reconciled Messaging Schema
-- Enforces Founder's Master Invariant: "One pair, one active connection context by default."
-- Reconciles legacy Phase 4 schema with Phase 11 pair model and Phase 13 deletion/visibility controls.

PRAGMA foreign_keys = OFF;

-- 1. Pair Relationships Table (Canonical pair ledger with bidirectional symmetry)
CREATE TABLE IF NOT EXISTS pair_relationships (
  pair_id TEXT PRIMARY KEY,
  member_a_id TEXT NOT NULL,
  member_b_id TEXT NOT NULL,
  active_space TEXT CHECK(active_space IN ('friendship', 'dating', 'matrimony', 'cofounders')),
  relationship_state TEXT NOT NULL CHECK(relationship_state IN (
    'none', 'pending_introduction', 'accepted_connection', 'declined', 'withdrawn', 'expired', 'disconnected', 'blocked'
  )),
  suppression_status TEXT NOT NULL DEFAULT 'none' CHECK(suppression_status IN (
    'none', 'all_spaces_suppressed', 'space_suppressed'
  )),
  initiated_by TEXT NOT NULL,
  connected_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (member_a_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (member_b_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pair_relationships_member_a ON pair_relationships(member_a_id);
CREATE INDEX IF NOT EXISTS idx_pair_relationships_member_b ON pair_relationships(member_b_id);
CREATE INDEX IF NOT EXISTS idx_pair_relationships_state ON pair_relationships(relationship_state);

-- 2. Introductions Table
CREATE TABLE IF NOT EXISTS introductions (
  id TEXT PRIMARY KEY,
  pair_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  intention TEXT NOT NULL CHECK(intention IN ('friendship', 'dating', 'matrimony', 'cofounders')),
  note_text TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'sent' CHECK(state IN ('sent', 'accepted', 'declined', 'withdrawn', 'expired')),
  created_at INTEGER NOT NULL,
  responded_at INTEGER,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (pair_id) REFERENCES pair_relationships(pair_id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_introductions_pair ON introductions(pair_id);
CREATE INDEX IF NOT EXISTS idx_introductions_sender ON introductions(sender_id);
CREATE INDEX IF NOT EXISTS idx_introductions_receiver ON introductions(receiver_id);
CREATE INDEX IF NOT EXISTS idx_introductions_state ON introductions(state);

-- 3. Upgrade mode_personas to support 'cofounders' intention space
CREATE TABLE IF NOT EXISTS mode_personas_v2 (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  intention TEXT NOT NULL CHECK(intention IN ('friendship', 'dating', 'matrimony', 'cofounders')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
  headline TEXT,
  bio TEXT,
  pace_note TEXT,
  city TEXT NOT NULL,
  neighborhood TEXT,
  interests TEXT,
  languages TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, intention)
);
INSERT OR IGNORE INTO mode_personas_v2 SELECT * FROM mode_personas;
DROP TABLE IF EXISTS mode_personas;
ALTER TABLE mode_personas_v2 RENAME TO mode_personas;
CREATE INDEX IF NOT EXISTS idx_mode_personas_user ON mode_personas(user_id, intention);

-- 4. Reconcile conversations: pair-backed + legacy-preserving table transformation
CREATE TABLE IF NOT EXISTS conversations_v2 (
  id TEXT PRIMARY KEY,
  pair_id TEXT UNIQUE,
  space TEXT NOT NULL CHECK(space IN ('friendship', 'dating', 'matrimony', 'cofounders')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'archived', 'blocked')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (pair_id) REFERENCES pair_relationships(pair_id) ON DELETE CASCADE
);

-- Copy existing conversations if any (map legacy 'intention' to 'space')
INSERT OR IGNORE INTO conversations_v2 (id, space, status, created_at, updated_at)
SELECT id, intention, status, created_at, updated_at FROM conversations;

DROP TABLE IF EXISTS conversations;
ALTER TABLE conversations_v2 RENAME TO conversations;
CREATE INDEX IF NOT EXISTS idx_conversations_pair ON conversations(pair_id);

-- 5. Reconcile messages: real content + deletion/unsend support + legacy ciphertext columns
CREATE TABLE IF NOT EXISTS messages_v2 (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT,
  content TEXT NOT NULL DEFAULT '',
  ciphertext TEXT,
  initialization_vector TEXT,
  is_unsent INTEGER NOT NULL DEFAULT 0 CHECK(is_unsent IN (0, 1)),
  unsent_at INTEGER,
  sent_at INTEGER NOT NULL,
  read_at INTEGER,
  idempotency_key TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Copy legacy messages if any
INSERT OR IGNORE INTO messages_v2 (id, conversation_id, sender_id, ciphertext, initialization_vector, sent_at, read_at)
SELECT id, conversation_id, sender_id, ciphertext, initialization_vector, sent_at, read_at FROM messages;

DROP TABLE IF EXISTS messages;
ALTER TABLE messages_v2 RENAME TO messages;
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- 6. Conversation Participants / Per-Member Visibility (Phase 13 P7: Delete Conversation for Me)
CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK(is_hidden IN (0, 1)),
  hidden_at INTEGER,
  last_read_at INTEGER,
  unread_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (conversation_id, member_id),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conv_participants_member ON conversation_participants(member_id, is_hidden);

-- 7. Message Visibility (Phase 13 P6: Delete Message for Me)
CREATE TABLE IF NOT EXISTS message_visibility (
  message_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  is_hidden INTEGER NOT NULL DEFAULT 0 CHECK(is_hidden IN (0, 1)),
  hidden_at INTEGER NOT NULL,
  PRIMARY KEY (message_id, member_id),
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_msg_visibility_member ON message_visibility(member_id, is_hidden);

PRAGMA foreign_keys = ON;
