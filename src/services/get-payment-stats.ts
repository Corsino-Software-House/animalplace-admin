import { API_ENDPOINTS } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { PaymentStats } from "@/types/payments";

export const getPaymentStats = async (): Promise<PaymentStats> => {
  const response = await api.get<PaymentStats>(API_ENDPOINTS.PAYMENTS_STATS);
  return response.data;
};
