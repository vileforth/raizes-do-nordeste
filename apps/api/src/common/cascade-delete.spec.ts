import { ConflictException } from '@nestjs/common';
import {
  deleteClientGraph,
  deleteOrdersByIds,
  deleteProductGraph,
  deletePromotionGraph,
  deleteSupportTicketsByIds,
  deleteUnitGraph,
  deleteUserGraph,
} from './cascade-delete';

function createTx() {
  return {
    orderItem: { deleteMany: jest.fn(), count: jest.fn().mockResolvedValue(0) },
    payment: { deleteMany: jest.fn() },
    orderStatusHistory: { deleteMany: jest.fn() },
    order: {
      deleteMany: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    supportHistory: { deleteMany: jest.fn() },
    supportTicket: {
      deleteMany: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      updateMany: jest.fn(),
    },
    clientLoyalty: {
      findMany: jest.fn().mockResolvedValue([]),
      deleteMany: jest.fn(),
    },
    pointMovement: { deleteMany: jest.fn() },
    benefitRedemption: { deleteMany: jest.fn() },
    client: {
      delete: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(null),
    },
    coupon: { deleteMany: jest.fn() },
    promotionUnit: { deleteMany: jest.fn() },
    promotionProduct: { deleteMany: jest.fn() },
    promotion: { delete: jest.fn() },
    employee: { deleteMany: jest.fn() },
    stock: { findUnique: jest.fn().mockResolvedValue(null), delete: jest.fn() },
    stockProduct: { deleteMany: jest.fn() },
    unit: { delete: jest.fn() },
    userProfile: { deleteMany: jest.fn() },
    auditLog: { deleteMany: jest.fn() },
    user: { delete: jest.fn() },
    product: { delete: jest.fn() },
  };
}

describe('cascade-delete', () => {
  it('skips empty order lists', async () => {
    const tx = createTx();
    await deleteOrdersByIds(tx as never, []);
    expect(tx.order.deleteMany).not.toHaveBeenCalled();
  });

  it('deletes order children then orders', async () => {
    const tx = createTx();
    await deleteOrdersByIds(tx as never, [1, 2]);
    expect(tx.orderItem.deleteMany).toHaveBeenCalled();
    expect(tx.payment.deleteMany).toHaveBeenCalled();
    expect(tx.orderStatusHistory.deleteMany).toHaveBeenCalled();
    expect(tx.order.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: [1, 2] } },
    });
  });

  it('deletes support histories then tickets', async () => {
    const tx = createTx();
    await deleteSupportTicketsByIds(tx as never, [9]);
    expect(tx.supportHistory.deleteMany).toHaveBeenCalled();
    expect(tx.supportTicket.deleteMany).toHaveBeenCalled();
  });

  it('deletes client graph', async () => {
    const tx = createTx();
    tx.order.findMany.mockResolvedValue([{ id: 3 }]);
    await deleteClientGraph(tx as never, 4);
    expect(tx.order.deleteMany).toHaveBeenCalled();
    expect(tx.client.delete).toHaveBeenCalledWith({ where: { id: 4 } });
  });

  it('deletes promotion graph', async () => {
    const tx = createTx();
    await deletePromotionGraph(tx as never, 8);
    expect(tx.coupon.deleteMany).toHaveBeenCalled();
    expect(tx.promotion.delete).toHaveBeenCalledWith({ where: { id: 8 } });
  });

  it('deletes unit graph including stock', async () => {
    const tx = createTx();
    tx.stock.findUnique.mockResolvedValue({ id: 11 });
    await deleteUnitGraph(tx as never, 5);
    expect(tx.stockProduct.deleteMany).toHaveBeenCalled();
    expect(tx.unit.delete).toHaveBeenCalledWith({ where: { id: 5 } });
  });

  it('deletes user graph', async () => {
    const tx = createTx();
    await deleteUserGraph(tx as never, 7);
    expect(tx.userProfile.deleteMany).toHaveBeenCalled();
    expect(tx.user.delete).toHaveBeenCalledWith({ where: { id: 7 } });
  });

  it('rejects product used in orders', async () => {
    const tx = createTx();
    tx.orderItem.count.mockResolvedValue(2);
    await expect(deleteProductGraph(tx as never, 6)).rejects.toThrow(
      ConflictException,
    );
  });
});
