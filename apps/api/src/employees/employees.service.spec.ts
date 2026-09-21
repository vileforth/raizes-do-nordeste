import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from './employees.service';
import { AuthenticatedUser } from '../auth/types/auth-user.types';

describe('EmployeesService', () => {
  let service: EmployeesService;
  let prisma: {
    employee: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
    user: { findUnique: jest.Mock };
    unit: { findUnique: jest.Mock };
  };
  let logger: jest.Mocked<LoggerService>;

  const manager: AuthenticatedUser = {
    id: 2,
    email: 'manager@example.com',
    name: 'Manager',
    status: UserStatus.ATIVO,
    roles: [UserRole.GERENTE],
    sub: 'sub-2',
  };

  beforeEach(() => {
    prisma = {
      employee: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
      },
      user: { findUnique: jest.fn() },
      unit: { findUnique: jest.fn() },
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new EmployeesService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('scopes employee list to manager unit', async () => {
    prisma.employee.findUnique.mockResolvedValue({ unitId: 3, active: true });
    prisma.employee.findMany.mockResolvedValue([]);

    await service.findAll(manager);

    expect(prisma.employee.findMany).toHaveBeenCalledWith({
      where: { unitId: 3 },
      orderBy: { id: 'asc' },
      skip: 0,
      take: 20,
    });
  });

  it('blocks manager from another unit employee', async () => {
    prisma.employee.findUnique
      .mockResolvedValueOnce({ id: 1, userId: 10, unitId: 9, registrationNumber: 'A', role: 'X', active: true })
      .mockResolvedValueOnce({ unitId: 3, active: true });

    await expect(service.findOne(manager, 1)).rejects.toThrow(ForbiddenException);
  });

  it('removes employee from the manager unit', async () => {
    prisma.employee.findUnique
      .mockResolvedValueOnce({
        id: 1,
        userId: 10,
        unitId: 3,
        registrationNumber: 'A',
        role: 'X',
        active: true,
      })
      .mockResolvedValueOnce({ unitId: 3, active: true });
    prisma.employee.delete.mockResolvedValue({ id: 1 });

    await service.remove(manager, 1);

    expect(prisma.employee.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
