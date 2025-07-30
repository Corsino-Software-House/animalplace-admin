export interface PaymentStats {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  revenueGrowth: string;
}

export interface Payment {
  id: string;
  paymentId: string;
  userName: string;
  userEmail: string;
  amount: number;
  planName: string;
  status: string;
  paymentMethod: string;
  paymentDate: string;
  asaasPaymentId: string | null;
}

export interface PaymentListResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
