import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type Coupon = {
  id: number;
  promotionId: number;
  code: string;
  expiry: string;
  usageLimit: number;
  active: boolean;
};

export type CreateCouponInput = {
  promotionId: number;
  code: string;
  expiry: string;
  usageLimit: number;
  active: boolean;
};

export type CouponListQuery = ListQuery & {
  promotionId?: number;
};

export const couponsResource = createResource<Coupon, CouponListQuery, CreateCouponInput>(
  'coupons',
  {
    list: (params?: CouponListQuery) =>
      apiGet<Paginated<Coupon>>(`/coupons${toQueryString(params)}`),
    create: (input) => apiPost<Coupon>('/coupons', input),
    update: (id, input) => apiPut<Coupon>(`/coupons/${id}`, input),
    remove: (id) => apiDelete(`/coupons/${id}`),
  },
);
