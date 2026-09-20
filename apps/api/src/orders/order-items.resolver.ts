import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order.dto';

export type ResolvedOrderItem = {
  productId: number;
  quantity: number;
  unitPrice: Prisma.Decimal;
  subtotal: Prisma.Decimal;
};

export async function resolveOrderItems(
  prisma: PrismaService,
  unitId: number,
  items: CreateOrderItemDto[],
): Promise<ResolvedOrderItem[]> {
  const stock = await prisma.stock.findUnique({
    where: { unitId },
    include: { stockProducts: true },
  });

  if (!stock) {
    throw new NotFoundException('Stock not found for unit');
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
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

export function calculateOrderTotal(
  items: ResolvedOrderItem[],
): Prisma.Decimal {
  return items.reduce(
    (total, item) => total.add(item.subtotal),
    new Prisma.Decimal(0),
  );
}
