import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  BookOpen, 
  Store, 
  Users,
  TruckIcon,
  ClipboardCheck,
  BarChart3,
  FileText,
  Settings,
  ShoppingBag,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  UserCog,
  ShieldCheck,
  Building2,
  ChefHat,
  FileSpreadsheet,
  Activity,
  CalendarClock,
  PackageCheck,
  Bell
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { getFunctionsByRole, type Role } from '@/app/utils/permissions';

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  level: string;
}

export function HomePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user', error);
      }
    }
  }, []);

  const selectedRole = currentUser?.role || 'Franchise Store Staff';

  // Map function IDs to icon, color, and bgColor
  const functionIconMap: Record<string, { icon: any; color: string; bgColor: string }> = {
    // Admin Functions
    'AD-02': { icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'AD-03': { icon: ShieldCheck, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    'AD-04': { icon: UserCog, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    'AD-05': { icon: Store, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    'AD-06': { icon: Building2, color: 'text-green-600', bgColor: 'bg-green-100' },
    'AD-07': { icon: Package, color: 'text-red-600', bgColor: 'bg-red-100' },
    'AD-08': { icon: Settings, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    'AD-09': { icon: Activity, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    'AD-10': { icon: BarChart3, color: 'text-violet-600', bgColor: 'bg-violet-100' },
    
    // Manager Functions
    'MG-01': { icon: LayoutDashboard, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    'MG-02': { icon: PackageCheck, color: 'text-pink-600', bgColor: 'bg-pink-100' },
    'MG-03': { icon: Package, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    'MG-04': { icon: Activity, color: 'text-green-600', bgColor: 'bg-green-100' },
    'MG-05': { icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'MG-06': { icon: ShoppingBag, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    'MG-07': { icon: BarChart3, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    'MG-08': { icon: TruckIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    'MG-09': { icon: FileSpreadsheet, color: 'text-red-600', bgColor: 'bg-red-100' },
    'MG-10': { icon: ShoppingCart, color: 'text-violet-600', bgColor: 'bg-violet-100' },
    'MG-11': { icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    'MG-12': { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    
    // Franchise Store Staff Functions
    'FS-02': { icon: Store, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    'FS-03': { icon: Warehouse, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    'FS-04': { icon: ShoppingCart, color: 'text-red-600', bgColor: 'bg-red-100' },
    'FS-05': { icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'FS-06': { icon: Activity, color: 'text-green-600', bgColor: 'bg-green-100' },
    'FS-07': { icon: PackageCheck, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    'FS-08': { icon: ClipboardCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    'FS-09': { icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    'FS-10': { icon: BookOpen, color: 'text-violet-600', bgColor: 'bg-violet-100' },
    
    // Central Kitchen Staff Functions
    'CK-02': { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    'CK-03': { icon: ShoppingCart, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    'CK-04': { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
    'CK-05': { icon: CalendarClock, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'CK-06': { icon: Activity, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    'CK-07': { icon: ShoppingBag, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    'CK-08': { icon: Package, color: 'text-pink-600', bgColor: 'bg-pink-100' },
    'CK-09': { icon: TruckIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    'CK-10': { icon: PackageCheck, color: 'text-violet-600', bgColor: 'bg-violet-100' },
    'CK-11': { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
    
    // Supply Coordinator Functions
    'SC-01': { icon: LayoutDashboard, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    'SC-02': { icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'SC-03': { icon: ShoppingCart, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    'SC-04': { icon: Activity, color: 'text-green-600', bgColor: 'bg-green-100' },
    'SC-05': { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
    'SC-06': { icon: CalendarClock, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    'SC-07': { icon: FileText, color: 'text-violet-600', bgColor: 'bg-violet-100' },
    'SC-08': { icon: Bell, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    'SC-09': { icon: TruckIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    'SC-10': { icon: FileSpreadsheet, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  };

  const functions = getFunctionsByRole(selectedRole);
  
  // Filter out Login/Logout functions and convert to QuickAccessCard format
  const quickAccessCards: QuickAccessCard[] = functions
    .filter(func => !func.title.includes('Login') && !func.title.includes('Logout'))
    .map(func => {
      const iconData = functionIconMap[func.id] || { 
        icon: Settings, 
        color: 'text-gray-600', 
        bgColor: 'bg-gray-100' 
      };
      
      return {
        id: func.id,
        title: func.title,
        description: func.description,
        icon: iconData.icon,
        color: iconData.color,
        bgColor: iconData.bgColor,
        level: func.level
      };
    });

  const recentActivities = [
    { id: 1, action: 'Production Batch #PB-1024 completed', user: 'Emily Wong', time: '10 minutes ago', status: 'success', roles: ['Admin', 'Central Kitchen Staff', 'Supply Coordinator', 'Manager'] },
    { id: 2, action: 'Store Order #SO-2401 created', user: 'Sarah Johnson', time: '25 minutes ago', status: 'info', roles: ['Admin', 'Manager', 'Supply Coordinator', 'Franchise Store Staff'] },
    { id: 3, action: 'Shipment #SH-890 dispatched', user: 'Michael Chen', time: '1 hour ago', status: 'success', roles: ['Admin', 'Supply Coordinator', 'Manager', 'Central Kitchen Staff'] },
    { id: 4, action: 'Quality check completed for Lot #LOT-456', user: 'Store Staff', time: '2 hours ago', status: 'success', roles: ['Admin', 'Manager', 'Franchise Store Staff'] },
    { id: 5, action: 'Low stock alert: Wheat Flour', user: 'System', time: '3 hours ago', status: 'warning', roles: ['Admin', 'Supply Coordinator', 'Manager', 'Central Kitchen Staff'] },
    { id: 6, action: 'New store order received from District 3', user: 'System', time: '30 minutes ago', status: 'info', roles: ['Central Kitchen Staff', 'Supply Coordinator', 'Manager'] },
    { id: 7, action: 'Inventory updated - Fresh vegetables restocked', user: 'Kitchen Staff', time: '1 hour ago', status: 'success', roles: ['Central Kitchen Staff', 'Manager'] },
    { id: 8, action: 'Daily production report generated', user: 'System', time: '2 hours ago', status: 'success', roles: ['Central Kitchen Staff', 'Manager', 'Admin'] },
  ];

  const pendingTasks = [
    { id: 1, task: 'Review and approve Store Order #SO-2401', priority: 'high', dueDate: 'Today', roles: ['Admin', 'Manager', 'Supply Coordinator'] },
    { id: 2, task: 'Update Production Plan for next week', priority: 'medium', dueDate: 'Tomorrow', roles: ['Admin', 'Central Kitchen Staff', 'Manager'] },
    { id: 3, task: 'Quality check for incoming shipment #SH-891', priority: 'high', dueDate: 'Today', roles: ['Admin', 'Manager', 'Franchise Store Staff'] },
    { id: 4, task: 'Aggregate store orders for batch production', priority: 'medium', dueDate: 'Today', roles: ['Admin', 'Manager', 'Supply Coordinator'] },
    { id: 5, task: 'Receive and check shipment #SH-891', priority: 'high', dueDate: 'Today', roles: ['Franchise Store Staff', 'Manager'] },
    { id: 6, task: 'Prepare production batch #PB-1025', priority: 'medium', dueDate: 'Tomorrow', roles: ['Central Kitchen Staff', 'Manager'] },
    { id: 7, task: 'Update store inventory levels', priority: 'medium', dueDate: 'Today', roles: ['Franchise Store Staff', 'Manager'] },
    { id: 8, task: 'Resolve delivery scheduling conflict', priority: 'high', dueDate: 'Today', roles: ['Supply Coordinator', 'Manager'] },
  ];

  const filteredActivities = recentActivities.filter(activity =>
    activity.roles.includes(selectedRole)
  );

  const filteredTasks = pendingTasks.filter(task =>
    task.roles.includes(selectedRole)
  );

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority.toUpperCase()}</Badge>;
  };

  const getActivityStatusIcon = (status: string) => {
    if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-blue-600" />;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Simple':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Complex':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-600 text-white';
      case 'Manager':
        return 'bg-blue-600 text-white';
      case 'Central Kitchen Staff':
        return 'bg-green-600 text-white';
      case 'Supply Coordinator':
        return 'bg-orange-600 text-white';
      case 'Franchise Store Staff':
        return 'bg-cyan-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back{currentUser ? `, ${currentUser.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-gray-600 text-lg">Central Kitchen Franchise Management System</p>
            {currentUser?.storeName && (
              <p className="text-sm text-gray-500 mt-1">📍 {currentUser.storeName}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getRoleBadgeColor(selectedRole)} text-base px-4 py-2`}>
              {selectedRole}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Functions</p>
                <p className="text-3xl font-bold text-gray-900">{quickAccessCards.length}</p>
              </div>
              <Settings className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{filteredTasks.length}</p>
              </div>
              <ClipboardCheck className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Stores</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
              </div>
              <Store className="w-10 h-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Orders</p>
                <p className="text-3xl font-bold text-gray-900">47</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quick Access - {selectedRole}</h2>
            <p className="text-gray-600 mt-1">Access your functions based on role permissions</p>
          </div>
          <Badge variant="outline" className="text-sm px-4 py-2">
            {quickAccessCards.length} Functions Available
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <div className="text-xs text-gray-500 font-mono">{card.id}</div>
                </CardHeader>
                <CardContent>
                  {selectedRole !== 'Admin' && (
                    <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                  )}
                  <Button className="w-full group-hover:bg-primary group-hover:text-white" variant="outline">
                    Access Function
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Section - Activities & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                  {getActivityStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}