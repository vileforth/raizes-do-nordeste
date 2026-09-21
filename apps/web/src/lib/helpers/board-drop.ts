import { ORDER_STATUSES } from './order-status';

export function canMoveBoardStatus(
  from: string,
  to: string,
  allowed: readonly string[],
): boolean {
  return from !== to && allowed.includes(to);
}

export function canMoveOrderStatus(from: string, to: string): boolean {
  return canMoveBoardStatus(from, to, ORDER_STATUSES);
}

export function resolveBoardDropStatus(
  over: {
    id: string | number;
    data?: { current?: { status?: string } };
  },
  allowed: readonly string[] = ORDER_STATUSES,
): string | null {
  const fromData = over.data?.current?.status;
  if (fromData && allowed.includes(fromData)) {
    return fromData;
  }
  const id = String(over.id);
  if (allowed.includes(id)) {
    return id;
  }
  return null;
}
