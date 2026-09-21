import { existsSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { createClientProfile, resolveAreaCode } from './client-profile';
import { createSeedFaker } from './helpers';

export async function fillEmptyClientProfiles(prisma: PrismaClient): Promise<number> {
  const clients = await prisma.client.findMany({
    where: { OR: [{ city: '' }, { latitude: null }] },
    include: { user: { select: { phone: true } } },
  });
  const faker = createSeedFaker();
  for (const client of clients) {
    const profile = createClientProfile(faker, resolveAreaCode(client.user.phone));
    await prisma.client.update({
      where: { id: client.id },
      data: profile,
    });
  }
  return clients.length;
}

export async function spreadClientCoordinates(prisma: PrismaClient): Promise<number> {
  const clients = await prisma.client.findMany({
    include: { user: { select: { phone: true } } },
  });
  const faker = createSeedFaker();
  for (const client of clients) {
    const profile = createClientProfile(faker, resolveAreaCode(client.user.phone));
    await prisma.client.update({
      where: { id: client.id },
      data: { latitude: profile.latitude, longitude: profile.longitude },
    });
  }
  return clients.length;
}

async function run() {
  if (existsSync('.env')) {
    process.loadEnvFile();
  }
  const prisma = new PrismaClient();
  try {
    const updated = await fillEmptyClientProfiles(prisma);
    const spread = await spreadClientCoordinates(prisma);
    process.stdout.write(`Updated ${updated} client profiles\n`);
    process.stdout.write(`Spread ${spread} client coordinates\n`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  void run();
}
