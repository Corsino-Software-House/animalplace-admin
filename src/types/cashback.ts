export interface CashbackStatistics {
  totalUsers: number;
  totalPending: number;
  totalApproved: number;
  totalDeclined: number;
  pendingAmount: number;
  approvedAmount: number;
  totalPaidOut: number;
}

export interface CashbackTransaction {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  type: 'earned' | 'redeemed' | 'expired';
  status: 'pending' | 'confirmed' | 'cancelled';
  reason: string;
  requestDate: string;
  order_id?: string;
  voucher?: {
    id: string;
    code: string;
    status: string;
  };
  available_at?: string;
  expires_at?: string;
}

export interface CashbackTransactionsResponse {
  transactions: CashbackTransaction[];
  total: number;
  totalPages: number;
}

export interface CashbackActionResponse {
  success: boolean;
  error?: string;
}
