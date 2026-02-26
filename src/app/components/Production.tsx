import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Plus, Calendar, Package, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface ProductionPlan {
  id: string;
  productName: string;
  planDate: string;
  quantity: number;
  status: 'planned' | 'in-progress' | 'completed';
}

interface ProductionBatch {
  id: string;
  productName: string;
  batchId: string;
  quantity: number;
  startDate: string;
  status: 'in-progress' | 'completed' | 'quality-check';
}

const initialPlans: ProductionPlan[] = [
  { id: 'PP-001', productName: 'Fresh Bread', planDate: '2026-01-21', quantity: 500, status: 'planned' },
  { id: 'PP-002', productName: 'Croissant', planDate: '2026-01-21', quantity: 300, status: 'in-progress' },
  { id: 'PP-003', productName: 'Sandwich', planDate: '2026-01-20', quantity: 400, status: 'completed' },
  { id: 'PP-004', productName: 'Basic Pizza', planDate: '2026-01-22', quantity: 200, status: 'planned' },
];

const initialBatches: ProductionBatch[] = [
  { id: '1', productName: 'Croissant', batchId: 'PB-1045', quantity: 150, startDate: '2026-01-20 08:00', status: 'in-progress' },
  { id: '2', productName: 'Fresh Bread', batchId: 'PB-1044', quantity: 500, startDate: '2026-01-20 06:00', status: 'quality-check' },
  { id: '3', productName: 'Sandwich', batchId: 'PB-1043', quantity: 400, startDate: '2026-01-19 14:00', status: 'completed' },
];

export function Production() {
  const [plans, setPlans] = useState<ProductionPlan[]>(initialPlans);
  const [batches, setBatches] = useState<ProductionBatch[]>(initialBatches);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Form state
  const [newPlan, setNewPlan] = useState({
    productName: '',
    planDate: '',
    quantity: '',
  });

  const handleCreatePlan = () => {
    if (!newPlan.productName || !newPlan.planDate || !newPlan.quantity) {
      toast.error('Please fill in all fields');
      return;
    }

    const plan: ProductionPlan = {
      id: `PP-${String(plans.length + 1).padStart(3, '0')}`,
      productName: newPlan.productName,
      planDate: newPlan.planDate,
      quantity: parseInt(newPlan.quantity),
      status: 'planned',
    };

    setPlans([plan, ...plans]);
    setIsDialogOpen(false);
    setNewPlan({ productName: '', planDate: '', quantity: '' });
    toast.success('Production plan created successfully!');
  };

  const handleStartProduction = (planId: string) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, status: 'in-progress' as const } : p
    ));
    
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const newBatch: ProductionBatch = {
        id: String(batches.length + 1),
        productName: plan.productName,
        batchId: `PB-${1046 + batches.length}`,
        quantity: plan.quantity,
        startDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'in-progress',
      };
      setBatches([newBatch, ...batches]);
      toast.success('Production batch started!');
    }
  };

  const handleCompleteBatch = (batchId: string) => {
    setBatches(batches.map(b => 
      b.batchId === batchId ? { ...b, status: 'completed' as const } : b
    ));
    toast.success('Production batch completed!');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'planned': { label: 'Planned', className: 'bg-blue-100 text-blue-700' },
      'in-progress': { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
      'completed': { label: 'Completed', className: 'bg-green-100 text-green-700' },
      'quality-check': { label: 'Quality Check', className: 'bg-purple-100 text-purple-700' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredPlans = filterStatus === 'all' 
    ? plans 
    : plans.filter(p => p.status === filterStatus);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Production Management</h2>
          <p className="text-gray-600 mt-2">Plan and track production operations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Production Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={newPlan.productName} onValueChange={(value) => setNewPlan({...newPlan, productName: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fresh Bread">Fresh Bread</SelectItem>
                    <SelectItem value="Croissant">Croissant</SelectItem>
                    <SelectItem value="Sandwich">Sandwich</SelectItem>
                    <SelectItem value="Basic Pizza">Basic Pizza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Production Date</Label>
                <Input 
                  type="date" 
                  value={newPlan.planDate}
                  onChange={(e) => setNewPlan({...newPlan, planDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity (kg/pcs)</Label>
                <Input 
                  type="number" 
                  placeholder="Enter quantity"
                  value={newPlan.quantity}
                  onChange={(e) => setNewPlan({...newPlan, quantity: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlan}>
                Create Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Production Plans */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Production Plans
            </CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Production Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.id}</TableCell>
                  <TableCell>{plan.productName}</TableCell>
                  <TableCell>{new Date(plan.planDate).toLocaleDateString()}</TableCell>
                  <TableCell>{plan.quantity} kg</TableCell>
                  <TableCell>{getStatusBadge(plan.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {plan.status === 'planned' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStartProduction(plan.id)}
                        >
                          Start Production
                        </Button>
                      )}
                      {plan.status !== 'planned' && (
                        <Button variant="outline" size="sm">
                          View Details
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

      {/* Production Batches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Production Batches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.batchId}</TableCell>
                  <TableCell>{batch.productName}</TableCell>
                  <TableCell>{batch.quantity} kg</TableCell>
                  <TableCell>{batch.startDate}</TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {batch.status === 'in-progress' && (
                        <Button 
                          size="sm"
                          onClick={() => handleCompleteBatch(batch.batchId)}
                        >
                          Complete
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
    </div>
  );
}
