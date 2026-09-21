'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/data-table';
import { ListPageScaffold } from '@/components/list-page-scaffold';
import { getLowStock } from '@/services/stock';

export default function StockPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { data = [], isLoading } = useQuery({
    queryKey: ['stock', 'low'],
    queryFn: getLowStock,
  });
  return (
    <ListPageScaffold title={t('stock')}>
      <DataTable
        rows={data}
        isLoading={isLoading}
        emptyMessage={tCommon('noResults')}
        rowKey={(r) => r.id}
        columns={[
          { key: 'product', header: 'Product', cell: (r) => r.productName },
          { key: 'qty', header: 'Qty', cell: (r) => r.quantity },
          { key: 'min', header: 'Min', cell: (r) => r.minimumStock },
        ]}
      />
    </ListPageScaffold>
  );
}
