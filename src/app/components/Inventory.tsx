import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Package, AlertTriangle, Search, TrendingDown, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minStock: number;
  location: string;
  storageCondition: string;
}

interface Product {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  status: 'available' | 'low-stock' | 'out-of-stock';
}

const initialIngredients: Ingredient[] = [
  { id: 'ING-001', name: 'Wheat Flour', unit: 'kg', quantity: 15, minStock: 50, location: 'Storage A-01', storageCondition: 'Dry, room temp' },
  { id: 'ING-002', name: 'Sugar', unit: 'kg', quantity: 85, minStock: 30, location: 'Storage A-02', storageCondition: 'Dry' },
  { id: 'ING-003', name: 'Butter', unit: 'kg', quantity: 12, minStock: 20, location: 'Cold Storage B-01', storageCondition: '4-8°C' },
  { id: 'ING-004', name: 'Eggs', unit: 'pcs', quantity: 350, minStock: 200, location: 'Cold Storage B-02', storageCondition: '4-8°C' },
  { id: 'ING-005', name: 'Fresh Milk', unit: 'L', quantity: 28, minStock: 40, location: 'Cold Storage B-03', storageCondition: '2-4°C' },
];

const initialProducts: Product[] = [
  { id: 'PRD-001', name: 'Fresh Bread', type: 'Bread', quantity: 245, unit: 'pcs', status: 'available' },
  { id: 'PRD-002', name: 'Croissant', type: 'Pastry', quantity: 18, unit: 'pcs', status: 'low-stock' },
  { id: 'PRD-003', name: 'Plain Pizza', type: 'Pizza', quantity: 0, unit: 'pcs', status: 'out-of-stock' },
  { id: 'PRD-004', name: 'Sandwich', type: 'Bread', quantity: 156, unit: 'pcs', status: 'available' },
];

export function Inventory() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState('');
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);

  const handleStockIn = () => {
    if (!selectedIngredient || !adjustmentQty || parseInt(adjustmentQty) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIngredients(ingredients.map(ing => 
      ing.id === selectedIngredient.id 
        ? { ...ing, quantity: ing.quantity + parseInt(adjustmentQty) }
        : ing
    ));

    toast.success(`Added ${adjustmentQty} ${selectedIngredient.unit} of ${selectedIngredient.name}`);
    setIsAdjustDialogOpen(false);
    setAdjustmentQty('');
    setSelectedIngredient(null);
  };

  const handleStockOut = () => {
    if (!selectedIngredient || !adjustmentQty || parseInt(adjustmentQty) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (selectedIngredient.quantity < parseInt(adjustmentQty)) {
      toast.error('Insufficient stock');
      return;
    }

    setIngredients(ingredients.map(ing => 
      ing.id === selectedIngredient.id 
        ? { ...ing, quantity: ing.quantity - parseInt(adjustmentQty) }
        : ing
    ));

    toast.success(`Removed ${adjustmentQty} ${selectedIngredient.unit} of ${selectedIngredient.name}`);
    setIsAdjustDialogOpen(false);
    setAdjustmentQty('');
    setSelectedIngredient(null);
  };

  const getLowStockIngredients = () => {
    return ingredients.filter(ing => ing.quantity < ing.minStock);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'available': { label: 'Available', className: 'bg-green-100 text-green-700' },
      'low-stock': { label: 'Low Stock', className: 'bg-yellow-100 text-yellow-700' },
      'out-of-stock': { label: 'Out of Stock', className: 'bg-red-100 text-red-700' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ing.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(prod => 
    prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
        <p className="text-gray-600 mt-2">Track ingredients and products in stock</p>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock Ingredients</CardTitle>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getLowStockIngredients().length}</div>
            <p className="text-xs text-gray-600 mt-1">Requires immediate restocking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Ingredients</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingredients.length}</div>
            <p className="text-xs text-gray-600 mt-1">Different ingredient types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <TrendingDown className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.reduce((sum, p) => sum + p.quantity, 0)}</div>
            <p className="text-xs text-gray-600 mt-1">Product units in stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search ingredients or products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Adjustment Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedIngredient?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold">{selectedIngredient?.quantity} {selectedIngredient?.unit}</p>
            </div>
            <div className="space-y-2">
              <Label>Quantity to Adjust</Label>
              <Input 
                type="number" 
                placeholder="Enter quantity"
                value={adjustmentQty}
                onChange={(e) => setAdjustmentQty(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setIsAdjustDialogOpen(false);
              setAdjustmentQty('');
              setSelectedIngredient(null);
            }}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleStockOut} className="gap-2">
              <Minus className="w-4 h-4" />
              Stock Out
            </Button>
            <Button onClick={handleStockIn} className="gap-2">
              <Plus className="w-4 h-4" />
              Stock In
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabs */}
      <Tabs defaultValue="ingredients" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients">
          <Card>
            <CardHeader>
              <CardTitle>Ingredient List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ingredient Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Storage Condition</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIngredients.map((ingredient) => (
                    <TableRow key={ingredient.id} className={ingredient.quantity < ingredient.minStock ? 'bg-red-50' : ''}>
                      <TableCell className="font-medium">{ingredient.id}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {ingredient.name}
                        {ingredient.quantity < ingredient.minStock && (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={ingredient.quantity < ingredient.minStock ? 'text-red-600 font-semibold' : ''}>
                          {ingredient.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{ingredient.unit}</TableCell>
                      <TableCell>{ingredient.minStock}</TableCell>
                      <TableCell>{ingredient.location}</TableCell>
                      <TableCell>{ingredient.storageCondition}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedIngredient(ingredient);
                            setIsAdjustDialogOpen(true);
                          }}
                        >
                          Adjust Stock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.type}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Urgent Restocking Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ingredient Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Shortage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLowStockIngredients().map((ingredient) => (
                    <TableRow key={ingredient.id} className="bg-red-50">
                      <TableCell className="font-medium">{ingredient.id}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        {ingredient.name}
                      </TableCell>
                      <TableCell className="text-red-600 font-semibold">
                        {ingredient.quantity} {ingredient.unit}
                      </TableCell>
                      <TableCell>{ingredient.minStock} {ingredient.unit}</TableCell>
                      <TableCell className="text-red-600 font-semibold">
                        {ingredient.minStock - ingredient.quantity} {ingredient.unit}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => {
                            setSelectedIngredient(ingredient);
                            setAdjustmentQty(String(ingredient.minStock - ingredient.quantity));
                            setIsAdjustDialogOpen(true);
                          }}
                        >
                          Restock Now
                        </Button>
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
