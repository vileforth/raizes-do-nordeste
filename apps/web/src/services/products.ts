import { apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { createResource, type Paginated } from './_factory/create-resource';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  active: boolean;
};

export const productsResource = createResource<Product>('products', {
  list: (params?: ListQuery) => apiGet<Paginated<Product>>(`/products${toQueryString(params)}`),
  detail: (id) => apiGet<Product>(`/products/${id}`),
  create: (input) => apiPost<Product>('/products', input),
  update: (id, input) => apiPut<Product>(`/products/${id}`, input),
});
