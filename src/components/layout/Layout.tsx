import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Botão menu hambúrguer - visível apenas no mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-60">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="bg-white shadow-sm"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}