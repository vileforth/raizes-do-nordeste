import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type Client = {
  id: number;
  userId: number;
  cpf: string;
  registeredAt: string;
  active: boolean;
};

export const clientsResource = createResource<Client>('clients', {
  list: (params?: ListQuery) => apiGet<Paginated<Client>>(`/clients${toQueryString(params)}`),
  detail: (id) => apiGet<Client>(`/clients/${id}`),
  create: (input) => apiPost<Client>('/clients', input),
  update: (id, input) => apiPut<Client>(`/clients/${id}`, input),
  remove: (id) => apiDelete(`/clients/${id}`),
});
