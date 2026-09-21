import { OrderStatus } from '@prisma/client';

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  RECEBIDO: OrderStatus.EM_PREPARACAO,
  EM_PREPARACAO: OrderStatus.PRONTO,
  PRONTO: OrderStatus.RETIRADO,
  RETIRADO: null,
};

export function getNextOrderStatus(current: OrderStatus): OrderStatus | null {
  return NEXT_STATUS[current] ?? null;
}

export function isValidOrderStatusTransition(
  current: OrderStatus,
  target: OrderStatus,
): boolean {
  return getNextOrderStatus(current) === target;
}

export function canUpdateOrderItems(status: OrderStatus): boolean {
  return status === OrderStatus.RECEBIDO;
}
