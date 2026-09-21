import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { PaginationQueryDto } from '../common/pagination/pagination.query';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { SupportService } from './support.service';

@ApiTags('support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  @Roles(UserRole.CLIENTE, UserRole.ATENDENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Create support ticket' })
  create(
    @Body() dto: CreateSupportDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.supportService.create(dto, user);
  }

  @Get()
  @Roles(
    UserRole.ADMINISTRADOR,
    UserRole.GERENTE,
    UserRole.ATENDENTE,
    UserRole.CLIENTE,
  )
  @ApiOperation({ summary: 'List support tickets' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.supportService.findAll(user, query);
  }

  @Get(':id')
  @Roles(
    UserRole.ADMINISTRADOR,
    UserRole.GERENTE,
    UserRole.ATENDENTE,
    UserRole.CLIENTE,
  )
  @ApiOperation({ summary: 'Get support ticket by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.supportService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMINISTRADOR, UserRole.ATENDENTE, UserRole.GERENTE)
  @ApiOperation({ summary: 'Update support ticket' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupportDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.supportService.update(id, dto, user);
  }
}
