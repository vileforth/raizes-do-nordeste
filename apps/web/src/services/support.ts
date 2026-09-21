import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type SupportTicket = {
  id: number;
  protocol: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
};

export const supportResource = createResource<SupportTicket>('support', {
  list: (params?: ListQuery) =>
    apiGet<Paginated<SupportTicket>>(`/support${toQueryString(params)}`),
  detail: (id) => apiGet<SupportTicket>(`/support/${id}`),
  create: (input) => apiPost<SupportTicket>('/support', input),
  update: (id, input) => apiPut<SupportTicket>(`/support/${id}`, input),
  remove: (id) => apiDelete(`/support/${id}`),
});
