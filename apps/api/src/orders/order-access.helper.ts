import {
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRole } from '@raizes/shared';
import { AuthenticatedUser } from '../auth/types/auth-user.types';
import { PrismaService } from '../prisma/prisma.service';

export async function resolveClientId(
  prisma: PrismaService,
  clientId: number | undefined,
  user: AuthenticatedUser,
): Promise<number> {
  if (user.roles.includes(UserRole.CLIENTE)) {
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });
    if (!client) {
      throw new NotFoundException('Client profile not found');
    }
    return client.id;
  }

  if (!clientId) {
    throw new UnprocessableEntityException('clientId is required');
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });
  if (!client) {
    throw new NotFoundException('Client not found');
  }

  return clientId;
}

export async function buildOrderScopeFilter(
  prisma: PrismaService,
  user: AuthenticatedUser,
): Promise<Prisma.OrderWhereInput> {
  if (user.roles.includes(UserRole.ADMINISTRADOR)) {
    return {};
  }

  if (user.roles.includes(UserRole.CLIENTE)) {
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });
    if (!client) {
      throw new NotFoundException('Client profile not found');
    }
    return { clientId: client.id };
  }

  const employee = await prisma.employee.findUnique({
    where: { userId: user.id },
  });
  if (!employee) {
    throw new ForbiddenException('Employee profile not found');
  }

  return { unitId: employee.unitId };
}

export async function assertOrderAccess(
  prisma: PrismaService,
  order: { id: number; clientId: number; unitId: number },
  user: AuthenticatedUser,
): Promise<void> {
  if (user.roles.includes(UserRole.ADMINISTRADOR)) {
    return;
  }

  if (user.roles.includes(UserRole.CLIENTE)) {
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });
    if (!client || client.id !== order.clientId) {
      throw new ForbiddenException('Access denied to this order');
    }
    return;
  }

  await assertStaffUnitAccess(prisma, order, user);
}

export async function assertStaffUnitAccess(
  prisma: PrismaService,
  order: { unitId: number },
  user: AuthenticatedUser,
): Promise<void> {
  if (user.roles.includes(UserRole.ADMINISTRADOR)) {
    return;
  }

  const staffRoles = [
    UserRole.ATENDENTE,
    UserRole.COZINHEIRO,
    UserRole.GERENTE,
  ];
  if (!staffRoles.some((role) => user.roles.includes(role))) {
    throw new ForbiddenException('Insufficient role permissions');
  }

  const employee = await prisma.employee.findUnique({
    where: { userId: user.id },
  });
  if (!employee || employee.unitId !== order.unitId) {
    throw new ForbiddenException('Access denied to this unit');
  }
}
