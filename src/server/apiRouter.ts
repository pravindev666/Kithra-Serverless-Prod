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
import { IntentionId, ExtendedIntentionId } from '../types/kithra';
import { generateMemberSelfUnderstandingReport } from '../domain/psychologicalInsightsEngine';
import { generateFounderAnalyticsReport } from '../domain/founderAnalyticsEngine';
import { D1Database } from './worker';
import { KithraD1Service, LocalD1DatabaseMock } from './d1Database';

const sharedLocalDb = new LocalD1DatabaseMock();

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
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
  const d1 = options.db ? new KithraD1Service(options.db) : new KithraD1Service(sharedLocalDb);

  // Public endpoint 0: Health check
  if (req.method === 'GET' && (req.path === '/api/health' || req.path === '/healthz')) {
    return {
      status: 200,
      body: {
        status: 'healthy',
        timestamp: Date.now(),
        service: 'kithra-api-router',
        hasD1Binding: !!options.db,
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

    // Resolve or provision permanent D1 user record (Phase 14 P1)
    let d1User = await d1.getUserById(auth.context.userId);
    if (!d1User && auth.context.email) {
      const provRes = await d1.resolveOrCreateMemberFromAuth({
        provider: 'google.com',
        providerSubjectId: auth.context.userId,
        email: auth.context.email,
        displayName: auth.context.email.split('@')[0],
        isAdultVerified: auth.context.isAdultVerified,
      });
      d1User = provRes.user;
    }

    const member = memberStore.getMemberById(auth.context.userId);
    return {
      status: 200,
      body: {
        authenticated: true,
        user: {
          id: d1User ? d1User.id : auth.context.userId,
          email: d1User ? d1User.email : auth.context.email,
          role: d1User ? d1User.role : auth.context.role,
          isAdultVerified: d1User ? d1User.is_adult_verified === 1 : auth.context.isAdultVerified,
          accountStatus: d1User ? d1User.account_status : 'active',
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

  // GET /api/member/blocked
  if (req.method === 'GET' && req.path === '/api/member/blocked') {
    if (d1) {
      const blocked = await d1.listBlockedMembers(user.userId);
      return { status: 200, body: { success: true, blockedMembers: blocked } };
    }
    return { status: 200, body: { success: true, blockedMembers: [] } };
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

  // ============================================================================
  // PHASE 11: INTENTION-LOCKED INTRODUCTIONS & CANONICAL PAIR LEDGER ROUTES
  // ============================================================================

  // POST /api/member/introductions (Create Intention Introduction)
  if (req.method === 'POST' && req.path === '/api/member/introductions') {
    const { receiverId, intention, noteText } = (req.body as {
      receiverId?: string;
      intention?: ExtendedIntentionId;
      noteText?: string;
    }) ?? {};

    if (!receiverId || !intention || !noteText || !noteText.trim()) {
      return {
        status: 400,
        body: { error: 'INVALID_PAYLOAD', message: 'receiverId, intention, and non-empty noteText are required.' },
      };
    }

    if (user.userId === receiverId) {
      return {
        status: 400,
        body: { error: 'CANNOT_INTRODUCE_SELF', message: 'Cannot send an introduction note to yourself.' },
      };
    }

    // Attempt D1 ledger insert first if D1 binding is active
    let d1Intro: any = null;
    if (d1) {
      const d1Res = await d1.createIntroduction(user.userId, receiverId, intention, noteText.trim());
      if (!d1Res.success) {
        const statusCode = d1Res.error?.includes('already connected') || d1Res.error?.includes('already pending') ? 409 : 403;
        return { status: statusCode, body: { error: 'INTRODUCTION_FAILED', message: d1Res.error } };
      }
      d1Intro = d1Res.introduction;
    }

    // Keep store state synchronized
    const storeRes = memberStore.createIntroduction({
      senderId: user.userId,
      receiverId,
      intention,
      noteText: noteText.trim(),
    });

    if (!storeRes.success) {
      const statusCode = storeRes.error?.includes('already exists') || storeRes.error?.includes('already connected') ? 409 : 403;
      return { status: statusCode, body: { error: 'INTRODUCTION_FAILED', message: storeRes.error } };
    }

    return {
      status: 201,
      body: {
        success: true,
        introduction: d1Intro ?? storeRes.introduction,
      },
    };
  }

  // GET /api/member/introductions (List Member Introductions)
  if (req.method === 'GET' && req.path === '/api/member/introductions') {
    if (d1) {
      const intros = await d1.getIntroductionsForMember(user.userId);
      return { status: 200, body: { introductions: intros, total: intros.length } };
    }
    const intros = memberStore.getIntroductionsForMember(user.userId);
    return { status: 200, body: { introductions: intros, total: intros.length } };
  }

  // POST /api/member/introductions/:id/accept or :id/respond
  if (
    req.method === 'POST' &&
    req.path.startsWith('/api/member/introductions/') &&
    (req.path.endsWith('/accept') || req.path.endsWith('/respond'))
  ) {
    const parts = req.path.split('/');
    const introId = parts[4];
    if (!introId) {
      return { status: 400, body: { error: 'INVALID_ID', message: 'Introduction ID is required.' } };
    }

    const responseType = req.path.endsWith('/accept') ? 'accept' : ((req.body as any)?.response || 'accept');
    if (responseType === 'decline') {
      if (d1) {
        const d1Res = await d1.declineIntroduction(introId, user.userId);
        if (!d1Res.success) {
          return { status: 400, body: { error: 'DECLINE_FAILED', message: d1Res.error } };
        }
      }
      memberStore.declineIntroduction(introId, user.userId);
      return { status: 200, body: { success: true, status: 'declined' } };
    }

    let acceptRes: any = null;
    if (d1) {
      acceptRes = await d1.acceptIntroduction(introId, user.userId);
      if (!acceptRes.success) {
        return { status: 400, body: { error: 'ACCEPT_FAILED', message: acceptRes.error } };
      }
    }

    const storeRes = memberStore.acceptIntroduction(introId, user.userId);
    if (!storeRes.success && !acceptRes) {
      return { status: 400, body: { error: 'ACCEPT_FAILED', message: storeRes.error } };
    }

    return {
      status: 200,
      body: {
        success: true,
        status: 'accepted_connection',
        conversationId: acceptRes?.conversationId ?? `conv_${introId}`,
        activeSpace: acceptRes?.activeSpace ?? storeRes.introduction?.intention,
      },
    };
  }

  // POST /api/member/introductions/:id/decline
  if (req.method === 'POST' && req.path.startsWith('/api/member/introductions/') && req.path.endsWith('/decline')) {
    const parts = req.path.split('/');
    const introId = parts[4];
    if (!introId) {
      return { status: 400, body: { error: 'INVALID_ID', message: 'Introduction ID is required.' } };
    }

    if (d1) {
      const d1Res = await d1.declineIntroduction(introId, user.userId);
      if (!d1Res.success) {
        return { status: 400, body: { error: 'DECLINE_FAILED', message: d1Res.error } };
      }
    }
    memberStore.declineIntroduction(introId, user.userId);
    return { status: 200, body: { success: true } };
  }

  // POST /api/member/introductions/:id/withdraw
  if (req.method === 'POST' && req.path.startsWith('/api/member/introductions/') && req.path.endsWith('/withdraw')) {
    const parts = req.path.split('/');
    const introId = parts[4];
    if (!introId) {
      return { status: 400, body: { error: 'INVALID_ID', message: 'Introduction ID is required.' } };
    }

    if (d1) {
      const d1Res = await d1.withdrawIntroduction(introId, user.userId);
      if (!d1Res.success) {
        return { status: 400, body: { error: 'WITHDRAW_FAILED', message: d1Res.error } };
      }
    }
    memberStore.withdrawIntroduction(introId, user.userId);
    return { status: 200, body: { success: true } };
  }

  // GET /api/member/connections (List Active Connections)
  if (req.method === 'GET' && req.path === '/api/member/connections') {
    if (d1) {
      const connections = await d1.getActiveConnectionsForMember(user.userId);
      return { status: 200, body: { connections, total: connections.length } };
    }
    const profile = memberStore.getMemberById(user.userId);
    const connMap = profile?.eligibility?.connectedMemberIdsByIntention ?? {};
    return { status: 200, body: { connections: connMap } };
  }

  // ============================================================================
  // PHASE 13: REAL-TIME-READY MESSAGING & CONVERSATION ROUTES
  // ============================================================================

  // GET /api/member/conversations (List Authoritative Conversations for Authenticated Member)
  if (req.method === 'GET' && req.path === '/api/member/conversations') {
    const conversations = await d1.getConversationsForMember(user.userId);
    return { status: 200, body: { conversations, total: conversations.length } };
  }

  // GET /api/member/conversations/:conversationId/messages (Fetch Message History with Cursor/Pagination)
  if (req.method === 'GET' && req.path.startsWith('/api/member/conversations/') && req.path.endsWith('/messages')) {
    const parts = req.path.split('/');
    const conversationId = parts[4];
    if (!conversationId) {
      return { status: 400, body: { error: 'INVALID_CONVERSATION_ID', message: 'Conversation ID required.' } };
    }

    const url = new URL(req.path, 'https://kithra.local');
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!, 10) : undefined;
    const before = url.searchParams.get('before') ? parseInt(url.searchParams.get('before')!, 10) : undefined;
    const after = url.searchParams.get('after') ? parseInt(url.searchParams.get('after')!, 10) : undefined;

    const messages = await d1.getMessages(conversationId, user.userId, { limit, before, after });
    return { status: 200, body: { messages, conversationId, total: messages.length } };
  }

  // POST /api/member/conversations/:conversationId/messages OR /api/member/messages (Send Message)
  if (req.method === 'POST' && (
    (req.path.startsWith('/api/member/conversations/') && req.path.endsWith('/messages')) ||
    req.path === '/api/member/messages'
  )) {
    const parts = req.path.split('/');
    const pathConvId = parts.length >= 5 ? parts[4] : undefined;
    const { conversationId: bodyConvId, receiverId, content, idempotencyKey } = (req.body as {
      conversationId?: string;
      receiverId?: string;
      content?: string;
      idempotencyKey?: string;
    }) ?? {};

    const targetConvId = pathConvId || bodyConvId;
    if (!targetConvId || !content || !content.trim()) {
      return {
        status: 400,
        body: { error: 'INVALID_PAYLOAD', message: 'conversationId and content are required.' },
      };
    }

    const res = await d1.sendMessage(targetConvId, user.userId, content.trim(), receiverId, idempotencyKey);
    if (!res.success) {
      const statusCode = res.error?.includes('blocked') ? 403 : res.error?.includes('Receiver must match') ? 400 : 403;
      return { status: statusCode, body: { error: 'MESSAGE_SEND_FAILED', message: res.error } };
    }

    return { status: 201, body: { success: true, message: res.message } };
  }

  // PATCH /api/member/conversations/:conversationId/read (Mark Read)
  if (req.method === 'PATCH' && req.path.startsWith('/api/member/conversations/') && req.path.endsWith('/read')) {
    const parts = req.path.split('/');
    const conversationId = parts[4];
    if (!conversationId) {
      return { status: 400, body: { error: 'INVALID_CONVERSATION_ID', message: 'Conversation ID required.' } };
    }

    await d1.markConversationRead(conversationId, user.userId);
    return { status: 200, body: { success: true, conversationId } };
  }

  // DELETE /api/member/conversations/:conversationId/messages/:messageId (Delete for Me OR Unsend for Everyone)
  if (req.method === 'DELETE' && req.path.startsWith('/api/member/conversations/') && req.path.includes('/messages/')) {
    const parts = req.path.split('/');
    const messageId = parts[6];
    const { scope } = (req.body as { scope?: 'for_me' | 'unsend' }) ?? {};

    if (!messageId) {
      return { status: 400, body: { error: 'INVALID_MESSAGE_ID', message: 'Message ID required.' } };
    }

    if (scope === 'unsend') {
      const res = await d1.unsendEligibleMessage(messageId, user.userId);
      if (!res.success) {
        return { status: 403, body: { error: 'UNSEND_FAILED', message: res.error } };
      }
      return { status: 200, body: { success: true, scope: 'unsend', messageId } };
    }

    // Default: 'for_me'
    const res = await d1.deleteMessageForMember(messageId, user.userId);
    if (!res.success) {
      return { status: 403, body: { error: 'DELETE_FAILED', message: res.error } };
    }
    return { status: 200, body: { success: true, scope: 'for_me', messageId } };
  }

  // DELETE /api/member/conversations/:conversationId (Delete / Hide Conversation for Me)
  if (req.method === 'DELETE' && req.path.startsWith('/api/member/conversations/') && !req.path.includes('/messages/')) {
    const parts = req.path.split('/');
    const conversationId = parts[4];
    if (!conversationId) {
      return { status: 400, body: { error: 'INVALID_CONVERSATION_ID', message: 'Conversation ID required.' } };
    }

    const res = await d1.deleteConversationForMember(conversationId, user.userId);
    if (!res.success) {
      return { status: 403, body: { error: 'CONVERSATION_DELETE_FAILED', message: res.error } };
    }
    return { status: 200, body: { success: true, scope: 'for_me', conversationId } };
  }

  // POST /api/member/conversations/:conversationId/disconnect (Part Ways Politely / Graceful Disconnect)
  if (req.method === 'POST' && req.path.startsWith('/api/member/conversations/') && req.path.endsWith('/disconnect')) {
    const parts = req.path.split('/');
    const conversationId = parts[4];
    if (!conversationId) {
      return { status: 400, body: { error: 'INVALID_CONVERSATION_ID', message: 'Conversation ID required.' } };
    }

    const conv = await d1.getConversationById(conversationId);
    if (!conv) {
      return { status: 404, body: { error: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found.' } };
    }

    const pair = await d1.getPairRelationship(conv.pair_id);
    if (!pair || (pair.member_a_id !== user.userId && pair.member_b_id !== user.userId)) {
      return { status: 403, body: { error: 'UNAUTHORIZED', message: 'Unauthorized for this connection.' } };
    }

    const res = await d1.disconnectPair(pair.pair_id, user.userId);
    if (!res.success) {
      return { status: 400, body: { error: 'DISCONNECT_FAILED', message: res.error } };
    }
    return { status: 200, body: { success: true, message: 'Connection gracefully concluded and spaces restored.' } };
  }


  // POST /api/member/account/delete (Complete User Account Erasure - DPDP Act 2023)
  if (req.method === 'POST' && req.path === '/api/member/account/delete') {
    const delRes = await d1.deleteAccountData(user.userId);
    memberStore.deleteMemberAssessmentData(user.userId);
    return { status: 200, body: { success: true, auditId: delRes.auditId, message: 'Account and associated records successfully erased.' } };
  }

  // ============================================================================
  // PHASE 12: COMMUNITY CIRCLES, INVITATIONS, RSVP & GATHERING SALON ENDPOINTS
  // ============================================================================

  // POST /api/member/circles (Create a Member Circle / Tribe)
  if (req.method === 'POST' && req.path === '/api/member/circles') {
    if (user.isAdultVerified === false) {
      return {
        status: 403,
        body: { error: 'AGE_VERIFICATION_REQUIRED', message: 'Adult verification (18+) is required to form a Community Circle.' },
      };
    }

    const {
      title, description, intention, city, format, cadence, cohortComfort,
      targetLens, tribeTheme, targetConstructId, targetAffinityTrait,
      maxCapacity, venueDetails, upcomingEventAt
    } = (req.body as any) ?? {};

    const creatorProfile = memberStore.getMemberById(user.userId);
    const creatorName = creatorProfile?.name || (user.email ? user.email.split('@')[0] : 'Member');

    const res = await d1.createCircle(
      user.userId,
      creatorName,
      {
        title,
        description,
        intention,
        city,
        format,
        cadence,
        cohortComfort,
        targetLens,
        tribeTheme,
        targetConstructId,
        targetAffinityTrait,
        maxCapacity,
      },
      venueDetails,
      upcomingEventAt
    );

    if (!res.success) {
      const statusCode = res.error?.includes('strictly restricted') ? 403 : 400;
      return { status: statusCode, body: { error: 'CIRCLE_CREATION_FAILED', message: res.error } };
    }

    return { status: 201, body: { success: true, circle: res.circle } };
  }

  // GET /api/member/circles (List Available Circles)
  if (req.method === 'GET' && req.path === '/api/member/circles') {
    const url = new URL(req.path, 'https://kithra.local');
    const intention = (url.searchParams.get('intention') as ExtendedIntentionId) || undefined;
    const city = url.searchParams.get('city') || undefined;

    const circles = await d1.listCircles(user.userId, intention, city);
    return { status: 200, body: { circles, total: circles.length } };
  }

  // GET /api/member/circles/invitations (List Member Inbound Invitations)
  if (req.method === 'GET' && req.path === '/api/member/circles/invitations') {
    const invitations = await d1.listCircleInvitationsForMember(user.userId);
    return { status: 200, body: { invitations, total: invitations.length } };
  }

  // POST /api/member/circles/invitations/:id/respond (Accept / Decline / Report)
  if (req.method === 'POST' && req.path.startsWith('/api/member/circles/invitations/') && req.path.endsWith('/respond')) {
    const parts = req.path.split('/');
    const invId = parts[5];
    const { response } = (req.body as { response?: 'accept' | 'decline' | 'report' }) ?? {};

    if (!invId || !response) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'Invitation ID and response action (accept/decline/report) are required.' } };
    }

    const res = await d1.respondToCircleInvitation(invId, user.userId, response);
    if (!res.success) {
      return { status: 400, body: { error: 'INVITATION_RESPONSE_FAILED', message: res.error } };
    }
    return { status: 200, body: { success: true, action: response } };
  }

  // GET /api/member/circles/:id (Get Circle details)
  if (req.method === 'GET' && req.path.startsWith('/api/member/circles/') && !req.path.includes('/salon') && !req.path.includes('/invitations')) {
    const circleId = req.path.split('/')[4];
    const circle = await d1.getCircleById(circleId, user.userId);
    if (!circle) {
      return { status: 404, body: { error: 'CIRCLE_NOT_FOUND', message: 'Circle not found.' } };
    }
    return { status: 200, body: { circle } };
  }

  // POST /api/member/circles/:id/join
  if (req.method === 'POST' && req.path.startsWith('/api/member/circles/') && req.path.endsWith('/join')) {
    const circleId = req.path.split('/')[4];
    if (user.isAdultVerified === false) {
      return { status: 403, body: { error: 'AGE_VERIFICATION_REQUIRED', message: 'Adult verification (18+) is required to join a Community Circle.' } };
    }

    const res = await d1.joinCircle(circleId, user.userId);
    if (!res.success) {
      const statusCode = res.error?.includes('capacity') ? 409 : 400;
      return { status: statusCode, body: { error: 'JOIN_FAILED', message: res.error } };
    }
    return { status: 200, body: { success: true } };
  }

  // POST /api/member/circles/:id/leave
  if (req.method === 'POST' && req.path.startsWith('/api/member/circles/') && req.path.endsWith('/leave')) {
    const circleId = req.path.split('/')[4];
    const res = await d1.leaveCircle(circleId, user.userId);
    if (!res.success) {
      return { status: 400, body: { error: 'LEAVE_FAILED', message: res.error } };
    }
    return { status: 200, body: { success: true } };
  }

  // POST /api/member/circles/:id/archive (Host Cancels/Archives Gathering)
  if (req.method === 'POST' && req.path.startsWith('/api/member/circles/') && (req.path.endsWith('/archive') || req.path.endsWith('/cancel'))) {
    const circleId = req.path.split('/')[4];
    const { reason } = (req.body as { reason?: string }) ?? {};
    const res = await d1.archiveCircle(circleId, user.userId, reason);
    if (!res.success) {
      return { status: 400, body: { error: 'ARCHIVE_FAILED', message: res.error } };
    }
    return { status: 200, body: { success: true, message: 'Circle gathering archived.' } };
  }

  // POST /api/member/circles/:id/invite (Invite candidate from Discovery)
  if (req.method === 'POST' && req.path.startsWith('/api/member/circles/') && req.path.endsWith('/invite')) {
    const circleId = req.path.split('/')[4];
    const { inviteeId, lensRationale } = (req.body as { inviteeId?: string; lensRationale?: string }) ?? {};
    if (!inviteeId) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'inviteeId is required.' } };
    }

    // Mutual block check
    const isBlocked = (await d1.isMemberBlocked(user.userId, inviteeId)) || (await d1.isMemberBlocked(inviteeId, user.userId));
    if (isBlocked) {
      return { status: 403, body: { error: 'MUTUAL_BLOCK_ACTIVE', message: 'Cannot invite member due to privacy and safety block settings.' } };
    }

    const res = await d1.inviteToCircle(circleId, user.userId, inviteeId, lensRationale);
    if (!res.success) {
      const statusCode = res.error?.includes('capacity') ? 409 : 400;
      return { status: statusCode, body: { error: 'INVITE_FAILED', message: res.error } };
    }
    return { status: 201, body: { success: true, invitation: res.invitation } };
  }

  // GET /api/member/circles/:id/salon (Gathering Salon bundle)
  if (req.method === 'GET' && req.path.startsWith('/api/member/circles/') && req.path.endsWith('/salon')) {
    const circleId = req.path.split('/')[4];
    const circle = await d1.getCircleById(circleId, user.userId);
    if (!circle) {
      return { status: 404, body: { error: 'CIRCLE_NOT_FOUND', message: 'Circle not found.' } };
    }
    if (!circle.joined) {
      return { status: 403, body: { error: 'NOT_A_MEMBER', message: 'Only confirmed attendees can access the Gathering Salon.' } };
    }

    const notices = await d1.listCircleNotices(circleId, user.userId);
    const reflections = await d1.listCircleReflections(circleId, user.userId);
    const members = await d1.listCircleMembers(circleId, user.userId);

    return {
      status: 200,
      body: {
        circle,
        notices,
        reflections,
        attendees: members,
      },
    };
  }

  // POST /api/member/circles/:id/notices (Host posts notice)
  if (req.method === 'POST' && req.path.startsWith('/api/member/circles/') && req.path.endsWith('/notices')) {
    const circleId = req.path.split('/')[4];
    const { title, content } = (req.body as { title?: string; content?: string }) ?? {};
    if (!title || !content || !title.trim() || !content.trim()) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'Title and content are required.' } };
    }

    const res = await d1.postCircleNotice(circleId, user.userId, title, content);
    if (!res.success) {
      return { status: 403, body: { error: 'NOTICE_FAILED', message: res.error } };
    }
    return { status: 201, body: { success: true, notice: res.notice } };
  }

  // POST /api/member/circles/:id/reflections (Attendee posts reflection)
  if (req.method === 'POST' && req.path.startsWith('/api/member/circles/') && req.path.endsWith('/reflections')) {
    const circleId = req.path.split('/')[4];
    const { content } = (req.body as { content?: string }) ?? {};
    if (!content || !content.trim()) {
      return { status: 400, body: { error: 'INVALID_PAYLOAD', message: 'Content is required.' } };
    }

    const authorProfile = memberStore.getMemberById(user.userId);
    const authorName = authorProfile?.name || (user.email ? user.email.split('@')[0] : 'Attendee');

    const res = await d1.postCircleReflection(circleId, user.userId, authorName, content);
    if (!res.success) {
      return { status: 403, body: { error: 'REFLECTION_FAILED', message: res.error } };
    }
    return { status: 201, body: { success: true, reflection: res.reflection } };
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

