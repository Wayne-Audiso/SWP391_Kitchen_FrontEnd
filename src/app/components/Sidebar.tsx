import { LayoutDashboard, Package, Warehouse, ShoppingCart, BookOpen, Store, Users as UsersIcon, Home, LogOut, ChevronDown } from 'lucide-react';
import type { Page } from '@/app/App';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import type { User } from '@/app/components/LoginPage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { hasPageAccess, getFunctionsByRole, type Role } from '@/app/utils/permissions';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User;
  onLogout: () => void;
}

export function Sidebar({ currentPage, setCurrentPage, user, onLogout }: SidebarProps) {
  const allMenuItems = [
    { id: 'home' as Page, label: 'Home', icon: Home },
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'production' as Page, label: 'Production', icon: Package },
    { id: 'inventory' as Page, label: 'Inventory', icon: Warehouse },
    { id: 'orders' as Page, label: 'Orders', icon: ShoppingCart },
    { id: 'recipes' as Page, label: 'Recipes', icon: BookOpen },
    { id: 'stores' as Page, label: 'Stores', icon: Store },
    { id: 'users' as Page, label: 'Users', icon: UsersIcon },
  ];

  // Filter menu items based on user role permissions
  const menuItems = allMenuItems.filter(item => 
    hasPageAccess(user.role as Role, item.id)
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-600';
      case 'Manager':
        return 'bg-blue-600';
      case 'Central Kitchen Staff':
        return 'bg-green-600';
      case 'Supply Coordinator':
        return 'bg-orange-600';
      case 'Franchise Store Staff':
        return 'bg-cyan-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="font-bold text-xl text-gray-900">Central Kitchen</h1>
        <p className="text-sm text-gray-500 mt-1">Franchise Management System</p>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-full ${getRoleColor(user.role)} flex items-center justify-center text-white font-semibold text-sm`}>
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 font-normal">{user.email}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {user.role}
                </Badge>
                {user.storeName && (
                  <p className="text-xs text-gray-600 mt-1">📍 {user.storeName}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}