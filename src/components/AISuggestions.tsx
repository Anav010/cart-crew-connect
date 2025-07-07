
import { useState } from 'react';
import { Sparkles, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { CartItem } from '@/types';

interface AISuggestionsProps {
  currentItems: CartItem[];
  onAddItem: (item: Omit<CartItem, 'id' | 'addedBy'>) => void;
}

const AISuggestions = ({ currentItems, onAddItem }: AISuggestionsProps) => {
  const [goal, setGoal] = useState('');
  const { suggestions, isLoading, generateSuggestions, clearSuggestions } = useAISuggestions();

  const handleGenerateSuggestions = () => {
    if (!goal.trim()) return;
    
    const itemNames = currentItems.map(item => item.name);
    generateSuggestions(goal, itemNames);
  };

  const handleAddSuggestion = (suggestion: any) => {
    onAddItem({
      name: suggestion.name,
      price: suggestion.price,
      quantity: 1,
      category: suggestion.category,
      image: suggestion.image,
      description: `AI Suggested: ${suggestion.reason}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-walmart-yellow" />
          AI Shopping Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="goal">What are you shopping for?</Label>
          <Input
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., healthy breakfast options, family dinner, weekly groceries..."
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateSuggestions}
            disabled={!goal.trim() || isLoading}
            className="flex-1 bg-walmart-yellow text-walmart-blue hover:bg-yellow-300"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Get AI Suggestions
          </Button>
          
          {suggestions.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearSuggestions}
            >
              Clear
            </Button>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-walmart-blue">Suggested Items:</h4>
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img 
                  src={suggestion.image} 
                  alt={suggestion.name}
                  className="w-12 h-12 object-cover rounded"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h5 className="font-semibold truncate">{suggestion.name}</h5>
                    <span className="font-bold text-walmart-blue ml-2">
                      ${suggestion.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <Badge variant="outline" className="mb-2">
                    {suggestion.category}
                  </Badge>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {suggestion.reason}
                  </p>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handleAddSuggestion(suggestion)}
                    className="bg-walmart-blue hover:bg-walmart-light-blue"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
