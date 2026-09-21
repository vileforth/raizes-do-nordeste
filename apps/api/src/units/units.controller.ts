import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { PaginationQueryDto } from '../common/pagination/pagination.query';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitResponseDto } from './dto/unit-response.dto';
import { UnitsService } from './units.service';

@ApiTags('units')
@ApiBearerAuth()
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'List units' })
  @ApiResponse({ status: 200 })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.unitsService.findAll(user, query);
  }

  @Get(':id')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Get unit by id' })
  @ApiResponse({ status: 200, type: UnitResponseDto })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UnitResponseDto> {
    return this.unitsService.findOne(user, id);
  }

  @Post()
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Create unit' })
  @ApiResponse({ status: 201, type: UnitResponseDto })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateUnitDto,
  ): Promise<UnitResponseDto> {
    return this.unitsService.create(user, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Delete unit' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.unitsService.remove(user, id);
  }

  @Put(':id')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Update unit' })
  @ApiResponse({ status: 200, type: UnitResponseDto })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnitDto,
  ): Promise<UnitResponseDto> {
    return this.unitsService.update(user, id, dto);
  }
}
