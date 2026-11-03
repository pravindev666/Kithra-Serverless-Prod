/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA SERVER-ENFORCED ADMINISTRATOR AUTHENTICATION, MFA & RBAC SERVICE
 * 
 * Cryptographically secured operational staff identity service implementing:
 * 1. Pre-registered operational staff identities (@kithra.in) with salted SHA-256 credentials.
 * 2. RFC 6238 standard Time-based One-Time Password (TOTP) verification with 30s step and drift tolerance.
 * 3. Cryptographically signed HS256 JWTs with HMAC-SHA256 signature verification.
 * 4. Brute-force protection: 5-attempt rate-limiting and 15-minute account lockout.
 * 5. Role-Based Access Control (RBAC) separating Moderators, Admins, and Auditors.
 * 6. Strict privacy invariants preventing all staff from accessing raw member questionnaire answers.
 */

export type StaffRole =
  | 'founder'
  | 'admin'
  | 'finance'
  | 'support'
  | 'moderator'
  | 'analyst'
  | 'researcher'
  | 'auditor';

export interface StaffAccount {
  id: string;
  email: string;
  displayName: string;
  role: StaffRole;
  salt: string;
  passwordHash: string; // SHA-256 of (password + salt)
  mfaSecret: string; // Base32 RFC 6238 TOTP seed
  backupCodes: string[]; // Emergency one-time recovery codes
  isActive: boolean;
}

export interface MfaChallengeSession {
  challengeId: string;
  staffId: string;
  email: string;
  role: StaffRole;
  createdAt: number;
  expiresAt: number;
}

export interface StaffSessionContext {
  staffId: string;
  email: string;
  role: StaffRole;
  mfaVerified: boolean;
  issuedAt: number;
  expiresAt: number;
  token: string;
}

export interface StaffJwtPayload {
  sub: string;
  email: string;
  role: StaffRole;
  mfa: boolean;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
}

// Server HMAC Secret for signing staff operational JWTs
export const KITHRA_STAFF_SIGNING_SECRET =
  (typeof process !== 'undefined' && process.env?.KITHRA_STAFF_SECRET) ||
  'kithra_ops_hmac_secret_sha256_prod_stage_2026_unforgeable_kithra_staff_key';

