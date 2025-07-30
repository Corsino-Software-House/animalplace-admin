import { API_ENDPOINTS } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { PaymentListResponse } from "@/types/payments";

export const getPaymentsList = async (page: number = 1, limit: number = 10): Promise<PaymentListResponse> => {
  const response = await api.get<PaymentListResponse>(`${API_ENDPOINTS.PAYMENTS_LIST}?page=${page}&limit=${limit}`);
  return response.data;
};
