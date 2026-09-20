import { UserRole } from '@raizes/shared';
import { describe, expect, it } from 'vitest';
import { getMenuForRoles, getPrimaryRole } from './menu';

describe('getMenuForRoles', () => {
  it('returns cliente menu items', () => {
    const items = getMenuForRoles([UserRole.CLIENTE]);
    expect(items.map((i) => i.key)).toEqual(['orders', 'promotions', 'loyalty', 'support']);
  });

  it('returns admin menu with users and network', () => {
    const items = getMenuForRoles([UserRole.ADMINISTRADOR]);
    expect(items.some((i) => i.key === 'users')).toBe(true);
    expect(items.some((i) => i.key === 'network')).toBe(true);
  });
});

describe('getPrimaryRole', () => {
  it('prefers admin over cliente', () => {
    expect(getPrimaryRole([UserRole.CLIENTE, UserRole.ADMINISTRADOR])).toBe(
      UserRole.ADMINISTRADOR,
    );
  });
});
