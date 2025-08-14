import { DASHBOARD_FULL_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { DashboardOverview, RecentActivity } from "@/types/dashboard";

export interface FullDashboardResponse {
  overview: DashboardOverview;
  recentActivity: RecentActivity[];
  metrics: {
    subscriptions: {
      activeSubscriptions: number;
      newSubscriptionsThisMonth: number;
      growthPercentage: number;
      pendingPayments: number;
      overduePayments: number;
      planDistribution: Array<{
        name: string;
        count: number;
        percentage: number;
        color: string;
      }>;
    };
    scheduling: {
      totalSchedulesThisMonth: number;
      growthPercentage: number;
      scheduledCount: number;
      completedCount: number;
      cancelledCount: number;
    };
  };
}

export const getFullDashboard = async (): Promise<FullDashboardResponse> => {
  const response = await api.get<FullDashboardResponse>(DASHBOARD_FULL_ROUTE());
  return response.data;
};
