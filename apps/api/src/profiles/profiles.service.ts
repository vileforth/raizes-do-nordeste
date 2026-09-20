import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(): Promise<ProfileResponseDto[]> {
    const profiles = await this.prisma.profile.findMany({
      orderBy: { id: 'asc' },
    });

    this.logger.info('Profiles listed', { count: profiles.length });

    return profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      description: profile.description,
      active: profile.active,
    }));
  }
}
