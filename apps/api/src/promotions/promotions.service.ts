import { Injectable, NotFoundException } from '@nestjs/common';
import { Promotion, PromotionStatus, Prisma } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { resolveEmployeeUnitId } from '../common/helpers/employee-scope.helper';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import {
  buildPaginated,
  normalizePagination,
  resolveOrderBy,
  searchContains,
  type Paginated,
  type PaginationInput,
} from '../common/pagination/pagination';
import { deletePromotionGraph } from '../common/cascade-delete';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async findAll(
    user: AuthenticatedUser,
    query: PaginationInput = {},
  ): Promise<Paginated<Promotion>> {
    const { page, pageSize, skip, take, search } = normalizePagination(query);
    const searchWhere = searchContains(['name', 'description'], search);
    const scope = await this.buildListScope(user);
    const where = { ...scope, ...(searchWhere ?? {}) };
    const orderBy = resolveOrderBy(query.orderBy, ['id', 'name', 'startDate'], {
      startDate: 'desc',
    });
    const [promotions, total] = await Promise.all([
      this.prisma.promotion.findMany({ where, orderBy, skip, take }),
      this.prisma.promotion.count({ where }),
    ]);
    return buildPaginated(promotions, page, pageSize, total);
  }

  private async buildListScope(user: AuthenticatedUser): Promise<Prisma.PromotionWhereInput> {
    if (user.roles.includes(UserRole.ADMINISTRADOR)) {
      return {};
    }
    if (user.roles.includes(UserRole.GERENTE)) {
      const unitId = await resolveEmployeeUnitId(this.prisma, user.id);
      return { promotionUnits: { some: { unitId } } };
    }
    return this.activePromotionFilter();
  }

  async findOne(id: number, user: AuthenticatedUser): Promise<Promotion> {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    if (user.roles.includes(UserRole.ADMINISTRADOR)) {
      return promotion;
    }

    if (user.roles.includes(UserRole.GERENTE)) {
      const unitId = await resolveEmployeeUnitId(this.prisma, user.id);
      const linked = await this.prisma.promotionUnit.findFirst({
        where: { promotionId: id, unitId },
      });
      if (!linked) {
        throw new NotFoundException('Promotion not found for unit');
      }
      return promotion;
    }

    if (!this.isPromotionActive(promotion)) {
      throw new NotFoundException('Promotion not found');
    }

    return promotion;
  }

  async create(dto: CreatePromotionDto): Promise<Promotion> {
    const promotion = await this.prisma.promotion.create({
      data: {
        name: dto.name,
        description: dto.description,
        rule: dto.rule,
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: dto.status ?? PromotionStatus.AGENDADA,
      },
    });
    this.logger.info('Promotion created', { promotionId: promotion.id });
    return promotion;
  }

  async update(id: number, dto: UpdatePromotionDto): Promise<Promotion> {
    await this.ensureExists(id);
    const promotion = await this.prisma.promotion.update({
      where: { id },
      data: dto,
    });
    this.logger.info('Promotion updated', { promotionId: id });
    return promotion;
  }

  async activate(id: number): Promise<Promotion> {
    await this.ensureExists(id);
    const promotion = await this.prisma.promotion.update({
      where: { id },
      data: { status: PromotionStatus.ATIVA },
    });
    this.logger.info('Promotion activated', { promotionId: id });
    return promotion;
  }

  async associateUnits(promotionId: number, unitIds: number[]): Promise<void> {
    await this.ensureExists(promotionId);
    await this.prisma.promotionUnit.createMany({
      data: unitIds.map((unitId) => ({ promotionId, unitId })),
      skipDuplicates: true,
    });
    this.logger.info('Promotion units associated', { promotionId, unitIds });
  }

  async associateProducts(
    promotionId: number,
    productIds: number[],
  ): Promise<void> {
    await this.ensureExists(promotionId);
    await this.prisma.promotionProduct.createMany({
      data: productIds.map((productId) => ({ promotionId, productId })),
      skipDuplicates: true,
    });
    this.logger.info('Promotion products associated', {
      promotionId,
      productIds,
    });
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.$transaction((tx) => deletePromotionGraph(tx, id));
    this.logger.info('Promotion removed', { promotionId: id });
  }

  private activePromotionFilter(): Prisma.PromotionWhereInput {
    const now = new Date();
    return {
      status: PromotionStatus.ATIVA,
      startDate: { lte: now },
      endDate: { gte: now },
    };
  }

  private isPromotionActive(promotion: Promotion): boolean {
    const now = new Date();
    return (
      promotion.status === PromotionStatus.ATIVA &&
      promotion.startDate <= now &&
      promotion.endDate >= now
    );
  }

  private async ensureExists(id: number): Promise<void> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
  }
}
