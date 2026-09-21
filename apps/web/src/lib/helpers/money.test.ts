import { formatMoney, toMoneyNumber } from './money';

describe('toMoneyNumber', () => {
  it('keeps finite numbers', () => {
    expect(toMoneyNumber(12.5)).toBe(12.5);
  });

  it('parses decimal strings from prisma', () => {
    expect(toMoneyNumber('147.34')).toBe(147.34);
  });

  it('falls back to zero for invalid values', () => {
    expect(toMoneyNumber(undefined)).toBe(0);
    expect(toMoneyNumber(null)).toBe(0);
    expect(toMoneyNumber('abc')).toBe(0);
  });
});

describe('formatMoney', () => {
  it('formats BRL from a string decimal', () => {
    expect(formatMoney('32.70', 'pt-BR')).toBe('R$\u00a032,70');
  });
});
