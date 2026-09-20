import { describe, expect, it } from 'vitest';
import { mapIndicatorsToKpis } from './kpi-mapper';

describe('mapIndicatorsToKpis', () => {
  it('maps four kpis', () => {
    const kpis = mapIndicatorsToKpis(
      { orders: 10, revenue: 100, promotions: 2, loyaltyMembers: 5 },
      {
        orders: 'Orders',
        revenue: 'Revenue',
        promotions: 'Promotions',
        loyaltyMembers: 'Loyalty',
      },
    );
    expect(kpis).toHaveLength(4);
    expect(kpis[0].raw).toBe(10);
    expect(kpis[1].raw).toBe(100);
  });
});
