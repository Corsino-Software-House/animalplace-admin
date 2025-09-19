import { DASHBOARD_RECENT_ACTIVITY_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { RecentActivity } from "@/types/dashboard";

export const getRecentActivity = async (): Promise<RecentActivity[]> => {
  const response = await api.get<RecentActivity[]>(DASHBOARD_RECENT_ACTIVITY_ROUTE());
  return response.data;
};
