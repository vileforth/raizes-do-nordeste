import { describe, expect, it } from 'vitest';
import { formatCpf } from './cpf';

describe('formatCpf', () => {
  it('formats an 11-digit cpf', () => {
    expect(formatCpf('52998224725')).toBe('529.982.247-25');
  });

  it('keeps unexpected values as-is', () => {
    expect(formatCpf('123')).toBe('123');
  });
});
