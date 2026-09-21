import { describe, expect, it } from 'vitest';
import { canMoveOrderStatus, resolveBoardDropStatus } from './board-drop';

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
});
