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
// thêm tiện ích định dạng và các component giao diện dùng chung
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

// ── Role 1: Supply Coordinator ─────────────────────────────────────────────────
// triển khai giao diện điều phối cung ứng và thống kê vận hành
function SupplyCoordinatorDashboard() {
  const [orders, setOrders] = useState<StoreOrderDto[]>([]);
  const [shipments, setShipments] = useState<ShipmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([storeOrdersApi.getAll(), shipmentsApi.getAll()])
      .then(([o, s]) => {
        setOrders(o);
        setShipments(s);
      })
      .catch(() => toast.error("Không thể tải dữ liệu dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const activeDeliveries = shipments.filter(
    (s) => s.deliveryStatus === "InTransit",
  ).length;
  const rejectedOrders = orders.filter(
    (o) => o.status === "Rejected" || o.status === "RejectedByStore",
  );
  const cancelledShipments = shipments.filter(
    (s) => s.deliveryStatus === "Cancelled",
  );
  const issues = rejectedOrders.length + cancelledShipments.length;

  const recentPending = [...orders]
    .filter((o) => o.status === "Pending")
    .sort(
      (a, b) =>
        new Date(a.orderDate ?? 0).getTime() -
        new Date(b.orderDate ?? 0).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard — Điều phối cung ứng
        </h1>
        <p className="text-gray-500 mt-1">Tổng quan hoạt động vận hành</p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCard
              title="Đơn hàng chờ gom"
              value={pendingOrders}
              icon={Package}
              color="blue"
              sub="Cần tổng hợp để lên lịch sản xuất"
            />
            <KpiCard
              title="Hàng đang vận chuyển"
              value={activeDeliveries}
              icon={Truck}
              color="orange"
              sub="Lô hàng đang trên đường giao"
            />
            <KpiCard
              title="Sự cố phát sinh"
              value={issues}
              icon={AlertTriangle}
              color="red"
              sub="Đơn bị từ chối, hủy hoặc báo thiếu hàng"
            />
          </div>

          {/* Pending orders table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Đơn hàng chờ xử lý ({pendingOrders})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentPending.length === 0 ? (
                <p className="text-sm text-gray-400 px-6 pb-5">
                  Không có đơn nào đang chờ.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                        <th className="px-6 py-3 text-left font-medium">
                          Mã đơn
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Cửa hàng
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Bếp trung tâm
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Ngày đặt
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Giao dự kiến
                        </th>
                        <th className="px-6 py-3 text-right font-medium">
                          SL sản phẩm
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentPending.map((o) => (
                        <tr
                          key={o.storeOrderId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-3 font-mono text-gray-600">
                            #{o.storeOrderId}
                          </td>
                          <td className="px-6 py-3 font-medium text-gray-900">
                            {o.storeName ?? "—"}
                          </td>
                          <td className="px-6 py-3 text-gray-600">
                            {o.kitchenName ?? "—"}
                          </td>
                          <td className="px-6 py-3 text-gray-500">
                            {formatDate(o.orderDate)}
                          </td>
                          <td className="px-6 py-3 text-gray-500">
                            {formatDate(o.deliveryDate)}
                          </td>
                          <td className="px-6 py-3 text-right text-gray-700">
                            {o.totalQuantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issues table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-red-600">
                Sự cố cần xử lý ({issues})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {issues === 0 ? (
                <p className="text-sm text-gray-400 px-6 pb-5">
                  Không có sự cố nào.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                        <th className="px-6 py-3 text-left font-medium">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left font-medium">Mã</th>
                        <th className="px-6 py-3 text-left font-medium">
                          Cửa hàng / Bếp
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Lý do / Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rejectedOrders.map((o) => (
                        <tr
                          key={`order-${o.storeOrderId}`}
                          className="hover:bg-red-50 transition-colors"
                        >
                          <td className="px-6 py-3 text-gray-500">Đơn hàng</td>
                          <td className="px-6 py-3 font-mono text-gray-600">
                            #{o.storeOrderId}
                          </td>
                          <td className="px-6 py-3 text-gray-700">
                            {o.storeName ?? "—"}
                          </td>
                          <td className="px-6 py-3">
                            <OrderStatusBadge status={o.status} />
                          </td>
                          <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                            {o.rejectReason ?? "—"}
                          </td>
                        </tr>
                      ))}
                      {cancelledShipments.map((s) => (
                        <tr
                          key={`ship-${s.shipmentId}`}
                          className="hover:bg-red-50 transition-colors"
                        >
                          <td className="px-6 py-3 text-gray-500">Lô hàng</td>
                          <td className="px-6 py-3 font-mono text-gray-600">
                            #{s.shipmentId}
                          </td>
                          <td className="px-6 py-3 text-gray-700">
                            {s.kitchenName ?? "—"}
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Đã hủy
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-500">—</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

 // ── Role 2: Manager ────────────────────────────────────────────────────────────

function ManagerDashboard() {
  const [stores, setStores] = useState<FranchiseStoreDto[]>([]);
  const [allCosts, setAllCosts] = useState<StoreCostRecordDto[]>([]);
  const [orders, setOrders] = useState<StoreOrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([storeOrdersApi.getAll(), franchiseStoresApi.getAll()])
      .then(async ([orderList, storeList]) => {
        setOrders(orderList);
        setStores(storeList);
        const costsPerStore = await Promise.all(
          storeList.map((s) => storeInventoryApi.getCosts(s.storeId)),
        );
        setAllCosts(costsPerStore.flat());
      })
      .catch(() => toast.error("Không thể tải dữ liệu dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const operatingTotal = allCosts
    .filter((c) => c.costType === "OperatingCost")
    .reduce((acc, c) => acc + c.cost, 0);
  const wasteTotal = allCosts
    .filter((c) => c.costType === "WasteCost")
    .reduce((acc, c) => acc + c.cost, 0);

  const costByStore = stores.map((s) => ({
    name: s.storeName,
    operating: allCosts
      .filter((c) => c.storeId === s.storeId && c.costType === "OperatingCost")
      .reduce((acc, c) => acc + c.cost, 0),
    waste: allCosts
      .filter((c) => c.storeId === s.storeId && c.costType === "WasteCost")
      .reduce((acc, c) => acc + c.cost, 0),
  }));

  const wasteByIngredient = allCosts
    .filter((c) => c.costType === "WasteCost")
    .reduce<Record<string, number>>((acc, c) => {
      acc[c.ingredientName] = (acc[c.ingredientName] ?? 0) + c.cost;
      return acc;
    }, {});
  const top5Waste = Object.entries(wasteByIngredient)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const productQty = orders
    .filter((o) => o.status === "Delivered")
    .flatMap((o) => o.lines)
    .reduce<Record<string, number>>((acc, l) => {
      const name = l.productName ?? `#${l.productId}`;
      acc[name] = (acc[name] ?? 0) + l.quantity;
      return acc;
    }, {});
  const top5Products = Object.entries(productQty)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard — Quản lý vận hành
        </h1>
        <p className="text-gray-500 mt-1">
          Tổng quan chi phí và hao hụt toàn chuỗi
        </p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KpiCard
              title="Tổng chi phí vận hành"
              value={formatVND(operatingTotal)}
              icon={DollarSign}
              color="blue"
              sub="Tổng nguyên liệu tiêu thụ qua bán hàng (tất cả chi nhánh)"
            />
            <KpiCard
              title="Tổng giá trị hao hụt"
              value={formatVND(wasteTotal)}
              icon={TrendingDown}
              color="red"
              sub="Hàng hết hạn và bị hỏng (tất cả chi nhánh)"
            />
          </div>

          {/* Grouped bar chart: operating cost + waste per store */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Chi phí vận hành & Hao hụt theo cửa hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {costByStore.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Chưa có dữ liệu
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={costByStore}
                    margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                  >
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(v: number, name: string) => [
                        formatVND(v),
                        name === "operating" ? "Chi phí vận hành" : "Hao hụt",
                      ]}
                    />
                    <Legend
                      formatter={(value) =>
                        value === "operating" ? "Chi phí vận hành" : "Hao hụt"
                      }
                    />
                    <Bar
                      dataKey="operating"
                      name="operating"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="waste"
                      name="waste"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top 5 lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Top 5 nguyên liệu hao hụt nhiều nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                {top5Waste.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Chưa có dữ liệu hao hụt
                  </p>
                ) : (
                  <ol className="space-y-3 pt-1">
                    {top5Waste.map(([name, cost], i) => (
                      <li
                        key={name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                        <span className="text-sm text-red-600 font-semibold ml-2">
                          {formatVND(cost)}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Top 5 sản phẩm bán chạy nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                {top5Products.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Chưa có đơn hàng nào được giao
                  </p>
                ) : (
                  <ol className="space-y-3 pt-1">
                    {top5Products.map(([name, qty], i) => (
                      <li
                        key={name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                        <span className="text-sm text-blue-600 font-semibold ml-2">
                          {qty.toLocaleString("vi-VN")} đơn vị
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
          {/* Issues table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-red-600">
                Sự cố cần xử lý ({issues})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {issues === 0 ? (
                <p className="text-sm text-gray-400 px-6 pb-5">
                  Không có sự cố nào.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                        <th className="px-6 py-3 text-left font-medium">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left font-medium">Mã</th>
                        <th className="px-6 py-3 text-left font-medium">
                          Cửa hàng / Bếp
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left font-medium">
                          Lý do / Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rejectedOrders.map((o) => (
                        <tr
                          key={`order-${o.storeOrderId}`}
                          className="hover:bg-red-50 transition-colors"
                        >
                          <td className="px-6 py-3 text-gray-500">Đơn hàng</td>
                          <td className="px-6 py-3 font-mono text-gray-600">
                            #{o.storeOrderId}
                          </td>
                          <td className="px-6 py-3 text-gray-700">
                            {o.storeName ?? "—"}
                          </td>
                          <td className="px-6 py-3">
                            <OrderStatusBadge status={o.status} />
                          </td>
                          <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                            {o.rejectReason ?? "—"}
                          </td>
                        </tr>
                      ))}
                      {cancelledShipments.map((s) => (
                        <tr
                          key={`ship-${s.shipmentId}`}
                          className="hover:bg-red-50 transition-colors"
                        >
                          <td className="px-6 py-3 text-gray-500">Lô hàng</td>
                          <td className="px-6 py-3 font-mono text-gray-600">
                            #{s.shipmentId}
                          </td>
                          <td className="px-6 py-3 text-gray-700">
                            {s.kitchenName ?? "—"}
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Đã hủy
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-500">—</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

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