import { PAYMENTS_STATS_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { PaymentStats } from "@/types/payments";

export const getPaymentStats = async (): Promise<PaymentStats> => {
  const response = await api.get<PaymentStats>(PAYMENTS_STATS_ROUTE());
  return response.data;
};
