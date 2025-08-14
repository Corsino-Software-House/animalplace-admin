import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface DashboardSkeletonProps {
  section?: 'stats' | 'activities' | 'metrics' | 'all';
}

export function DashboardSkeleton({ section = 'all' }: DashboardSkeletonProps) {
  const StatsCardSkeleton = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  );

  const ActivitiesSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
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
  );

  const MetricsSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (section === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (section === 'activities') {
    return <ActivitiesSkeleton />;
  }

  if (section === 'metrics') {
    return <MetricsSkeleton />;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center lg:text-left">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>

      {/* Activities and Metrics Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <ActivitiesSkeleton />
        <MetricsSkeleton />
      </div>
    </div>
  );
}
