export type DashboardPeriod = '7d' | '30d' | '90d';

export const DEFAULT_PERIOD: DashboardPeriod = '30d';

export function periodToDays(period: DashboardPeriod): number {
  if (period === '7d') return 7;
  if (period === '90d') return 90;
  return 30;
}

export function periodToRange(period: DashboardPeriod): { from: string; to: string } {
  const days = periodToDays(period);
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - (days - 1));
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}
