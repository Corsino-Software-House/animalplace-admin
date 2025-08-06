import { api } from '@/lib/api';
import { CASHBACK_STATISTICS_ROUTE } from '@/lib/api-routes';
import { CashbackStatistics } from '@/types/cashback';

export const getCashbackStatistics = async (): Promise<CashbackStatistics> => {
  const response = await api.get<CashbackStatistics>(CASHBACK_STATISTICS_ROUTE());
  return response.data;
};
