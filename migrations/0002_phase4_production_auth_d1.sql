-- Migration: 0002_phase4_production_auth_d1.sql
-- Production Cloudflare D1 Relational Schema for Kithra Phase 4

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone_hash TEXT,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('member', 'moderator', 'admin', 'auditor')),
  is_adult_verified INTEGER NOT NULL DEFAULT 0 CHECK(is_adult_verified IN (0, 1)),
  email_verified INTEGER NOT NULL DEFAULT 0 CHECK(email_verified IN (0, 1)),
  account_status TEXT NOT NULL DEFAULT 'active' CHECK(account_status IN ('active', 'suspended', 'deletion_pending', 'deleted')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deletion_requested_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS external_identities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK(provider IN ('google.com', 'apple.com', 'phone', 'password')),
  provider_subject_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(provider, provider_subject_id)
);

CREATE INDEX IF NOT EXISTS idx_external_identities_user_id ON external_identities(user_id);

CREATE TABLE IF NOT EXISTS mode_personas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  intention TEXT NOT NULL CHECK(intention IN ('friendship', 'dating', 'matrimony')),
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

CREATE INDEX IF NOT EXISTS idx_mode_personas_user_intent ON mode_personas(user_id, intention);
CREATE INDEX IF NOT EXISTS idx_mode_personas_city ON mode_personas(city);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  semantic_id TEXT NOT NULL,
  displayed_option_index INTEGER NOT NULL CHECK(displayed_option_index >= 0),
  response_latency_ms INTEGER NOT NULL DEFAULT 0,
  answered_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_user ON quiz_answers(user_id);

CREATE TABLE IF NOT EXISTS trait_snapshots (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  construct_id TEXT NOT NULL,
  normalized_score REAL NOT NULL CHECK(normalized_score >= 0.0 AND normalized_score <= 100.0),
  confidence_band TEXT NOT NULL CHECK(confidence_band IN ('provisional', 'developing', 'established')),
  item_coverage_count INTEGER NOT NULL DEFAULT 0,
  calculated_at INTEGER NOT NULL,
  engine_version TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, construct_id)
);

CREATE INDEX IF NOT EXISTS idx_trait_snapshots_user ON trait_snapshots(user_id);

CREATE TABLE IF NOT EXISTS member_eligibility (
  user_id TEXT PRIMARY KEY,
  relationship_structure TEXT NOT NULL DEFAULT 'exclusive_required' CHECK(relationship_structure IN (
    'exclusive_required', 'exclusive_preferred', 'open_required', 'open_preferred', 'flexible_either', 'unknown', 'prefer_not_to_answer'
  )),
  children_preference TEXT NOT NULL DEFAULT 'unknown' CHECK(children_preference IN (
    'wants_children', 'does_not_want_children', 'open_or_flexible', 'open_or_unsure', 'unknown', 'prefer_not_to_answer'
  )),
  children_requirement_level TEXT NOT NULL DEFAULT 'flexible' CHECK(children_requirement_level IN ('essential', 'flexible', 'prefer_not_to_answer')),
  smoking_habit TEXT NOT NULL DEFAULT 'unknown' CHECK(smoking_habit IN ('non_smoker', 'occasional_social_smoker', 'regular_smoker', 'vape_only', 'prefer_not_to_say', 'unknown')),
  smoking_comfort TEXT NOT NULL DEFAULT 'unknown' CHECK(smoking_comfort IN ('smoke_free_only', 'outdoors_only', 'fully_comfortable', 'prefer_not_to_say', 'unknown')),
  partner_smoking_dating TEXT NOT NULL DEFAULT 'no_preference' CHECK(partner_smoking_dating IN ('must_be_non_smoker', 'occasional_or_vape_acceptable', 'no_preference', 'prefer_not_to_say', 'unknown')),
  partner_smoking_matrimony TEXT NOT NULL DEFAULT 'no_preference' CHECK(partner_smoking_matrimony IN ('must_be_non_smoker', 'occasional_or_vape_acceptable', 'no_preference', 'prefer_not_to_say', 'unknown')),
  partner_smoking_friendship TEXT NOT NULL DEFAULT 'no_preference',
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS match_snapshots (
  id TEXT PRIMARY KEY,
  viewer_id TEXT NOT NULL,
  candidate_id TEXT NOT NULL,
  intention TEXT NOT NULL CHECK(intention IN ('friendship', 'dating', 'matrimony')),
  attribute_similarity REAL,
  is_stage_a_eligible INTEGER NOT NULL CHECK(is_stage_a_eligible IN (0, 1)),
  ineligibility_reasons TEXT,
  complementarity_score REAL,
  calculated_at INTEGER NOT NULL,
  engine_version TEXT NOT NULL,
  FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(viewer_id, candidate_id, intention)
);

CREATE INDEX IF NOT EXISTS idx_match_snapshots_viewer ON match_snapshots(viewer_id, intention);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  initiator_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  intention TEXT NOT NULL CHECK(intention IN ('friendship', 'dating', 'matrimony')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'archived', 'blocked')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(initiator_id, recipient_id, intention)
);

CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(initiator_id, recipient_id);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  ciphertext TEXT NOT NULL,
  initialization_vector TEXT NOT NULL,
  sent_at INTEGER NOT NULL,
  read_at INTEGER,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, sent_at);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action, timestamp);

