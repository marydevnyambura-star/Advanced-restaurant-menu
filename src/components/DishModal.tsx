import React, { useState } from 'react';
import { Dish, CartItem } from '../types/menu';
import { X, Check, Plus, Minus, AlertCircle, Flame, CupSoda, Utensils, Wine, GlassWater } from 'lucide-react';

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

  const handleToggleAdjustment = (adj: string) => {
    setSelectedAdjustments(prev =>
      prev.includes(adj) ? prev.filter(a => a !== adj) : [...prev, adj]
    );
  };

  // Pricing calculation in Kenyan Shillings
  const sidesTotal = selectedSides.reduce((sum, s) => sum + s.price, 0);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const beveragePrice = includeBeveragePairing && dish.beveragePairing ? dish.beveragePairing.price : 0;
  const unitPrice = dish.price + sidesTotal + addonsTotal + beveragePrice;
  const itemTotal = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish.isAvailable) return;

    onAddToCart({
      dish,
      quantity,
      selectedSpiceLevel,
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
          </div>

          <div className="p-5 border-t border-[#262e3d] bg-[#11141c]/95 hidden md:block">
            <div className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] mb-1">
              {isDrinkCategory ? 'Diner Beverage Service' : 'Freshly Prepared to Order'}
            </div>
            <p className="text-xs text-[#a0988a] leading-relaxed">
              {isDrinkCategory
                ? 'Crafted with premium spirits, tree-ripened tropical fruit pulp, and purified ice.'
                : 'Cooked fresh on the iron grill and fryer for maximum juiciness and crunch.'}
            </p>
          </div>
        </div>

        {/* Right Column: Customizer & Purchase Module */}
        <div className="md:w-7/12 flex-1 flex flex-col max-h-[92vh] overflow-y-auto p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-xs text-[#8e8779] mb-1.5 flex-wrap">
                  <span className="uppercase tracking-wider font-bold text-[#f59e0b]">
                    {dish.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Ready in {dish.prepTime}</span>
                  {dish.alcoholByVolume && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[#fcd34d] font-semibold">{dish.alcoholByVolume}</span>
                    </>
                  )}
                  {dish.calories && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{dish.calories} kcal</span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif text-[#f8f5ee] font-bold leading-tight">
                  {dish.name}
                </h2>

                {dish.subtitle && (
                  <p className="text-sm font-medium text-[#c4bdaf] mt-0.5">
                    {dish.subtitle}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#aba395] leading-relaxed mt-3">
                  {dish.description}
                </p>
              </div>

              {/* Ingredients & Allergens */}
              <div className="p-3.5 rounded-xl bg-[#10131b] border border-[#232936] space-y-2 text-xs">
                <div>
                  <span className="text-[#8e8779] font-medium">Ingredients: </span>
                  <span className="text-[#ded8cc]">{dish.ingredients.join(', ')}</span>
                </div>
                {dish.allergens.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[#f59e0b]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Contains: {dish.allergens.join(', ')}</span>
                  </div>
                )}
                {dish.dietary.includes('alcoholic') && (
                  <div className="text-[11px] text-[#f87171] font-semibold">
                    * Alcoholic Beverage: strictly for guests aged 18 and older.
                  </div>
                )}
              </div>

              {/* Ice Level for Drinks */}
              {dish.customization?.iceLevel && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2">
                    Ice Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dish.customization.iceLevel.map((ice) => (
                      <button
                        type="button"
                        key={ice}
                        onClick={() => setSelectedIceLevel(ice)}
                        className={`px-3 py-2 text-xs text-center rounded-xl transition-colors border ${
                          selectedIceLevel === ice
                            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                            : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                        }`}
                      >
                        {ice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sweetness Level for Juices & Mocktails */}
              {dish.customization?.sweetnessLevel && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2">
                    Sweetness Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dish.customization.sweetnessLevel.map((sweet) => (
                      <button
                        type="button"
                        key={sweet}
                        onClick={() => setSelectedSweetness(sweet)}
                        className={`px-3 py-2 text-xs text-center rounded-xl transition-colors border ${
                          selectedSweetness === sweet
                            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                            : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                        }`}
                      >
                        {sweet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Glass or Bottle selection for wines */}
              {dish.customization?.glassOrBottle && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2">
                    Serving Option
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {dish.customization.glassOrBottle.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setSelectedServingSize(opt)}
                        className={`px-3 py-2 text-xs text-center rounded-xl transition-colors border ${
                          selectedServingSize === opt
                            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
                            : 'bg-[#181d26] border-[#29303e] text-[#a0998c] hover:border-[#3d475a]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spice Level Option */}
              {dish.customization?.spiceLevel && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>Choose Your Heat Level</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {dish.customization.spiceLevel.map((spice) => (
                      <button
                        type="button"
                        key={spice}
                        onClick={() => setSelectedSpiceLevel(spice)}
                        className={`px-3 py-2 text-xs text-center rounded-xl transition-colors border ${
                          selectedSpiceLevel === spice
                            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d] font-bold'
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
                  Special Notes (e.g. Extra ice, straw, slice of lemon)
                </label>
                <input
                  type="text"
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra napkins, no ice, extra lime..."
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
