import { describe, expect, it } from 'vitest';
import { clientSchema } from './client.schema';

describe('clientSchema', () => {
  it('accepts a valid client payload', () => {
    const result = clientSchema.safeParse({
      userId: 12,
      cpf: '12345678901',
      birthDate: '1992-04-12',
      address: 'Rua Setúbal, 120 - Boa Viagem',
      city: 'Recife',
      state: 'PE',
      zipCode: '51020000',
      preferredUnitId: 1,
      active: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a short cpf', () => {
    const result = clientSchema.safeParse({
      userId: 12,
      cpf: '123',
      address: 'Rua Setúbal, 120',
      city: 'Recife',
      state: 'PE',
      zipCode: '51020000',
      active: true,
    });
    expect(result.success).toBe(false);
  });
});
