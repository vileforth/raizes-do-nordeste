import { Prisma, PromotionStatus } from '@prisma/client';
import { excelSerialToDate } from './excel-date';
import { readBoolean, readDecimalString, readNumber, readString } from './xlsx-reader';

export function mapProducts(rows: Record<string, unknown>[]): Prisma.ProductCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_produto'),
    name: readString(row, 'nome'),
    description: readString(row, 'descricao'),
    price: readDecimalString(row, 'preco'),
    category: readString(row, 'categoria'),
    active: readBoolean(row, 'ativo'),
  }));
}

export function mapStocks(rows: Record<string, unknown>[]): Prisma.StockCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_estoque'),
    unitId: readNumber(row, 'id_unidade'),
    status: readString(row, 'status'),
  }));
}

export function mapStockProducts(
  rows: Record<string, unknown>[],
): Prisma.StockProductCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_estoque_produto'),
    stockId: readNumber(row, 'id_estoque'),
    productId: readNumber(row, 'id_produto'),
    quantity: readNumber(row, 'quantidade'),
    minimumStock: readNumber(row, 'estoque_minimo'),
  }));
}

export function mapPromotions(rows: Record<string, unknown>[]): Prisma.PromotionCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_promocao'),
    name: readString(row, 'nome'),
    description: readString(row, 'descricao'),
    rule: readString(row, 'regra'),
    startDate: excelSerialToDate(readNumber(row, 'data_inicio')),
    endDate: excelSerialToDate(readNumber(row, 'data_fim')),
    status: readString(row, 'status') as PromotionStatus,
  }));
}

export function mapCoupons(rows: Record<string, unknown>[]): Prisma.CouponCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_cupom'),
    promotionId: readNumber(row, 'id_promocao'),
    code: readString(row, 'codigo'),
    expiry: excelSerialToDate(readNumber(row, 'validade')),
    usageLimit: readNumber(row, 'limite_uso'),
    active: readBoolean(row, 'ativo'),
  }));
}

export function mapPromotionUnits(
  rows: Record<string, unknown>[],
): Prisma.PromotionUnitCreateManyInput[] {
  return rows.map((row) => ({
    promotionId: readNumber(row, 'id_promocao'),
    unitId: readNumber(row, 'id_unidade'),
  }));
}

export function mapPromotionProducts(
  rows: Record<string, unknown>[],
): Prisma.PromotionProductCreateManyInput[] {
  return rows.map((row) => ({
    promotionId: readNumber(row, 'id_promocao'),
    productId: readNumber(row, 'id_produto'),
  }));
}
