import { apiPost } from '@/lib/api';

export type Payment = {
  id: number;
  orderId: number;
  method: string;
  value: number | string;
  status: string;
  transactionCode: string;
  paidAt?: string | null;
};

export function createPayment(orderId: number, method: string) {
  return apiPost<Payment>('/payments', { orderId, method });
}

export function confirmPayment(id: number) {
  return apiPost<Payment>(`/payments/${id}/confirm`, {});
}
