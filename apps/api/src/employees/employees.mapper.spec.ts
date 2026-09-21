import { UserStatus } from '@prisma/client';
import {
  buildEmployeeSearch,
  resolveEmployeeOrderBy,
  toEmployeeResponse,
  type EmployeeWithRelations,
} from './employees.mapper';

function buildEmployee(
  overrides: Partial<EmployeeWithRelations> = {},
): EmployeeWithRelations {
  return {
    id: 121,
    userId: 121,
    unitId: 1,
    registrationNumber: 'RN0121',
    role: 'ATENDENTE',
    active: true,
    user: {
      id: 121,
      name: 'Joana Lima',
      email: 'joana.lima@raizes.com',
      phone: '81991112222',
      status: UserStatus.ATIVO,
      registeredAt: new Date('2025-06-01T10:00:00.000Z'),
    },
    unit: {
      id: 1,
      name: 'Recife Boa Viagem',
    },
    ...overrides,
  };
}

describe('employees.mapper', () => {
  it('maps user identity and unit name', () => {
    const response = toEmployeeResponse(buildEmployee());

    expect(response.name).toBe('Joana Lima');
    expect(response.email).toBe('joana.lima@raizes.com');
    expect(response.unitName).toBe('Recife Boa Viagem');
    expect(response.registrationNumber).toBe('RN0121');
  });

  it('searches by registration, role, identity and unit', () => {
    expect(buildEmployeeSearch(undefined)).toBeUndefined();
    expect(buildEmployeeSearch('joana')).toEqual({
      OR: [
        { registrationNumber: { contains: 'joana', mode: 'insensitive' } },
        { role: { contains: 'joana', mode: 'insensitive' } },
        { user: { name: { contains: 'joana', mode: 'insensitive' } } },
        { user: { email: { contains: 'joana', mode: 'insensitive' } } },
        { user: { phone: { contains: 'joana', mode: 'insensitive' } } },
        { unit: { name: { contains: 'joana', mode: 'insensitive' } } },
      ],
    });
  });

  it('orders by related user name', () => {
    expect(resolveEmployeeOrderBy('-name')).toEqual({ user: { name: 'desc' } });
    expect(resolveEmployeeOrderBy('registrationNumber')).toEqual({
      registrationNumber: 'asc',
    });
    expect(resolveEmployeeOrderBy(undefined)).toEqual({ id: 'asc' });
  });
});
