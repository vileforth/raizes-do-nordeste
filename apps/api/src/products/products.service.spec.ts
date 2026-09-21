import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';
import { AuthenticatedUser } from '../auth/types/auth-user.types';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: {
    product: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
  };
  let logger: jest.Mocked<LoggerService>;

  const atendente: AuthenticatedUser = {
    id: 3,
    email: 'atendente@example.com',
    name: 'Atendente',
    status: UserStatus.ATIVO,
    roles: [UserRole.ATENDENTE],
    sub: 'sub-3',
  };

  const admin: AuthenticatedUser = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin',
    status: UserStatus.ATIVO,
    roles: [UserRole.ADMINISTRADOR],
    sub: 'sub-1',
  };

  beforeEach(() => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
      },
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new ProductsService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('lists products', async () => {
    prisma.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Tapioca',
        description: 'Desc',
        price: new Decimal(10),
        category: 'Snacks',
        active: true,
      },
    ]);

    prisma.product.count.mockResolvedValue(1);

    const result = await service.findAll();

    expect(result.data[0].price).toBe(10);
    expect(result.pagination.total).toBe(1);
  });

  it('blocks atendente from creating products', async () => {
    await expect(
      service.create(atendente, {
        name: 'Tapioca',
        description: 'Desc',
        price: 10,
        category: 'Snacks',
        active: true,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('allows admin to create products', async () => {
    prisma.product.create.mockResolvedValue({
      id: 1,
      name: 'Tapioca',
      description: 'Desc',
      price: new Decimal(10),
      category: 'Snacks',
      active: true,
    });

    const result = await service.create(admin, {
      name: 'Tapioca',
      description: 'Desc',
      price: 10,
      category: 'Snacks',
      active: true,
    });

    expect(result.id).toBe(1);
  });
});
