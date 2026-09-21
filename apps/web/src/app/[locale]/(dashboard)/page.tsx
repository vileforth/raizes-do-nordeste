'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Storefront } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { AreaLineChart } from '@/components/charts/area-line-chart';
import { DailyBarChart } from '@/components/charts/daily-bar-chart';
import { FullscreenMap } from '@/components/fullscreen-map';
import type { MapUnitPoint } from '@/components/geo-hero-map/map-types';
import { KpiCard, KpiCardSkeleton } from '@/components/kpi-card';
import { HomeLegend } from './_home-legend';
import { HomeHero } from './_home-hero';
import {
  DEFAULT_PERIOD,
  periodToDays,
  periodToRange,
  type DashboardPeriod,
} from '@/lib/helpers/dashboard-period';
import {
  buildDailySeries,
  orderCountValue,
  orderRevenueValue,
  type OrderReportRow,
} from '@/lib/helpers/dashboard-series';
import { mapIndicatorsToKpis } from '@/lib/helpers/kpi-mapper';
import { getIndicators, getReport } from '@/services/reports';
import { unitsResource } from '@/services/units';
import { useSidebarClearLeft } from '@/components/sidebar';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const clearLeft = useSidebarClearLeft();
  const tReports = useTranslations('reports');
  const locale = useLocale();
  const [period, setPeriod] = useState<DashboardPeriod>(DEFAULT_PERIOD);
  const [expanded, setExpanded] = useState(false);
  const range = periodToRange(period);
  const days = periodToDays(period);

  const indicators = useQuery({
    queryKey: ['reports', 'indicators', range],
    queryFn: () => getIndicators(range),
  });
  const orders = useQuery({
    queryKey: ['reports', 'orders', range],
    queryFn: () => getReport('orders', range) as Promise<OrderReportRow[]>,
  });
  const units = unitsResource.useList({ page: 1, pageSize: 100 });
  const unitRows = units.data?.data ?? [];

  const points = useMemo<MapUnitPoint[]>(
    () =>
      unitRows
        .filter((unit) => unit.latitude != null && unit.longitude != null)
        .map((unit) => ({
          key: String(unit.id),
          name: unit.name,
          address: unit.address,
          lat: Number(unit.latitude),
          lng: Number(unit.longitude),
          active: unit.status === 'ATIVA',
        })),
    [unitRows],
  );

  const kpis = indicators.data
    ? [
        ...mapIndicatorsToKpis(indicators.data, {
          orders: tReports('orders'),
          revenue: tReports('revenue'),
          promotions: tReports('promotions'),
          loyaltyMembers: tReports('loyaltyMembers'),
        }),
        {
          key: 'units',
          Icon: Storefront,
          accent: 'var(--raizes-brand)',
          label: t('unitsKpi'),
          raw: units.data?.pagination.total ?? 0,
          format: (value: number) => value.toLocaleString(locale),
        },
      ]
    : [];

  const orderBars = useMemo(() => {
    const series = buildDailySeries(orders.data ?? [], days, orderCountValue);
    return series.map((point) => ({
      key: point.date,
      date: new Date(`${point.date}T00:00:00`),
      count: point.value,
    }));
  }, [orders.data, days]);
  const revenuePoints = useMemo(
    () => buildDailySeries(orders.data ?? [], days, orderRevenueValue),
    [orders.data, days],
  );
  const ordersTotal = orderBars.reduce((sum, bar) => sum + bar.count, 0);
  const revenueTotal = revenuePoints.reduce((sum, point) => sum + point.value, 0);
  const money = (value: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <>
      <h1 className="sr-only">{t('heading')}</h1>
      <div className="relative min-h-screen bg-white">
        <HomeHero
          points={points}
          clearLeft={clearLeft}
          period={period}
          onPeriod={setPeriod}
          onExpand={() => setExpanded(true)}
          liveLabel={t('live')}
          viewMapLabel={t('viewMap')}
          periodLabels={{ '7d': t('period7'), '30d': t('period30'), '90d': t('period90') }}
          unitsLabel={t('legendUnits')}
          activeLabel={t('legendActive')}
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative -mt-24 grid grid-cols-2 gap-2.5 pb-6 pr-4 sm:grid-cols-3 lg:grid-cols-5 sm:pr-6"
          style={{ paddingLeft: clearLeft }}
        >
          {indicators.isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <KpiCardSkeleton key={index} />
              ))
            : kpis.map((kpi, index) => (
                <KpiCard key={kpi.key} kpi={kpi} index={index} />
              ))}
        </motion.div>
        <div
          className="grid grid-cols-1 gap-2.5 pb-6 pr-4 md:grid-cols-2 sm:pr-6"
          style={{ paddingLeft: clearLeft }}
        >
          <DailyBarChart
            title={t('ordersChartTitle')}
            subtitle={t('ordersChartSubtitle', { days })}
            total={ordersTotal}
            totalLabel={t('ordersChartTotal')}
            bars={orderBars}
            loading={orders.isLoading}
            empty={t('ordersChartEmpty')}
            locale={locale}
          />
          <AreaLineChart
            title={t('revenueChartTitle')}
            subtitle={t('revenueChartSubtitle')}
            total={revenueTotal}
            totalLabel={t('revenueChartTotal')}
            points={revenuePoints}
            loading={orders.isLoading}
            empty={t('revenueChartEmpty')}
            locale={locale}
            formatTotal={money}
          />
        </div>
      </div>
      <AnimatePresence>
        {expanded ? (
          <FullscreenMap
            points={points}
            onClose={() => setExpanded(false)}
            backLabel={t('back')}
            controls={<HomeLegend unitsLabel={t('legendUnits')} activeLabel={t('legendActive')} />}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
