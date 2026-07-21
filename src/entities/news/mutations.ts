import { useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from './api/news';
import { newsKeys } from './queries';
import type { CreateNewsDto, UpdateNewsDto } from './model/types';

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsDto) => newsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
  });
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsDto }) =>
      newsApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: newsKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: newsKeys.all });
    },
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
  });
}
