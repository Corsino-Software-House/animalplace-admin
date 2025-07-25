import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Plus, MoreHorizontal, Edit, Trash2, Settings } from 'lucide-react';

const mockServices = [
  { 
    id: 1, 
    name: 'Veterinary Consultation', 
    category: 'Healthcare', 
    duration: '30 min', 
    price: '$75',
    status: 'active',
    plans: ['Pro', 'Premium']
  },
  { 
    id: 2, 
    name: 'Pet Grooming', 
    category: 'Grooming', 
    duration: '60 min', 
    price: '$45',
    status: 'active',
    plans: ['Basic', 'Pro', 'Premium']
  },
  { 
    id: 3, 
    name: 'Microchip Installation', 
    category: 'Healthcare', 
    duration: '15 min', 
    price: '$25',
    status: 'active',
    plans: ['Premium']
  },
  { 
    id: 4, 
    name: 'Emergency Care', 
    category: 'Healthcare', 
    duration: '24/7', 
    price: '$150',
    status: 'active',
    plans: ['Premium']
  },
  { 
    id: 5, 
    name: 'Pet Training', 
    category: 'Training', 
    duration: '45 min', 
    price: '$60',
    status: 'inactive',
    plans: ['Pro']
  }
];

export function Services() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Service Management</h1>
          <p className="text-gray-600 mt-2">Manage your service catalog and plan assignments</p>
        </div>
        <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-gray-600">Total Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">20</div>
            <p className="text-sm text-gray-600">Active Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">4</div>
            <p className="text-sm text-gray-600">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">$68</div>
            <p className="text-sm text-gray-600">Avg. Price</p>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Available in Plans</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{service.duration}</TableCell>
                  <TableCell className="font-semibold">{service.price}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={service.status === 'active' ? 'default' : 'secondary'}
                      style={service.status === 'active' ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {service.plans.map((plan) => (
                        <Badge key={plan} variant="outline" className="text-xs">
                          {plan}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Manage Plans
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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