import { Prisma, UnitStatus, UserStatus } from '@prisma/client';
import { excelSerialToDate } from './excel-date';
import { readBoolean, readNumber, readString } from './xlsx-reader';

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
