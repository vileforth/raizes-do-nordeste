import { describe, expect, it } from 'vitest';
import { shouldRefreshSession } from './session-refresh';

describe('shouldRefreshSession', () => {
  it('refreshes a protected call once', () => {
    expect(shouldRefreshSession('auth/me', false)).toBe(true);
    expect(shouldRefreshSession('orders', false)).toBe(true);
  });

  it('does not refresh credential or repeated calls', () => {
    expect(shouldRefreshSession('auth/login', false)).toBe(false);
    expect(shouldRefreshSession('auth/refresh', false)).toBe(false);
    expect(shouldRefreshSession('auth/me', true)).toBe(false);
  });
});
