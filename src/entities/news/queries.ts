import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { newsApi } from './api/news';
import type { NewsListParams } from './model/types';

export const newsKeys = {
  all: ['news'] as const,
  list: (params: NewsListParams = {}) => ['news', 'list', params] as const,
  detail: (id: string) => ['news', 'detail', id] as const,
};

export function useNews(params: NewsListParams = {}) {
  return useQuery({
    queryKey: newsKeys.list(params),
    queryFn: () => newsApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useNewsDetail(id: string | undefined) {
  return useQuery({
    queryKey: newsKeys.detail(id ?? ''),
    queryFn: () => newsApi.getById(id as string),
    enabled: Boolean(id),
  });
}
