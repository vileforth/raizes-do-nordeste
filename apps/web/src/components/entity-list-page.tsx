'use client';

import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { ListPageScaffold } from '@/components/list-page-scaffold';
import type { Column } from '@/components/data-table/data-table.types';
import { useTableState } from '@/hooks/use-table-state';

type Props<T> = {
  title: string;
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  isLoading: boolean;
  emptyMessage: string;
  detailPath?: (row: T) => string;
  actions?: React.ReactNode;
};

export function EntityListPage<T>({
  title,
  rows,
  columns,
  rowKey,
  isLoading,
  emptyMessage,
  detailPath,
  actions,
}: Props<T>) {
  const router = useRouter();
  const { search, setSearch, orderBy, setOrderBy } = useTableState();
  const filtered = rows.filter((row) => {
    if (!search) return true;
    return JSON.stringify(row).toLowerCase().includes(search.toLowerCase());
  });

  return (
    <ListPageScaffold
      title={title}
      actions={
        <div className="flex items-center gap-2">
          <input
            className="input-soft !w-48"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {actions}
        </div>
      }
    >
      <DataTable
        rows={filtered}
        columns={columns}
        rowKey={rowKey}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        orderBy={orderBy}
        onOrderByChange={setOrderBy}
        onRowClick={detailPath ? (row) => router.push(detailPath(row)) : undefined}
      />
    </ListPageScaffold>
  );
}
