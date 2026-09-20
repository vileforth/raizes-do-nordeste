import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: {
    order: { findUnique: jest.Mock };
    payment: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    prisma = {
      order: { findUnique: jest.fn() },
      payment: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new PaymentsService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('creates pending payment with order total value', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 1,
      totalValue: new Prisma.Decimal('25.00'),
      payment: null,
    });
    prisma.payment.findUnique.mockResolvedValue(null);
    prisma.payment.create.mockResolvedValue({
      id: 10,
      status: PaymentStatus.PENDENTE,
      value: new Prisma.Decimal('25.00'),
    });

    const result = await service.create({
      orderId: 1,
      method: PaymentMethod.PIX,
    });

    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: PaymentStatus.PENDENTE,
          value: new Prisma.Decimal('25.00'),
        }),
      }),
    );
    expect(result.status).toBe(PaymentStatus.PENDENTE);
  });

  it('rejects value mismatch on confirm', () => {
    expect(() =>
      service.assertPaymentValueMatchesOrder(
        new Prisma.Decimal('10.00'),
        new Prisma.Decimal('25.00'),
      ),
    ).toThrow(BadRequestException);
  });

  it('confirms only pending payments', async () => {
    prisma.payment.findUnique.mockResolvedValue({
      id: 10,
      status: PaymentStatus.CONFIRMADO,
      value: new Prisma.Decimal('25.00'),
      order: { totalValue: new Prisma.Decimal('25.00') },
    });

    await expect(service.confirm(10)).rejects.toThrow(ConflictException);
  });

  it('confirms pending payment and sets paidAt', async () => {
    prisma.payment.findUnique
      .mockResolvedValueOnce({
        id: 10,
        status: PaymentStatus.PENDENTE,
        value: new Prisma.Decimal('25.00'),
        order: { totalValue: new Prisma.Decimal('25.00') },
      })
      .mockResolvedValueOnce(null);
    prisma.payment.update.mockResolvedValue({
      id: 10,
      status: PaymentStatus.CONFIRMADO,
      paidAt: new Date(),
      transactionCode: 'TXN-CONFIRMED',
    });

    const result = await service.confirm(10);

    expect(prisma.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: PaymentStatus.CONFIRMADO,
          paidAt: expect.any(Date),
        }),
      }),
    );
    expect(result.status).toBe(PaymentStatus.CONFIRMADO);
  });

  it('rejects payment for missing order', async () => {
    prisma.order.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        orderId: 99,
        method: PaymentMethod.PIX,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
