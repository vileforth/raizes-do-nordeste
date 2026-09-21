import { apiGet, apiPost, apiPut } from '@/lib/api';
import { createResource } from './_factory/create-resource';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  active: boolean;
};

export const productsResource = createResource<Product>('products', {
  list: () => apiGet<Product[]>('/products'),
  detail: (id) => apiGet<Product>(`/products/${id}`),
  create: (input) => apiPost<Product>('/products', input),
  update: (id, input) => apiPut<Product>(`/products/${id}`, input),
});
