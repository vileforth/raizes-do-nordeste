'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EntityListPage } from '@/components/entity-list-page';
import { StatusBadge } from '@/components/status-badge';
import { formatMoney } from '@/lib/helpers/money';
import { orderStatusTone } from '@/lib/helpers/order-status';
import { ordersResource } from '@/services/orders';

export default function OrdersPage() {
  const t = useTranslations('orders');
  const tCommon = useTranslations('common');
  const { data = [], isLoading } = ordersResource.useList();
  return (
    <EntityListPage
      title={t('title')}
      rows={data}
      isLoading={isLoading}
      emptyMessage={tCommon('noResults')}
      rowKey={(r) => r.id}
      detailPath={(r) => `/orders/${r.id}`}
      actions={
        <Link href="/orders/new" className="btn-primary">{t('new')}</Link>
      }
      columns={[
        { key: 'code', header: t('code'), cell: (r) => r.orderCode },
        { key: 'status', header: t('status'), cell: (r) => (
          <StatusBadge label={r.status} tone={orderStatusTone(r.status)} />
        )},
        { key: 'total', header: t('total'), cell: (r) => formatMoney(r.totalValue) },
      ]}
    />
  );
}
