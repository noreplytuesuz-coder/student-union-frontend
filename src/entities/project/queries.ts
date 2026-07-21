import { useQuery } from '@tanstack/react-query';
import { projectApi } from './api/project';

export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', 'detail', id] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: () => projectApi.list(),
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: () => projectApi.getById(id as string),
    enabled: Boolean(id),
  });
}
