import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { UpdateOrderItemsDto } from './dto/update-order-items.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import {
  canUpdateOrderItems,
  isValidOrderStatusTransition,
} from './order-status.machine';

type ResolvedItem = {
  productId: number;
  quantity: number;
  unitPrice: Prisma.Decimal;
  subtotal: Prisma.Decimal;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateOrderDto, user: AuthenticatedUser) {
    const clientId = await this.resolveClientId(dto.clientId, user);
    const resolvedItems = await this.resolveItems(dto.unitId, dto.items);
    const totalValue = this.calculateTotal(resolvedItems);
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

  async findAll(user: AuthenticatedUser) {
    const where = await this.buildOrderScopeFilter(user);
    return this.prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderAccess(order, user);
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true },
    });
  }

  async findStatusHistory(id: number, user: AuthenticatedUser) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderAccess(order, user);
    return this.prisma.orderStatusHistory.findMany({
      where: { orderId: id },
      orderBy: { occurredAt: 'asc' },
    });
  }

  async updateItems(id: number, dto: UpdateOrderItemsDto, user: AuthenticatedUser) {
    const order = await this.getOrderOrThrow(id);
    this.assertOrderAccess(order, user);

    if (!canUpdateOrderItems(order.status)) {
      throw new ConflictException('Order items can only be updated when status is RECEBIDO');
    }

    const resolvedItems = await this.resolveItems(order.unitId, dto.items);
    const totalValue = this.calculateTotal(resolvedItems);

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
    this.assertStaffUnitAccess(order, user);

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

  private async resolveClientId(
    clientId: number | undefined,
    user: AuthenticatedUser,
  ): Promise<number> {
    if (user.roles.includes(UserRole.CLIENTE)) {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (!client) {
        throw new NotFoundException('Client profile not found');
      }
      return client.id;
    }

    if (!clientId) {
      throw new UnprocessableEntityException('clientId is required');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return clientId;
  }

  private async resolveItems(
    unitId: number,
    items: CreateOrderItemDto[],
  ): Promise<ResolvedItem[]> {
    const stock = await this.prisma.stock.findUnique({
      where: { unitId },
      include: { stockProducts: true },
    });

    if (!stock) {
      throw new NotFoundException('Stock not found for unit');
    }

    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((product) => [product.id, product]));

    return items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product || !product.active) {
        throw new UnprocessableEntityException(
          `Product ${item.productId} is inactive or not found`,
        );
      }

      const stockProduct = stock.stockProducts.find(
        (entry) => entry.productId === item.productId,
      );
      if (!stockProduct || stockProduct.quantity < item.quantity) {
        throw new UnprocessableEntityException(
          `Insufficient stock for product ${item.productId}`,
        );
      }

      const subtotal = product.price.mul(item.quantity);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      };
    });
  }

  private calculateTotal(items: ResolvedItem[]): Prisma.Decimal {
    return items.reduce(
      (total, item) => total.add(item.subtotal),
      new Prisma.Decimal(0),
    );
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

  private async buildOrderScopeFilter(
    user: AuthenticatedUser,
  ): Promise<Prisma.OrderWhereInput> {
    if (user.roles.includes(UserRole.ADMINISTRADOR)) {
      return {};
    }

    if (user.roles.includes(UserRole.CLIENTE)) {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (!client) {
        throw new NotFoundException('Client profile not found');
      }
      return { clientId: client.id };
    }

    const employee = await this.prisma.employee.findUnique({
      where: { userId: user.id },
    });
    if (!employee) {
      throw new ForbiddenException('Employee profile not found');
    }

    return { unitId: employee.unitId };
  }

  private async assertOrderAccess(
    order: { id: number; clientId: number; unitId: number },
    user: AuthenticatedUser,
  ): Promise<void> {
    if (user.roles.includes(UserRole.ADMINISTRADOR)) {
      return;
    }

    if (user.roles.includes(UserRole.CLIENTE)) {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (!client || client.id !== order.clientId) {
        throw new ForbiddenException('Access denied to this order');
      }
      return;
    }

    await this.assertStaffUnitAccess(order, user);
  }

  private async assertStaffUnitAccess(
    order: { unitId: number },
    user: AuthenticatedUser,
  ): Promise<void> {
    if (user.roles.includes(UserRole.ADMINISTRADOR)) {
      return;
    }

    const staffRoles = [
      UserRole.ATENDENTE,
      UserRole.COZINHEIRO,
      UserRole.GERENTE,
    ];
    if (!staffRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { userId: user.id },
    });
    if (!employee || employee.unitId !== order.unitId) {
      throw new ForbiddenException('Access denied to this unit');
    }
  }
}
