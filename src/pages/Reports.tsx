import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileText, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

const reportTypes = [
  {
    title: 'User Analytics Report',
    description: 'Comprehensive user engagement and activity data',
    icon: Users,
    lastGenerated: '2024-01-28'
  },
  {
    title: 'Revenue Report',
    description: 'Financial performance and payment analytics',
    icon: DollarSign,
    lastGenerated: '2024-01-27'
  },
  {
    title: 'Service Usage Report',
    description: 'Most popular services and utilization rates',
    icon: BarChart3,
    lastGenerated: '2024-01-26'
  },
  {
    title: 'Growth Metrics',
    description: 'User acquisition and retention statistics',
    icon: TrendingUp,
    lastGenerated: '2024-01-25'
  }
];

export function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate and export comprehensive business reports</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-xs text-green-600 mt-1">+12.5% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">$89,420</div>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-xs text-green-600 mt-1">+8.2% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">456</div>
            <p className="text-sm text-gray-600">Services Delivered</p>
            <p className="text-xs text-green-600 mt-1">+15.3% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">92.4%</div>
            <p className="text-sm text-gray-600">Customer Satisfaction</p>
            <p className="text-xs text-green-600 mt-1">+2.1% vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">User Analytics</SelectItem>
                <SelectItem value="revenue">Revenue Report</SelectItem>
                <SelectItem value="services">Service Usage</SelectItem>
                <SelectItem value="growth">Growth Metrics</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            
            <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
              <Download className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <report.icon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Last generated: {report.lastGenerated}</p>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      View Sample
                    </Button>
                    <Button 
                      size="sm" 
                      style={{ backgroundColor: '#95CA3C' }}
                      className="text-white hover:opacity-90"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'User Analytics - January 2024.pdf', date: '2024-01-28', size: '2.4 MB' },
              { name: 'Revenue Report - Q4 2023.xlsx', date: '2024-01-27', size: '1.8 MB' },
              { name: 'Service Usage - December 2023.csv', date: '2024-01-26', size: '856 KB' },
              { name: 'Growth Metrics - 2023 Annual.pdf', date: '2024-01-25', size: '3.2 MB' }
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{file.date} • {file.size}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}