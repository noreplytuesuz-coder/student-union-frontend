import { apiClient } from '@/shared/api';
import type {
  Submission,
  SubmissionCreateDto,
  SubmissionListParams,
  SubmissionListResponse,
} from '../model/types';

export const submissionApi = {
  create: (data: SubmissionCreateDto) =>
    apiClient.post<Submission>('/submissions', data).then((r) => r.data),

  list: (params: SubmissionListParams = {}) =>
    apiClient
      .get<SubmissionListResponse>('/submissions', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Submission>(`/submissions/${id}`).then((r) => r.data),

  accept: (id: string) =>
    apiClient
      .patch<Submission>(`/submissions/${id}/accept`)
      .then((r) => r.data),

  reject: (id: string) =>
    apiClient
      .patch<Submission>(`/submissions/${id}/reject`)
      .then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/submissions/${id}`).then((r) => r.data),
};
