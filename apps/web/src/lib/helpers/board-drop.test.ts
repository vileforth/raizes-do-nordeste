import { describe, expect, it } from 'vitest';
import {
  canMoveBoardStatus,
  canMoveOrderStatus,
  resolveBoardDropStatus,
} from './board-drop';
import { SUPPORT_STATUSES } from './support-status';

describe('board drop helpers', () => {
  it('allows moving to another status', () => {
    expect(canMoveOrderStatus('RECEBIDO', 'PRONTO')).toBe(true);
    expect(canMoveOrderStatus('PRONTO', 'PRONTO')).toBe(false);
    expect(canMoveOrderStatus('RECEBIDO', 'UNKNOWN')).toBe(false);
  });

  it('resolves drop target from data or id', () => {
    expect(resolveBoardDropStatus({ id: 'card-1', data: { current: { status: 'PRONTO' } } })).toBe(
      'PRONTO',
    );
    expect(resolveBoardDropStatus({ id: 'EM_PREPARACAO' })).toBe('EM_PREPARACAO');
    expect(resolveBoardDropStatus({ id: 'card-9' })).toBeNull();
  });

  it('moves support tickets across allowed statuses', () => {
    expect(canMoveBoardStatus('ABERTO', 'EM_ATENDIMENTO', SUPPORT_STATUSES)).toBe(true);
    expect(canMoveBoardStatus('ABERTO', 'ABERTO', SUPPORT_STATUSES)).toBe(false);
    expect(canMoveBoardStatus('ABERTO', 'PRONTO', SUPPORT_STATUSES)).toBe(false);
    expect(
      resolveBoardDropStatus({ id: 'RESOLVIDO' }, SUPPORT_STATUSES),
    ).toBe('RESOLVIDO');
    expect(
      resolveBoardDropStatus({ id: 'card-2', data: { current: { status: 'FECHADO' } } }, SUPPORT_STATUSES),
    ).toBe('FECHADO');
  });
});
