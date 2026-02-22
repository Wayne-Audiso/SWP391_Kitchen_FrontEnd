import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Store, MapPin, Phone, Mail, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface FranchiseStore {
  id: string;
  storeId: string;
  storeName: string;
  address: string;
  phone: string;
  status: 'active' | 'inactive';
  manager: string;
  email: string;
}

const initialStores: FranchiseStore[] = [
  {
    id: '1',
    storeId: 'FS-001',
    storeName: 'District 1 Store',
    address: '123 Nguyen Hue, District 1, HCMC',
    phone: '028 3822 1234',
    status: 'active',
    manager: 'John Smith',
    email: 'd1@franchise.com',
  },
  {
    id: '2',
    storeId: 'FS-002',
    storeName: 'District 2 Store',
    address: '456 Hanoi Highway, District 2, HCMC',
    phone: '028 3744 5678',
    status: 'active',
    manager: 'Sarah Johnson',
    email: 'd2@franchise.com',
  },
  {
    id: '3',
    storeId: 'FS-003',
    storeName: 'District 3 Store',
    address: '789 Vo Van Tan, District 3, HCMC',
    phone: '028 3930 9012',
    status: 'active',
    manager: 'Michael Chen',
    email: 'd3@franchise.com',
  },
  {
    id: '4',
    storeId: 'FS-007',
    storeName: 'District 7 Store',
    address: '321 Nguyen Thi Thap, District 7, HCMC',
    phone: '028 5413 3456',
    status: 'active',
    manager: 'Emily Wong',
    email: 'd7@franchise.com',
  },
  {
    id: '5',
    storeId: 'FS-010',
    storeName: 'District 10 Store',
    address: '555 Ba Thang Hai, District 10, HCMC',
    phone: '028 3868 7890',
    status: 'inactive',
    manager: 'David Lee',
    email: 'd10@franchise.com',
  },
];

export function Stores() {
  const [stores, setStores] = useState<FranchiseStore[]>(initialStores);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [newStore, setNewStore] = useState({
    storeName: '',
    address: '',
    phone: '',
    manager: '',
    email: '',
  });

  const handleCreateStore = () => {
    if (!newStore.storeName || !newStore.address || !newStore.phone || !newStore.manager || !newStore.email) {
      toast.error('Please fill in all fields');
      return;
    }

    const store: FranchiseStore = {
      id: String(stores.length + 1),
      storeId: `FS-${String(stores.length + 1).padStart(3, '0')}`,
      storeName: newStore.storeName,
      address: newStore.address,
      phone: newStore.phone,
      status: 'active',
      manager: newStore.manager,
      email: newStore.email,
    };

    setStores([...stores, store]);
    setIsCreateDialogOpen(false);
    setNewStore({ storeName: '', address: '', phone: '', manager: '', email: '' });
    toast.success('Franchise store created successfully!');
  };

  const handleToggleStatus = (storeId: string) => {
    setStores(stores.map(s => 
      s.id === storeId 
        ? { ...s, status: s.status === 'active' ? 'inactive' as const : 'active' as const }
        : s
    ));
    toast.success('Store status updated');
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-700">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
    );
  };

  const filteredStores = statusFilter === 'all'
    ? stores
    : stores.filter(s => s.status === statusFilter);

  const activeStores = stores.filter(s => s.status === 'active').length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Franchise Store Management</h2>
          <p className="text-gray-600 mt-2">Manage and monitor franchise store locations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Franchise Store</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input
                  placeholder="Enter store name"
                  value={newStore.storeName}
                  onChange={(e) => setNewStore({ ...newStore, storeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Enter full address"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="Enter phone number"
                  value={newStore.phone}
                  onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Manager Name</Label>
                <Input
                  placeholder="Enter manager name"
                  value={newStore.manager}
                  onChange={(e) => setNewStore({ ...newStore, manager: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newStore.email}
                  onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStore}>
                Create Store
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Stores</CardTitle>
            <Store className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
            <p className="text-xs text-gray-600 mt-1">Franchise locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Stores</CardTitle>
            <Store className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStores}</div>
            <p className="text-xs text-gray-600 mt-1">Currently operating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Stores</CardTitle>
            <Store className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stores.length - activeStores}</div>
            <p className="text-xs text-gray-600 mt-1">Temporarily closed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Store Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Store className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{store.storeName}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{store.storeId}</p>
                  </div>
                </div>
                {getStatusBadge(store.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{store.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{store.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{store.email}</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Manager:</span> {store.manager}
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" size="sm">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  Order History
                </Button>
                <Button 
                  variant={store.status === 'active' ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => handleToggleStatus(store.id)}
                >
                  {store.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Store Table */}
      <Card>
        <CardHeader>
          <CardTitle>Store Overview Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store ID</TableHead>
                <TableHead>Store Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.storeId}</TableCell>
                  <TableCell>{store.storeName}</TableCell>
                  <TableCell className="max-w-xs truncate">{store.address}</TableCell>
                  <TableCell>{store.manager}</TableCell>
                  <TableCell>{store.phone}</TableCell>
                  <TableCell>{getStatusBadge(store.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
