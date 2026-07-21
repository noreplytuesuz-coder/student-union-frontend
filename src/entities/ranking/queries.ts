import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { rankingApi } from './api/ranking';
import type { RankingParams } from './model/types';

export const rankingKeys = {
  all: ['ranking'] as const,
  list: (params: RankingParams) => ['ranking', 'list', params] as const,
};

export function useRanking(params: RankingParams = {}) {
  return useQuery({
    queryKey: rankingKeys.list(params),
    queryFn: () => rankingApi.list(params),
    placeholderData: keepPreviousData,
  });
}
