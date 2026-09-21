import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoyaltyLevel } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoyaltyService } from './loyalty.service';

describe('LoyaltyService', () => {
  let service: LoyaltyService;
  let prisma: {
    loyaltyProgram: { findFirst: jest.Mock };
    clientLoyalty: {
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    pointMovement: { findMany: jest.Mock; create: jest.Mock };
    benefit: { findMany: jest.Mock; findUnique: jest.Mock; count: jest.Mock };
    benefitRedemption: { create: jest.Mock };
    $transaction: jest.Mock;
  };
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    prisma = {
      loyaltyProgram: { findFirst: jest.fn() },
      clientLoyalty: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      pointMovement: { findMany: jest.fn(), create: jest.fn() },
      benefit: { findMany: jest.fn(), findUnique: jest.fn(), count: jest.fn().mockResolvedValue(0) },
      benefitRedemption: { create: jest.fn() },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new LoyaltyService(prisma as unknown as PrismaService, logger);
  });

  it('redeems benefit when points are sufficient', async () => {
    prisma.benefit.findUnique.mockResolvedValue({
      id: 1,
      active: true,
      expiry: new Date('2099-01-01'),
      requiredPoints: 100,
    });
    prisma.clientLoyalty.findFirst.mockResolvedValue({
      id: 10,
      clientId: 5,
      pointsBalance: 500,
      level: LoyaltyLevel.PRATA,
    });
    prisma.benefitRedemption.create.mockResolvedValue({
      id: 99,
      redemptionCode: 'RDM-ABCD',
    });

    const result = await service.redeemBenefit(1, 5);
    expect(result.redemptionCode).toBeDefined();
    expect(prisma.clientLoyalty.update).toHaveBeenCalled();
  });

  it('rejects redeem when points are insufficient', async () => {
    prisma.benefit.findUnique.mockResolvedValue({
      id: 1,
      active: true,
      expiry: new Date('2099-01-01'),
      requiredPoints: 1000,
    });
    prisma.clientLoyalty.findFirst.mockResolvedValue({
      id: 10,
      clientId: 5,
      pointsBalance: 100,
      level: LoyaltyLevel.BRONZE,
    });

    await expect(service.redeemBenefit(1, 5)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects redeem for expired benefit', async () => {
    prisma.benefit.findUnique.mockResolvedValue({
      id: 1,
      active: true,
      expiry: new Date('2020-01-01'),
      requiredPoints: 50,
    });

    await expect(service.redeemBenefit(1, 5)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws when client loyalty not found', async () => {
    prisma.clientLoyalty.findFirst.mockResolvedValue(null);
    await expect(service.getClientLoyalty(99)).rejects.toThrow(
      NotFoundException,
    );
  });
});
