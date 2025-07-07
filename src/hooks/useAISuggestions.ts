
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
