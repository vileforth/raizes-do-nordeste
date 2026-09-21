import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

export async function deleteOrdersByIds(tx: Tx, orderIds: number[]): Promise<void> {
  if (orderIds.length === 0) {
    return;
  }
  await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
  await tx.payment.deleteMany({ where: { orderId: { in: orderIds } } });
  await tx.orderStatusHistory.deleteMany({ where: { orderId: { in: orderIds } } });
  await tx.order.deleteMany({ where: { id: { in: orderIds } } });
}

export async function deleteSupportTicketsByIds(
  tx: Tx,
  ticketIds: number[],
): Promise<void> {
  if (ticketIds.length === 0) {
    return;
  }
  await tx.supportHistory.deleteMany({
    where: { supportTicketId: { in: ticketIds } },
  });
  await tx.supportTicket.deleteMany({ where: { id: { in: ticketIds } } });
}

export async function deleteClientGraph(tx: Tx, clientId: number): Promise<void> {
  const orders = await tx.order.findMany({
    where: { clientId },
    select: { id: true },
  });
  await deleteOrdersByIds(
    tx,
    orders.map((order) => order.id),
  );

  const loyalties = await tx.clientLoyalty.findMany({
    where: { clientId },
    select: { id: true },
  });
  const loyaltyIds = loyalties.map((loyalty) => loyalty.id);
  if (loyaltyIds.length > 0) {
    await tx.pointMovement.deleteMany({
      where: { clientLoyaltyId: { in: loyaltyIds } },
    });
    await tx.benefitRedemption.deleteMany({
      where: { clientLoyaltyId: { in: loyaltyIds } },
    });
    await tx.clientLoyalty.deleteMany({ where: { clientId } });
  }

  const tickets = await tx.supportTicket.findMany({
    where: { clientId },
    select: { id: true },
  });
  await deleteSupportTicketsByIds(
    tx,
    tickets.map((ticket) => ticket.id),
  );
  await tx.client.delete({ where: { id: clientId } });
}

export async function deletePromotionGraph(
  tx: Tx,
  promotionId: number,
): Promise<void> {
  await tx.coupon.deleteMany({ where: { promotionId } });
  await tx.promotionUnit.deleteMany({ where: { promotionId } });
  await tx.promotionProduct.deleteMany({ where: { promotionId } });
  await tx.promotion.delete({ where: { id: promotionId } });
}

export async function deleteUnitGraph(tx: Tx, unitId: number): Promise<void> {
  const orders = await tx.order.findMany({
    where: { unitId },
    select: { id: true },
  });
  await deleteOrdersByIds(
    tx,
    orders.map((order) => order.id),
  );
  await tx.employee.deleteMany({ where: { unitId } });
  await tx.promotionUnit.deleteMany({ where: { unitId } });
  const stock = await tx.stock.findUnique({
    where: { unitId },
    select: { id: true },
  });
  if (stock) {
    await tx.stockProduct.deleteMany({ where: { stockId: stock.id } });
    await tx.stock.delete({ where: { id: stock.id } });
  }
  await tx.unit.delete({ where: { id: unitId } });
}

export async function deleteUserGraph(tx: Tx, userId: number): Promise<void> {
  await tx.userProfile.deleteMany({ where: { userId } });
  await tx.employee.deleteMany({ where: { userId } });
  await tx.orderStatusHistory.deleteMany({ where: { userId } });
  await tx.supportHistory.deleteMany({ where: { userId } });
  await tx.supportTicket.updateMany({
    where: { responsibleUserId: userId },
    data: { responsibleUserId: null },
  });
  await tx.auditLog.deleteMany({ where: { userId } });
  const client = await tx.client.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (client) {
    await deleteClientGraph(tx, client.id);
  }
  await tx.user.delete({ where: { id: userId } });
}

export async function deleteProductGraph(tx: Tx, productId: number): Promise<void> {
  const used = await tx.orderItem.count({ where: { productId } });
  if (used > 0) {
    throw new ConflictException('Product is referenced by orders');
  }
  await tx.stockProduct.deleteMany({ where: { productId } });
  await tx.promotionProduct.deleteMany({ where: { productId } });
  await tx.product.delete({ where: { id: productId } });
}
