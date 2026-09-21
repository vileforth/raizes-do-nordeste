import { PrismaClient } from '@prisma/client';
import { createManyInBatches } from './batch';
import { clearDatabase } from './clear-database';
import {
  buildBenefits,
  buildCoupons,
  buildLoyaltyProgram,
  buildProducts,
  buildPromotionLinks,
  buildPromotions,
  buildStockProducts,
  buildStocks,
} from './generators/catalog';
import { buildIdentity, buildProfiles, buildUnits } from './generators/identity';
import { buildLoyalty } from './generators/loyalty';
import { buildOrders } from './generators/orders';
import { buildSupport } from './generators/support';
import { resetSeedSequences } from './reset-sequences';

export async function runSeed(prisma: PrismaClient): Promise<void> {
  await clearDatabase(prisma);

  const profiles = buildProfiles();
  const units = buildUnits();
  const { users, clients, employees, userProfiles } = buildIdentity();
  const staffUserIds = employees.map((employee) => employee.userId);
  const products = buildProducts();
  const stocks = buildStocks();
  const stockProducts = buildStockProducts();
  const promotions = buildPromotions();
  const coupons = buildCoupons();
  const { promotionUnits, promotionProducts } = buildPromotionLinks();
  const loyaltyPrograms = buildLoyaltyProgram();
  const benefits = buildBenefits();
  const { loyalties, movements, redemptions } = buildLoyalty();
  const { orders, items, payments, histories } = buildOrders(staffUserIds);
  const support = buildSupport(staffUserIds);

  await prisma.profile.createMany({ data: profiles });
  await prisma.user.createMany({ data: users });
  await prisma.userProfile.createMany({ data: userProfiles });
  await prisma.unit.createMany({ data: units });
  await prisma.client.createMany({ data: clients });
  await prisma.employee.createMany({ data: employees });
  await prisma.product.createMany({ data: products });
  await prisma.stock.createMany({ data: stocks });
  await prisma.stockProduct.createMany({ data: stockProducts });
  await prisma.promotion.createMany({ data: promotions });
  await prisma.coupon.createMany({ data: coupons });
  await prisma.promotionUnit.createMany({ data: promotionUnits });
  await prisma.promotionProduct.createMany({ data: promotionProducts });
  await prisma.loyaltyProgram.createMany({ data: loyaltyPrograms });
  await prisma.clientLoyalty.createMany({ data: loyalties });
  await prisma.benefit.createMany({ data: benefits });

  await createManyInBatches(orders, (batch) => prisma.order.createMany({ data: batch }));
  await createManyInBatches(items, (batch) => prisma.orderItem.createMany({ data: batch }));
  await createManyInBatches(payments, (batch) => prisma.payment.createMany({ data: batch }));
  await createManyInBatches(histories, (batch) =>
    prisma.orderStatusHistory.createMany({ data: batch }),
  );
  await createManyInBatches(movements, (batch) => prisma.pointMovement.createMany({ data: batch }));
  await prisma.benefitRedemption.createMany({ data: redemptions });
  await prisma.supportTicket.createMany({ data: support.tickets });
  await prisma.supportHistory.createMany({ data: support.histories });
  await createManyInBatches(support.audits, (batch) => prisma.auditLog.createMany({ data: batch }));

  await resetSeedSequences(prisma);
}
