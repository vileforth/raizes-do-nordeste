import { PrismaClient } from '@prisma/client';
import { runSeed } from './seed/run-seed';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await runSeed(prisma);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
