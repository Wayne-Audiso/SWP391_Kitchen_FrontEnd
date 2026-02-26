import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Recipe {
  id: string;
  productName: string;
  description: string;
  ingredients: { name: string; quantity: number; unit: string }[];
  shelfLife: string;
}

const initialRecipes: Recipe[] = [
  {
    id: 'RCP-001',
    productName: 'Fresh Bread',
    description: 'Traditional Vietnamese fresh bread',
    ingredients: [
      { name: 'Wheat Flour', quantity: 500, unit: 'g' },
      { name: 'Water', quantity: 300, unit: 'ml' },
      { name: 'Yeast', quantity: 10, unit: 'g' },
      { name: 'Sugar', quantity: 20, unit: 'g' },
      { name: 'Salt', quantity: 8, unit: 'g' },
    ],
    shelfLife: '24 hours at room temp',
  },
  {
    id: 'RCP-002',
    productName: 'Croissant',
    description: 'French-style croissant',
    ingredients: [
      { name: 'Wheat Flour', quantity: 400, unit: 'g' },
      { name: 'Butter', quantity: 250, unit: 'g' },
      { name: 'Fresh Milk', quantity: 150, unit: 'ml' },
      { name: 'Sugar', quantity: 50, unit: 'g' },
      { name: 'Yeast', quantity: 8, unit: 'g' },
      { name: 'Salt', quantity: 10, unit: 'g' },
    ],
    shelfLife: '48 hours at room temp',
  },
  {
    id: 'RCP-003',
    productName: 'Basic Pizza',
    description: 'Traditional Italian pizza dough',
    ingredients: [
      { name: 'Wheat Flour', quantity: 600, unit: 'g' },
      { name: 'Water', quantity: 350, unit: 'ml' },
      { name: 'Yeast', quantity: 12, unit: 'g' },
      { name: 'Olive Oil', quantity: 30, unit: 'ml' },
      { name: 'Sugar', quantity: 10, unit: 'g' },
      { name: 'Salt', quantity: 10, unit: 'g' },
    ],
    shelfLife: '3 days refrigerated',
  },
];

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const [newRecipe, setNewRecipe] = useState({
    productName: '',
    description: '',
    shelfLife: '',
  });

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: 'g',
  });

  const [tempIngredients, setTempIngredients] = useState<{ name: string; quantity: number; unit: string }[]>([]);

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) {
      toast.error('Please fill in ingredient details');
      return;
    }

    setTempIngredients([
      ...tempIngredients,
      {
        name: newIngredient.name,
        quantity: parseFloat(newIngredient.quantity),
        unit: newIngredient.unit,
      },
    ]);

    setNewIngredient({ name: '', quantity: '', unit: 'g' });
  };

  const handleRemoveIngredient = (index: number) => {
    setTempIngredients(tempIngredients.filter((_, i) => i !== index));
  };

  const handleCreateRecipe = () => {
    if (!newRecipe.productName || !newRecipe.description || tempIngredients.length === 0) {
      toast.error('Please fill in all fields and add at least one ingredient');
      return;
    }

    const recipe: Recipe = {
      id: `RCP-${String(recipes.length + 1).padStart(3, '0')}`,
      productName: newRecipe.productName,
      description: newRecipe.description,
      ingredients: tempIngredients,
      shelfLife: newRecipe.shelfLife,
    };

    setRecipes([...recipes, recipe]);
    setIsCreateDialogOpen(false);
    setNewRecipe({ productName: '', description: '', shelfLife: '' });
    setTempIngredients([]);
    toast.success('Recipe created successfully!');
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Recipe Management</h2>
          <p className="text-gray-600 mt-2">Production recipes and ingredient requirements</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Recipe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  placeholder="Enter product name"
                  value={newRecipe.productName}
                  onChange={(e) => setNewRecipe({ ...newRecipe, productName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Enter description"
                  value={newRecipe.description}
                  onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Shelf Life</Label>
                <Input
                  placeholder="e.g., 24 hours at room temp"
                  value={newRecipe.shelfLife}
                  onChange={(e) => setNewRecipe({ ...newRecipe, shelfLife: e.target.value })}
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Ingredients</h4>
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <Input
                    className="col-span-5"
                    placeholder="Ingredient name"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  />
                  <Input
                    className="col-span-3"
                    type="number"
                    placeholder="Qty"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                  />
                  <Select
                    value={newIngredient.unit}
                    onValueChange={(value) => setNewIngredient({ ...newIngredient, unit: value })}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="pcs">pcs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="col-span-2" onClick={handleAddIngredient} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {tempIngredients.length > 0 && (
                  <div className="space-y-2">
                    {tempIngredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{ing.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-600 font-semibold">
                            {ing.quantity} {ing.unit}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveIngredient(idx)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setNewRecipe({ productName: '', description: '', shelfLife: '' });
                  setTempIngredients([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateRecipe}>Create Recipe</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recipe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{recipe.productName}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{recipe.id}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{recipe.description}</p>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Ingredients:</p>
                <div className="space-y-1">
                  {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{ing.name}</span>
                      <span className="text-gray-900 font-medium">{ing.quantity} {ing.unit}</span>
                    </div>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <p className="text-sm text-blue-600">+{recipe.ingredients.length - 3} more ingredients</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Badge className="bg-gray-100 text-gray-700">
                  Shelf life: {recipe.shelfLife}
                </Badge>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setIsDetailDialogOpen(true);
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.productName}</DialogTitle>
          </DialogHeader>
          {selectedRecipe && (
            <div className="space-y-6 py-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{selectedRecipe.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Detailed Ingredients</h4>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{ing.name}</span>
                      <span className="text-blue-600 font-semibold">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Storage Information</h4>
                <p className="text-gray-600">
                  <span className="font-medium">Shelf life:</span> {selectedRecipe.shelfLife}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Create Production Plan</Button>
                <Button variant="outline" className="flex-1">Edit Recipe</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
