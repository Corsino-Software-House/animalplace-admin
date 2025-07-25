import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search, Download, Filter } from 'lucide-react';

const mockPayments = [
  { 
    id: 'PAY-001', 
    user: 'Sarah Johnson', 
    amount: '$49.99', 
    plan: 'Premium', 
    status: 'completed', 
    date: '2024-01-28',
    method: 'Credit Card'
  },
  { 
    id: 'PAY-002', 
    user: 'Mike Chen', 
    amount: '$19.99', 
    plan: 'Basic', 
    status: 'completed', 
    date: '2024-01-27',
    method: 'PayPal'
  },
  { 
    id: 'PAY-003', 
    user: 'Emma Davis', 
    amount: '$29.99', 
    plan: 'Pro', 
    status: 'pending', 
    date: '2024-01-26',
    method: 'Credit Card'
  },
  { 
    id: 'PAY-004', 
    user: 'Alex Wilson', 
    amount: '$49.99', 
    plan: 'Premium', 
    status: 'failed', 
    date: '2024-01-25',
    method: 'Credit Card'
  }
];

export function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: '#95CA3C', color: 'white' };
      case 'pending':
        return { backgroundColor: '#7A3FC2', color: 'white' };
      case 'failed':
        return {};
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-600 mt-2">Track all transactions and payment history</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">$47,250</div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">23</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-gray-600">Failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                  <TableCell className="font-medium">{payment.user}</TableCell>
                  <TableCell className="font-semibold">{payment.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}
                      style={getStatusColor(payment.status)}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{payment.method}</TableCell>
                  <TableCell className="text-gray-600">{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}