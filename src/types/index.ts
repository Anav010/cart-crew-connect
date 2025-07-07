
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  addedBy: User[];
  description?: string;
}

export interface SharedCart {
  id: string;
  name: string;
  description?: string;
  createdBy: User;
  members: User[];
  items: CartItem[];
  budget?: number;
  totalSpent: number;
  createdAt: Date;
  shareUrl: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  user: User;
  message: string;
  timestamp: Date;
  reactions?: { emoji: string; users: string[] }[];
  attachments?: { name: string; url: string }[];
}

export interface PaymentSplit {
  userId: string;
  amount: number;
  type: 'even' | 'custom';
}

export type SortOption = 'name' | 'price' | 'dateAdded' | 'category';
export type FilterOption = {
  category?: string;
  priceRange?: { min: number; max: number };
  addedBy?: string;
};

export interface AISuggestion {
  id: string;
  name: string;
  price: number;
  image: string;
  reason: string;
  category: string;
}
