
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const totalPrice = item.price * item.quantity;

  return (
    <Card className="hover:shadow-md transition-shadow animate-fade-in">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {item.category}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {item.description && (
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="font-semibold min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="text-right">
                <div className="font-bold text-lg text-walmart-blue">
                  ${totalPrice.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} each
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-muted-foreground">Added by:</span>
              <div className="flex -space-x-1">
                {item.addedBy.map((user) => (
                  <img
                    key={user.id}
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:z-10 hover:scale-110 transition-transform"
                    title={user.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
