import { describe, expect, it } from 'vitest';
import { clientSchema } from './client.schema';
import { loginSchema, registerSchema } from './login.schema';
import { orderSchema } from './order.schema';

describe('loginSchema', () => {
  it('accepts valid login', () => {
    const result = loginSchema.safeParse({
      email: 'user@test.com',
      password: 'secret1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'bad',
      password: 'secret1',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const validRegister = {
    name: 'Ana Souza',
    email: 'ana@raizes.com',
    phone: '81998887766',
    password: 'secret12',
    privacyConsent: true,
  };

  it('accepts a register payload with privacy consent', () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true);
  });

  it('rejects a register payload without privacy consent', () => {
    expect(
      registerSchema.safeParse({ ...validRegister, privacyConsent: false }).success,
    ).toBe(false);
  });
});

describe('clientSchema', () => {
  it('rejects a payload that only has cpf', () => {
    const result = clientSchema.safeParse({
      userId: 1,
      cpf: '12345678901',
      active: true,
    });
    expect(result.success).toBe(false);
  });
});

describe('orderSchema', () => {
  it('requires at least one item', () => {
    const result = orderSchema.safeParse({
      clientId: 1,
      unitId: 1,
      consumptionType: 'RETIRADA_NO_BALCAO',
      items: [],
    });
    expect(result.success).toBe(false);
  });
});
