import { useQuery } from '@tanstack/react-query';
import { partnerApi } from './api/partner';

export const partnerKeys = {
  all: ['partners'] as const,
};

export function usePartners() {
  return useQuery({
    queryKey: partnerKeys.all,
    queryFn: () => partnerApi.list(),
  });
}
