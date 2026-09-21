import { Prisma } from '@prisma/client';
import { SEED_COUNTS } from '../counts';
import { SEED_PRODUCTS } from '../data/products';
import { SEED_PROMOTIONS, SEED_BENEFITS } from '../data/promotions';
import { SEED_UNITS } from '../data/units';
import { createSeedFaker, money } from '../helpers';

export function buildProducts(): Prisma.ProductCreateManyInput[] {
  return SEED_PRODUCTS.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: money(product.price),
    category: product.category,
    active: product.active,
  }));
}

export function buildStocks(): Prisma.StockCreateManyInput[] {
  return SEED_UNITS.map((unit) => ({
    id: unit.id,
    unitId: unit.id,
    status: 'ATIVO',
  }));
}

export function buildStockProducts(): Prisma.StockProductCreateManyInput[] {
  const faker = createSeedFaker();
  const rows: Prisma.StockProductCreateManyInput[] = [];
  let id = 1;
  for (const unit of SEED_UNITS) {
    for (const product of SEED_PRODUCTS) {
      const isDrink = product.category === 'Bebida';
      const isCombo = product.category === 'Combo';
      rows.push({
        id,
        stockId: unit.id,
        productId: product.id,
        quantity: faker.number.int({
          min: isDrink ? 80 : isCombo ? 20 : 35,
          max: isDrink ? 160 : isCombo ? 55 : 95,
        }),
        minimumStock: isDrink ? 20 : 12,
      });
      id += 1;
    }
  }
  return rows;
}

export function buildPromotions(): Prisma.PromotionCreateManyInput[] {
  return SEED_PROMOTIONS.map((promotion) => ({
    id: promotion.id,
    name: promotion.name,
    description: promotion.description,
    rule: promotion.rule,
    startDate: promotion.startDate,
    endDate: promotion.endDate,
    status: promotion.status,
  }));
}

export function buildCoupons(): Prisma.CouponCreateManyInput[] {
  return SEED_PROMOTIONS.map((promotion) => ({
    id: promotion.id,
    promotionId: promotion.id,
    code: promotion.couponCode,
    expiry: promotion.endDate,
    usageLimit: promotion.usageLimit,
    active: promotion.status === 'ATIVA' || promotion.status === 'AGENDADA',
  }));
}

export function buildPromotionLinks() {
  const promotionUnits: Prisma.PromotionUnitCreateManyInput[] = [];
  const promotionProducts: Prisma.PromotionProductCreateManyInput[] = [];
  for (const promotion of SEED_PROMOTIONS) {
    for (const unitId of promotion.unitIds) {
      promotionUnits.push({ promotionId: promotion.id, unitId });
    }
    for (const productId of promotion.productIds) {
      promotionProducts.push({ promotionId: promotion.id, productId });
    }
  }

  const extraProducts = [7, 8, 11, 12, 13, 20, 21, 23, 28, 31, 33, 35, 37, 38, 42];
  let extraIndex = 0;
  while (promotionProducts.length < SEED_COUNTS.promotionProducts) {
    const promotion = SEED_PROMOTIONS[extraIndex % SEED_PROMOTIONS.length];
    const productId = extraProducts[extraIndex % extraProducts.length];
    const exists = promotionProducts.some(
      (row) => row.promotionId === promotion.id && row.productId === productId,
    );
    if (!exists) {
      promotionProducts.push({ promotionId: promotion.id, productId });
    }
    extraIndex += 1;
    if (extraIndex > 200) break;
  }

  while (promotionUnits.length > SEED_COUNTS.promotionUnits) {
    promotionUnits.pop();
  }
  while (promotionUnits.length < SEED_COUNTS.promotionUnits) {
    const unitId = (promotionUnits.length % SEED_UNITS.length) + 1;
    const promotionId = (promotionUnits.length % SEED_PROMOTIONS.length) + 1;
    if (!promotionUnits.some((row) => row.promotionId === promotionId && row.unitId === unitId)) {
      promotionUnits.push({ promotionId, unitId });
    } else {
      break;
    }
  }

  return { promotionUnits, promotionProducts };
}

export function buildBenefits(): Prisma.BenefitCreateManyInput[] {
  return SEED_BENEFITS.map((benefit) => ({
    id: benefit.id,
    name: benefit.name,
    description: benefit.description,
    requiredPoints: benefit.requiredPoints,
    expiry: new Date('2027-03-31T23:59:59.000Z'),
    active: true,
  }));
}

export function buildLoyaltyProgram(): Prisma.LoyaltyProgramCreateManyInput[] {
  return [
    {
      id: 1,
      name: 'Clube Raízes',
      description: 'A cada R$ 1 gasto, o cliente acumula 1 ponto nas unidades da rede.',
      status: 'ATIVO',
    },
  ];
}
