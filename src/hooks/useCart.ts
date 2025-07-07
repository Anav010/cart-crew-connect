
import { useState, useCallback } from 'react';
import { SharedCart, CartItem, User, PaymentSplit } from '@/types';

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '/api/placeholder/40/40' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '/api/placeholder/40/40' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/api/placeholder/40/40' },
];

const mockCart: SharedCart = {
  id: '1',
  name: 'Family Grocery List',
  description: 'Weekly shopping for the Johnson family',
  createdBy: mockUsers[0],
  members: mockUsers,
  items: [
    {
      id: '1',
      name: 'Organic Bananas',
      price: 3.99,
      quantity: 2,
      image: '/api/placeholder/100/100',
      category: 'Fruits',
      addedBy: [mockUsers[0]],
      description: 'Fresh organic bananas, perfect for breakfast'
    },
    {
      id: '2',
      name: 'Whole Milk',
      price: 4.29,
      quantity: 1,
      image: '/api/placeholder/100/100',
      category: 'Dairy',
      addedBy: [mockUsers[1], mockUsers[2]],
      description: '1 gallon of fresh whole milk'
    },
    {
      id: '3',
      name: 'Bread',
      price: 2.99,
      quantity: 1,
      image: '/api/placeholder/100/100',
      category: 'Bakery',
      addedBy: [mockUsers[0]],
      description: 'Whole grain bread loaf'
    }
  ],
  budget: 150,
  totalSpent: 11.27,
  createdAt: new Date(),
  shareUrl: 'https://sharedcart.app/cart/abc123'
};

export const useCart = () => {
  const [cart, setCart] = useState<SharedCart>(mockCart);
  const [currentUser] = useState<User>(mockUsers[0]);

  const addItem = useCallback((item: Omit<CartItem, 'id' | 'addedBy'>) => {
    const newItem: CartItem = {
      ...item,
      id: Date.now().toString(),
      addedBy: [currentUser]
    };
    
    setCart(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      totalSpent: prev.totalSpent + (item.price * item.quantity)
    }));
  }, [currentUser]);

  const removeItem = useCallback((itemId: string) => {
    setCart(prev => {
      const itemToRemove = prev.items.find(item => item.id === itemId);
      if (!itemToRemove) return prev;

      return {
        ...prev,
        items: prev.items.filter(item => item.id !== itemId),
        totalSpent: prev.totalSpent - (itemToRemove.price * itemToRemove.quantity)
      };
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart(prev => {
      const oldItem = prev.items.find(item => item.id === itemId);
      if (!oldItem) return prev;

      const priceDiff = (quantity - oldItem.quantity) * oldItem.price;
      
      return {
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        ),
        totalSpent: prev.totalSpent + priceDiff
      };
    });
  }, [removeItem]);

  const calculateSplits = useCallback((type: 'even' | 'custom', customSplits?: PaymentSplit[]) => {
    if (type === 'even') {
      const amountPerPerson = cart.totalSpent / cart.members.length;
      return cart.members.map(member => ({
        userId: member.id,
        amount: amountPerPerson,
        type: 'even' as const
      }));
    }
    return customSplits || [];
  }, [cart.totalSpent, cart.members]);

  const updateBudget = useCallback((budget: number) => {
    setCart(prev => ({ ...prev, budget }));
  }, []);

  return {
    cart,
    currentUser,
    addItem,
    removeItem,
    updateQuantity,
    calculateSplits,
    updateBudget
  };
};
