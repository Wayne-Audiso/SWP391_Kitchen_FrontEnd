import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Store, MapPin, Phone, Plus, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  franchiseStoresApi,
  centralKitchensApi,
  type FranchiseStoreDto,
  type CentralKitchenDto,
  type CreateFranchiseStoreModel,
  type CreateCentralKitchenModel,
} from '@/app/services/storesService';

export function Stores() {
  // --- Franchise Stores state ---
  const [stores, setStores] = useState<FranchiseStoreDto[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [newStore, setNewStore] = useState<CreateFranchiseStoreModel>({
    kitchenId: 0,
    storeName: '',
    address: '',
  });

  // --- Central Kitchens state ---
  const [kitchens, setKitchens] = useState<CentralKitchenDto[]>([]);
  const [kitchensLoading, setKitchensLoading] = useState(true);
  const [isCreateKitchenOpen, setIsCreateKitchenOpen] = useState(false);
  const [newKitchen, setNewKitchen] = useState<CreateCentralKitchenModel>({
    name: '',
    address: '',
    phone: '',
  });

  // --- Load data on mount ---
  useEffect(() => {
    loadStores();
    loadKitchens();
  }, []);

  const loadStores = async () => {
    setStoresLoading(true);
    try {
      const data = await franchiseStoresApi.getAll();
      setStores(data);
    } catch {
      toast.error('Failed to load franchise stores');
    } finally {
      setStoresLoading(false);
    }
  };

  const loadKitchens = async () => {
    setKitchensLoading(true);
    try {
      const data = await centralKitchensApi.getAll();
      setKitchens(data);
    } catch {
      toast.error('Failed to load central kitchens');
    } finally {
      setKitchensLoading(false);
    }
  };

  // --- Franchise Store handlers ---
  const handleCreateStore = async () => {
    if (!newStore.storeName || !newStore.kitchenId) {
      toast.error('Please fill in Store Name and select a Central Kitchen');
      return;
    }
    try {
      const created = await franchiseStoresApi.create(newStore);
      setStores([...stores, created]);
      setIsCreateStoreOpen(false);
      setNewStore({ kitchenId: 0, storeName: '', address: '' });
      toast.success('Franchise store created successfully!');
    } catch {
      toast.error('Failed to create franchise store');
    }
  };

  const handleDeleteStore = async (id: number, name: string) => {
    if (!window.confirm(`Delete store "${name}"?`)) return;
    try {
      await franchiseStoresApi.delete(id);
      setStores(stores.filter(s => s.storeId !== id));
      toast.success('Store deleted successfully');
    } catch {
      toast.error('Failed to delete store');
    }
  };

  // --- Central Kitchen handlers ---
  const handleCreateKitchen = async () => {
    if (!newKitchen.name) {
      toast.error('Please enter a Kitchen Name');
      return;
    }
    try {
      const created = await centralKitchensApi.create(newKitchen);
      setKitchens([...kitchens, created]);
      setIsCreateKitchenOpen(false);
      setNewKitchen({ name: '', address: '', phone: '' });
      toast.success('Central kitchen created successfully!');
    } catch {
      toast.error('Failed to create central kitchen');
    }
  };

  const handleDeleteKitchen = async (id: number, name: string) => {
    if (!window.confirm(`Delete kitchen "${name}"?`)) return;
    try {
      await centralKitchensApi.delete(id);
      setKitchens(kitchens.filter(k => k.centralKitchenId !== id));
      toast.success('Kitchen deleted successfully');
    } catch {
      toast.error('Failed to delete kitchen');
    }
  };

  const getStatusBadge = (status?: string) => {
    if (status === 'Inactive') {
      return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700">Active</Badge>;
  };

  const activeKitchens = kitchens.filter(k => k.status !== 'Inactive');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Store Management</h2>
        <p className="text-gray-600 mt-2">Manage franchise stores and central kitchens</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Franchise Stores</CardTitle>
            <Store className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total franchise locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Central Kitchens</CardTitle>
            <Building2 className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kitchens.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total kitchen facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Kitchens</CardTitle>
            <Building2 className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeKitchens.length}</div>
            <p className="text-xs text-gray-600 mt-1">Currently operating</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stores">
        <TabsList className="mb-6">
          <TabsTrigger value="stores">Franchise Stores</TabsTrigger>
          <TabsTrigger value="kitchens">Central Kitchens</TabsTrigger>
        </TabsList>

        {/* ===== FRANCHISE STORES TAB ===== */}
        <TabsContent value="stores">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Franchise Stores</h3>
            <Dialog open={isCreateStoreOpen} onOpenChange={setIsCreateStoreOpen}>
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
                    <Label>Central Kitchen</Label>
                    <Select
                      value={newStore.kitchenId ? String(newStore.kitchenId) : ''}
                      onValueChange={(v) => setNewStore({ ...newStore, kitchenId: Number(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a central kitchen" />
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
                      value={newStore.address ?? ''}
                      onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateStoreOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateStore}>Create Store</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {storesLoading ? (
            <div className="text-center py-12 text-gray-500">Loading stores...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No franchise stores found.</div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Store Name</TableHead>
                      <TableHead>Central Kitchen</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.map((store) => (
                      <TableRow key={store.storeId}>
                        <TableCell className="font-medium">{store.storeId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-blue-600" />
                            {store.storeName}
                          </div>
                        </TableCell>
                        <TableCell>{store.kitchenName ?? `Kitchen #${store.kitchenId}`}</TableCell>
                        <TableCell>
                          {store.address ? (
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-xs">{store.address}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteStore(store.storeId, store.storeName)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== CENTRAL KITCHENS TAB ===== */}
        <TabsContent value="kitchens">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Central Kitchens</h3>
            <Dialog open={isCreateKitchenOpen} onOpenChange={setIsCreateKitchenOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Kitchen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Central Kitchen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Kitchen Name</Label>
                    <Input
                      placeholder="Enter kitchen name"
                      value={newKitchen.name}
                      onChange={(e) => setNewKitchen({ ...newKitchen, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      placeholder="Enter full address"
                      value={newKitchen.address ?? ''}
                      onChange={(e) => setNewKitchen({ ...newKitchen, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="Enter phone number"
                      value={newKitchen.phone ?? ''}
                      onChange={(e) => setNewKitchen({ ...newKitchen, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateKitchenOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKitchen}>Create Kitchen</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {kitchensLoading ? (
            <div className="text-center py-12 text-gray-500">Loading kitchens...</div>
          ) : kitchens.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No central kitchens found.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {kitchens.map((kitchen) => (
                <Card key={kitchen.centralKitchenId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{kitchen.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">ID: {kitchen.centralKitchenId}</p>
                        </div>
                      </div>
                      {getStatusBadge(kitchen.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {kitchen.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{kitchen.address}</span>
                      </div>
                    )}
                    {kitchen.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{kitchen.phone}</span>
                      </div>
                    )}
                    <div className="pt-2 text-sm text-gray-500">
                      Stores assigned:{' '}
                      <span className="font-medium text-gray-700">
                        {stores.filter(s => s.kitchenId === kitchen.centralKitchenId).length}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteKitchen(kitchen.centralKitchenId, kitchen.name)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
