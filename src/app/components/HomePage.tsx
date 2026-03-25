import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Package,
  Truck,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  ChefHat,
  CheckCircle2,
  Clock,
  Store,
  Loader2,
  Badge,
} from "lucide-react";
import { toast } from "sonner";
import { storeOrdersApi, shipmentsApi } from "@/app/services/ordersService";
import type { StoreOrderDto, ShipmentDto } from "@/app/services/ordersService";
import {
  franchiseStoresApi,
  centralKitchensApi,
} from "@/app/services/storesService";
import type {
  FranchiseStoreDto,
  CentralKitchenDto,
} from "@/app/services/storesService";
import { storeInventoryApi } from "@/app/services/inventoryService";
import type { StoreCostRecordDto } from "@/app/services/inventoryService";
import { usersApi } from "@/app/services/usersService";
import type { UserApiModel } from "@/app/services/usersService";

// ── Helpers ────────────────────────────────────────────────────────────────────
// thêm hàm định dạng tiền VND và ngày tháng
function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── Shared UI ──────────────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  );
}

const colorMap = {
  blue: { text: "text-blue-600", icon: "bg-blue-100" },
  orange: { text: "text-orange-600", icon: "bg-orange-100" },
  red: { text: "text-red-600", icon: "bg-red-100" },
  violet: { text: "text-violet-600", icon: "bg-violet-100" },
  green: { text: "text-emerald-600", icon: "bg-emerald-100" },
  amber: { text: "text-amber-600", icon: "bg-amber-100" },
};

interface KpiCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: keyof typeof colorMap;
  sub: string;
}

function KpiCard({ title, value, icon: Icon, color, sub }: KpiCardProps) {
  const c = colorMap[color];
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-3xl font-bold mt-1 truncate ${c.text}`}>
              {value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
          <div className={`p-3 rounded-xl ml-4 shrink-0 ${c.icon}`}>
            <Icon className={`h-6 w-6 ${c.text}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderStatusBadge({ status }: { status?: string }) {
  const config: Record<string, { label: string; className: string }> = {
    Pending: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-700" },
    Submitted: { label: "Đã gửi", className: "bg-blue-100 text-blue-700" },
    Approved: { label: "Đã duyệt", className: "bg-indigo-100 text-indigo-700" },
    Rejected: { label: "Từ chối", className: "bg-red-100 text-red-700" },
    Delivering: {
      label: "Đang giao",
      className: "bg-orange-100 text-orange-700",
    },
    NeedsProduction: {
      label: "Cần sản xuất",
      className: "bg-purple-100 text-purple-700",
    },
    InProduction: {
      label: "Đang sản xuất",
      className: "bg-amber-100 text-amber-700",
    },
    ProductionCompleted: {
      label: "Sản xuất xong",
      className: "bg-teal-100 text-teal-700",
    },
    Delivered: { label: "Đã giao", className: "bg-green-100 text-green-700" },
    RejectedByStore: {
      label: "Store từ chối",
      className: "bg-rose-100 text-rose-700",
    },
  };
  const s = config[status ?? ""] ?? {
    label: status ?? "—",
    className: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}
    >
      {s.label}
    </span>
  );
}

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
//Layout chính: chia màn hình 2 cột (branding & form), Left: Logo + thông tin hệ thống + danh sách feature, right: hiển thị login/register dựa vào view state
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