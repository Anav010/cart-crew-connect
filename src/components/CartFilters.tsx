
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SortOption, FilterOption } from '@/types';

interface CartFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: FilterOption;
  onFiltersChange: (filters: FilterOption) => void;
  categories: string[];
  members: { id: string; name: string }[];
}

const CartFilters = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filters,
  onFiltersChange,
  categories,
  members
}: CartFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="dateAdded">Date Added</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.category || 'all'} 
              onValueChange={(value) => onFiltersChange({ 
                ...filters, 
                category: value === 'all' ? undefined : value 
              })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.addedBy || 'all'} 
              onValueChange={(value) => onFiltersChange({ 
                ...filters, 
                addedBy: value === 'all' ? undefined : value 
              })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">All Members</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartFilters;
