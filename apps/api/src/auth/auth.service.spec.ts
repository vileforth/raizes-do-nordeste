import { ConflictException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { SupabaseAuthClient } from './supabase/supabase-auth.client';

describe('AuthService', () => {
  let service: AuthService;
  let supabaseAuth: jest.Mocked<SupabaseAuthClient>;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
    profile: {
      findUnique: jest.Mock;
    };
  };
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    supabaseAuth = {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      recoverPassword: jest.fn(),
    } as unknown as jest.Mocked<SupabaseAuthClient>;

    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      profile: {
        findUnique: jest.fn(),
      },
    };

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new AuthService(
      supabaseAuth,
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('logs login via LoggerService', async () => {
    supabaseAuth.signInWithPassword.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 3600,
      tokenType: 'bearer',
    });
    prisma.user.findUnique.mockResolvedValue({ id: 7 });

    const result = await service.login({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(result.accessToken).toBe('access');
    expect(logger.info).toHaveBeenCalledWith('User login', {
      email: 'user@example.com',
      userId: 7,
    });
  });

  it('persists usuario on register and returns tokens', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    supabaseAuth.signUp.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 3600,
      tokenType: 'bearer',
    });
    prisma.profile.findUnique.mockResolvedValue({ id: 1, name: UserRole.CLIENTE });
    prisma.user.create.mockResolvedValue({ id: 42 });

    const result = await service.register({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'password123',
      phone: '11999999999',
    });

    expect(prisma.user.create).toHaveBeenCalled();
    expect(result.userId).toBe(42);
    expect(logger.info).toHaveBeenCalledWith('User registered', {
      email: 'maria@example.com',
      userId: 42,
    });
  });

  it('rejects duplicate email on register', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'maria@example.com',
      name: 'Maria',
      passwordHash: 'supabase_managed',
      phone: '11999999999',
      status: UserStatus.ATIVO,
      registeredAt: new Date(),
    });

    await expect(
      service.register({
        name: 'Maria',
        email: 'maria@example.com',
        password: 'password123',
        phone: '11999999999',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
