import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Benefit,
  BenefitRedemption,
  ClientLoyalty,
  LoyaltyProgram,
  PointMovement,
} from '@prisma/client';
import { PointMovementType } from '@prisma/client';
import { randomBytes } from 'crypto';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { resolveLoyaltyLevel } from './loyalty-level';

@Injectable()
export class LoyaltyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async getProgram(): Promise<LoyaltyProgram | null> {
    return this.prisma.loyaltyProgram.findFirst({
      where: { status: 'ATIVO' },
      orderBy: { id: 'asc' },
    });
  }

  async getClientLoyalty(clientId: number): Promise<ClientLoyalty> {
    const loyalty = await this.prisma.clientLoyalty.findFirst({
      where: { clientId },
      include: { program: true },
      orderBy: { joinedAt: 'desc' },
    });
    if (!loyalty) {
      throw new NotFoundException('Client loyalty not found');
    }
    return loyalty;
  }

  async getClientPoints(clientId: number): Promise<PointMovement[]> {
    const loyalty = await this.getClientLoyalty(clientId);
    return this.prisma.pointMovement.findMany({
      where: { clientLoyaltyId: loyalty.id },
      orderBy: { occurredAt: 'desc' },
    });
  }

  getBenefits(): Promise<Benefit[]> {
    const now = new Date();
    return this.prisma.benefit.findMany({
      where: { active: true, expiry: { gte: now } },
      orderBy: { requiredPoints: 'asc' },
    });
  }

  async redeemBenefit(
    benefitId: number,
    clientId: number,
  ): Promise<BenefitRedemption> {
    const benefit = await this.prisma.benefit.findUnique({
      where: { id: benefitId },
    });
    if (!benefit || !benefit.active) {
      throw new NotFoundException('Benefit not found');
    }
    if (benefit.expiry < new Date()) {
      throw new BadRequestException('Benefit expired');
    }

    const loyalty = await this.getClientLoyalty(clientId);
    if (loyalty.pointsBalance < benefit.requiredPoints) {
      throw new BadRequestException('Insufficient points');
    }

    const newBalance = loyalty.pointsBalance - benefit.requiredPoints;
    const redemptionCode = this.generateRedemptionCode();

    const redemption = await this.prisma.$transaction(async (tx) => {
      await tx.clientLoyalty.update({
        where: { id: loyalty.id },
        data: {
          pointsBalance: newBalance,
          level: resolveLoyaltyLevel(newBalance),
        },
      });

      await tx.pointMovement.create({
        data: {
          clientLoyaltyId: loyalty.id,
          type: PointMovementType.DEBITO,
          points: benefit.requiredPoints,
          origin: 'BENEFIT_REDEMPTION',
          notes: `Benefit ${benefitId}`,
        },
      });

      return tx.benefitRedemption.create({
        data: {
          clientLoyaltyId: loyalty.id,
          benefitId,
          status: 'RESGATADO',
          redemptionCode,
        },
      });
    });

    this.logger.info('Benefit redeemed', {
      benefitId,
      clientId,
      redemptionCode,
    });
    return redemption;
  }

  private generateRedemptionCode(): string {
    return `RDM-${randomBytes(4).toString('hex').toUpperCase()}`;
  }
}
