import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type Employee = {
  id: number;
  userId: number;
  unitId: number;
  registrationNumber: string;
  role: string;
  active: boolean;
  name: string;
  email: string;
  phone: string;
  userStatus: string;
  registeredAt: string;
  unitName: string;
};

export const employeesResource = createResource<Employee>('employees', {
  list: (params?: ListQuery) =>
    apiGet<Paginated<Employee>>(`/employees${toQueryString(params)}`),
  detail: (id) => apiGet<Employee>(`/employees/${id}`),
  create: (input) => apiPost<Employee>('/employees', input),
  update: (id, input) => apiPut<Employee>(`/employees/${id}`, input),
  remove: (id) => apiDelete(`/employees/${id}`),
});
