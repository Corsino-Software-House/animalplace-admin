import { DASHBOARD_SCHEDULING_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { SchedulingMetrics } from "@/types/dashboard";

export const getSchedulingMetrics = async (): Promise<SchedulingMetrics> => {
  const response = await api.get<SchedulingMetrics>(DASHBOARD_SCHEDULING_ROUTE());
  return response.data;
};
