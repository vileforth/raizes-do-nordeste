import { apiDelete, apiGet, apiPatch } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import type { Paginated } from './_factory/create-resource';

export type StockProduct = {
  id: number;
  productId: number;
  productName: string;
  unitId: number;
  unitName: string;
  quantity: number;
  minimumStock: number;
};

export async function getStock(params?: ListQuery) {
  return apiGet<Paginated<StockProduct>>(`/stock${toQueryString(params)}`);
}

export async function getLowStock(params?: ListQuery) {
  return apiGet<Paginated<StockProduct>>(`/stock/low${toQueryString(params)}`);
}

export async function updateStockProduct(id: number, quantity: number) {
  return apiPatch(`/stock/products/${id}`, { quantity });
}

export function removeStockProduct(id: string) {
  return apiDelete(`/stock/products/${id}`);
}
