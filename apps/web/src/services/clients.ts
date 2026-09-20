import { apiGet, apiPost, apiPut } from '@/lib/api';
import { createResource } from './_factory/create-resource';

export type Client = {
  id: number;
  userId: number;
  cpf: string;
  registeredAt: string;
  active: boolean;
};

export const clientsResource = createResource<Client>('clients', {
  list: () => apiGet<Client[]>('/clients'),
  detail: (id) => apiGet<Client>(`/clients/${id}`),
  create: (input) => apiPost<Client>('/clients', input),
  update: (id, input) => apiPut<Client>(`/clients/${id}`, input),
});
