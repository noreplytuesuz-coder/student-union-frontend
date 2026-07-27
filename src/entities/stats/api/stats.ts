import { apiClient } from "@/shared/api";
import { StatsResponse } from "../model/types";

export const statsApi = {
  list: () => apiClient.get<StatsResponse>("/stats").then((r) => r.data),
};
