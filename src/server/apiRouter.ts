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
  AuthVerificationResult,
  authorizeAssessmentAccess,
  verifyFirebaseToken,
  verifyFirebaseTokenCryptographic,
  initiateStaffLogin,
  verifyStaffMfaCode,
  authenticateStaffToken,
  authorizeStaffRole,
} from './authMiddleware';
import { IntentionId } from '../types/kithra';
import { generateMemberSelfUnderstandingReport } from '../domain/psychologicalInsightsEngine';
import { generateFounderAnalyticsReport } from '../domain/founderAnalyticsEngine';

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

export interface ApiRouterOptions {
  requireCrypto?: boolean;
  allowDevTokens?: boolean;
}

/**
 * Main API Dispatcher
 */
export async function handleApiRequest(
  req: ApiRequest,
  options: ApiRouterOptions = {}
): Promise<ApiResponse> {
  const authHeader = req.headers['authorization'] ?? req.headers['Authorization'] ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // Public endpoint 1: Staff Admin Login (Step 1: Credential verification & MFA challenge generation)
  if (req.method === 'POST' && req.path === '/api/admin/auth/login') {
    const { email, password } = (req.body as { email?: string; password?: string }) ?? {};
    if (!email || !password) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'Staff email and password are required.' } };
    }
    const result = await initiateStaffLogin(email, password);
    if (!result.success) {
      return { status: 401, body: { error: 'STAFF_AUTH_FAILED', message: result.errorMessage } };
    }
    return { status: 200, body: result };
  }

  // Public endpoint 2: Staff MFA Verification (Step 2: TOTP code validation & session creation)
  if (req.method === 'POST' && req.path === '/api/admin/auth/verify-mfa') {
    const { challengeId, mfaCode } = (req.body as { challengeId?: string; mfaCode?: string }) ?? {};
    if (!challengeId || !mfaCode) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'challengeId and 6-digit mfaCode are required.' } };
    }
    const result = await verifyStaffMfaCode(challengeId, mfaCode);
    if (!result.success || !result.session) {
      return { status: 401, body: { error: 'MFA_FAILED', message: result.errorMessage } };
    }
    return {
      status: 200,
      body: {
        success: true,
        session: {
          staffId: result.session.staffId,
          email: result.session.email,
          role: result.session.role,
          mfaVerified: result.session.mfaVerified,
          token: result.session.token,
          expiresAt: result.session.expiresAt,
        },
      },
    };
  }

  // Privileged Staff Endpoint: Privacy-Preserving Founder Analytics Dashboard
  if (req.method === 'GET' && req.path === '/api/admin/analytics/aggregate') {
    const staffAuth = authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    // Only 'admin' role can access aggregate analytics; 'moderator' is strictly denied
    const roleAuth = authorizeStaffRole(staffAuth.context, ['admin']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }

    const report = generateFounderAnalyticsReport();
    return { status: 200, body: { report } };
  }

  const authenticate = async (): Promise<AuthVerificationResult> => {
    if (options.requireCrypto) {
      return verifyFirebaseTokenCryptographic(token, {
        allowDevTokens: options.allowDevTokens,
      });
    }
    return verifyFirebaseToken(token);
  };

  // Public endpoint: Session establishment / verification
  if (req.method === 'POST' && req.path === '/api/auth/session') {
    const auth = await authenticate();
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
  const auth = await authenticate();
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

  // GET /api/member/insights (Member-Controlled Psychological Self-Understanding Report)
  if (req.method === 'GET' && req.path === '/api/member/insights') {
    const rawAnswers = memberStore.getMemberRawAnswers(user.userId, 'member_self', user.userId);
    const report = generateMemberSelfUnderstandingReport(user.userId, rawAnswers);
    return { status: 200, body: { report } };
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

  // GET /api/member/assessment/answers (Cross-device resumption for self)
  if (req.method === 'GET' && req.path === '/api/member/assessment/answers') {
    const answers = memberStore.getMemberRawAnswers(user.userId, 'member_self', user.userId);
    return {
      status: 200,
      body: {
        answers,
        totalAnswered: Object.keys(answers).length,
      },
    };
  }

  // DELETE /api/member/assessment/delete (Section 12 DPDP Act 2023 erasure & Section 6(4) consent withdrawal)
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

