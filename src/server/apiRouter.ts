/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PRODUCTION API ROUTER & ENDPOINT CONTROLLERS
 * 
 * Clean, portable controller functions compatible with Cloudflare Workers / Hono / Express.
 * Implements real assessment recording, dynamic matching, DPDP Act 2023 deletion,
 * and strict privacy guards.
 */

import { memberStore } from '../domain/memberStore';
import {
  AuthContext,
  authorizeAssessmentAccess,
  verifyFirebaseToken,
} from './authMiddleware';
import { IntentionId } from '../types/kithra';

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  path: string;
  headers: Record<string, string>;
  body?: unknown;
  params?: Record<string, string>;
}

/**
 * Main API Dispatcher
 */
export async function handleApiRequest(req: ApiRequest): Promise<ApiResponse> {
  const authHeader = req.headers['authorization'] ?? req.headers['Authorization'] ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // Public endpoint: Session establishment / verification
  if (req.method === 'POST' && req.path === '/api/auth/session') {
    const auth = verifyFirebaseToken(token);
    if (!auth.authenticated || !auth.context) {
      return {
        status: 401,
        body: { error: auth.errorCode, message: auth.errorMessage },
      };
    }
    const member = memberStore.getMemberById(auth.context.userId);
    return {
      status: 200,
      body: {
        authenticated: true,
        user: {
          id: auth.context.userId,
          email: auth.context.email,
          role: auth.context.role,
        },
        profile: member ?? null,
      },
    };
  }

  // All endpoints below require valid authentication
  const auth = verifyFirebaseToken(token);
  if (!auth.authenticated || !auth.context) {
    return {
      status: 401,
      body: { error: auth.errorCode, message: auth.errorMessage },
    };
  }

  const user = auth.context;

  // GET /api/member/profile
  if (req.method === 'GET' && req.path === '/api/member/profile') {
    const profile = memberStore.getMemberById(user.userId);
    if (!profile) {
      return { status: 404, body: { error: 'PROFILE_NOT_FOUND', message: 'Member profile not found.' } };
    }
    return { status: 200, body: { profile } };
  }

  // POST /api/member/assessment/answers
  if (req.method === 'POST' && req.path === '/api/member/assessment/answers') {
    const { questionId, optionId, latencyMs, displayedOptionIndex } = (req.body as {
      questionId?: string;
      optionId?: string;
      latencyMs?: number;
      displayedOptionIndex?: number;
    }) ?? {};

    if (!questionId || !optionId) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'questionId and optionId are required.' } };
    }

    try {
      const result = memberStore.saveMemberAnswer(
        user.userId,
        questionId,
        optionId,
        latencyMs ?? 3000,
        displayedOptionIndex
      );
      return {
        status: 200,
        body: {
          success: true,
          quality: result.quality,
          constructProfile: result.constructProfile,
          primaryPattern: result.profile.experimentalPrimaryPattern,
          secondaryPattern: result.profile.experimentalSecondaryPattern,
        },
      };
    } catch (err) {
      return { status: 500, body: { error: 'SAVE_FAILED', message: String(err) } };
    }
  }

  // DELETE /api/member/assessment/delete (Section 27 DPDP Act data erasure)
  if (req.method === 'DELETE' && req.path === '/api/member/assessment/delete') {
    const result = memberStore.deleteMemberAssessmentData(user.userId);
    return { status: 200, body: result };
  }

  // GET /api/member/matches
  if (req.method === 'GET' && req.path.startsWith('/api/member/matches')) {
    const url = new URL(req.path, 'https://kithra.local');
    const intention = (url.searchParams.get('intention') ?? 'all') as IntentionId | 'all';
    const matches = memberStore.getDynamicMatchesForActiveMember(user.userId, intention);
    return { status: 200, body: { matches, total: matches.length } };
  }

  // POST /api/member/block
  if (req.method === 'POST' && req.path === '/api/member/block') {
    const { targetMemberId } = (req.body as { targetMemberId?: string }) ?? {};
    if (!targetMemberId) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'targetMemberId is required.' } };
    }
    memberStore.blockMember(user.userId, targetMemberId);
    return { status: 200, body: { success: true, blockedMemberId: targetMemberId } };
  }

  // POST /api/member/unblock
  if (req.method === 'POST' && req.path === '/api/member/unblock') {
    const { targetMemberId } = (req.body as { targetMemberId?: string }) ?? {};
    if (!targetMemberId) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'targetMemberId is required.' } };
    }
    memberStore.unblockMember(user.userId, targetMemberId);
    return { status: 200, body: { success: true, unblockedMemberId: targetMemberId } };
  }

  // POST /api/member/report
  if (req.method === 'POST' && req.path === '/api/member/report') {
    const { targetMemberId, category, summary } = (req.body as {
      targetMemberId?: string;
      category?: 'Impersonation concern' | 'Photo report' | 'Group moderation' | 'Boundary concern' | 'Account verification';
      summary?: string;
    }) ?? {};
    if (!targetMemberId || !category) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'targetMemberId and category are required.' } };
    }
    const reportCase = memberStore.submitMemberReport(
      user.userId,
      targetMemberId,
      category,
      summary ?? 'Member submitted report'
    );
    return { status: 200, body: { success: true, reportCase } };
  }

  // GET /api/admin/quiz-answers/:memberId (STRICT PRIVACY TEST)
  if (req.path.startsWith('/api/admin/quiz-answers/')) {
    const targetMemberId = req.path.split('/')[4];
    const access = authorizeAssessmentAccess(user, targetMemberId, true);
    if (!access.allowed) {
      return {
        status: access.status,
        body: {
          error: access.code,
          message: access.message,
        },
      };
    }
    // If member themselves requested through admin path (abnormal, but authorized)
    const answers = memberStore.getMemberRawAnswers(targetMemberId, 'member_self', user.userId);
    return { status: 200, body: { answers } };
  }

  return { status: 404, body: { error: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found.` } };
}

