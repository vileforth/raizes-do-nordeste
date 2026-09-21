import { apiGet, apiPost, apiPut } from '@/lib/api';
import { createResource } from './_factory/create-resource';

export type SupportTicket = {
  id: number;
  protocol: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
};

export const supportResource = createResource<SupportTicket>('support', {
  list: () => apiGet<SupportTicket[]>('/support'),
  detail: (id) => apiGet<SupportTicket>(`/support/${id}`),
  create: (input) => apiPost<SupportTicket>('/support', input),
  update: (id, input) => apiPut<SupportTicket>(`/support/${id}`, input),
});
