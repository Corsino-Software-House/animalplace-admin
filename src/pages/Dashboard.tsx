import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CreditCard, Package, Calendar, User, DollarSign, CalendarDays, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '@/services/get-dashboard-overview';
import { getRecentActivity } from '@/services/get-recent-activity';

export function Dashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: getDashboardOverview,
  });

  const { data: recentActivities = [], isLoading: isLoadingActivities } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: getRecentActivity,
  });

  // Função para mapear ícones baseado no tipo
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

  // Função para determinar o tipo de mudança baseado no crescimento
  const getChangeType = (growth: string): 'positive' | 'negative' | 'neutral' => {
    if (growth.includes('+') && growth.includes('%')) return 'positive';
    if (growth.includes('-') && growth.includes('%')) return 'negative';
    return 'neutral';
  };

  // Função para formatar valores monetários
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta! Veja o que está acontecendo com o AnimalPlace.</p>
        </div>
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
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
          {/* Quick Actions Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta! Veja o que está acontecendo com o AnimalPlace.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Erro ao carregar dashboard
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo de volta! Veja o que está acontecendo com o AnimalPlace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={dashboardData?.totalUsers.value || 0}
          change={dashboardData?.totalUsers.growth}
          changeType={dashboardData?.totalUsers.growth ? getChangeType(dashboardData.totalUsers.growth) : 'neutral'}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Monthly Revenue"
          value={dashboardData?.monthlyRevenue.value ? formatCurrency(dashboardData.monthlyRevenue.value) : 'R$ 0,00'}
          change={dashboardData?.monthlyRevenue.growth}
          changeType={dashboardData?.monthlyRevenue.growth ? getChangeType(dashboardData.monthlyRevenue.growth) : 'neutral'}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Plans"
          value={dashboardData?.activePlans.value || 0}
          change={dashboardData?.activePlans.growth}
          changeType={dashboardData?.activePlans.growth ? getChangeType(dashboardData.activePlans.growth) : 'neutral'}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Appointments Today"
          value={dashboardData?.appointmentsToday.value || 0}
          change={dashboardData?.appointmentsToday.growth}
          changeType={dashboardData?.appointmentsToday.growth ? getChangeType(dashboardData.appointmentsToday.growth) : 'neutral'}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingActivities ? (
                // Skeleton loading para activities
                [...Array(4)].map((_, index) => (
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
                ))
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Create New Plan
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                style={{ borderColor: '#95CA3C', color: '#95CA3C' }}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}