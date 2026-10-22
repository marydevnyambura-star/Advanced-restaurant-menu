import React from 'react';

export type CategoryFilter =
  | 'all'
  | 'african'
  | 'platters'
  | 'desserts'
  | 'burgers'
  | 'chicken'
  | 'fries'
  | 'street'
  | 'combos'
  | 'juices'
  | 'sodas'
  | 'mocktails'
  | 'cocktails'
  | 'wines';

interface CategoryNavProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  counts: Record<CategoryFilter, number>;
}

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'african', label: 'African Cuisine 🇰🇪' },
  { id: 'platters', label: 'Food Platters & Combos' },
  { id: 'desserts', label: 'Ice Cream & Desserts' },
  { id: 'burgers', label: 'Smash Burgers' },
  { id: 'chicken', label: 'Crispy Chicken' },
  { id: 'fries', label: 'Loaded Fries' },
  { id: 'street', label: 'Street Smocha' },
  { id: 'combos', label: 'Value Combos' },
  { id: 'juices', label: 'Fresh Juices & Shakes' },
  { id: 'mocktails', label: 'Zero-Proof Mocktails' },
  { id: 'cocktails', label: 'Diner Cocktails' },
  { id: 'wines', label: 'Wines & Sangria' },
  { id: 'sodas', label: 'Chilled Sodas' },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="w-full border-b border-[#252b36] bg-[#11141b]/95 backdrop-blur sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = counts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#f59e0b] text-[#0f1115] shadow-sm font-bold'
                    : 'text-[#9c9588] hover:text-[#f2ece2] hover:bg-[#1a1f29]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#0f1115]/20 text-[#0f1115] font-bold' : 'bg-[#1b202a] text-[#7d776c]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
