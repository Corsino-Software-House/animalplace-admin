import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPaymentStats } from '@/services/get-payment-stats';
import { getPaymentsList } from '@/services/get-payments-list';

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: paymentStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['payment-stats'],
    queryFn: getPaymentStats,
  });

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
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Payments</h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">Track all transactions and payment history</p>
        </div>
        <Button variant="outline" className="self-start lg:self-center">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Payment ID</TableHead>
                    <TableHead className="min-w-[150px]">User</TableHead>
                    <TableHead className="min-w-[200px] hidden lg:table-cell">Email</TableHead>
                    <TableHead className="min-w-[100px]">Amount</TableHead>
                    <TableHead className="min-w-[120px] hidden md:table-cell">Plan</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px] hidden lg:table-cell">Method</TableHead>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs lg:text-sm">{payment.paymentId.substring(0, 8)}...</TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{payment.userName}</div>
                          <div className="text-xs text-gray-500 lg:hidden">{payment.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 hidden lg:table-cell">{payment.userEmail}</TableCell>
                      <TableCell className="font-semibold text-xs lg:text-sm">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{payment.planName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            translateStatus(payment.status) === 'completed' ? 'default' : 
                            translateStatus(payment.status) === 'pending' ? 'secondary' : 
                            'destructive'
                          }
                          style={getStatusColor(translateStatus(payment.status))}
                          className="text-xs"
                        >
                          {translateStatus(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 hidden lg:table-cell text-xs">{translatePaymentMethod(payment.paymentMethod)}</TableCell>
                      <TableCell className="text-gray-600 text-xs">{formatDate(payment.paymentDate)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Nenhum pagamento encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}