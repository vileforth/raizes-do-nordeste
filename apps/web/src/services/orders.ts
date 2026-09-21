import { apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number | string;
  subtotal: number | string;
};

export type OrderPayment = {
  id: number;
  method: string;
  status: string;
  value: number | string;
  transactionCode: string;
};

export type Order = {
  id: number;
  clientId: number;
  unitId: number;
  status: string;
  consumptionType: string;
  totalValue: number | string;
  orderCode: string;
  createdAt: string;
  items?: OrderItem[];
  payment?: OrderPayment | null;
};

export const ordersResource = createResource<Order>('orders', {
  list: (params?: ListQuery) => apiGet<Paginated<Order>>(`/orders${toQueryString(params)}`),
  detail: (id) => apiGet<Order>(`/orders/${id}`),
  create: (input) => apiPost<Order>('/orders', input),
  update: (id, input) => apiPut<Order>(`/orders/${id}`, input),
});

export function updateOrderStatus(id: string, status: string, observation?: string) {
  return apiPut(`/orders/${id}/status`, { status, observation });
}

export function getOrderStatusHistory(id: string) {
  return apiGet<Array<{ id: number; status: string; occurredAt: string }>>(
    `/orders/${id}/status`,
  );
}