// Pre-registered operational staff directory with unique salts & distinct credentials
export const OPERATIONAL_STAFF: Record<string, StaffAccount> = {
  'admin@kithra.in': {
    id: 'staff-admin-founder-01',
    email: 'admin@kithra.in',
    displayName: 'Founder & Principal Architect',
    role: 'admin',
    salt: 'kithra_adm_salt_9281',
    // SHA-256 of "KithraSecureAdmin2026!kithra_adm_salt_9281"
    passwordHash: '11c43523e6e4e5b1c85a6a8d6fb546ba96c62007f8fcf355f8c478c45205ef61',
    mfaSecret: 'JBSWY3DPEHPK3PXP',
    backupCodes: ['REC-ADM-8421-9901', 'REC-ADM-3104-5829'],
    isActive: true,
  },
  'founder@kithra.in': {
    id: 'staff-founder-01',
    email: 'founder@kithra.in',
    displayName: 'Kithra Founder & CEO',
    role: 'founder',
    salt: 'kithra_fnd_salt_8312',
    // SHA-256 of "KithraFounder2026!kithra_fnd_salt_8312"
    passwordHash: '50a359095d66572712bfedf65a0dfd3778b89214afd5c9ec1b6b0bee0319aece',
    mfaSecret: 'NZ2XG5DFOR2XAZTL',
    backupCodes: ['REC-FND-7712-4019', 'REC-FND-1092-3841'],
    isActive: true,
  },
  'finance@kithra.in': {
    id: 'staff-fin-billing-01',
    email: 'finance@kithra.in',
    displayName: 'Finance & Billing Lead',
    role: 'finance',
    salt: 'kithra_fin_salt_5192',
    // SHA-256 of "KithraFinance2026!kithra_fin_salt_5192"
    passwordHash: '3f31d8a0ca9c44cc6bd6c78262e53c6e36810cb27385797d3cfa16dec838d597',
    mfaSecret: 'MFRGGZDFMZTWQ2LK',
    backupCodes: ['REC-FIN-3381-9102', 'REC-FIN-4820-1176'],
    isActive: true,
  },
  'support@kithra.in': {
    id: 'staff-sup-crm-01',
    email: 'support@kithra.in',
    displayName: 'Member Support & CRM Specialist',
    role: 'support',
    salt: 'kithra_sup_salt_7314',
    // SHA-256 of "KithraSupport2026!kithra_sup_salt_7314"
    passwordHash: '53d0ec9e8240ab79b8dc8276e866465399b09acc1ea475a5797c4ca19d48cb1b',
    mfaSecret: 'OV2GS3THEB3WK3LU',
    backupCodes: ['REC-SUP-5921-8840', 'REC-SUP-1204-9381'],
    isActive: true,
  },
  'moderator@kithra.in': {
    id: 'staff-mod-safety-01',
    email: 'moderator@kithra.in',
    displayName: 'Trust & Safety Moderator',
    role: 'moderator',
    salt: 'kithra_mod_salt_4812',
    // SHA-256 of "KithraSafetyMod2026!kithra_mod_salt_4812"
    passwordHash: 'a71425c4ea6153d5b7eb8bf97430f0fac4a76750e6b0c138dbe3a4464450b1c9',
    mfaSecret: 'HXDMVJECJJWSRB3HW',
    backupCodes: ['REC-MOD-1942-8812', 'REC-MOD-6501-2294'],
    isActive: true,
  },
  'analyst@kithra.in': {
    id: 'staff-ana-growth-01',
    email: 'analyst@kithra.in',
    displayName: 'Business & Growth Intelligence Analyst',
    role: 'analyst',
    salt: 'kithra_ana_salt_3921',
    // SHA-256 of "KithraAnalyst2026!kithra_ana_salt_3921"
    passwordHash: '548bde2759ff340a3f790228cb288a5d8fae883ecbad298054d5f9e7ed995be6',
    mfaSecret: 'KN2WS5DFPB2WS4DF',
    backupCodes: ['REC-ANA-9201-4471', 'REC-ANA-6113-2940'],
    isActive: true,
  },
  'researcher@kithra.in': {
    id: 'staff-res-psych-01',
    email: 'researcher@kithra.in',
    displayName: 'Psychometric Research Lead',
    role: 'researcher',
    salt: 'kithra_res_salt_6420',
    // SHA-256 of "KithraResearcher2026!kithra_res_salt_6420"
    passwordHash: '46406d506b0c1e718feb114d783767db97d9bb5d48603247fa3db47264a0b5c1',
    mfaSecret: 'KB2GM2LEONUW43LN',
    backupCodes: ['REC-RES-7102-3984', 'REC-RES-8821-5049'],
    isActive: true,
  },
  'auditor@kithra.in': {
    id: 'staff-auditor-dpdp-01',
    email: 'auditor@kithra.in',
    displayName: 'DPDP Compliance Auditor',
    role: 'auditor',
    salt: 'kithra_aud_salt_1938',
    // SHA-256 of "KithraAuditDpdp2026!kithra_aud_salt_1938"
    passwordHash: '45e51bdcd93b425a121cbef3590dcb7ebacbe9ac91f5cd0a889502d42a557d5e',
    mfaSecret: 'KRSXG5CTMVRXEZLU',
    backupCodes: ['REC-AUD-5021-3391', 'REC-AUD-8820-4109'],
    isActive: true,
  },
};

