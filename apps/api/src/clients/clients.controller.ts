import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { ClientsService } from './clients.service';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Roles(
    UserRole.ATENDENTE,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'List clients' })
  @ApiResponse({ status: 200, type: [ClientResponseDto] })
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<ClientResponseDto[]> {
    return this.clientsService.findAll(user);
  }

  @Get(':id')
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Get client by id' })
  @ApiResponse({ status: 200, type: ClientResponseDto })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClientResponseDto> {
    return this.clientsService.findOne(user, id);
  }

  @Post()
  @Roles(UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Create client' })
  @ApiResponse({ status: 201, type: ClientResponseDto })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateClientDto,
  ): Promise<ClientResponseDto> {
    return this.clientsService.create(user, dto);
  }

  @Put(':id')
  @Roles(UserRole.CLIENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: 200, type: ClientResponseDto })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    return this.clientsService.update(user, id, dto);
  }
}
