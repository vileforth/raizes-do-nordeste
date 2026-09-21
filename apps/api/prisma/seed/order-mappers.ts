import {
  ConsumptionType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { excelSerialToDate, excelSerialToDateOrNull } from './excel-date';
import {
  readDecimalString,
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readString,
} from './xlsx-reader';

export function mapOrders(rows: Record<string, unknown>[]): Prisma.OrderCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_pedido'),
    clientId: readNumber(row, 'id_cliente'),
    unitId: readNumber(row, 'id_unidade'),
    status: readString(row, 'status') as OrderStatus,
    consumptionType: readString(row, 'tipo_consumo') as ConsumptionType,
    totalValue: readDecimalString(row, 'valor_total'),
    orderCode: readString(row, 'codigo_pedido'),
    createdAt: excelSerialToDate(readNumber(row, 'data_criacao')),
    updatedAt: excelSerialToDate(readNumber(row, 'data_atualizacao')),
  }));
}

export function mapOrderItems(rows: Record<string, unknown>[]): Prisma.OrderItemCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_item_pedido'),
    orderId: readNumber(row, 'id_pedido'),
    productId: readNumber(row, 'id_produto'),
    quantity: readNumber(row, 'quantidade'),
    unitPrice: readDecimalString(row, 'preco_unitario'),
    subtotal: readDecimalString(row, 'subtotal'),
  }));
}

export function mapPayments(rows: Record<string, unknown>[]): Prisma.PaymentCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_pagamento'),
    orderId: readNumber(row, 'id_pedido'),
    method: readString(row, 'metodo') as PaymentMethod,
    value: readDecimalString(row, 'valor'),
    status: readString(row, 'status') as PaymentStatus,
    paidAt: excelSerialToDateOrNull(readOptionalNumber(row, 'data_pagamento')),
    transactionCode: readString(row, 'codigo_transacao'),
  }));
}

export function mapOrderStatusHistories(
  rows: Record<string, unknown>[],
): Prisma.OrderStatusHistoryCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_historico_status'),
    orderId: readNumber(row, 'id_pedido'),
    status: readString(row, 'status') as OrderStatus,
    occurredAt: excelSerialToDate(readNumber(row, 'data_hora')),
    userId: readNumber(row, 'id_usuario'),
    notes: readOptionalString(row, 'observacao'),
  }));
}