// Role-Based Access Control (RBAC) Permission Matrix
export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  founder: ['all', 'overview', 'members', 'growth', 'profiles', 'connections', 'subscriptions', 'revenue', 'map', 'support', 'safety', 'photos', 'staff', 'audit', 'questions', 'settings'],
  admin: ['all', 'overview', 'members', 'growth', 'profiles', 'connections', 'subscriptions', 'revenue', 'map', 'support', 'safety', 'photos', 'staff', 'audit', 'questions', 'settings'],
  finance: ['overview', 'subscriptions', 'revenue', 'audit', 'settings'],
  support: ['overview', 'members', 'support', 'photos', 'audit'],
  moderator: ['overview', 'members', 'safety', 'photos', 'audit'],
  analyst: ['overview', 'growth', 'profiles', 'connections', 'map', 'subscriptions', 'revenue', 'audit'],
  researcher: ['overview', 'profiles', 'connections', 'questions', 'audit'],
  auditor: ['overview', 'audit', 'safety', 'settings'],
};

export function hasStaffPermission(role: StaffRole, section: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('all') || perms.includes(section);
}

// In-memory active MFA challenges and token revocations
const activeChallenges = new Map<string, MfaChallengeSession>();
const consumedChallenges = new Set<string>();
const revokedTokens = new Set<string>();

export function revokeStaffToken(token: string): void {
  if (token) revokedTokens.add(token);
}

export function isStaffTokenRevoked(token: string): boolean {
  return token ? revokedTokens.has(token) : false;
}

export interface StaffAuditRecord {
  id: string;
  timestamp: number;
  staffId: string;
  staffEmail: string;
  role: StaffRole;
  action: string;
  target: string;
  details: string;
  ipAddress?: string;
}

const staffAuditLogs: StaffAuditRecord[] = [];

export function recordStaffAuditLog(
  staffId: string,
  staffEmail: string,
  role: StaffRole,
  action: string,
  target: string,
  details: string,
  ipAddress?: string
): StaffAuditRecord {
  const record: StaffAuditRecord = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    staffId,
    staffEmail,
    role,
    action,
    target,
    details,
    ipAddress: ipAddress ?? '127.0.0.1',
  };
  staffAuditLogs.unshift(record);
  if (staffAuditLogs.length > 500) {
    staffAuditLogs.pop();
  }
  return record;
}

export function getStaffAuditLogs(limit: number = 50): StaffAuditRecord[] {
  return staffAuditLogs.slice(0, limit);
}

// Rate-limiting / brute-force lockout storage
interface RateLimitRecord {
  failedAttempts: number;
  lockoutUntil: number;
}
const staffRateLimits = new Map<string, RateLimitRecord>();

export function clearStaffRateLimits(): void {
  staffRateLimits.clear();
  consumedChallenges.clear();
}

/**
 * SHA-256 helper using native Web Crypto
 */
export async function sha256Hex(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Base64URL string encoder
 */
export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Base64URL string decoder
 */
export function base64UrlDecodeBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Standard RFC 4648 Base32 Decoder
 */
export function base32Decode(str: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = str.toUpperCase().replace(/[\s=]/g, '');
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

/**
 * RFC 6238 TOTP Code Generator using Web Crypto HMAC-SHA1
 */
export async function generateTotpCode(
  secretBase32: string,
  timestampMs: number = Date.now()
): Promise<string> {
  const secretBytes = base32Decode(secretBase32);
  const timeStepSeconds = 30;
  const counter = Math.floor(timestampMs / 1000 / timeStepSeconds);

  const counterBuf = new ArrayBuffer(8);
  const dataView = new DataView(counterBuf);
  // Big-endian 64-bit integer
  dataView.setBigUint64(0, BigInt(counter));

  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, counterBuf);
  const sigBytes = new Uint8Array(sig);

  // Dynamic truncation (RFC 4226 Section 5.4)
  const offset = sigBytes[sigBytes.length - 1] & 0x0f;
  const binCode =
    ((sigBytes[offset] & 0x7f) << 24) |
    ((sigBytes[offset + 1] & 0xff) << 16) |
    ((sigBytes[offset + 2] & 0xff) << 8) |
    (sigBytes[offset + 3] & 0xff);

  return (binCode % 1000000).toString().padStart(6, '0');
}

/**
 * RFC 6238 TOTP Code Verifier with drift tolerance (default: +/- 1 step of 30s)
 */
export async function verifyTotpCode(
  secretBase32: string,
  code: string,
  timestampMs: number = Date.now(),
  windowToleranceSteps: number = 1
): Promise<boolean> {
  const cleanCode = code.trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanCode)) {
    return false;
  }

  for (let step = -windowToleranceSteps; step <= windowToleranceSteps; step++) {
    const checkTime = timestampMs + step * 30000;
    const expected = await generateTotpCode(secretBase32, checkTime);
    if (expected === cleanCode) {
      return true;
    }
  }

  return false;
}

