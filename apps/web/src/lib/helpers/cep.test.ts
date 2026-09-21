import { describe, expect, it } from 'vitest';
import { formatCep } from './cep';

describe('formatCep', () => {
  it('formats an 8-digit cep', () => {
    expect(formatCep('51020000')).toBe('51020-000');
  });

  it('keeps unexpected values as-is', () => {
    expect(formatCep('123')).toBe('123');
  });
});
