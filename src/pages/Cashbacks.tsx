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
import { MoreHorizontal, Check, X, Gift, DollarSign } from 'lucide-react';

const mockCashbacks = [
  {
    id: 1,
    user: 'Sarah Johnson',
    amount: '$15.00',
    reason: 'Service referral bonus',
    requestDate: '2024-01-25',
    status: 'pending',
    plan: 'Premium'
  },
  {
    id: 2,
    user: 'Mike Chen',
    amount: '$10.00',
    reason: 'Monthly loyalty reward',
    requestDate: '2024-01-24',
    status: 'approved',
    plan: 'Pro'
  },
  {
    id: 3,
    user: 'Emma Davis',
    amount: '$25.00',
    reason: 'Anniversary bonus',
    requestDate: '2024-01-23',
    status: 'pending',
    plan: 'Premium'
  },
  {
    id: 4,
    user: 'Alex Wilson',
    amount: '$8.50',
    reason: 'Service feedback reward',
    requestDate: '2024-01-22',
    status: 'declined',
    plan: 'Basic'
  },
  {
    id: 5,
    user: 'Lisa Brown',
    amount: '$20.00',
    reason: 'Friend referral bonus',
    requestDate: '2024-01-21',
    status: 'approved',
    plan: 'Pro'
  }
];

export function Cashbacks() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCashbacks = mockCashbacks.filter(cashback =>
    statusFilter === 'all' || cashback.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { backgroundColor: '#95CA3C', color: 'white' };
      case 'pending':
        return { backgroundColor: '#7A3FC2', color: 'white' };
      case 'declined':
        return {};
      default:
        return {};
    }
  };

  const pendingCount = mockCashbacks.filter(c => c.status === 'pending').length;
  const approvedCount = mockCashbacks.filter(c => c.status === 'approved').length;
  const totalPending = mockCashbacks
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + parseFloat(c.amount.replace('$', '')), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cashback Management</h1>
          <p className="text-gray-600 mt-2">Review and manage user cashback requests and rewards</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4" style={{ color: '#95CA3C' }} />
              <div>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-sm text-gray-600">Approved This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" style={{ color: '#7A3FC2' }} />
              <div>
                <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
                <p className="text-sm text-gray-600">Pending Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">$1,247.50</div>
            <p className="text-sm text-gray-600">Total Paid Out</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Cashback Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cashback Requests ({filteredCashbacks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCashbacks.map((cashback) => (
                <TableRow key={cashback.id}>
                  <TableCell className="font-medium">{cashback.user}</TableCell>
                  <TableCell className="font-semibold">{cashback.amount}</TableCell>
                  <TableCell className="text-gray-600">{cashback.reason}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{cashback.plan}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{cashback.requestDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={cashback.status === 'approved' ? 'default' : cashback.status === 'pending' ? 'secondary' : 'destructive'}
                      style={getStatusColor(cashback.status)}
                    >
                      {cashback.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {cashback.status === 'pending' ? (
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: '#95CA3C' }}
                          className="text-white hover:opacity-90"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Contact User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}