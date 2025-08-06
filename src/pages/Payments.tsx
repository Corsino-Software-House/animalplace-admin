import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Search, CreditCard, User, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
// import { getPaymentStats } from '@/services/get-payment-stats';
import { getPaymentsList } from '@/services/get-payments-list';

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);

  // const { data: paymentStats, isLoading: isLoadingStats } = useQuery({
  //   queryKey: ['payment-stats'],
  //   queryFn: getPaymentStats,
  // });

  const { data: paymentsData, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments-list', currentPage, pageSize],
    queryFn: () => getPaymentsList(currentPage, pageSize),
  });

  // Função para formatar valor monetário
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para formatar data
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para traduzir status
  const translateStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'pendente': 'pending',
      'completed': 'completed',
      'failed': 'failed',
      'cancelled': 'cancelled'
    };
    return statusMap[status] || status;
  };

  // Função para traduzir método de pagamento
  const translatePaymentMethod = (method: string): string => {
    const methodMap: { [key: string]: string } = {
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'pix': 'PIX',
      'boleto': 'Boleto',
      'paypal': 'PayPal'
    };
    return methodMap[method] || method;
  };

  const filteredPayments = paymentsData?.data.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const translatedStatus = translateStatus(payment.status);
    const matchesStatus = statusFilter === 'all' || translatedStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: '#95CA3C', color: 'white' };
      case 'pending':
        return { backgroundColor: '#7A3FC2', color: 'white' };
      case 'failed':
        return {};
      default:
        return {};
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Pagamentos</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Acompanhe todas as transações e histórico de pagamentos</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {isLoadingStats ? (
          // Skeleton para stats
          [...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{formatCurrency(paymentStats?.totalRevenue || 0)}</div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                {paymentStats?.revenueGrowth && (
                  <p className="text-xs text-green-600 mt-1">{paymentStats.revenueGrowth}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{paymentStats?.completedCount || 0}</div>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{paymentStats?.pendingCount || 0}</div>
                <p className="text-sm text-gray-600">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{paymentStats?.failedCount || 0}</div>
                <p className="text-sm text-gray-600">Failed</p>
              </CardContent>
            </Card>
          </>
        )}
      </div> */}

      {/* Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar pagamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Histórico de Transações ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {isLoadingPayments ? (
            // Skeleton para tabela
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 py-4 border-b">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <Card key={payment.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Header com ID e status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div className="font-mono text-sm">
                              <div className="font-medium">#{payment.paymentId.substring(0, 12)}...</div>
                              <div className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</div>
                            </div>
                          </div>
                          <Badge 
                            variant={
                              translateStatus(payment.status) === 'completed' ? 'default' : 
                              translateStatus(payment.status) === 'pending' ? 'secondary' : 
                              'destructive'
                            }
                            style={getStatusColor(translateStatus(payment.status))}
                            className="text-xs px-2 py-1 flex-shrink-0"
                          >
                            {translateStatus(payment.status)}
                          </Badge>
                        </div>
                        
                        {/* Usuário */}
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{payment.userName}</div>
                            <div className="text-xs text-gray-500 truncate">{payment.userEmail}</div>
                          </div>
                        </div>
                        
                        {/* Valor */}
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-semibold text-xl text-green-600">{formatCurrency(payment.amount)}</div>
                            <div className="text-xs text-gray-500">Valor do pagamento</div>
                          </div>
                        </div>
                        
                        {/* Plano e Método */}
                        <div className="space-y-2">
                          <div className="text-xs text-gray-400 font-medium">Detalhes:</div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              📋 {payment.planName}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              💳 {translatePaymentMethod(payment.paymentMethod)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Nenhum pagamento encontrado</p>
                    <p className="text-sm">Nenhum pagamento corresponde aos filtros selecionados.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}