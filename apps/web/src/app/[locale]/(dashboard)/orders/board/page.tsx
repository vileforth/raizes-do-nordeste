'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GlassPanel } from '@/components/glass-panel';
import { StatusBadge } from '@/components/status-badge';
import { ORDER_STATUSES, orderStatusTone } from '@/lib/helpers/order-status';
import { ordersResource } from '@/services/orders';

export default function OrdersBoardPage() {
  const t = useTranslations('orders');
  const { data = [], isLoading } = ordersResource.useList();
  const columns = ORDER_STATUSES.map((status) => ({
    status,
    items: data.filter((o) => o.status === status),
  }));

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-black/5" />;

  return (
    <div className="space-y-4">
      <h1 className="t-page-title">{t('board')}</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => (
          <GlassPanel key={col.status}>
            <div className="mb-3 flex items-center justify-between">
              <StatusBadge label={col.status} tone={orderStatusTone(col.status)} />
              <span className="text-xs text-[var(--raizes-text-secondary)]">{col.items.length}</span>
            </div>
            <div className="space-y-2">
              {col.items.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`} className="block rounded-lg border border-[var(--raizes-border)] p-3 text-sm row-hover">
                  <p className="font-medium">{order.orderCode}</p>
                  <p className="text-xs text-[var(--raizes-text-secondary)]">{order.totalValue.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
