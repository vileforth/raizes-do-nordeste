import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  profiles: string[];
};

export const usersResource = createResource<User>('users', {
  list: (params?: ListQuery) => apiGet<Paginated<User>>(`/users${toQueryString(params)}`),
  detail: (id) => apiGet<User>(`/users/${id}`),
  create: (input) => apiPost<User>('/users', input),
  update: (id, input) => apiPut<User>(`/users/${id}`, input),
  remove: (id) => apiDelete(`/users/${id}`),
});
