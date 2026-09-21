import { describe, expect, it } from 'vitest';
import { buildDailySeries, orderRevenueValue } from './dashboard-series';

describe('buildDailySeries', () => {
  it('fills missing days and sums values', () => {
    const today = new Date().toISOString().slice(0, 10);
    const series = buildDailySeries(
      [
        { createdAt: `${today}T10:00:00.000Z`, totalValue: 10 },
        { createdAt: `${today}T18:00:00.000Z`, totalValue: 5 },
      ],
      3,
      orderRevenueValue,
    );
    expect(series).toHaveLength(3);
    expect(series[2]?.date).toBe(today);
    expect(series[2]?.value).toBe(15);
    expect(series[0]?.value).toBe(0);
  });
});
