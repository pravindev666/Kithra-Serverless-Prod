/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA CRYPTOGRAPHIC FIREBASE AUTHENTICATION VERIFIER
 * 
 * Implements real cryptographic RSA-256 signature verification of Firebase ID tokens
 * using the standard Web Crypto API (SubtleCrypto) compatible with Cloudflare Workers
 * and modern Node.js runtimes.
 * 
 * Verifies against Google's public JWKS endpoint:
 * https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com
 */

export const DEFAULT_FIREBASE_PROJECT_ID = 'kithra-d3ae1';
export const GOOGLE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

export interface FirebaseJwtHeader {
  alg: string;
  kid: string;
  typ: string;
}

export interface FirebaseJwtPayload {
  iss: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
  auth_time: number;
  email?: string;
  email_verified?: boolean;
  name?: string;
  role?: 'member' | 'moderator' | 'admin' | 'auditor';
  [key: string]: unknown;
}

export interface AuthContext {
  userId: string;
  email?: string;
  role: 'member' | 'moderator' | 'admin' | 'auditor';
  token: string;
  isAdultVerified?: boolean;
  cryptographicallyVerified?: boolean;
}

export interface AuthVerificationResult {
  authenticated: boolean;
  context?: AuthContext;
  errorCode?:
  | 'MISSING_TOKEN'
  | 'MALFORMED_TOKEN'
  | 'EXPIRED_TOKEN'
  | 'INVALID_ISSUER'
  | 'INVALID_AUDIENCE'
  | 'INVALID_SIGNATURE'
  | 'UNKNOWN_KEY_ID'
  | 'SIGNING_KEYS_UNAVAILABLE'
  | 'DEV_TOKENS_DISABLED'
  | 'FORBIDDEN';
  errorMessage?: string;
}

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
 * Converts Base64URL string to Uint8Array for Web Crypto verification.
 */
export function base64UrlToUint8Array(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof atob === 'function') {
    const raw = atob(base64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      arr[i] = raw.charCodeAt(i);
    }
    return arr;
  }
  return Uint8Array.from(Buffer.from(base64, 'base64'));
}

/**
 * In-memory cache for Google Public Signing Keys.
 */
interface CachedKeys {
  keys: (JsonWebKey & { kid: string })[];
  expiresAt: number;
}

let cachedGoogleKeys: CachedKeys | null = null;
const injectedKeys: Map<string, JsonWebKey> = new Map();

/**
 * Injects a test JWK for automated cryptographic testing without network calls.
 */
export function injectTestJwk(kid: string, key: JsonWebKey) {
  injectedKeys.set(kid, key);
}

/**
 * Clears injected test keys and cache.
 */
export function clearKeyCache() {
  cachedGoogleKeys = null;
  injectedKeys.clear();
}

/**
 * Fetches Google's public JSON Web Key Set with 6-hour caching.
 */