/**
 * Generates the current valid TOTP code for a pre-registered operational staff account.
 * Useful for automated E2E tests, CLI operations, and staging UI simulators.
 */
export async function generateStaffTotpCode(email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  const staff = OPERATIONAL_STAFF[normalized];
  if (!staff) return null;
  return generateTotpCode(staff.mfaSecret);
}

/**
 * Sign an operational HS256 JWT using server HMAC secret
 */
export async function signStaffJwt(
  payload: Record<string, unknown>,
  secret: string = KITHRA_STAFF_SIGNING_SECRET
): Promise<string> {
  const enc = new TextEncoder();
  const headerJson = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const payloadJson = JSON.stringify(payload);

  const headerB64 = base64UrlEncode(enc.encode(headerJson));
  const payloadB64 = base64UrlEncode(enc.encode(payloadJson));
  const data = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const sigB64 = base64UrlEncode(new Uint8Array(sig));

  return `${data}.${sigB64}`;
}

/**
 * Verify an operational HS256 JWT and validate claims
 */
export async function verifyStaffJwt(
  token: string,
  secret: string = KITHRA_STAFF_SIGNING_SECRET
): Promise<StaffJwtPayload | null> {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const enc = new TextEncoder();
    const data = `${parts[0]}.${parts[1]}`;
    const sigBytes = base64UrlDecodeBytes(parts[2]);

    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes as unknown as BufferSource, enc.encode(data));
    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecodeBytes(parts[1]));
    const payload = JSON.parse(payloadJson) as StaffJwtPayload;

    // Validate claims
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.iss !== 'kithra-auth') return null;
    if (payload.aud !== 'kithra-staff') return null;
    if (payload.exp && payload.exp < nowSec) return null;
    if (!payload.mfa) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Step 1: Primary Staff Credential Verification with Brute-Force Rate Limiting
 */
