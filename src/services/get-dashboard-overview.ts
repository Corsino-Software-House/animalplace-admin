import { API_ENDPOINTS } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { DashboardOverview } from "@/types/dashboard";

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await api.get<DashboardOverview>(API_ENDPOINTS.DASHBOARD_OVERVIEW);
  return response.data;
};
