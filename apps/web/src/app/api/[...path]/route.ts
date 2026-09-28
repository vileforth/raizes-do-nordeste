import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  applyAuthCookies,
  clearAuthCookies,
  expireCookieNames,
  getSupabaseAuthCookieNames,
  isLogoutPath,
  parseAuthTokens,
  resolveAuthorizationHeader,
  shouldPersistAuthTokens,
  type AuthTokens,
} from '@/lib/auth/session-cookies';
import { shouldRefreshSession } from '@/lib/auth/session-refresh';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

function expireLegacySessionCookies(
  request: NextRequest,
  response: NextResponse,
): void {
  expireCookieNames(
    response,
    getSupabaseAuthCookieNames(request.cookies.getAll().map((cookie) => cookie.name)),
  );
}

async function refreshAccessToken(refreshToken: string): Promise<AuthTokens | null> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    return null;
  }
  return parseAuthTokens(await response.json());
}

async function proxy(request: NextRequest, params: { path: string[] }) {
  const path = params.path.join('/');

  if (isLogoutPath(path, request.method)) {
    const response = new NextResponse(null, { status: 204 });
    clearAuthCookies(response);
    expireLegacySessionCookies(request, response);
    return response;
  }

  const url = new URL(`${API_URL}/${path}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  const headers = new Headers();
  const auth = resolveAuthorizationHeader(
    request.headers.get('authorization'),
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
  );
  if (auth) headers.set('Authorization', auth);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.text();
  let upstream = await fetch(url.toString(), {
    method: request.method,
    headers,
    body,
  });
  let text = await upstream.text();
  let refreshedTokens: AuthTokens | null = null;

  if (upstream.status === 401 && shouldRefreshSession(path, false)) {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    refreshedTokens = refreshToken ? await refreshAccessToken(refreshToken) : null;
    if (refreshedTokens) {
      headers.set('Authorization', `Bearer ${refreshedTokens.accessToken}`);
      upstream = await fetch(url.toString(), {
        method: request.method,
        headers,
        body,
      });
      text = await upstream.text();
    }
  }

  const nextResponse = new NextResponse(text, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
    },
  });

  if (refreshedTokens && upstream.ok) {
    applyAuthCookies(nextResponse, refreshedTokens);
    expireLegacySessionCookies(request, nextResponse);
  } else if (upstream.status === 401 && shouldRefreshSession(path, false)) {
    clearAuthCookies(nextResponse);
    expireLegacySessionCookies(request, nextResponse);
  }

  if (upstream.ok && shouldPersistAuthTokens(path, request.method)) {
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    const tokens = parseAuthTokens(parsed);
    if (tokens) {
      applyAuthCookies(nextResponse, tokens);
    }
    expireLegacySessionCookies(request, nextResponse);
  }

  return nextResponse;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxy(request, params);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxy(request, params);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxy(request, params);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxy(request, params);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxy(request, params);
}
