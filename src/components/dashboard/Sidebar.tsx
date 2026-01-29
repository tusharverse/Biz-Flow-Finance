
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart4, 
  DollarSign, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-2 py-6 text-base",
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const businessName = user.businessName || 'BizFlow Finance';
  
  return (
    <div className="h-screen w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary">BizFlow Finance</h1>
        <p className="text-sm text-muted-foreground mt-1">{businessName}</p>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          href="/dashboard"
          active={pathname === '/dashboard'}
        />
        <SidebarItem
          icon={<FileText size={20} />}
          label="Invoices"
          href="/invoices"
          active={pathname === '/invoices'}
        />
        <SidebarItem
          icon={<Users size={20} />}
          label="Clients"
          href="/clients"
          active={pathname === '/clients'}
        />
        <SidebarItem
          icon={<DollarSign size={20} />}
          label="Transactions"
          href="/transactions"
          active={pathname === '/transactions'}
        />
        <SidebarItem
          icon={<BarChart4 size={20} />}
          label="Reports"
          href="/reports"
          active={pathname === '/reports'}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          href="/settings"
          active={pathname === '/settings'}
        />
      </div>
      
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{user.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user.email || 'user@example.com'}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 mt-4 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
