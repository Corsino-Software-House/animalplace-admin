import { DASHBOARD_RECENT_ACTIVITY_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { RecentActivity } from "@/types/dashboard";

export interface RecentActivityResponse {
  activities: RecentActivity[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const getRecentActivity = async (page: number = 1, limit: number = 10): Promise<RecentActivityResponse> => {
  const response = await api.get<RecentActivityResponse>(
    `${DASHBOARD_RECENT_ACTIVITY_ROUTE()}?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Manter compatibilidade com a função original para o full-dashboard
export const getRecentActivitySimple = async (): Promise<RecentActivity[]> => {
  const response = await api.get<RecentActivity[]>(DASHBOARD_RECENT_ACTIVITY_ROUTE());
  return response.data;
};
