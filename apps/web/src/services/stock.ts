import { apiGet, apiPatch } from '@/lib/api';

export type StockProduct = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  minimumStock: number;
};

export async function getLowStock() {
  return apiGet<StockProduct[]>('/stock/low');
}

export async function updateStockProduct(id: number, quantity: number) {
  return apiPatch(`/stock/products/${id}`, { quantity });
}
