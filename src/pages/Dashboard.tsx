import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CreditCard, Package, Calendar } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with AnimalPlace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="2,847"
          change="+12.5% from last month"
          changeType="positive"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Monthly Revenue"
          value="$47,250"
          change="+8.2% from last month"
          changeType="positive"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Plans"
          value="12"
          change="2 new this month"
          changeType="neutral"
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Appointments Today"
          value="24"
          change="3 pending approval"
          changeType="neutral"
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
              {[
                { action: 'New user registration', user: 'Sarah Johnson', time: '2 minutes ago' },
                { action: 'Payment received', user: 'Premium Plan', time: '15 minutes ago' },
                { action: 'Appointment scheduled', user: 'Dr. Smith', time: '1 hour ago' },
                { action: 'Banner updated', user: 'Admin', time: '2 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
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