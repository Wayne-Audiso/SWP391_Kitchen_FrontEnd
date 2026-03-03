import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Package, Tag, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  productsApi,
  productTypesApi,
  type ProductDto,
  type ProductTypeDto,
  type CreateProductModel,
  type CreateProductTypeModel,
} from '@/app/services/productsService';

export function Products() {
  // ── Product Types state ──────────────────────────────────────────────────
  const [productTypes, setProductTypes] = useState<ProductTypeDto[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [isCreateTypeOpen, setIsCreateTypeOpen] = useState(false);
  const [newType, setNewType] = useState<CreateProductTypeModel>({
    typeName: '',
    description: '',
    storageCondition: '',
  });

  // ── Products state ───────────────────────────────────────────────────────
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<CreateProductModel>({
    productTypeId: 0,
    productName: '',
    unit: '',
  });

  // ── Load on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    loadProductTypes();
    loadProducts();
  }, []);

  const loadProductTypes = async () => {
    setTypesLoading(true);
    try {
      const data = await productTypesApi.getAll();
      setProductTypes(data);
    } catch {
      toast.error('Failed to load product types');
    } finally {
      setTypesLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  // ── Product Type handlers ────────────────────────────────────────────────
  const handleCreateType = async () => {
    if (!newType.typeName.trim()) {
      toast.error('Please enter a Type Name');
      return;
    }
    try {
      const created = await productTypesApi.create(newType);
      setProductTypes([...productTypes, created]);
      setIsCreateTypeOpen(false);
      setNewType({ typeName: '', description: '', storageCondition: '' });
      toast.success('Product type created successfully!');
    } catch {
      toast.error('Failed to create product type');
    }
  };

  const handleDeleteType = async (id: number, name: string) => {
    if (!window.confirm(`Delete product type "${name}"? This may affect existing products.`)) return;
    try {
      await productTypesApi.delete(id);
      setProductTypes(productTypes.filter(t => t.productTypeId !== id));
      toast.success(`Deleted product type: ${name}`);
    } catch {
      toast.error('Failed to delete product type');
    }
  };

  // ── Product handlers ─────────────────────────────────────────────────────
  const handleCreateProduct = async () => {
    if (!newProduct.productName.trim() || !newProduct.productTypeId) {
      toast.error('Please fill in Product Name and select a Product Type');
      return;
    }
    try {
      const created = await productsApi.create(newProduct);
      setProducts([...products, created]);
      setIsCreateProductOpen(false);
      setNewProduct({ productTypeId: 0, productName: '', unit: '' });
      toast.success('Product created successfully!');
    } catch {
      toast.error('Failed to create product');
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      await productsApi.delete(id);
      setProducts(products.filter(p => p.productId !== id));
      toast.success(`Deleted product: ${name}`);
    } catch {
      toast.error('Failed to delete product');
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getStatusBadge = (status?: string) => {
    if (!status || status === 'Active') {
      return <Badge className="bg-green-100 text-green-700">Active</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>;
  };

  const activeProducts = products.filter(p => !p.status || p.status === 'Active');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
        <p className="text-gray-600 mt-2">Manage product catalog and product types</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-gray-600 mt-1">In product catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Product Types</CardTitle>
            <Tag className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productTypes.length}</div>
            <p className="text-xs text-gray-600 mt-1">Categories defined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Products</CardTitle>
            <Package className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeProducts.length}</div>
            <p className="text-xs text-gray-600 mt-1">Currently available</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="types">Product Types</TabsTrigger>
        </TabsList>

        {/* ===== PRODUCTS TAB ===== */}
        <TabsContent value="products">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Products</h3>
            <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Product Type</Label>
                    <Select
                      value={newProduct.productTypeId ? String(newProduct.productTypeId) : ''}
                      onValueChange={(v) =>
                        setNewProduct({ ...newProduct, productTypeId: Number(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product type" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((t) => (
                          <SelectItem key={t.productTypeId} value={String(t.productTypeId)}>
                            {t.typeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      placeholder="Enter product name"
                      value={newProduct.productName}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, productName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      placeholder="e.g. pcs, kg, L"
                      value={newProduct.unit ?? ''}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, unit: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProduct}>Create Product</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No products found.</div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell className="font-medium text-gray-500">
                          {product.productId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{product.productName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.productTypeName ??
                              productTypes.find(
                                (t) => t.productTypeId === product.productTypeId,
                              )?.typeName ??
                              `Type #${product.productTypeId}`}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {product.unit ?? '—'}
                        </TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleDeleteProduct(product.productId, product.productName)
                            }
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

        {/* ===== PRODUCT TYPES TAB ===== */}
        <TabsContent value="types">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Product Types</h3>
            <Dialog open={isCreateTypeOpen} onOpenChange={setIsCreateTypeOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Type
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Type Name</Label>
                    <Input
                      placeholder="e.g. Bread, Pastry, Beverage"
                      value={newType.typeName}
                      onChange={(e) => setNewType({ ...newType, typeName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Optional description"
                      value={newType.description ?? ''}
                      onChange={(e) =>
                        setNewType({ ...newType, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Storage Condition</Label>
                    <Input
                      placeholder="e.g. Dry, 4-8°C, Room temperature"
                      value={newType.storageCondition ?? ''}
                      onChange={(e) =>
                        setNewType({ ...newType, storageCondition: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateTypeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateType}>Create Type</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {typesLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading product types...
            </div>
          ) : productTypes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No product types found.</div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Storage Condition</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productTypes.map((type) => (
                      <TableRow key={type.productTypeId}>
                        <TableCell className="font-medium text-gray-500">
                          {type.productTypeId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-orange-600" />
                            <span className="font-medium">{type.typeName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {type.description || <span className="text-gray-400">—</span>}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {type.storageCondition || <span className="text-gray-400">—</span>}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700">
                            {
                              products.filter(
                                (p) => p.productTypeId === type.productTypeId,
                              ).length
                            }{' '}
                            products
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleDeleteType(type.productTypeId, type.typeName)
                            }
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
      </Tabs>
    </div>
  );
}
