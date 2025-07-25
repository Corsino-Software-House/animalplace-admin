import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit, Trash2, Users, Check } from 'lucide-react';

const mockPlans = [
  {
    id: 1,
    name: 'Basic',
    price: '$19.99',
    billing: 'monthly',
    users: 245,
    status: 'active',
    features: ['Basic health tracking', 'Appointment booking', 'Email support']
  },
  {
    id: 2,
    name: 'Pro',
    price: '$29.99',
    billing: 'monthly',
    users: 892,
    status: 'active',
    features: ['All Basic features', 'Advanced analytics', 'Priority support', 'Custom reports']
  },
  {
    id: 3,
    name: 'Premium',
    price: '$49.99',
    billing: 'monthly',
    users: 1710,
    status: 'active',
    features: ['All Pro features', '24/7 phone support', 'Custom integrations', 'Dedicated account manager']
  },
  {
    id: 4,
    name: 'Enterprise',
    price: 'Custom',
    billing: 'contact',
    users: 156,
    status: 'draft',
    features: ['All Premium features', 'White-label solution', 'Custom development', 'SLA guarantee']
  }
];

export function Plans() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Plan Management</h1>
          <p className="text-gray-600 mt-2">Create and manage subscription plans for your platform</p>
        </div>
        <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockPlans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.billing !== 'contact' && (
                      <span className="text-gray-500">/{plan.billing}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge 
                    variant={plan.status === 'active' ? 'default' : 'secondary'}
                    style={plan.status === 'active' ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                  >
                    {plan.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {plan.users} active users
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="mr-2 h-3 w-3" style={{ color: '#95CA3C' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3,003</div>
            <p className="text-sm text-gray-600">Total Subscribers</p>
            <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">$89,420</div>
            <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
            <p className="text-xs text-green-600 mt-1">+12.8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">2.3%</div>
            <p className="text-sm text-gray-600">Churn Rate</p>
            <p className="text-xs text-green-600 mt-1">-0.5% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}