import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from './api/user';
import { userKeys } from './queries';
import type { CreateUserDto, UpdateUserDto } from './model/types';

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDto) => userApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: userKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}
