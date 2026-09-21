'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { KpiCard, KpiCardSkeleton } from '@/components/kpi-card';
import { SectionCard } from '@/components/section-card';
import { mapIndicatorsToKpis } from '@/lib/helpers/kpi-mapper';
import { getIndicators } from '@/services/reports';

const ResponsiveLine = dynamic(() => import('@nivo/line').then((m) => m.ResponsiveLine), {
  ssr: false,
});

export default function DashboardPage() {
  const t = useTranslations('reports');
  const tNav = useTranslations('nav');
  const query = useQuery({
    queryKey: ['reports', 'indicators'],
    queryFn: () => getIndicators({}),
  });
  const kpis = query.data
    ? mapIndicatorsToKpis(query.data, {
        orders: t('orders'),
        revenue: t('revenue'),
        promotions: t('promotions'),
        loyaltyMembers: t('loyaltyMembers'),
      })
    : [];

  const chartData = [
    {
      id: 'orders',
      data: [
        { x: 'Mon', y: query.data?.orders ?? 0 },
        { x: 'Tue', y: Math.round((query.data?.orders ?? 0) * 0.8) },
        { x: 'Wed', y: Math.round((query.data?.orders ?? 0) * 1.1) },
        { x: 'Thu', y: Math.round((query.data?.orders ?? 0) * 0.9) },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="t-page-title">{tNav('dashboard')}</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {query.isLoading
          ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : kpis.map((kpi, i) => <KpiCard key={kpi.key} kpi={kpi} index={i} />)}
      </div>
      <SectionCard title={t('orders')}>
        <div className="h-64">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            axisBottom={{ tickSize: 0 }}
            axisLeft={{ tickSize: 0 }}
            colors={['#FF4B00']}
            pointSize={8}
            useMesh
          />
        </div>
      </SectionCard>
    </div>
  );
}
