import { describe, expect, it } from 'vitest';
import { ALL_USER_ROLES, STAFF_USER_ROLES, UserRole } from '../index';

describe('UserRole', () => {
  it('contains all PERFIL role names', () => {
    expect(ALL_USER_ROLES).toEqual([
      UserRole.CLIENTE,
      UserRole.ATENDENTE,
      UserRole.COZINHEIRO,
      UserRole.GERENTE,
      UserRole.ADMINISTRADOR,
    ]);
    expect(ALL_USER_ROLES).toHaveLength(5);
  });

  it('excludes CLIENTE from staff roles', () => {
    expect(STAFF_USER_ROLES).not.toContain(UserRole.CLIENTE);
    expect(STAFF_USER_ROLES).toHaveLength(4);
  });
});
