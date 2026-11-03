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
import { ExtendedIntentionId } from '../types/kithra';

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

export interface D1ConversationRecord {
  id: string;
  pair_id: string;
  space: ExtendedIntentionId;
  status: 'active' | 'archived' | 'blocked';
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
  };

  prepare(query: string): D1PreparedStatement {
    const trimmed = query.trim();

    const makeStatement = (boundValues: unknown[]): D1PreparedStatement => ({
      bind: (...newVals: unknown[]): D1PreparedStatement => {
        return makeStatement([...boundValues, ...newVals]);
      },
      first: async <T = unknown>(): Promise<T | null> => {
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
          const pairId = boundValues[boundValues.length - 1] as string;
          const existing = this.tables.pair_relationships.get(pairId);
          if (existing) {
            if (trimmed.includes("'accepted_connection'")) {
              existing.relationship_state = 'accepted_connection';
              existing.suppression_status = 'all_spaces_suppressed';
              existing.active_space = boundValues[0] as ExtendedIntentionId;
              existing.connected_at = boundValues[1] as number;
              existing.updated_at = boundValues[2] as number;
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
        if (trimmed.startsWith('INSERT INTO messages')) {
          const [id, convId, senderId, receiverId, content, sentAt] = boundValues as [
            string, string, string, string, string, number
          ];
          const rec: D1MessageRecord = {
            id,
            conversation_id: convId,
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            sent_at: sentAt,
          };
          this.tables.messages.set(id, rec);
          return { success: true, meta: { changes: 1 } };
        }
        return { success: true, meta: { changes: 0 } };
      },
      all: async <T = unknown>(): Promise<{ results: T[]; success: boolean }> => {
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

  async blockMember(blockerId: string, blockedId: string): Promise<boolean> {
    const id = `blk_${blockerId}_${blockedId}`;
    const res = await this.db
      .prepare(`INSERT OR REPLACE INTO member_blocks (id, blocker_id, blocked_id, created_at) VALUES (?, ?, ?, ?)`)
      .bind(id, blockerId, blockedId, Date.now())
      .run();
    return res.success;
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

  async getConversationsForMember(userId: string): Promise<D1ConversationRecord[]> {
    const pairs = await this.getActiveConnectionsForMember(userId);
    const pairIds = new Set(pairs.map((p) => p.pair_id));
    const allConv = await this.db.prepare(`SELECT * FROM conversations`).all<D1ConversationRecord>();
    return allConv.results.filter((c) => pairIds.has(c.pair_id));
  }

  async getMessages(conversationId: string): Promise<D1MessageRecord[]> {
    const res = await this.db
      .prepare(`SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC`)
      .bind(conversationId)
      .all<D1MessageRecord>();
    return res.results;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<{ success: boolean; message?: D1MessageRecord; error?: string }> {
    const conv = await this.db
      .prepare(`SELECT * FROM conversations WHERE id = ?`)
      .bind(conversationId)
      .first<D1ConversationRecord>();
    if (!conv) return { success: false, error: 'Conversation not found' };
    if (conv.status !== 'active') return { success: false, error: 'Conversation is not active' };

    const pair = await this.getPairRelationship(conv.pair_id);
    if (!pair || pair.relationship_state !== 'accepted_connection') {
      return { success: false, error: 'Connection is not active' };
    }
    if (pair.member_a_id !== senderId && pair.member_b_id !== senderId) {
      return { success: false, error: 'Sender is not a participant in this conversation' };
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const msgRecord: D1MessageRecord = {
      id,
      conversation_id: conversationId,
      sender_id: senderId,
      receiver_id: receiverId,
      content: content.trim(),
      sent_at: Date.now(),
    };

    const res = await this.db
      .prepare(`INSERT INTO messages (id, conversation_id, sender_id, receiver_id, content, sent_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(id, conversationId, senderId, receiverId, msgRecord.content, msgRecord.sent_at)
      .run();

    return { success: res.success, message: msgRecord };
  }
}
