'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { FormField } from '@/components/form-field';
import { Pagination } from '@/components/pagination';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { useTableState } from '@/hooks/use-table-state';
import { useToast } from '@/providers/toast-provider';
import {
  benefitPoints,
  getBenefits,
  getClientLoyalty,
  getLoyaltyProgram,
  redeemBenefit,
} from '@/services/loyalty';

export default function LoyaltyPage() {
  const t = useTranslations('loyalty');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const [clientId, setClientId] = useState(1);
  const { setPage, params } = useTableState();
  const program = useQuery({ queryKey: ['loyalty', 'program'], queryFn: getLoyaltyProgram });
  const benefits = useQuery({
    queryKey: ['loyalty', 'benefits', params],
    queryFn: () => getBenefits(params),
  });
  const loyalty = useQuery({
    queryKey: ['loyalty', 'client', clientId],
    queryFn: () => getClientLoyalty(clientId),
    enabled: clientId > 0,
  });

  async function redeem(benefitId: number) {
    try {
      await redeemBenefit(benefitId, clientId);
      toast.success(tCommon('success'));
      loyalty.refetch();
    } catch {
      toast.error(tCommon('error'));
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="t-page-title">{t('title')}</h1>
      <SectionCard title={program.data?.name ?? t('title')}>
        <div className="flex flex-wrap items-center gap-2">
          {program.data?.status ? <StatusBadge status={program.data.status} /> : null}
          <p className="text-sm text-[var(--raizes-text-secondary)]">{program.data?.description}</p>
        </div>
        <div className="mt-4 max-w-xs">
          <FormField label={t('clientId')}>
            <input
              className="input-soft w-full"
              type="number"
              value={String(clientId)}
              onChange={(event) => setClientId(Number(event.target.value))}
            />
          </FormField>
        </div>
        {loyalty.data ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <StatusBadge status={loyalty.data.level} />
            {loyalty.data.status ? <StatusBadge status={loyalty.data.status} /> : null}
            <span>
              {t('points')}: {loyalty.data.pointsBalance}
            </span>
          </div>
        ) : null}
      </SectionCard>
      <SectionCard title={t('benefits')}>
        <DataTable
          rows={benefits.data?.data ?? []}
          isLoading={benefits.isLoading}
          emptyMessage={tCommon('noResults')}
          rowKey={(r) => r.id}
          columns={[
            { key: 'name', header: t('benefit'), cell: (r) => r.name },
            { key: 'points', header: t('points'), cell: (r) => benefitPoints(r) },
            {
              key: 'redeem',
              header: tCommon('actions'),
              cell: (r) => (
                <button type="button" className="btn-primary" onClick={() => redeem(r.id)}>
                  {t('redeem')}
                </button>
              ),
            },
          ]}
        />
        {benefits.data?.pagination ? (
          <Pagination {...benefits.data.pagination} onPageChange={setPage} />
        ) : null}
      </SectionCard>
    </div>
  );
}
