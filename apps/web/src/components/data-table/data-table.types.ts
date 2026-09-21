import type { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
};

export type DataTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  orderBy?: string | null;
  onOrderByChange?: (value: string | null) => void;
};
