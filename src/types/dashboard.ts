export interface DashboardStat {
  value: number;
  growth: string;
}

export interface DashboardOverview {
  totalUsers: DashboardStat;
  monthlyRevenue: DashboardStat;
  activePlans: DashboardStat;
  appointmentsToday: DashboardStat;
}

export interface RecentActivity {
  type: string;
  description: string;
  timestamp: string;
  icon: string;
  timeAgo: string;
}

export interface SubscriptionMetrics {
  activeSubscriptions: number;
  newSubscriptionsThisMonth: number;
  growthPercentage: number;
  pendingPayments: number;
  overduePayments: number;
  planDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
}

export interface SchedulingMetrics {
  totalSchedulesThisMonth: number;
  growthPercentage: number;
  scheduledCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface ServiceMetrics {
  mostUsedServices: Array<{ name: string; count: number }>;
  totalServicesThisMonth: number;
  servicesByType: Array<{ type: string; count: number }>;
}
