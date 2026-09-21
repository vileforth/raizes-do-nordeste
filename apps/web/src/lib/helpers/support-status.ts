import { UserRole } from '@raizes/shared';

export const SUPPORT_STATUSES = [
  'ABERTO',
  'EM_ATENDIMENTO',
  'RESOLVIDO',
  'FECHADO',
  'CANCELADO',
] as const;

export type SupportStatus = (typeof SUPPORT_STATUSES)[number];

export function canManageSupportBoard(roles: UserRole[]): boolean {
  return roles.some(
    (role) =>
      role === UserRole.ATENDENTE ||
      role === UserRole.GERENTE ||
      role === UserRole.ADMINISTRADOR,
  );
}

export function canDeleteSupportTicket(roles: UserRole[]): boolean {
  return roles.some(
    (role) => role === UserRole.GERENTE || role === UserRole.ADMINISTRADOR,
  );
}

export { toneFor as supportStatusTone } from './status';
