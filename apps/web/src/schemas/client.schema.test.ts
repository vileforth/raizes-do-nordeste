import { describe, expect, it } from 'vitest';
import { clientSchema } from './client.schema';

describe('clientSchema', () => {
  it('accepts a valid client payload', () => {
    const result = clientSchema.safeParse({
      userId: 12,
      cpf: '12345678901',
      active: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a short cpf', () => {
    const result = clientSchema.safeParse({
      userId: 12,
      cpf: '123',
      active: true,
    });
    expect(result.success).toBe(false);
  });
});
