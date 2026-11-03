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
import {
  revokeStaffToken,
  recordStaffAuditLog,
  getStaffAuditLogs,
} from './adminAuthService';
import {
  getExecutiveOverviewMetrics,
  getGeographicGrowthMapData,
  getCrmMembersDirectory,
  getMemberCrmDetail,
  addMemberCrmNote,
  getSupportTickets,
  updateSupportTicket,
  getSafetyCases,
  resolveSafetyCase,
} from './founderCommandCenterService';
import { IntentionId } from '../types/kithra';
import { generateMemberSelfUnderstandingReport } from '../domain/psychologicalInsightsEngine';
import { generateFounderAnalyticsReport } from '../domain/founderAnalyticsEngine';
import { D1Database } from './worker';
import { KithraD1Service } from './d1Database';

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
  db?: D1Database;
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
  const d1 = options.db ? new KithraD1Service(options.db) : null;

  // Public endpoint 0: Health check
  if (req.method === 'GET' && (req.path === '/api/health' || req.path === '/healthz')) {
    return {
      status: 200,
      body: {
        status: 'healthy',
        timestamp: Date.now(),
        service: 'kithra-api-router',
        hasD1Binding: !!d1,
      },
    };
  }

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
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    // 'founder' and 'admin' roles can access aggregate analytics; 'moderator' is strictly denied
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'analyst']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }

    const report = generateFounderAnalyticsReport();
    return { status: 200, body: { report } };
  }

  // Staff Endpoint: Session Logout & Token Revocation
  if (req.method === 'POST' && req.path === '/api/admin/auth/logout') {
    if (token) {
      revokeStaffToken(token);
    }
    return { status: 200, body: { success: true, message: 'Staff session revoked successfully.' } };
  }

  // Staff Endpoint: Current Staff Profile & Permissions
  if (req.method === 'GET' && req.path === '/api/admin/auth/me') {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    return {
      status: 200,
      body: {
        staff: {
          id: staffAuth.context.staffId,
          email: staffAuth.context.email,
          role: staffAuth.context.role,
          mfaVerified: staffAuth.context.mfaVerified,
          issuedAt: staffAuth.context.issuedAt,
          expiresAt: staffAuth.context.expiresAt,
        },
      },
    };
  }

  // Staff Endpoint: Executive Command Center Overview KPIs
  if (req.method === 'GET' && (req.path === '/api/admin/overview' || req.path.startsWith('/api/admin/overview?'))) {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'finance', 'support', 'moderator', 'analyst', 'researcher', 'auditor']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    recordStaffAuditLog(staffAuth.context.staffId, staffAuth.context.email, staffAuth.context.role, 'Viewed Executive Overview', 'Dashboard', 'Loaded core KPI summary');
    const overview = getExecutiveOverviewMetrics();
    return { status: 200, body: { overview } };
  }

  // Staff Endpoint: Geographic Growth Map Intelligence (Leaflet Indian City Aggregates)
  if (req.method === 'GET' && req.path === '/api/admin/geo/growth-map') {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'analyst']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    recordStaffAuditLog(staffAuth.context.staffId, staffAuth.context.email, staffAuth.context.role, 'Viewed Geographic Growth Map', 'Geographic Intelligence', 'Loaded Indian city aggregates');
    const markers = getGeographicGrowthMapData();
    return { status: 200, body: { markers, totalCities: markers.length, lastRefreshed: Date.now() } };
  }

  // Staff Endpoint: CRM Members Directory (Searchable, Paginated, Zero-Raw-Answers)
  if (req.method === 'GET' && req.path.startsWith('/api/admin/crm/members')) {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'support', 'moderator', 'analyst']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    const url = new URL(req.path, 'https://kithra.local');
    const q = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const city = url.searchParams.get('city') || undefined;
    const intention = url.searchParams.get('intention') || undefined;

    const directory = getCrmMembersDirectory(q, page, 10, { city, intention });
    return { status: 200, body: directory };
  }

  // Staff Endpoint: CRM Member Detail Inspection Card
  if (req.method === 'GET' && req.path.startsWith('/api/admin/crm/member-detail/')) {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'support', 'moderator']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    const memberId = req.path.split('/')[5];
    const detail = getMemberCrmDetail(memberId);
    if (!detail) {
      return { status: 404, body: { error: 'MEMBER_NOT_FOUND', message: 'Member profile not found in CRM directory.' } };
    }
    recordStaffAuditLog(staffAuth.context.staffId, staffAuth.context.email, staffAuth.context.role, 'Inspected Member File', `Member ${memberId}`, 'Loaded CRM card (zero raw answers)');
    return { status: 200, body: { detail } };
  }

  // Staff Endpoint: Add Internal Staff CRM Note
  if (req.method === 'POST' && req.path === '/api/admin/crm/member-note') {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'support', 'moderator']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    const { memberId, noteText } = (req.body as { memberId?: string; noteText?: string }) ?? {};
    if (!memberId || !noteText) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'memberId and noteText are required.' } };
    }
    const note = addMemberCrmNote(memberId, staffAuth.context.staffId, staffAuth.context.email, noteText);
    recordStaffAuditLog(staffAuth.context.staffId, staffAuth.context.email, staffAuth.context.role, 'Added CRM Note', `Member ${memberId}`, noteText);
    return { status: 200, body: { success: true, note } };
  }

  // Staff Endpoint: Support Tickets Queue
  if (req.method === 'GET' && req.path.startsWith('/api/admin/support/tickets')) {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'support']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    const url = new URL(req.path, 'https://kithra.local');
    const status = url.searchParams.get('status') || undefined;
    const tickets = getSupportTickets(status);
    return { status: 200, body: { tickets, totalCount: tickets.length } };
  }

  // Staff Endpoint: Update Support Ticket
  if (req.method === 'POST' && req.path === '/api/admin/support/ticket-update') {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'support']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    const { ticketId, status, priority, assignedStaffId, assignedStaffName } = (req.body as any) ?? {};
    if (!ticketId) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'ticketId is required.' } };
    }
    const updated = updateSupportTicket(ticketId, { status, priority, assignedStaffId, assignedStaffName });
    if (!updated) {
      return { status: 404, body: { error: 'TICKET_NOT_FOUND', message: 'Support ticket not found.' } };
    }
    recordStaffAuditLog(staffAuth.context.staffId, staffAuth.context.email, staffAuth.context.role, 'Updated Support Ticket', `Ticket ${ticketId}`, `Status: ${status || 'unchanged'}`);
    return { status: 200, body: { success: true, ticket: updated } };
  }

  // Staff Endpoint: Trust & Safety Moderation Cases
  if (req.method === 'GET' && req.path.startsWith('/api/admin/safety/cases')) {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'moderator', 'auditor']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    const url = new URL(req.path, 'https://kithra.local');
    const category = url.searchParams.get('category') || undefined;
    const cases = getSafetyCases(category);
    return { status: 200, body: { cases, totalCount: cases.length } };
  }

  // Staff Endpoint: Resolve Safety Case
  if (req.method === 'POST' && req.path === '/api/admin/safety/case-resolve') {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'moderator']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    const { caseId, action, note } = (req.body as any) ?? {};
    if (!caseId || !action) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'caseId and action are required.' } };
    }
    const resolved = resolveSafetyCase(caseId, staffAuth.context.staffId, action, note);
    if (!resolved) {
      return { status: 404, body: { error: 'CASE_NOT_FOUND', message: 'Safety case not found.' } };
    }
    recordStaffAuditLog(staffAuth.context.staffId, staffAuth.context.email, staffAuth.context.role, 'Resolved Safety Case', `Case ${caseId}`, `Action: ${action}`);
    return { status: 200, body: { success: true, case: resolved } };
  }

  // Staff Endpoint: Immutable Staff Activity Audit Log
  if (req.method === 'GET' && req.path === '/api/admin/audit/logs') {
    const staffAuth = await authenticateStaffToken(token);
    if (!staffAuth.authenticated || !staffAuth.context) {
      return { status: 401, body: { error: 'UNAUTHORIZED_STAFF', message: staffAuth.errorMessage } };
    }
    const roleAuth = authorizeStaffRole(staffAuth.context, ['founder', 'admin', 'auditor']);
    if (!roleAuth.allowed) {
      return { status: roleAuth.status, body: { error: 'FORBIDDEN_ROLE', message: roleAuth.message } };
    }
    const logs = getStaffAuditLogs(50);
    return { status: 200, body: { logs, count: logs.length } };
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

      if (d1) {
        await d1.recordQuizAnswer(
          user.userId,
          questionId,
          optionId,
          optionId,
          displayedOptionIndex ?? 0,
          latencyMs ?? 3000
        );
      }

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
    let answers = memberStore.getMemberRawAnswers(user.userId, 'member_self', user.userId);
    if (d1) {
      const d1Answers = await d1.getSavedQuizAnswers(user.userId);
      answers = { ...answers, ...d1Answers };
    }
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
    if (d1) {
      await d1.deleteMemberAssessmentData(user.userId);
    }
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
    if (d1) {
      await d1.blockMember(user.userId, targetMemberId);
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
    if (d1) {
      await d1.unblockMember(user.userId, targetMemberId);
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
    if (d1) {
      await d1.submitMemberReport(user.userId, targetMemberId, category, summary ?? 'Member submitted report');
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

