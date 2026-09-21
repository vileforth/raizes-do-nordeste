import { UserRole } from '@raizes/shared';
import { describe, expect, it } from 'vitest';
import {
  canDeleteSupportTicket,
  canManageSupportBoard,
  supportStatusTone,
} from './support-status';

describe('support status helpers', () => {
  it('allows staff to manage the board', () => {
    expect(canManageSupportBoard([UserRole.CLIENTE])).toBe(false);
    expect(canManageSupportBoard([UserRole.ATENDENTE])).toBe(true);
    expect(canManageSupportBoard([UserRole.GERENTE])).toBe(true);
    expect(canManageSupportBoard([UserRole.ADMINISTRADOR])).toBe(true);
  });

  it('allows managers to delete tickets', () => {
    expect(canDeleteSupportTicket([UserRole.ATENDENTE])).toBe(false);
    expect(canDeleteSupportTicket([UserRole.GERENTE])).toBe(true);
    expect(canDeleteSupportTicket([UserRole.ADMINISTRADOR])).toBe(true);
  });

  it('maps tone for open tickets', () => {
    expect(supportStatusTone('ABERTO')).toBe('info');
  });
});
