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
