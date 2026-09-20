'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { KpiCard, KpiCardSkeleton } from '@/components/kpi-card';
import { ListPageScaffold } from '@/components/list-page-scaffold';
import { mapIndicatorsToKpis } from '@/lib/helpers/kpi-mapper';
import { getIndicators, getReport } from '@/services/reports';

export default function ReportsPage() {
  const t = useTranslations('reports');
  const tCommon = useTranslations('common');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const query = { from: from || undefined, to: to || undefined };
  const indicators = useQuery({
    queryKey: ['reports', 'indicators', query],
    queryFn: () => getIndicators(query),
  });
  const ordersReport = useQuery({
    queryKey: ['reports', 'orders', query],
    queryFn: () => getReport('orders', query),
    enabled: Boolean(from && to),
  });

  const kpis = indicators.data
    ? mapIndicatorsToKpis(indicators.data, {
        orders: t('orders'),
        revenue: t('revenue'),
        promotions: t('promotions'),
        loyaltyMembers: t('loyaltyMembers'),
      })
    : [];

  function exportCsv() {
    const rows = ordersReport.data ?? [];
    const header = Object.keys(rows[0] ?? { id: '' }).join(',');
    const body = rows.map((r) => Object.values(r).join(',')).join('\n');
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ListPageScaffold
      title={t('title')}
      actions={<button className="btn-primary" onClick={exportCsv}>{tCommon('exportCsv')}</button>}
      kpis={
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {indicators.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
            : kpis.map((kpi, i) => <KpiCard key={kpi.key} kpi={kpi} index={i} />)}
        </div>
      }
    >
      <div className="flex flex-wrap gap-3 p-4">
        <input className="input-soft !w-auto" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="input-soft !w-auto" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
    </ListPageScaffold>
  );
}
