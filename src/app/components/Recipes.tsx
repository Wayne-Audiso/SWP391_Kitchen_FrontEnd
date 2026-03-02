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
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  BookOpen,
  Plus,
  Trash2,
  Pencil,
  Loader2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  recipesApi,
  type RecipeDto,
  type CreateRecipeIngredientModel,
} from "@/app/services/recipesService";
import {
  ingredientsApi,
  type IngredientDto,
} from "@/app/services/inventoryService";

//tao mau cong thuc 
interface LineItem extends CreateRecipeIngredientModel {
  ingredientName: string;
  unit?: string;
  price?: number;
}

const emptyForm = { recipeName: "", description: "" };

export function Recipes() {
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [allIngredients, setAllIngredients] = useState<IngredientDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [lines, setLines] = useState<LineItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [selectedIngId, setSelectedIngId] = useState<string>("");
  const [lineQty, setLineQty] = useState<string>("");

  const [detailRecipe, setDetailRecipe] = useState<RecipeDto | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<RecipeDto | null>(null);
  const [deleting, setDeleting] = useState(false);

//tai cong thuc va nguyen lieu
useEffect(() => {
    Promise.all([loadRecipes(), loadIngredients()]);
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipesApi.getAll();
      setRecipes(data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const data = await ingredientsApi.getAll();
      setAllIngredients(data);
    } catch {}
  };

  const computedCost = lines.reduce(
    (sum, l) => sum + (l.quantity ?? 0) * (l.price ?? 0),
    0,
  );

//mo cac chuc nang 
 const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setLines([]);
    setSelectedIngId("");
    setLineQty("");
    setIsFormOpen(true);
  };

  const openEdit = (recipe: RecipeDto) => {
    setEditingId(recipe.recipeId);
    setForm({
      recipeName: recipe.recipeName,
      description: recipe.description ?? "",
    });
    setLines(
      recipe.ingredients.map((ri) => ({
        ingredientId: ri.ingredientId,
        quantity: ri.quantity,
        ingredientName: ri.ingredientName,
        unit: ri.unit,
        price: ri.price,
      })),
    );
    setSelectedIngId("");
    setLineQty("");
    setIsFormOpen(true);
  };

//them so luong
const handleAddLine = () => {
    if (!selectedIngId) {
      toast.error("Please select an ingredient");
      return;
    }
    const qty = parseFloat(lineQty);
    if (!lineQty || isNaN(qty) || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (lines.some((l) => l.ingredientId === Number(selectedIngId))) {
      toast.error("Ingredient already added");
      return;
    }
    const ing = allIngredients.find(
      (i) => i.ingredientId === Number(selectedIngId),
    )!;
    setLines((prev) => [
      ...prev,
      {
        ingredientId: ing.ingredientId,
        quantity: qty,
        ingredientName: ing.ingredientName,
        unit: ing.unit,
        price: ing.price,
      },
    ]);

  //xoa,them dong
setSelectedIngId("");
    setLineQty("");
  };

  const handleRemoveLine = (id: number) => {
    setLines((prev) => prev.filter((l) => l.ingredientId !== id));
  };

  const handleUpdateLineQty = (id: number, val: string) => {
    setLines((prev) =>
      prev.map((l) =>
        l.ingredientId === id
          ? { ...l, quantity: val ? parseFloat(val) : undefined }
          : l,
      ),
    );
  };

  //submit san pham
    const handleSubmit = async () => {
    if (!form.recipeName.trim()) {
      toast.error("Recipe name is required");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        recipeName: form.recipeName,
        description: form.description || undefined,
        ingredients: lines.map((l) => ({
          ingredientId: l.ingredientId,
          quantity: l.quantity,
        })),
      };

      if (editingId === null) {
        const { data, message } = await recipesApi.create(payload);
        setRecipes((prev) => [data, ...prev]);
        toast.success(message);
      } else {
        const { data, message } = await recipesApi.update(editingId, payload);
        setRecipes((prev) =>
          prev.map((r) => (r.recipeId === editingId ? data : r)),
        );
        toast.success(message);
      }
      setIsFormOpen(false);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  //xoa san pham
const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const message = await recipesApi.delete(deleteTarget.recipeId);
      setRecipes((prev) =>
        prev.filter((r) => r.recipeId !== deleteTarget.recipeId),
      );
      toast.success(message);
      setDeleteTarget(null);
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  const availableIngredients = allIngredients.filter(
    (ing) => !lines.some((l) => l.ingredientId === ing.ingredientId),
  );

  //check return
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Recipe Management
          </h2>
          <p className="text-gray-600 mt-2">
            Production recipes and ingredient BOM
          </p>
        </div>
        <Button className="gap-2" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Recipe
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading recipes...</span>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>
            No recipes yet. Click <strong>Add Recipe</strong> to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card
              key={recipe.recipeId}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {recipe.recipeName}
                      </CardTitle>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ID #{recipe.recipeId}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(recipe)}
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(recipe)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recipe.description && (
                  <p className="text-sm text-gray-600">{recipe.description}</p>
                )}

                {recipe.ingredients.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Ingredients ({recipe.ingredients.length})
                    </p>
                    <div className="space-y-1">
                      {recipe.ingredients.slice(0, 3).map((ri) => (
                        <div
                          key={ri.recipeIngredientId}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {ri.ingredientName}
                          </span>
                          <span className="text-gray-800 font-medium">
                            {ri.quantity} {ri.unit ?? ""}
                          </span>
                        </div>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <p className="text-xs text-blue-500">
                          +{recipe.ingredients.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Cost: {recipe.totalCost.toLocaleString("vi-VN")} ₫
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDetailRecipe(recipe)}
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!submitting) setIsFormOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId === null ? "Create New Recipe" : "Edit Recipe"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>
                Recipe Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Fresh Bread"
                value={form.recipeName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, recipeName: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input
                placeholder="Short description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Ingredients / BOM</h4>

              <div className="flex gap-2 mb-3">
                <Select value={selectedIngId} onValueChange={setSelectedIngId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select ingredient..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIngredients.length === 0 ? (
                      <SelectItem value="__none" disabled>
                        All ingredients added
                      </SelectItem>
                    ) : (
                      availableIngredients.map((ing) => (
                        <SelectItem
                          key={ing.ingredientId}
                          value={String(ing.ingredientId)}
                        >
                          {ing.ingredientName}
                          {ing.unit ? ` (${ing.unit})` : ""}
                          {ing.price
                            ? ` — ${ing.price.toLocaleString("vi-VN")} ₫`
                            : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Qty"
                  className="w-28"
                  value={lineQty}
                  onChange={(e) => setLineQty(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddLine();
                  }}
                />
                <Button type="button" onClick={handleAddLine} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {lines.length > 0 ? (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {lines.map((line) => (
                    <div
                      key={line.ingredientId}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="flex-1 text-sm font-medium">
                        {line.ingredientName}
                        {line.unit && (
                          <span className="text-gray-400 font-normal ml-1">
                            ({line.unit})
                          </span>
                        )}
                      </span>
                      <Input
                        type="number"
                        className="w-24 h-7 text-sm"
                        value={line.quantity ?? ""}
                        onChange={(e) =>
                          handleUpdateLineQty(line.ingredientId, e.target.value)
                        }
                      />
                      {line.price != null && (
                        <span className="text-xs text-green-600 w-24 text-right">
                          ={" "}
                          {((line.quantity ?? 0) * line.price).toLocaleString(
                            "vi-VN",
                          )}{" "}
                          ₫
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleRemoveLine(line.ingredientId)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  No ingredients added yet
                </p>
              )}

              {lines.length > 0 && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Estimated Cost
                  </span>
                  <span className="text-lg font-bold text-green-700">
                    {computedCost.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId === null ? "Create Recipe" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!detailRecipe}
        onOpenChange={(open) => {
          if (!open) setDetailRecipe(null);
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{detailRecipe?.recipeName}</DialogTitle>
          </DialogHeader>
          {detailRecipe && (
            <div className="space-y-5 py-2">
              {detailRecipe.description && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Description
                  </p>
                  <p className="text-gray-700">{detailRecipe.description}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  BOM — {detailRecipe.ingredients.length} ingredients
                </p>
                {detailRecipe.ingredients.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No ingredients defined
                  </p>
                ) : (
                  <div className="space-y-2">
                    {detailRecipe.ingredients.map((ri) => (
                      <div
                        key={ri.recipeIngredientId}
                        className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg text-sm"
                      >
                        <div>
                          <span className="font-medium">
                            {ri.ingredientName}
                          </span>
                          {ri.unit && (
                            <span className="text-gray-400 ml-1">
                              ({ri.unit})
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">
                            {ri.quantity} {ri.unit ?? ""}
                          </div>
                          {ri.totalCost != null && ri.totalCost > 0 && (
                            <div className="text-xs text-green-600">
                              {ri.totalCost.toLocaleString("vi-VN")} ₫
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-green-50 rounded-lg flex items-center justify-between">
                <span className="font-semibold text-green-800">
                  Total Est. Cost
                </span>
                <span className="text-xl font-bold text-green-700">
                  {detailRecipe.totalCost.toLocaleString("vi-VN")} ₫
                </span>
              </div>

              <p className="text-xs text-gray-400">
                Created:{" "}
                {detailRecipe.createdDate
                  ? new Date(detailRecipe.createdDate).toLocaleDateString(
                      "vi-VN",
                    )
                  : "—"}
              </p>

              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => {
                    setDetailRecipe(null);
                    openEdit(detailRecipe);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Recipe
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setDetailRecipe(null);
                    setDeleteTarget(detailRecipe);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.recipeName}</strong>? All ingredient lines
              in this recipe will also be removed.
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
}
