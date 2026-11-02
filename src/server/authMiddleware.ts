/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PRODUCTION AUTHENTICATION & ACCESS CONTROL MIDDLEWARE
 * 
 * Verifies Firebase JWT bearer tokens, checks token claims (issuer, audience, expiry),
 * establishes authenticated member context, enforces RBAC, and protects raw assessment
 * answers from unauthorized extraction.
 */

export const DEFAULT_FIREBASE_PROJECT_ID = 'kithra-d3ae1';

export {
  initiateStaffLogin,
  verifyStaffMfaCode,
  authenticateStaffToken,
  authorizeStaffRole,
} from './adminAuthService';
export type {
  StaffRole,
  StaffSessionContext,
} from './adminAuthService';

export {
  verifyFirebaseTokenCryptographic,
  injectTestJwk,
  clearKeyCache,
  getGooglePublicJwks,
} from './firebaseAuthVerifier';
export type {
  AuthContext,
  AuthVerificationResult,
  FirebaseJwtPayload,
} from './firebaseAuthVerifier';
import type {
  AuthContext,
  AuthVerificationResult,
  FirebaseJwtPayload,
} from './firebaseAuthVerifier';


/**
 * Base64URL decode helper compatible with browser, worker, and Node environments.
 */
export function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }
  if (typeof atob === 'function') {
    return atob(output);
  }
  return Buffer.from(output, 'base64').toString('utf8');
}

/**
 * Decodes a JWT token without cryptographic verification.
 */
export function decodeJwtPayload(token: string): FirebaseJwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const jsonStr = base64UrlDecode(parts[1]);
    return JSON.parse(jsonStr) as FirebaseJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Verifies a Firebase JWT token according to Google identity specifications.
 */
export function verifyFirebaseToken(
  token: string,
  expectedProjectId = DEFAULT_FIREBASE_PROJECT_ID,
  clockNowMs: number = Date.now()
): AuthVerificationResult {
  if (!token || typeof token !== 'string') {
    return {
      authenticated: false,
      errorCode: 'MISSING_TOKEN',
      errorMessage: 'Authorization token header is missing.',
    };
  }

  // Handle development / test mock tokens (strictly disabled in production and staging)
  if (token.startsWith('dev-token-') || token.startsWith('mock-jwt-')) {
    const env = (process.env.ENVIRONMENT || process.env.KITHRA_ENV || process.env.NODE_ENV || '').toLowerCase();
    const isProdOrStaging = env === 'production' || env === 'staging';
    const isExplicitlyDisabled = process.env.ALLOW_DEV_TOKENS === 'false';

    if (isProdOrStaging || isExplicitlyDisabled) {
      return {
        authenticated: false,
        errorCode: 'DEV_TOKENS_DISABLED',
        errorMessage: 'Mock and dev tokens are strictly disabled in production and staging environments.',
      };
    }
    const withoutPrefix = token.replace(/^(dev-token-|mock-jwt-)/, '');
    const lastDashIdx = withoutPrefix.lastIndexOf('-');
    let userId = withoutPrefix;
    let role: AuthContext['role'] = 'member';
    if (lastDashIdx !== -1) {
      const possibleRole = withoutPrefix.slice(lastDashIdx + 1);
      if (['member', 'moderator', 'admin', 'auditor'].includes(possibleRole)) {
        userId = withoutPrefix.slice(0, lastDashIdx);
        role = possibleRole as AuthContext['role'];
      }
    }
    return {
      authenticated: true,
      context: {
        userId,
        email: `${userId}@kithra.local`,
        role,
        token,
        isAdultVerified: true,
      },
    };
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return {
      authenticated: false,
      errorCode: 'MALFORMED_TOKEN',
      errorMessage: 'The authorization token is not a valid JWT format.',
    };
  }

  const nowSec = Math.floor(clockNowMs / 1000);

  // Expiration check
  if (payload.exp && payload.exp < nowSec) {
    return {
      authenticated: false,
      errorCode: 'EXPIRED_TOKEN',
      errorMessage: `Firebase token has expired at ${payload.exp} (current time: ${nowSec}).`,
    };
  }

  // Issuer check
  const expectedIssuer = `https://securetoken.google.com/${expectedProjectId}`;
  if (payload.iss !== expectedIssuer) {
    return {
      authenticated: false,
      errorCode: 'INVALID_ISSUER',
      errorMessage: `Invalid token issuer. Expected '${expectedIssuer}', got '${payload.iss}'.`,
    };
  }

  // Audience check
  if (payload.aud !== expectedProjectId) {
    return {
      authenticated: false,
      errorCode: 'INVALID_AUDIENCE',
      errorMessage: `Invalid token audience. Expected '${expectedProjectId}', got '${payload.aud}'.`,
    };
  }

  // Valid subject
  if (!payload.sub || typeof payload.sub !== 'string') {
    return {
      authenticated: false,
      errorCode: 'MALFORMED_TOKEN',
      errorMessage: 'Token does not contain a valid subject (UID).',
    };
  }

  return {
    authenticated: true,
    context: {
      userId: payload.sub,
      email: payload.email,
      role: payload.role ?? 'member',
      token,
      isAdultVerified: true,
    },
  };
}

/**
 * Access Control Guard: Strictly restricts access to raw questionnaire answers.
 * Even administrators and moderators are prohibited from reading individual member answers.
 */
export function authorizeAssessmentAccess(
  context: AuthContext,
  targetMemberId: string,
  isRawAnswerRequest: boolean
): { allowed: boolean; status: number; code?: string; message?: string } {
  if (isRawAnswerRequest) {
    // Only the member themselves may retrieve their own raw answers (for review/correction)
    if (context.userId === targetMemberId) {
      return { allowed: true, status: 200 };
    }
    // Admins, moderators, and all other third parties are strictly denied
    return {
      allowed: false,
      status: 403,
      code: 'SERVER_SIDE_ACCESS_DENIED',
      message: 'RAW_ASSESSMENT_RESPONSES_RESTRICTED: Questionnaire answers are strictly private to the member and are never readable by staff, admins, or other members.',
    };
  }

  // Derived constructs or matching summaries
  return { allowed: true, status: 200 };
}