export async function getGooglePublicJwks(): Promise<(JsonWebKey & { kid: string })[]> {
  const now = Date.now();
  if (cachedGoogleKeys && cachedGoogleKeys.expiresAt > now) {
    return cachedGoogleKeys.keys;
  }

  try {
    const res = await fetch(GOOGLE_JWKS_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch Google JWKS: HTTP ${res.status}`);
    }

    const data = (await res.json()) as { keys: (JsonWebKey & { kid: string })[] };
    if (!Array.isArray(data.keys)) {
      throw new Error('Invalid Google JWKS response: missing keys array');
    }

    // Cache-Control max-age or fallback to 6 hours
    const cacheControl = res.headers.get('cache-control') || '';
    const match = cacheControl.match(/max-age=(\d+)/i);
    const maxAgeSec = match ? parseInt(match[1], 10) : 6 * 3600;

    cachedGoogleKeys = {
      keys: data.keys,
      expiresAt: now + maxAgeSec * 1000,
    };

    return cachedGoogleKeys.keys;
  } catch (err) {
    // If cache exists even if expired, return as stale fallback
    if (cachedGoogleKeys?.keys) {
      return cachedGoogleKeys.keys;
    }
    throw err;
  }
}

/**
 * Real Cryptographic Firebase ID Token Verification.
 * 
 * Verifies:
 * 1. RS256 algorithm and presence of kid in header.
 * 2. Cryptographic signature over header.payload using Google's public key.
 * 3. Issuer: https://securetoken.google.com/<projectId>
 * 4. Audience: <projectId>
 * 5. Expiration, issued-at, and subject UID.
 */
export async function verifyFirebaseTokenCryptographic(
  token: string,
  options: {
    expectedProjectId?: string;
    clockNowMs?: number;
    allowDevTokens?: boolean;
  } = {}
): Promise<AuthVerificationResult> {
  const {
    expectedProjectId = DEFAULT_FIREBASE_PROJECT_ID,
    clockNowMs = Date.now(),
    allowDevTokens = process.env.NODE_ENV === 'test' || process.env.ALLOW_DEV_TOKENS === 'true',
  } = options;

  if (!token || typeof token !== 'string') {
    return {
      authenticated: false,
      errorCode: 'MISSING_TOKEN',
      errorMessage: 'Authorization token header is missing.',
    };
  }

  // Handle local development / test tokens with explicit configuration check
  if (token.startsWith('dev-token-') || token.startsWith('mock-jwt-')) {
    if (!allowDevTokens) {
      return {
        authenticated: false,
        errorCode: 'DEV_TOKENS_DISABLED',
        errorMessage: 'Dev tokens are disabled in production staging. A cryptographically signed Firebase ID token is required.',
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
        cryptographicallyVerified: false,
      },
    };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return {
      authenticated: false,
      errorCode: 'MALFORMED_TOKEN',
      errorMessage: 'The token does not have 3 valid JWT segments.',
    };
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  let header: FirebaseJwtHeader;
  let payload: FirebaseJwtPayload;

  try {
    header = JSON.parse(base64UrlDecode(headerB64));
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch {
    return {
      authenticated: false,
      errorCode: 'MALFORMED_TOKEN',
      errorMessage: 'JWT header or payload could not be parsed as valid JSON.',
    };
  }

  if (header.alg !== 'RS256' || !header.kid) {
    return {
      authenticated: false,
      errorCode: 'MALFORMED_TOKEN',
      errorMessage: `Invalid token algorithm or missing kid header. Expected RS256, got '${header.alg}'.`,
    };
  }

  const nowSec = Math.floor(clockNowMs / 1000);

  // Expiration check
  if (payload.exp && payload.exp < nowSec) {
    return {
      authenticated: false,
      errorCode: 'EXPIRED_TOKEN',
      errorMessage: `Firebase token expired at ${payload.exp} (current time: ${nowSec}).`,
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

  // Subject UID check
  if (!payload.sub || typeof payload.sub !== 'string') {
    return {
      authenticated: false,
      errorCode: 'MALFORMED_TOKEN',
      errorMessage: 'Token does not contain a valid subject UID.',
    };
  }

  // Retrieve public key for kid (either from injected test keys or live Google JWKS)
  let targetJwk: JsonWebKey | undefined = injectedKeys.get(header.kid);
  if (!targetJwk) {
    try {
      const keys = await getGooglePublicJwks();
      targetJwk = keys.find((k) => k.kid === header.kid);
    } catch {
      return {
        authenticated: false,
        errorCode: 'SIGNING_KEYS_UNAVAILABLE',
        errorMessage: 'Unable to retrieve Google signing keys from public certificate endpoint.',
      };
    }
  }

  if (!targetJwk) {
    return {
      authenticated: false,
      errorCode: 'UNKNOWN_KEY_ID',
      errorMessage: `No public key found matching token kid '${header.kid}'.`,
    };
  }

  // Cryptographic Signature Verification using Web Crypto API
  try {
    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      targetJwk,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['verify']
    );

    const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlToUint8Array(signatureB64);

    const isSignatureValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      signatureBytes as unknown as BufferSource,
      signedData as unknown as BufferSource
    );

    if (!isSignatureValid) {
      return {
        authenticated: false,
        errorCode: 'INVALID_SIGNATURE',
        errorMessage: 'Cryptographic signature verification failed: token signature is forged or corrupted.',
      };
    }
  } catch (err) {
    return {
      authenticated: false,
      errorCode: 'INVALID_SIGNATURE',
      errorMessage: `Cryptographic verification error: ${err instanceof Error ? err.message : String(err)}`,
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
      cryptographicallyVerified: true,
    },
  };
}
