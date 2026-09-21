import { describe, expect, it } from 'vitest';
import { joinApiPath } from './api';

describe('joinApiPath', () => {
  it('joins base and path', () => {
    expect(joinApiPath('/api', '/auth/me')).toBe('/api/auth/me');
  });

  it('normalizes trailing slash on base', () => {
    expect(joinApiPath('/api/', 'clients')).toBe('/api/clients');
  });

  it('adds leading slash to path', () => {
    expect(joinApiPath('/api', 'orders')).toBe('/api/orders');
  });
});
