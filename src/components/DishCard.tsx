import React, { useState } from 'react';
import { Dish } from '../types/menu';
import { Plus, Wine, CupSoda, GlassWater, Utensils } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onOpenDetails: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  onOpenDetails,
  onQuickAdd,
}) => {
  const [imageError, setImageError] = useState(false);

  // Format tags with unboxed typographic separators
  const dietaryText = dish.dietary
    .map(d => {
      switch (d) {
        case 'halal': return 'Halal';
        case 'bestseller': return 'Popular';
        case 'alcoholic': return 'Alcoholic';
        case 'non-alcoholic': return '0.0% Non-Alc';
        case 'sugar-free': return 'Zero Sugar';
        case 'spicy': return 'Spicy';
        case 'extra-crispy': return 'Crispy';
        case 'value-combo': return 'Combo';
        case 'vegetarian': return 'Veggie';
        default: return d;
      }
    })
    .join(' · ');

  const getFallbackIcon = () => {
    if (dish.category === 'wines') return <Wine className="w-10 h-10 text-[#f59e0b]/40 mb-2" />;
    if (dish.category === 'cocktails' || dish.category === 'mocktails') return <GlassWater className="w-10 h-10 text-[#f59e0b]/40 mb-2" />;
    if (dish.category === 'juices' || dish.category === 'sodas') return <CupSoda className="w-10 h-10 text-[#f59e0b]/40 mb-2" />;
    return <Utensils className="w-10 h-10 text-[#f59e0b]/40 mb-2" />;
  };

  return (
    <article
      onClick={() => onOpenDetails(dish)}
      className="group relative flex flex-col bg-[#161a23] rounded-2xl border border-[#272d3a] overflow-hidden hover:border-[#3f475c] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full bg-[#1b202a] overflow-hidden">
        {dish.image && !imageError ? (
          <img
            src={dish.image}
            alt={dish.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1d232e] to-[#12161e]">
            {getFallbackIcon()}
            <span className="text-xs uppercase tracking-widest text-[#a39c8e] font-semibold">
              {dish.category}
            </span>
            <span className="font-serif text-sm text-[#ded8cc] mt-1 line-clamp-1">
              {dish.name}
            </span>
          </div>
        )}

        {/* Featured Tag: Max 1 mark */}
        {dish.featuredNote && (
          <div className="absolute top-3 left-3 bg-[#0f1217]/90 backdrop-blur-sm text-[#fcd34d] text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-lg border border-[#f59e0b]/30">
            {dish.featuredNote}
          </div>
        )}

        {/* Alcohol strength indicator if applicable */}
        {dish.alcoholByVolume && (
          <div className="absolute top-3 right-3 bg-[#0f1217]/85 backdrop-blur-sm text-[#c4bdaf] text-[10px] font-mono px-2 py-0.5 rounded border border-[#2a303e]">
            {dish.alcoholByVolume}
          </div>
        )}

        {/* Sold out overlay */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-[#0f1217]/85 backdrop-blur-xs flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest font-bold text-[#f87171] bg-[#291717] px-3.5 py-1.5 rounded-lg border border-[#522525]">
              Sold Out for Today
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata: Category, prep time, dietary tags */}
          <div className="flex items-center gap-1.5 text-xs text-[#8a8376] mb-1.5 flex-wrap">
            <span className="uppercase tracking-wider font-semibold text-[#f59e0b] text-[11px]">
              {dish.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{dish.prepTime}</span>
            {dietaryText && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#a8a193]">{dietaryText}</span>
              </>
            )}
          </div>

          {/* Dish / Drink Name */}
          <h3 className="text-lg font-serif font-bold text-[#f8f5ee] group-hover:text-[#f59e0b] transition-colors leading-snug">
            {dish.name}
          </h3>

          {dish.subtitle && (
            <p className="text-xs text-[#a0988a] font-medium mb-2">
              {dish.subtitle}
            </p>
          )}

          {/* Description */}
          <p className="text-xs text-[#b0a89a] line-clamp-2 leading-relaxed mb-4">
            {dish.description}
          </p>
        </div>

        {/* Beverage pairing hint if applicable */}
        {dish.beveragePairing && (
          <div className="mb-3.5 pt-2.5 border-t border-[#232936] text-[11px] text-[#8e8779] truncate">
            Pairs with: <strong className="text-[#f59e0b] font-medium">{dish.beveragePairing.name}</strong>
          </div>
        )}

        {/* Price & Action Row (in Kenyan Shillings) */}
        <div className="flex items-center justify-between pt-3 border-t border-[#232936]">
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#f59e0b]">KSh</span>
            <span className="text-xl font-mono tabular-nums font-bold text-[#fbf8f2]">
              {dish.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onOpenDetails(dish)}
              className="px-3 py-1.5 text-xs text-[#b8b0a2] hover:text-[#f8f5ee] hover:bg-[#202633] rounded-lg transition-colors whitespace-nowrap"
            >
              Details
            </button>
            <button
              type="button"
              disabled={!dish.isAvailable}
              onClick={() => onQuickAdd(dish)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
