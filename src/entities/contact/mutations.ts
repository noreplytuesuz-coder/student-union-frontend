import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi } from './api/contact';
import { contactKeys } from './queries';
import type { ContactCreateDto } from './model/types';

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactCreateDto) => contactApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactKeys.all }),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactKeys.all }),
  });
}
