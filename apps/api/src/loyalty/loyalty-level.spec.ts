import { LoyaltyLevel } from '@prisma/client';
import { resolveLoyaltyLevel } from './loyalty-level';

describe('resolveLoyaltyLevel', () => {
  it('returns BRONZE below 500 points', () => {
    expect(resolveLoyaltyLevel(0)).toBe(LoyaltyLevel.BRONZE);
    expect(resolveLoyaltyLevel(499)).toBe(LoyaltyLevel.BRONZE);
  });

  it('returns PRATA between 500 and 1999 points', () => {
    expect(resolveLoyaltyLevel(500)).toBe(LoyaltyLevel.PRATA);
    expect(resolveLoyaltyLevel(1999)).toBe(LoyaltyLevel.PRATA);
  });

  it('returns OURO at 2000 points or more', () => {
    expect(resolveLoyaltyLevel(2000)).toBe(LoyaltyLevel.OURO);
    expect(resolveLoyaltyLevel(5000)).toBe(LoyaltyLevel.OURO);
  });
});
