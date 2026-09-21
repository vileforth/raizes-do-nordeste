'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/data-table';
import { DeleteAction } from '@/components/delete-action';
import { ListPageScaffold } from '@/components/list-page-scaffold';
import { Pagination } from '@/components/pagination';
import type { Column } from '@/components/data-table/data-table.types';
import { useTableState } from '@/hooks/use-table-state';
import type { ListQuery } from '@/lib/list-query';
import type { Paginated } from '@/services/_factory/create-resource';

type ListResult<T> = {
  data?: Paginated<T>;
  isLoading: boolean;
};

type RemoveResult = {
  mutateAsync: (id: string) => Promise<unknown>;
};

type Props<T> = {
  title: string;
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  emptyMessage: string;
  detailPath?: (row: T) => string;
  actions?: React.ReactNode;
  useList: (params?: ListQuery) => ListResult<T>;
  useRemove: () => RemoveResult;
  getRowId?: (row: T) => string;
};

export function EntityListPage<T>({
  title,
  columns,
  rowKey,
  emptyMessage,
  detailPath,
  actions,
  useList,
  useRemove,
  getRowId = (row) => String(rowKey(row)),
}: Props<T>) {
  const router = useRouter();
  const t = useTranslations('common');
  const { search, setSearch, orderBy, setOrderBy, setPage, params } = useTableState();
  const { data, isLoading } = useList(params);
  const remove = useRemove();
  const rows = data?.data ?? [];
  const pagination = data?.pagination;
  const tableColumns: Column<T>[] = [
    ...columns,
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      cell: (row) => (
        <DeleteAction onRemove={() => remove.mutateAsync(getRowId(row))} compact />
      ),
    },
  ];

  return (
    <ListPageScaffold
      title={title}
      actions={
        <div className="flex items-center gap-2">
          <input
            className="input-soft !w-48"
            placeholder={t('search')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {actions}
        </div>
      }
    >
      <DataTable
        rows={rows}
        columns={tableColumns}
        rowKey={rowKey}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        orderBy={orderBy}
        onOrderByChange={setOrderBy}
        onRowClick={detailPath ? (row) => router.push(detailPath(row)) : undefined}
      />
      {pagination ? (
        <Pagination {...pagination} onPageChange={setPage} />
      ) : null}
    </ListPageScaffold>
  );
}
