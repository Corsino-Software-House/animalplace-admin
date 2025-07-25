import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Image, CreditCard, Package, Settings, Calendar, Zap, Gift, BarChart3, PawPrint as Paw } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Banners', href: '/banners', icon: Image },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Plans', href: '/plans', icon: Package },
  { name: 'Services', href: '/services', icon: Settings },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Microchips', href: '/microchips', icon: Zap },
  { name: 'Cashbacks', href: '/cashbacks', icon: Gift },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Paw className="h-8 w-8" style={{ color: '#95CA3C' }} />
          <span className="text-xl font-semibold">AnimalPlace</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@animalplace.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}