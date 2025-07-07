
import { useState } from 'react';
import { DollarSign, Users, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { SharedCart, PaymentSplit } from '@/types';

interface PaymentSplitterProps {
  cart: SharedCart;
  onSplitCalculated: (splits: PaymentSplit[]) => void;
}

const PaymentSplitter = ({ cart, onSplitCalculated }: PaymentSplitterProps) => {
  const [splitType, setSplitType] = useState<'even' | 'custom'>('even');
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});

  const calculateEvenSplit = () => {
    const amountPerPerson = cart.totalSpent / cart.members.length;
    return cart.members.map(member => ({
      userId: member.id,
      amount: amountPerPerson,
      type: 'even' as const
    }));
  };

  const calculateCustomSplit = () => {
    return cart.members.map(member => ({
      userId: member.id,
      amount: parseFloat(customAmounts[member.id] || '0'),
      type: 'custom' as const
    }));
  };

  const handleCalculate = () => {
    const splits = splitType === 'even' ? calculateEvenSplit() : calculateCustomSplit();
    onSplitCalculated(splits);
  };

  const customTotal = Object.values(customAmounts).reduce(
    (sum, amount) => sum + (parseFloat(amount) || 0), 0
  );

  const isCustomSplitValid = Math.abs(customTotal - cart.totalSpent) < 0.01;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-walmart-blue" />
          Payment Splitter
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-walmart-gray p-4 rounded-lg">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-walmart-blue">${cart.totalSpent.toFixed(2)}</span>
          </div>
        </div>

        <RadioGroup value={splitType} onValueChange={(value: 'even' | 'custom') => setSplitType(value)}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="even" id="even" />
              <Label htmlFor="even" className="flex items-center gap-2 cursor-pointer">
                <Users className="w-4 h-4" />
                Even Split
              </Label>
            </div>

            {splitType === 'even' && (
              <div className="ml-6 space-y-2">
                {cart.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                      <span>{member.name}</span>
                    </div>
                    <span className="font-semibold">
                      ${(cart.totalSpent / cart.members.length).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="flex items-center gap-2 cursor-pointer">
                <DollarSign className="w-4 h-4" />
                Custom Split
              </Label>
            </div>

            {splitType === 'custom' && (
              <div className="ml-6 space-y-3">
                {cart.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                    <Label className="min-w-[100px]">{member.name}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={customAmounts[member.id] || ''}
                      onChange={(e) => setCustomAmounts({
                        ...customAmounts,
                        [member.id]: e.target.value
                      })}
                      className="w-24"
                    />
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span>Custom Total:</span>
                  <span className={`font-semibold ${isCustomSplitValid ? 'text-green-600' : 'text-red-500'}`}>
                    ${customTotal.toFixed(2)}
                  </span>
                </div>
                
                {!isCustomSplitValid && (
                  <p className="text-sm text-red-500">
                    Custom amounts must equal the total cart amount
                  </p>
                )}
              </div>
            )}
          </div>
        </RadioGroup>

        <Button 
          onClick={handleCalculate}
          className="w-full bg-walmart-blue hover:bg-walmart-light-blue"
          disabled={splitType === 'custom' && !isCustomSplitValid}
        >
          Calculate Split
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentSplitter;
