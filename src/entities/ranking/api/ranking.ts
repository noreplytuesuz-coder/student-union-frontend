import { apiClient } from '@/shared/api';
import type { RankingParams, RankingResponse } from '../model/types';

export const rankingApi = {
  list: (params: RankingParams = {}) =>
    apiClient
      .get<RankingResponse>('/ranking', { params })
      .then((r) => r.data),
};
