
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/types';

interface AddItemFormProps {
  onAddItem: (item: Omit<CartItem, 'id' | 'addedBy'>) => void;
}

const categories = [
  'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Frozen', 'Beverages', 'Snacks', 'Other'
];

const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '1',
    category: '',
    description: '',
    image: '/api/placeholder/100/100'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      return;
    }

    onAddItem({
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category: formData.category,
      description: formData.description,
      image: formData.image
    });

    setFormData({
      name: '',
      price: '',
      quantity: '1',
      category: '',
      description: '',
      image: '/api/placeholder/100/100'
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-walmart-blue" />
          Add New Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Organic Apples"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any additional details..."
              rows={2}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-walmart-blue hover:bg-walmart-light-blue text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddItemForm;
