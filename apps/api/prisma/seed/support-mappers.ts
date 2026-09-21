import { AuditAction, Prisma, SupportStatus, SupportType } from '@prisma/client';
import { excelSerialToDate } from './excel-date';
import {
  readNumber,
  readOptionalNumber,
  readOptionalString,
  readString,
} from './xlsx-reader';

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
