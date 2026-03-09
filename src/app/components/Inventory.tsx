import { useState, useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import {
  Package,
  AlertTriangle,
  Search,
  TrendingDown,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  ingredientsApi,
  type IngredientDto,
  type CreateIngredientModel,
} from "@/app/services/inventoryService";

//khởi tạo state và model cho Inventory
const emptyForm: CreateIngredientModel = {
  ingredientName: "",
  unit: "",
  storageCondition: "",
  minStock: undefined,
  price: undefined,
};

export function Inventory() {
  const [ingredients, setIngredients] = useState<IngredientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateIngredientModel>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<IngredientDto | null>(null);
  const [deleting, setDeleting] = useState(false);

//xu ly logic load du lieu (them xoa sua)
useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await ingredientsApi.getAll();
      setIngredients(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (ing: IngredientDto) => {
    setEditingId(ing.ingredientId);
    setForm({
      ingredientName: ing.ingredientName,
      unit: ing.unit ?? "",
      storageCondition: ing.storageCondition ?? "",
      minStock: ing.minStock,
      price: ing.price,
    });
    setIsFormOpen(true);
  };

  //submit du lieu
const handleSubmit = async () => {
    if (!form.ingredientName.trim()) {
      toast.error("Ingredient name is required");
      return;
    }
    try {
      setSubmitting(true);
      if (editingId === null) {
        const { data, message } = await ingredientsApi.create(form);
        setIngredients((prev) => [...prev, data]);
        toast.success(message);
      } else {
        const { data, message } = await ingredientsApi.update(editingId, form);
        setIngredients((prev) =>
          prev.map((i) => (i.ingredientId === editingId ? data : i)),
        );
        toast.success(message);
      }
      setIsFormOpen(false);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

// xoa du lieu
const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const message = await ingredientsApi.delete(deleteTarget.ingredientId);
      setIngredients((prev) =>
        prev.filter((i) => i.ingredientId !== deleteTarget.ingredientId),
      );
      toast.success(message);
      setDeleteTarget(null);
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  const withMinStock = ingredients.filter(
    (i) => i.minStock != null && i.minStock > 0,
  );

  const filtered = ingredients.filter(
    (i) =>
      i.ingredientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(i.ingredientId).includes(searchTerm),
  );

  const filteredWithMinStock = withMinStock.filter(
    (i) =>
      i.ingredientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(i.ingredientId).includes(searchTerm),
  );
//tieu de trang
return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Inventory Management
          </h2>
          <p className="text-gray-600 mt-2">
            Manage ingredients catalog and stock information
          </p>
        </div>
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Ingredient
        </Button>
      </div>
      {/*  
        Các thẻ hiển thị chỉ số tổng quan (Tổng số, mức tồn kho tối thiểu, giá)
    */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Ingredients
            </CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {ingredients.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Ingredient types defined
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              With Min Stock Set
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {withMinStock.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Have minimum stock threshold
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              With Price Set
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ingredients.filter((i) => i.price != null).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Ingredients with unit price
            </p>
          </CardContent>
        </Card>
      </div>
{/* --- SECTION: Search Bar --- 
        Mô tả: Ô tìm kiếm nguyên liệu theo tên hoặc ID
    */}
  <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
{/* --- SECTION: Content Tabs & Data Tables --- 
        Mô tả: Chuyển đổi giữa danh sách tất cả nguyên liệu và cấu hình tồn kho tối thiểu
    */}
   <Tabs defaultValue="ingredients" className="space-y-6">
      <TabsList>
        <TabsTrigger value="ingredients">All Ingredients</TabsTrigger>
        <TabsTrigger value="min-stock">Min Stock Config</TabsTrigger>
      </TabsList>

      {/* Tab: All Ingredients */}
      <TabsContent value="ingredients">
        <Card>
          <CardHeader>
            <CardTitle>Ingredient List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ingredient Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Storage Condition</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                        No ingredients found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((ing) => (
                      <TableRow key={ing.ingredientId}>
                        <TableCell className="font-medium text-gray-500">#{ing.ingredientId}</TableCell>
                        <TableCell className="font-medium">{ing.ingredientName}</TableCell>
                        <TableCell>{ing.unit ?? <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell>
                          {ing.minStock != null ? (
                            <Badge className="bg-yellow-100 text-yellow-700">{ing.minStock}</Badge>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {ing.price != null ? (
                            <span className="text-green-700 font-medium">
                              {ing.price.toLocaleString("vi-VN")} ₫
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>{ing.storageCondition ?? <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit(ing)}>
                              <Pencil className="w-3 h-3 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => setDeleteTarget(ing)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab: Min Stock Config */}
      <TabsContent value="min-stock">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Ingredients with Minimum Stock Threshold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ingredient Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithMinStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                      No ingredients with min stock configured
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWithMinStock.map((ing) => (
                    <TableRow key={ing.ingredientId} className="bg-yellow-50">
                      <TableCell className="font-medium text-gray-500">#{ing.ingredientId}</TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        {ing.ingredientName}
                      </TableCell>
                      <TableCell>{ing.unit ?? "—"}</TableCell>
                      <TableCell className="font-semibold text-yellow-700">{ing.minStock}</TableCell>
                      <TableCell>
                        {ing.price != null ? `${ing.price.toLocaleString("vi-VN")} ₫` : "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openEdit(ing)}>
                          <Pencil className="w-3 h-3 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
 {/* --- SECTION: Create/Edit Modal --- 
        Mô tả: Form Dialog để thêm mới hoặc cập nhật thông tin nguyên liệu
    */}
    <Dialog
      open={isFormOpen}
      onOpenChange={(open) => {
        if (!submitting) setIsFormOpen(open);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingId === null ? "Add New Ingredient" : "Edit Ingredient"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Ingredient Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g. Wheat Flour"
              value={form.ingredientName}
              onChange={(e) => setForm((f) => ({ ...f, ingredientName: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Unit</Label>
              <Input
                placeholder="kg / L / pcs"
                value={form.unit ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Min Stock</Label>
              <Input
                type="number"
                placeholder="0"
                value={form.minStock ?? ""}
                onChange={(e) => setForm((f) => ({
                  ...f,
                  minStock: e.target.value ? Number(e.target.value) : undefined,
                }))}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Unit Price (VND)</Label>
            <Input
              type="number"
              placeholder="0"
              value={form.price ?? ""}
              onChange={(e) => setForm((f) => ({
                ...f,
                price: e.target.value ? Number(e.target.value) : undefined,
              }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Storage Condition</Label>
            <Input
              placeholder="e.g. Dry, room temp / 4-8°C"
              value={form.storageCondition ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, storageCondition: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editingId === null ? "Create" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

 {/* --- SECTION: Delete Confirmation Dialog --- 
        Mô tả: Cảnh báo xác nhận trước khi xóa nguyên liệu
    */}
    <AlertDialog
      open={!!deleteTarget}
      onOpenChange={(open) => {
        if (!open && !deleting) setDeleteTarget(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{deleteTarget?.ingredientName}</strong>? 
            This action cannot be undone and will also remove it from all recipes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);