import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from './profiles.service';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let prisma: { profile: { findMany: jest.Mock } };
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    prisma = { profile: { findMany: jest.fn() } };
    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    service = new ProfilesService(
      prisma as unknown as PrismaService,
      logger,
    );
  });

  it('returns all profiles', async () => {
    prisma.profile.findMany.mockResolvedValue([
      { id: 1, name: 'CLIENTE', description: 'Client', active: true },
    ]);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(logger.info).toHaveBeenCalledWith('Profiles listed', { count: 1 });
  });
});
