'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { SectionCard } from '@/components/section-card';
import { DataTable } from '@/components/data-table';
import { getBenefits, getLoyaltyProgram } from '@/services/loyalty';

export default function LoyaltyPage() {
  const t = useTranslations('loyalty');
  const tCommon = useTranslations('common');
  const program = useQuery({ queryKey: ['loyalty', 'program'], queryFn: getLoyaltyProgram });
  const benefits = useQuery({ queryKey: ['loyalty', 'benefits'], queryFn: getBenefits });
  return (
    <div className="space-y-6">
      <h1 className="t-page-title">{t('title')}</h1>
      <SectionCard title={program.data?.name ?? t('title')}>
        <p className="text-sm text-[var(--raizes-text-secondary)]">{program.data?.description}</p>
      </SectionCard>
      <SectionCard title={t('benefits')}>
        <DataTable
          rows={benefits.data ?? []}
          isLoading={benefits.isLoading}
          emptyMessage={tCommon('noResults')}
          rowKey={(r) => r.id}
          columns={[
            { key: 'name', header: 'Name', cell: (r) => r.name },
            { key: 'points', header: t('points'), cell: (r) => r.pointsCost },
          ]}
        />
      </SectionCard>
    </div>
  );
}
