import { apiGet, apiPost, apiPut } from '@/lib/api';
import { createResource } from './_factory/create-resource';

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
  list: () => apiGet<Promotion[]>('/promotions'),
  detail: (id) => apiGet<Promotion>(`/promotions/${id}`),
  create: (input) => apiPost<Promotion>('/promotions', input),
  update: (id, input) => apiPut<Promotion>(`/promotions/${id}`, input),
});
