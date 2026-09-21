import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { PaginationQueryDto } from '../common/pagination/pagination.query';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { EmployeesService } from './employees.service';

@ApiTags('employees')
@ApiBearerAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'List employees' })
  @ApiResponse({ status: 200 })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.employeesService.findAll(user, query);
  }

  @Get(':id')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Get employee by id' })
  @ApiResponse({ status: 200, type: EmployeeResponseDto })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.findOne(user, id);
  }

  @Post()
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Create employee' })
  @ApiResponse({ status: 201, type: EmployeeResponseDto })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.create(user, dto);
  }

  @Delete(':id')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Delete employee' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.employeesService.remove(user, id);
  }

  @Put(':id')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Update employee' })
  @ApiResponse({ status: 200, type: EmployeeResponseDto })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.update(user, id, dto);
  }
}
