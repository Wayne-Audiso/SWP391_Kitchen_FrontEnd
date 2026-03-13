import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
  Package,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  storeOrdersApi,
  shipmentsApi,
  type StoreOrderDto,
  type ShipmentDto,
  type CreateStoreOrderModel,
  type CreateStoreOrderLineModel,
  type ReceiveShipmentLineModel,
} from "@/app/services/ordersService";
import {
  centralKitchensApi,
  franchiseStoresApi,
  type CentralKitchenDto,
  type FranchiseStoreDto,
} from "@/app/services/storesService";
import {
  productsApi,
  type ProductDto,
} from "@/app/services/productsService";


const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  } catch {
    return {};
  }
};

const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  Pending:      { label: "Pending",       className: "bg-gray-100 text-gray-700" },
  Approved:     { label: "Approved",      className: "bg-blue-100 text-blue-700" },
  Rejected:     { label: "Rejected",      className: "bg-red-100 text-red-700" },
  InProduction: { label: "In Production", className: "bg-purple-100 text-purple-700" },
  InDelivery:   { label: "In Delivery",   className: "bg-yellow-100 text-yellow-700" },
  Completed:    { label: "Completed",     className: "bg-green-100 text-green-700" },
};

// Issue #4 fix: "Preparing" added — backend now initialises DeliveryStatus to "Preparing"
const SHIPMENT_STATUS: Record<string, { label: string; className: string }> = {
  Preparing:  { label: "Preparing",   className: "bg-blue-100 text-blue-700" },
  InDelivery: { label: "In Delivery", className: "bg-yellow-100 text-yellow-700" },
  Delivered:  { label: "Delivered",   className: "bg-green-100 text-green-700" },
  Cancelled:  { label: "Cancelled",   className: "bg-red-100 text-red-700" },
};

// Luồng trạng thái đơn hàng
const NEXT_STATUS: Record<string, string> = {
  Pending:      "Approved",
  Approved:     "InProduction",
  InProduction: "InDelivery",
  InDelivery:   "Completed",
};

const NEXT_LABEL: Record<string, string> = {
  Pending:      "Approve",
  Approved:     "Start Production",
  InProduction: "Send Delivery",
  InDelivery:   "Mark Completed",
};
// Phân quyền người dùng theo vai trò cho module Orders
export function Orders() {
  const currentUser = getCurrentUser();
  const role: string = currentUser.role ?? "";

  // Role-based permissions
  const canCreateOrder =
    role === "Franchise Store Staff" || role === "Supply Coordinator" || role === "Admin";
  const canUpdateOrderStatus =
    role === "Supply Coordinator" || role === "Manager" || role === "Admin";
  // Issue #2: kitchen staff creates shipments
  const canCreateShipment =
    role === "Central Kitchen Staff" || role === "Admin";
  // Issue #2: SC/Manager advances shipment Preparing → InDelivery
  const canUpdateShipmentStatus =
    role === "Supply Coordinator" || role === "Manager" || role === "Admin";
  const canReceiveShipment =
    role === "Franchise Store Staff" || role === "Supply Coordinator" || role === "Admin";

  const handleProcessOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'processing' as const } : o
    ));
    toast.success('Order is now being processed');
  };
  // ── Data state ──────────────────────────────────────────────────────────────
   const [orders,    setOrders]    = useState<StoreOrderDto[]>([]);
  const [shipments, setShipments] = useState<ShipmentDto[]>([]);
  const [kitchens,  setKitchens]  = useState<CentralKitchenDto[]>([]);
  const [stores,    setStores]    = useState<FranchiseStoreDto[]>([]);
  const [products,  setProducts]  = useState<ProductDto[]>([]);
  const [loading,   setLoading]   = useState(true);

  // ── Create Order form ────────────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateStoreOrderModel>({
    centralKitchenId: 0,
    franchiseStoreId: 0,
    deliveryDate:     undefined,
    lines:            [],
  });
  const [submitting, setSubmitting] = useState(false);
  // ── Issue #2: Create Shipment form ───────────────────────────────────────────
