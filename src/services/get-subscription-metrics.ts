import { API_ENDPOINTS } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { SubscriptionMetrics } from "@/types/dashboard";

export const getSubscriptionMetrics = async (): Promise<SubscriptionMetrics> => {
  const response = await api.get<SubscriptionMetrics>(API_ENDPOINTS.DASHBOARD_SUBSCRIPTIONS);
  return response.data;
};
