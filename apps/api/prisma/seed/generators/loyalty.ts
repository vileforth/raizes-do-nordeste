import { LoyaltyLevel, PointMovementType, Prisma } from '@prisma/client';
import { SEED_COUNTS } from '../counts';
import { SEED_BENEFITS } from '../data/promotions';
import { createSeedFaker, padCode, pick } from '../helpers';

function levelForPoints(points: number): LoyaltyLevel {
  if (points >= 800) return LoyaltyLevel.OURO;
  if (points >= 350) return LoyaltyLevel.PRATA;
  return LoyaltyLevel.BRONZE;
}

export function buildLoyalty() {
  const faker = createSeedFaker();
  const loyalties: Prisma.ClientLoyaltyCreateManyInput[] = [];
  const movements: Prisma.PointMovementCreateManyInput[] = [];
  const redemptions: Prisma.BenefitRedemptionCreateManyInput[] = [];

  for (let clientId = 1; clientId <= SEED_COUNTS.clients; clientId += 1) {
    const pointsBalance = faker.number.int({ min: 40, max: 980 });
    loyalties.push({
      id: clientId,
      clientId,
      programId: 1,
      pointsBalance,
      level: levelForPoints(pointsBalance),
      joinedAt: faker.date.between({ from: '2025-04-01', to: '2026-07-15' }),
      status: 'ATIVO',
    });
  }

  const movementTotal = SEED_COUNTS.pointMovements;
  for (let id = 1; id <= movementTotal; id += 1) {
    const clientLoyaltyId = ((id - 1) % SEED_COUNTS.clients) + 1;
    const isDebit = id % 9 === 0;
    movements.push({
      id,
      clientLoyaltyId,
      type: isDebit ? PointMovementType.DEBITO : PointMovementType.CREDITO,
      points: isDebit
        ? faker.number.int({ min: 50, max: 200 })
        : faker.number.int({ min: 8, max: 60 }),
      origin: isDebit ? 'RESGATE_BENEFICIO' : 'PEDIDO',
      occurredAt: faker.date.between({ from: '2025-09-21', to: '2026-09-21' }),
      notes: isDebit ? 'Pontos usados em resgate' : 'Pontos creditados na compra',
    });
  }

  for (let id = 1; id <= SEED_COUNTS.benefitRedemptions; id += 1) {
    const benefit = pick(faker, SEED_BENEFITS);
    redemptions.push({
      id,
      clientLoyaltyId: ((id - 1) % SEED_COUNTS.clients) + 1,
      benefitId: benefit.id,
      redeemedAt: faker.date.between({ from: '2025-10-01', to: '2026-09-15' }),
      status: faker.helpers.weightedArrayElement([
        { value: 'CONFIRMADO', weight: 8 },
        { value: 'PENDENTE', weight: 1 },
        { value: 'CANCELADO', weight: 1 },
      ]),
      redemptionCode: padCode('RES', id, 6),
    });
  }

  return { loyalties, movements, redemptions };
}
