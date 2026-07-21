import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from './api/project';
import { projectKeys } from './queries';
import type { CreateProjectDto, UpdateProjectDto } from './model/types';

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      projectApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: projectKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
