import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  CreditCard, 
  Package, 
  Calendar, 
  User, 
  DollarSign, 
  CalendarDays, 
  Settings,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '@/services/get-dashboard-overview';
import { getRecentActivity } from '@/services/get-recent-activity';
import { getSubscriptionMetrics } from '@/services/get-subscription-metrics';
import { getSchedulingMetrics } from '@/services/get-scheduling-metrics';
import { useState } from 'react';

export function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: getDashboardOverview,
  });

  const { data: recentActivities = [], isLoading: isLoadingActivities } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: getRecentActivity,
  });

  const { data: subscriptionMetrics, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ['subscription-metrics'],
    queryFn: getSubscriptionMetrics,
  });

  const { data: schedulingMetrics, isLoading: isLoadingScheduling } = useQuery({
    queryKey: ['scheduling-metrics'],
    queryFn: getSchedulingMetrics,
  });

  const refreshData = () => {
    setLastUpdated(new Date());
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      case 'appointment':
        return <CalendarDays className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getChangeType = (growth: string): 'positive' | 'negative' | 'neutral' => {
    if (growth.includes('+') && growth.includes('%')) return 'positive';
    if (growth.includes('-') && growth.includes('%')) return 'negative';
    return 'neutral';
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta! Veja o que está acontecendo no AnimalPlace.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    );
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
              onClick={() => window.location.reload()} 
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
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2 text-sm lg:text-base">Bem-vindo de volta! Veja o que está acontecendo no AnimalPlace.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Total de Usuários"
          value={dashboardData?.totalUsers.value || 0}
          change={dashboardData?.totalUsers.growth}
          changeType={dashboardData?.totalUsers.growth ? getChangeType(dashboardData.totalUsers.growth) : 'neutral'}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Receita Mensal"
          value={dashboardData?.monthlyRevenue.value ? formatCurrency(dashboardData.monthlyRevenue.value) : 'R$ 0,00'}
          change={dashboardData?.monthlyRevenue.growth}
          changeType={dashboardData?.monthlyRevenue.growth ? getChangeType(dashboardData.monthlyRevenue.growth) : 'neutral'}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Planos Ativos"
          value={dashboardData?.activePlans.value || 0}
          change={dashboardData?.activePlans.growth}
          changeType={dashboardData?.activePlans.growth ? getChangeType(dashboardData.activePlans.growth) : 'neutral'}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Agendamentos Hoje"
          value={dashboardData?.appointmentsToday.value || 0}
          change={dashboardData?.appointmentsToday.growth}
          changeType={dashboardData?.appointmentsToday.growth ? getChangeType(dashboardData.appointmentsToday.growth) : 'neutral'}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingActivities ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.type}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{activity.timeAgo}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma atividade recente encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
            {isLoadingSubscriptions ? (
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
            ) : subscriptionMetrics ? (
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
                          <span className="text-lg font-semibold">{subscriptionMetrics.newSubscriptionsThisMonth}</span>
                        </div>
                        <Progress value={Math.min(subscriptionMetrics.growthPercentage, 100)} className="h-2" />
                        <p className="text-xs text-green-600 mt-1">
                          {subscriptionMetrics.growthPercentage > 0 ? '+' : ''}{subscriptionMetrics.growthPercentage.toFixed(1)}% vs mês anterior
                        </p>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-2xl font-bold text-center">
                          {subscriptionMetrics.activeSubscriptions}
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
                          {subscriptionMetrics.pendingPayments}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Em atraso</span>
                        <Badge variant="destructive">
                          {subscriptionMetrics.overduePayments}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Em dia</span>
                        <Badge className="bg-green-100 text-green-800">
                          {subscriptionMetrics.activeSubscriptions - subscriptionMetrics.pendingPayments - subscriptionMetrics.overduePayments}
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
                      {subscriptionMetrics.planDistribution && subscriptionMetrics.planDistribution.length > 0 ? (
                        subscriptionMetrics.planDistribution.map((plan) => (
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
            {isLoadingScheduling ? (
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
            ) : schedulingMetrics ? (
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
                        <div className="text-3xl font-bold">{schedulingMetrics.totalSchedulesThisMonth}</div>
                        <p className="text-sm text-gray-600">Total este mês</p>
                        <p className="text-xs text-green-600 mt-1">
                          {schedulingMetrics.growthPercentage > 0 ? '+' : ''}{schedulingMetrics.growthPercentage.toFixed(1)}% vs mês anterior
                        </p>
                      </div>
                      <Progress value={Math.min((schedulingMetrics.totalSchedulesThisMonth / 170) * 100, 100)} className="h-2" />
                      <p className="text-xs text-center text-gray-500">Meta mensal: 170 agendamentos</p>
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
                        <div className="text-2xl font-bold text-blue-600">{schedulingMetrics.scheduledCount}</div>
                        <p className="text-xs text-gray-600">Agendados</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{schedulingMetrics.completedCount}</div>
                        <p className="text-xs text-gray-600">Realizados</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{schedulingMetrics.cancelledCount}</div>
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
    </div>
  );
}