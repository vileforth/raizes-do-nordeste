import {
  ConsumptionType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { SEED_COUNTS } from '../counts';
import { SEED_PRODUCTS } from '../data/products';
import { SEED_UNITS } from '../data/units';
import { addMinutes, createSeedFaker, money, padCode, pick } from '../helpers';

const STATUS_PLAN: Array<{ status: OrderStatus; count: number; steps: OrderStatus[] }> = [
  { status: OrderStatus.RECEBIDO, count: 400, steps: [OrderStatus.RECEBIDO] },
  {
    status: OrderStatus.EM_PREPARACAO,
    count: 500,
    steps: [OrderStatus.RECEBIDO, OrderStatus.EM_PREPARACAO],
  },
  {
    status: OrderStatus.PRONTO,
    count: 600,
    steps: [OrderStatus.RECEBIDO, OrderStatus.EM_PREPARACAO, OrderStatus.PRONTO],
  },
  {
    status: OrderStatus.RETIRADO,
    count: 10600,
    steps: [
      OrderStatus.RECEBIDO,
      OrderStatus.EM_PREPARACAO,
      OrderStatus.PRONTO,
      OrderStatus.RETIRADO,
    ],
  },
];

function paymentForStatus(status: OrderStatus, faker: ReturnType<typeof createSeedFaker>) {
  if (status === OrderStatus.RECEBIDO) {
    return faker.helpers.arrayElement([PaymentStatus.PENDENTE, PaymentStatus.CONFIRMADO]);
  }
  if (status === OrderStatus.EM_PREPARACAO) {
    return faker.helpers.weightedArrayElement([
      { value: PaymentStatus.CONFIRMADO, weight: 8 },
      { value: PaymentStatus.PENDENTE, weight: 2 },
    ]);
  }
  return PaymentStatus.CONFIRMADO;
}

export function buildOrders(staffUserIds: number[]) {
  const faker = createSeedFaker();
  const orders: Prisma.OrderCreateManyInput[] = [];
  const items: Prisma.OrderItemCreateManyInput[] = [];
  const payments: Prisma.PaymentCreateManyInput[] = [];
  const histories: Prisma.OrderStatusHistoryCreateManyInput[] = [];
  const threeItemOrderIds = new Set(
    faker.helpers.arrayElements(
      Array.from({ length: SEED_COUNTS.orders }, (_, index) => index + 1),
      SEED_COUNTS.orderItems - SEED_COUNTS.orders * 2,
    ),
  );

  let orderCursor = 1;
  let itemId = 1;
  let historyId = 1;
  const now = new Date('2026-09-21T18:00:00.000Z');

  for (const plan of STATUS_PLAN) {
    for (let index = 0; index < plan.count; index += 1) {
      const isOpen = plan.status !== OrderStatus.RETIRADO;
      const createdAt = isOpen
        ? faker.date.recent({ days: 4, refDate: now })
        : faker.date.between({ from: '2025-09-21T10:00:00.000Z', to: now });
      const unit = pick(faker, SEED_UNITS);
      const clientId = faker.number.int({ min: 1, max: SEED_COUNTS.clients });
      const itemCount = threeItemOrderIds.has(orderCursor) ? 3 : 2;
      const chosenProducts = faker.helpers.arrayElements(SEED_PRODUCTS, itemCount);
      let total = 0;
      for (const product of chosenProducts) {
        const quantity = faker.number.int({ min: 1, max: 2 });
        const subtotal = Number((product.price * quantity).toFixed(2));
        total += subtotal;
        items.push({
          id: itemId,
          orderId: orderCursor,
          productId: product.id,
          quantity,
          unitPrice: money(product.price),
          subtotal: money(subtotal),
        });
        itemId += 1;
      }

      orders.push({
        id: orderCursor,
        clientId,
        unitId: unit.id,
        status: plan.status,
        consumptionType: faker.helpers.arrayElement([
          ConsumptionType.RETIRADA_NO_BALCAO,
          ConsumptionType.CONSUMO_NO_LOCAL,
        ]),
        totalValue: money(total),
        orderCode: padCode('RZ', orderCursor),
        createdAt,
        updatedAt: addMinutes(createdAt, plan.steps.length * 8),
      });

      const paymentStatus = paymentForStatus(plan.status, faker);
      payments.push({
        id: orderCursor,
        orderId: orderCursor,
        method: pick(faker, [
          PaymentMethod.PIX,
          PaymentMethod.CARTAO_CREDITO,
          PaymentMethod.CARTAO_DEBITO,
        ]),
        value: money(total),
        status: paymentStatus,
        paidAt: paymentStatus === PaymentStatus.CONFIRMADO ? addMinutes(createdAt, 3) : null,
        transactionCode: padCode('TX', orderCursor, 8),
      });

      plan.steps.forEach((status, stepIndex) => {
        histories.push({
          id: historyId,
          orderId: orderCursor,
          status,
          occurredAt: addMinutes(createdAt, stepIndex * 7),
          userId: pick(faker, staffUserIds),
          notes:
            status === OrderStatus.RECEBIDO
              ? 'Pedido recebido no balcão'
              : status === OrderStatus.EM_PREPARACAO
                ? 'Cozinha iniciou o preparo'
                : status === OrderStatus.PRONTO
                  ? 'Pedido pronto para retirada'
                  : 'Pedido entregue ao cliente',
        });
        historyId += 1;
      });

      orderCursor += 1;
    }
  }

  while (histories.length < SEED_COUNTS.orderStatusHistories) {
    const orderId = faker.number.int({ min: 1, max: SEED_COUNTS.orders });
    const order = orders[orderId - 1];
    histories.push({
      id: historyId,
      orderId,
      status: order.status,
      occurredAt: addMinutes(order.createdAt as Date, 30 + (historyId % 20)),
      userId: pick(faker, staffUserIds),
      notes: 'Atualização de acompanhamento do pedido',
    });
    historyId += 1;
  }

  return { orders, items, payments, histories };
}
