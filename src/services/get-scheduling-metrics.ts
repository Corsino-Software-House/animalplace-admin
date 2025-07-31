import { API_ENDPOINTS } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { SchedulingMetrics } from "@/types/dashboard";

export const getSchedulingMetrics = async (): Promise<SchedulingMetrics> => {
  const response = await api.get<SchedulingMetrics>(API_ENDPOINTS.DASHBOARD_SCHEDULING);
  return response.data;
};
