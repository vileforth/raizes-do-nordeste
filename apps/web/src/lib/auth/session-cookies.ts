import { NextResponse } from 'next/server';

export const ACCESS_TOKEN_COOKIE = 'raizes_access_token';
export const REFRESH_TOKEN_COOKIE = 'raizes_refresh_token';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

export function parseAuthTokens(body: unknown): AuthTokens | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  const record = body as Record<string, unknown>;
  if (typeof record.accessToken !== 'string' || typeof record.refreshToken !== 'string') {
    return null;
  }
  if (!record.accessToken || !record.refreshToken) {
    return null;
  }
  return {
    accessToken: record.accessToken,
    refreshToken: record.refreshToken,
  };
}

export function shouldPersistAuthTokens(path: string, method: string): boolean {
  return (
    method === 'POST' &&
    (path === 'auth/login' || path === 'auth/register' || path === 'auth/refresh')
  );
}

export function isLogoutPath(path: string, method: string): boolean {
  return method === 'POST' && path === 'auth/logout';
}

export function resolveAuthorizationHeader(
  incomingAuth: string | null,
  accessToken: string | undefined,
): string | null {
  if (incomingAuth) {
    return incomingAuth;
  }
  if (accessToken) {
    return `Bearer ${accessToken}`;
  }
  return null;
}

export function getSupabaseAuthCookieNames(cookieNames: string[]): string[] {
  return cookieNames.filter(
    (name) => name.startsWith('sb-') && name.includes('-auth-token'),
  );
}

export function applyAuthCookies(response: NextResponse, tokens: AuthTokens): void {
  const options = cookieOptions(AUTH_COOKIE_MAX_AGE);
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, options);
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, options);
}

export function clearAuthCookies(response: NextResponse): void {
  const options = cookieOptions(0);
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', options);
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', options);
}

export function expireCookieNames(response: NextResponse, cookieNames: string[]): void {
  const options = cookieOptions(0);
  cookieNames.forEach((name) => {
    response.cookies.set(name, '', options);
  });
}
