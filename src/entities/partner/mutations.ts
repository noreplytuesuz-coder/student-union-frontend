import { useMutation, useQueryClient } from '@tanstack/react-query';
import { partnerApi } from './api/partner';
import { partnerKeys } from './queries';
import type { CreatePartnerDto, UpdatePartnerDto } from './model/types';

export function useCreatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePartnerDto) => partnerApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: partnerKeys.all }),
  });
}

export function useUpdatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartnerDto }) =>
      partnerApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: partnerKeys.all }),
  });
}

export function useDeletePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: partnerKeys.all }),
  });
}
