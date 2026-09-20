import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

const VALID_PAYMENT_METHODS = new Set<PaymentMethod>([
  PaymentMethod.CARTAO_DEBITO,
  PaymentMethod.CARTAO_CREDITO,
  PaymentMethod.PIX,
]);

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreatePaymentDto) {
    if (!VALID_PAYMENT_METHODS.has(dto.method)) {
      throw new BadRequestException('Invalid payment method');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment) {
      throw new ConflictException('Payment already exists for this order');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        method: dto.method,
        value: order.totalValue,
        status: PaymentStatus.PENDENTE,
        transactionCode: await this.generateTransactionCode(),
      },
    });

    this.logger.info('Payment created', {
      paymentId: payment.id,
      orderId: order.id,
      status: payment.status,
    });

    return payment;
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async confirm(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDENTE) {
      throw new ConflictException('Only pending payments can be confirmed');
    }

    this.assertPaymentValueMatchesOrder(payment.value, payment.order.totalValue);

    const confirmed = await this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.CONFIRMADO,
        paidAt: new Date(),
        transactionCode: await this.generateTransactionCode(),
      },
    });

    this.logger.info('Payment confirmed', {
      paymentId: confirmed.id,
      transactionCode: confirmed.transactionCode,
    });

    return confirmed;
  }

  assertPaymentValueMatchesOrder(
    paymentValue: Prisma.Decimal,
    orderTotal: Prisma.Decimal,
  ): void {
    if (!paymentValue.equals(orderTotal)) {
      throw new BadRequestException('Payment value does not match order total');
    }
  }

  private async generateTransactionCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const transactionCode = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      const existing = await this.prisma.payment.findUnique({
        where: { transactionCode },
      });
      if (!existing) {
        return transactionCode;
      }
    }
    throw new ConflictException('Unable to generate unique transaction code');
  }
}
