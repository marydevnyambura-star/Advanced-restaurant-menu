import React from 'react';
import { Sparkles, Utensils, Zap, Plus } from 'lucide-react';
import { Dish } from '../types/menu';

interface CombosSectionProps {
  comboDishes: Dish[];
  onOpenDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({
  comboDishes,
  onOpenDish,
  onQuickAdd,
}) => {
  return (
    <section id="combos" className="py-16 bg-[#11141c] border-t border-[#232936]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#f59e0b] font-bold mb-2">
              Value Deals & Combos
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f8f5ee] font-bold">
              Burger Combos, Family Buckets & Street Boxes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9c9588] max-w-md">
            Save up to KSh 350 with all-in-one meal combos served with hot crinkle fries, dips, and ice-cold drinks.
          </p>
        </div>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comboDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-[#161a24] border border-[#272e3d] rounded-2xl p-6 hover:border-[#f59e0b]/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8e8779] mb-3">
                  <span className="flex items-center gap-1.5 text-[#f59e0b] font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    Special Fast Food Deal
                  </span>
                  <span className="font-mono tabular-nums text-sm font-bold text-[#f8f5ee]">
                    KSh {dish.price.toLocaleString()}
                  </span>
                </div>

                <h3
                  onClick={() => onOpenDish(dish)}
                  className="text-lg font-serif font-bold text-[#f8f5ee] group-hover:text-[#f59e0b] transition-colors cursor-pointer"
                >
                  {dish.name}
                </h3>
                {dish.subtitle && (
                  <div className="text-xs text-[#a0988a] font-medium mt-0.5 mb-3">{dish.subtitle}</div>
                )}

                <p className="text-xs text-[#b8b0a2] leading-relaxed mb-4">
                  {dish.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#232938] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onOpenDish(dish)}
                  className="text-[#a0988a] hover:text-[#f8f5ee] font-medium"
                >
                  View Details & Drinks
                </button>
                <button
                  type="button"
                  onClick={() => onQuickAdd(dish)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add Deal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
