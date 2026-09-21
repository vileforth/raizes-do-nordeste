import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { UnitStatus, UserStatus } from '@prisma/client';
import { GeoService } from '../geo/geo.service';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnitsService } from './units.service';
import { AuthenticatedUser } from '../auth/types/auth-user.types';

describe('UnitsService', () => {
  let service: UnitsService;
  let prisma: {
    unit: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    employee: { findUnique: jest.Mock };
    stock: { create: jest.Mock };
  };
  let geoService: jest.Mocked<GeoService>;
  let logger: jest.Mocked<LoggerService>;

  const admin: AuthenticatedUser = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin',
    status: UserStatus.ATIVO,
    roles: [UserRole.ADMINISTRADOR],
    sub: 'sub-1',
  };

  beforeEach(() => {
    prisma = {
      unit: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      employee: { findUnique: jest.fn() },
      stock: { create: jest.fn() },
    };

    geoService = {
      geocodeAddress: jest.fn(),
    } as unknown as jest.Mocked<GeoService>;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new UnitsService(
      prisma as unknown as PrismaService,
      geoService,
      logger,
    );
  });

  it('creates unit with geocoded coordinates', async () => {
    geoService.geocodeAddress.mockResolvedValue({
      latitude: -8.0476,
      longitude: -34.877,
    });
    prisma.unit.create.mockResolvedValue({
      id: 1,
      name: 'Unit',
      address: 'Recife',
      phone: '81999999999',
      status: UnitStatus.ATIVA,
      registeredAt: new Date(),
      latitude: -8.0476,
      longitude: -34.877,
    });
    prisma.stock.create.mockResolvedValue({ id: 1 });

    const result = await service.create(admin, {
      name: 'Unit',
      address: 'Recife',
      phone: '81999999999',
      status: UnitStatus.ATIVA,
    });

    expect(result.latitude).toBe(-8.0476);
    expect(prisma.stock.create).toHaveBeenCalled();
  });

  it('blocks manager from accessing another unit', async () => {
    prisma.unit.findUnique.mockResolvedValue({
      id: 9,
      name: 'Other',
      address: 'A',
      phone: '1',
      status: UnitStatus.ATIVA,
      registeredAt: new Date(),
      latitude: null,
      longitude: null,
    });
    prisma.employee.findUnique.mockResolvedValue({ unitId: 3, active: true });

    await expect(
      service.findOne(
        {
          id: 2,
          email: 'manager@example.com',
          name: 'Manager',
          status: UserStatus.ATIVO,
          roles: [UserRole.GERENTE],
          sub: 'sub-2',
        },
        9,
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});
