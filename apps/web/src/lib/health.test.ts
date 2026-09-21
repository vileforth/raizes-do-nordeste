import { describe, expect, it } from 'vitest';
import { getClientHealth } from './health';

describe('getClientHealth', () => {
  it('returns ok status for web service', () => {
    expect(getClientHealth()).toEqual({ status: 'ok', service: 'web' });
  });
});
