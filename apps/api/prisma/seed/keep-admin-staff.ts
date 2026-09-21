import { existsSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { ADMIN_EMAIL } from './counts';

async function removeStaffExceptAdmin(prisma: PrismaClient): Promise<number> {
  const staff = await prisma.user.findMany({
    where: { client: null, email: { not: ADMIN_EMAIL } },
    select: { id: true },
  });

  for (const user of staff) {
    await prisma.$transaction(async (tx) => {
      await tx.userProfile.deleteMany({ where: { userId: user.id } });
      await tx.employee.deleteMany({ where: { userId: user.id } });
      await tx.orderStatusHistory.deleteMany({ where: { userId: user.id } });
      await tx.supportHistory.deleteMany({ where: { userId: user.id } });
      await tx.supportTicket.updateMany({
        where: { responsibleUserId: user.id },
        data: { responsibleUserId: null },
      });
      await tx.auditLog.deleteMany({ where: { userId: user.id } });
      await tx.user.delete({ where: { id: user.id } });
    });
  }

  return staff.length;
}

async function run() {
  if (existsSync('.env')) {
    process.loadEnvFile();
  }
  const prisma = new PrismaClient();
  try {
    const removed = await removeStaffExceptAdmin(prisma);
    process.stdout.write(`Removed ${removed} staff users\n`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  void run();
}
