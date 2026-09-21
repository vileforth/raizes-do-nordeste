import { ORDER_STATUSES, type OrderStatus } from './order-status';

export function canMoveOrderStatus(from: string, to: string): boolean {
  return from !== to && ORDER_STATUSES.includes(to as OrderStatus);
}

export function resolveBoardDropStatus(over: {
  id: string | number;
  data?: { current?: { status?: string } };
}): string | null {
  const fromData = over.data?.current?.status;
  if (fromData && ORDER_STATUSES.includes(fromData as OrderStatus)) {
    return fromData;
  }
  const id = String(over.id);
  if (ORDER_STATUSES.includes(id as OrderStatus)) {
    return id;
  }
  return null;
}
