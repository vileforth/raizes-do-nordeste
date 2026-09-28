import { NextResponse } from 'next/server';
import { describe, expect, it } from 'vitest';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  applyAuthCookies,
  clearAuthCookies,
  getSupabaseAuthCookieNames,
  isLogoutPath,
  parseAuthTokens,
  resolveAuthorizationHeader,
  shouldPersistAuthTokens,
} from './session-cookies';

describe('parseAuthTokens', () => {
  it('reads access and refresh tokens from the login payload', () => {
    expect(
      parseAuthTokens({
        accessToken: 'access-jwt',
        refreshToken: 'refresh-jwt',
        expiresIn: 3600,
      }),
    ).toEqual({
      accessToken: 'access-jwt',
      refreshToken: 'refresh-jwt',
    });
  });

  it('rejects payloads without both tokens', () => {
    expect(parseAuthTokens({ accessToken: 'access-jwt' })).toBeNull();
    expect(parseAuthTokens({})).toBeNull();
  });
});

describe('auth session paths', () => {
  it('persists tokens only after login or register', () => {
    expect(shouldPersistAuthTokens('auth/login', 'POST')).toBe(true);
    expect(shouldPersistAuthTokens('auth/register', 'POST')).toBe(true);
    expect(shouldPersistAuthTokens('auth/refresh', 'POST')).toBe(true);
    expect(shouldPersistAuthTokens('auth/me', 'GET')).toBe(false);
    expect(shouldPersistAuthTokens('auth/login', 'GET')).toBe(false);
  });

  it('identifies logout', () => {
    expect(isLogoutPath('auth/logout', 'POST')).toBe(true);
    expect(isLogoutPath('auth/login', 'POST')).toBe(false);
  });
});

describe('resolveAuthorizationHeader', () => {
  it('prefers an incoming bearer token', () => {
    expect(resolveAuthorizationHeader('Bearer incoming', 'cookie-token')).toBe(
      'Bearer incoming',
    );
  });

  it('falls back to the compact access cookie', () => {
    expect(resolveAuthorizationHeader(null, 'cookie-token')).toBe(
      'Bearer cookie-token',
    );
  });
});

describe('supabase cookie cleanup', () => {
  it('selects only supabase auth session cookies', () => {
    expect(
      getSupabaseAuthCookieNames([
        'NEXT_LOCALE',
        'sb-mgrckmzzxptliejwumjv-auth-token',
        'sb-mgrckmzzxptliejwumjv-auth-token.0',
        'sb-mgrckmzzxptliejwumjv-auth-token.1',
        'theme',
      ]),
    ).toEqual([
      'sb-mgrckmzzxptliejwumjv-auth-token',
      'sb-mgrckmzzxptliejwumjv-auth-token.0',
      'sb-mgrckmzzxptliejwumjv-auth-token.1',
    ]);
  });
});

describe('applyAuthCookies', () => {
  it('stores compact httpOnly tokens instead of a full supabase session', () => {
    const response = NextResponse.json({ ok: true });
    applyAuthCookies(response, {
      accessToken: 'a'.repeat(80),
      refreshToken: 'r'.repeat(40),
    });

    const access = response.cookies.get(ACCESS_TOKEN_COOKIE);
    const refresh = response.cookies.get(REFRESH_TOKEN_COOKIE);
    expect(access?.value).toBe('a'.repeat(80));
    expect(refresh?.value).toBe('r'.repeat(40));
    expect(access?.value.length).toBeLessThan(200);
  });

  it('clears auth cookies on logout', () => {
    const response = NextResponse.json({ ok: true });
    applyAuthCookies(response, {
      accessToken: 'access-jwt',
      refreshToken: 'refresh-jwt',
    });
    clearAuthCookies(response);
    expect(response.cookies.get(ACCESS_TOKEN_COOKIE)?.value).toBe('');
    expect(response.cookies.get(REFRESH_TOKEN_COOKIE)?.value).toBe('');
  });
});
