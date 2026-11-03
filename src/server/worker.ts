/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA CLOUDFLARE WORKER ENTRY POINT
 * 
 * Standard Cloudflare Worker entry point deploying the Kithra backend API
 * with D1 relational persistence, cryptographic Firebase auth verification,
 * and static asset handling.
 */

import { ApiRequest, ApiResponse, handleApiRequest } from './apiRouter';

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<{ success: boolean; meta: Record<string, unknown> }>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<{ results: T[]; success: boolean }[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface Env {
  DB?: D1Database;
  kithra_d1_staging?: D1Database;
  ASSETS?: { fetch: (req: Request) => Promise<Response> };
  ENVIRONMENT?: string;
  FIREBASE_PROJECT_ID?: string;
  ALLOW_DEV_TOKENS?: string;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Kithra-Client, X-Turnstile-Token',
  'Access-Control-Max-Age': '86400',
};

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; connect-src 'self' https://securetoken.google.com https://www.googleapis.com; frame-ancestors 'none';",
};

export default {
  async fetch(request: Request, env: Env, _ctx?: unknown): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 2. Health check endpoint for Cloudflare / uptime monitoring
    if (url.pathname === '/healthz' || url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          timestamp: Date.now(),
          service: 'kithra-worker-staging',
          environment: env.ENVIRONMENT ?? 'staging',
          hasD1Binding: !!(env.DB || env.kithra_d1_staging),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
            ...SECURITY_HEADERS,
          },
        }
      );
    }

    // 3. Handle API Routes (/api/*)
    if (url.pathname.startsWith('/api/')) {
      const headersRecord: Record<string, string> = {};
      request.headers.forEach((value, key) => {
        headersRecord[key.toLowerCase()] = value;
      });

      let parsedBody: unknown = undefined;
      if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
        try {
          const contentType = request.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            parsedBody = await request.json();
          }
        } catch {
          return new Response(
            JSON.stringify({ error: 'INVALID_JSON', message: 'Request body must be valid JSON.' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...SECURITY_HEADERS },
            }
          );
        }
      }

      const apiReq: ApiRequest = {
        method: request.method as ApiRequest['method'],
        path: url.pathname + url.search,
        headers: headersRecord,
        body: parsedBody,
      };

      const allowDevTokens = env.ALLOW_DEV_TOKENS === 'true' || env.ENVIRONMENT === 'test';
      const apiRes: ApiResponse = await handleApiRequest(apiReq, {
        requireCrypto: env.ENVIRONMENT === 'production' || env.ENVIRONMENT === 'staging',
        allowDevTokens,
        db: env.DB || env.kithra_d1_staging,
      });

      return new Response(JSON.stringify(apiRes.body), {
        status: apiRes.status,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
          ...SECURITY_HEADERS,
          ...(apiRes.headers ?? {}),
        },
      });
    }

    // 4. Delegate to Static Assets or Fallback
    if (env.ASSETS) {
      try {
        return await env.ASSETS.fetch(request);
      } catch {
        // Fall back to index.html for Single-Page App client routing
        const spaUrl = new URL('/index.html', request.url);
        return await env.ASSETS.fetch(new Request(spaUrl.toString(), request));
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Kithra Cloudflare Worker Backend Running',
        endpoints: [
          '/api/auth/session',
          '/api/member/profile',
          '/api/member/assessment/answers',
          '/api/member/matches',
          '/api/member/introductions',
          '/api/member/connections',
          '/api/member/conversations',
          '/api/member/messages',
          '/api/member/block',
          '/api/member/report',
          '/api/member/assessment/delete',
        ],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS },
      }
    );
  },
};
