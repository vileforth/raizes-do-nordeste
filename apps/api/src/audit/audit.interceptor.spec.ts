import { AuditAction } from '@prisma/client';
import { of } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditInterceptor } from './audit.interceptor';

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;
  let prisma: { auditLog: { create: jest.Mock } };
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    prisma = { auditLog: { create: jest.fn().mockResolvedValue({ id: 1 }) } };
    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    interceptor = new AuditInterceptor(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('skips GET requests', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET', url: '/promotions' }),
      }),
    };

    await interceptor
      .intercept(context as never, { handle: () => of({}) })
      .toPromise();

    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('writes audit log for POST requests', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          url: '/promotions',
          user: { id: 9 },
        }),
      }),
    };

    await interceptor
      .intercept(context as never, {
        handle: () => of({ id: 3 }),
      })
      .toPromise();

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: 9,
        action: AuditAction.CRIAR,
        entity: 'Promotions',
        entityId: 3,
        details: '/promotions',
      },
    });
  });

  it('maps PUT to ALTERAR', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'PUT',
          url: '/support/5',
          user: { id: 2 },
        }),
      }),
    };

    await interceptor
      .intercept(context as never, { handle: () => of({ id: 5 }) })
      .toPromise();

    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: AuditAction.ALTERAR,
          entityId: 5,
        }),
      }),
    );
  });
});
