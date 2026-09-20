'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@heroui/react';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { getNextOrderStatus, orderStatusTone } from '@/lib/helpers/order-status';
import { useToast } from '@/providers/toast-provider';
import { ordersResource, updateOrderStatus } from '@/services/orders';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const toast = useToast();
  const { data, isLoading, refetch } = ordersResource.useDetail(id);

  async function advanceStatus() {
    if (!data) return;
    const next = getNextOrderStatus(data.status as 'RECEBIDO');
    if (!next) return;
    try {
      await updateOrderStatus(id, next);
      toast.success(tCommon('success'));
      refetch();
    } catch {
      toast.error(tCommon('error'));
    }
  }

  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;
  return (
    <SectionCard title={t('detail')} actions={
      getNextOrderStatus(data.status as 'RECEBIDO') ? (
        <Button size="sm" color="primary" onPress={advanceStatus}>Advance</Button>
      ) : null
    }>
      <dl className="grid gap-3 text-sm">
        <div><dt className="t-eyebrow">{t('code')}</dt><dd>{data.orderCode}</dd></div>
        <div><dt className="t-eyebrow">{t('status')}</dt><dd><StatusBadge label={data.status} tone={orderStatusTone(data.status)} /></dd></div>
        <div><dt className="t-eyebrow">{t('total')}</dt><dd>{data.totalValue}</dd></div>
      </dl>
    </SectionCard>
  );
}
