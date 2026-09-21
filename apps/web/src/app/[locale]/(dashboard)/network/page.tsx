'use client';

import { useTranslations } from 'next-intl';
import { GlassPanel } from '@/components/glass-panel';
import { unitsResource } from '@/services/units';

export default function NetworkPage() {
  const t = useTranslations('nav');
  const { data = [], isLoading } = unitsResource.useList();
  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-black/5" />;
  return (
    <div className="space-y-6">
      <h1 className="t-page-title">{t('network')}</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((unit) => (
          <GlassPanel key={unit.id}>
            <p className="font-semibold">{unit.name}</p>
            <p className="mt-1 text-sm text-[var(--raizes-text-secondary)]">{unit.address}</p>
            <p className="mt-2 text-xs">{unit.status}</p>
            {unit.latitude && unit.longitude && (
              <p className="mt-1 text-xs text-[var(--raizes-text-secondary)]">
                {unit.latitude.toFixed(4)}, {unit.longitude.toFixed(4)}
              </p>
            )}
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
