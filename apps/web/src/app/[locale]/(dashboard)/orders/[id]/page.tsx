'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@heroui/react';
import { useParams } from 'next/navigation';
import { useMessages, useTranslations } from 'next-intl';
import { useState } from 'react';
import { ResourceDeleteButton } from '@/components/resource-delete-button';
import { SectionCard } from '@/components/section-card';
import { StatusBadge } from '@/components/status-badge';
import { formatMoney } from '@/lib/helpers/money';
import { getNextOrderStatus } from '@/lib/helpers/order-status';
import { useToast } from '@/providers/toast-provider';
import { getOrderStatusHistory, ordersResource, updateOrderStatus } from '@/services/orders';
import { confirmPayment, createPayment } from '@/services/payments';

const PAYMENT_METHODS = ['PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO'] as const;

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const messages = useMessages() as { status?: Record<string, string> };
  const statusLabel = (code: string) => messages.status?.[code] ?? code;
  const toast = useToast();
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]>('PIX');
  const { data, isLoading, refetch } = ordersResource.useDetail(id);
  const history = useQuery({
    queryKey: ['orders', id, 'status'],
    queryFn: () => getOrderStatusHistory(id),
    enabled: Boolean(id),
  });

  async function advanceStatus() {
    if (!data) return;
    const next = getNextOrderStatus(data.status as 'RECEBIDO');
    if (!next) return;
    try {
      await updateOrderStatus(id, next);
      toast.success(tCommon('success'));
      refetch();
      history.refetch();
    } catch {
      toast.error(tCommon('error'));
    }
  }

  async function pay() {
    if (!data) return;
    try {
      const payment = data.payment
        ? data.payment
        : await createPayment(data.id, method);
      if (payment.status !== 'CONFIRMADO') {
        await confirmPayment(payment.id);
      }
      toast.success(tCommon('success'));
      refetch();
    } catch {
      toast.error(tCommon('error'));
    }
  }

  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-black/5" />;
  if (!data) return null;

  const nextStatus = getNextOrderStatus(data.status as 'RECEBIDO');

  return (
    <div className="space-y-6">
      <SectionCard
        title={`${t('detail')} ${data.orderCode}`}
        actions={
          <div className="flex items-center gap-2">
            {nextStatus ? (
              <Button size="sm" onPress={advanceStatus}>
                {statusLabel(nextStatus)}
              </Button>
            ) : null}
            <ResourceDeleteButton id={id} href="/orders" useRemove={ordersResource.useRemove} />
          </div>
        }
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="t-eyebrow">{t('status')}</dt>
            <dd>
              <StatusBadge status={data.status} />
            </dd>
          </div>
          <div>
            <dt className="t-eyebrow">{t('type')}</dt>
            <dd><StatusBadge status={data.consumptionType} /></dd>
          </div>
          <div>
            <dt className="t-eyebrow">{t('total')}</dt>
            <dd>{formatMoney(data.totalValue)}</dd>
          </div>
        </dl>
      </SectionCard>
      <SectionCard title={t('items')}>
        <ul className="space-y-2 text-sm">
          {(data.items ?? []).map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                #{item.productId} x {item.quantity}
              </span>
              <span>{formatMoney(item.subtotal)}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard title={t('payment')}>
        {data.payment ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <StatusBadge status={data.payment.method} />
            <StatusBadge status={data.payment.status} />
            <span className="text-[var(--raizes-text-secondary)]">{data.payment.transactionCode}</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-3">
            <select className="input-soft" value={method} onChange={(event) => setMethod(event.target.value as typeof method)}>
              {PAYMENT_METHODS.map((value) => (
                <option key={value} value={value}>
                  {statusLabel(value)}
                </option>
              ))}
            </select>
            <Button onPress={pay}>{t('pay')}</Button>
          </div>
        )}
        {data.payment?.status === 'PENDENTE' ? (
          <Button className="mt-3" onPress={pay}>
            {t('confirmPayment')}
          </Button>
        ) : null}
      </SectionCard>
      <SectionCard title={t('history')}>
        <ol className="space-y-2 text-sm">
          {(history.data ?? []).map((entry) => (
            <li key={entry.id} className="flex items-center gap-2">
              <StatusBadge status={entry.status} />
              <span className="text-[var(--raizes-text-secondary)]">
                {new Date(entry.occurredAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      </SectionCard>
    </div>
  );
}
