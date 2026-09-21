import { SupportStatus, SupportType } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { EmailService } from '../email/email.service';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupportService } from './support.service';

describe('SupportService', () => {
  let service: SupportService;
  let prisma: {
    supportTicket: {
      count: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
    supportHistory: { create: jest.Mock };
    client: { findUnique: jest.Mock };
    $transaction: jest.Mock;
  };
  let logger: jest.Mocked<LoggerService>;
  let emailService: jest.Mocked<EmailService>;

  const user = {
    id: 1,
    email: 'client@test.com',
    name: 'Client',
    status: 'ATIVO',
    roles: [UserRole.CLIENTE],
    sub: 'sub',
  };

  beforeEach(() => {
    prisma = {
      supportTicket: {
        count: jest.fn().mockResolvedValue(0),
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: 1,
          protocol: 'ATD-20260101-0001',
          status: SupportStatus.ABERTO,
        }),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      supportHistory: { create: jest.fn() },
      client: {
        findUnique: jest.fn().mockResolvedValue({ id: 10, active: true }),
      },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    emailService = {
      sendEmail: jest.fn(),
    } as unknown as jest.Mocked<EmailService>;

    service = new SupportService(
      prisma as unknown as PrismaService,
      logger,
      emailService,
    );
  });

  it('creates ticket with protocol and sends email', async () => {
    const ticket = await service.create(
      { type: SupportType.SUPORTE, description: 'Help' },
      user,
    );

    expect(ticket.protocol).toMatch(/^ATD-/);
    expect(emailService.sendEmail).toHaveBeenCalled();
    expect(prisma.supportHistory.create).toHaveBeenCalled();
  });

  it('filters tickets by status', async () => {
    prisma.supportTicket.findMany.mockResolvedValue([]);
    prisma.supportTicket.count.mockResolvedValue(0);

    await service.findAll(
      { ...user, roles: [UserRole.ATENDENTE] },
      { status: SupportStatus.ABERTO, page: 1, pageSize: 8 },
    );

    expect(prisma.supportTicket.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: SupportStatus.ABERTO }),
        skip: 0,
        take: 8,
      }),
    );
  });

  it('writes history when status changes', async () => {
    prisma.supportTicket.findUnique.mockResolvedValue({
      id: 1,
      status: SupportStatus.ABERTO,
      responsibleUserId: null,
      histories: [],
    });
    prisma.supportTicket.update.mockResolvedValue({
      id: 1,
      status: SupportStatus.EM_ATENDIMENTO,
    });

    await service.update(
      1,
      { status: SupportStatus.EM_ATENDIMENTO, notes: 'Assigned' },
      { ...user, roles: [UserRole.ATENDENTE] },
    );

    expect(prisma.supportHistory.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: SupportStatus.EM_ATENDIMENTO }) }),
    );
  });
});
