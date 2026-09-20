'use client';

import { useMemo, useState } from 'react';

export function useTableState<T extends Record<string, unknown>>(
  initial: T = {} as T,
) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<T>(initial);
  const [orderBy, setOrderBy] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      ...filters,
      search: search || undefined,
      orderBy: orderBy || undefined,
    }),
    [filters, search, orderBy],
  );

  return {
    search,
    setSearch,
    filters,
    setFilters,
    orderBy,
    setOrderBy,
    params,
  };
}
