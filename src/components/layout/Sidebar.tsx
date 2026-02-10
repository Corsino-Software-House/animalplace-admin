import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Image, CreditCard, Package, Settings, Calendar, Zap, Gift, PawPrint as Paw, LogOut, X } from 'lucide-react';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Painel', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Banners', href: '/banners', icon: Image },
  { name: 'Pagamentos', href: '/payments', icon: CreditCard },
  { name: 'Planos', href: '/plans', icon: Package },
  { name: 'Serviços', href: '/services', icon: Settings },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Microchips', href: '/microchips', icon: Zap },
  { name: 'Cashbacks', href: '/cashbacks', icon: Gift },

];

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const logout = useLogout();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      <div className="p-4 border-b border-gray-200 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Paw className="w-6 h-6 lg:h-8 lg:w-8" style={{ color: '#95CA3C' }} />
            <span className="text-lg font-semibold lg:text-xl">AnimalPlace</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 lg:hidden"
            onClick={onToggle}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-500 lg:text-sm">Admin Dashboard</p>
      </div>

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
              onClick={() => {
                if (window.innerWidth < 1024 && onToggle) {
                  onToggle();
                }
              }}
            >
              <item.icon className="flex-shrink-0 w-4 h-4 mr-3" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-3 space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            <span className="text-sm font-medium text-green-700">
              {user?.name ? getInitials(user.name) : 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'email@exemplo.com'}
            </p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="w-full text-gray-600 hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
    </>
  );
}