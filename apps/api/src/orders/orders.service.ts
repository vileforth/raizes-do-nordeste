import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildPaginated,
  normalizePagination,
  resolveOrderBy,
  searchContains,
} from '../common/pagination/pagination';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersQueryDto } from './dto/list-orders.query';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import {
  assertOrderAccess,
  assertStaffUnitAccess,
  buildOrderScopeFilter,
  resolveClientId,
} from './order-access.helper';
import {
  calculateOrderTotal,
  resolveOrderItems,
} from './order-items.resolver';
import { deleteOrdersByIds } from '../common/cascade-delete';
import {
  canUpdateOrderItems,
  isValidOrderStatusTransition,
} from './order-status.machine';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateOrderDto, user: AuthenticatedUser) {
    const clientId = await resolveClientId(this.prisma, dto.clientId, user);
    const resolvedItems = await resolveOrderItems(
      this.prisma,
      dto.unitId,
      dto.items,
    );
    const totalValue = calculateOrderTotal(resolvedItems);
    const orderCode = await this.generateOrderCode();

    const order = await this.prisma.order.create({
      data: {
        clientId,
        unitId: dto.unitId,
        status: OrderStatus.RECEBIDO,
        consumptionType: dto.consumptionType,
        totalValue,
        orderCode,
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
        statusHistories: {
          create: {
            status: OrderStatus.RECEBIDO,
            userId: user.id,
          },
        },
      },
      include: { items: true },
    });

    this.logger.info('Order created', {
      orderId: order.id,
      orderCode: order.orderCode,
      userId: user.id,
    });

    return order;
  }

  async findAll(user: AuthenticatedUser, query: ListOrdersQueryDto = {}) {
    const { page, pageSize, skip, take, search } = normalizePagination(query);
    const scope = await buildOrderScopeFilter(this.prisma, user);
    const searchWhere = searchContains(['orderCode'], search);
    const statusWhere = query.status
      ? { status: query.status as OrderStatus }
      : {};
    const where = {
      ...scope,
      ...statusWhere,
      ...(searchWhere ?? {}),
    };
    const orderBy = resolveOrderBy(
      query.orderBy,
      ['createdAt', 'orderCode', 'totalValue'],
      { createdAt: 'desc' },
    );
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { items: true },
        orderBy,
        skip,
        take,
      }),
      this.prisma.order.count({ where }),
    ]);
    return buildPaginated(orders, page, pageSize, total);
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const order = await this.getOrderOrThrow(id);
    await assertOrderAccess(this.prisma, order, user);
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
  }

  async findStatusHistory(id: number, user: AuthenticatedUser) {
    const order = await this.getOrderOrThrow(id);
    await assertOrderAccess(this.prisma, order, user);
    return this.prisma.orderStatusHistory.findMany({
      where: { orderId: id },
      orderBy: { occurredAt: 'asc' },
    });
  }

  async updateItems(id: number, dto: UpdateOrderItemsDto, user: AuthenticatedUser) {
    const order = await this.getOrderOrThrow(id);
    await assertOrderAccess(this.prisma, order, user);

    if (!canUpdateOrderItems(order.status)) {
      throw new ConflictException('Order items can only be updated when status is RECEBIDO');
    }

    const resolvedItems = await resolveOrderItems(
      this.prisma,
      order.unitId,
      dto.items,
    );
    const totalValue = calculateOrderTotal(resolvedItems);

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      return tx.order.update({
        where: { id },
        data: {
          totalValue,
          items: {
            create: resolvedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            })),
          },
        },
        include: { items: true },
      });
    });

    this.logger.info('Order items updated', { orderId: id, userId: user.id });
    return updated;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto, user: AuthenticatedUser) {
    const order = await this.getOrderOrThrow(id);
    await assertStaffUnitAccess(this.prisma, order, user);

    if (!isValidOrderStatusTransition(order.status, dto.status)) {
      throw new ConflictException('Invalid order status transition');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        statusHistories: {
          create: {
            status: dto.status,
            userId: user.id,
          },
        },
      },
      include: { items: true },
    });

    this.logger.info('Order status updated', {
      orderId: id,
      status: dto.status,
      userId: user.id,
    });

    return updated;
  }

  async remove(id: number, user: AuthenticatedUser) {
    const order = await this.getOrderOrThrow(id);
    await assertStaffUnitAccess(this.prisma, order, user);
    await this.prisma.$transaction((tx) => deleteOrdersByIds(tx, [id]));
    this.logger.info('Order removed', { orderId: id, userId: user.id });
  }

  private async generateOrderCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const existing = await this.prisma.order.findUnique({
        where: { orderCode },
      });
      if (!existing) {
        return orderCode;
      }
    }
    throw new ConflictException('Unable to generate unique order code');
  }

  private async getOrderOrThrow(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
