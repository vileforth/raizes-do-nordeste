import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type Coupon = {
  id: number;
  promotionId: number;
  code: string;
  validUntil: string;
  usageLimit: number;
  active: boolean;
};

export const couponsResource = createResource<Coupon>('coupons', {
  list: (params?: ListQuery) => apiGet<Paginated<Coupon>>(`/coupons${toQueryString(params)}`),
  create: (input) => apiPost<Coupon>('/coupons', input),
  update: (id, input) => apiPut<Coupon>(`/coupons/${id}`, input),
  remove: (id) => apiDelete(`/coupons/${id}`),
});
