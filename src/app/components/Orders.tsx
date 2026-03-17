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
//Tạo shipmentsByOrder để nhóm shipment theo storeOrderId
// ── Issue #7: shipments-per-order map ────────────────────────────────────────
 const shipmentsByOrder = useMemo(
    () =>
      shipments.reduce<Record<number, ShipmentDto[]>>((acc, s) => {
        (acc[s.storeOrderId] ??= []).push(s);
        return acc;
      }, {}),
    [shipments] 
  );
  // Cảnh báo khi order hoàn thành nhưng shipment chưa Delivered
  // ── Order status actions ─────────────────────────────────────────────────────
  const handleAdvanceStatus = async (order: StoreOrderDto) => {
    const next = NEXT_STATUS[order.status ?? ""];
    if (!next) return;

    // Issue #7: warn when completing if not all shipments are delivered
    if (next === "Completed") {
      const linked = shipmentsByOrder[order.storeOrderId] ?? [];
      const allDelivered =
        linked.length > 0 && linked.every((s) => s.deliveryStatus === "Delivered");
      if (!allDelivered) {
        toast.warning(
          `Order #${order.storeOrderId} has shipments that are not yet Delivered. Proceed with caution.`
        );
      }
    }
  //Thêm xử lý cập nhật trạng thái order và cập nhật danh sách orders
  try {
      setUpdatingOrderId(order.storeOrderId);
      const updated = await storeOrdersApi.updateStatus(order.storeOrderId, { status: next });
      setOrders((prev) =>
        prev.map((o) => (o.storeOrderId === updated.storeOrderId ? updated : o))
      );
      toast.success(`Order #${order.storeOrderId} → ${ORDER_STATUS[next]?.label}`);
    } catch {
      // handled by interceptor
    } finally {
      setUpdatingOrderId(null);
    }
  };
  //Xử lý logic từ chối đơn hàng và cập nhật trạng thái
  const handleRejectOrder = async (order: StoreOrderDto) => {
    try {
      setUpdatingOrderId(order.storeOrderId);
      const updated = await storeOrdersApi.updateStatus(order.storeOrderId, {
        status: "Rejected",
      });
      setOrders((prev) =>
        prev.map((o) => (o.storeOrderId === updated.storeOrderId ? updated : o))
      );
      toast.success(`Order #${order.storeOrderId} rejected`);
    } catch {
      // handled by interceptor
    } finally {
      setUpdatingOrderId(null);
    }
  };
  //Xử lý logic kiểm tra và tạo đơn hàng mới
  // ── Create order ─────────────────────────────────────────────────────────────
  const handleCreateOrder = async () => {
    if (!createForm.centralKitchenId || !createForm.franchiseStoreId) {
      toast.error("Please select a kitchen and a store");
      return;
    }
    if (createForm.lines.length === 0) {
      toast.error("Add at least one product line");
      return;
    }
    if (createForm.lines.some((l) => !l.productId || l.quantity < 1)) {
      toast.error("Each line must have a product and quantity ≥ 1");
      return;
    }
    const pids = createForm.lines.map((l) => l.productId);
    if (new Set(pids).size !== pids.length) {
      toast.error("The same product cannot appear twice in one order");
      return;
    }
    try {
      setSubmitting(true);
      const newOrder = await storeOrdersApi.create(createForm);
      setOrders((prev) => [newOrder, ...prev]);
      toast.success("Order created successfully");
      setIsCreateOpen(false);
      setCreateForm({
        centralKitchenId: 0,
        franchiseStoreId: 0,
        deliveryDate:     undefined,
        lines:            [],
      });
    } catch {
      // handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };
  //xử lý thêm, xóa, sửa chi tiết đơn hàng
  // ── Create Order line helpers ─────────────────────────────────────────────────
  const addOrderLine = () =>
    setCreateForm((f) => ({ ...f, lines: [...f.lines, { productId: 0, quantity: 1 }] }));

  const removeOrderLine = (idx: number) =>
    setCreateForm((f) => ({ ...f, lines: f.lines.filter((_, i) => i !== idx) }));

  const updateOrderLine = (idx: number, field: keyof CreateStoreOrderLineModel, value: number) =>
    setCreateForm((f) => ({
      ...f,
      lines: f.lines.map((l, i) => (i === idx ? { ...l, [field]: value } : l)),
    }));
  // hoàn thiện logic tạo lô hàng và quản lý chi tiết sản phẩm
 // ── Issue #2: Create Shipment ─────────────────────────────────────────────────
  const handleCreateShipment = async () => {
    //Kiểm tra: Bắt buộc phải chọn một Đơn hàng trước
    if (!shipmentForm.storeOrderId) {
      toast.error("Please select an order");
      return;
    }
    // Lọc bỏ các dòng trống (người dùng bấm Add nhưng chưa chọn sản phẩm)
    const validLines = shipmentForm.lines.filter((l) => l.productId > 0);
    //// Kiểm tra: Phải có ít nhất 1 sản phẩm hợp lệ mới cho đi tiếp
    if (validLines.length === 0) {
      toast.error("Please add at least one product line");
      return;
    }
    try {
      setCreatingShipment(true); //// Khóa nút bấm để tránh click đúp
      // Gọi API tạo Shipment với dữ liệu đã được lọc sạch
      const newShipment = await shipmentsApi.create({
        storeOrderId:     shipmentForm.storeOrderId,
        centralKitchenId: shipmentForm.centralKitchenId,
        lines: validLines.map((l) => ({
          productId:       l.productId,
          shippedQuantity: l.shippedQuantity,
        })),
      });
      // Ép lô hàng mới lên đầu danh sách hiển thị
      setShipments((prev) => [newShipment, ...prev]);
      toast.success(`Shipment #${newShipment.shipmentId} created`);
      // Đóng form và reset dữ liệu về trạng thái trống ban đầu
      setIsCreateShipmentOpen(false);
      setShipmentForm({
        storeOrderId:     0,
        centralKitchenId: 0,
        lines:            [{ productId: 0, shippedQuantity: 1 }],
      });
    } catch {
      // handled by interceptor, // Để trống vì lỗi API (như 400, 500) đã được bắt tự động ở interceptor
    } finally {
      //Luôn tắt trạng thái loading dù API thành công hay thất bại
      setCreatingShipment(false);
    }
  };
  //Thêm một dòng mới (mặc định id = 0, số lượng = 1) vào cuối mảng
  const addShipmentLine = () =>
    setShipmentForm((f) => ({
      ...f,
      lines: [...f.lines, { productId: 0, shippedQuantity: 1 }],
    }));
  //Xóa dòng dựa theo vị trí (index)
  const removeShipmentLine = (idx: number) =>
    setShipmentForm((f) => ({
      ...f,
      lines: f.lines.filter((_, i) => i !== idx),
    }));
  // Cập nhật dữ liệu (đổi sản phẩm hoặc số lượng) tại dòng cụ thể
  const updateShipmentLine = (
    idx: number,
    field: "productId" | "shippedQuantity",
    value: number
  ) =>
    setShipmentForm((f) => ({
      ...f,
      lines: f.lines.map((l, i) => (i === idx ? { ...l, [field]: value } : l)),
    }));
   //xử lý chuyển trạng thái lô hàng sang đang giao
  // ── Issue #2: Advance Shipment status Preparing → InDelivery ─────────────────
// Hàm xử lý việc chuyển trạng thái lô hàng từ "Đang chuẩn bị" sang "Đang giao"
 const handleAdvanceShipmentStatus = async (shipment: ShipmentDto) => {
   try {
     // BƯỚC 1: Bật trạng thái Loading cho riêng lô hàng này
     // Lưu lại ID của lô hàng đang thao tác. Thường dùng để hiển thị icon xoay xoay (spinner) 
     // hoặc disable (khóa) đúng cái nút bấm của dòng lô hàng đó, tránh người dùng bấm đúp.
     setUpdatingShipmentId(shipment.shipmentId);

     // BƯỚC 2: Gọi API cập nhật trạng thái
     // Gửi request lên server yêu cầu đổi deliveryStatus thành "InDelivery"
     // Biến 'updated' sẽ nhận lại cục dữ liệu mới nhất của lô hàng sau khi server đã update thành công.
     const updated = await shipmentsApi.updateStatus(shipment.shipmentId, {
       deliveryStatus: "InDelivery",
     });

     // BƯỚC 3: Cập nhật giao diện (Cập nhật Local State)
     // Thay vì phải gọi lại API lấy toàn bộ danh sách (fetch list) cho nặng máy,
     // ta dùng hàm map() quét qua danh sách hiện tại: 
     // Nếu ID trùng với ID lô hàng vừa sửa -> thay thế bằng data mới ('updated'). 
     // Nếu không trùng -> giữ nguyên data cũ ('s').
     setShipments((prev) =>
       prev.map((s) => (s.shipmentId === updated.shipmentId ? updated : s))
     );

     // Hiển thị thông báo (toast) cho người dùng biết thao tác đã thành công
     toast.success(`Shipment #${shipment.shipmentId} → In Delivery`);
     
   } catch {
     // BƯỚC 4: Xử lý lỗi
     // Để trống vì các lỗi API (như mất mạng, 400, 500) đã được bắt và hiển thị thông báo 
     // tự động ở file cấu hình chung (axios interceptor).
   } finally {
     // BƯỚC 5: Dọn dẹp
     // Luôn luôn chạy vào đây cuối cùng. Gán ID đang update về null để tắt hiệu ứng loading,
     // mở khóa lại nút bấm bất kể quá trình trên là thành công hay thất bại.
     setUpdatingShipmentId(null);
   }
 };
 //xử lý nghiệp vụ xác nhận nhận hàng và validate số lượng
 // ── Receive shipment ─────────────────────────────────────────────────────────

// Chuẩn bị dữ liệu khi mở form nhận hàng
const openReceive = (shipment: ShipmentDto) => {
  setReceiveShipment(shipment);
  
  // Khởi tạo danh sách sản phẩm: Mặc định coi như nhận đủ hàng (received = shipped) và không có hàng hỏng (damaged = 0)
  setReceiveLines(
    shipment.lines.map((l) => ({
      shipmentLineId:   l.shipmentLineId,
      receivedQuantity: l.shippedQuantity ?? 0,
      damagedQuantity:  0,
    }))
  );
};

//Xử lý logic khi bấm nút Xác nhận nhận hàng
const handleReceive = async () => {
  if (!receiveShipment) return;

  //  Kiểm tra logic (Validate) ---
  for (const rl of receiveLines) {
    const line    = receiveShipment.lines.find((l) => l.shipmentLineId === rl.shipmentLineId);
    const shipped = line?.shippedQuantity ?? 0;
    
    // Bắt lỗi: Số lượng NHẬN không được lớn hơn số lượng GIAO
    if ((rl.receivedQuantity ?? 0) > shipped) {
      toast.error(`Received qty (${rl.receivedQuantity}) cannot exceed shipped qty (${shipped}) for ${line?.productName ?? "product"}`);
      return;
    }
    
    // Bắt lỗi: Số lượng HỎNG không được lớn hơn số lượng NHẬN
    if ((rl.damagedQuantity ?? 0) > (rl.receivedQuantity ?? 0)) {
      toast.error(`Damaged qty cannot exceed received qty for ${line?.productName ?? "product"}`);
      return;
    }
  }

  // Gọi API & Cập nhật UI 
  try {
    setReceiving(true); // Bật loading khóa nút bấm
    
    // Đẩy dữ liệu lên server
    const updated = await shipmentsApi.receive(receiveShipment.shipmentId, {
      lines: receiveLines,
    });
    
    // Cập nhật lại data mới của lô hàng này vào danh sách tổng
    setShipments((prev) =>
      prev.map((s) => (s.shipmentId === updated.shipmentId ? updated : s))
    );
    
    toast.success("Shipment received successfully");
    setReceiveShipment(null); // Xóa state để đóng form
  } catch {
    // Lỗi đã có interceptor xử lý chung
  } finally {
    setReceiving(false); // Tắt loading
  }
};
//thêm logic tính toán thống kê và bộ lọc dữ liệu đơn/lô hàng
// ── Stats ────────────────────────────────────────────────────────────────────
// Tính toán các con số thống kê tổng quan (Thường dùng cho các thẻ Card/Header)
const stats = {
  total:     orders.length,
  pending:   orders.filter((o) => o.status === "Pending").length,
  // Đếm các đơn đang trong tiến trình xử lý (Đã duyệt, Đang sản xuất, Đang giao)
  active:    orders.filter((o) =>
    ["Approved", "InProduction", "InDelivery"].includes(o.status ?? "")
  ).length,
  completed: orders.filter((o) => o.status === "Completed").length,
};

// Lọc danh sách Đơn hàng hiển thị trên bảng
const filteredOrders =
  statusFilter === "all"
    ? orders.filter((o) => o.status !== "Inactive") // Mặc định hiển thị tất cả trừ đơn đã hủy/vô hiệu hóa
    : orders.filter((o) => o.status === statusFilter); // Lọc theo trạng thái cụ thể

// Lọc danh sách Lô hàng (Shipments) theo ID Đơn hàng (Issue #8)
const filteredShipments = shipmentOrderFilter
  ? shipments.filter((s) => s.storeOrderId === shipmentOrderFilter) // Có bộ lọc thì tìm theo ID
  : shipments; // Không có thì hiển thị toàn bộ lô hàng

// Lọc ra các Đơn hàng đủ điều kiện để TẠO Lô hàng mới
// (Thường dùng cho Dropdown/Select khi tạo Shipment: chỉ đơn Đã duyệt hoặc Đang sản xuất mới được gửi đi)
const shipmentableOrders = orders.filter((o) =>
  ["Approved", "InProduction"].includes(o.status ?? "")
);
  //hoàn thiện giao diện Quản lý Đơn/Lô hàng, tích hợp bảng và popup tạo mới
  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600 mt-2">
            Track and process orders from franchise stores
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={loadAll} disabled={loading}>
            <RotateCcw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {canCreateOrder && (
            <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4" />
              New Order
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-gray-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <Clock className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            <Truck className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs — Issue #8: controlled */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v);
          if (v !== "shipments") setShipmentOrderFilter(null);
        }}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="shipments">Shipments ({shipments.length})</TabsTrigger>
        </TabsList>

        {/* ── Orders Tab ── */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order List</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="InProduction">In Production</SelectItem>
                    <SelectItem value="InDelivery">In Delivery</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading orders...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Kitchen</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Products</TableHead>
                      {/* Issue #6: "Qty" removed; Issue #7: "Shipments" count */}
                      <TableHead>Shipments</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusCfg =
                          ORDER_STATUS[order.status ?? ""] ?? {
                            label:     order.status ?? "—",
                            className: "bg-gray-100 text-gray-700",
                          };
                        const nextStatus = NEXT_STATUS[order.status ?? ""];
                        const isUpdating = updatingOrderId === order.storeOrderId;
                        // Issue #7: shipment count + warning badge
                        const linked = shipmentsByOrder[order.storeOrderId] ?? [];
                        const needsShipment =
                          ["Approved", "InProduction"].includes(order.status ?? "") &&
                          linked.length === 0;

                        return (
                          <TableRow key={order.storeOrderId}>
                            <TableCell className="font-medium text-gray-500">
                              #{order.storeOrderId}
                            </TableCell>
                            <TableCell>{order.kitchenName ?? "—"}</TableCell>
                            <TableCell>{order.storeName ?? "—"}</TableCell>
                            <TableCell>
                              {order.orderDate
                                ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                                : "—"}
                            </TableCell>
                            <TableCell>
                              {order.deliveryDate
                                ? new Date(order.deliveryDate).toLocaleDateString("vi-VN")
                                : "—"}
                            </TableCell>
                            {/* Order Lines column */}
                            <TableCell>
                              {order.lines.length === 0 ? (
                                <span className="text-xs text-muted-foreground">—</span>
                              ) : (
                                <div className="space-y-0.5">
                                  {order.lines.map((l) => (
                                    <div key={l.storeOrderLineId} className="text-xs text-gray-600">
                                      {l.productName ?? `#${l.productId}`}
                                      {l.unit ? ` (${l.unit})` : ""}: {l.quantity}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </TableCell>
                            {/* Issue #7: Shipments column */}
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{linked.length}</Badge>
                                {needsShipment && (
                                  <span
                                    title="No shipment created yet"
                                    className="text-amber-500 text-sm"
                                  >
                                    ⚠
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 items-center flex-wrap">
                                {canUpdateOrderStatus && nextStatus && (
                                  <Button
                                    size="sm"
                                    disabled={isUpdating}
                                    onClick={() => handleAdvanceStatus(order)}
                                  >
                                    {isUpdating && (
                                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                    )}
                                    {NEXT_LABEL[order.status ?? ""]}
                                  </Button>
                                )}
                                {canUpdateOrderStatus && order.status === "Pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    disabled={isUpdating}
                                    onClick={() => handleRejectOrder(order)}
                                  >
                                    Reject
                                  </Button>
                                )}
                                {/* Issue #8: jump to Shipments tab filtered by this order */}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  title={`View shipments for Order #${order.storeOrderId}`}
                                  onClick={() => {
                                    setShipmentOrderFilter(order.storeOrderId);
                                    setActiveTab("shipments");
                                  }}
                                >
                                  <Truck className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Shipments Tab ── */}
        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle>Shipment List</CardTitle>
                  {/* Issue #8: active filter banner */}
                  {shipmentOrderFilter && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Order #{shipmentOrderFilter}
                      <button
                        onClick={() => setShipmentOrderFilter(null)}
                        className="font-bold hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                {/* Issue #2: Create Shipment button */}
                {canCreateShipment && (
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsCreateShipmentOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Create Shipment
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading shipments...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Kitchen</TableHead>
                      <TableHead>Shipment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Received Date</TableHead>
                      {/* Issue #3 (partial): richer product lines */}
                      <TableHead>Product Lines</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                          {shipmentOrderFilter
                            ? `No shipments for Order #${shipmentOrderFilter}`
                            : "No shipments found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShipments.map((shipment) => {
                        const statusCfg =
                          SHIPMENT_STATUS[shipment.deliveryStatus ?? ""] ?? {
                            label:     shipment.deliveryStatus ?? "—",
                            className: "bg-gray-100 text-gray-700",
                          };
                        const isUpdatingShipment = updatingShipmentId === shipment.shipmentId;

                        return (
                          <TableRow key={shipment.shipmentId}>
                            <TableCell className="font-medium text-gray-500">
                              #{shipment.shipmentId}
                            </TableCell>
                            <TableCell>
                              {/* Click order ID to filter */}
                              <button
                                className="text-blue-600 hover:underline text-sm font-medium"
                                onClick={() => setShipmentOrderFilter(shipment.storeOrderId)}
                              >
                                #{shipment.storeOrderId}
                              </button>
                            </TableCell>
                            <TableCell>{shipment.kitchenName ?? "—"}</TableCell>
                            <TableCell>
                              {shipment.shipmentDate
                                ? new Date(shipment.shipmentDate).toLocaleDateString("vi-VN")
                                : "—"}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
                            </TableCell>
                            <TableCell>
                              {shipment.receivedDate
                                ? new Date(shipment.receivedDate).toLocaleDateString("vi-VN")
                                : <span className="text-gray-400">—</span>}
                            </TableCell>
                            {/* Issue #3 (partial): shipped/received/damaged per product */}
                            <TableCell>
                              <div className="text-xs space-y-0.5 max-w-[200px]">
                                {shipment.lines.length === 0 ? (
                                  <span className="text-gray-400">No items</span>
                                ) : (
                                  <>
                                    {shipment.lines.slice(0, 2).map((l) => (
                                      <div key={l.shipmentLineId} className="text-gray-600">
                                        <span className="font-medium">
                                          {l.productName ?? `#${l.productId}`}
                                        </span>
                                        {": "}{l.shippedQuantity ?? 0} shipped
                                        {l.receivedQuantity != null && (
                                          <span className="text-green-600">
                                            {" / "}{l.receivedQuantity} rcvd
                                          </span>
                                        )}
                                        {l.damagedQuantity != null && l.damagedQuantity > 0 && (
                                          <span className="text-red-500">
                                            {" "}({l.damagedQuantity} dmg)
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                    {shipment.lines.length > 2 && (
                                      <div className="text-gray-400">
                                        +{shipment.lines.length - 2} more
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {/* Issue #2: Start Delivery for Preparing shipments */}
                                {canUpdateShipmentStatus &&
                                  shipment.deliveryStatus === "Preparing" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={isUpdatingShipment}
                                      onClick={() => handleAdvanceShipmentStatus(shipment)}
                                    >
                                      {isUpdatingShipment && (
                                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                      )}
                                      Start Delivery
                                    </Button>
                                  )}
                                {/* Receive for InDelivery shipments */}
                                {canReceiveShipment &&
                                  shipment.deliveryStatus === "InDelivery" && (
                                    <Button
                                      size="sm"
                                      onClick={() => openReceive(shipment)}
                                    >
                                      <Package className="w-3 h-3 mr-1" />
                                      Receive
                                    </Button>
                                  )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Create Order Dialog ── */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => { if (!submitting) setIsCreateOpen(open); }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>
                Central Kitchen <span className="text-red-500">*</span>
              </Label>
              <Select
                value={createForm.centralKitchenId ? String(createForm.centralKitchenId) : ""}
                onValueChange={(v) =>
                  setCreateForm((f) => ({ ...f, centralKitchenId: Number(v) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select kitchen..." />
                </SelectTrigger>
                <SelectContent>
                  {kitchens.map((k) => (
                    <SelectItem key={k.centralKitchenId} value={String(k.centralKitchenId)}>
                      {k.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>
                Franchise Store <span className="text-red-500">*</span>
              </Label>
              <Select
                value={createForm.franchiseStoreId ? String(createForm.franchiseStoreId) : ""}
                onValueChange={(v) =>
                  setCreateForm((f) => ({ ...f, franchiseStoreId: Number(v) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select store..." />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((s) => (
                    <SelectItem key={s.storeId} value={String(s.storeId)}>
                      {s.storeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Delivery Date</Label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={createForm.deliveryDate ?? ""}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    deliveryDate: e.target.value || undefined,
                  }))
                }
              />
            </div>

            {/* Product lines */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Products <span className="text-red-500">*</span>
                </Label>
                <Button type="button" size="sm" variant="outline" onClick={addOrderLine}>
                  <Plus className="w-3 h-3 mr-1" /> Add Product
                </Button>
              </div>
              {createForm.lines.length === 0 && (
                <p className="text-xs text-muted-foreground">No products added yet.</p>
              )}
              {createForm.lines.map((line, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Select
                    value={line.productId ? String(line.productId) : ""}
                    onValueChange={(v) => updateOrderLine(idx, "productId", Number(v))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select product..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.productId} value={String(p.productId)}>
                          {p.productName}
                          {p.unit ? ` (${p.unit})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={1}
                    className="w-20"
                    value={line.quantity}
                    onChange={(e) =>
                      updateOrderLine(idx, "quantity", Math.max(1, Number(e.target.value)))
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeOrderLine(idx)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrder} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Issue #2: Create Shipment Dialog ── */}
      <Dialog
        open={isCreateShipmentOpen}
        onOpenChange={(open) => { if (!creatingShipment) setIsCreateShipmentOpen(open); }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Shipment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Order selector — only Approved / InProduction */}
            <div className="space-y-1">
              <Label>
                Order <span className="text-red-500">*</span>
              </Label>
              {shipmentableOrders.length === 0 ? (
                <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                  No orders in Approved or In Production status available.
                </p>
              ) : (
                <Select
                  value={shipmentForm.storeOrderId ? String(shipmentForm.storeOrderId) : ""}
                  onValueChange={(v) => {
                    const orderId = Number(v);
                    const order   = orders.find((o) => o.storeOrderId === orderId);
                    setShipmentForm((f) => ({
                      ...f,
                      storeOrderId:     orderId,
                      centralKitchenId: order?.centralKitchenId ?? 0,
                      // Pre-fill from order lines so kitchen knows what was ordered
                      lines: order && order.lines.length > 0
                        ? order.lines.map((l) => ({ productId: l.productId, shippedQuantity: l.quantity }))
                        : [{ productId: 0, shippedQuantity: 1 }],
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order..." />
                  </SelectTrigger>
                  <SelectContent>
                    {shipmentableOrders.map((o) => (
                      <SelectItem key={o.storeOrderId} value={String(o.storeOrderId)}>
                        #{o.storeOrderId} — {o.storeName ?? "?"} ({o.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {shipmentForm.storeOrderId > 0 &&
                orders.find((o) => o.storeOrderId === shipmentForm.storeOrderId)?.lines.length ? (
                <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Product lines pre-filled from the order — adjust shipped quantities as needed.
                </p>
              ) : null}
            </div>

            {/* Product lines */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  Product Lines <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addShipmentLine}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Line
                </Button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {shipmentForm.lines.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select
                        value={line.productId ? String(line.productId) : ""}
                        onValueChange={(v) =>
                          updateShipmentLine(idx, "productId", Number(v))
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {products
                            .filter((p) => p.status !== "Inactive")
                            .map((p) => (
                              <SelectItem key={p.productId} value={String(p.productId)}>
                                {p.productName}
                                {p.unit ? ` (${p.unit})` : ""}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        className="h-9"
                        min={1}
                        placeholder="Qty"
                        value={line.shippedQuantity}
                        onChange={(e) =>
                          updateShipmentLine(
                            idx,
                            "shippedQuantity",
                            Math.max(1, Number(e.target.value) || 1)
                          )
                        }
                      />
                    </div>
                    {shipmentForm.lines.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 px-2"
                        onClick={() => removeShipmentLine(idx)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateShipmentOpen(false)}
              disabled={creatingShipment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateShipment}
              disabled={creatingShipment || shipmentableOrders.length === 0}
            >
              {creatingShipment && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Shipment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Receive Shipment Dialog ── */}
      <Dialog
        open={!!receiveShipment}
        onOpenChange={(open) => { if (!receiving && !open) setReceiveShipment(null); }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Receive Shipment #{receiveShipment?.shipmentId}
            </DialogTitle>
          </DialogHeader>
          {receiveShipment && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-gray-600">
                Confirm received and damaged quantities for each product line.
              </p>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {receiveShipment.lines.map((line, idx) => {
                  const rl = receiveLines[idx];
                  if (!rl) return null;
                  return (
                    <div
                      key={line.shipmentLineId}
                      className="p-3 bg-gray-50 rounded-lg space-y-2"
                    >
                      <p className="font-medium text-sm">
                        {line.productName ?? `Product #${line.productId}`}
                        <span className="text-gray-400 font-normal ml-2">
                          (shipped: {line.shippedQuantity ?? 0})
                        </span>
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Received Qty</Label>
                          <Input
                            type="number"
                            className="h-8"
                            value={rl.receivedQuantity ?? ""}
                            onChange={(e) => {
                              const val = e.target.value ? Number(e.target.value) : undefined;
                              setReceiveLines((prev) =>
                                prev.map((r, i) =>
                                  i === idx ? { ...r, receivedQuantity: val } : r
                                )
                              );
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Damaged Qty</Label>
                          <Input
                            type="number"
                            className="h-8"
                            value={rl.damagedQuantity ?? ""}
                            onChange={(e) => {
                              const val = e.target.value ? Number(e.target.value) : undefined;
                              setReceiveLines((prev) =>
                                prev.map((r, i) =>
                                  i === idx ? { ...r, damagedQuantity: val } : r
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setReceiveShipment(null)}
                  disabled={receiving}
                >
                  Cancel
                </Button>
                <Button onClick={handleReceive} disabled={receiving}>
                  {receiving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Confirm Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}