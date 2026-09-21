import { Prisma } from '@prisma/client';
import { EmployeeResponseDto } from './dto/employee-response.dto';

export const employeeInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      registeredAt: true,
    },
  },
  unit: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.EmployeeInclude;

export type EmployeeWithRelations = Prisma.EmployeeGetPayload<{
  include: typeof employeeInclude;
}>;

export function buildEmployeeSearch(
  search?: string,
): Prisma.EmployeeWhereInput | undefined {
  if (!search) {
    return undefined;
  }
  return {
    OR: [
      { registrationNumber: { contains: search, mode: 'insensitive' } },
      { role: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { phone: { contains: search, mode: 'insensitive' } } },
      { unit: { name: { contains: search, mode: 'insensitive' } } },
    ],
  };
}

export function resolveEmployeeOrderBy(
  orderBy?: string,
): Prisma.EmployeeOrderByWithRelationInput {
  const descending = Boolean(orderBy?.startsWith('-'));
  const field = descending ? orderBy?.slice(1) : orderBy;
  const direction = descending ? 'desc' : 'asc';
  if (field === 'name') {
    return { user: { name: direction } };
  }
  if (field === 'email') {
    return { user: { email: direction } };
  }
  if (field === 'role') {
    return { role: direction };
  }
  if (field === 'registrationNumber') {
    return { registrationNumber: direction };
  }
  return { id: 'asc' };
}

export function toEmployeeResponse(
  employee: EmployeeWithRelations,
): EmployeeResponseDto {
  return {
    id: employee.id,
    userId: employee.userId,
    unitId: employee.unitId,
    registrationNumber: employee.registrationNumber,
    role: employee.role,
    active: employee.active,
    name: employee.user.name,
    email: employee.user.email,
    phone: employee.user.phone,
    userStatus: employee.user.status,
    registeredAt: employee.user.registeredAt,
    unitName: employee.unit.name,
  };
}
