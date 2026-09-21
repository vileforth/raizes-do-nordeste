'use client';

import { useMemo, useState } from 'react';
import type { ListQuery } from '@/lib/list-query';

export function useTableState(options?: { defaultPageSize?: number }) {
  const defaultPageSize = options?.defaultPageSize ?? 20;
  const [page, setPage] = useState(1);
  const [pageSize] = useState(defaultPageSize);
  const [search, setSearchValue] = useState('');
  const [orderBy, setOrderByValue] = useState<string | null>(null);

  function setSearch(value: string) {
    setSearchValue(value);
    setPage(1);
  }

  function setOrderBy(value: string | null) {
    setOrderByValue(value);
    setPage(1);
  }

  const params: ListQuery = useMemo(
    () => ({
      page,
      pageSize,
      search: search || undefined,
      orderBy: orderBy || undefined,
    }),
    [page, pageSize, search, orderBy],
  );

  return {
    page,
    pageSize,
    search,
    setSearch,
    orderBy,
    setOrderBy,
    setPage,
    params,
  };
}
