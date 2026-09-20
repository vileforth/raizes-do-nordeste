import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseJwtStrategy } from './supabase-jwt.strategy';

describe('SupabaseJwtStrategy', () => {
  const originalSecret = process.env.SUPABASE_JWT_SECRET;

  beforeAll(() => {
    process.env.SUPABASE_JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env.SUPABASE_JWT_SECRET = originalSecret;
  });

  const createStrategy = () => {
    const prisma = {
      user: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;

    const strategy = new SupabaseJwtStrategy(prisma);
    return { strategy, prisma };
  };

  it('maps jwt email to usuario and profile roles', async () => {
    const { strategy, prisma } = createStrategy();

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 10,
      name: 'Maria',
      email: 'maria@example.com',
      passwordHash: 'supabase_managed',
      phone: '11999999999',
      status: UserStatus.ATIVO,
      registeredAt: new Date(),
      userProfiles: [
        {
          userId: 10,
          profileId: 1,
          profile: {
            id: 1,
            name: UserRole.CLIENTE,
            description: 'Cliente',
            active: true,
          },
        },
      ],
    });

    const result = await strategy.validate({
      sub: 'uuid-123',
      email: 'maria@example.com',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'maria@example.com' },
      include: {
        userProfiles: {
          include: { profile: true },
        },
      },
    });

    expect(result).toEqual({
      id: 10,
      email: 'maria@example.com',
      name: 'Maria',
      status: UserStatus.ATIVO,
      roles: [UserRole.CLIENTE],
      sub: 'uuid-123',
    });
  });

  it('rejects payload without email', async () => {
    const { strategy } = createStrategy();

    await expect(strategy.validate({ sub: 'uuid-123' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects when usuario is not found', async () => {
    const { strategy, prisma } = createStrategy();

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(
      strategy.validate({ sub: 'uuid-123', email: 'missing@example.com' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
