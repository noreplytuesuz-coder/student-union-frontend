import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi } from './api/document';
import { documentKeys } from './queries';
import type { CreateDocumentDto, UpdateDocumentDto } from './model/types';

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDocumentDto) => documentApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.all }),
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentDto }) =>
      documentApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: documentKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: documentKeys.all });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.all }),
  });
}
