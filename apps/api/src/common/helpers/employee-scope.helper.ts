import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export async function resolveEmployeeUnitId(
  prisma: PrismaService,
  userId: number,
): Promise<number> {
  const employee = await prisma.employee.findUnique({
    where: { userId },
    select: { unitId: true, active: true },
  });

  if (!employee || !employee.active) {
    throw new ForbiddenException('Employee unit not found');
  }

  return employee.unitId;
}

export async function resolveClientId(
  prisma: PrismaService,
  userId: number,
): Promise<number> {
  const client = await prisma.client.findUnique({
    where: { userId },
    select: { id: true, active: true },
  });

  if (!client || !client.active) {
    throw new NotFoundException('Client not found');
  }

  return client.id;
}
