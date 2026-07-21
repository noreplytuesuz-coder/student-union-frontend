import { apiClient } from '@/shared/api';
import type {
  CleanResponse,
  DashboardResponse,
} from '../model/types';

export const dashboardApi = {
  stats: () =>
    apiClient.get<DashboardResponse>('/dashboard').then((r) => r.data),

  clean: () =>
    apiClient.post<CleanResponse>('/dashboard/clean').then((r) => r.data),
};
