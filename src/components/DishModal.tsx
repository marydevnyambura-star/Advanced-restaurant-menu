import React, { useState } from 'react';
import { Dish, CartItem } from '../types/menu';
import { X, Check, Plus, Minus, CupSoda, Utensils, Wine, GlassWater, Users, Sparkles } from 'lucide-react';

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
}

export const DishModal: React.FC<DishModalProps> = ({
  dish,
  onClose,
  onAddToCart,
}) => {
  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string | undefined>(
    dish.customization?.spiceLevel ? dish.customization.spiceLevel[0] : undefined
  );
  const [selectedPortionSize, setSelectedPortionSize] = useState<{ name: string; price: number } | undefined>(
    dish.customization?.portionSizes ? dish.customization.portionSizes[0] : undefined
  );
  const [selectedAccompaniment, setSelectedAccompaniment] = useState<{ name: string; price: number } | undefined>(
    dish.customization?.accompaniments ? dish.customization.accompaniments[0] : undefined
  );
  const [selectedScoopCount, setSelectedScoopCount] = useState<{ count: number; name: string; price: number } | undefined>(
    dish.customization?.scoopOptions ? dish.customization.scoopOptions[0] : undefined
  );
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(
    dish.customization?.iceCreamFlavors ? [dish.customization.iceCreamFlavors[0]] : []
  );
  const [selectedSauceToppings, setSelectedSauceToppings] = useState<{ name: string; price: number }[]>([]);
  const [selectedIceLevel, setSelectedIceLevel] = useState<string | undefined>(
    dish.customization?.iceLevel ? dish.customization.iceLevel[0] : undefined
  );
  const [selectedSweetness, setSelectedSweetness] = useState<string | undefined>(
    dish.customization?.sweetnessLevel ? dish.customization.sweetnessLevel[0] : undefined
  );
  const [selectedServingSize, setSelectedServingSize] = useState<string | undefined>(
    dish.customization?.glassOrBottle ? dish.customization.glassOrBottle[0] : undefined
  );
  const [selectedDrink, setSelectedDrink] = useState<string | undefined>(
    dish.customization?.drinkChoices ? dish.customization.drinkChoices[0] : undefined
  );
  const [selectedSides, setSelectedSides] = useState<{ name: string; price: number }[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number }[]>([]);
  const [selectedAdjustments, setSelectedAdjustments] = useState<string[]>([]);
  const [includeBeveragePairing, setIncludeBeveragePairing] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleToggleSide = (side: { name: string; price: number }) => {
    setSelectedSides(prev =>
      prev.some(s => s.name === side.name)
        ? prev.filter(s => s.name !== side.name)
        : [...prev, side]
    );
  };

  const handleToggleAddon = (addon: { name: string; price: number }) => {
    setSelectedAddons(prev =>
      prev.some(a => a.name === addon.name)
        ? prev.filter(a => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handleToggleSauceTopping = (topping: { name: string; price: number }) => {
    setSelectedSauceToppings(prev =>
      prev.some(t => t.name === topping.name)
        ? prev.filter(t => t.name !== topping.name)
        : [...prev, topping]
    );
  };

  const handleToggleFlavor = (flavor: string) => {
    const maxFlavors = selectedScoopCount ? selectedScoopCount.count : 2;
    setSelectedFlavors(prev => {
      if (prev.includes(flavor)) {
        return prev.length > 1 ? prev.filter(f => f !== flavor) : prev;
      } else {
        if (prev.length >= maxFlavors) {
          return [...prev.slice(1), flavor];
        }
        return [...prev, flavor];
      }
    });
  };

  const handleToggleAdjustment = (adj: string) => {
    setSelectedAdjustments(prev =>
      prev.includes(adj) ? prev.filter(a => a !== adj) : [...prev, adj]
    );
  };

  // Pricing calculation in Kenyan Shillings
  const portionPrice = selectedPortionSize ? selectedPortionSize.price : 0;
  const accompanimentPrice = selectedAccompaniment ? selectedAccompaniment.price : 0;
  const scoopPrice = selectedScoopCount ? selectedScoopCount.price : 0;
  const toppingsTotal = selectedSauceToppings.reduce((sum, t) => sum + t.price, 0);
  const sidesTotal = selectedSides.reduce((sum, s) => sum + s.price, 0);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const beveragePrice = includeBeveragePairing && dish.beveragePairing ? dish.beveragePairing.price : 0;

  const unitPrice = dish.price + portionPrice + accompanimentPrice + scoopPrice + toppingsTotal + sidesTotal + addonsTotal + beveragePrice;
  const itemTotal = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish.isAvailable) return;

    onAddToCart({
      dish,
      quantity,
      selectedSpiceLevel,
      selectedPortionSize,
      selectedAccompaniment,
      selectedScoopCount,
      selectedFlavors,
      selectedSauceToppings,
      selectedIceLevel,
      selectedSweetness,
      selectedServingSize,
      selectedDrink,
      selectedSides,
      selectedAddons,
      selectedAdjustments,
      includeBeveragePairing,
      specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : undefined,
      itemTotal,
    });
    onClose();
  };

  const isDrinkCategory = ['juices', 'sodas', 'cocktails', 'mocktails', 'wines'].includes(dish.category);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-4xl bg-[#141822] border border-[#2b3342] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dish preview"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#0f1217]/85 text-[#b5ad9e] hover:text-[#f8f5ee] hover:bg-[#0f1217] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image & Details */}
        <div className="md:w-5/12 bg-[#191f2b] relative flex flex-col justify-between overflow-hidden">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full w-full min-h-[220px] md:min-h-[380px]">
            {dish.image && !imageError ? (
              <img
                src={dish.image}
                alt={dish.name}
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#1c222e] to-[#11151d]">
                {dish.category === 'wines' ? (
                  <Wine className="w-16 h-16 text-[#f59e0b]/40 mb-3" />
                ) : isDrinkCategory ? (
                  <GlassWater className="w-16 h-16 text-[#f59e0b]/40 mb-3" />
                ) : (
                  <Utensils className="w-16 h-16 text-[#f59e0b]/40 mb-3" />
                )}
                <span className="font-serif text-xl font-bold text-[#e8e2d5]">{dish.name}</span>
                <span className="text-xs uppercase tracking-widest text-[#948d7f] mt-1">{dish.category}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141822] via-transparent to-transparent md:hidden" />

            {/* Serving Size Badge for Platters */}
            {dish.servesCount && (
              <div className="absolute bottom-4 left-4 bg-[#0f1217]/90 backdrop-blur-sm text-[#34d399] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#34d399]/40 flex items-center gap-1.5 shadow-md">
                <Users className="w-4 h-4 text-[#34d399]" />
                <span>{dish.servesCount}</span>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-[#262e3d] bg-[#11141c]/95 hidden md:block">
            <div className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] mb-1">
              {isDrinkCategory ? 'Diner Beverage Service' : 'Freshly Prepared to Order'}
            </div>
            <p className="text-xs text-[#a0988a] leading-relaxed">
              All meals are prepared fresh to order in our Nairobi kitchen using 100% Halal beef, poultry, and local farm produce.
            </p>
          </div>
        </div>

        {/* Right Column: Customization Form & Pricing */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[92vh]">
          <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-xs text-[#f59e0b] font-semibold uppercase tracking-wider mb-1">
                  <span>{dish.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{dish.prepTime}</span>
                  {dish.servesCount && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#34d399] font-bold">{dish.servesCount}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#f8f5ee] leading-tight">
                  {dish.name}
                </h2>
                {dish.subtitle && (
                  <p className="text-xs text-[#b8b0a2] mt-1 font-medium">{dish.subtitle}</p>
                )}
                <p className="text-xs text-[#a39c8e] mt-2.5 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Platter Included Items List */}
              {dish.includedItems && dish.includedItems.length > 0 && (
                <div className="p-4 rounded-xl bg-[#181d26] border border-[#2b3342] space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Platter Inclusions (Feast Spread):</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#ded8cc]">
                    {dish.includedItems.map((inc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Portion Sizes Selection (African dishes & Platters) */}
              {dish.customization?.portionSizes && dish.customization.portionSizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2">
                    Select Portion Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dish.customization.portionSizes.map((portion) => {
                      const isSelected = selectedPortionSize?.name === portion.name;
                      return (
                        <button
                          type="button"
                          key={portion.name}
                          onClick={() => setSelectedPortionSize(portion)}
                          className={`p-2.5 text-xs rounded-xl border text-left transition-colors ${
                            isSelected
                              ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                              : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                          }`}
                        >
                          <div>{portion.name}</div>
                          <div className="text-[11px] font-mono text-[#f59e0b] mt-0.5">
                            {portion.price === 0 ? 'Included' : `+KSh ${portion.price.toLocaleString()}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Accompaniments (Ugali, Chapati, Pilau Rice, Fries, etc.) */}
              {dish.customization?.accompaniments && dish.customization.accompaniments.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2 flex items-center justify-between">
                    <span>Choice of Accompaniment</span>
                    <span className="text-[10px] text-[#8e8779] normal-case">Pick 1 Included/Upgrade</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dish.customization.accompaniments.map((acc) => {
                      const isSelected = selectedAccompaniment?.name === acc.name;
                      return (
                        <button
                          type="button"
                          key={acc.name}
                          onClick={() => setSelectedAccompaniment(acc)}
                          className={`flex items-center justify-between p-2.5 text-xs rounded-xl border transition-colors ${
                            isSelected
                              ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                              : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#f59e0b] bg-[#f59e0b]' : 'border-[#434c5e]'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0f1115]" />}
                            </div>
                            <span className="truncate">{acc.name}</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#f59e0b] ml-1 shrink-0">
                            {acc.price === 0 ? 'Included' : `+KSh ${acc.price}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ice Cream Scoop Selection & Flavors */}
              {dish.customization?.scoopOptions && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2">
                    Number of Scoops
                  </label>
                  <div className="flex gap-2">
                    {dish.customization.scoopOptions.map((opt) => {
                      const isSelected = selectedScoopCount?.name === opt.name;
                      return (
                        <button
                          type="button"
                          key={opt.name}
                          onClick={() => setSelectedScoopCount(opt)}
                          className={`flex-1 py-2 px-3 text-xs rounded-xl border text-center transition-colors ${
                            isSelected
                              ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                              : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                          }`}
                        >
                          <div>{opt.name}</div>
                          <div className="text-[10px] font-mono text-[#f59e0b]">
                            {opt.price === 0 ? 'Standard' : opt.price > 0 ? `+KSh ${opt.price}` : `-KSh ${Math.abs(opt.price)}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ice Cream Flavors */}
              {dish.customization?.iceCreamFlavors && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2 flex items-center justify-between">
                    <span>Choose Flavor(s)</span>
                    <span className="text-[10px] text-[#8e8779]">
                      Up to {selectedScoopCount?.count ?? 2} scoops
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dish.customization.iceCreamFlavors.map((flavor) => {
                      const isSelected = selectedFlavors.includes(flavor);
                      return (
                        <button
                          type="button"
                          key={flavor}
                          onClick={() => handleToggleFlavor(flavor)}
                          className={`p-2 text-xs rounded-xl border text-left truncate transition-colors ${
                            isSelected
                              ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                              : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded flex items-center justify-center border ${isSelected ? 'bg-[#f59e0b] border-[#f59e0b] text-[#0f1115]' : 'border-[#434c5e]'}`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="truncate">{flavor}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dessert Sauce Toppings */}
              {dish.customization?.sauceToppings && dish.customization.sauceToppings.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2">
                    Sauces & Drizzles
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {dish.customization.sauceToppings.map((topping) => {
                      const isSelected = selectedSauceToppings.some(t => t.name === topping.name);
                      return (
                        <button
                          type="button"
                          key={topping.name}
                          onClick={() => handleToggleSauceTopping(topping)}
                          className={`flex items-center justify-between p-2 text-xs rounded-xl border transition-colors ${
                            isSelected
                              ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                              : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <div className={`w-3 h-3 rounded flex items-center justify-center border ${isSelected ? 'bg-[#f59e0b] border-[#f59e0b] text-[#0f1115]' : 'border-[#434c5e]'}`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="truncate">{topping.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#f59e0b] ml-1 shrink-0">
                            {topping.price === 0 ? 'Free' : `+KSh ${topping.price}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Spice Level for Burgers / Fried Chicken / African */}
              {dish.customization?.spiceLevel && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2">
                    Spice / Heat Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dish.customization.spiceLevel.map((spice) => (
                      <button
                        type="button"
                        key={spice}
                        onClick={() => setSelectedSpiceLevel(spice)}
                        className={`px-3 py-1.5 text-xs rounded-xl transition-colors border ${
                          selectedSpiceLevel === spice
                            ? 'bg-[#f59e0b] text-[#0f1115] font-bold border-[#f59e0b]'
                            : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                        }`}
                      >
                        {spice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Drink choice for Combos */}
              {dish.customization?.drinkChoices && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2 flex items-center gap-1.5">
                    <CupSoda className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>Included Beverage Choice</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dish.customization.drinkChoices.map((drk) => (
                      <button
                        type="button"
                        key={drk}
                        onClick={() => setSelectedDrink(drk)}
                        className={`px-3 py-2 text-xs rounded-xl transition-colors border text-left truncate ${
                          selectedDrink === drk
                            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                            : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                        }`}
                      >
                        {drk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Addons (in KSh) */}
              {dish.customization?.addons && dish.customization.addons.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2">
                    Extra Upgrades & Add-ons
                  </label>
                  <div className="space-y-1.5">
                    {dish.customization.addons.map((addon) => {
                      const isSelected = selectedAddons.some(a => a.name === addon.name);
                      return (
                        <button
                          type="button"
                          key={addon.name}
                          onClick={() => handleToggleAddon(addon)}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs rounded-xl transition-colors border ${
                            isSelected
                              ? 'bg-[#f59e0b]/15 border-[#f59e0b] text-[#fcd34d]'
                              : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected ? 'bg-[#f59e0b] border-[#f59e0b] text-[#0f1115]' : 'border-[#434c5e]'}`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{addon.name}</span>
                          </div>
                          <span className="font-mono tabular-nums font-semibold text-[#f59e0b]">
                            +KSh {addon.price.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Beverage Pairing Card */}
              {dish.beveragePairing && (
                <div
                  onClick={() => setIncludeBeveragePairing(!includeBeveragePairing)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    includeBeveragePairing
                      ? 'bg-[#261e12] border-[#f59e0b] shadow-md'
                      : 'bg-[#181d26] border-[#28303f] hover:border-[#3d475a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-lg ${includeBeveragePairing ? 'bg-[#f59e0b] text-[#0f1115]' : 'bg-[#1b202b] text-[#f59e0b]'}`}>
                        <CupSoda className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#f8f5ee]">
                          Add Drink: {dish.beveragePairing.name}
                        </div>
                        <p className="text-[11px] text-[#a0988a] mt-0.5 leading-relaxed">{dish.beveragePairing.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono tabular-nums text-sm font-bold text-[#f59e0b]">
                        +KSh {dish.beveragePairing.price.toLocaleString()}
                      </span>
                      <div className={`text-[10px] mt-1 uppercase font-bold tracking-wider ${includeBeveragePairing ? 'text-[#f59e0b]' : 'text-[#7e786b]'}`}>
                        {includeBeveragePairing ? 'Included' : 'Tap to Add'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label htmlFor="instructions" className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-1.5">
                  Special Notes (e.g. Extra napkins, no chili, straw)
                </label>
                <input
                  type="text"
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra hot pili pili, well done, cutlery..."
                  className="w-full bg-[#10131b] border border-[#262c3a] rounded-lg p-2.5 text-xs text-[#f4efe6] placeholder-[#666055] focus:outline-none focus:border-[#f59e0b]"
                />
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-6 mt-6 border-t border-[#262e3d] flex items-center justify-between gap-4">
              <div className="flex items-center bg-[#10131b] border border-[#272e3d] rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-[#a0988a] hover:text-[#f8f5ee] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-xs font-mono tabular-nums font-bold text-[#f8f5ee]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-[#a0988a] hover:text-[#f8f5ee] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!dish.isAvailable}
                className="flex-1 flex items-center justify-between px-5 py-3 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-bold text-xs tracking-wider uppercase transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Add To Tray</span>
                <span className="font-mono tabular-nums text-sm font-bold">
                  KSh {itemTotal.toLocaleString()}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
