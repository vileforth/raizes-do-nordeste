export const ORDER_STATUSES = [
  'RECEBIDO',
  'EM_PREPARACAO',
  'PRONTO',
  'RETIRADO',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  const index = ORDER_STATUSES.indexOf(status);
  if (index < 0 || index >= ORDER_STATUSES.length - 1) return null;
  return ORDER_STATUSES[index + 1];
}

export function orderStatusTone(status: string): 'info' | 'warning' | 'success' | 'muted' {
  switch (status) {
    case 'RECEBIDO':
      return 'info';
    case 'EM_PREPARACAO':
      return 'warning';
    case 'PRONTO':
      return 'success';
    default:
      return 'muted';
  }
}
