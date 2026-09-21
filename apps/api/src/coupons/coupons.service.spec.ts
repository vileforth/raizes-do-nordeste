import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PromotionStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CouponsService } from './coupons.service';

describe('CouponsService', () => {
  let service: CouponsService;
  let prisma: {
    coupon: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    promotion: {
      findUnique: jest.Mock;
    };
  };
  let logger: jest.Mocked<LoggerService>;

  const activePromotion = {
    status: PromotionStatus.ATIVA,
    startDate: new Date('2020-01-01'),
    endDate: new Date('2099-01-01'),
    promotionUnits: [{ unitId: 1 }],
  };

  beforeEach(() => {
    prisma = {
      coupon: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      promotion: {
        findUnique: jest.fn(),
      },
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new CouponsService(prisma as unknown as PrismaService, logger);
  });

  it('validates active coupon', async () => {
    prisma.coupon.findUnique.mockResolvedValue({
      id: 1,
      code: 'SAVE10',
      active: true,
      expiry: new Date('2099-01-01'),
      promotion: activePromotion,
    });

    const result = await service.validate({ code: 'SAVE10', unitId: 1 });
    expect(result.code).toBe('SAVE10');
  });

  it('rejects inactive coupon', async () => {
    prisma.coupon.findUnique.mockResolvedValue({
      id: 1,
      code: 'SAVE10',
      active: false,
      expiry: new Date('2099-01-01'),
      promotion: activePromotion,
    });

    await expect(service.validate({ code: 'SAVE10' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects expired coupon', async () => {
    prisma.coupon.findUnique.mockResolvedValue({
      id: 1,
      code: 'SAVE10',
      active: true,
      expiry: new Date('2020-01-01'),
      promotion: activePromotion,
    });

    await expect(service.validate({ code: 'SAVE10' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects unknown coupon', async () => {
    prisma.coupon.findUnique.mockResolvedValue(null);
    await expect(service.validate({ code: 'MISSING' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
