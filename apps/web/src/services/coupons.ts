import { apiGet, apiPost, apiPut } from '@/lib/api';
import { createResource } from './_factory/create-resource';

export type Coupon = {
  id: number;
  promotionId: number;
  code: string;
  validUntil: string;
  usageLimit: number;
  active: boolean;
};

export const couponsResource = createResource<Coupon>('coupons', {
  list: () => apiGet<Coupon[]>('/coupons'),
  create: (input) => apiPost<Coupon>('/coupons', input),
  update: (id, input) => apiPut<Coupon>(`/coupons/${id}`, input),
});
