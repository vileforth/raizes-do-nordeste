import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@raizes/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersQueryDto } from './dto/list-orders.query';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201 })
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.create(dto, user);
  }

  @Get()
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.COZINHEIRO,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'List orders scoped by role' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListOrdersQueryDto,
  ) {
    return this.ordersService.findAll(user, query);
  }

  @Get(':id')
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.COZINHEIRO,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Get order by id' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.findOne(id, user);
  }

  @Get(':id/status')
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.COZINHEIRO,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Get order status history' })
  findStatusHistory(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.findStatusHistory(id, user);
  }

  @Put(':id')
  @Roles(
    UserRole.CLIENTE,
    UserRole.ATENDENTE,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Update order items when status is RECEBIDO' })
  updateItems(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderItemsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.updateItems(id, dto, user);
  }

  @Delete(':id')
  @Roles(UserRole.GERENTE, UserRole.ADMINISTRADOR)
  @ApiOperation({ summary: 'Delete order' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.remove(id, user);
  }

  @Put(':id/status')
  @Roles(
    UserRole.ATENDENTE,
    UserRole.COZINHEIRO,
    UserRole.GERENTE,
    UserRole.ADMINISTRADOR,
  )
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.ordersService.updateStatus(id, dto, user);
  }
}
