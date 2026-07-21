import { apiClient } from '@/shared/api';
import type {
  CreateProjectDto,
  Project,
  UpdateProjectDto,
} from '../model/types';

export const projectApi = {
  list: () => apiClient.get<Project[]>('/projects').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Project>(`/projects/${id}`).then((r) => r.data),

  create: (data: CreateProjectDto) =>
    apiClient.post<Project>('/projects', data).then((r) => r.data),

  update: (id: string, data: UpdateProjectDto) =>
    apiClient.patch<Project>(`/projects/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/projects/${id}`).then((r) => r.data),
};
