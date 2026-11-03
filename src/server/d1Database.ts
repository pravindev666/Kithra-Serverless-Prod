/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA CLOUDFLARE D1 DATABASE ACCESS LAYER
 * 
 * Provides concrete SQL query execution against Cloudflare D1 relational database bindings,
 * adhering to the 0002 and 0003 migration schemas, DPDP Act 2023 Section 12 data erasure,
 * and zero raw-answer leakage.
 */

import { D1Database, D1PreparedStatement } from './worker';
import { ExtendedIntentionId, CircleProposalInput, MemberProfile } from '../types/kithra';
import { memberStore } from '../domain/memberStore';

export interface D1QuizAnswerRecord {
  id: string;
  user_id: string;
  question_id: string;
  option_id: string;
  semantic_id: string;
  displayed_option_index: number;
  response_latency_ms: number;
  answered_at: number;
}

export interface D1TraitSnapshotRecord {
  id: string;
  user_id: string;
  construct_id: string;
  normalized_score: number;
  confidence_band: 'provisional' | 'developing' | 'established';
  item_coverage_count: number;
  calculated_at: number;
  engine_version: string;
}

export interface D1BlockRecord {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: number;
}

export interface D1ReportRecord {
  id: string;
  reporter_id: string;
  reported_id: string;
  category: string;
  summary: string;
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  created_at: number;
  updated_at: number;
}

export interface D1PairRelationshipRecord {
  pair_id: string;
  member_a_id: string;
  member_b_id: string;
  active_space: ExtendedIntentionId | null;
  relationship_state: 'none' | 'pending_introduction' | 'accepted_connection' | 'declined' | 'withdrawn' | 'expired' | 'disconnected' | 'blocked';
  suppression_status: 'none' | 'all_spaces_suppressed' | 'space_suppressed';
  initiated_by: string;
  connected_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface D1IntroductionRecord {
  id: string;
  pair_id: string;
  sender_id: string;
  receiver_id: string;
  intention: ExtendedIntentionId;
  note_text: string;
  state: 'sent' | 'accepted' | 'declined' | 'withdrawn' | 'expired';
  created_at: number;
  responded_at: number | null;
  expires_at: number;
}

export interface D1UserRecord {
  id: string;
  email: string;
  phone_hash?: string | null;
  display_name: string;
  role: 'member' | 'moderator' | 'admin' | 'auditor';
  is_adult_verified: number;
  email_verified: number;
  account_status: 'active' | 'suspended' | 'deletion_pending' | 'deleted';
  created_at: number;
  updated_at: number;
  deletion_requested_at?: number | null;
}

export interface D1ExternalIdentityRecord {
  id: string;
  user_id: string;
  provider: 'google.com' | 'apple.com' | 'phone' | 'password';
  provider_subject_id: string;
  created_at: number;
}

export interface D1ModePersonaRecord {
  id: string;
  user_id: string;
  intention: ExtendedIntentionId;
  is_active: number;
  headline?: string | null;
  bio?: string | null;
  pace_note?: string | null;
  city: string;
  neighborhood?: string | null;
  interests?: string | null;
  languages?: string | null;
  created_at: number;
  updated_at: number;
}

export interface D1ConversationRecord {
  id: string;
  pair_id: string;
  space: ExtendedIntentionId;
  status: 'active' | 'archived' | 'blocked';
  created_at: number;
  updated_at: number;
}

export interface D1ConversationParticipantRecord {
  conversation_id: string;
  member_id: string;
  is_hidden: number;
  hidden_at?: number | null;
  last_read_at?: number | null;
  unread_count: number;
  created_at: number;
  updated_at: number;
}

export interface D1MessageRecord {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: number;
  is_unsent?: number;
  unsent_at?: number | null;
  read_at?: number | null;
  idempotency_key?: string | null;
  ciphertext?: string | null;
  initialization_vector?: string | null;
}

export interface D1MessageVisibilityRecord {
  message_id: string;
  member_id: string;
  is_hidden: number;
  hidden_at: number;
}

export interface D1CommunityCircleRecord {
  id: string;
  title: string;
  description: string;
  intention: 'friendship' | 'cofounders';
  creator_id: string;
  creator_name: string;
  city: string;
  format: string;
  cadence: string;
  cohort_comfort: 'all_genders' | 'women_only' | 'men_only';
  target_lens: string;
  tribe_theme: string | null;
  target_construct_id: string | null;
  target_affinity_trait: string | null;
  max_capacity: number;
  member_count: number;
  venue_details: string | null;
  upcoming_event_at: number | null;
  status: 'active' | 'pending_steward_review' | 'archived' | 'cancelled';
  created_at: number;
  updated_at: number;
}

export interface D1CircleMembershipRecord {
  id: string;
  circle_id: string;
  member_id: string;
  role: 'host' | 'cohost' | 'member';
  rsvp_status: 'confirmed' | 'waitlisted' | 'cancelled' | 'declined';
  joined_at: number;
  updated_at: number;
}

export interface D1CircleInvitationRecord {
  id: string;
  circle_id: string;
  inviter_id: string;
  invitee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'ignored' | 'reported';
  lens_rationale: string | null;
  created_at: number;
  responded_at: number | null;
}

export interface D1CircleHostNoticeRecord {
  id: string;
  circle_id: string;
  host_id: string;
  title: string;
  content: string;
  created_at: number;
}

export interface D1CircleReflectionRecord {
  id: string;
  circle_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: number;
}

export interface D1CircleAuditEventRecord {
  id: string;
  circle_id: string;
  actor_id: string;
  action: string;
  metadata: string | null;
  created_at: number;
}

/**
 * Commutative canonical pair ID generator: pair_${min}_${max}
 */
export function getCanonicalPairId(memberId1: string, memberId2: string): string {
  const [first, second] = memberId1 < memberId2 ? [memberId1, memberId2] : [memberId2, memberId1];
  return `pair_${first}_${second}`;
}

/**
 * In-Memory SQLite-compatible D1 Mock for deterministic local test staging
 * when remote Cloudflare edge is uncredentialed.
 */
export class LocalD1DatabaseMock implements D1Database {
  private tables: {
    users: Map<string, Record<string, unknown>>;
    quiz_answers: Map<string, D1QuizAnswerRecord>;
    trait_snapshots: Map<string, D1TraitSnapshotRecord>;
    member_eligibility: Map<string, Record<string, unknown>>;
    member_blocks: Map<string, D1BlockRecord>;
    member_reports: Map<string, D1ReportRecord>;
    audit_logs: Map<string, Record<string, unknown>>;
    pair_relationships: Map<string, D1PairRelationshipRecord>;
    introductions: Map<string, D1IntroductionRecord>;
    conversations: Map<string, D1ConversationRecord>;
    messages: Map<string, D1MessageRecord>;
    community_circles: Map<string, D1CommunityCircleRecord>;
    circle_memberships: Map<string, D1CircleMembershipRecord>;
    circle_invitations: Map<string, D1CircleInvitationRecord>;
    circle_host_notices: Map<string, D1CircleHostNoticeRecord>;
    circle_reflections: Map<string, D1CircleReflectionRecord>;
    circle_audit_events: Map<string, D1CircleAuditEventRecord>;
    external_identities: Map<string, D1ExternalIdentityRecord>;
    mode_personas: Map<string, D1ModePersonaRecord>;
    conversation_participants: Map<string, D1ConversationParticipantRecord>;
    message_visibility: Map<string, D1MessageVisibilityRecord>;
  } = {
    users: new Map(),
    quiz_answers: new Map(),
    trait_snapshots: new Map(),
    member_eligibility: new Map(),
    member_blocks: new Map(),
    member_reports: new Map(),
    audit_logs: new Map(),
    pair_relationships: new Map(),
    introductions: new Map(),
    conversations: new Map(),
    messages: new Map(),
    community_circles: new Map(),
    circle_memberships: new Map(),
    circle_invitations: new Map(),
    circle_host_notices: new Map(),
    circle_reflections: new Map(),
    circle_audit_events: new Map(),
    external_identities: new Map(),
    mode_personas: new Map(),
    conversation_participants: new Map(),
    message_visibility: new Map(),
  };

