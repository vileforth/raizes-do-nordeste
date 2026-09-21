import { OrderStatus } from '@prisma/client';
import {
  canUpdateOrderItems,
  getNextOrderStatus,
  isValidOrderStatusTransition,
} from './order-status.machine';

describe('order-status.machine', () => {
  it('returns next status in the workflow', () => {
    expect(getNextOrderStatus(OrderStatus.RECEBIDO)).toBe(
      OrderStatus.EM_PREPARACAO,
    );
    expect(getNextOrderStatus(OrderStatus.EM_PREPARACAO)).toBe(
      OrderStatus.PRONTO,
    );
    expect(getNextOrderStatus(OrderStatus.PRONTO)).toBe(OrderStatus.RETIRADO);
    expect(getNextOrderStatus(OrderStatus.RETIRADO)).toBeNull();
  });

  it('allows moving to any different status', () => {
    expect(
      isValidOrderStatusTransition(
        OrderStatus.RECEBIDO,
        OrderStatus.EM_PREPARACAO,
      ),
    ).toBe(true);
    expect(
      isValidOrderStatusTransition(OrderStatus.RECEBIDO, OrderStatus.PRONTO),
    ).toBe(true);
    expect(
      isValidOrderStatusTransition(OrderStatus.RETIRADO, OrderStatus.RECEBIDO),
    ).toBe(true);
    expect(
      isValidOrderStatusTransition(OrderStatus.PRONTO, OrderStatus.PRONTO),
    ).toBe(false);
  });

  it('allows item updates only when status is RECEBIDO', () => {
    expect(canUpdateOrderItems(OrderStatus.RECEBIDO)).toBe(true);
    expect(canUpdateOrderItems(OrderStatus.EM_PREPARACAO)).toBe(false);
    expect(canUpdateOrderItems(OrderStatus.PRONTO)).toBe(false);
    expect(canUpdateOrderItems(OrderStatus.RETIRADO)).toBe(false);
  });
});
