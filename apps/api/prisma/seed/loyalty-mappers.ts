import { LoyaltyLevel, PointMovementType, Prisma } from '@prisma/client';
import { excelSerialToDate } from './excel-date';
import {
  readBoolean,
  readNumber,
  readOptionalString,
  readString,
} from './xlsx-reader';

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
