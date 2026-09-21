import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import { AuthenticatedUser } from '../auth/types/auth-user.types';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    employee: { findUnique: jest.Mock };
    profile: { findMany: jest.Mock };
    userProfile: { deleteMany: jest.Mock; createMany: jest.Mock };
    $transaction: jest.Mock;
  };
  let logger: jest.Mocked<LoggerService>;

  const admin: AuthenticatedUser = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin',
    status: UserStatus.ATIVO,
    roles: [UserRole.ADMINISTRADOR],
    sub: 'sub-1',
  };

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
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
      },
      employee: { findUnique: jest.fn() },
      profile: { findMany: jest.fn() },
      userProfile: { deleteMany: jest.fn(), createMany: jest.fn() },
      $transaction: jest.fn(),
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new UsersService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('lists all users for admin', async () => {
    prisma.user.findMany.mockResolvedValue([
      {
        id: 10,
        name: 'User',
        email: 'user@example.com',
        phone: '11999999999',
        status: UserStatus.ATIVO,
        registeredAt: new Date(),
        userProfiles: [{ profile: { name: UserRole.CLIENTE } }],
      },
    ]);
    prisma.user.count.mockResolvedValue(1);

    const result = await service.findAll(admin);

    expect(result.data).toHaveLength(1);
    expect(result.data[0].profiles).toEqual([UserRole.CLIENTE]);
    expect(result.pagination.total).toBe(1);
  });

  it('scopes user list to manager unit', async () => {
    prisma.employee.findUnique.mockResolvedValue({ unitId: 5, active: true });
    prisma.user.findMany.mockResolvedValue([]);

    await service.findAll(manager);

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { employee: { unitId: 5 } },
      include: expect.any(Object),
      orderBy: { id: 'asc' },
      skip: 0,
      take: 20,
    });
  });

  it('rejects profile update for non-admin', async () => {
    await expect(
      service.updateProfiles(manager, 10, { profileNames: [UserRole.CLIENTE] }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('updates profiles for admin', async () => {
    prisma.user.findUnique
      .mockResolvedValueOnce({
        id: 10,
        name: 'User',
        email: 'user@example.com',
        phone: '11999999999',
        status: UserStatus.ATIVO,
        registeredAt: new Date(),
        userProfiles: [],
        employee: null,
      })
      .mockResolvedValueOnce({
        id: 10,
        name: 'User',
        email: 'user@example.com',
        phone: '11999999999',
        status: UserStatus.ATIVO,
        registeredAt: new Date(),
        userProfiles: [{ profile: { name: UserRole.ATENDENTE } }],
        employee: null,
      });
    prisma.profile.findMany.mockResolvedValue([
      { id: 2, name: UserRole.ATENDENTE },
    ]);
    prisma.$transaction.mockResolvedValue([]);

    const result = await service.updateProfiles(admin, 10, {
      profileNames: [UserRole.ATENDENTE],
    });

    expect(result.profiles).toEqual([UserRole.ATENDENTE]);
    expect(logger.info).toHaveBeenCalled();
  });

  it('throws when user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findOne(admin, 99)).rejects.toThrow(NotFoundException);
  });

  it('rejects deleting the authenticated user', async () => {
    await expect(service.remove(admin, 1)).rejects.toThrow(ConflictException);
  });
});
