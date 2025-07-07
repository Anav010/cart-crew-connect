
import { useState, useCallback } from 'react';
import { ChatMessage, User } from '@/types';

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '2',
    user: { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '/api/placeholder/40/40' },
    message: 'Hey everyone! I added milk to the cart 🥛',
    timestamp: new Date(Date.now() - 3600000),
    reactions: [{ emoji: '👍', users: ['1', '3'] }]
  },
  {
    id: '2',
    userId: '3',
    user: { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/api/placeholder/40/40' },
    message: 'Great! Should we also get some cereal?',
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: '3',
    userId: '1',
    user: { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '/api/placeholder/40/40' },
    message: 'Good idea! I\'ll add some healthy options',
    timestamp: new Date(Date.now() - 900000),
    reactions: [{ emoji: '💚', users: ['2'] }]
  }
];

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = useCallback((userId: string, user: User, messageText: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId,
      user,
      message: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  }, []);

  const addReaction = useCallback((messageId: string, emoji: string, userId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;

      const reactions = msg.reactions || [];
      const existingReaction = reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        if (existingReaction.users.includes(userId)) {
          // Remove reaction
          existingReaction.users = existingReaction.users.filter(id => id !== userId);
          if (existingReaction.users.length === 0) {
            return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) };
          }
        } else {
          // Add reaction
          existingReaction.users.push(userId);
        }
      } else {
        // New reaction
        reactions.push({ emoji, users: [userId] });
      }

      return { ...msg, reactions };
    }));
  }, []);

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    addReaction
  };
};
</lov-wrap>

<lov-write file_path="src/hooks/useAISuggestions.ts">
import { useState, useCallback } from 'react';
import { AISuggestion } from '@/types';

const mockSuggestions: AISuggestion[] = [
  {
    id: '1',
    name: 'Greek Yogurt',
    price: 5.99,
    image: '/api/placeholder/100/100',
    reason: 'Perfect protein source to pair with your bananas for breakfast',
    category: 'Dairy'
  },
  {
    id: '2',
    name: 'Peanut Butter',
    price: 4.99,
    image: '/api/placeholder/100/100',
    reason: 'Great spread for your bread and source of healthy fats',
    category: 'Pantry'
  },
  {
    id: '3',
    name: 'Eggs',
    price: 3.49,
    image: '/api/placeholder/100/100',
    reason: 'Essential breakfast protein to complement your current items',
    category: 'Dairy'
  },
  {
    id: '4',
    name: 'Spinach',
    price: 2.99,
    image: '/api/placeholder/100/100',
    reason: 'Nutrient-dense greens for balanced meals',
    category: 'Vegetables'
  }
];

export const useAISuggestions = () => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = useCallback(async (goal: string, currentItems: string[]) => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter suggestions based on current items and goal
    const filteredSuggestions = mockSuggestions.filter(suggestion => 
      !currentItems.some(item => item.toLowerCase().includes(suggestion.name.toLowerCase()))
    );
    
    setSuggestions(filteredSuggestions);
    setIsLoading(false);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isLoading,
    generateSuggestions,
    clearSuggestions
  };
};
