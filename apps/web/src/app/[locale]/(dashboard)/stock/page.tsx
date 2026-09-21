'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { DeleteAction } from '@/components/delete-action';
import { ListPageScaffold } from '@/components/list-page-scaffold';
import { Pagination } from '@/components/pagination';
import { useTableState } from '@/hooks/use-table-state';
import { getStock, removeStockProduct } from '@/services/stock';
import { unitsResource } from '@/services/units';

export default function StockPage() {
  const t = useTranslations('stock');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
  const { search, setSearch, setPage, params } = useTableState();
  const [unitId, setUnitId] = useState('');
  const units = unitsResource.useList({ page: 1, pageSize: 100 });
  const query = useMemo(
    () => ({ ...params, unitId: unitId ? Number(unitId) : undefined }),
    [params, unitId],
  );
  const { data, isLoading } = useQuery({
    queryKey: ['stock', 'list', query],
    queryFn: () => getStock(query),
  });

  return (
    <ListPageScaffold
      title={t('title')}
      actions={
        <div className="flex items-center gap-2">
          <select
            className="input-soft !w-48"
            value={unitId}
            onChange={(event) => {
              setUnitId(event.target.value);
              setPage(1);
            }}
          >
            <option value="">{t('allUnits')}</option>
            {(units.data?.data ?? []).map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
          <input
            className="input-soft !w-48"
            placeholder={tCommon('search')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      }
    >
      <DataTable
        rows={data?.data ?? []}
        isLoading={isLoading}
        emptyMessage={tCommon('noResults')}
        rowKey={(row) => row.id}
        columns={[
          { key: 'product', header: t('product'), cell: (row) => row.productName },
          { key: 'unit', header: t('unit'), cell: (row) => row.unitName },
          { key: 'qty', header: t('quantity'), cell: (row) => row.quantity },
          { key: 'min', header: t('minimum'), cell: (row) => row.minimumStock },
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
