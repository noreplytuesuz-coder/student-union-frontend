import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { documentApi } from './api/document';

export const documentKeys = {
  all: ['documents'] as const,
  detail: (id: string) => ['documents', 'detail', id] as const,
};

export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.all,
    queryFn: () => documentApi.list(),
    placeholderData: keepPreviousData,
  });
}

export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: documentKeys.detail(id ?? ''),
    queryFn: () => documentApi.getById(id as string),
    enabled: Boolean(id),
  });
}
