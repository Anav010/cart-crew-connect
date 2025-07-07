
import { useState } from 'react';
import { DollarSign, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BudgetTrackerProps {
  totalSpent: number;
  budget?: number;
  onUpdateBudget: (budget: number) => void;
}

const BudgetTracker = ({ totalSpent, budget, onUpdateBudget }: BudgetTrackerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget?.toString() || '');

  const budgetPercentage = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const isOverBudget = budget && totalSpent > budget;
  const remaining = budget ? budget - totalSpent : 0;

  const handleSaveBudget = () => {
    const newBudget = parseFloat(budgetInput);
    if (newBudget > 0) {
      onUpdateBudget(newBudget);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setBudgetInput(budget?.toString() || '');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-walmart-blue" />
            Budget Tracker
          </div>
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Budget:</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <span>$</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-24 h-8"
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={handleSaveBudget}>
                  <Check className="w-4 h-4 text-green-600" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            ) : (
              <span className="font-semibold">
                {budget ? `$${budget.toFixed(2)}` : 'Not set'}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span>Spent:</span>
            <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-walmart-blue'}`}>
              ${totalSpent.toFixed(2)}
            </span>
          </div>
          
          {budget && (
            <div className="flex items-center justify-between">
              <span>Remaining:</span>
              <span className={`font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${remaining.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {budget && (
          <div className="space-y-2">
            <Progress 
              value={budgetPercentage} 
              className={`h-3 ${isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-walmart-blue'}`}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span className={isOverBudget ? 'text-red-600 font-semibold' : ''}>
                {budgetPercentage.toFixed(1)}%
              </span>
              <span>100%</span>
            </div>
            
            {isOverBudget && (
              <p className="text-sm text-red-600 font-medium text-center">
                ⚠️ Over budget by ${(totalSpent - budget).toFixed(2)}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetTracker;
