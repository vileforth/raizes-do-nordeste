import { describe, expect, it } from 'vitest';
import { getNextOrderStatus, orderStatusTone } from './order-status';

describe('order status helpers', () => {
  it('returns next status', () => {
    expect(getNextOrderStatus('RECEBIDO')).toBe('EM_PREPARACAO');
  });

  it('returns null for final status', () => {
    expect(getNextOrderStatus('RETIRADO')).toBeNull();
  });

  it('maps tone for preparation', () => {
    expect(orderStatusTone('EM_PREPARACAO')).toBe('warning');
  });
});
