import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@raizes/shared';
import { AuthenticatedUser } from '../../auth/types/auth-user.types';
import { PrismaService } from '../../prisma/prisma.service';

export function hasRole(user: AuthenticatedUser, role: UserRole): boolean {
  return user.roles.includes(role);
}

export function assertAnyRole(
  user: AuthenticatedUser,
  roles: UserRole[],
): void {
  if (!roles.some((role) => user.roles.includes(role))) {
    throw new ForbiddenException('Insufficient role permissions');
  }
}

export async function resolveManagerUnitId(
  prisma: PrismaService,
  userId: number,
): Promise<number> {
  const employee = await prisma.employee.findUnique({
    where: { userId },
    select: { unitId: true, active: true },
  });

  if (!employee?.active) {
    throw new ForbiddenException('Manager unit not found');
  }

  return employee.unitId;
}
