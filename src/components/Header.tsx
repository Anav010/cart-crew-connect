
import { Share2, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SharedCart } from '@/types';

interface HeaderProps {
  cart: SharedCart;
  onShare: () => void;
}

const Header = ({ cart, onShare }: HeaderProps) => {
  const budgetPercentage = cart.budget ? (cart.totalSpent / cart.budget) * 100 : 0;
  const isOverBudget = budgetPercentage > 100;

  return (
    <header className="walmart-gradient text-white p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold font-heading">{cart.name}</h1>
            {cart.description && (
              <p className="text-blue-100 mt-1">{cart.description}</p>
            )}
          </div>
          <Button 
            onClick={onShare}
            className="bg-walmart-yellow text-walmart-blue hover:bg-yellow-300 font-semibold"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Cart
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-lg font-semibold">{cart.members.length} Members</span>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-lg font-semibold">
                ${cart.totalSpent.toFixed(2)}
              </span>
              {cart.budget && (
                <span className="text-blue-100">
                  / ${cart.budget.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {cart.budget && (
            <Badge 
              variant={isOverBudget ? "destructive" : "secondary"}
              className={isOverBudget ? "" : "bg-green-500 hover:bg-green-600"}
            >
              {budgetPercentage.toFixed(1)}% of budget used
            </Badge>
          )}
        </div>

        <div className="flex -space-x-2 mt-4">
          {cart.members.map((member) => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:z-10 hover:scale-110 transition-transform"
              title={member.name}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
