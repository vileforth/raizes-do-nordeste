'use client';

import { Skeleton } from '@heroui/react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import type { Column, DataTableProps } from './data-table.types';

function SortIndicator({ desc }: { desc: boolean }) {
  return desc ? <CaretDown size={12} /> : <CaretUp size={12} />;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  orderBy,
  onOrderByChange,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-[var(--raizes-text-secondary)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13.5px]">
        <thead className="border-b border-[var(--raizes-border)] bg-[rgba(7,47,51,0.04)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2.5 text-left text-[12px] font-medium text-[var(--raizes-text-secondary)]"
                style={{ width: col.width, textAlign: col.align, cursor: col.sortable ? 'pointer' : undefined }}
                onClick={() => {
                  if (!col.sortable || !onOrderByChange) return;
                  const current = orderBy?.replace(/^-/, '');
                  const isDesc = orderBy?.startsWith('-');
                  if (current !== col.key) onOrderByChange(`-${col.key}`);
                  else if (isDesc) onOrderByChange(col.key);
                  else onOrderByChange(null);
                }}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && orderBy?.replace(/^-/, '') === col.key && (
                    <SortIndicator desc={orderBy.startsWith('-')} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className="row-hover"
              style={{
                cursor: onRowClick ? 'pointer' : undefined,
                borderBottom: i < rows.length - 1 ? '1px solid var(--raizes-border)' : undefined,
              }}
            >
              {columns.map((col: Column<T>) => (
                <td
                  key={col.key}
                  className="px-4 py-3.5 align-middle text-[var(--raizes-text-primary)]"
                  style={{ textAlign: col.align }}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
