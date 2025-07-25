import { useState } from 'react';
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
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Image } from 'lucide-react';

const mockBanners = [
  { 
    id: 1, 
    title: 'Summer Special Offer', 
    status: 'active', 
    startDate: '2024-06-01', 
    endDate: '2024-08-31',
    image: 'summer-banner.jpg'
  },
  { 
    id: 2, 
    title: 'New Service Launch', 
    status: 'scheduled', 
    startDate: '2024-02-15', 
    endDate: '2024-03-15',
    image: 'service-banner.jpg'
  },
  { 
    id: 3, 
    title: 'Holiday Promotion', 
    status: 'inactive', 
    startDate: '2023-12-01', 
    endDate: '2023-12-31',
    image: 'holiday-banner.jpg'
  }
];

export function Banners() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-gray-600 mt-2">Manage promotional banners displayed in the client app</p>
        </div>
        <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Create Banner
        </Button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBanners.map((banner) => (
          <Card key={banner.id}>
            <CardHeader className="pb-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{banner.title}</h3>
                  <Badge 
                    variant={banner.status === 'active' ? 'default' : banner.status === 'scheduled' ? 'secondary' : 'outline'}
                    style={banner.status === 'active' ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                  >
                    {banner.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Start: {banner.startDate}</p>
                  <p>End: {banner.endDate}</p>
                </div>
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBanners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={banner.status === 'active' ? 'default' : banner.status === 'scheduled' ? 'secondary' : 'outline'}
                      style={banner.status === 'active' ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                    >
                      {banner.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{banner.startDate}</TableCell>
                  <TableCell className="text-gray-600">{banner.endDate}</TableCell>
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
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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