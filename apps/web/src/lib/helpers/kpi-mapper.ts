import type { KpiSpec } from '@/components/kpi-card';
import { ChartBar, CurrencyCircleDollar, Gift, Users } from '@phosphor-icons/react';

export type Indicators = {
  orders: number;
  revenue: number;
  promotions: number;
  loyaltyMembers: number;
};

export function mapIndicatorsToKpis(
  data: Indicators,
  labels: Record<string, string>,
): KpiSpec[] {
  return [
    {
      key: 'orders',
      Icon: ChartBar,
      accent: 'var(--raizes-brand)',
      label: labels.orders,
      raw: data.orders,
      format: (n) => n.toLocaleString(),
    },
    {
      key: 'revenue',
      Icon: CurrencyCircleDollar,
      accent: 'var(--raizes-petrol)',
      label: labels.revenue,
      raw: data.revenue,
      format: (n) =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(n),
    },
    {
      key: 'promotions',
      Icon: Gift,
      accent: 'var(--raizes-brand)',
      label: labels.promotions,
      raw: data.promotions,
      format: (n) => n.toLocaleString(),
    },
    {
      key: 'loyaltyMembers',
      Icon: Users,
      accent: 'var(--raizes-petrol)',
      label: labels.loyaltyMembers,
      raw: data.loyaltyMembers,
      format: (n) => n.toLocaleString(),
    },
  ];
}
