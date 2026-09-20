import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
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
  @ApiResponse({ status: 200, type: [UnitResponseDto] })
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<UnitResponseDto[]> {
    return this.unitsService.findAll(user);
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
