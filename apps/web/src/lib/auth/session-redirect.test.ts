import { describe, expect, it } from 'vitest';
import {
  isPublicAuthPath,
  shouldEndSession,
  stripLocalePrefix,
} from './session-redirect';

describe('session redirect', () => {
  it('strips the locale prefix', () => {
    expect(stripLocalePrefix('/pt-BR/orders')).toBe('/orders');
    expect(stripLocalePrefix('/en')).toBe('/');
  });

  it('treats login screens as public', () => {
    expect(isPublicAuthPath('/login')).toBe(true);
    expect(isPublicAuthPath('/pt-BR/forgot-password')).toBe(true);
    expect(isPublicAuthPath('/promotions')).toBe(false);
  });

  it('keeps credential failures from ending the session', () => {
    expect(shouldEndSession('/auth/login')).toBe(false);
    expect(shouldEndSession('/auth/me')).toBe(true);
    expect(shouldEndSession('/orders')).toBe(true);
  });
});
