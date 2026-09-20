import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { resolveEmployeeUnitId } from '../common/helpers/employee-scope.helper';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsQueryDto } from './dto/reports-query.dto';

export type ReportType = 'orders' | 'stock' | 'promotions' | 'loyalty';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getIndicators(
    query: ReportsQueryDto,
    user: AuthenticatedUser,
  ): Promise<Record<string, number>> {
    const unitId = await this.resolveUnitScope(query.unitId, user);
    const range = this.buildDateRange(query);

    const orderWhere: Prisma.OrderWhereInput = {
      createdAt: range,
      ...(unitId ? { unitId } : {}),
    };

    const [orderCount, revenue, promotionCount, loyaltyCount] =
      await Promise.all([
        this.prisma.order.count({ where: orderWhere }),
        this.prisma.order.aggregate({
          where: orderWhere,
          _sum: { totalValue: true },
        }),
        this.prisma.promotion.count({
          where: unitId
            ? { promotionUnits: { some: { unitId } } }
            : undefined,
        }),
        this.prisma.clientLoyalty.count({
          where: unitId
            ? {
                client: {
                  orders: { some: { unitId, createdAt: range } },
                },
              }
            : undefined,
        }),
      ]);

    this.logger.info('Indicators report generated', { unitId, userId: user.id });

    return {
      orders: orderCount,
      revenue: Number(revenue._sum.totalValue ?? 0),
      promotions: promotionCount,
      loyaltyMembers: loyaltyCount,
    };
  }

  async getReportByType(
    type: string,
    query: ReportsQueryDto,
    user: AuthenticatedUser,
  ): Promise<unknown> {
    const reportType = this.parseReportType(type);
    const unitId = await this.resolveUnitScope(query.unitId, user);
    const range = this.buildDateRange(query);

    switch (reportType) {
      case 'orders':
        return this.prisma.order.findMany({
          where: {
            createdAt: range,
            ...(unitId ? { unitId } : {}),
          },
          include: { items: true, payment: true },
          orderBy: { createdAt: 'desc' },
        });
      case 'stock':
        return this.prisma.stockProduct.findMany({
          where: unitId
            ? { stock: { unitId } }
            : undefined,
          include: { product: true, stock: { include: { unit: true } } },
        });
      case 'promotions':
        return this.prisma.promotion.findMany({
          where: unitId
            ? { promotionUnits: { some: { unitId } } }
            : undefined,
          include: { coupons: true, promotionUnits: true },
          orderBy: { startDate: 'desc' },
        });
      case 'loyalty':
        return this.prisma.clientLoyalty.findMany({
          where: unitId
            ? {
                client: {
                  orders: { some: { unitId, createdAt: range } },
                },
              }
            : undefined,
          include: { client: true, pointMovements: true },
        });
      default:
        throw new BadRequestException('Invalid report type');
    }
  }

  private parseReportType(type: string): ReportType {
    const allowed: ReportType[] = ['orders', 'stock', 'promotions', 'loyalty'];
    if (!allowed.includes(type as ReportType)) {
      throw new BadRequestException('Invalid report type');
    }
    return type as ReportType;
  }

  private async resolveUnitScope(
    requestedUnitId: number | undefined,
    user: AuthenticatedUser,
  ): Promise<number | undefined> {
    if (user.roles.includes(UserRole.ADMINISTRADOR)) {
      return requestedUnitId;
    }

    if (user.roles.includes(UserRole.GERENTE)) {
      const managerUnitId = await resolveEmployeeUnitId(this.prisma, user.id);
      if (requestedUnitId && requestedUnitId !== managerUnitId) {
        throw new BadRequestException('Manager can only access own unit');
      }
      return managerUnitId;
    }

    throw new BadRequestException('Insufficient permissions for reports');
  }

  private buildDateRange(
    query: ReportsQueryDto,
  ): Prisma.DateTimeFilter | undefined {
    if (!query.from && !query.to) {
      return undefined;
    }
    return {
      ...(query.from ? { gte: query.from } : {}),
      ...(query.to ? { lte: query.to } : {}),
    };
  }
}
