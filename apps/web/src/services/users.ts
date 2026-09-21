import { apiGet, apiPost, apiPut } from '@/lib/api';
import { createResource } from './_factory/create-resource';

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  profiles: string[];
};

export const usersResource = createResource<User>('users', {
  list: () => apiGet<User[]>('/users'),
  detail: (id) => apiGet<User>(`/users/${id}`),
  create: (input) => apiPost<User>('/users', input),
  update: (id, input) => apiPut<User>(`/users/${id}`, input),
});
