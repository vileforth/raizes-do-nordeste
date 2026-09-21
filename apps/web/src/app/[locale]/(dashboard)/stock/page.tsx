'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/data-table';
import { DeleteAction } from '@/components/delete-action';
import { ListPageScaffold } from '@/components/list-page-scaffold';
import { Pagination } from '@/components/pagination';
import { useTableState } from '@/hooks/use-table-state';
import { getLowStock, removeStockProduct } from '@/services/stock';

export default function StockPage() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
  const { search, setSearch, setPage, params } = useTableState();
  const { data, isLoading } = useQuery({
    queryKey: ['stock', 'low', params],
    queryFn: () => getLowStock(params),
  });
  return (
    <ListPageScaffold
      title={t('stock')}
      actions={
        <input
          className="input-soft !w-48"
          placeholder={tCommon('search')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      }
    >
      <DataTable
        rows={data?.data ?? []}
        isLoading={isLoading}
        emptyMessage={tCommon('noResults')}
        rowKey={(r) => r.id}
        columns={[
          { key: 'product', header: 'Product', cell: (r) => r.productName },
          { key: 'qty', header: 'Qty', cell: (r) => r.quantity },
          { key: 'min', header: 'Min', cell: (r) => r.minimumStock },
          {
            key: 'actions',
            header: tCommon('actions'),
            align: 'right',
            cell: (row) => (
              <DeleteAction
                compact
                onRemove={() => removeStockProduct(String(row.id))}
                onDeleted={() => {
                  queryClient.invalidateQueries({ queryKey: ['stock'] });
                }}
              />
            ),
          },
        ]}
      />
      {data?.pagination ? <Pagination {...data.pagination} onPageChange={setPage} /> : null}
    </ListPageScaffold>
  );
}
