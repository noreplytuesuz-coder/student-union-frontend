import { apiClient } from '@/shared/api';
import type {
  CreateNewsDto,
  News,
  NewsListParams,
  NewsListResponse,
  UpdateNewsDto,
} from '../model/types';

export const newsApi = {
  list: (params: NewsListParams = {}) =>
    apiClient
      .get<NewsListResponse>('/news', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<News>(`/news/${id}`).then((r) => r.data),

  create: (data: CreateNewsDto) =>
    apiClient.post<News>('/news', data).then((r) => r.data),

  update: (id: string, data: UpdateNewsDto) =>
    apiClient.patch<News>(`/news/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<null>(`/news/${id}`).then((r) => r.data),
};
