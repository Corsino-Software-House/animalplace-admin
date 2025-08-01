import { api } from '@/lib/api';
import { CASHBACK_TRANSACTIONS_ROUTE } from '@/lib/api-routes';
import { CashbackTransactionsResponse } from '@/types/cashback';

export const getCashbackTransactions = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  type?: string
): Promise<CashbackTransactionsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) params.append('status', status);
  if (type) params.append('type', type);

  const response = await api.get<CashbackTransactionsResponse>(
    `${CASHBACK_TRANSACTIONS_ROUTE()}?${params.toString()}`
  );
  return response.data;
};
