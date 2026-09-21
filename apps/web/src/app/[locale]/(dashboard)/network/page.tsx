'use client';

import { useTranslations } from 'next-intl';
import { GlassPanel } from '@/components/glass-panel';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { useTableState } from '@/hooks/use-table-state';
import { unitsResource } from '@/services/units';

export default function NetworkPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { search, setSearch, setPage, params } = useTableState();
  const { data, isLoading } = unitsResource.useList(params);
  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-black/5" />;
  const units = data?.data ?? [];
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="t-page-title">{t('network')}</h1>
        <input
          className="input-soft !w-48"
          placeholder={tCommon('search')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit) => (
          <GlassPanel key={unit.id}>
            <p className="font-semibold">{unit.name}</p>
            <p className="mt-1 text-sm text-[var(--raizes-text-secondary)]">{unit.address}</p>
            <div className="mt-2"><StatusBadge status={unit.status} /></div>
            {unit.latitude && unit.longitude && (
              <p className="mt-1 text-xs text-[var(--raizes-text-secondary)]">
                {unit.latitude.toFixed(4)}, {unit.longitude.toFixed(4)}
              </p>
            )}
          </GlassPanel>
        ))}
      </div>
      {data?.pagination ? <Pagination {...data.pagination} onPageChange={setPage} /> : null}
    </div>
  );
}
