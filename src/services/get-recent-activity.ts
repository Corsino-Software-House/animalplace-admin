import { API_ENDPOINTS } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { RecentActivity } from "@/types/dashboard";

export const getRecentActivity = async (): Promise<RecentActivity[]> => {
  const response = await api.get<RecentActivity[]>(API_ENDPOINTS.DASHBOARD_RECENT_ACTIVITY);
  return response.data;
};
