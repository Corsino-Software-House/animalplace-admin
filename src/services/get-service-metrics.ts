import { DASHBOARD_SERVICES_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { ServiceMetrics } from "@/types/dashboard";

export const getServiceMetrics = async (): Promise<ServiceMetrics> => {
  const response = await api.get<ServiceMetrics>(DASHBOARD_SERVICES_ROUTE());
  return response.data;
};
