const SKIPPED_REFRESH_PATHS = new Set([
  'auth/login',
  'auth/register',
  'auth/forgot-password',
  'auth/refresh',
  'auth/logout',
]);

export function shouldRefreshSession(path: string, alreadyRetried: boolean): boolean {
  if (alreadyRetried) {
    return false;
  }
  return !SKIPPED_REFRESH_PATHS.has(path);
}
