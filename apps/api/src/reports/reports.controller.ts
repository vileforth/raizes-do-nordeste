import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { ReportsQueryDto } from './dto/reports-query.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
@Roles(UserRole.ADMINISTRADOR, UserRole.GERENTE)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('indicators')
  @ApiOperation({ summary: 'Get KPI indicators' })
  getIndicators(
    @Query() query: ReportsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reportsService.getIndicators(query, user);
  }

  @Get(':type')
  @ApiOperation({ summary: 'Get report by type' })
  getByType(
    @Param('type') type: string,
    @Query() query: ReportsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reportsService.getReportByType(type, query, user);
  }
}
