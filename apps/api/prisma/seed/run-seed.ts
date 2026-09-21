import { PrismaClient } from '@prisma/client';
import { createManyInBatches } from './batch';
import { resetSeedSequences } from './reset-sequences';
import {
  mapAuditLogs,
  mapBenefitRedemptions,
  mapBenefits,
  mapClientLoyalties,
  mapClients,
  mapCoupons,
  mapEmployees,
  mapLoyaltyPrograms,
  mapOrderItems,
  mapOrderStatusHistories,
  mapOrders,
  mapPayments,
  mapPointMovements,
  mapProducts,
  mapProfiles,
  mapPromotionProducts,
  mapPromotionUnits,
  mapPromotions,
  mapStockProducts,
  mapStocks,
  mapSupportHistories,
  mapSupportTickets,
  mapUnits,
  mapUserProfiles,
  mapUsers,
} from './row-mappers';
import { assertSeedSheet, loadSeedWorkbook, type SeedWorkbook } from './xlsx-reader';

async function seedWorkbook(prisma: PrismaClient, sheets: SeedWorkbook): Promise<void> {
  await prisma.user.createMany({ data: mapUsers(assertSeedSheet(sheets, 'USUARIO')) });
  await prisma.profile.createMany({ data: mapProfiles(assertSeedSheet(sheets, 'PERFIL')) });
  await prisma.userProfile.createMany({
    data: mapUserProfiles(assertSeedSheet(sheets, 'USUARIO_PERFIL')),
  });
  await prisma.unit.createMany({ data: mapUnits(assertSeedSheet(sheets, 'UNIDADE')) });
  await prisma.client.createMany({ data: mapClients(assertSeedSheet(sheets, 'CLIENTE')) });
  await prisma.employee.createMany({ data: mapEmployees(assertSeedSheet(sheets, 'FUNCIONARIO')) });
  await prisma.product.createMany({ data: mapProducts(assertSeedSheet(sheets, 'PRODUTO')) });
  await prisma.stock.createMany({ data: mapStocks(assertSeedSheet(sheets, 'ESTOQUE')) });
  await prisma.stockProduct.createMany({
    data: mapStockProducts(assertSeedSheet(sheets, 'ESTOQUE_PRODUTO')),
  });
  await prisma.promotion.createMany({ data: mapPromotions(assertSeedSheet(sheets, 'PROMOCAO')) });
  await prisma.coupon.createMany({ data: mapCoupons(assertSeedSheet(sheets, 'CUPOM')) });
  await prisma.promotionUnit.createMany({
    data: mapPromotionUnits(assertSeedSheet(sheets, 'PROMOCAO_UNIDADE')),
  });
  await prisma.promotionProduct.createMany({
    data: mapPromotionProducts(assertSeedSheet(sheets, 'PROMOCAO_PRODUTO')),
  });
  await prisma.loyaltyProgram.createMany({
    data: mapLoyaltyPrograms(assertSeedSheet(sheets, 'PROGRAMA_FIDELIDADE')),
  });
  await prisma.clientLoyalty.createMany({
    data: mapClientLoyalties(assertSeedSheet(sheets, 'CLIENTE_FIDELIDADE')),
  });
  await prisma.benefit.createMany({ data: mapBenefits(assertSeedSheet(sheets, 'BENEFICIO')) });

  await createManyInBatches(mapOrders(assertSeedSheet(sheets, 'PEDIDO')), (batch) =>
    prisma.order.createMany({ data: batch }),
  );
  await createManyInBatches(mapOrderItems(assertSeedSheet(sheets, 'ITEM_PEDIDO')), (batch) =>
    prisma.orderItem.createMany({ data: batch }),
  );
  await createManyInBatches(mapPayments(assertSeedSheet(sheets, 'PAGAMENTO')), (batch) =>
    prisma.payment.createMany({ data: batch }),
  );
  await createManyInBatches(
    mapOrderStatusHistories(assertSeedSheet(sheets, 'HIST_STATUS_PEDIDO')),
    (batch) => prisma.orderStatusHistory.createMany({ data: batch }),
  );
  await createManyInBatches(
    mapPointMovements(assertSeedSheet(sheets, 'MOVIMENTACAO_PONTOS')),
    (batch) => prisma.pointMovement.createMany({ data: batch }),
  );
  await prisma.benefitRedemption.createMany({
    data: mapBenefitRedemptions(assertSeedSheet(sheets, 'RESGATE_BENEFICIO')),
  });
  await prisma.supportTicket.createMany({
    data: mapSupportTickets(assertSeedSheet(sheets, 'ATENDIMENTO')),
  });
  await prisma.supportHistory.createMany({
    data: mapSupportHistories(assertSeedSheet(sheets, 'HIST_ATENDIMENTO')),
  });
  await createManyInBatches(mapAuditLogs(assertSeedSheet(sheets, 'LOG_AUDITORIA')), (batch) =>
    prisma.auditLog.createMany({ data: batch }),
  );

  await resetSeedSequences(prisma);
}

export async function runSeed(
  prisma: PrismaClient,
  workbookPath?: string,
): Promise<SeedWorkbook> {
  const sheets = loadSeedWorkbook(workbookPath);
  await seedWorkbook(prisma, sheets);
  return sheets;
}
