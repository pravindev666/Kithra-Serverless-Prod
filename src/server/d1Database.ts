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
  } = {
    users: new Map(),
    quiz_answers: new Map(),
    trait_snapshots: new Map(),
    member_eligibility: new Map(),
    member_blocks: new Map(),
    member_reports: new Map(),
    audit_logs: new Map(),
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
}
