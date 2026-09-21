'use client';

import { GLASS_STRONG } from '@/lib/glass';
import type { DashboardPeriod } from '@/lib/helpers/dashboard-period';

const PERIODS: DashboardPeriod[] = ['7d', '30d', '90d'];

export function FilterBar({
  value,
  onChange,
  labels,
}: {
  value: DashboardPeriod;
  onChange: (period: DashboardPeriod) => void;
  labels: Record<DashboardPeriod, string>;
}) {
  return (
    <div className="inline-flex h-9 items-center rounded-full border p-0.5 backdrop-blur-xl" style={GLASS_STRONG}>
      {PERIODS.map((period) => {
        const active = value === period;
        return (
          <button
            key={period}
            type="button"
            onClick={() => onChange(period)}
            className="h-8 rounded-full px-3 text-xs font-semibold transition-colors"
            style={{
              color: active ? '#fff' : 'var(--raizes-petrol)',
              background: active ? 'var(--raizes-petrol)' : 'transparent',
            }}
          >
            {labels[period]}
          </button>
        );
      })}
    </div>
  );
}
