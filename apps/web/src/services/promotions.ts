import { apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type Promotion = {
  id: number;
  name: string;
  description: string;
  rule: string;
  startDate: string;
  endDate: string;
  status: string;
};

export const promotionsResource = createResource<Promotion>('promotions', {
  list: (params?: ListQuery) =>
    apiGet<Paginated<Promotion>>(`/promotions${toQueryString(params)}`),
  detail: (id) => apiGet<Promotion>(`/promotions/${id}`),
  create: (input) => apiPost<Promotion>('/promotions', input),
  update: (id, input) => apiPut<Promotion>(`/promotions/${id}`, input),
});
