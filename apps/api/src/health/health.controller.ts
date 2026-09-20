import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Public health check' })
  async check() {
    await this.prismaService.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'connected' };
  }
}
