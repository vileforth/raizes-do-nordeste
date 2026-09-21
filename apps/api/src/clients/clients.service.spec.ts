import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsService } from './clients.service';
import { AuthenticatedUser } from '../auth/types/auth-user.types';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: {
    client: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
      user: { findUnique: jest.Mock };
      unit: { findUnique: jest.Mock };
    };
  let logger: jest.Mocked<LoggerService>;

  const cliente: AuthenticatedUser = {
    id: 5,
    email: 'cliente@example.com',
    name: 'Cliente',
    status: UserStatus.ATIVO,
    roles: [UserRole.CLIENTE],
    sub: 'sub-5',
  };

  const atendente: AuthenticatedUser = {
    id: 6,
    email: 'atendente@example.com',
    name: 'Atendente',
    status: UserStatus.ATIVO,
    roles: [UserRole.ATENDENTE],
    sub: 'sub-6',
  };

  beforeEach(() => {
    prisma = {
      client: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
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

    service = new ClientsService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('allows atendente to list clients', async () => {
    prisma.client.findMany.mockResolvedValue([]);

    const result = await service.findAll(atendente);

    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });

  it('blocks cliente from listing clients', async () => {
    await expect(service.findAll(cliente)).rejects.toThrow(ForbiddenException);
  });

  it('allows cliente to access own client', async () => {
    prisma.client.findUnique.mockResolvedValue({
      id: 1,
      userId: 5,
      cpf: '12345678901',
      birthDate: new Date('1992-04-12'),
      address: 'Rua Setúbal, 120 - Boa Viagem',
      city: 'Recife',
      state: 'PE',
      zipCode: '51020000',
      preferredUnitId: 1,
      registeredAt: new Date(),
      active: true,
      user: {
        id: 5,
        name: 'Cliente',
        email: 'cliente@example.com',
        phone: '81988880000',
        status: UserStatus.ATIVO,
      },
      preferredUnit: { id: 1, name: 'Raízes Recife — Boa Viagem' },
      clientLoyalties: [],
      orders: [],
      _count: { orders: 0, supportTickets: 0 },
    });

    const result = await service.findOne(cliente, 1);

    expect(result.userId).toBe(5);
    expect(result.name).toBe('Cliente');
    expect(result.email).toBe('cliente@example.com');
  });

  it('blocks cliente from accessing another client', async () => {
    prisma.client.findUnique.mockResolvedValue({
      id: 1,
      userId: 99,
      cpf: '12345678901',
      registeredAt: new Date(),
      active: true,
    });

    await expect(service.findOne(cliente, 1)).rejects.toThrow(ForbiddenException);
  });

  it('throws when client not found', async () => {
    prisma.client.findUnique.mockResolvedValue(null);

    await expect(service.findOne(atendente, 1)).rejects.toThrow(NotFoundException);
  });
});
