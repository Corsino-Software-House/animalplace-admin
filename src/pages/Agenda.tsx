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
import { Calendar, Clock, User, MapPin, Plus } from 'lucide-react';

const mockAppointments = [
  {
    id: 1,
    client: 'Sarah Johnson',
    service: 'Veterinary Consultation',
    date: '2024-02-01',
    time: '09:00',
    duration: '30 min',
    status: 'confirmed',
    location: 'Clinic A'
  },
  {
    id: 2,
    client: 'Mike Chen',
    service: 'Pet Grooming',
    date: '2024-02-01',
    time: '10:30',
    duration: '60 min',
    status: 'pending',
    location: 'Clinic B'
  },
  {
    id: 3,
    client: 'Emma Davis',
    service: 'Microchip Installation',
    date: '2024-02-01',
    time: '14:00',
    duration: '15 min',
    status: 'confirmed',
    location: 'Clinic A'
  },
  {
    id: 4,
    client: 'Alex Wilson',
    service: 'Emergency Care',
    date: '2024-02-01',
    time: '16:30',
    duration: '45 min',
    status: 'in-progress',
    location: 'Emergency Unit'
  }
];

export function Agenda() {
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { backgroundColor: '#95CA3C', color: 'white' };
      case 'pending':
        return { backgroundColor: '#7A3FC2', color: 'white' };
      case 'in-progress':
        return { backgroundColor: '#D9D9D9', color: 'black' };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agenda & Calendar</h1>
          <p className="text-gray-600 mt-2">Manage all scheduled appointments and services</p>
        </div>
        <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-2xl font-bold">4</div>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <p className="text-sm text-gray-600">Active Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-mono">{appointment.time}</TableCell>
                  <TableCell className="font-medium">{appointment.client}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell className="text-gray-600">{appointment.duration}</TableCell>
                  <TableCell className="text-gray-600">{appointment.location}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                      style={getStatusColor(appointment.status)}
                    >
                      {appointment.status}
                    </Badge>
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