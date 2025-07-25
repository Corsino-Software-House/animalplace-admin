import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Zap } from 'lucide-react';

const mockMicrochips = [
  {
    id: 1,
    chipId: 'MC001234567890',
    petName: 'Buddy',
    petType: 'Dog',
    owner: 'Sarah Johnson',
    registrationDate: '2024-01-15',
    status: 'active',
    location: 'Registered'
  },
  {
    id: 2,
    chipId: 'MC001234567891',
    petName: 'Whiskers',
    petType: 'Cat',
    owner: 'Mike Chen',
    registrationDate: '2024-01-20',
    status: 'active',
    location: 'Registered'
  },
  {
    id: 3,
    chipId: 'MC001234567892',
    petName: 'Max',
    petType: 'Dog',
    owner: 'Emma Davis',
    registrationDate: '2024-01-18',
    status: 'pending',
    location: 'Pending Verification'
  },
  {
    id: 4,
    chipId: 'MC001234567893',
    petName: 'Luna',
    petType: 'Cat',
    owner: 'Alex Wilson',
    registrationDate: '2024-01-22',
    status: 'inactive',
    location: 'Deactivated'
  }
];

export function Microchips() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMicrochips = mockMicrochips.filter(chip =>
    chip.chipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chip.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chip.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#95CA3C', color: 'white' };
      case 'pending':
        return { backgroundColor: '#7A3FC2', color: 'white' };
      case 'inactive':
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
          <h1 className="text-3xl font-bold">Microchip Management</h1>
          <p className="text-gray-600 mt-2">Track and manage pet microchip registrations</p>
        </div>
        <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Register Microchip
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" style={{ color: '#95CA3C' }} />
              <div>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-gray-600">Total Microchips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1,156</div>
            <p className="text-sm text-gray-600">Active Registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">67</div>
            <p className="text-sm text-gray-600">Pending Verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-gray-600">This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by chip ID, pet name, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Microchips Table */}
      <Card>
        <CardHeader>
          <CardTitle>Microchip Registry ({filteredMicrochips.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chip ID</TableHead>
                <TableHead>Pet Name</TableHead>
                <TableHead>Pet Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMicrochips.map((chip) => (
                <TableRow key={chip.id}>
                  <TableCell className="font-mono text-sm">{chip.chipId}</TableCell>
                  <TableCell className="font-medium">{chip.petName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{chip.petType}</Badge>
                  </TableCell>
                  <TableCell>{chip.owner}</TableCell>
                  <TableCell className="text-gray-600">{chip.registrationDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={chip.status === 'active' ? 'default' : chip.status === 'pending' ? 'secondary' : 'destructive'}
                      style={getStatusColor(chip.status)}
                    >
                      {chip.status}
                    </Badge>
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
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Registration
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deactivate
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