import { describe, expect, it } from 'vitest';
import { humanizeStatus, statusFromBoolean, toneFor } from './status';

describe('status helpers', () => {
  it('humanizes enum codes', () => {
    expect(humanizeStatus('EM_ATENDIMENTO')).toBe('Em atendimento');
    expect(humanizeStatus('ATIVA')).toBe('Ativa');
  });

  it('maps tones', () => {
    expect(toneFor('EM_ATENDIMENTO')).toBe('warning');
    expect(toneFor('ATIVO')).toBe('success');
    expect(toneFor('BLOQUEADO')).toBe('danger');
    expect(toneFor('ADMINISTRADOR')).toBe('info');
    expect(toneFor('UNKNOWN')).toBe('neutral');
  });

  it('maps boolean flags', () => {
    expect(statusFromBoolean(true)).toBe('ATIVO');
    expect(statusFromBoolean(false)).toBe('INATIVO');
  });
});
