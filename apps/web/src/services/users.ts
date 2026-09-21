import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import { queryKeys } from '@/lib/query-keys';
import { createResource, type Paginated } from './_factory/create-resource';

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  profiles: string[];
};

export type CreateUserInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  profileNames: string[];
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
};

export const usersResource = createResource<User, ListQuery, CreateUserInput, UpdateUserInput>(
  'users',
  {
    list: (params?: ListQuery) => apiGet<Paginated<User>>(`/users${toQueryString(params)}`),
    detail: (id) => apiGet<User>(`/users/${id}`),
    create: (input) => apiPost<User>('/users', input),
    update: (id, input) => apiPut<User>(`/users/${id}`, input),
    remove: (id) => apiDelete(`/users/${id}`),
  },
);

export function useUpdateUserProfiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, profileNames }: { id: string; profileNames: string[] }) =>
      apiPut<User>(`/users/${id}/profiles`, { profileNames }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists('users') });
      queryClient.invalidateQueries({ queryKey: queryKeys.detail('users', variables.id) });
    },
  });
}
