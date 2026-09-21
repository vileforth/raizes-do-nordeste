import { BadRequestException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: {
    order: { count: jest.Mock; aggregate: jest.Mock; findMany: jest.Mock };
    promotion: { count: jest.Mock; findMany: jest.Mock };
    clientLoyalty: { count: jest.Mock; findMany: jest.Mock };
    stockProduct: { findMany: jest.Mock };
    employee: { findUnique: jest.Mock };
  };
  let logger: jest.Mocked<LoggerService>;

  const admin = {
    id: 1,
    email: 'admin@test.com',
    name: 'Admin',
    status: 'ATIVO',
    roles: [UserRole.ADMINISTRADOR],
    sub: 'sub',
  };

  const manager = {
    id: 2,
    email: 'manager@test.com',
    name: 'Manager',
    status: 'ATIVO',
    roles: [UserRole.GERENTE],
    sub: 'sub',
  };

  beforeEach(() => {
    prisma = {
      order: {
        count: jest.fn().mockResolvedValue(3),
        aggregate: jest.fn().mockResolvedValue({ _sum: { totalValue: 150 } }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      promotion: {
        count: jest.fn().mockResolvedValue(2),
        findMany: jest.fn().mockResolvedValue([]),
      },
      clientLoyalty: {
        count: jest.fn().mockResolvedValue(5),
        findMany: jest.fn().mockResolvedValue([]),
      },
      stockProduct: { findMany: jest.fn().mockResolvedValue([]) },
      employee: {
        findUnique: jest.fn().mockResolvedValue({ unitId: 7, active: true }),
      },
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new ReportsService(prisma as unknown as PrismaService, logger);
  });

  it('returns indicators for admin', async () => {
    const result = await service.getIndicators({}, admin);
    expect(result.orders).toBe(3);
    expect(result.revenue).toBe(150);
  });

  it('scopes manager to own unit', async () => {
    await service.getIndicators({ unitId: 7 }, manager);
    expect(prisma.order.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ unitId: 7 }) }),
    );
  });

  it('rejects manager accessing another unit', async () => {
    await expect(
      service.getIndicators({ unitId: 99 }, manager),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects invalid report type', async () => {
    await expect(
      service.getReportByType('invalid', {}, admin),
    ).rejects.toThrow(BadRequestException);
  });
});
