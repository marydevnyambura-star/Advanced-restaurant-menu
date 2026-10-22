import React, { useState } from 'react';
import { Dish, DietaryTag } from '../types/menu';
import { X, Edit2, Check, RotateCcw, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

interface ManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  onToggleAvailability: (dishId: string) => void;
  onUpdatePrice: (dishId: string, newPrice: number) => void;
  onAddNewDish: (dish: Dish) => void;
  onResetMenu: () => void;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({
  isOpen,
  onClose,
  dishes,
  onToggleAvailability,
  onUpdatePrice,
  onAddNewDish,
  onResetMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'add'>('inventory');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Form State
  const [newDishName, setNewDishName] = useState('');
  const [newDishSubtitle, setNewDishSubtitle] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<Dish['category']>('burgers');
  const [newDishDescription, setNewDishDescription] = useState('');
  const [newDishIngredients, setNewDishIngredients] = useState('');
  const [newDishPrepTime, setNewDishPrepTime] = useState('5-8 min');
  const [newDishDietary, setNewDishDietary] = useState<DietaryTag[]>(['halal']);

  if (!isOpen) return null;

  const handleStartEditPrice = (dish: Dish) => {
    setEditingPriceId(dish.id);
    setTempPrice(dish.price.toString());
  };

  const handleSavePrice = (dishId: string) => {
    const val = parseInt(tempPrice, 10);
    if (!isNaN(val) && val > 0) {
      onUpdatePrice(dishId, val);
    }
    setEditingPriceId(null);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishPrice) return;

    const parsedPrice = parseInt(newDishPrice, 10);
    const createdDish: Dish = {
      id: `custom-${Date.now()}`,
      name: newDishName.trim(),
      subtitle: newDishSubtitle.trim() || undefined,
      price: isNaN(parsedPrice) ? 500 : parsedPrice,
      category: newDishCategory,
      description: newDishDescription.trim() || 'Freshly made to order.',
      ingredients: newDishIngredients.split(',').map(s => s.trim()).filter(Boolean),
      allergens: [],
      dietary: newDishDietary,
      prepTime: newDishPrepTime.trim() || '5 min',
      isAvailable: true,
      featuredNote: 'New Diner Item',
    };

    onAddNewDish(createdDish);
    setNewDishName('');
    setNewDishSubtitle('');
    setNewDishPrice('');
    setNewDishDescription('');
    setNewDishIngredients('');
    setActiveTab('inventory');
  };

  const toggleDietaryTag = (tag: DietaryTag) => {
    setNewDishDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative w-full max-w-3xl bg-[#141822] border border-[#2b3343] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#252b38] flex items-center justify-between bg-[#101319]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#f59e0b]" />
            <div>
              <h2 className="text-base font-serif font-bold text-[#f8f5ee]">
                Fast Food & Bar Manager
              </h2>
              <div className="text-xs text-[#8e8779]">
                Live inventory, KSh pricing, and addition of drinks and dishes
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close manager modal"
            className="p-1.5 rounded-lg text-[#8e8779] hover:text-[#f8f5ee] hover:bg-[#1f2533] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#252b38] bg-[#12161f] px-5 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'inventory'
                ? 'border-[#f59e0b] text-[#f8f5ee]'
                : 'border-transparent text-[#8e8779] hover:text-[#ded8cb]'
            }`}
          >
            Stock Availability ({dishes.length} Items)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'add'
                ? 'border-[#f59e0b] text-[#f8f5ee]'
                : 'border-transparent text-[#8e8779] hover:text-[#ded8cb]'
            }`}
          >
            + Add New Meal / Beverage
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {activeTab === 'inventory' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#8e8779] pb-2 border-b border-[#222836]">
                <span>Item & Category</span>
                <span>Price (KSh) & Live Stock</span>
              </div>

              <div className="space-y-2">
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-xl bg-[#181c25] border border-[#272e3d] flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-serif font-bold text-[#f8f5ee] truncate">
                          {dish.name}
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider text-[#a39c8e] bg-[#10131a] px-1.5 py-0.5 rounded font-mono">
                          {dish.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#8e8779] mt-0.5">
                        {dish.isAvailable ? (
                          <span className="text-[#48db88]">In Stock & Ready</span>
                        ) : (
                          <span className="text-[#f87171]">Sold Out for Today</span>
                        )}
                      </div>
                    </div>

                    {/* Price and Stock Controls in KSh */}
                    <div className="flex items-center gap-3 shrink-0">
                      {editingPriceId === dish.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="10"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-20 bg-[#101319] border border-[#f59e0b] text-[#f8f5ee] text-xs rounded px-1.5 py-1 text-center font-mono"
                          />
                          <button
                            onClick={() => handleSavePrice(dish.id)}
                            className="p-1 text-[#48db88] hover:bg-[#202736] rounded"
                            title="Save KSh Price"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEditPrice(dish)}
                          className="flex items-center gap-1 text-xs font-mono tabular-nums text-[#f59e0b] hover:underline"
                          title="Click to edit KSh price"
                        >
                          KSh {dish.price.toLocaleString()}
                          <Edit2 className="w-3 h-3 text-[#787165]" />
                        </button>
                      )}

                      {/* Stock Button */}
                      <button
                        type="button"
                        onClick={() => onToggleAvailability(dish.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          dish.isAvailable
                            ? 'bg-[#1b3826] text-[#48db88] hover:bg-[#234731]'
                            : 'bg-[#3b1d22] text-[#f87171] hover:bg-[#4d242a]'
                        }`}
                      >
                        {dish.isAvailable ? (
                          <>
                            <ToggleRight className="w-4 h-4" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset to Default Fast Food Menu */}
              <div className="pt-4 border-t border-[#232938] flex justify-end">
                <button
                  type="button"
                  onClick={onResetMenu}
                  className="flex items-center gap-1.5 text-xs text-[#a0988a] hover:text-[#f8f5ee] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All to Default Menu</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateDish} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e9688] mb-1 font-bold">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Tropical Mango Mojito Mocktail"
                    className="w-full bg-[#181c25] border border-[#2b3343] rounded-lg px-3 py-2 text-xs text-[#f8f5ee] focus:border-[#f59e0b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e9688] mb-1 font-bold">
                    Subtitle / Summary
                  </label>
                  <input
                    type="text"
                    value={newDishSubtitle}
                    onChange={(e) => setNewDishSubtitle(e.target.value)}
                    placeholder="e.g. Fresh mango pulp, mint, and crushed ice"
                    className="w-full bg-[#181c25] border border-[#2b3343] rounded-lg px-3 py-2 text-xs text-[#f8f5ee] focus:border-[#f59e0b] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e9688] mb-1 font-bold">
                    Category *
                  </label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as Dish['category'])}
                    className="w-full bg-[#181c25] border border-[#2b3343] rounded-lg px-3 py-2 text-xs text-[#f8f5ee] focus:border-[#f59e0b] focus:outline-none"
                  >
                    <option value="african">African Cuisine 🇰🇪</option>
                    <option value="platters">Food Platters & Combos</option>
                    <option value="desserts">Ice Cream & Desserts</option>
                    <option value="burgers">Smash Burgers</option>
                    <option value="chicken">Crispy Fried Chicken</option>
                    <option value="fries">Loaded Fries</option>
                    <option value="street">Street Smocha</option>
                    <option value="combos">Value Combos</option>
                    <option value="juices">Fresh Juices & Shakes</option>
                    <option value="sodas">Chilled Sodas</option>
                    <option value="mocktails">Mocktails (Zero-Proof)</option>
                    <option value="cocktails">Diner Cocktails</option>
                    <option value="wines">Wines & Sangria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e9688] mb-1 font-bold">
                    Price in Kenyan Shillings (KSh) *
                  </label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="400"
                    className="w-full bg-[#181c25] border border-[#2b3343] rounded-lg px-3 py-2 text-xs text-[#f8f5ee] focus:border-[#f59e0b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e9688] mb-1 font-bold">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={newDishPrepTime}
                    onChange={(e) => setNewDishPrepTime(e.target.value)}
                    placeholder="3-5 min"
                    className="w-full bg-[#181c25] border border-[#2b3343] rounded-lg px-3 py-2 text-xs text-[#f8f5ee] focus:border-[#f59e0b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e9688] mb-1 font-bold">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDishDescription}
                  onChange={(e) => setNewDishDescription(e.target.value)}
                  placeholder="Appetizing description of flavors, ingredients, and garnishes..."
                  className="w-full bg-[#181c25] border border-[#2b3343] rounded-lg px-3 py-2 text-xs text-[#f8f5ee] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e9688] mb-1 font-bold">
                  Key Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  value={newDishIngredients}
                  onChange={(e) => setNewDishIngredients(e.target.value)}
                  placeholder="e.g. Fresh Mango, Mint, Lime, Soda Water"
                  className="w-full bg-[#181c25] border border-[#2b3343] rounded-lg px-3 py-2 text-xs text-[#f8f5ee] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e9688] mb-1.5 font-bold">
                  Tags & Classifications
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['non-alcoholic', 'alcoholic', 'bestseller', 'halal', 'sugar-free', 'vegetarian', 'spicy'] as DietaryTag[]).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietaryTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                        newDishDietary.includes(tag)
                          ? 'bg-[#f59e0b] text-[#0f1115] border-[#f59e0b] font-bold'
                          : 'bg-[#181c25] border-[#29303e] text-[#8e8779]'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-bold text-xs tracking-wider uppercase transition-colors"
                >
                  Publish to Live Menu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
