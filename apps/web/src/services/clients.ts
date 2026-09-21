import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type ClientLastOrder = {
  id: number;
  orderCode: string;
  totalValue: number;
  createdAt: string;
  status: string;
};

export type Client = {
  id: number;
  userId: number;
  cpf: string;
  birthDate: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  preferredUnitId: number | null;
  preferredUnitName: string | null;
  latitude: number | null;
  longitude: number | null;
  registeredAt: string;
  active: boolean;
  name: string;
  email: string;
  phone: string;
  userStatus: string;
  ordersCount: number;
  ticketsCount: number;
  loyaltyLevel: string | null;
  pointsBalance: number | null;
  lastOrder: ClientLastOrder | null;
};

export const clientsResource = createResource<Client>('clients', {
  list: (params?: ListQuery) => apiGet<Paginated<Client>>(`/clients${toQueryString(params)}`),
  detail: (id) => apiGet<Client>(`/clients/${id}`),
  create: (input) => apiPost<Client>('/clients', input),
  update: (id, input) => apiPut<Client>(`/clients/${id}`, input),
  remove: (id) => apiDelete(`/clients/${id}`),
});
