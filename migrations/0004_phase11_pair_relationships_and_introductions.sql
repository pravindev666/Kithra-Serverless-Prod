-- Migration: 0004_phase11_pair_relationships_and_introductions.sql
-- Kithra Phase 11: Authoritative Pair Relationship Ledger & Introductions
-- Enforces Founder's Master Invariant: "One pair, one active connection context by default."

PRAGMA foreign_keys = ON;

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

-- 3. In-App Conversations (Created upon accepted_connection)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  pair_id TEXT NOT NULL UNIQUE,
  space TEXT NOT NULL CHECK(space IN ('friendship', 'dating', 'matrimony', 'cofounders')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'archived', 'blocked')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (pair_id) REFERENCES pair_relationships(pair_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conversations_pair ON conversations(pair_id);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, sent_at);