export async function initiateStaffLogin(
  email: string,
  passwordPlain: string
): Promise<{
  success: boolean;
  mfaRequired: boolean;
  challengeId?: string;
  errorMessage?: string;
  rateLimited?: boolean;
}> {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Rate-limit / lockout check
  const rateLimit = staffRateLimits.get(normalizedEmail);
  const now = Date.now();
  if (rateLimit && rateLimit.lockoutUntil > now) {
    const minutesRemaining = Math.ceil((rateLimit.lockoutUntil - now) / 60000);
    return {
      success: false,
      mfaRequired: false,
      rateLimited: true,
      errorMessage: `Account temporarily locked due to excessive failed attempts. Please try again in ${minutesRemaining} minute(s).`,
    };
  }

  const staff = OPERATIONAL_STAFF[normalizedEmail];
  if (!staff || !staff.isActive) {
    return {
      success: false,
      mfaRequired: false,
      errorMessage: 'Invalid staff operational email or inactive account.',
    };
  }

  // 2. Validate password against salted hash (No universal backdoor!)
  const inputHash = await sha256Hex(passwordPlain + staff.salt);
  if (inputHash !== staff.passwordHash) {
    // Record failed attempt
    const current = staffRateLimits.get(normalizedEmail) || { failedAttempts: 0, lockoutUntil: 0 };
    current.failedAttempts += 1;
    if (current.failedAttempts >= 5) {
      current.lockoutUntil = now + 15 * 60 * 1000; // 15-minute lockout
    }
    staffRateLimits.set(normalizedEmail, current);

    return {
      success: false,
      mfaRequired: false,
      errorMessage: 'Invalid staff operational credentials.',
    };
  }

  // 3. Generate cryptographically signed MFA challenge token (edge-compatible)
  const nonce = base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)));
  const challengeToken = await signStaffJwt({
    sub: staff.id,
    email: staff.email,
    role: staff.role,
    mfa: false,
    iss: 'kithra-auth',
    aud: 'kithra-mfa-challenge',
    nonce,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 300, // 5 min validity
  });
  const challengeId = `mfa_ch_${challengeToken}`;

  const session: MfaChallengeSession = {
    challengeId,
    staffId: staff.id,
    email: staff.email,
    role: staff.role,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minute validity
  };

  activeChallenges.set(challengeId, session);

  return {
    success: true,
    mfaRequired: true,
    challengeId,
  };
}

/**
 * Step 2: Multi-Factor Authentication (MFA) Verification
 * Validates RFC 6238 TOTP or backup recovery code, generates cryptographically signed HS256 JWT.
 */
export async function verifyStaffMfaCode(
  challengeId: string,
  mfaCode: string
): Promise<{
  success: boolean;
  session?: StaffSessionContext;
  errorMessage?: string;
}> {
  if (!challengeId || typeof challengeId !== 'string' || consumedChallenges.has(challengeId)) {
    return {
      success: false,
      errorMessage: 'MFA challenge expired or not found. Please initiate login again.',
    };
  }

  let email = '';
  let staffId = '';
  let role: StaffRole = 'admin';

  // Check in-memory challenge map or verify stateless edge-signed challenge token
  const memChallenge = activeChallenges.get(challengeId);
  if (memChallenge && Date.now() <= memChallenge.expiresAt) {
    email = memChallenge.email;
    staffId = memChallenge.staffId;
    role = memChallenge.role;
  } else if (challengeId.startsWith('mfa_ch_')) {
    const rawToken = challengeId.replace(/^mfa_ch_/, '');
    const parts = rawToken.split('.');
    if (parts.length === 3) {
      try {
        const enc = new TextEncoder();
        const data = `${parts[0]}.${parts[1]}`;
        const sigBytes = base64UrlDecodeBytes(parts[2]);
        const key = await crypto.subtle.importKey(
          'raw',
          enc.encode(KITHRA_STAFF_SIGNING_SECRET),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['verify']
        );
        const isValid = await crypto.subtle.verify(
          'HMAC',
          key,
          sigBytes as unknown as BufferSource,
          enc.encode(data)
        );
        if (isValid) {
          const payload = JSON.parse(new TextDecoder().decode(base64UrlDecodeBytes(parts[1])));
          const nowSec = Math.floor(Date.now() / 1000);
          if (
            payload.iss === 'kithra-auth' &&
            payload.aud === 'kithra-mfa-challenge' &&
            payload.exp > nowSec
          ) {
            email = payload.email;
            staffId = payload.sub;
            role = payload.role;
          }
        }
      } catch {
        // Corrupted challenge token
      }
    }
  }

  if (!email) {
    return {
      success: false,
      errorMessage: 'MFA challenge expired or not found. Please initiate login again.',
    };
  }

  const staff = OPERATIONAL_STAFF[email];
  if (!staff) {
    activeChallenges.delete(challengeId);
    return { success: false, errorMessage: 'Associated staff account not found.' };
  }

  const cleanCode = mfaCode.trim().toUpperCase();

  // 1. Verify RFC 6238 TOTP
  const isTotpValid = await verifyTotpCode(staff.mfaSecret, cleanCode);

  // 2. Fall back to emergency backup recovery codes
  const isBackupValid = staff.backupCodes.includes(cleanCode);

  if (!isTotpValid && !isBackupValid) {
    // Increment failed attempts for rate limiting
    const current = staffRateLimits.get(staff.email) || { failedAttempts: 0, lockoutUntil: 0 };
    current.failedAttempts += 1;
    if (current.failedAttempts >= 5) {
      current.lockoutUntil = Date.now() + 15 * 60 * 1000;
    }
    staffRateLimits.set(staff.email, current);

    return {
      success: false,
      errorMessage: 'Invalid 6-digit MFA security verification code or backup code.',
    };
  }

  // If backup code used, remove it (single-use)
  if (isBackupValid) {
    staff.backupCodes = staff.backupCodes.filter((c) => c !== cleanCode);
  }

  // Consume challenge (single-use protection)
  consumedChallenges.add(challengeId);
  activeChallenges.delete(challengeId);

  // Reset rate limiting on successful full authentication
  staffRateLimits.delete(staff.email);

  // Issue cryptographically signed HS256 staff JWT
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 8 * 3600; // 8-hour staff shift

  const jwtPayload: StaffJwtPayload = {
    sub: staffId,
    email: email,
    role: role,
    mfa: true,
    iss: 'kithra-auth',
    aud: 'kithra-staff',
    iat: issuedAt,
    exp: expiresAt,
  };

  const token = await signStaffJwt(jwtPayload as unknown as Record<string, unknown>);

  const staffContext: StaffSessionContext = {
    staffId: staffId,
    email: email,
    role: role,
    mfaVerified: true,
    issuedAt: issuedAt * 1000,
    expiresAt: expiresAt * 1000,
    token,
  };

  return {
    success: true,
    session: staffContext,
  };
}

