import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coupon, PromotionStatus } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  findAll(): Promise<Coupon[]> {
    return this.prisma.coupon.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async create(dto: CreateCouponDto): Promise<Coupon> {
    await this.ensurePromotionExists(dto.promotionId);
    const coupon = await this.prisma.coupon.create({ data: dto });
    this.logger.info('Coupon created', { couponId: coupon.id });
    return coupon;
  }

  async update(id: number, dto: UpdateCouponDto): Promise<Coupon> {
    await this.findOne(id);
    if (dto.promotionId) {
      await this.ensurePromotionExists(dto.promotionId);
    }
    const coupon = await this.prisma.coupon.update({ where: { id }, data: dto });
    this.logger.info('Coupon updated', { couponId: id });
    return coupon;
  }

  async remove(id: number): Promise<Coupon> {
    await this.findOne(id);
    const coupon = await this.prisma.coupon.delete({ where: { id } });
    this.logger.info('Coupon removed', { couponId: id });
    return coupon;
  }

  async validate(dto: ValidateCouponDto): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: dto.code },
      include: {
        promotion: {
          include: { promotionUnits: true },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (!coupon.active) {
      throw new BadRequestException('Coupon is inactive');
    }

    if (coupon.expiry < new Date()) {
      throw new BadRequestException('Coupon expired');
    }

    const promotion = coupon.promotion;
    const now = new Date();
    if (
      promotion.status !== PromotionStatus.ATIVA ||
      promotion.startDate > now ||
      promotion.endDate < now
    ) {
      throw new BadRequestException('Promotion is not active');
    }

    if (dto.unitId) {
      const linked = promotion.promotionUnits.some(
        (unit) => unit.unitId === dto.unitId,
      );
      if (!linked) {
        throw new BadRequestException('Coupon not valid for this unit');
      }
    }

    this.logger.info('Coupon validated', { code: dto.code });
    return coupon;
  }

  private async ensurePromotionExists(promotionId: number): Promise<void> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
      select: { id: true },
    });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
  }
}
