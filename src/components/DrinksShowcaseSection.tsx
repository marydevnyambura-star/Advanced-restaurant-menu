import React, { useState } from 'react';
import { GlassWater, CupSoda, Wine, Sparkles, Plus } from 'lucide-react';
import { Dish } from '../types/menu';

interface DrinksShowcaseSectionProps {
  dishes: Dish[];
  onOpenDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
}

type DrinkSubcategory = 'all-drinks' | 'juices' | 'mocktails' | 'cocktails' | 'wines' | 'sodas';

export const DrinksShowcaseSection: React.FC<DrinksShowcaseSectionProps> = ({
  dishes,
  onOpenDish,
  onQuickAdd,
}) => {
  const [activeSubcategory, setActiveSubcategory] = useState<DrinkSubcategory>('all-drinks');

  const drinkDishes = dishes.filter(d =>
    ['juices', 'sodas', 'mocktails', 'cocktails', 'wines'].includes(d.category)
  );

  const filteredDrinks = activeSubcategory === 'all-drinks'
    ? drinkDishes
    : drinkDishes.filter(d => d.category === activeSubcategory);

  return (
    <section id="drinks-lounge" className="py-16 bg-[#10131b] border-t border-[#232936]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#f59e0b] font-bold mb-2 flex items-center gap-2">
              <GlassWater className="w-4 h-4 text-[#f59e0b]" />
              <span>Beverage Lounge & Bar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f8f5ee] font-bold">
              Fresh Juices, Sodas, Cocktails, Mocktails & Wines
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9c9588] max-w-md">
            Cold-pressed tropical fruits, Kenya’s iconic Dawa cocktail, zesty zero-proof mocktails, chilled Stoney Tangawizi, and Cape cellar wines.
          </p>
        </div>

        {/* Subcategory Pills/Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-6">
          {[
            { id: 'all-drinks', label: 'All Drinks' },
            { id: 'juices', label: 'Fresh Juices' },
            { id: 'mocktails', label: 'Zero-Proof Mocktails' },
            { id: 'cocktails', label: 'Diner Cocktails' },
            { id: 'wines', label: 'Wines & Sangria' },
            { id: 'sodas', label: 'Chilled Sodas & Floats' },
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubcategory(sub.id as DrinkSubcategory)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 border ${
                activeSubcategory === sub.id
                  ? 'bg-[#f59e0b] text-[#0f1115] border-[#f59e0b]'
                  : 'bg-[#161a24] text-[#a0988a] border-[#262c3b] hover:text-[#f8f5ee]'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Drinks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrinks.map((drink) => (
            <div
              key={drink.id}
              onClick={() => onOpenDish(drink)}
              className="bg-[#161a23] border border-[#272d3a] rounded-2xl p-5 hover:border-[#f59e0b]/50 transition-all flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8e8779] mb-2.5">
                  <span className="uppercase tracking-wider font-semibold text-[#f59e0b] text-[11px]">
                    {drink.category}
                  </span>
                  {drink.alcoholByVolume && (
                    <span className="font-mono text-[10px] text-[#c4bdaf] bg-[#101319] px-2 py-0.5 rounded border border-[#2a303e]">
                      {drink.alcoholByVolume}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-serif font-bold text-[#f8f5ee] group-hover:text-[#f59e0b] transition-colors leading-snug">
                  {drink.name}
                </h3>
                {drink.subtitle && (
                  <p className="text-xs text-[#a0988a] mt-0.5 mb-2.5 line-clamp-1">{drink.subtitle}</p>
                )}

                <p className="text-xs text-[#aba395] line-clamp-2 leading-relaxed mb-4">
                  {drink.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#232936] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-[#f59e0b]">KSh</span>
                  <span className="text-lg font-mono tabular-nums font-bold text-[#fbf8f2]">
                    {drink.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenDish(drink)}
                    className="px-2.5 py-1 text-xs text-[#a0988a] hover:text-[#f8f5ee] rounded-lg transition-colors"
                  >
                    Options
                  </button>
                  <button
                    type="button"
                    onClick={() => onQuickAdd(drink)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] text-xs font-bold transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
