import { apiGet, apiPost, apiPut } from '@/lib/api';
import { createResource } from './_factory/create-resource';

export type Employee = {
  id: number;
  userId: number;
  unitId: number;
  registrationNumber: string;
  role: string;
  active: boolean;
};

export const employeesResource = createResource<Employee>('employees', {
  list: () => apiGet<Employee[]>('/employees'),
  detail: (id) => apiGet<Employee>(`/employees/${id}`),
  create: (input) => apiPost<Employee>('/employees', input),
  update: (id, input) => apiPut<Employee>(`/employees/${id}`, input),
});
