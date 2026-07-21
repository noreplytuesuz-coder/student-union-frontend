import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionApi } from './api/submission';
import { submissionKeys } from './queries';
import type { SubmissionCreateDto } from './model/types';

export function useCreateSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmissionCreateDto) => submissionApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: submissionKeys.all }),
  });
}

export function useAcceptSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submissionApi.accept(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: submissionKeys.all }),
  });
}

export function useRejectSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submissionApi.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: submissionKeys.all }),
  });
}

export function useDeleteSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submissionApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: submissionKeys.all }),
  });
}