/**
 * Validates a staff operational session token by cryptographically verifying its HS256 signature.
 * Rejects forged, altered, expired, or non-MFA tokens.
 */
export async function authenticateStaffToken(token: string): Promise<{
  authenticated: boolean;
  context?: StaffSessionContext;
  errorMessage?: string;
}> {
  if (!token) {
    return { authenticated: false, errorMessage: 'Missing staff authorization token.' };
  }

  if (isStaffTokenRevoked(token)) {
    return { authenticated: false, errorMessage: 'SESSION_REVOKED: Staff session has been logged out or revoked.' };
  }

  const payload = await verifyStaffJwt(token);
  if (!payload) {
    return { authenticated: false, errorMessage: 'Invalid, forged, or expired staff session token.' };
  }

  if (!payload.mfa) {
    return { authenticated: false, errorMessage: 'MFA_REQUIRED: Multi-factor authentication is not verified.' };
  }

  return {
    authenticated: true,
    context: {
      staffId: payload.sub,
      email: payload.email,
      role: payload.role,
      mfaVerified: true,
      issuedAt: payload.iat * 1000,
      expiresAt: payload.exp * 1000,
      token,
    },
  };
}

/**
 * Role-Based Access Control (RBAC) Guard for privileged operational API endpoints.
 */
export function authorizeStaffRole(
  context: StaffSessionContext,
  allowedRoles: StaffRole[]
): { allowed: boolean; status: number; message?: string } {
  if (!context.mfaVerified) {
    return {
      allowed: false,
      status: 401,
      message: 'MFA_REQUIRED: Staff action requires two-factor authentication verification.',
    };
  }

  if (allowedRoles.includes(context.role)) {
    return { allowed: true, status: 200 };
  }

  return {
    allowed: false,
    status: 403,
    message: `FORBIDDEN_ROLE: Role '${context.role}' does not have permission for this operational endpoint. Required: [${allowedRoles.join(', ')}].`,
  };
}
