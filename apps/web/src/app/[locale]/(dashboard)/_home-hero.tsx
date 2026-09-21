'use client';

import { CornersOut } from '@phosphor-icons/react';
import type { MapUnitPoint } from '@/components/geo-hero-map/map-types';
import { GeoHeroMap } from '@/components/geo-hero-map';
import { LiveBadge } from '@/components/live-badge';
import { GLASS_STRONG } from '@/lib/glass';
import type { DashboardPeriod } from '@/lib/helpers/dashboard-period';
import { FilterBar } from './_filter-bar';
import { HomeLegend } from './_home-legend';

export function HomeHero({
  points,
  clearLeft,
  period,
  onPeriod,
  onExpand,
  liveLabel,
  viewMapLabel,
  periodLabels,
  unitsLabel,
  activeLabel,
}: {
  points: MapUnitPoint[];
  clearLeft: number;
  period: DashboardPeriod;
  onPeriod: (period: DashboardPeriod) => void;
  onExpand: () => void;
  liveLabel: string;
  viewMapLabel: string;
  periodLabels: Record<DashboardPeriod, string>;
  unitsLabel: string;
  activeLabel: string;
}) {
  return (
    <div className="relative isolate h-[60vh] w-full">
      <GeoHeroMap points={points} interactive={false} leftInset={clearLeft} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 800,
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0) 45%, rgba(255,255,255,0.6) 75%, #fff 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-20 flex items-start justify-between gap-3 pr-4"
        style={{ zIndex: 810, paddingLeft: clearLeft }}
      >
        <LiveBadge label={liveLabel} />
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          <FilterBar value={period} onChange={onPeriod} labels={periodLabels} />
          <HomeLegend unitsLabel={unitsLabel} activeLabel={activeLabel} />
          <button
            type="button"
            onClick={onExpand}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold text-[var(--raizes-petrol)] backdrop-blur-xl transition-colors hover:bg-white"
            style={GLASS_STRONG}
          >
            <CornersOut size={15} />
            {viewMapLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
