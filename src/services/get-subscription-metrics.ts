import { DASHBOARD_SUBSCRIPTIONS_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { SubscriptionMetrics } from "@/types/dashboard";

export const getSubscriptionMetrics = async (): Promise<SubscriptionMetrics> => {
  const response = await api.get<SubscriptionMetrics>(DASHBOARD_SUBSCRIPTIONS_ROUTE());
  return response.data;
};
