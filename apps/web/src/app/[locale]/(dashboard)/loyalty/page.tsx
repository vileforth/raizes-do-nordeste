'use client';

import { useQuery } from '@tanstack/react-query';
import { Button, Input } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { FormField } from '@/components/form-field';
import { SectionCard } from '@/components/section-card';
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
  const program = useQuery({ queryKey: ['loyalty', 'program'], queryFn: getLoyaltyProgram });
  const benefits = useQuery({ queryKey: ['loyalty', 'benefits'], queryFn: getBenefits });
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
        <p className="text-sm text-[var(--raizes-text-secondary)]">{program.data?.description}</p>
        <div className="mt-4 max-w-xs">
          <FormField label={t('clientId')}>
            <Input
              type="number"
              value={String(clientId)}
              onChange={(event) => setClientId(Number(event.target.value))}
            />
          </FormField>
        </div>
        {loyalty.data ? (
          <p className="mt-4 text-sm">
            {t('level')}: {loyalty.data.level} · {t('points')}: {loyalty.data.pointsBalance}
          </p>
        ) : null}
      </SectionCard>
      <SectionCard title={t('benefits')}>
        <DataTable
          rows={benefits.data ?? []}
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
                <Button size="sm" onPress={() => redeem(r.id)}>
                  {t('redeem')}
                </Button>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
