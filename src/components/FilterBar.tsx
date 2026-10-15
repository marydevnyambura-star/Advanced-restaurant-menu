import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { DietaryTag } from '../types/menu';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'calories-asc';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDietary: DietaryTag[];
  onToggleDietary: (tag: DietaryTag) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFiltered: number;
  onResetFilters: () => void;
}

const MENU_FILTERS: { id: DietaryTag; label: string }[] = [
  { id: 'bestseller', label: 'Bestseller' },
  { id: 'non-alcoholic', label: 'Non-Alcoholic' },
  { id: 'alcoholic', label: 'Alcoholic' },
  { id: 'halal', label: '100% Halal' },
  { id: 'sugar-free', label: 'Zero Sugar' },
  { id: 'value-combo', label: 'Value Deals' },
  { id: 'vegetarian', label: 'Vegetarian' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDietary,
  onToggleDietary,
  sortBy,
  onSortChange,
  totalFiltered,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery.trim().length > 0 || selectedDietary.length > 0 || sortBy !== 'default';

  return (
    <div className="bg-[#12161f] border-b border-[#232935] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8376]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search burgers, juices, cocktails, wines, or sodas..."
              className="w-full bg-[#181d26] border border-[#2c3342] rounded-lg pl-9.5 pr-8 py-2 text-xs text-[#f2ece2] placeholder-[#736d62] focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#736d62] hover:text-[#f2ece2]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8a8376]" />
            <label htmlFor="sort-select" className="text-xs text-[#8a8376] whitespace-nowrap">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-[#181d26] border border-[#2c3342] text-[#f2ece2] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#f59e0b] cursor-pointer"
            >
              <option value="default">Most Popular</option>
              <option value="price-asc">Price: Low to High (KSh)</option>
              <option value="price-desc">Price: High to Low (KSh)</option>
              <option value="calories-asc">Calories: Low to High</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs text-[#f59e0b] hover:underline ml-2 whitespace-nowrap"
              >
                Reset ({totalFiltered})
              </button>
            )}
          </div>
        </div>

        {/* Filter tags (Interactive Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] text-[#787266] uppercase tracking-wider font-semibold mr-1 whitespace-nowrap shrink-0">
            Filters:
          </span>
          {MENU_FILTERS.map((tag) => {
            const isSelected = selectedDietary.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => onToggleDietary(tag.id)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#f59e0b]/20 text-[#fcd34d] border border-[#f59e0b]/50 font-semibold'
                    : 'bg-[#181d26] text-[#9c9588] border border-[#282f3c] hover:text-[#f2ece2] hover:border-[#384152]'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
