'use client';

import { useTranslations } from 'next-intl';
import { ORDER_STATUSES } from '@/lib/helpers/order-status';
import { OrdersBoardColumn } from './_column';

export default function OrdersBoardPage() {
  const t = useTranslations('orders');
  return (
    <div className="space-y-4">
      <h1 className="t-page-title">{t('board')}</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ORDER_STATUSES.map((status) => (
          <OrdersBoardColumn key={status} status={status} />
        ))}
      </div>
    </div>
  );
}
