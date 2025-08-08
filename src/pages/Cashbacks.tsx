import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Check, X, Gift, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCashbackStatistics } from '@/services/get-cashback-statistics';
import { getCashbackTransactions } from '@/services/get-cashback-transactions';
import { cashbackService } from '@/services/cashback-service';

export function Cashbacks() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['cashback-statistics'],
    queryFn: getCashbackStatistics,
    staleTime: 1000 * 60 * 5,
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['cashback-transactions', currentPage, statusFilter],
    queryFn: () => getCashbackTransactions(
      currentPage,
      10,
      statusFilter === 'all' ? undefined : statusFilter
    ),
    staleTime: 1000 * 60 * 2,
  });

  const approveMutation = useMutation({
    mutationFn: cashbackService.approveTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashback-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['cashback-statistics'] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      cashbackService.declineTransaction(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashback-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['cashback-statistics'] });
    },
  });

  const handleApprove = (transactionId: string) => {
    approveMutation.mutate(transactionId);
  };

  const handleDecline = (transactionId: string) => {
    declineMutation.mutate({ id: transactionId, reason: 'Declined by admin' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { backgroundColor: '#95CA3C', color: 'white' };
      case 'pending':
        return { backgroundColor: '#7A3FC2', color: 'white' };
      case 'cancelled':
        return {};
      default:
        return {};
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'approved';
      case 'pending':
        return 'pending';
      case 'cancelled':
        return 'declined';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'earned':
        return 'Cashback ganho';
      case 'redeemed':
        return 'Voucher resgatado';
      case 'expired':
        return 'Cashback expirado';
      default:
        return type;
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (statsLoading || transactionsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Cashback</h1>
            <p className="text-gray-600 mt-2">Revise e gerencie solicitações e recompensas de cashback dos usuários</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Cashback</h1>
          <p className="text-gray-600 mt-2">Revise e gerencie solicitações e recompensas de cashback dos usuários</p>
        </div>
      </div>

      {statistics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4" style={{ color: '#95CA3C' }} />
                  <div>
                    <div className="text-2xl font-bold">{statistics.totalPending}</div>
                    <p className="text-sm text-gray-600">Solicitações Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{statistics.totalApproved}</div>
                <p className="text-sm text-gray-600">Aprovadas Este Mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" style={{ color: '#7A3FC2' }} />
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(statistics.pendingAmount)}</div>
                    <p className="text-sm text-gray-600">Valor Pendente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{formatCurrency(statistics.totalPaidOut)}</div>
                <p className="text-sm text-gray-600">Total Pago</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Resumo Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de Usuários</span>
                    <span className="font-semibold">{statistics.totalUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de Transações</span>
                    <span className="font-semibold">
                      {statistics.totalPending + statistics.totalApproved + statistics.totalDeclined}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxa de Aprovação</span>
                    <span className="font-semibold text-green-600">
                      {statistics.totalApproved > 0 
                        ? Math.round((statistics.totalApproved / (statistics.totalApproved + statistics.totalDeclined)) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Desempenho Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor Aprovado</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(statistics.approvedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor Rejeitado</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(statistics.approvedAmount + statistics.pendingAmount - statistics.totalPaidOut)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor Médio/Transação</span>
                    <span className="font-semibold">
                      {statistics.totalApproved > 0 
                        ? formatCurrency(statistics.approvedAmount / statistics.totalApproved)
                        : formatCurrency(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-yellow-500"></div>
                      <span className="text-sm">Pendentes</span>
                    </div>
                    <span className="font-semibold">{statistics.totalPending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-sm">Aprovadas</span>
                    </div>
                    <span className="font-semibold">{statistics.totalApproved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-sm">Rejeitadas</span>
                    </div>
                    <span className="font-semibold">{statistics.totalDeclined}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Aprovado</SelectItem>
                <SelectItem value="cancelled">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Transações de Cashback ({transactionsData?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsData?.transactions && transactionsData.transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsData.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{transaction.user.name}</p>
                        <p className="text-sm text-gray-500">{transaction.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(transaction.type)}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{transaction.reason}</TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(transaction.requestDate)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === 'confirmed' ? 'default' : 
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }
                        style={getStatusColor(transaction.status)}
                      >
                        {getStatusLabel(transaction.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.status === 'pending' ? (
                        <div className="flex space-x-2 justify-end">
                          <Button 
                            size="sm" 
                            style={{ backgroundColor: '#95CA3C' }}
                            className="text-white hover:opacity-90"
                            onClick={() => handleApprove(transaction.id)}
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDecline(transaction.id)}
                            disabled={declineMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Contatar Usuário
                            </DropdownMenuItem>
                            {transaction.voucher && (
                              <DropdownMenuItem>
                                Ver Voucher: {transaction.voucher.code}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma transação de cashback encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                As transações de cashback aparecerão aqui
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}