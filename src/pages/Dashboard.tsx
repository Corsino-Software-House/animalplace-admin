import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardSkeleton } from '@/components/ui/dashboard-skeleton';
import { EditMonthlyGoalModal } from '@/components/dashboard/EditMonthlyGoalModal';
import { RecentActivitiesCard } from '@/components/dashboard/RecentActivitiesCard';
import { 
  Users, 
  CreditCard, 
  Package, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Edit
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// Removidos imports de queries individuais
import { getFullDashboard, FullDashboardResponse } from '@/services/get-full-dashboard';
import { useMonthlyGoal } from '@/hooks/useMonthlyGoal';
import { useState } from 'react';

export function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { monthlyGoal, setMonthlyGoal, isLoading: isLoadingGoal, defaultGoal, isCustomGoal } = useMonthlyGoal();

  // Query única otimizada
  const { 
    data: fullDashboardData, 
    isLoading, 
    error 
  } = useQuery<FullDashboardResponse>({
    queryKey: ['full-dashboard'],
    queryFn: getFullDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const dashboardOverview = fullDashboardData?.overview;
  const subscriptions = fullDashboardData?.metrics?.subscriptions;
  const scheduling = fullDashboardData?.metrics?.scheduling;

  const refreshData = () => {
    setLastUpdated(new Date());
    queryClient.invalidateQueries({ queryKey: ['full-dashboard'] });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getChangeType = (growth: string): 'positive' | 'negative' | 'neutral' => {
    if (growth.includes('+') && growth.includes('%')) return 'positive';
    if (growth.includes('-') && growth.includes('%')) return 'negative';
    return 'neutral';
  };

  // console.log(subscriptions)

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta! Veja o que está acontecendo no AnimalPlace.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Erro ao carregar o dashboard
            </h3>
            <p className="text-red-600 mb-4">
              Não foi possível carregar os dados do dashboard. Verifique sua conexão e tente novamente.
            </p>
            <Button 
              onClick={refreshData} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex justify-between items-start">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">Bem-vindo de volta! Veja o que está acontecendo no AnimalPlace.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshData} 
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Total de Usuários"
          value={dashboardOverview?.totalUsers.value || 0}
          change={dashboardOverview?.totalUsers.growth}
          changeType={dashboardOverview?.totalUsers.growth ? getChangeType(dashboardOverview.totalUsers.growth) : 'neutral'}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Receita Mensal"
          value={dashboardOverview?.monthlyRevenue.value ? formatCurrency(dashboardOverview.monthlyRevenue.value) : 'R$ 0,00'}
          change={dashboardOverview?.monthlyRevenue.growth}
          changeType={dashboardOverview?.monthlyRevenue.growth ? getChangeType(dashboardOverview.monthlyRevenue.growth) : 'neutral'}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Planos Ativos"
          value={dashboardOverview?.activePlans.value || 0}
          change={dashboardOverview?.activePlans.growth}
          changeType={dashboardOverview?.activePlans.growth ? getChangeType(dashboardOverview.activePlans.growth) : 'neutral'}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Agendamentos Hoje"
          value={dashboardOverview?.appointmentsToday.value || 0}
          change={dashboardOverview?.appointmentsToday.growth}
          changeType={dashboardOverview?.appointmentsToday.growth ? getChangeType(dashboardOverview.appointmentsToday.growth) : 'neutral'}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        <RecentActivitiesCard />
      </div>

      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold">Análise Detalhada</h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Análise aprofundada dos dados da plataforma
              <span className="ml-2 text-sm text-gray-500 block lg:inline">
                • Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
              </span>
            </p>
          </div>
          <Button variant="outline" onClick={refreshData} className="self-start lg:self-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        <Tabs defaultValue="subscriptions" className="space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="subscriptions" className="text-xs lg:text-sm py-2">Assinaturas</TabsTrigger>
            <TabsTrigger value="scheduling" className="text-xs lg:text-sm py-2">Agendamentos</TabsTrigger>
          </TabsList>


          <TabsContent value="subscriptions" className="space-y-4 lg:space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-2 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : subscriptions ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Crescimento de Assinaturas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Este mês</span>
                          <span className="text-lg font-semibold">{subscriptions?.newSubscriptionsThisMonth || 0}</span>
                        </div>
                        <Progress value={Math.min(subscriptions?.growthPercentage || 0, 100)} className="h-2" />
                        <p className="text-xs text-green-600 mt-1">
                          {subscriptions?.growthPercentage ? (subscriptions.growthPercentage > 0 ? '+' : '') + subscriptions.growthPercentage.toFixed(1) + '% vs mês anterior' : 'Sem dados'}
                        </p>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-2xl font-bold text-center">
                          {subscriptions?.activeSubscriptions || 0}
                        </div>
                        <p className="text-sm text-gray-600 text-center">Assinaturas Ativas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Status de Pagamentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pendentes</span>
                        <Badge variant="outline" className="text-orange-600">
                          {subscriptions?.pendingPayments || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Em atraso</span>
                        <Badge variant="destructive">
                          {subscriptions?.overduePayments || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Em dia</span>
                        <Badge className="bg-green-100 text-green-800">
                          {(subscriptions?.activeSubscriptions || 0) - (subscriptions?.pendingPayments || 0) - (subscriptions?.overduePayments || 0)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Planos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subscriptions?.planDistribution && subscriptions.planDistribution.length > 0 ? (
                        subscriptions.planDistribution.map((plan: any) => (
                          <div key={plan.name} className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: plan.color }}
                            ></div>
                            <span className="text-sm flex-1">{plan.name}</span>
                            <span className="text-sm font-medium">{plan.percentage}%</span>
                            <span className="text-xs text-gray-500">({plan.count})</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-sm">Nenhum plano encontrado</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Dados de assinaturas não disponíveis</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-4 lg:space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {[...Array(2)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : scheduling ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Agendamentos do Mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{scheduling?.totalSchedulesThisMonth || 0}</div>
                        <p className="text-sm text-gray-600">Total este mês</p>
                        <p className="text-xs text-green-600 mt-1">
                          {scheduling?.growthPercentage ? (scheduling.growthPercentage > 0 ? '+' : '') + scheduling.growthPercentage.toFixed(1) + '% vs mês anterior' : 'Sem dados'}
                        </p>
                      </div>
                      <Progress value={Math.min(((scheduling?.totalSchedulesThisMonth || 0) / monthlyGoal) * 100, 100)} className="h-2" />
                      <div className="flex items-center justify-center gap-2">
                        {isLoadingGoal ? (
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-gray-500">
                              Meta mensal: {monthlyGoal} agendamentos
                              {isCustomGoal && (
                                <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Personalizada
                                </span>
                              )}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsEditGoalModalOpen(true)}
                              className="h-auto p-1 text-xs text-gray-400 hover:text-gray-600"
                              title="Editar meta mensal"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status dos Agendamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{scheduling?.scheduledCount || 0}</div>
                        <p className="text-xs text-gray-600">Agendados</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{scheduling?.completedCount || 0}</div>
                        <p className="text-xs text-gray-600">Realizados</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{scheduling?.cancelledCount || 0}</div>
                        <p className="text-xs text-gray-600">Cancelados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Dados de agendamentos não disponíveis</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para editar meta mensal */}
      <EditMonthlyGoalModal
        isOpen={isEditGoalModalOpen}
        onClose={() => setIsEditGoalModalOpen(false)}
        currentGoal={monthlyGoal}
        onSave={setMonthlyGoal}
        defaultGoal={defaultGoal}
      />
    </div>
  );
}