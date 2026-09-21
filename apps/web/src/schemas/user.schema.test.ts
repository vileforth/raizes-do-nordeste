import { UserRole } from '@raizes/shared';
import { describe, expect, it } from 'vitest';
import { updateUserSchema, userSchema } from './user.schema';

describe('userSchema', () => {
  it('accepts a valid create payload', () => {
    const result = userSchema.safeParse({
      name: 'Ana Souza',
      email: 'ana@raizes.com',
      phone: '81998887766',
      password: 'secret12',
      status: 'ATIVO',
      profileNames: [UserRole.ATENDENTE],
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty roles', () => {
    const result = userSchema.safeParse({
      name: 'Ana Souza',
      email: 'ana@raizes.com',
      phone: '81998887766',
      password: 'secret12',
      status: 'ATIVO',
      profileNames: [],
    });
    expect(result.success).toBe(false);
  });

  it('accepts an update payload without password', () => {
    const result = updateUserSchema.safeParse({
      name: 'Ana Souza',
      email: 'ana@raizes.com',
      phone: '81998887766',
      status: 'INATIVO',
      profileNames: [UserRole.GERENTE],
    });
    expect(result.success).toBe(true);
  });
});
