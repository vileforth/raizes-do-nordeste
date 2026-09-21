import { buildCpf, weightedDigit } from '../../../prisma/seed/cpf';
import { SEED_PRODUCTS } from '../../../prisma/seed/data/products';
import { SEED_UNITS } from '../../../prisma/seed/data/units';
import { SEED_PROMOTIONS } from '../../../prisma/seed/data/promotions';

describe('realistic seed catalog', () => {
  it('keeps 45 uniquely named products with coherent prices', () => {
    const names = SEED_PRODUCTS.map((product) => product.name);
    expect(SEED_PRODUCTS).toHaveLength(45);
    expect(new Set(names).size).toBe(45);
    expect(SEED_PRODUCTS.every((product) => product.price >= 4 && product.price <= 50)).toBe(true);
  });

  it('places six Northeast units with coordinates', () => {
    expect(SEED_UNITS).toHaveLength(6);
    expect(SEED_UNITS.every((unit) => unit.latitude < 0 && unit.longitude < 0)).toBe(true);
    expect(SEED_UNITS.every((unit) => unit.address.includes('/'))).toBe(true);
  });

  it('uses real promotion names and twelve coupons', () => {
    expect(SEED_PROMOTIONS).toHaveLength(12);
    expect(new Set(SEED_PROMOTIONS.map((item) => item.couponCode)).size).toBe(12);
    expect(SEED_PROMOTIONS.some((item) => item.name.includes('São João'))).toBe(true);
  });

  it('calculates CPF verifier digits', () => {
    expect(weightedDigit([1, 1, 1, 4, 4, 4, 7, 7, 7], [10, 9, 8, 7, 6, 5, 4, 3, 2])).toBe(3);
    expect(buildCpf([1, 1, 1, 4, 4, 4, 7, 7, 7])).toHaveLength(11);
  });
});
