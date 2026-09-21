import { apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type Unit = {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: string;
  registeredAt: string;
  latitude?: number | null;
  longitude?: number | null;
};

export const unitsResource = createResource<Unit>('units', {
  list: (params?: ListQuery) => apiGet<Paginated<Unit>>(`/units${toQueryString(params)}`),
  detail: (id) => apiGet<Unit>(`/units/${id}`),
  create: (input) => apiPost<Unit>('/units', input),
  update: (id, input) => apiPut<Unit>(`/units/${id}`, input),
});

export async function geocodeAddress(address: string) {
  const params = new URLSearchParams({ address });
  const res = await fetch(`/api/units/geocode?${params}`);
  return res.json() as Promise<{ latitude: number | null; longitude: number | null }>;
}
