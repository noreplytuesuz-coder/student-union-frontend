import { apiClient } from '@/shared/api';
import type { CreateDocumentDto, Doc, UpdateDocumentDto } from '../model/types';

export const documentApi = {
  list: () => apiClient.get<Doc[]>('/documents').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Doc>(`/documents/${id}`).then((r) => r.data),

  create: (data: CreateDocumentDto) =>
    apiClient.post<Doc>('/documents', data).then((r) => r.data),

  update: (id: string, data: UpdateDocumentDto) =>
    apiClient.patch<Doc>(`/documents/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/documents/${id}`).then((r) => r.data),
};
