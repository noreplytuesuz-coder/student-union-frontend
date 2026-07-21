import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from './api/dashboard';
import { dashboardKeys } from './queries';

export function useCleanDashboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => dashboardApi.clean(),
    onSuccess: () => qc.invalidateQueries({ queryKey: dashboardKeys.all }),
  });
}
