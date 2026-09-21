import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  expireCookieNames,
  getSupabaseAuthCookieNames,
} from './lib/auth/session-cookies';
import { defaultLocale, locales } from './i18n/config';

const intlMiddleware = createIntlMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'as-needed',
});

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.endsWith(p),
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);
  const stripped = pathname.replace(/^\/(pt-BR|en)/, '') || '/';
  expireCookieNames(
    intlResponse,
    getSupabaseAuthCookieNames(request.cookies.getAll().map((cookie) => cookie.name)),
  );

  if (isPublicPath(stripped)) {
    return intlResponse;
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
