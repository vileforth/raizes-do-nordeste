import { LoyaltyLevel, OrderStatus, UserStatus } from '@prisma/client';
import {
  buildClientSearch,
  resolveClientOrderBy,
  toClientResponse,
  type ClientWithRelations,
} from './clients.mapper';

function buildClient(
  overrides: Partial<ClientWithRelations> = {},
): ClientWithRelations {
  return {
    id: 1,
    userId: 10,
    cpf: '52998224725',
    registeredAt: new Date('2026-01-01T00:00:00.000Z'),
    active: true,
    user: {
      id: 10,
      name: 'Ana Costa',
      email: 'ana@example.com',
      phone: '81999990000',
      status: UserStatus.ATIVO,
    },
    clientLoyalties: [
      { level: LoyaltyLevel.PRATA, pointsBalance: 240 },
    ],
    orders: [
      {
        id: 44,
        orderCode: 'RZ000044',
        totalValue: 89.9 as unknown as ClientWithRelations['orders'][number]['totalValue'],
        createdAt: new Date('2026-03-01T12:00:00.000Z'),
        status: OrderStatus.RETIRADO,
      },
    ],
    _count: { orders: 12, supportTickets: 2 },
    ...overrides,
  };
}

describe('clients.mapper', () => {
  it('maps identity, loyalty and last order', () => {
    const response = toClientResponse(buildClient());

    expect(response.name).toBe('Ana Costa');
    expect(response.email).toBe('ana@example.com');
    expect(response.loyaltyLevel).toBe(LoyaltyLevel.PRATA);
    expect(response.pointsBalance).toBe(240);
    expect(response.ordersCount).toBe(12);
    expect(response.lastOrder?.orderCode).toBe('RZ000044');
    expect(response.lastOrder?.totalValue).toBe(89.9);
  });

  it('returns nulls when the client has no activity', () => {
    const response = toClientResponse(
      buildClient({ clientLoyalties: [], orders: [], _count: { orders: 0, supportTickets: 0 } }),
    );

    expect(response.loyaltyLevel).toBeNull();
    expect(response.lastOrder).toBeNull();
  });

  it('searches by cpf, name, email and phone', () => {
    expect(buildClientSearch(undefined)).toBeUndefined();
    expect(buildClientSearch('ana')).toEqual({
      OR: [
        { cpf: { contains: 'ana', mode: 'insensitive' } },
        { user: { name: { contains: 'ana', mode: 'insensitive' } } },
        { user: { email: { contains: 'ana', mode: 'insensitive' } } },
        { user: { phone: { contains: 'ana', mode: 'insensitive' } } },
      ],
    });
  });

  it('orders by related user name', () => {
    expect(resolveClientOrderBy('-name')).toEqual({ user: { name: 'desc' } });
    expect(resolveClientOrderBy('cpf')).toEqual({ cpf: 'asc' });
    expect(resolveClientOrderBy(undefined)).toEqual({ id: 'asc' });
  });
});
