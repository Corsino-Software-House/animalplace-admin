import { API_ENDPOINTS } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { ServiceMetrics } from "@/types/dashboard";

export const getServiceMetrics = async (): Promise<ServiceMetrics> => {
  const response = await api.get<ServiceMetrics>(API_ENDPOINTS.DASHBOARD_SERVICES);
  return response.data;
};
