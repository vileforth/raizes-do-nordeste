'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { ListQuery } from '@/lib/list-query';

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type Paginated<T> = {
  data: T[];
  pagination: PaginationMeta;
};

type ResourceFns<TItem, TListParams, TCreateInput, TUpdateInput> = {
  list: (params?: TListParams) => Promise<Paginated<TItem>>;
  detail?: (id: string) => Promise<TItem>;
  create?: (input: TCreateInput) => Promise<TItem>;
  update?: (id: string, input: TUpdateInput) => Promise<TItem>;
  remove?: (id: string) => Promise<void>;
};

export function createResource<
  TItem,
  TListParams extends ListQuery = ListQuery,
  TCreateInput = Partial<TItem>,
  TUpdateInput = Partial<TItem>,
>(
  resourceKey: string,
  fns: ResourceFns<TItem, TListParams, TCreateInput, TUpdateInput>,
) {
  function useList(
    params?: TListParams,
    options?: Omit<UseQueryOptions<Paginated<TItem>, Error>, 'queryKey' | 'queryFn'>,
  ) {
    return useQuery<Paginated<TItem>, Error>({
      queryKey: queryKeys.list(resourceKey, params),
      queryFn: () => fns.list(params),
      ...options,
    });
  }

  function useDetail(
    id: string | undefined,
    options?: Omit<UseQueryOptions<TItem, Error>, 'queryKey' | 'queryFn'>,
  ) {
    return useQuery<TItem, Error>({
      queryKey: queryKeys.detail(resourceKey, id ?? ''),
      queryFn: () => {
        if (!fns.detail) throw new Error(`${resourceKey}.detail not configured`);
        if (!id) throw new Error('id required');
        return fns.detail(id);
      },
      enabled: Boolean(id) && Boolean(fns.detail),
      ...options,
    });
  }

  function useCreate(
    options?: UseMutationOptions<TItem, Error, TCreateInput>,
  ) {
    const qc = useQueryClient();
    return useMutation<TItem, Error, TCreateInput>({
      mutationFn: (input) => {
        if (!fns.create) throw new Error(`${resourceKey}.create not configured`);
        return fns.create(input);
      },
      onSuccess: (...args) => {
        qc.invalidateQueries({ queryKey: queryKeys.lists(resourceKey) });
        options?.onSuccess?.(...args);
      },
      ...options,
    });
  }

  function useUpdate(
    options?: UseMutationOptions<TItem, Error, { id: string; input: TUpdateInput }>,
  ) {
    const qc = useQueryClient();
    return useMutation<TItem, Error, { id: string; input: TUpdateInput }>({
      mutationFn: ({ id, input }) => {
        if (!fns.update) throw new Error(`${resourceKey}.update not configured`);
        return fns.update(id, input);
      },
      onSuccess: (...args) => {
        qc.invalidateQueries({ queryKey: queryKeys.lists(resourceKey) });
        qc.invalidateQueries({ queryKey: queryKeys.detail(resourceKey, args[1].id) });
        options?.onSuccess?.(...args);
      },
      ...options,
    });
  }

  function useRemove(options?: UseMutationOptions<void, Error, string>) {
    const qc = useQueryClient();
    return useMutation<void, Error, string>({
      mutationFn: (id) => {
        if (!fns.remove) throw new Error(`${resourceKey}.remove not configured`);
        return fns.remove(id);
      },
      onSuccess: (...args) => {
        qc.invalidateQueries({ queryKey: queryKeys.lists(resourceKey) });
        options?.onSuccess?.(...args);
      },
      ...options,
    });
  }

  return { useList, useDetail, useCreate, useUpdate, useRemove, key: resourceKey };
}
