import { UserRole } from '../enums/user-role.enum';

export const ALL_USER_ROLES: UserRole[] = [
  UserRole.CLIENTE,
  UserRole.ATENDENTE,
  UserRole.COZINHEIRO,
  UserRole.GERENTE,
  UserRole.ADMINISTRADOR,
];

export const STAFF_USER_ROLES: UserRole[] = [
  UserRole.ATENDENTE,
  UserRole.COZINHEIRO,
  UserRole.GERENTE,
  UserRole.ADMINISTRADOR,
];
