import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { statsApi } from "./api/stats";

export const statsKeys = {
  all: ["stats"] as const,
  list: () => ["stats", "list"] as const,
};

export function useStats() {
  return useQuery({
    queryKey: statsKeys.list(),
    queryFn: () => statsApi.list(),
    placeholderData: keepPreviousData,
  });
}
