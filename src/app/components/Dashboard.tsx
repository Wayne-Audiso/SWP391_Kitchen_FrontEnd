import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { TrendingUp, Package, Store, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const productionData = [
  { name: 'Mon', value: 850 },
  { name: 'Tue', value: 920 },
  { name: 'Wed', value: 780 },
  { name: 'Thu', value: 1100 },
  { name: 'Fri', value: 1300 },
  { name: 'Sat', value: 1450 },
  { name: 'Sun', value: 1200 },
];

const orderData = [
  { name: 'Mon', orders: 45, revenue: 12500 },
  { name: 'Tue', orders: 52, revenue: 14200 },
  { name: 'Wed', orders: 38, revenue: 10800 },
  { name: 'Thu', orders: 65, revenue: 18900 },
  { name: 'Fri', orders: 78, revenue: 22400 },
  { name: 'Sat', orders: 88, revenue: 25600 },
  { name: 'Sun', orders: 72, revenue: 20100 },
];

const storePerformance = [
  { name: 'Store Q1', value: 32 },
  { name: 'Store Q2', value: 28 },
  { name: 'Store Q3', value: 25 },
  { name: 'Store Q7', value: 15 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const alerts = [
  { id: 1, message: 'Ingredient "Wheat Flour" low stock - only 15kg remaining', type: 'warning', time: '10 minutes ago' },
  { id: 2, message: 'Order #SO-2401 requires urgent processing', type: 'urgent', time: '25 minutes ago' },
  { id: 3, message: 'Production Batch #PB-1024 completed successfully', type: 'success', time: '1 hour ago' },
];

export function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Overview of Central Kitchen and Franchise operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Production</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245 kg</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% vs yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle>
            <Store className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +8.2% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124.5K</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +15.3% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alerts</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600 mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Production - Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" name="Production (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#10b981" name="Orders" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue ($)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={storePerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {storePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {storePerformance.map((store, index) => (
                <div key={store.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-gray-700">{store.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'urgent'
                      ? 'bg-red-50 border-red-500'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-green-50 border-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className={`w-5 h-5 mt-0.5 ${
                          alert.type === 'urgent'
                            ? 'text-red-600'
                            : alert.type === 'warning'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}