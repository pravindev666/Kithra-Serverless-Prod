-- Migration: 0003_phase8_staging_blocks_reports.sql
-- Kithra Phase 8: Staging Safety Tables & DPDP Act 2023 Statutory Compliance

PRAGMA foreign_keys = ON;

-- 1. Member Blocking Table (Mutual Exclusion Architecture)
CREATE TABLE IF NOT EXISTS member_blocks (
  id TEXT PRIMARY KEY,
  blocker_id TEXT NOT NULL,
  blocked_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(blocker_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_member_blocks_blocker ON member_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_member_blocks_blocked ON member_blocks(blocked_id);

-- 2. Member Safety Reports Table (Confidential Trust & Safety Cases)
CREATE TABLE IF NOT EXISTS member_reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL,
  reported_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN (
    'Impersonation concern',
    'Photo report',
    'Group moderation',
    'Boundary concern',
    'Account verification'
  )),
  summary TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'under_review', 'resolved', 'dismissed')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reported_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_member_reports_status ON member_reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_member_reports_reported ON member_reports(reported_id);

