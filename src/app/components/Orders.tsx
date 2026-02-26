import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ShoppingCart, Truck, CheckCircle, Clock, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  storeOrderId: string;
  franchiseStore: string;
  orderDate: string;
  deliveryDate: string;
  totalQuantity: number;
  status: 'pending' | 'processing' | 'shipping' | 'delivered';
  items: number;
}

interface Shipment {
  id: string;
  shipmentId: string;
  storeOrderId: string;
  franchiseStore: string;
  deliveryStatus: 'preparing' | 'in-transit' | 'delivered';
  receivedDate: string | null;
}

const initialOrders: Order[] = [
  { id: '1', storeOrderId: 'SO-2401', franchiseStore: 'District 1 Store', orderDate: '2026-01-20', deliveryDate: '2026-01-21', totalQuantity: 450, status: 'processing', items: 8 },
  { id: '2', storeOrderId: 'SO-2402', franchiseStore: 'District 2 Store', orderDate: '2026-01-20', deliveryDate: '2026-01-21', totalQuantity: 320, status: 'shipping', items: 6 },
  { id: '3', storeOrderId: 'SO-2403', franchiseStore: 'District 7 Store', orderDate: '2026-01-19', deliveryDate: '2026-01-20', totalQuantity: 580, status: 'delivered', items: 10 },
  { id: '4', storeOrderId: 'SO-2404', franchiseStore: 'District 3 Store', orderDate: '2026-01-20', deliveryDate: '2026-01-22', totalQuantity: 200, status: 'pending', items: 4 },
];

const initialShipments: Shipment[] = [
  { id: '1', shipmentId: 'SH-1101', storeOrderId: 'SO-2402', franchiseStore: 'District 2 Store', deliveryStatus: 'in-transit', receivedDate: null },
  { id: '2', shipmentId: 'SH-1100', storeOrderId: 'SO-2403', franchiseStore: 'District 7 Store', deliveryStatus: 'delivered', receivedDate: '2026-01-20 09:30' },
  { id: '3', shipmentId: 'SH-1099', storeOrderId: 'SO-2398', franchiseStore: 'District 1 Store', deliveryStatus: 'delivered', receivedDate: '2026-01-19 14:15' },
];

export function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  const handleProcessOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'processing' as const } : o
    ));
    toast.success('Order is now being processed');
  };

  const handleShipOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: 'shipping' as const } : o
      ));
      
      const newShipment: Shipment = {
        id: String(shipments.length + 1),
        shipmentId: `SH-${1102 + shipments.length}`,
        storeOrderId: order.storeOrderId,
        franchiseStore: order.franchiseStore,
        deliveryStatus: 'preparing',
        receivedDate: null,
      };
      setShipments([newShipment, ...shipments]);
      toast.success('Order shipped successfully!');
    }
  };

  const handleConfirmDelivery = (shipmentId: string) => {
    setShipments(shipments.map(s => 
      s.shipmentId === shipmentId 
        ? { ...s, deliveryStatus: 'delivered' as const, receivedDate: new Date().toISOString().slice(0, 16).replace('T', ' ') }
        : s
    ));
    
    const shipment = shipments.find(s => s.shipmentId === shipmentId);
    if (shipment) {
      setOrders(orders.map(o => 
        o.storeOrderId === shipment.storeOrderId ? { ...o, status: 'delivered' as const } : o
      ));
    }
    
    toast.success('Delivery confirmed!');
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'Pending', className: 'bg-gray-100 text-gray-700', icon: Clock },
      'processing': { label: 'Processing', className: 'bg-blue-100 text-blue-700', icon: ShoppingCart },
      'shipping': { label: 'Shipping', className: 'bg-yellow-100 text-yellow-700', icon: Truck },
      'delivered': { label: 'Delivered', className: 'bg-green-100 text-green-700', icon: CheckCircle },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <Badge className={`${config.className} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
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
