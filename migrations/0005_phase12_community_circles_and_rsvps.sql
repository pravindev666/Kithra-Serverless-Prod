-- Migration: 0005_phase12_community_circles_and_rsvps.sql
-- Kithra Phase 12: Authoritative Community Circles, RSVP, Invitations & Gathering Salon Schema
-- Enforces: Member-created circles restricted strictly to 'friendship' and 'cofounders'

PRAGMA foreign_keys = ON;

-- 1. Community Circles Table
CREATE TABLE IF NOT EXISTS community_circles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  intention TEXT NOT NULL CHECK(intention IN ('friendship', 'cofounders')),
  creator_id TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  city TEXT NOT NULL,
  format TEXT NOT NULL,
  cadence TEXT NOT NULL,
  cohort_comfort TEXT NOT NULL DEFAULT 'all_genders' CHECK(cohort_comfort IN ('all_genders', 'women_only', 'men_only')),
  target_lens TEXT NOT NULL DEFAULT 'all',
  tribe_theme TEXT,
  target_construct_id TEXT,
  target_affinity_trait TEXT,
  max_capacity INTEGER NOT NULL DEFAULT 16,
  member_count INTEGER NOT NULL DEFAULT 1,
  venue_details TEXT,
  upcoming_event_at INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'pending_steward_review', 'archived', 'cancelled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_community_circles_intention ON community_circles(intention);
CREATE INDEX IF NOT EXISTS idx_community_circles_city ON community_circles(city);
CREATE INDEX IF NOT EXISTS idx_community_circles_creator ON community_circles(creator_id);
CREATE INDEX IF NOT EXISTS idx_community_circles_status ON community_circles(status);

-- 2. Circle Memberships Table (RSVP, Roles, Attendance)
CREATE TABLE IF NOT EXISTS circle_memberships (
  id TEXT PRIMARY KEY,
  circle_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK(role IN ('host', 'cohost', 'member')),
  rsvp_status TEXT NOT NULL DEFAULT 'confirmed' CHECK(rsvp_status IN ('confirmed', 'waitlisted', 'cancelled', 'declined')),
  joined_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (circle_id) REFERENCES community_circles(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(circle_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_circle_memberships_circle ON circle_memberships(circle_id);
CREATE INDEX IF NOT EXISTS idx_circle_memberships_member ON circle_memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_circle_memberships_status ON circle_memberships(rsvp_status);

-- 3. Circle Invitations Table (User A -> User B Persisted Workflow)
CREATE TABLE IF NOT EXISTS circle_invitations (
  id TEXT PRIMARY KEY,
  circle_id TEXT NOT NULL,
  inviter_id TEXT NOT NULL,
  invitee_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'declined', 'ignored', 'reported')),
  lens_rationale TEXT,
  created_at INTEGER NOT NULL,
  responded_at INTEGER,
  FOREIGN KEY (circle_id) REFERENCES community_circles(id) ON DELETE CASCADE,
  FOREIGN KEY (inviter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invitee_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(circle_id, invitee_id)
);

CREATE INDEX IF NOT EXISTS idx_circle_invitations_invitee ON circle_invitations(invitee_id, status);
CREATE INDEX IF NOT EXISTS idx_circle_invitations_circle ON circle_invitations(circle_id);

-- 4. Gathering Salon Host Notices
CREATE TABLE IF NOT EXISTS circle_host_notices (
  id TEXT PRIMARY KEY,
  circle_id TEXT NOT NULL,
  host_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (circle_id) REFERENCES community_circles(id) ON DELETE CASCADE,
  FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_circle_host_notices_circle ON circle_host_notices(circle_id, created_at DESC);

-- 5. Gathering Salon Roundtable Reflections (Unhurried Discussion)
CREATE TABLE IF NOT EXISTS circle_reflections (
  id TEXT PRIMARY KEY,
  circle_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (circle_id) REFERENCES community_circles(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_circle_reflections_circle ON circle_reflections(circle_id, created_at ASC);

-- 6. Circle Audit Events Table
CREATE TABLE IF NOT EXISTS circle_audit_events (
  id TEXT PRIMARY KEY,
  circle_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_circle_audit_events_circle ON circle_audit_events(circle_id);

