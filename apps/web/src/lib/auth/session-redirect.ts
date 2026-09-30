const PUBLIC_AUTH_PATHS = ['/login', '/register', '/forgot-password', '/privacidade'];

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(pt-BR|en)(?=\/|$)/, '');
  return stripped || '/';
}

export function isPublicAuthPath(pathname: string): boolean {
  const stripped = stripLocalePrefix(pathname);
  return PUBLIC_AUTH_PATHS.some(
    (path) => stripped === path || stripped.startsWith(`${path}/`),
  );
}

export function shouldEndSession(path: string): boolean {
  const normalized = path.replace(/^\//, '');
  return (
    normalized !== 'auth/login' &&
    normalized !== 'auth/register' &&
    normalized !== 'auth/forgot-password' &&
    normalized !== 'auth/refresh' &&
    normalized !== 'auth/logout'
  );
}

let redirectStarted = false;

export async function endSessionAndRedirect(): Promise<void> {
  if (typeof window === 'undefined' || redirectStarted) {
    return;
  }
  if (isPublicAuthPath(window.location.pathname)) {
    return;
  }
  redirectStarted = true;
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    redirectStarted = true;
  }
  const next = `${window.location.pathname}${window.location.search}`;
  window.location.assign(`/login?redirect=${encodeURIComponent(next)}`);
}
