import { NotFoundException } from '@nestjs/common';
import { PromotionStatus } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from './promotions.service';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let prisma: {
    promotion: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    promotionUnit: {
      findFirst: jest.Mock;
      createMany: jest.Mock;
    };
    employee: {
      findUnique: jest.Mock;
    };
  };
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    prisma = {
      promotion: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      promotionUnit: {
        findFirst: jest.fn(),
        createMany: jest.fn(),
      },
      employee: {
        findUnique: jest.fn(),
      },
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new PromotionsService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('returns all promotions for admin', async () => {
    prisma.promotion.findMany.mockResolvedValue([{ id: 1 }]);
    const result = await service.findAll({
      id: 1,
      email: 'admin@test.com',
      name: 'Admin',
      status: 'ATIVO',
      roles: [UserRole.ADMINISTRADOR],
      sub: 'sub',
    });
    expect(result).toHaveLength(1);
    expect(prisma.promotion.findMany).toHaveBeenCalled();
  });

  it('filters active promotions for cliente', async () => {
    prisma.promotion.findMany.mockResolvedValue([]);
    await service.findAll({
      id: 2,
      email: 'client@test.com',
      name: 'Client',
      status: 'ATIVO',
      roles: [UserRole.CLIENTE],
      sub: 'sub',
    });
    expect(prisma.promotion.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: PromotionStatus.ATIVA }),
      }),
    );
  });

  it('activates promotion', async () => {
    prisma.promotion.findUnique.mockResolvedValue({ id: 3 });
    prisma.promotion.update.mockResolvedValue({
      id: 3,
      status: PromotionStatus.ATIVA,
    });
    const result = await service.activate(3);
    expect(result.status).toBe(PromotionStatus.ATIVA);
  });

  it('throws when promotion not found', async () => {
    prisma.promotion.findUnique.mockResolvedValue(null);
    await expect(service.activate(99)).rejects.toThrow(NotFoundException);
  });
});
