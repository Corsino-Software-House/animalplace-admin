import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Image, CreditCard, Package, Settings, Calendar, Zap, Gift, BarChart3, PawPrint as Paw, LogOut, Menu, X } from 'lucide-react';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
// import { useState, useEffect } from 'react';
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
  // { name: 'Relatórios', href: '/reports', icon: BarChart3 },
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
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Paw className="h-6 w-6 lg:h-8 lg:w-8" style={{ color: '#95CA3C' }} />
            <span className="text-lg lg:text-xl font-semibold">AnimalPlace</span>
          </div>
          {/* Botão de fechar para mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-1"
            onClick={onToggle}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs lg:text-sm text-gray-500 mt-1">Admin Dashboard</p>
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
              onClick={() => {
                // Fechar sidebar no mobile após navegar
                if (window.innerWidth < 1024 && onToggle) {
                  onToggle();
                }
              }}
            >
              <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
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
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
    </>
  );
}