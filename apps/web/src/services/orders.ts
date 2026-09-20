import { apiGet, apiPost, apiPut } from '@/lib/api';
import { createResource } from './_factory/create-resource';

export type Order = {
  id: number;
  clientId: number;
  unitId: number;
  status: string;
  consumptionType: string;
  totalValue: number;
  orderCode: string;
  createdAt: string;
};

export const ordersResource = createResource<Order>('orders', {
  list: () => apiGet<Order[]>('/orders'),
  detail: (id) => apiGet<Order>(`/orders/${id}`),
  create: (input) => apiPost<Order>('/orders', input),
  update: (id, input) => apiPut<Order>(`/orders/${id}`, input),
});

export function updateOrderStatus(id: string, status: string, observation?: string) {
  return apiPut(`/orders/${id}/status`, { status, observation });
}
