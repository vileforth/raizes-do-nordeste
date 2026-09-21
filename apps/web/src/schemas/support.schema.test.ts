import { describe, expect, it } from 'vitest';
import { supportSchema } from './support.schema';

describe('supportSchema', () => {
  it('accepts a valid ticket payload', () => {
    const result = supportSchema.safeParse({
      type: 'SUPORTE',
      description: 'Pedido atrasado na unidade centro',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a short description', () => {
    const result = supportSchema.safeParse({
      type: 'PEDIDO',
      description: 'ok',
    });
    expect(result.success).toBe(false);
  });
});
