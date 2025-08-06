import { DASHBOARD_OVERVIEW_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { DashboardOverview } from "@/types/dashboard";

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await api.get<DashboardOverview>(DASHBOARD_OVERVIEW_ROUTE());
  return response.data;
};
