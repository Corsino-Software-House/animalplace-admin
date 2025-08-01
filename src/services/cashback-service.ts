import { api } from '@/lib/api';
import { 
  CASHBACK_APPROVE_TRANSACTION_ROUTE, 
  CASHBACK_DECLINE_TRANSACTION_ROUTE 
} from '@/lib/api-routes';
import { CashbackActionResponse } from '@/types/cashback';

export const cashbackService = {
  async approveTransaction(id: string): Promise<CashbackActionResponse> {
    const response = await api.post<CashbackActionResponse>(
      CASHBACK_APPROVE_TRANSACTION_ROUTE(id)
    );
    return response.data;
  },

  async declineTransaction(id: string, reason?: string): Promise<CashbackActionResponse> {
    const response = await api.post<CashbackActionResponse>(
      CASHBACK_DECLINE_TRANSACTION_ROUTE(id),
      { reason }
    );
    return response.data;
  }
};