  prepare(query: string): D1PreparedStatement {
    const trimmed = query.trim().replace(/\s+/g, ' ');

    const makeStatement = (boundValues: unknown[]): D1PreparedStatement => ({
      bind: (...newVals: unknown[]): D1PreparedStatement => {
        return makeStatement([...boundValues, ...newVals]);
      },
      first: async <T = unknown>(): Promise<T | null> => {
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM external_identities WHERE provider = ? AND provider_subject_id = ?')) {
          const [p, s] = boundValues as [string, string];
          for (const ext of this.tables.external_identities.values()) {
            if (ext.provider === p && ext.provider_subject_id === s) return (ext as T);
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM external_identities WHERE provider_subject_id = ?')) {
          const [s] = boundValues as [string];
          for (const ext of this.tables.external_identities.values()) {
            if (ext.provider_subject_id === s) return (ext as T);
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM users WHERE email = ?')) {
          const email = (boundValues[0] as string).toLowerCase().trim();
          for (const u of this.tables.users.values()) {
            if (((u as any).email as string)?.toLowerCase().trim() === email) return (u as T);
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM conversation_participants WHERE conversation_id = ? AND member_id = ?')) {
          const key = `${boundValues[0]}_${boundValues[1]}`;
          const row = this.tables.conversation_participants.get(key);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM messages WHERE idempotency_key = ?')) {
          const [k] = boundValues as [string];
          for (const m of this.tables.messages.values()) {
            if (m.idempotency_key === k) return (m as T);
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM messages WHERE id = ?')) {
          const row = this.tables.messages.get(boundValues[0] as string);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT id FROM member_blocks WHERE')) {
          const [m1, m2] = boundValues as [string, string];
          const b1 = this.tables.member_blocks.get(`${m1}_${m2}`) || this.tables.member_blocks.get(`${m2}_${m1}`);
          return (b1 as T) ?? null;
        }
        if (trimmed.startsWith('SELECT pair_id FROM pair_relationships WHERE')) {
          const [m1, m2] = boundValues as [string, string];
          for (const p of this.tables.pair_relationships.values()) {
            if ((p.member_a_id === m1 && p.member_b_id === m2) || (p.member_a_id === m2 && p.member_b_id === m1)) {
              return ({ pair_id: p.pair_id } as T);
            }
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM external_identities WHERE provider = ? AND provider_subject_id = ?')) {
          const [p, s] = boundValues as [string, string];
          for (const ext of this.tables.external_identities.values()) {
            if (ext.provider === p && ext.provider_subject_id === s) return (ext as T);
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM users WHERE email = ?')) {
          const email = (boundValues[0] as string).toLowerCase().trim();
          for (const u of this.tables.users.values()) {
            if (((u as any).email as string)?.toLowerCase().trim() === email) return (u as T);
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM conversation_participants WHERE conversation_id = ? AND member_id = ?')) {
          const key = `${boundValues[0]}_${boundValues[1]}`;
          const row = this.tables.conversation_participants.get(key);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM messages WHERE idempotency_key = ?')) {
          const [k] = boundValues as [string];
          for (const m of this.tables.messages.values()) {
            if (m.idempotency_key === k) return (m as T);
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM messages WHERE id = ?')) {
          const row = this.tables.messages.get(boundValues[0] as string);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT id FROM member_blocks WHERE')) {
          const [m1, m2] = boundValues as [string, string];
          const b1 = this.tables.member_blocks.get(`${m1}_${m2}`) || this.tables.member_blocks.get(`${m2}_${m1}`);
          return (b1 as T) ?? null;
        }
        if (trimmed.startsWith('SELECT pair_id FROM pair_relationships WHERE')) {
          const [m1, m2] = boundValues as [string, string];
          for (const p of this.tables.pair_relationships.values()) {
            if ((p.member_a_id === m1 && p.member_b_id === m2) || (p.member_a_id === m2 && p.member_b_id === m1)) {
              return ({ pair_id: p.pair_id } as T);
            }
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM users WHERE id = ?')) {
          const row = this.tables.users.get(boundValues[0] as string);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM quiz_answers WHERE user_id = ? AND question_id = ?')) {
          const key = `${boundValues[0]}_${boundValues[1]}`;
          const row = this.tables.quiz_answers.get(key);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM pair_relationships WHERE pair_id = ?')) {
          const row = this.tables.pair_relationships.get(boundValues[0] as string);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM introductions WHERE id = ?')) {
          const row = this.tables.introductions.get(boundValues[0] as string);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM conversations WHERE id = ?')) {
          const row = this.tables.conversations.get(boundValues[0] as string);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM conversations WHERE pair_id = ?')) {
          for (const c of this.tables.conversations.values()) {
            if (c.pair_id === (boundValues[0] as string)) return (c as T);
          }
          return null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM community_circles WHERE id = ?')) {
          const row = this.tables.community_circles.get(boundValues[0] as string);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM circle_memberships WHERE circle_id = ? AND member_id = ?')) {
          const key = `${boundValues[0]}_${boundValues[1]}`;
          const row = this.tables.circle_memberships.get(key);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM circle_invitations WHERE id = ?')) {
          const row = this.tables.circle_invitations.get(boundValues[0] as string);
          return (row as T) ?? null;
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM circle_invitations WHERE circle_id = ? AND invitee_id = ?')) {
          for (const inv of this.tables.circle_invitations.values()) {
            if (inv.circle_id === boundValues[0] && inv.invitee_id === boundValues[1]) {
              return (inv as T);
            }
          }
          return null;
        }
        return null;
      },
      run: async () => {
        if (trimmed.startsWith('INSERT INTO users') || trimmed.startsWith('INSERT OR REPLACE INTO users')) {
          const [id, email, displayName, role, isAdult] = boundValues as [string, string, string, string, number];
          this.tables.users.set(id, {
            id,
            email,
            display_name: displayName,
            role,
            is_adult_verified: isAdult,
            account_status: 'active',
            created_at: Date.now(),
            updated_at: Date.now(),
          });
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO quiz_answers') || trimmed.startsWith('INSERT OR REPLACE INTO quiz_answers')) {
          const [id, userId, questionId, optionId, semanticId, dispIdx, latency] = boundValues as [
            string, string, string, string, string, number, number
          ];
          const record: D1QuizAnswerRecord = {
            id,
            user_id: userId,
            question_id: questionId,
            option_id: optionId,
            semantic_id: semanticId,
            displayed_option_index: dispIdx,
            response_latency_ms: latency,
            answered_at: Date.now(),
          };
          this.tables.quiz_answers.set(`${userId}_${questionId}`, record);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO member_blocks') || trimmed.startsWith('INSERT OR REPLACE INTO member_blocks')) {
          const [id, blockerId, blockedId] = boundValues as [string, string, string];
          this.tables.member_blocks.set(`${blockerId}_${blockedId}`, {
            id,
            blocker_id: blockerId,
            blocked_id: blockedId,
            created_at: Date.now(),
          });
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('DELETE FROM member_blocks WHERE blocker_id = ? AND blocked_id = ?')) {
          const [blockerId, blockedId] = boundValues as [string, string];
          this.tables.member_blocks.delete(`${blockerId}_${blockedId}`);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO member_reports')) {
          const [id, reporterId, reportedId, category, summary] = boundValues as [
            string, string, string, string, string
          ];
          this.tables.member_reports.set(id, {
            id,
            reporter_id: reporterId,
            reported_id: reportedId,
            category,
            summary,
            status: 'open',
            created_at: Date.now(),
            updated_at: Date.now(),
          });
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('DELETE FROM quiz_answers WHERE user_id = ?')) {
          const [userId] = boundValues as [string];
          let deletedCount = 0;
          for (const [key, record] of this.tables.quiz_answers.entries()) {
            if (record.user_id === userId) {
              this.tables.quiz_answers.delete(key);
              deletedCount++;
            }
          }
          return { success: true, meta: { changes: deletedCount } };
        }
        if (trimmed.startsWith('INSERT INTO pair_relationships') || trimmed.startsWith('INSERT OR REPLACE INTO pair_relationships')) {
          const [pairId, memberA, memberB, activeSpace, state, suppression, initiatedBy, connectedAt, createdAt, updatedAt] = boundValues as [
            string, string, string, ExtendedIntentionId | null, any, any, string, number | null, number, number
          ];
          const rec: D1PairRelationshipRecord = {
            pair_id: pairId,
            member_a_id: memberA,
            member_b_id: memberB,
            active_space: activeSpace,
            relationship_state: state,
            suppression_status: suppression,
            initiated_by: initiatedBy,
            connected_at: connectedAt,
            created_at: createdAt,
            updated_at: updatedAt,
          };
          this.tables.pair_relationships.set(pairId, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE pair_relationships SET')) {
          if (trimmed.includes('WHERE member_a_id = ? OR member_b_id = ?')) {
            const memberId = boundValues[1] as string;
            let changes = 0;
            for (const rec of this.tables.pair_relationships.values()) {
              if (rec.member_a_id === memberId || rec.member_b_id === memberId) {
                rec.relationship_state = 'disconnected';
                rec.suppression_status = 'none';
                rec.active_space = null;
                rec.connected_at = null;
                rec.updated_at = boundValues[0] as number;
                changes++;
              }
            }
            return { success: true, meta: { changes } };
          }
          const pairId = boundValues[boundValues.length - 1] as string;
          const existing = this.tables.pair_relationships.get(pairId);
          if (existing) {
            if (trimmed.includes("'accepted_connection'")) {
              existing.relationship_state = 'accepted_connection';
              existing.suppression_status = 'all_spaces_suppressed';
              if (boundValues.length >= 4) {
                existing.active_space = boundValues[0] as ExtendedIntentionId;
                existing.connected_at = boundValues[1] as number;
                existing.updated_at = boundValues[2] as number;
              } else {
                existing.connected_at = Date.now();
                existing.updated_at = Date.now();
              }
            } else if (trimmed.includes("'blocked'")) {
              existing.relationship_state = 'blocked';
              existing.suppression_status = 'all_spaces_suppressed';
              existing.updated_at = (boundValues[0] as number) || Date.now();
            } else if (trimmed.includes("'disconnected'")) {
              existing.relationship_state = 'disconnected';
              existing.suppression_status = 'none';
              existing.active_space = null;
              existing.connected_at = null;
              existing.updated_at = boundValues[0] as number;
            } else {
              existing.relationship_state = trimmed.includes("'declined'") ? 'declined' : 'withdrawn';
              existing.suppression_status = 'none';
              existing.active_space = null;
              existing.connected_at = null;
              existing.updated_at = boundValues[0] as number;
            }
            return { success: true, meta: { changes: 1 } };
          }
          return { success: true, meta: { changes: 0 } };
        }
        if (trimmed.startsWith('INSERT INTO introductions') || trimmed.startsWith('INSERT OR REPLACE INTO introductions')) {
          const [id, pairId, senderId, receiverId, intention, noteText, state, createdAt, respondedAt, expiresAt] = boundValues as [
            string, string, string, string, ExtendedIntentionId, string, any, number, number | null, number
          ];
          const rec: D1IntroductionRecord = {
            id,
            pair_id: pairId,
            sender_id: senderId,
            receiver_id: receiverId,
            intention,
            note_text: noteText,
            state,
            created_at: createdAt,
            responded_at: respondedAt,
            expires_at: expiresAt,
          };
          this.tables.introductions.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE introductions SET')) {
          const id = boundValues[boundValues.length - 1] as string;
          const existing = this.tables.introductions.get(id);
          if (existing) {
            if (trimmed.includes('expires_at = ?')) {
              existing.expires_at = boundValues[0] as number;
            } else if (trimmed.includes("state = 'accepted'")) {
              existing.state = 'accepted';
              existing.responded_at = boundValues[0] as number;
            } else if (trimmed.includes("state = 'declined'")) {
              existing.state = 'declined';
              existing.responded_at = boundValues[0] as number;
            } else if (trimmed.includes("state = 'withdrawn'")) {
              existing.state = 'withdrawn';
              existing.responded_at = boundValues[0] as number;
            } else {
              existing.state = boundValues[0] as any;
              existing.responded_at = boundValues[1] as number;
            }
            return { success: true, meta: { changes: 1 } };
          }
          return { success: true, meta: { changes: 0 } };
        }
        if (trimmed.startsWith('INSERT INTO conversations') || trimmed.startsWith('INSERT OR REPLACE INTO conversations')) {
          let id: string;
          let pairId: string;
          let space: ExtendedIntentionId;
          let status: any = 'active';
          let createdAt: number;
          let updatedAt: number;

          if (trimmed.includes("'active'")) {
            [id, pairId, space, createdAt, updatedAt] = boundValues as [
              string, string, ExtendedIntentionId, number, number
            ];
          } else {
            [id, pairId, space, status, createdAt, updatedAt] = boundValues as [
              string, string, ExtendedIntentionId, any, number, number
            ];
          }

          const rec: D1ConversationRecord = {
            id,
            pair_id: pairId,
            space,
            status,
            created_at: createdAt,
            updated_at: updatedAt,
          };
          this.tables.conversations.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO external_identities') || trimmed.startsWith('INSERT OR REPLACE INTO external_identities')) {
          const [id, userId, provider, subjectId, createdAt] = boundValues as [string, string, any, string, number];
          this.tables.external_identities.set(id, {
            id,
            user_id: userId,
            provider,
            provider_subject_id: subjectId,
            created_at: createdAt,
          });
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('DELETE FROM external_identities WHERE user_id = ?')) {
          const [uId] = boundValues as [string];
          for (const [k, v] of this.tables.external_identities.entries()) {
            if (v.user_id === uId) this.tables.external_identities.delete(k);
          }
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO mode_personas') || trimmed.startsWith('INSERT OR REPLACE INTO mode_personas')) {
          const [id, userId, intention, isHeadline, bio, paceNote, city, interests, languages, createdAt, updatedAt] = boundValues as any[];
          this.tables.mode_personas.set(`${userId}_${intention}`, {
            id,
            user_id: userId,
            intention,
            is_active: 1,
            headline: isHeadline,
            bio,
            pace_note: paceNote,
            city,
            interests,
            languages,
            created_at: createdAt,
            updated_at: updatedAt,
          });
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('DELETE FROM mode_personas WHERE user_id = ?')) {
          const [uId] = boundValues as [string];
          for (const [k, v] of this.tables.mode_personas.entries()) {
            if (v.user_id === uId) this.tables.mode_personas.delete(k);
          }
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE users SET')) {
          const userId = boundValues[boundValues.length - 1] as string;
          const u = this.tables.users.get(userId);
          if (u) {
            if (trimmed.includes("account_status = 'deleted'")) {
              (u as any).account_status = 'deleted';
              (u as any).display_name = 'Deleted Member';
              (u as any).email = `deleted_${userId}@kithra.internal`;
            } else if (trimmed.includes('is_adult_verified = ?')) {
              (u as any).is_adult_verified = boundValues[0];
            } else if (trimmed.includes('display_name = ?')) {
              (u as any).display_name = boundValues[0];
            }
            (u as any).updated_at = Date.now();
          }
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO conversation_participants') || trimmed.startsWith('INSERT OR REPLACE INTO conversation_participants')) {
          const convId = boundValues[0] as string;
          const memberId = boundValues[1] as string;
          const isHidden = (trimmed.includes('is_hidden = 1') || trimmed.includes('VALUES (?, ?, 1,')) ? 1 : 0;
          const key = `${convId}_${memberId}`;
          const existing = this.tables.conversation_participants.get(key);
          const unreadIncrement = (trimmed.includes('unread_count + 1') || trimmed.includes('0, 1,')) ? 1 : 0;
          this.tables.conversation_participants.set(key, {
            conversation_id: convId,
            member_id: memberId,
            is_hidden: isHidden,
            unread_count: existing ? existing.unread_count + unreadIncrement : unreadIncrement,
            created_at: Date.now(),
            updated_at: Date.now(),
          });
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE conversation_participants SET')) {
          if (trimmed.includes('unread_count = 0')) {
            const [now, convId, memberId] = boundValues as [number, string, string];
            const part = this.tables.conversation_participants.get(`${convId}_${memberId}`);
            if (part) {
              part.unread_count = 0;
              part.last_read_at = now;
              part.updated_at = now;
            }
          } else if (trimmed.includes('is_hidden = 1')) {
            const memberId = boundValues[boundValues.length - 1] as string;
            for (const part of this.tables.conversation_participants.values()) {
              if (part.member_id === memberId) {
                part.is_hidden = 1;
                part.hidden_at = Date.now();
              }
            }
          }
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO message_visibility') || trimmed.startsWith('INSERT OR REPLACE INTO message_visibility')) {
          const msgId = boundValues[0] as string;
          const memberId = boundValues[1] as string;
          const isHidden = (trimmed.includes(', 1,') || trimmed.includes('is_hidden = 1')) ? 1 : ((boundValues[2] as number) || 1);
          const hiddenAt = (boundValues[boundValues.length - 1] as number) || Date.now();
          this.tables.message_visibility.set(`${msgId}_${memberId}`, {
            message_id: msgId,
            member_id: memberId,
            is_hidden: isHidden,
            hidden_at: hiddenAt,
          });
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE messages SET is_unsent = 1')) {
          const [now, msgId] = boundValues as [number, string];
          const msg = this.tables.messages.get(msgId);
          if (msg) {
            msg.is_unsent = 1;
            msg.unsent_at = now;
            msg.content = '[Message un-sent by sender]';
          }
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE messages SET read_at = ?')) {
          const [now, convId, receiverId] = boundValues as [number, string, string];
          for (const m of this.tables.messages.values()) {
            if (m.conversation_id === convId && m.receiver_id === receiverId && !m.read_at) {
              m.read_at = now;
            }
          }
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE conversations SET')) {
          if (trimmed.includes('WHERE pair_id = ?')) {
            const pairId = boundValues[boundValues.length - 1] as string;
            for (const conv of this.tables.conversations.values()) {
              if (conv.pair_id === pairId) {
                if (trimmed.includes("status = 'blocked'")) {
                  conv.status = 'blocked';
                }
                conv.updated_at = boundValues[0] as number;
              }
            }
          } else {
            const convId = boundValues[boundValues.length - 1] as string;
            const conv = this.tables.conversations.get(convId);
            if (conv) {
              if (trimmed.includes("status = 'blocked'")) {
                conv.status = 'blocked';
              }
              conv.updated_at = boundValues[0] as number;
            }
          }
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('DELETE FROM trait_snapshots WHERE user_id = ?')) {
          const [uId] = boundValues as [string];
          for (const [k, v] of this.tables.trait_snapshots.entries()) {
            if (v.user_id === uId) this.tables.trait_snapshots.delete(k);
          }
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO messages')) {
          let id: string;
          let convId: string;
          let senderId: string;
          let receiverId: string;
          let content: string;
          let sentAt: number;
          let idempotencyKey: string | null = null;
          if (trimmed.includes('idempotency_key')) {
            [id, convId, senderId, receiverId, content, sentAt, idempotencyKey] = boundValues as any[];
          } else {
            [id, convId, senderId, receiverId, content, sentAt] = boundValues as any[];
          }
          const rec: D1MessageRecord = {
            id,
            conversation_id: convId,
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            sent_at: sentAt,
            is_unsent: 0,
            unsent_at: null,
            read_at: null,
            idempotency_key: idempotencyKey,
          };
          this.tables.messages.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO community_circles')) {
          const [
            id, title, description, intention, creatorId, creatorName, city,
            format, cadence, cohortComfort, targetLens, tribeTheme,
            targetConstructId, targetAffinityTrait, maxCapacity, memberCount,
            venueDetails, upcomingEventAt, status, createdAt, updatedAt
          ] = boundValues as any[];
          const rec: D1CommunityCircleRecord = {
            id, title, description, intention, creator_id: creatorId,
            creator_name: creatorName, city, format, cadence,
            cohort_comfort: cohortComfort, target_lens: targetLens,
            tribe_theme: tribeTheme, target_construct_id: targetConstructId,
            target_affinity_trait: targetAffinityTrait,
            max_capacity: maxCapacity, member_count: memberCount,
            venue_details: venueDetails, upcoming_event_at: upcomingEventAt,
            status, created_at: createdAt, updated_at: updatedAt
          };
          this.tables.community_circles.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE community_circles SET member_count = ?')) {
          const [newCount, updatedAt, id] = boundValues as [number, number, string];
          const circle = this.tables.community_circles.get(id);
          if (circle) {
            circle.member_count = newCount;
            circle.updated_at = updatedAt;
            return { success: true, meta: { changes: 1 } };
          }
          return { success: true, meta: { changes: 0 } };
        }
        if (trimmed.startsWith('INSERT INTO circle_memberships') || trimmed.startsWith('INSERT OR REPLACE INTO circle_memberships')) {
          const id = boundValues[0] as string;
          const circleId = boundValues[1] as string;
          const memberId = boundValues[2] as string;
          let role: 'host' | 'cohost' | 'member' = 'member';
          let rsvpStatus: 'confirmed' | 'waitlisted' | 'declined' | 'cancelled' = 'confirmed';
          let joinedAt = Date.now();
          let updatedAt = Date.now();

          if (boundValues.length >= 7) {
            role = boundValues[3] as any;
            rsvpStatus = boundValues[4] as any;
            joinedAt = boundValues[5] as number;
            updatedAt = boundValues[6] as number;
          } else if (boundValues.length === 5) {
            role = trimmed.includes("'host'") ? 'host' : 'member';
            rsvpStatus = trimmed.includes("'waitlisted'") ? 'waitlisted' : 'confirmed';
            joinedAt = boundValues[3] as number;
            updatedAt = boundValues[4] as number;
          }
          const rec: D1CircleMembershipRecord = {
            id, circle_id: circleId, member_id: memberId, role,
            rsvp_status: rsvpStatus, joined_at: joinedAt, updated_at: updatedAt
          };
          this.tables.circle_memberships.set(`${circleId}_${memberId}`, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('DELETE FROM circle_memberships WHERE circle_id = ? AND member_id = ?')) {
          const [circleId, memberId] = boundValues as [string, string];
          const deleted = this.tables.circle_memberships.delete(`${circleId}_${memberId}`);
          return { success: true, meta: { changes: deleted ? 1 : 0 } };
        }
        if (trimmed.startsWith('INSERT INTO circle_invitations')) {
          const [id, circleId, inviterId, inviteeId, status, lensRationale, createdAt, respondedAt] = boundValues as any[];
          const rec: D1CircleInvitationRecord = {
            id, circle_id: circleId, inviter_id: inviterId, invitee_id: inviteeId,
            status, lens_rationale: lensRationale, created_at: createdAt, responded_at: respondedAt
          };
          this.tables.circle_invitations.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('UPDATE circle_invitations SET status = ?')) {
          const [newStatus, respondedAt, id] = boundValues as [any, number, string];
          const inv = this.tables.circle_invitations.get(id);
          if (inv) {
            inv.status = newStatus;
            inv.responded_at = respondedAt;
            return { success: true, meta: { changes: 1 } };
          }
          return { success: true, meta: { changes: 0 } };
        }
        if (trimmed.startsWith('INSERT INTO circle_host_notices')) {
          const [id, circleId, hostId, title, content, createdAt] = boundValues as any[];
          const rec: D1CircleHostNoticeRecord = {
            id, circle_id: circleId, host_id: hostId, title, content, created_at: createdAt
          };
          this.tables.circle_host_notices.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO circle_reflections')) {
          const [id, circleId, authorId, authorName, content, createdAt] = boundValues as any[];
          const rec: D1CircleReflectionRecord = {
            id, circle_id: circleId, author_id: authorId, author_name: authorName, content, created_at: createdAt
          };
          this.tables.circle_reflections.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        if (trimmed.startsWith('INSERT INTO circle_audit_events')) {
          const [id, circleId, actorId, action, metadata, createdAt] = boundValues as any[];
          const rec: D1CircleAuditEventRecord = {
            id, circle_id: circleId, actor_id: actorId, action, metadata, created_at: createdAt
          };
          this.tables.circle_audit_events.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        return { success: true, meta: { changes: 0 } };
      },
      all: async <T = unknown>(): Promise<{ results: T[]; success: boolean }> => {
        if (trimmed.startsWith('SELECT message_id FROM message_visibility WHERE member_id = ? AND is_hidden = 1')) {
          const [mId] = boundValues as [string];
          const results: { message_id: string }[] = [];
          for (const vis of this.tables.message_visibility.values()) {
            if (vis.member_id === mId && vis.is_hidden === 1) {
              results.push({ message_id: vis.message_id });
            }
          }
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT * FROM mode_personas WHERE user_id = ?')) {
          const [uId] = boundValues as [string];
          const results: D1ModePersonaRecord[] = [];
          for (const p of this.tables.mode_personas.values()) {
            if (p.user_id === uId) results.push(p);
          }
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM quiz_answers WHERE user_id = ?')) {
          const [userId] = boundValues as [string];
          const records: D1QuizAnswerRecord[] = [];
          for (const record of this.tables.quiz_answers.values()) {
            if (record.user_id === userId) {
              records.push(record);
            }
          }
          return { results: records as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM member_blocks WHERE blocker_id = ? AND blocked_id = ?')) {
          const [blockerId, blockedId] = boundValues as [string, string];
          const found = this.tables.member_blocks.get(`${blockerId}_${blockedId}`);
          return { results: (found ? [found] : []) as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM pair_relationships WHERE') && (trimmed.includes('member_a_id = ?') || trimmed.includes('member_b_id = ?'))) {
          const [u1, u2] = boundValues as [string, string];
          const results: D1PairRelationshipRecord[] = [];
          for (const rec of this.tables.pair_relationships.values()) {
            if (rec.member_a_id === u1 || rec.member_b_id === u2 || rec.member_a_id === u2 || rec.member_b_id === u1) {
              if (trimmed.includes("relationship_state = 'accepted_connection'") && rec.relationship_state !== 'accepted_connection') {
                continue;
              }
              results.push(rec);
            }
          }
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM introductions WHERE sender_id = ? OR receiver_id = ?')) {
          const [u1, u2] = boundValues as [string, string];
          const results: D1IntroductionRecord[] = [];
          for (const rec of this.tables.introductions.values()) {
            if (rec.sender_id === u1 || rec.receiver_id === u2) {
              results.push(rec);
            }
          }
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM introductions WHERE pair_id = ?')) {
          const [pId] = boundValues as [string];
          const results: D1IntroductionRecord[] = [];
          for (const rec of this.tables.introductions.values()) {
            if (rec.pair_id === pId) {
              results.push(rec);
            }
          }
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM conversations')) {
          const results = Array.from(this.tables.conversations.values());
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM messages WHERE conversation_id = ?')) {
          const [convId] = boundValues as [string];
          const results: D1MessageRecord[] = [];
          for (const rec of this.tables.messages.values()) {
            if (rec.conversation_id === convId) {
              results.push(rec);
            }
          }
          results.sort((a, b) => a.sent_at - b.sent_at);
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM community_circles')) {
          const results = Array.from(this.tables.community_circles.values());
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM circle_memberships WHERE circle_id = ?')) {
          const [cId] = boundValues as [string];
          const results: D1CircleMembershipRecord[] = [];
          for (const m of this.tables.circle_memberships.values()) {
            if (m.circle_id === cId) results.push(m);
          }
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM circle_invitations WHERE invitee_id = ?')) {
          const [invId] = boundValues as [string];
          const results: D1CircleInvitationRecord[] = [];
          for (const inv of this.tables.circle_invitations.values()) {
            if (inv.invitee_id === invId) results.push(inv);
          }
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM circle_host_notices WHERE circle_id = ?')) {
          const [cId] = boundValues as [string];
          const results: D1CircleHostNoticeRecord[] = [];
          for (const n of this.tables.circle_host_notices.values()) {
            if (n.circle_id === cId) results.push(n);
          }
          results.sort((a, b) => b.created_at - a.created_at);
          return { results: results as unknown as T[], success: true };
        }
        if (trimmed.startsWith('SELECT') && trimmed.includes('FROM circle_reflections WHERE circle_id = ?')) {
          const [cId] = boundValues as [string];
          const results: D1CircleReflectionRecord[] = [];
          for (const r of this.tables.circle_reflections.values()) {
            if (r.circle_id === cId) results.push(r);
          }
          results.sort((a, b) => a.created_at - b.created_at);
          return { results: results as unknown as T[], success: true };
        }
        return { results: [], success: true };
      },
    });

    return makeStatement([]);
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<{ results: T[]; success: boolean }[]> {
    const results: { results: T[]; success: boolean }[] = [];
    for (const stmt of statements) {
      await stmt.run();
      results.push({ results: [], success: true });
    }
    return results;
  }

  async exec(_query: string): Promise<{ count: number; duration: number }> {
    return { count: 0, duration: 1 };
  }
}

/**
 * Concrete D1 Service Class interacting with D1 bindings
 */
export class KithraD1Service {
  constructor(private db: D1Database) {}

  async recordQuizAnswer(
    userId: string,
    questionId: string,
    optionId: string,
    semanticId: string,
    displayedOptionIndex: number,
    responseLatencyMs: number
  ): Promise<boolean> {
    const id = `ans_${userId}_${questionId}_${Date.now()}`;
    const res = await this.db
      .prepare(
        `INSERT OR REPLACE INTO quiz_answers (
          id, user_id, question_id, option_id, semantic_id, displayed_option_index, response_latency_ms, answered_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(id, userId, questionId, optionId, semanticId, displayedOptionIndex, responseLatencyMs)
      .run();
    return res.success;
  }

  async getSavedQuizAnswers(userId: string): Promise<Record<string, string>> {
    const res = await this.db
      .prepare(`SELECT question_id, option_id FROM quiz_answers WHERE user_id = ? ORDER BY answered_at ASC`)
      .bind(userId)
      .all<{ question_id: string; option_id: string }>();

    const mapping: Record<string, string> = {};
    for (const row of res.results) {
      mapping[row.question_id] = row.option_id;
    }
    return mapping;
  }

  async unblockMember(blockerId: string, blockedId: string): Promise<boolean> {
    const res = await this.db
      .prepare(`DELETE FROM member_blocks WHERE blocker_id = ? AND blocked_id = ?`)
      .bind(blockerId, blockedId)
      .run();
    return res.success;
  }

  async isMemberBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const res = await this.db
      .prepare(`SELECT id FROM member_blocks WHERE blocker_id = ? AND blocked_id = ?`)
      .bind(blockerId, blockedId)
      .all();
    return res.results.length > 0;
  }

  async listBlockedMembers(userId: string): Promise<Array<{ id: string; blocked_id: string; created_at: number; display_name?: string }>> {
    const res = await this.db
      .prepare(`
        SELECT b.id, b.blocked_id, b.created_at, u.display_name 
        FROM member_blocks b 
        LEFT JOIN users u ON b.blocked_id = u.id 
        WHERE b.blocker_id = ?
        ORDER BY b.created_at DESC
      `)
      .bind(userId)
      .all();
    return (res.results as any[]) || [];
  }

  async submitMemberReport(
    reporterId: string,
    reportedId: string,
    category: string,
    summary: string
  ): Promise<string> {
    const id = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await this.db
      .prepare(
        `INSERT INTO member_reports (id, reporter_id, reported_id, category, summary, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'open', ?, ?)`
      )
      .bind(id, reporterId, reportedId, category, summary, Date.now(), Date.now())
      .run();
    return id;
  }

  /**
   * Section 12 DPDP Act 2023: Right to Correction & Erasure of Personal Data
   * Section 6(4): Withdrawal of Consent
   */
  async deleteMemberAssessmentData(userId: string): Promise<{
    success: boolean;
    userId: string;
    erasedAt: number;
  }> {
    await this.db.prepare(`DELETE FROM quiz_answers WHERE user_id = ?`).bind(userId).run();
    return {
      success: true,
      userId,
      erasedAt: Date.now(),
    };
  }

  // ============================================================================
  // PHASE 11: AUTHORITATIVE PAIR RELATIONSHIP LEDGER & INTRODUCTIONS SERVICE
  // ============================================================================

  async getPairRelationship(pairId: string): Promise<D1PairRelationshipRecord | null> {
    const res = await this.db
      .prepare(`SELECT * FROM pair_relationships WHERE pair_id = ?`)
      .bind(pairId)
      .first<D1PairRelationshipRecord>();
    return res ?? null;
  }

  async getPairRelationshipBetween(id1: string, id2: string): Promise<D1PairRelationshipRecord | null> {
    const pairId = getCanonicalPairId(id1, id2);
    return this.getPairRelationship(pairId);
  }

  async upsertPairRelationship(record: D1PairRelationshipRecord): Promise<boolean> {
    const res = await this.db
      .prepare(
        `INSERT OR REPLACE INTO pair_relationships (
          pair_id, member_a_id, member_b_id, active_space, relationship_state,
          suppression_status, initiated_by, connected_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        record.pair_id,
        record.member_a_id,
        record.member_b_id,
        record.active_space,
        record.relationship_state,
        record.suppression_status,
        record.initiated_by,
        record.connected_at,
        record.created_at,
        record.updated_at
      )
      .run();
    return res.success;
  }

  async createPairRelationship(
    memberAId: string,
    memberBId: string,
    space: ExtendedIntentionId
  ): Promise<{ success: boolean; pair: D1PairRelationshipRecord }> {
    const [a, b] = [memberAId, memberBId].sort();
    const pairId = `pair_${a}_${b}`;
    const now = Date.now();
    const pair: D1PairRelationshipRecord = {
      pair_id: pairId,
      member_a_id: a,
      member_b_id: b,
      active_space: space,
      relationship_state: 'pending_introduction',
      suppression_status: 'none',
      initiated_by: memberAId,
      connected_at: null,
      created_at: now,
      updated_at: now,
    };
    await this.upsertPairRelationship(pair);
    return { success: true, pair };
  }

  async createIntroduction(
    senderId: string,
    receiverId: string,
    intention: ExtendedIntentionId,
    noteText: string
  ): Promise<{ success: boolean; introduction?: D1IntroductionRecord; error?: string }> {
    if (senderId === receiverId) {
      return { success: false, error: 'Cannot send introduction to self' };
    }
    const isBlocked = (await this.isMemberBlocked(senderId, receiverId)) || (await this.isMemberBlocked(receiverId, senderId));
    if (isBlocked) {
      return { success: false, error: 'Cannot send introduction: member block is active' };
    }
    const pairId = getCanonicalPairId(senderId, receiverId);
    const existingPair = await this.getPairRelationship(pairId);
    if (existingPair && existingPair.relationship_state === 'accepted_connection') {
      return {
        success: false,
        error: `Members already have an active connection in ${existingPair.active_space}. Cross-context introduction prohibited.`,
      };
    }
    if (existingPair && existingPair.relationship_state === 'pending_introduction') {
      return {
        success: false,
        error: 'An introduction is already pending between these members.',
      };
    }

    const [first, second] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];
    const now = Date.now();
    const pairRecord: D1PairRelationshipRecord = {
      pair_id: pairId,
      member_a_id: first,
      member_b_id: second,
      active_space: intention,
      relationship_state: 'pending_introduction',
      suppression_status: 'space_suppressed',
      initiated_by: senderId,
      connected_at: null,
      created_at: existingPair ? existingPair.created_at : now,
      updated_at: now,
    };
    await this.upsertPairRelationship(pairRecord);

    const introId = `intro_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const introRecord: D1IntroductionRecord = {
      id: introId,
      pair_id: pairId,
      sender_id: senderId,
      receiver_id: receiverId,
      intention,
      note_text: noteText.trim(),
      state: 'sent',
      created_at: now,
      responded_at: null,
      expires_at: now + 14 * 86400000,
    };

    const res = await this.db
      .prepare(
        `INSERT INTO introductions (
          id, pair_id, sender_id, receiver_id, intention, note_text, state, created_at, responded_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        introRecord.id,
        introRecord.pair_id,
        introRecord.sender_id,
        introRecord.receiver_id,
        introRecord.intention,
        introRecord.note_text,
        introRecord.state,
        introRecord.created_at,
        introRecord.responded_at,
        introRecord.expires_at
      )
      .run();

    return { success: res.success, introduction: introRecord };
  }

  async acceptIntroduction(
    introId: string,
    receiverId: string
  ): Promise<{ success: boolean; conversationId?: string; activeSpace?: ExtendedIntentionId; error?: string }> {
    const intro = await this.db
      .prepare(`SELECT * FROM introductions WHERE id = ?`)
      .bind(introId)
      .first<D1IntroductionRecord>();

    if (!intro) return { success: false, error: 'Introduction not found' };
    if (intro.receiver_id !== receiverId) return { success: false, error: 'Unauthorized to accept introduction' };
    if (intro.state !== 'sent') return { success: false, error: `Cannot accept introduction in state ${intro.state}` };
    if (Date.now() > intro.expires_at) return { success: false, error: 'Introduction has expired' };

    const now = Date.now();
    await this.db
      .prepare(`UPDATE introductions SET state = 'accepted', responded_at = ? WHERE id = ?`)
      .bind(now, introId)
      .run();

    // Enforce Founder's Master Invariant: suppression_status = 'all_spaces_suppressed'
    await this.db
      .prepare(
        `UPDATE pair_relationships SET
          relationship_state = 'accepted_connection',
          suppression_status = 'all_spaces_suppressed',
          active_space = ?,
          connected_at = ?,
          updated_at = ?
         WHERE pair_id = ?`
      )
      .bind(intro.intention, now, now, intro.pair_id)
      .run();

    const conversationId = `conv_${intro.pair_id}`;
    await this.db
      .prepare(
        `INSERT OR REPLACE INTO conversations (
          id, pair_id, space, status, created_at, updated_at
        ) VALUES (?, ?, ?, 'active', ?, ?)`
      )
      .bind(conversationId, intro.pair_id, intro.intention, now, now)
      .run();

    await this.db
      .prepare(
        `INSERT OR REPLACE INTO conversation_participants (
          conversation_id, member_id, is_hidden, unread_count, created_at, updated_at
        ) VALUES (?, ?, 0, 0, ?, ?)`
      )
      .bind(conversationId, intro.sender_id, now, now)
      .run();

    await this.db
      .prepare(
        `INSERT OR REPLACE INTO conversation_participants (
          conversation_id, member_id, is_hidden, unread_count, created_at, updated_at
        ) VALUES (?, ?, 0, 0, ?, ?)`
      )
      .bind(conversationId, intro.receiver_id, now, now)
      .run();

    return { success: true, conversationId, activeSpace: intro.intention };
  }

  async declineIntroduction(introId: string, receiverId: string): Promise<{ success: boolean; error?: string }> {
    const intro = await this.db
      .prepare(`SELECT * FROM introductions WHERE id = ?`)
      .bind(introId)
      .first<D1IntroductionRecord>();
    if (!intro) return { success: false, error: 'Introduction not found' };
    if (intro.receiver_id !== receiverId) return { success: false, error: 'Unauthorized to decline introduction' };
    if (intro.state !== 'sent') return { success: false, error: `Cannot decline introduction in state ${intro.state}` };

    const now = Date.now();
    await this.db
      .prepare(`UPDATE introductions SET state = 'declined', responded_at = ? WHERE id = ?`)
      .bind(now, introId)
      .run();

    await this.db
      .prepare(
        `UPDATE pair_relationships SET relationship_state = 'declined', suppression_status = 'none', active_space = NULL, connected_at = NULL, updated_at = ? WHERE pair_id = ?`
      )
      .bind(now, intro.pair_id)
      .run();

    return { success: true };
  }

  async withdrawIntroduction(introId: string, senderId: string): Promise<{ success: boolean; error?: string }> {
    const intro = await this.db
      .prepare(`SELECT * FROM introductions WHERE id = ?`)
      .bind(introId)
      .first<D1IntroductionRecord>();
    if (!intro) return { success: false, error: 'Introduction not found' };
    if (intro.sender_id !== senderId) return { success: false, error: 'Unauthorized to withdraw introduction' };
    if (intro.state !== 'sent') return { success: false, error: `Cannot withdraw introduction in state ${intro.state}` };

    const now = Date.now();
    await this.db
      .prepare(`UPDATE introductions SET state = 'withdrawn', responded_at = ? WHERE id = ?`)
      .bind(now, introId)
      .run();

    await this.db
      .prepare(
        `UPDATE pair_relationships SET relationship_state = 'withdrawn', suppression_status = 'none', active_space = NULL, connected_at = NULL, updated_at = ? WHERE pair_id = ?`
      )
      .bind(now, intro.pair_id)
      .run();

    return { success: true };
  }

  async getIntroductionsForMember(userId: string): Promise<D1IntroductionRecord[]> {
    const res = await this.db
      .prepare(`SELECT * FROM introductions WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at DESC`)
      .bind(userId, userId)
      .all<D1IntroductionRecord>();
    return res.results;
  }

  async getActiveConnectionsForMember(userId: string): Promise<D1PairRelationshipRecord[]> {
    const res = await this.db
      .prepare(`SELECT * FROM pair_relationships WHERE (member_a_id = ? OR member_b_id = ?) AND relationship_state = 'accepted_connection'`)
      .bind(userId, userId)
      .all<D1PairRelationshipRecord>();
    return res.results;
  }

  // ============================================================================
  // PHASE 13 & 14: PERMANENT USER IDENTITY & D1 PROVISIONING
  // ============================================================================

  async resolveOrCreateMemberFromAuth(input: {
    provider: 'google.com' | 'apple.com' | 'phone' | 'password';
    providerSubjectId: string;
    email: string;
    displayName?: string;
    isAdultVerified?: boolean;
  }): Promise<{ user: D1UserRecord; isNewUser: boolean }> {
    const now = Date.now();
    // 1. Check external_identities
    const ext = await this.db
      .prepare(`SELECT * FROM external_identities WHERE provider = ? AND provider_subject_id = ?`)
      .bind(input.provider, input.providerSubjectId)
      .first<D1ExternalIdentityRecord>();

    if (ext) {
      const existingUser = await this.db
        .prepare(`SELECT * FROM users WHERE id = ?`)
        .bind(ext.user_id)
        .first<D1UserRecord>();
      if (existingUser) {
        return { user: existingUser, isNewUser: false };
      }
    }

    // 2. Check if user with same email exists in users
    const existingByEmail = await this.db
      .prepare(`SELECT * FROM users WHERE email = ?`)
      .bind(input.email.toLowerCase().trim())
      .first<D1UserRecord>();

    if (existingByEmail) {
      // Link external identity to existing user
      const extId = `ext_${now}_${Math.random().toString(36).substring(2, 7)}`;
      await this.db
        .prepare(`INSERT OR REPLACE INTO external_identities (id, user_id, provider, provider_subject_id, created_at) VALUES (?, ?, ?, ?, ?)`)
        .bind(extId, existingByEmail.id, input.provider, input.providerSubjectId, now)
        .run();
      return { user: existingByEmail, isNewUser: false };
    }

    // 3. Create brand new permanent Kithra member
    const newUserId = `usr_${now}_${Math.random().toString(36).substring(2, 8)}`;
    const displayName = input.displayName?.trim() || input.email.split('@')[0];
    const isAdult = input.isAdultVerified ? 1 : 0;

    await this.db
      .prepare(`
        INSERT INTO users (id, email, display_name, role, is_adult_verified, email_verified, account_status, created_at, updated_at)
        VALUES (?, ?, ?, 'member', ?, 1, 'active', ?, ?)
      `)
      .bind(newUserId, input.email.toLowerCase().trim(), displayName, isAdult, now, now)
      .run();

    const extId = `ext_${now}_${Math.random().toString(36).substring(2, 7)}`;
    await this.db
      .prepare(`INSERT INTO external_identities (id, user_id, provider, provider_subject_id, created_at) VALUES (?, ?, ?, ?, ?)`)
      .bind(extId, newUserId, input.provider, input.providerSubjectId, now)
      .run();

    const newUser: D1UserRecord = {
      id: newUserId,
      email: input.email.toLowerCase().trim(),
      display_name: displayName,
      role: 'member',
      is_adult_verified: isAdult,
      email_verified: 1,
      account_status: 'active',
      created_at: now,
      updated_at: now,
    };

    return { user: newUser, isNewUser: true };
  }

  async getUserById(userId: string): Promise<D1UserRecord | null> {
    const res = await this.db
      .prepare(`SELECT * FROM users WHERE id = ?`)
      .bind(userId)
      .first<D1UserRecord>();
    if (res) return res;

    const ext = await this.db
      .prepare(`SELECT * FROM external_identities WHERE provider_subject_id = ?`)
      .bind(userId)
      .first<D1ExternalIdentityRecord>();
    if (ext) {
      return this.getUserById(ext.user_id);
    }
    return null;
  }

  async updateUserAdultStatus(userId: string, isAdultVerified: boolean): Promise<boolean> {
    const res = await this.db
      .prepare(`UPDATE users SET is_adult_verified = ?, updated_at = ? WHERE id = ?`)
      .bind(isAdultVerified ? 1 : 0, Date.now(), userId)
      .run();
    return res.success;
  }

  async syncMemberProfileToD1(userId: string, profile: Partial<MemberProfile>): Promise<boolean> {
    const now = Date.now();
    if (profile.name) {
      await this.db
        .prepare(`UPDATE users SET display_name = ?, updated_at = ? WHERE id = ?`)
        .bind(profile.name, now, userId)
        .run();
    }
    // Save personas for each intention
    if (profile.intentions && Array.isArray(profile.intentions)) {
      for (const intention of profile.intentions) {
        const personaId = `p_${userId}_${intention}`;
        await this.db
          .prepare(`
            INSERT OR REPLACE INTO mode_personas (
              id, user_id, intention, is_active, headline, bio, pace_note, city, interests, languages, created_at, updated_at
            ) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            personaId,
            userId,
            intention,
            profile.headline || null,
            profile.bio || null,
            profile.paceNote || null,
            profile.city || 'Bengaluru',
            profile.interests ? JSON.stringify(profile.interests) : null,
            profile.languages ? JSON.stringify(profile.languages) : null,
            now,
            now
          )
          .run();
      }
    }
    return true;
  }

  // ============================================================================
  // PHASE 13: REAL-TIME-READY MESSAGING, D1 CONVERSATION PERSISTENCE & DELETION
  // ============================================================================

  async createOrGetPairConversation(pairId: string, space: ExtendedIntentionId): Promise<D1ConversationRecord> {
    const existing = await this.db
      .prepare(`SELECT * FROM conversations WHERE pair_id = ?`)
      .bind(pairId)
      .first<D1ConversationRecord>();

    if (existing) return existing;

    const pair = await this.getPairRelationship(pairId);
    if (!pair) throw new Error('Pair relationship not found');

    const now = Date.now();
    const convId = `conv_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const record: D1ConversationRecord = {
      id: convId,
      pair_id: pairId,
      space,
      status: 'active',
      created_at: now,
      updated_at: now,
    };

    await this.db
      .prepare(`INSERT INTO conversations (id, pair_id, space, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(convId, pairId, space, 'active', now, now)
      .run();

    // Register participants with unhidden visibility
    await this.db
      .prepare(`INSERT OR REPLACE INTO conversation_participants (conversation_id, member_id, is_hidden, unread_count, created_at, updated_at) VALUES (?, ?, 0, 0, ?, ?)`)
      .bind(convId, pair.member_a_id, now, now)
      .run();
    await this.db
      .prepare(`INSERT OR REPLACE INTO conversation_participants (conversation_id, member_id, is_hidden, unread_count, created_at, updated_at) VALUES (?, ?, 0, 0, ?, ?)`)
      .bind(convId, pair.member_b_id, now, now)
      .run();

    return record;
  }

  async getConversationsForMember(userId: string): Promise<Array<D1ConversationRecord & { partnerId: string; partnerName: string; unreadCount: number; lastMessage?: D1MessageRecord }>> {
    const all = await this.db.prepare(`SELECT * FROM conversations WHERE status != 'archived'`).all<D1ConversationRecord>();
    const results: Array<D1ConversationRecord & { partnerId: string; partnerName: string; unreadCount: number; lastMessage?: D1MessageRecord }> = [];

    for (const conv of all.results) {
      const partRow = await this.db
        .prepare(`SELECT * FROM conversation_participants WHERE conversation_id = ? AND member_id = ?`)
        .bind(conv.id, userId)
        .first<D1ConversationParticipantRecord>();

      // Check if conversation is hidden for this user
      if (partRow && partRow.is_hidden === 1) {
        continue;
      }

      const pair = await this.getPairRelationship(conv.pair_id);
      if (!pair) continue;
      if (pair.member_a_id !== userId && pair.member_b_id !== userId) continue;

      const partnerId = pair.member_a_id === userId ? pair.member_b_id : pair.member_a_id;
      const partnerUser = await this.getUserById(partnerId);
      const storePartner = memberStore.getMemberById(partnerId);
      const partnerName = partnerUser?.display_name || storePartner?.name || 'Member';

      // Latest unhidden message
      const latestMsgs = await this.getMessages(conv.id, userId, { limit: 1 });
      const lastMessage = latestMsgs.length > 0 ? latestMsgs[latestMsgs.length - 1] : undefined;

      results.push({
        ...conv,
        partnerId,
        partnerName,
        unreadCount: partRow?.unread_count ?? 0,
        lastMessage,
      });
    }

    return results.sort((a, b) => b.updated_at - a.updated_at);
  }

  async getMessages(
    conversationId: string,
    viewerId?: string,
    options?: { limit?: number; before?: number; after?: number }
  ): Promise<D1MessageRecord[]> {
    const conv = await this.db
      .prepare(`SELECT * FROM conversations WHERE id = ?`)
      .bind(conversationId)
      .first<D1ConversationRecord>();
    if (!conv) return [];

    if (viewerId) {
      const pair = await this.getPairRelationship(conv.pair_id);
      if (!pair || (pair.member_a_id !== viewerId && pair.member_b_id !== viewerId)) {
        return []; // Unauthorized viewer
      }
    }

    const allMsgs = await this.db
      .prepare(`SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC`)
      .bind(conversationId)
      .all<D1MessageRecord>();

    let filtered = allMsgs.results;

    if (viewerId) {
      const hiddenVis = await this.db
        .prepare(`SELECT message_id FROM message_visibility WHERE member_id = ? AND is_hidden = 1`)
        .bind(viewerId)
        .all<{ message_id: string }>();
      const hiddenSet = new Set(hiddenVis.results.map((r) => r.message_id));
      filtered = filtered.filter((m) => !hiddenSet.has(m.id));
    }

    // Mask unsent messages with neutral placeholder
    filtered = filtered.map((m) => {
      if (m.is_unsent === 1) {
        return {
          ...m,
          content: '[Message un-sent by sender]',
        };
      }
      return m;
    });

    if (options?.after) {
      filtered = filtered.filter((m) => m.sent_at > options.after!);
    }
    if (options?.before) {
      filtered = filtered.filter((m) => m.sent_at < options.before!);
    }
    if (options?.limit && options.limit > 0) {
      filtered = filtered.slice(-options.limit);
    }

    return filtered;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    contentOrReceiverId: string,
    receiverIdOrContent?: string,
    idempotencyKey?: string
  ): Promise<{ success: boolean; message?: D1MessageRecord; error?: string }> {
    const conv = await this.db
      .prepare(`SELECT * FROM conversations WHERE id = ?`)
      .bind(conversationId)
      .first<D1ConversationRecord>();
    if (!conv) return { success: false, error: 'Conversation not found' };
    if (conv.status === 'blocked') return { success: false, error: 'Cannot send message: conversation is blocked.' };
    if (conv.status !== 'active') return { success: false, error: 'Conversation is not active' };

    const pair = await this.getPairRelationship(conv.pair_id);
    if (pair && pair.relationship_state === 'blocked') {
      return { success: false, error: 'Cannot send message: mutual contact is blocked.' };
    }
    if (!pair || pair.relationship_state !== 'accepted_connection') {
      return { success: false, error: 'Connection is not active' };
    }
    if (pair.member_a_id !== senderId && pair.member_b_id !== senderId) {
      return { success: false, error: 'Sender is not a participant in this conversation' };
    }

    // SECURITY INVARIANT (P2): Never trust client-supplied receiver ID!
    // Derive authoritatively from pair record
    const authoritativeReceiverId = pair.member_a_id === senderId ? pair.member_b_id : pair.member_a_id;

    // Detect legacy Phase 11 argument order (convId, senderId, receiverId, content)
    let content = contentOrReceiverId;
    let clientReceiverId = receiverIdOrContent;
    if (contentOrReceiverId === authoritativeReceiverId) {
      content = receiverIdOrContent || '';
      clientReceiverId = contentOrReceiverId;
    }

    if (clientReceiverId && clientReceiverId !== authoritativeReceiverId) {
      return { success: false, error: 'Invalid receiver ID. Receiver must match pair participant.' };
    }

    // Check mutual blocks
    const isBlocked = await this.isPairBlocked(senderId, authoritativeReceiverId);
    if (isBlocked) {
      return { success: false, error: 'Cannot send message: mutual contact is blocked.' };
    }

    // Check idempotency if key provided
    if (idempotencyKey) {
      const existing = await this.db
        .prepare(`SELECT * FROM messages WHERE idempotency_key = ?`)
        .bind(idempotencyKey)
        .first<D1MessageRecord>();
      if (existing) {
        return { success: true, message: existing };
      }
    }

    const now = Date.now();
    const id = `msg_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const msgRecord: D1MessageRecord = {
      id,
      conversation_id: conversationId,
      sender_id: senderId,
      receiver_id: authoritativeReceiverId,
      content: content.trim(),
      sent_at: now,
      is_unsent: 0,
      unsent_at: null,
      read_at: null,
      idempotency_key: idempotencyKey || null,
    };

    await this.db
      .prepare(`
        INSERT INTO messages (id, conversation_id, sender_id, receiver_id, content, is_unsent, sent_at, idempotency_key)
        VALUES (?, ?, ?, ?, ?, 0, ?, ?)
      `)
      .bind(id, conversationId, senderId, authoritativeReceiverId, msgRecord.content, now, msgRecord.idempotency_key)
      .run();

    // Update conversation updated_at
    await this.db
      .prepare(`UPDATE conversations SET updated_at = ? WHERE id = ?`)
      .bind(now, conversationId)
      .run();

    // Reset visibility if conversation was hidden, increment receiver unread_count
    await this.db
      .prepare(`INSERT OR REPLACE INTO conversation_participants (conversation_id, member_id, is_hidden, unread_count, created_at, updated_at) VALUES (?, ?, 0, 0, ?, ?)`)
      .bind(conversationId, senderId, now, now)
      .run();
    await this.db
      .prepare(`
        INSERT INTO conversation_participants (conversation_id, member_id, is_hidden, unread_count, created_at, updated_at)
        VALUES (?, ?, 0, 1, ?, ?)
        ON CONFLICT(conversation_id, member_id) DO UPDATE SET is_hidden = 0, unread_count = unread_count + 1, updated_at = ?
      `)
      .bind(conversationId, authoritativeReceiverId, now, now, now)
      .run();

    return { success: true, message: msgRecord };
  }

  async markConversationRead(conversationId: string, memberId: string): Promise<boolean> {
    const now = Date.now();
    await this.db
      .prepare(`
        UPDATE conversation_participants
        SET unread_count = 0, last_read_at = ?, updated_at = ?
        WHERE conversation_id = ? AND member_id = ?
      `)
      .bind(now, now, conversationId, memberId)
      .run();
    await this.db
      .prepare(`
        UPDATE messages
        SET read_at = ?
        WHERE conversation_id = ? AND receiver_id = ? AND read_at IS NULL
      `)
      .bind(now, conversationId, memberId)
      .run();
    return true;
  }

  async deleteMessageForMember(messageId: string, memberId: string): Promise<{ success: boolean; error?: string }> {
    const msg = await this.db
      .prepare(`SELECT * FROM messages WHERE id = ?`)
      .bind(messageId)
      .first<D1MessageRecord>();
    if (!msg) return { success: false, error: 'Message not found' };

    // Member must be sender or receiver
    if (msg.sender_id !== memberId && msg.receiver_id !== memberId) {
      return { success: false, error: 'Unauthorized to delete this message' };
    }

    const now = Date.now();
    await this.db
      .prepare(`INSERT OR REPLACE INTO message_visibility (message_id, member_id, is_hidden, hidden_at) VALUES (?, ?, 1, ?)`)
      .bind(messageId, memberId, now)
      .run();

    return { success: true };
  }

  async unsendEligibleMessage(messageId: string, senderId: string, maxWindowMs = 86400000): Promise<{ success: boolean; error?: string }> {
    const msg = await this.db
      .prepare(`SELECT * FROM messages WHERE id = ?`)
      .bind(messageId)
      .first<D1MessageRecord>();
    if (!msg) return { success: false, error: 'Message not found' };

    if (msg.sender_id !== senderId) {
      return { success: false, error: 'Only the original sender can unsend a message for everyone.' };
    }

    const now = Date.now();
    if (now - msg.sent_at > maxWindowMs) {
      return { success: false, error: 'Message exceeds the 24-hour unsend window.' };
    }

    await this.db
      .prepare(`UPDATE messages SET is_unsent = 1, unsent_at = ?, content = '[Message un-sent by sender]' WHERE id = ?`)
      .bind(now, messageId)
      .run();

    return { success: true };
  }

  async deleteConversationForMember(conversationId: string, memberId: string): Promise<{ success: boolean; error?: string }> {
    const conv = await this.db
      .prepare(`SELECT * FROM conversations WHERE id = ?`)
      .bind(conversationId)
      .first<D1ConversationRecord>();
    if (!conv) return { success: false, error: 'Conversation not found' };

    const pair = await this.getPairRelationship(conv.pair_id);
    if (!pair || (pair.member_a_id !== memberId && pair.member_b_id !== memberId)) {
      return { success: false, error: 'Unauthorized: Not a participant in this conversation' };
    }

    const now = Date.now();
    await this.db
      .prepare(`
        INSERT INTO conversation_participants (conversation_id, member_id, is_hidden, hidden_at, unread_count, created_at, updated_at)
        VALUES (?, ?, 1, ?, 0, ?, ?)
        ON CONFLICT(conversation_id, member_id) DO UPDATE SET is_hidden = 1, hidden_at = ?, updated_at = ?
      `)
      .bind(conversationId, memberId, now, now, now, now, now)
      .run();

    return { success: true };
  }

  async blockMember(blockerId: string, blockedId: string): Promise<{ success: boolean; error?: string }> {
    const id = `blk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    await this.db
      .prepare(`INSERT OR REPLACE INTO member_blocks (id, blocker_id, blocked_id, created_at) VALUES (?, ?, ?, ?)`)
      .bind(id, blockerId, blockedId, now)
      .run();

    // Mark pair relationship as blocked if exists
    const pairA = await this.db
      .prepare(`SELECT pair_id FROM pair_relationships WHERE (member_a_id = ? AND member_b_id = ?) OR (member_a_id = ? AND member_b_id = ?)`)
      .bind(blockerId, blockedId, blockedId, blockerId)
      .first<{ pair_id: string }>();

    if (pairA) {
      await this.db
        .prepare(`UPDATE pair_relationships SET relationship_state = 'blocked', suppression_status = 'all_spaces_suppressed', updated_at = ? WHERE pair_id = ?`)
        .bind(now, pairA.pair_id)
        .run();
      await this.db
        .prepare(`UPDATE conversations SET status = 'blocked', updated_at = ? WHERE pair_id = ?`)
        .bind(now, pairA.pair_id)
        .run();
    }

    return { success: true };
  }

  async isPairBlocked(memberA: string, memberB: string): Promise<boolean> {
    const b1 = await this.db
      .prepare(`SELECT id FROM member_blocks WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)`)
      .bind(memberA, memberB, memberB, memberA)
      .first<{ id: string }>();
    return b1 !== null && b1 !== undefined;
  }

  async getConversationById(convId: string): Promise<D1ConversationRecord | null> {
    return this.db
      .prepare(`SELECT * FROM conversations WHERE id = ?`)
      .bind(convId)
      .first<D1ConversationRecord>();
  }

  async disconnectPair(pairId: string, callerMemberId: string): Promise<{ success: boolean; error?: string }> {
    const pair = await this.getPairRelationship(pairId);
    if (!pair) return { success: false, error: 'Pair relationship not found.' };
    if (pair.member_a_id !== callerMemberId && pair.member_b_id !== callerMemberId) {
      return { success: false, error: 'Unauthorized to disconnect this pair.' };
    }

    const now = Date.now();
    await this.db
      .prepare(`UPDATE pair_relationships SET relationship_state = 'disconnected', suppression_status = 'none', active_space = NULL, updated_at = ? WHERE pair_id = ?`)
      .bind(now, pairId)
      .run();

    await this.db
      .prepare(`UPDATE conversations SET status = 'archived', updated_at = ? WHERE pair_id = ?`)
      .bind(now, pairId)
      .run();

    return { success: true };
  }

  async deleteAccountData(memberId: string): Promise<{ success: boolean; auditId: string }> {
    const now = Date.now();
    const auditId = `del_audit_${now}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Soft-delete user identity & anonymize
    await this.db
      .prepare(`
        UPDATE users
        SET account_status = 'deleted',
            display_name = 'Deleted Member',
            email = 'deleted_' || id || '@kithra.internal',
            deletion_requested_at = ?,
            updated_at = ?
        WHERE id = ?
      `)
      .bind(now, now, memberId)
      .run();

    // 2. Remove external identities
    await this.db.prepare(`DELETE FROM external_identities WHERE user_id = ?`).bind(memberId).run();

    // 3. Purge personas
    await this.db.prepare(`DELETE FROM mode_personas WHERE user_id = ?`).bind(memberId).run();

    // 4. Purge raw quiz answers (DPDP Act Section 12)
    await this.db.prepare(`DELETE FROM quiz_answers WHERE user_id = ?`).bind(memberId).run();

    // 5. Purge trait snapshots
    await this.db.prepare(`DELETE FROM trait_snapshots WHERE user_id = ?`).bind(memberId).run();

    // 6. Terminate pair relationships
    await this.db
      .prepare(`UPDATE pair_relationships SET relationship_state = 'disconnected', updated_at = ? WHERE member_a_id = ? OR member_b_id = ?`)
      .bind(now, memberId, memberId)
      .run();

    // 7. Hide/archive conversation participation
    await this.db
      .prepare(`UPDATE conversation_participants SET is_hidden = 1, hidden_at = ?, updated_at = ? WHERE member_id = ?`)
      .bind(now, now, memberId)
      .run();

    // 8. Record audit log without leaking private data
    await this.db
      .prepare(`INSERT INTO audit_logs (id, actor_id, actor_role, action, resource_type, resource_id, ip_hash, timestamp, metadata) VALUES (?, ?, 'member', 'account_deleted', 'user', ?, 'hash', ?, ?)`)
      .bind(auditId, memberId, memberId, now, JSON.stringify({ reason: 'user_requested_erasure' }))
      .run();

    return { success: true, auditId };
  }

  // ============================================================================
  // PHASE 12: COMMUNITY CIRCLES, INVITATIONS, RSVP & GATHERING SALON
  // ============================================================================

  async createCircle(
    creatorId: string,
    creatorName: string,
    input: CircleProposalInput,
    venueDetails?: string,
    upcomingEventAt?: number
  ): Promise<{ success: boolean; circle?: D1CommunityCircleRecord; error?: string }> {
    // Founder Intention Invariant: Member-initiated circles strictly restricted to friendship and cofounders
    if (input.intention !== 'friendship' && input.intention !== 'cofounders') {
      return {
        success: false,
        error: 'Member-initiated circles are strictly restricted to Friendship and Cofounders. Dating and Matrimony are private 1:1 spaces.',
      };
    }

    const title = input.title?.trim();
    if (!title || title.length < 5 || title.length > 70) {
      return { success: false, error: 'Title must be between 5 and 70 characters.' };
    }

    const description = input.description?.trim();
    if (!description || description.length < 15 || description.length > 600) {
      return { success: false, error: 'Description must be between 15 and 600 characters.' };
    }

    const capacity = Math.max(6, Math.min(22, input.maxCapacity ?? 16));
    const now = Date.now();
    const circleId = `circle_${now}_${Math.random().toString(36).substring(2, 7)}`;

    const circleRecord: D1CommunityCircleRecord = {
      id: circleId,
      title,
      description,
      intention: input.intention,
      creator_id: creatorId,
      creator_name: creatorName,
      city: input.city || 'Bengaluru',
      format: input.format || 'Small table conversation',
      cadence: input.cadence || 'Bi-weekly weekend morning',
      cohort_comfort: input.cohortComfort || 'all_genders',
      target_lens: input.targetLens || 'all',
      tribe_theme: input.tribeTheme || null,
      target_construct_id: input.targetConstructId || null,
      target_affinity_trait: input.targetAffinityTrait || null,
      max_capacity: capacity,
      member_count: 1,
      venue_details: venueDetails?.trim() || 'Third Wave Coffee Roasters, Indiranagar, Bengaluru (Reserved back corner table)',
      upcoming_event_at: upcomingEventAt || now + 7 * 24 * 60 * 60 * 1000,
      status: 'active',
      created_at: now,
      updated_at: now,
    };

    await this.db
      .prepare(
        `INSERT INTO community_circles (
          id, title, description, intention, creator_id, creator_name, city,
          format, cadence, cohort_comfort, target_lens, tribe_theme,
          target_construct_id, target_affinity_trait, max_capacity, member_count,
          venue_details, upcoming_event_at, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        circleRecord.id,
        circleRecord.title,
        circleRecord.description,
        circleRecord.intention,
        circleRecord.creator_id,
        circleRecord.creator_name,
        circleRecord.city,
        circleRecord.format,
        circleRecord.cadence,
        circleRecord.cohort_comfort,
        circleRecord.target_lens,
        circleRecord.tribe_theme,
        circleRecord.target_construct_id,
        circleRecord.target_affinity_trait,
        circleRecord.max_capacity,
        circleRecord.member_count,
        circleRecord.venue_details,
        circleRecord.upcoming_event_at,
        circleRecord.status,
        circleRecord.created_at,
        circleRecord.updated_at
      )
      .run();

    // Register host membership
    const membershipId = `cm_${now}_${Math.random().toString(36).substring(2, 7)}`;
    await this.db
      .prepare(
        `INSERT INTO circle_memberships (id, circle_id, member_id, role, rsvp_status, joined_at, updated_at)
         VALUES (?, ?, ?, 'host', 'confirmed', ?, ?)`
      )
      .bind(membershipId, circleId, creatorId, now, now)
      .run();

    // Audit event
    const auditId = `caud_${now}_${Math.random().toString(36).substring(2, 7)}`;
    await this.db
      .prepare(`INSERT INTO circle_audit_events (id, circle_id, actor_id, action, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(auditId, circleId, creatorId, 'circle_created', JSON.stringify({ title, intention: input.intention }), now)
      .run();

    return { success: true, circle: circleRecord };
  }

  async listCircles(
    viewerId?: string,
    intention?: ExtendedIntentionId,
    city?: string
  ): Promise<(D1CommunityCircleRecord & { joined: boolean; userRole?: string })[]> {
    const all = await this.db.prepare(`SELECT * FROM community_circles`).all<D1CommunityCircleRecord>();
    let circles = all.results.filter((c) => c.status === 'active');

    if (intention && intention !== 'friendship') {
      circles = circles.filter((c) => c.intention === intention);
    }
    if (city && city !== 'All cities') {
      circles = circles.filter((c) => c.city.toLowerCase() === city.toLowerCase());
    }

    const enhanced = await Promise.all(
      circles.map(async (circle) => {
        let joined = false;
        let userRole: string | undefined = undefined;

        if (viewerId) {
          const membership = await this.db
            .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
            .bind(circle.id, viewerId)
            .first<D1CircleMembershipRecord>();

          if (membership && (membership.rsvp_status === 'confirmed' || membership.role === 'host')) {
            joined = true;
            userRole = membership.role;
          }
        }

        // Privacy Invariant: Private venue details are sanitized if viewer is not joined or host
        return {
          ...circle,
          joined,
          userRole,
          venue_details: joined ? circle.venue_details : null,
        };
      })
    );

    return enhanced;
  }

  async getCircleById(
    circleId: string,
    viewerId?: string
  ): Promise<(D1CommunityCircleRecord & { joined: boolean; userRole?: string; venueDetails?: string | null }) | null> {
    const circle = await this.db
      .prepare(`SELECT * FROM community_circles WHERE id = ?`)
      .bind(circleId)
      .first<D1CommunityCircleRecord>();
    if (!circle) return null;

    let joined = false;
    let userRole: string | undefined = undefined;

    if (viewerId) {
      const membership = await this.db
        .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
        .bind(circle.id, viewerId)
        .first<D1CircleMembershipRecord>();

      if (membership && (membership.rsvp_status === 'confirmed' || membership.role === 'host')) {
        joined = true;
        userRole = membership.role;
      }
    }

    const venueDesc = joined
      ? (circle.venue_details || (circle as any).venueDetails)
      : 'Private gathering location disclosed to confirmed attendees upon RSVP.';

    return {
      ...circle,
      joined,
      userRole,
      venue_details: venueDesc,
      venueDetails: venueDesc,
    };
  }

  async joinCircle(
    circleId: string,
    memberId: string
  ): Promise<{ success: boolean; error?: string; waitlisted?: boolean }> {
    const circle = await this.db
      .prepare(`SELECT * FROM community_circles WHERE id = ?`)
      .bind(circleId)
      .first<D1CommunityCircleRecord>();
    if (!circle) return { success: false, error: 'Circle not found.' };
    if (circle.status !== 'active') return { success: false, error: 'Circle is not active.' };

    const existingMembership = await this.db
      .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
      .bind(circleId, memberId)
      .first<D1CircleMembershipRecord>();

    if (existingMembership && existingMembership.rsvp_status === 'confirmed') {
      return { success: true }; // Idempotent success
    }

    // Capacity enforcement
    if (circle.member_count >= circle.max_capacity) {
      return {
        success: false,
        error: `Circle has reached maximum capacity (${circle.max_capacity} members).`,
      };
    }

    const now = Date.now();
    const membershipId = existingMembership?.id || `cm_${now}_${Math.random().toString(36).substring(2, 7)}`;

    await this.db
      .prepare(
        `INSERT OR REPLACE INTO circle_memberships (id, circle_id, member_id, role, rsvp_status, joined_at, updated_at)
         VALUES (?, ?, ?, 'member', 'confirmed', ?, ?)`
      )
      .bind(membershipId, circleId, memberId, now, now)
      .run();

    const newCount = circle.member_count + 1;
    await this.db
      .prepare(`UPDATE community_circles SET member_count = ?, updated_at = ? WHERE id = ?`)
      .bind(newCount, now, circleId)
      .run();

    // Audit event
    const auditId = `caud_${now}_${Math.random().toString(36).substring(2, 7)}`;
    await this.db
      .prepare(`INSERT INTO circle_audit_events (id, circle_id, actor_id, action, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(auditId, circleId, memberId, 'circle_joined', JSON.stringify({ newCount }), now)
      .run();

    return { success: true };
  }

  async leaveCircle(circleId: string, memberId: string): Promise<{ success: boolean; error?: string }> {
    const circle = await this.db
      .prepare(`SELECT * FROM community_circles WHERE id = ?`)
      .bind(circleId)
      .first<D1CommunityCircleRecord>();
    if (!circle) return { success: false, error: 'Circle not found.' };

    const membership = await this.db
      .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
      .bind(circleId, memberId)
      .first<D1CircleMembershipRecord>();
    if (!membership) return { success: false, error: 'Not a member of this Circle.' };

    if (membership.role === 'host' && circle.creator_id === memberId) {
      return { success: false, error: 'Host cannot leave their own Circle. Transfer host role or archive the Circle.' };
    }

    const now = Date.now();
    await this.db
      .prepare(`DELETE FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
      .bind(circleId, memberId)
      .run();

    const newCount = Math.max(1, circle.member_count - 1);
    await this.db
      .prepare(`UPDATE community_circles SET member_count = ?, updated_at = ? WHERE id = ?`)
      .bind(newCount, now, circleId)
      .run();

    // Audit event
    const auditId = `caud_${now}_${Math.random().toString(36).substring(2, 7)}`;
    await this.db
      .prepare(`INSERT INTO circle_audit_events (id, circle_id, actor_id, action, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(auditId, circleId, memberId, 'circle_left', JSON.stringify({ newCount }), now)
      .run();

    return { success: true };
  }

  async archiveCircle(circleId: string, hostId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    const circle = await this.db
      .prepare(`SELECT * FROM community_circles WHERE id = ?`)
      .bind(circleId)
      .first<D1CommunityCircleRecord>();
    if (!circle) return { success: false, error: 'Circle not found.' };
    if (circle.creator_id !== hostId) {
      return { success: false, error: 'Only the host or creator can archive this Circle.' };
    }

    const now = Date.now();
    await this.db
      .prepare(`UPDATE community_circles SET status = 'cancelled', updated_at = ? WHERE id = ?`)
      .bind(now, circleId)
      .run();

    const auditId = `caud_${now}_${Math.random().toString(36).substring(2, 7)}`;
    await this.db
      .prepare(`INSERT INTO circle_audit_events (id, circle_id, actor_id, action, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(auditId, circleId, hostId, 'circle_cancelled', JSON.stringify({ reason: reason || 'Host cancelled gathering' }), now)
      .run();

    return { success: true };
  }

  async inviteToCircle(
    circleId: string,
    inviterId: string,
    inviteeId: string,
    lensRationale?: string
  ): Promise<{ success: boolean; invitation?: D1CircleInvitationRecord; error?: string }> {
    const circle = await this.db
      .prepare(`SELECT * FROM community_circles WHERE id = ?`)
      .bind(circleId)
      .first<D1CommunityCircleRecord>();
    if (!circle) return { success: false, error: 'Circle not found.' };

    // Check capacity
    if (circle.member_count >= circle.max_capacity) {
      return { success: false, error: 'Circle has reached maximum capacity.' };
    }

    // Check if invitee already joined
    const membership = await this.db
      .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
      .bind(circleId, inviteeId)
      .first<D1CircleMembershipRecord>();
    if (membership && membership.rsvp_status === 'confirmed') {
      return { success: false, error: 'Member is already a confirmed participant.' };
    }

    // Check existing pending invitation
    const existing = await this.db
      .prepare(`SELECT * FROM circle_invitations WHERE circle_id = ? AND invitee_id = ?`)
      .bind(circleId, inviteeId)
      .first<D1CircleInvitationRecord>();
    if (existing && existing.status === 'pending') {
      return { success: false, error: 'Member already has a pending invitation to this Circle.' };
    }

    const now = Date.now();
    const id = `cinv_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const invitationRecord: D1CircleInvitationRecord = {
      id,
      circle_id: circleId,
      inviter_id: inviterId,
      invitee_id: inviteeId,
      status: 'pending',
      lens_rationale: lensRationale || 'Invited through shared psychological affinity.',
      created_at: now,
      responded_at: null,
    };

    await this.db
      .prepare(
        `INSERT INTO circle_invitations (id, circle_id, inviter_id, invitee_id, status, lens_rationale, created_at, responded_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        invitationRecord.id,
        invitationRecord.circle_id,
        invitationRecord.inviter_id,
        invitationRecord.invitee_id,
        invitationRecord.status,
        invitationRecord.lens_rationale,
        invitationRecord.created_at,
        invitationRecord.responded_at
      )
      .run();

    return { success: true, invitation: invitationRecord };
  }

  async listCircleInvitationsForMember(
    memberId: string
  ): Promise<(D1CircleInvitationRecord & { circleTitle: string; circleFormat: string; circleCity: string; intention: ExtendedIntentionId })[]> {
    const raw = await this.db
      .prepare(`SELECT * FROM circle_invitations WHERE invitee_id = ?`)
      .bind(memberId)
      .all<D1CircleInvitationRecord>();

    const pending = raw.results.filter((i) => i.status === 'pending');
    const enriched = await Promise.all(
      pending.map(async (inv) => {
        const circle = await this.db
          .prepare(`SELECT * FROM community_circles WHERE id = ?`)
          .bind(inv.circle_id)
          .first<D1CommunityCircleRecord>();
        return {
          ...inv,
          circleTitle: circle?.title || 'Community Circle',
          circleFormat: circle?.format || 'Gathering',
          circleCity: circle?.city || 'Bengaluru',
          intention: (circle?.intention || 'friendship') as ExtendedIntentionId,
        };
      })
    );

    return enriched;
  }

  async respondToCircleInvitation(
    invitationId: string,
    memberId: string,
    response: 'accept' | 'decline' | 'report'
  ): Promise<{ success: boolean; error?: string }> {
    const invitation = await this.db
      .prepare(`SELECT * FROM circle_invitations WHERE id = ?`)
      .bind(invitationId)
      .first<D1CircleInvitationRecord>();
    if (!invitation) return { success: false, error: 'Invitation not found.' };
    if (invitation.invitee_id !== memberId) {
      return { success: false, error: 'Unauthorized to respond to this invitation.' };
    }

    const now = Date.now();
    if (response === 'accept') {
      const joinRes = await this.joinCircle(invitation.circle_id, memberId);
      if (!joinRes.success) return joinRes;

      await this.db
        .prepare(`UPDATE circle_invitations SET status = 'accepted', responded_at = ? WHERE id = ?`)
        .bind(now, invitationId)
        .run();
      return { success: true };
    }

    if (response === 'decline') {
      await this.db
        .prepare(`UPDATE circle_invitations SET status = 'declined', responded_at = ? WHERE id = ?`)
        .bind(now, invitationId)
        .run();
      return { success: true };
    }

    if (response === 'report') {
      await this.db
        .prepare(`UPDATE circle_invitations SET status = 'reported', responded_at = ? WHERE id = ?`)
        .bind(now, invitationId)
        .run();
      await this.submitMemberReport(memberId, invitation.inviter_id, 'Circle invite spam', `Reported unsolicited circle invitation ${invitationId}`);
      return { success: true };
    }

    return { success: false, error: 'Invalid response action.' };
  }

  async postCircleNotice(
    circleId: string,
    hostId: string,
    title: string,
    content: string
  ): Promise<{ success: boolean; notice?: D1CircleHostNoticeRecord; error?: string }> {
    const circle = await this.db
      .prepare(`SELECT * FROM community_circles WHERE id = ?`)
      .bind(circleId)
      .first<D1CommunityCircleRecord>();
    if (!circle) return { success: false, error: 'Circle not found.' };

    const membership = await this.db
      .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
      .bind(circleId, hostId)
      .first<D1CircleMembershipRecord>();

    if (circle.creator_id !== hostId && membership?.role !== 'host') {
      return { success: false, error: 'Only the Circle Host can post notices.' };
    }

    const now = Date.now();
    const id = `cnot_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const notice: D1CircleHostNoticeRecord = {
      id,
      circle_id: circleId,
      host_id: hostId,
      title: title.trim(),
      content: content.trim(),
      created_at: now,
    };

    await this.db
      .prepare(`INSERT INTO circle_host_notices (id, circle_id, host_id, title, content, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(id, circleId, hostId, notice.title, notice.content, now)
      .run();

    return { success: true, notice };
  }

  async listCircleNotices(circleId: string, viewerId: string): Promise<D1CircleHostNoticeRecord[]> {
    const circle = await this.getCircleById(circleId, viewerId);
    if (!circle || !circle.joined) return [];

    const res = await this.db
      .prepare(`SELECT * FROM circle_host_notices WHERE circle_id = ?`)
      .bind(circleId)
      .all<D1CircleHostNoticeRecord>();
    return res.results;
  }

  async postCircleReflection(
    circleId: string,
    authorId: string,
    authorName: string,
    content: string
  ): Promise<{ success: boolean; reflection?: D1CircleReflectionRecord; error?: string }> {
    const membership = await this.db
      .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ? AND member_id = ?`)
      .bind(circleId, authorId)
      .first<D1CircleMembershipRecord>();
    if (!membership || membership.rsvp_status !== 'confirmed') {
      return { success: false, error: 'Only confirmed attendees can share reflections in this Gathering Salon.' };
    }

    const now = Date.now();
    const id = `cref_${now}_${Math.random().toString(36).substring(2, 7)}`;
    const reflection: D1CircleReflectionRecord = {
      id,
      circle_id: circleId,
      author_id: authorId,
      author_name: authorName,
      content: content.trim(),
      created_at: now,
    };

    await this.db
      .prepare(`INSERT INTO circle_reflections (id, circle_id, author_id, author_name, content, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(id, circleId, authorId, authorName, reflection.content, now)
      .run();

    return { success: true, reflection };
  }

  async listCircleReflections(circleId: string, viewerId: string): Promise<D1CircleReflectionRecord[]> {
    const circle = await this.getCircleById(circleId, viewerId);
    if (!circle || !circle.joined) return [];

    const res = await this.db
      .prepare(`SELECT * FROM circle_reflections WHERE circle_id = ?`)
      .bind(circleId)
      .all<D1CircleReflectionRecord>();
    return res.results;
  }

  async listCircleMembers(circleId: string, viewerId: string): Promise<D1CircleMembershipRecord[]> {
    const circle = await this.getCircleById(circleId, viewerId);
    if (!circle || !circle.joined) return [];

    const res = await this.db
      .prepare(`SELECT * FROM circle_memberships WHERE circle_id = ?`)
      .bind(circleId)
      .all<D1CircleMembershipRecord>();
    return res.results;
  }
}
