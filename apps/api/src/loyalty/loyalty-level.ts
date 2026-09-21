import { LoyaltyLevel } from '@prisma/client';

export function resolveLoyaltyLevel(points: number): LoyaltyLevel {
  if (points < 500) {
    return LoyaltyLevel.BRONZE;
  }
  if (points < 2000) {
    return LoyaltyLevel.PRATA;
  }
  return LoyaltyLevel.OURO;
}
