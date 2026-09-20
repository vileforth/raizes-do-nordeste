import {
  AuditAction,
  ConsumptionType,
  LoyaltyLevel,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PointMovementType,
  Prisma,
  PromotionStatus,
  SupportStatus,
  SupportType,
  UnitStatus,
  UserStatus,
} from '@prisma/client';
import { excelSerialToDate, excelSerialToDateOrNull } from './excel-date';
import {
  readBoolean,
  readDecimalString,
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readString,
} from './xlsx-reader';

export function resolveEmployeeUserId(row: Record<string, unknown>): number {
  return readNumber(row, 'id_funcionario');
}

export function resolveClientUserId(row: Record<string, unknown>): number {
  return readNumber(row, 'id_cliente');
}

export function mapUsers(rows: Record<string, unknown>[]): Prisma.UserCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_usuario'),
    name: readString(row, 'nome'),
    email: readString(row, 'email'),
    passwordHash: readString(row, 'senha_hash'),
    phone: readString(row, 'telefone'),
    status: readString(row, 'status') as UserStatus,
    registeredAt: excelSerialToDate(readNumber(row, 'data_cadastro')),
  }));
}

export function mapProfiles(rows: Record<string, unknown>[]): Prisma.ProfileCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_perfil'),
    name: readString(row, 'nome'),
    description: readString(row, 'descricao'),
    active: readBoolean(row, 'ativo'),
  }));
}

export function mapUserProfiles(
  rows: Record<string, unknown>[],
): Prisma.UserProfileCreateManyInput[] {
  return rows.map((row) => ({
    userId: readNumber(row, 'id_usuario'),
    profileId: readNumber(row, 'id_perfil'),
  }));
}

export function mapClients(rows: Record<string, unknown>[]): Prisma.ClientCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_cliente'),
    userId: resolveClientUserId(row),
    cpf: readString(row, 'cpf'),
    registeredAt: excelSerialToDate(readNumber(row, 'data_cadastro')),
    active: readBoolean(row, 'ativo'),
  }));
}

export function mapEmployees(rows: Record<string, unknown>[]): Prisma.EmployeeCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_funcionario'),
    userId: resolveEmployeeUserId(row),
    unitId: readNumber(row, 'id_unidade'),
    registrationNumber: readString(row, 'matricula'),
    role: readString(row, 'cargo'),
    active: readBoolean(row, 'ativo'),
  }));
}

export function mapUnits(rows: Record<string, unknown>[]): Prisma.UnitCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_unidade'),
    name: readString(row, 'nome'),
    address: readString(row, 'endereco'),
    phone: readString(row, 'telefone'),
    status: readString(row, 'status') as UnitStatus,
    registeredAt: excelSerialToDate(readNumber(row, 'data_cadastro')),
  }));
}

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

export function mapLoyaltyPrograms(
  rows: Record<string, unknown>[],
): Prisma.LoyaltyProgramCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_programa'),
    name: readString(row, 'nome'),
    description: readString(row, 'descricao'),
    status: readString(row, 'status'),
  }));
}

export function mapClientLoyalties(
  rows: Record<string, unknown>[],
): Prisma.ClientLoyaltyCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_cliente_fidelidade'),
    clientId: readNumber(row, 'id_cliente'),
    programId: readNumber(row, 'id_programa'),
    pointsBalance: readNumber(row, 'saldo_pontos'),
    level: readString(row, 'nivel') as LoyaltyLevel,
    joinedAt: excelSerialToDate(readNumber(row, 'data_adesao')),
    status: readString(row, 'status'),
  }));
}

export function mapBenefits(rows: Record<string, unknown>[]): Prisma.BenefitCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_beneficio'),
    name: readString(row, 'nome'),
    description: readString(row, 'descricao'),
    requiredPoints: readNumber(row, 'pontos_necessarios'),
    expiry: excelSerialToDate(readNumber(row, 'validade')),
    active: readBoolean(row, 'ativo'),
  }));
}

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

export function mapPointMovements(
  rows: Record<string, unknown>[],
): Prisma.PointMovementCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_movimentacao'),
    clientLoyaltyId: readNumber(row, 'id_cliente_fidelidade'),
    type: readString(row, 'tipo') as PointMovementType,
    points: readNumber(row, 'pontos'),
    origin: readString(row, 'origem'),
    occurredAt: excelSerialToDate(readNumber(row, 'data_hora')),
    notes: readOptionalString(row, 'observacao'),
  }));
}

export function mapBenefitRedemptions(
  rows: Record<string, unknown>[],
): Prisma.BenefitRedemptionCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_resgate'),
    clientLoyaltyId: readNumber(row, 'id_cliente_fidelidade'),
    benefitId: readNumber(row, 'id_beneficio'),
    redeemedAt: excelSerialToDate(readNumber(row, 'data_resgate')),
    status: readString(row, 'status'),
    redemptionCode: readString(row, 'codigo_resgate'),
  }));
}

export function mapSupportTickets(
  rows: Record<string, unknown>[],
): Prisma.SupportTicketCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_atendimento'),
    clientId: readNumber(row, 'id_cliente'),
    responsibleUserId: readOptionalNumber(row, 'id_usuario_responsavel'),
    protocol: readString(row, 'protocolo'),
    type: readString(row, 'tipo') as SupportType,
    description: readString(row, 'descricao'),
    status: readString(row, 'status') as SupportStatus,
    openedAt: excelSerialToDate(readNumber(row, 'data_abertura')),
    updatedAt: excelSerialToDate(readNumber(row, 'data_atualizacao')),
  }));
}

export function mapSupportHistories(
  rows: Record<string, unknown>[],
): Prisma.SupportHistoryCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_historico'),
    supportTicketId: readNumber(row, 'id_atendimento'),
    userId: readNumber(row, 'id_usuario'),
    status: readString(row, 'status') as SupportStatus,
    notes: readOptionalString(row, 'observacao'),
    occurredAt: excelSerialToDate(readNumber(row, 'data_hora')),
  }));
}

export function mapAuditLogs(rows: Record<string, unknown>[]): Prisma.AuditLogCreateManyInput[] {
  return rows.map((row) => ({
    id: readNumber(row, 'id_log'),
    userId: readOptionalNumber(row, 'id_usuario'),
    action: readString(row, 'acao') as AuditAction,
    entity: readString(row, 'entidade'),
    entityId: readNumber(row, 'id_entidade'),
    occurredAt: excelSerialToDate(readNumber(row, 'data_hora')),
    details: readOptionalString(row, 'detalhes'),
  }));
}
