import { useQuery } from '@tanstack/react-query';
import { userApi } from './api/user';

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => userApi.list(),
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: () => userApi.getById(id as string),
    enabled: Boolean(id),
  });
}
