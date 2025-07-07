
import { useState, useMemo } from 'react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import Header from '@/components/Header';
import CartItem from '@/components/CartItem';
import AddItemForm from '@/components/AddItemForm';
import ChatPanel from '@/components/ChatPanel';
import PaymentSplitter from '@/components/PaymentSplitter';
import AISuggestions from '@/components/AISuggestions';
import BudgetTracker from '@/components/BudgetTracker';
import CartFilters from '@/components/CartFilters';
import ShareDialog from '@/components/ShareDialog';
import { SortOption, FilterOption, PaymentSplit } from '@/types';

const Index = () => {
  const { cart, currentUser, addItem, removeItem, updateQuantity, updateBudget } = useCart();
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filters, setFilters] = useState<FilterOption>({});
  
  // UI state
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'chat' | 'split' | 'ai' | 'budget'>('cart');

  // Get unique categories and members for filters
  const categories = useMemo(() => 
    [...new Set(cart.items.map(item => item.category))], [cart.items]
  );
  
  const members = useMemo(() => 
    cart.members.map(member => ({ id: member.id, name: member.name })), [cart.members]
  );

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items = cart.items;

    // Apply search filter
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      items = items.filter(item => item.category === filters.category);
    }

    // Apply member filter
    if (filters.addedBy) {
      items = items.filter(item => 
        item.addedBy.some(user => user.id === filters.addedBy)
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      items = items.filter(item => 
        item.price >= filters.priceRange!.min && 
        item.price <= filters.priceRange!.max
      );
    }

    // Sort items
    items.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'dateAdded':
          return new Date(b.id).getTime() - new Date(a.id).getTime(); // Using ID as timestamp
        default:
          return 0;
      }
    });

    return items;
  }, [cart.items, searchTerm, filters, sortBy]);

  const handleAddItem = (item: any) => {
    addItem(item);
    toast.success(`Added ${item.name} to cart!`);
  };

  const handleRemoveItem = (itemId: string) => {
    const item = cart.items.find(i => i.id === itemId);
    removeItem(itemId);
    toast.success(`Removed ${item?.name} from cart`);
  };

  const handleSplitCalculated = (splits: PaymentSplit[]) => {
    console.log('Payment splits calculated:', splits);
    toast.success('Payment split calculated successfully!');
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} onShare={handleShare} />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {[
            { key: 'cart', label: 'Shopping Cart', count: cart.items.length },
            { key: 'chat', label: 'Group Chat', count: null },
            { key: 'split', label: 'Payment Split', count: null },
            { key: 'ai', label: 'AI Assistant', count: null },
            { key: 'budget', label: 'Budget Tracker', count: null },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-walmart-blue text-white border-b-2 border-walmart-blue'
                  : 'text-walmart-blue hover:bg-blue-50'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 px-2 py-1 text-xs bg-walmart-yellow text-walmart-blue rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'cart' && (
              <div className="space-y-6">
                <AddItemForm onAddItem={handleAddItem} />
                
                <CartFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  filters={filters}
                  onFiltersChange={setFilters}
                  categories={categories}
                  members={members}
                />

                <div className="space-y-4">
                  {filteredAndSortedItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-lg mb-2">
                        {cart.items.length === 0 ? 'Your cart is empty' : 'No items match your filters'}
                      </div>
                      <p className="text-gray-400">
                        {cart.items.length === 0 
                          ? 'Add some items to get started!' 
                          : 'Try adjusting your search or filters'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredAndSortedItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="h-[600px]">
                <ChatPanel currentUser={currentUser} />
              </div>
            )}

            {activeTab === 'split' && (
              <PaymentSplitter 
                cart={cart} 
                onSplitCalculated={handleSplitCalculated} 
              />
            )}

            {activeTab === 'ai' && (
              <AISuggestions 
                currentItems={cart.items}
                onAddItem={handleAddItem}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetTracker
                totalSpent={cart.totalSpent}
                budget={cart.budget}
                onUpdateBudget={updateBudget}
              />
            )}
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-heading font-semibold text-lg mb-4 text-walmart-blue">Cart Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-semibold">{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unique Items:</span>
                  <span className="font-semibold">{cart.items.length}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-walmart-blue">
                  <span>Total Cost:</span>
                  <span>${cart.totalSpent.toFixed(2)}</span>
                </div>
                {cart.budget && (
                  <div className="flex justify-between text-sm">
                    <span>Budget:</span>
                    <span className={cart.totalSpent > cart.budget ? 'text-red-600' : 'text-green-600'}>
                      ${cart.budget.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-heading font-semibold text-lg mb-4 text-walmart-blue">Active Members</h3>
              <div className="space-y-3">
                {cart.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-heading font-semibold text-lg mb-4 text-walmart-blue">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('ai')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                >
                  <div className="font-medium">Get AI Suggestions</div>
                  <div className="text-sm text-gray-500">Find missing items for your goals</div>
                </button>
                <button 
                  onClick={() => setActiveTab('split')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                >
                  <div className="font-medium">Calculate Split</div>
                  <div className="text-sm text-gray-500">Divide costs among members</div>
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                >
                  <div className="font-medium">Share Cart</div>
                  <div className="text-sm text-gray-500">Invite more friends to collaborate</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        shareUrl={cart.shareUrl}
        cartName={cart.name}
      />
    </div>
  );
};

export default Index;
