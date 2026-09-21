import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { StockService } from './stock.service';
import { AuthenticatedUser } from '../auth/types/auth-user.types';

describe('StockService', () => {
  let service: StockService;
  let prisma: {
    stock: { findUnique: jest.Mock };
    stockProduct: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
    };
    employee: { findUnique: jest.Mock };
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
      stock: { findUnique: jest.fn() },
      stockProduct: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        update: jest.fn(),
      },
      employee: { findUnique: jest.fn() },
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new StockService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('returns unit stock for manager own unit', async () => {
    prisma.employee.findUnique.mockResolvedValue({ unitId: 3, active: true });
    prisma.stock.findUnique.mockResolvedValue({
      id: 1,
      unitId: 3,
      status: 'ATIVO',
      stockProducts: [
        {
          id: 10,
          productId: 5,
          quantity: 20,
          minimumStock: 10,
          product: { name: 'Tapioca' },
        },
      ],
    });

    const result = await service.getUnitStock(manager, 3);

    expect(result.products).toHaveLength(1);
    expect(result.products[0].productName).toBe('Tapioca');
  });

  it('blocks manager from another unit stock', async () => {
    prisma.employee.findUnique.mockResolvedValue({ unitId: 3, active: true });

    await expect(service.getUnitStock(manager, 9)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('updates stock product for admin', async () => {
    prisma.stockProduct.findUnique.mockResolvedValue({
      id: 10,
      productId: 5,
      quantity: 5,
      minimumStock: 10,
      stock: { unitId: 3 },
      product: { name: 'Tapioca' },
    });
    prisma.stockProduct.update.mockResolvedValue({
      id: 10,
      productId: 5,
      quantity: 20,
      minimumStock: 10,
      product: { name: 'Tapioca' },
    });

    const result = await service.updateStockProduct(admin, 10, { quantity: 20 });

    expect(result.quantity).toBe(20);
    expect(logger.info).toHaveBeenCalled();
  });

  it('lists all stock products for admin', async () => {
    prisma.stockProduct.findMany.mockResolvedValue([
      {
        id: 10,
        productId: 5,
        quantity: 40,
        minimumStock: 10,
        product: { name: 'Tapioca' },
        stock: { unitId: 1, unit: { name: 'Recife' } },
      },
    ]);
    prisma.stockProduct.count.mockResolvedValue(1);

    const result = await service.findAll(admin);

    expect(result.data).toHaveLength(1);
    expect(result.data[0].unitName).toBe('Recife');
    expect(result.pagination.total).toBe(1);
  });

  it('returns low stock items', async () => {
    prisma.stockProduct.findMany.mockResolvedValue([
      {
        id: 10,
        productId: 5,
        quantity: 5,
        minimumStock: 10,
        product: { name: 'Tapioca' },
      },
      {
        id: 11,
        productId: 6,
        quantity: 20,
        minimumStock: 10,
        product: { name: 'Cuscuz' },
      },
    ]);

    const result = await service.findLowStock(admin);

    expect(result.data).toHaveLength(1);
    expect(result.data[0].productName).toBe('Tapioca');
    expect(result.pagination.total).toBe(1);
  });

  it('throws when stock not found', async () => {
    prisma.employee.findUnique.mockResolvedValue({ unitId: 3, active: true });
    prisma.stock.findUnique.mockResolvedValue(null);

    await expect(service.getUnitStock(manager, 3)).rejects.toThrow(
      NotFoundException,
    );
  });
});