const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [shipmentForm, setShipmentForm] = useState<{
    storeOrderId:     number;
    centralKitchenId: number;
    lines: { productId: number; shippedQuantity: number }[];
  }>({
    storeOrderId:     0,
    centralKitchenId: 0,
    lines:            [{ productId: 0, shippedQuantity: 1 }],
  });
  const [creatingShipment, setCreatingShipment] = useState(false);
// Khởi tạo các trạng thái điều khiển UI và bộ lọc dữ liệu
  // ── Status update ────────────────────────────────────────────────────────────
  const [updatingOrderId,    setUpdatingOrderId]    = useState<number | null>(null);
  const [updatingShipmentId, setUpdatingShipmentId] = useState<number | null>(null);

  // ── Filter ───────────────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState("all");

  // ── Issue #8: controlled tabs + shipment filter by order ─────────────────────
  const [activeTab,           setActiveTab]           = useState("orders");
  const [shipmentOrderFilter, setShipmentOrderFilter] = useState<number | null>(null);

  // ── Receive Shipment dialog ──────────────────────────────────────────────────
  const [receiveShipment, setReceiveShipment] = useState<ShipmentDto | null>(null);
  const [receiveLines,    setReceiveLines]    = useState<ReceiveShipmentLineModel[]>([]);
  const [receiving,       setReceiving]       = useState(false);
//Triển khai logic tải dữ liệu đồng thời từ các API
  // ── Load data ────────────────────────────────────────────────────────────────
  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [ordersData, shipmentsData, kitchensData, storesData, productsData] =
        await Promise.all([
          storeOrdersApi.getAll(),
          shipmentsApi.getAll(),
          centralKitchensApi.getAll(),
          franchiseStoresApi.getAll(),
          productsApi.getAll(),
        ]);
      setOrders(ordersData);
      setShipments(shipmentsData);
      setKitchens(kitchensData);
      setStores(storesData);
      setProducts(productsData);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };


  const getShipmentStatusBadge = (status: string) => {
    const statusConfig = {
      'preparing': { label: 'Preparing', className: 'bg-blue-100 text-blue-700' },
      'in-transit': { label: 'In Transit', className: 'bg-yellow-100 text-yellow-700' },
      'delivered': { label: 'Delivered', className: 'bg-green-100 text-green-700' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getOrderStats = () => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipping: orders.filter(o => o.status === 'shipping').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const stats = getOrderStats();

  const filteredOrders = orderStatusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderStatusFilter);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-600 mt-2">Track and process orders from franchise stores</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <Clock className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-gray-600 mt-1">Orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Processing</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            <p className="text-xs text-gray-600 mt-1">Orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Shipping</CardTitle>
            <Truck className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.shipping}</div>
            <p className="text-xs text-gray-600 mt-1">Orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <p className="text-xs text-gray-600 mt-1">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order List</CardTitle>
                <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.storeOrderId}</TableCell>
                      <TableCell>{order.franchiseStore}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items} items</TableCell>
                      <TableCell>{order.totalQuantity} units</TableCell>
                      <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleProcessOrder(order.id)}
                            >
                              Process
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button 
                              size="sm"
                              onClick={() => handleShipOrder(order.id)}
                            >
                              Ship
                            </Button>
                          )}
                          {order.status !== 'pending' && (
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Shipment List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.shipmentId}</TableCell>
                      <TableCell>{shipment.storeOrderId}</TableCell>
                      <TableCell>{shipment.franchiseStore}</TableCell>
                      <TableCell>{getShipmentStatusBadge(shipment.deliveryStatus)}</TableCell>
                      <TableCell>
                        {shipment.receivedDate || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Track
                          </Button>
                          {shipment.deliveryStatus === 'in-transit' && (
                            <Button 
                              size="sm"
                              onClick={() => handleConfirmDelivery(shipment.shipmentId)}
                            >
                              Confirm Delivery
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
