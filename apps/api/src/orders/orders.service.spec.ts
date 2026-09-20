import { ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { ConsumptionType, OrderStatus, Prisma } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: {
    client: { findUnique: jest.Mock };
    stock: { findUnique: jest.Mock };
    product: { findMany: jest.Mock };
    order: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      findMany: jest.Mock;
    };
    orderItem: { deleteMany: jest.Mock };
    orderStatusHistory: { findMany: jest.Mock };
    employee: { findUnique: jest.Mock };
    $transaction: jest.Mock;
  };
  let logger: jest.Mocked<LoggerService>;

  const clienteUser: AuthenticatedUser = {
    id: 10,
    email: 'cliente@example.com',
    name: 'Cliente',
    status: UserStatus.ATIVO,
    roles: [UserRole.CLIENTE],
    sub: 'sub-10',
  };

  beforeEach(() => {
    prisma = {
      client: { findUnique: jest.fn() },
      stock: { findUnique: jest.fn() },
      product: { findMany: jest.fn() },
      order: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      orderItem: { deleteMany: jest.fn() },
      orderStatusHistory: { findMany: jest.fn() },
      employee: { findUnique: jest.fn() },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new OrdersService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('creates order with RECEBIDO status and history', async () => {
    prisma.client.findUnique.mockResolvedValue({ id: 5 });
    prisma.stock.findUnique.mockResolvedValue({
      id: 1,
      unitId: 2,
      stockProducts: [{ productId: 7, quantity: 10 }],
    });
    prisma.product.findMany.mockResolvedValue([
      {
        id: 7,
        active: true,
        price: new Prisma.Decimal('12.50'),
      },
    ]);
    prisma.order.findUnique.mockResolvedValue(null);
    prisma.order.create.mockResolvedValue({
      id: 99,
      orderCode: 'ORD-TEST',
      status: OrderStatus.RECEBIDO,
      items: [],
    });

    const result = await service.create(
      {
        unitId: 2,
        consumptionType: ConsumptionType.RETIRADA_NO_BALCAO,
        items: [{ productId: 7, quantity: 2 }],
      },
      clienteUser,
    );

    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          clientId: 5,
          status: OrderStatus.RECEBIDO,
          statusHistories: {
            create: {
              status: OrderStatus.RECEBIDO,
              userId: 10,
            },
          },
        }),
      }),
    );
    expect(result.id).toBe(99);
    expect(logger.info).toHaveBeenCalled();
  });

  it('forces clientId from cliente profile', async () => {
    prisma.client.findUnique.mockResolvedValue({ id: 5 });
    prisma.stock.findUnique.mockResolvedValue({
      id: 1,
      stockProducts: [{ productId: 7, quantity: 5 }],
    });
    prisma.product.findMany.mockResolvedValue([
      { id: 7, active: true, price: new Prisma.Decimal('10.00') },
    ]);
    prisma.order.findUnique.mockResolvedValue(null);
    prisma.order.create.mockResolvedValue({ id: 1 });

    await service.create(
      {
        clientId: 999,
        unitId: 2,
        consumptionType: ConsumptionType.CONSUMO_NO_LOCAL,
        items: [{ productId: 7, quantity: 1 }],
      },
      clienteUser,
    );

    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ clientId: 5 }),
      }),
    );
  });

  it('rejects inactive products', async () => {
    prisma.client.findUnique.mockResolvedValue({ id: 5 });
    prisma.stock.findUnique.mockResolvedValue({
      id: 1,
      stockProducts: [{ productId: 7, quantity: 5 }],
    });
    prisma.product.findMany.mockResolvedValue([
      { id: 7, active: false, price: new Prisma.Decimal('10.00') },
    ]);

    await expect(
      service.create(
        {
          unitId: 2,
          consumptionType: ConsumptionType.CONSUMO_NO_LOCAL,
          items: [{ productId: 7, quantity: 1 }],
        },
        clienteUser,
      ),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('rejects insufficient stock', async () => {
    prisma.client.findUnique.mockResolvedValue({ id: 5 });
    prisma.stock.findUnique.mockResolvedValue({
      id: 1,
      stockProducts: [{ productId: 7, quantity: 1 }],
    });
    prisma.product.findMany.mockResolvedValue([
      { id: 7, active: true, price: new Prisma.Decimal('10.00') },
    ]);

    await expect(
      service.create(
        {
          unitId: 2,
          consumptionType: ConsumptionType.CONSUMO_NO_LOCAL,
          items: [{ productId: 7, quantity: 3 }],
        },
        clienteUser,
      ),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('rejects item updates when status is not RECEBIDO', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 1,
      clientId: 5,
      unitId: 2,
      status: OrderStatus.EM_PREPARACAO,
    });
    prisma.client.findUnique.mockResolvedValue({ id: 5 });

    await expect(
      service.updateItems(
        1,
        { items: [{ productId: 7, quantity: 1 }] },
        clienteUser,
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects invalid status transitions', async () => {
    prisma.order.findUnique.mockResolvedValue({
      id: 1,
      clientId: 5,
      unitId: 2,
      status: OrderStatus.RECEBIDO,
    });
    prisma.employee.findUnique.mockResolvedValue({ unitId: 2 });

    const staffUser: AuthenticatedUser = {
      ...clienteUser,
      id: 20,
      roles: [UserRole.COZINHEIRO],
    };

    await expect(
      service.updateStatus(
        1,
        { status: OrderStatus.PRONTO },
        staffUser,
      ),
    ).rejects.toThrow(ConflictException);
  });
});
