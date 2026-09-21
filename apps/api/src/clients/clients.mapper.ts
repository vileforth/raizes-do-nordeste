import { Prisma } from '@prisma/client';
import { ClientResponseDto } from './dto/client-response.dto';

export const clientInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
    },
  },
  clientLoyalties: {
    take: 1,
    orderBy: { joinedAt: 'desc' as const },
    select: {
      level: true,
      pointsBalance: true,
    },
  },
  orders: {
    take: 1,
    orderBy: { createdAt: 'desc' as const },
    select: {
      id: true,
      orderCode: true,
      totalValue: true,
      createdAt: true,
      status: true,
    },
  },
  _count: {
    select: {
      orders: true,
      supportTickets: true,
    },
  },
} satisfies Prisma.ClientInclude;

export type ClientWithRelations = Prisma.ClientGetPayload<{
  include: typeof clientInclude;
}>;

export function buildClientSearch(
  search?: string,
): Prisma.ClientWhereInput | undefined {
  if (!search) {
    return undefined;
  }
  return {
    OR: [
      { cpf: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { phone: { contains: search, mode: 'insensitive' } } },
    ],
  };
}

export function resolveClientOrderBy(
  orderBy?: string,
): Prisma.ClientOrderByWithRelationInput {
  const descending = Boolean(orderBy?.startsWith('-'));
  const field = descending ? orderBy?.slice(1) : orderBy;
  const direction = descending ? 'desc' : 'asc';
  if (field === 'name') {
    return { user: { name: direction } };
  }
  if (field === 'email') {
    return { user: { email: direction } };
  }
  if (field === 'cpf') {
    return { cpf: direction };
  }
  if (field === 'registeredAt') {
    return { registeredAt: direction };
  }
  return { id: 'asc' };
}

export function toClientResponse(client: ClientWithRelations): ClientResponseDto {
  const loyalty = client.clientLoyalties[0];
  const lastOrder = client.orders[0];
  return {
    id: client.id,
    userId: client.userId,
    cpf: client.cpf,
    registeredAt: client.registeredAt,
    active: client.active,
    name: client.user.name,
    email: client.user.email,
    phone: client.user.phone,
    userStatus: client.user.status,
    ordersCount: client._count.orders,
    ticketsCount: client._count.supportTickets,
    loyaltyLevel: loyalty?.level ?? null,
    pointsBalance: loyalty?.pointsBalance ?? null,
    lastOrder: lastOrder
      ? {
          id: lastOrder.id,
          orderCode: lastOrder.orderCode,
          totalValue: Number(lastOrder.totalValue),
          createdAt: lastOrder.createdAt,
          status: lastOrder.status,
        }
      : null,
  };
}
