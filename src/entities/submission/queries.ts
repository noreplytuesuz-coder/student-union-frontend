import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { submissionApi } from './api/submission';
import type { SubmissionListParams } from './model/types';

export const submissionKeys = {
  all: ['submissions'] as const,
  list: (params: SubmissionListParams) =>
    ['submissions', 'list', params] as const,
  detail: (id: string) => ['submissions', 'detail', id] as const,
};

export function useSubmissions(params: SubmissionListParams = {}) {
  return useQuery({
    queryKey: submissionKeys.list(params),
    queryFn: () => submissionApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useSubmission(id: string | undefined) {
  return useQuery({
    queryKey: submissionKeys.detail(id ?? ''),
    queryFn: () => submissionApi.getById(id as string),
    enabled: Boolean(id),
  });
}
