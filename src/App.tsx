import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_MENU } from './data/initialMenu';
import { Dish, CartItem, DiningDetails, PlacedOrder, DietaryTag } from './types/menu';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav, CategoryFilter } from './components/CategoryNav';
import { FilterBar, SortOption } from './components/FilterBar';
import { DishCard } from './components/DishCard';
import { DishModal } from './components/DishModal';
import { OrderDrawer } from './components/OrderDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ManagerModal } from './components/ManagerModal';
import { CombosSection } from './components/CombosSection';
import { DrinksShowcaseSection } from './components/DrinksShowcaseSection';
import { ScanToOrderModal } from './components/ScanToOrderModal';
import { RecentOrdersModal } from './components/RecentOrdersModal';
import { Footer } from './components/Footer';
import { Utensils, Check, QrCode, Smartphone, Clock } from 'lucide-react';

export default function App() {
  // Read initial table from URL query string if scanned from a phone QR code (e.g. ?table=Table+04)
  const initialTableFromUrl = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('table')
    : null;

  // Menu State with LocalStorage Persistence
  const [dishes, setDishes] = useState<Dish[]>(() => {
    try {
      const saved = localStorage.getItem('sizzle_menu_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cached menu:', e);
    }
    return INITIAL_MENU;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sizzle_menu_v4', JSON.stringify(dishes));
    } catch (e) {
      console.warn('Could not persist menu:', e);
    }
  }, [dishes]);

  // Cart State with LocalStorage Persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sizzle_cart_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cached cart:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sizzle_cart_v3', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not persist cart:', e);
    }
  }, [cartItems]);

  // Recent Orders (Last 5 orders) State with LocalStorage Persistence
  const [recentOrders, setRecentOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('sizzle_recent_orders_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cached recent orders:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sizzle_recent_orders_v1', JSON.stringify(recentOrders));
    } catch (e) {
      console.warn('Could not persist recent orders:', e);
    }
  }, [recentOrders]);

  // Dining Details State
  const [diningDetails, setDiningDetails] = useState<DiningDetails>({
    serviceMode: 'dine-in',
    tableNumber: initialTableFromUrl || 'Table 04',
    guestCount: 2,
    customerPhone: '',
    paymentMethod: 'mpesa',
  });

  // UI Filtering & Category States
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [platterSubFilter, setPlatterSubFilter] = useState<'all' | 'individual' | 'sharing' | 'family' | 'vegetarian'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [activeSection, setActiveSection] = useState<'menu' | 'combos' | 'drinks'>('menu');

  // Modals & Drawers States
  const [selectedDishForModal, setSelectedDishForModal] = useState<Dish | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isRecentOrdersModalOpen, setIsRecentOrdersModalOpen] = useState(false);
  const [recentPlacedOrder, setRecentPlacedOrder] = useState<PlacedOrder | null>(null);

  // Transient Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  // Welcome user if table was detected via QR scan
  useEffect(() => {
    if (initialTableFromUrl) {
      showToast(`Welcome! Scanned to order for ${initialTableFromUrl}`);
    }
  }, [initialTableFromUrl]);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [cartItems]);

  // Filter & Search Logic
  const filteredDishes = useMemo(() => {
    let list = [...dishes];

    // Filter by category
    if (activeCategory !== 'all') {
      list = list.filter((d) => d.category === activeCategory);
    }

    // Filter by platter subcategory if in platters category
    if (activeCategory === 'platters' && platterSubFilter !== 'all') {
      list = list.filter((d) => d.platterFilter === platterSubFilter);
    }

    // Filter by dietary tags
    if (selectedDietary.length > 0) {
      list = list.filter((d) =>
        selectedDietary.every((tag) => d.dietary.includes(tag))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.subtitle && d.subtitle.toLowerCase().includes(q)) ||
          d.description.toLowerCase().includes(q) ||
          d.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
          d.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'calories-asc') {
      list.sort((a, b) => (a.calories || 999) - (b.calories || 999));
    }

    return list;
  }, [dishes, activeCategory, platterSubFilter, selectedDietary, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      all: dishes.length,
      african: 0,
      platters: 0,
      desserts: 0,
      burgers: 0,
      chicken: 0,
      fries: 0,
      street: 0,
      combos: 0,
      juices: 0,
      sodas: 0,
      mocktails: 0,
      cocktails: 0,
      wines: 0,
    };
    dishes.forEach((d) => {
      if (counts[d.category as CategoryFilter] !== undefined) {
        counts[d.category as CategoryFilter]++;
      }
    });
    return counts;
  }, [dishes]);

  // Highlights
  const fastFoodSpecials = useMemo(() => {
    return dishes.filter((d) => d.isChefSpecial && d.isAvailable);
  }, [dishes]);

  // Combos
  const comboDishes = useMemo(() => {
    return dishes.filter((d) => d.category === 'combos');
  }, [dishes]);

  // Cart operations
  const handleAddToCart = (itemData: Omit<CartItem, 'cartItemId'>) => {
    const newCartItem: CartItem = {
      ...itemData,
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    setCartItems((prev) => [...prev, newCartItem]);
    showToast(`Added ${itemData.dish.name} (KSh ${itemData.itemTotal.toLocaleString()}) to tray`);
  };

  const handleQuickAdd = (dish: Dish) => {
    handleAddToCart({
      dish,
      quantity: 1,
      selectedSides: [],
      selectedAddons: [],
      selectedAdjustments: [],
      includeBeveragePairing: false,
      itemTotal: dish.price,
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const unitPrice = item.itemTotal / item.quantity;
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: Math.round(unitPrice * newQuantity),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearTray = () => {
    setCartItems([]);
  };

  // Order Placement
  const handleSubmitOrder = ({
    subtotal,
    tax,
    tipAmount,
    total,
    customerPhone,
    paymentMethod,
  }: {
    subtotal: number;
    tax: number;
    tipAmount: number;
    total: number;
    customerPhone?: string;
    paymentMethod: 'mpesa' | 'card' | 'cash';
  }) => {
    const updatedDiningDetails = {
      ...diningDetails,
      customerPhone,
      paymentMethod,
    };
    setDiningDetails(updatedDiningDetails);

    const placed: PlacedOrder = {
      orderId: `FF-${Date.now()}`,
      ticketNumber: `K-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diningDetails: updatedDiningDetails,
      items: [...cartItems],
      subtotal,
      tax,
      tipAmount,
      total,
      estimatedMinutes: Math.min(20, 7 + cartItems.length * 2),
      status: 'Received',
    };

    setRecentPlacedOrder(placed);
    // Persist to the last 5 device orders
    setRecentOrders((prev) => [placed, ...prev].slice(0, 5));
    setCartItems([]);
    setIsCartOpen(false);
  };

  // Re-order past meals from history
  const handleReorderItems = (items: CartItem[]) => {
    const clonedItems = items.map((item) => ({
      ...item,
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    }));
    setCartItems((prev) => [...prev, ...clonedItems]);
    setIsCartOpen(true);
    showToast(`Re-added ${items.length} items to your order tray`);
  };

  // Clear device order history
  const handleClearHistory = () => {
    setRecentOrders([]);
    localStorage.removeItem('sizzle_recent_orders_v1');
    showToast('Device order history cleared');
  };

  // Manager Actions
  const handleToggleAvailability = (dishId: string) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const handleUpdatePrice = (dishId: string, newPrice: number) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, price: newPrice } : d))
    );
  };

  const handleAddNewDish = (newDish: Dish) => {
    setDishes((prev) => [newDish, ...prev]);
    showToast(`Added ${newDish.name} to live menu`);
  };

  const handleResetMenu = () => {
    setDishes(INITIAL_MENU);
    localStorage.removeItem('sizzle_menu_v3');
    showToast('Reset menu to original items & drinks');
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId as any);
    if (sectionId === 'menu') {
      const el = document.getElementById('menu-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'combos') {
      const el = document.getElementById('combos');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'drinks') {
      const el = document.getElementById('drinks-lounge');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1217] text-[#f1ede4] flex flex-col font-sans">
      {/* Top Banner: Scan to order & Recent orders notification strip */}
      <div className="bg-[#181d26] border-b border-[#242b38] px-4 py-2 text-xs text-[#d6cfc3]">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-[#00a854]" />
            <span>
              Order on phone via QR Code · <strong className="text-[#f59e0b]">M-Pesa Express</strong>, Card, or Cash
            </span>
          </div>

          <div className="flex items-center gap-3">
            {recentOrders.length > 0 && (
              <button
                type="button"
                onClick={() => setIsRecentOrdersModalOpen(true)}
                className="flex items-center gap-1.5 text-[#c4bdaf] hover:text-[#f8f5ee] font-semibold text-xs transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Recent Orders ({recentOrders.length})</span>
              </button>
            )}
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="flex items-center gap-1.5 text-[#f59e0b] hover:text-[#fbbf24] font-bold text-xs uppercase tracking-wider"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show Table QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar Contract Compliant Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateSection={handleNavigateSection}
        onOpenManager={() => setIsManagerOpen(true)}
        onOpenScanToOrder={() => setIsScanModalOpen(true)}
        activeSection={activeSection}
      />

      {/* Hero Section */}
      <Hero
        diningDetails={diningDetails}
        onChangeDiningDetails={setDiningDetails}
        onExploreMenu={() => handleNavigateSection('menu')}
        onOpenScanModal={() => setIsScanModalOpen(true)}
      />

      {/* Fan Favorite Highlights */}
      <section id="specials-section" className="py-12 bg-[#12161f] border-b border-[#232936]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#f59e0b] font-bold mb-1">
                Tonight’s Top Picks
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#f8f5ee] font-bold">
                Smash Burgers, Crispy Chicken & Fresh Juices
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#a0988a]">
              <span>Prices in Kenyan Shillings (KSh)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fastFoodSpecials.slice(0, 4).map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onOpenDetails={setSelectedDishForModal}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Menu (Food & Drinks) */}
      <main id="menu-section" className="flex-1">
        {/* Category Tabs */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setActiveSection('menu');
          }}
          counts={categoryCounts}
        />

        {/* Filter & Search */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDietary={selectedDietary}
          onToggleDietary={(tag) =>
            setSelectedDietary((prev) =>
              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            )
          }
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFiltered={filteredDishes.length}
          onResetFilters={() => {
            setSearchQuery('');
            setSelectedDietary([]);
            setSortBy('default');
            setActiveCategory('all');
          }}
        />

        {/* Items Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Dedicated Sub-Filters for Food Platters Category */}
          {activeCategory === 'platters' && (
            <div className="mb-6 p-3 rounded-xl bg-[#141822] border border-[#272e3c] flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#a0988a] mr-1">
                Platter Format:
              </span>
              {[
                { id: 'all', label: 'All Platters' },
                { id: 'sharing', label: 'Sharing Boards (2–4 Diners)' },
                { id: 'family', label: 'Family Feasts (4–6+ Diners)' },
                { id: 'vegetarian', label: 'Vegetarian Sharing' },
                { id: 'individual', label: 'Individual Meal Plates' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setPlatterSubFilter(sub.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    platterSubFilter === sub.id
                      ? 'bg-[#f59e0b] text-[#0f1115] font-bold shadow-xs'
                      : 'bg-[#1b202c] text-[#a0988a] hover:text-[#f8f5ee] hover:bg-[#222938]'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          <div className="mb-6 flex items-center justify-between text-xs text-[#8a8376]">
            <div>
              Showing <span className="font-bold text-[#f8f5ee]">{filteredDishes.length}</span> items
              {activeCategory !== 'all' && (
                <span> in <span className="text-[#f59e0b] uppercase tracking-wider font-bold">{activeCategory}</span></span>
              )}
            </div>
            <div className="text-[11px] text-[#787265]">
              Tap any food or beverage item to customize options
            </div>
          </div>

          {filteredDishes.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#2b3344] rounded-2xl bg-[#141822]/60 p-8">
              <Utensils className="w-10 h-10 text-[#495163] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-[#ded8cb] mb-1">No Matching Items Found</h3>
              <p className="text-xs text-[#8a8376] max-w-sm mx-auto mb-4">
                We couldn't find any meals or drinks matching your current filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDietary([]);
                  setActiveCategory('all');
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#f59e0b] text-[#0f1115] hover:bg-[#d97706] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onOpenDetails={setSelectedDishForModal}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Value Combos Section */}
      <CombosSection
        comboDishes={comboDishes}
        onOpenDish={setSelectedDishForModal}
        onQuickAdd={handleQuickAdd}
      />

      {/* Drinks & Beverage Lounge Showcase */}
      <DrinksShowcaseSection
        dishes={dishes}
        onOpenDish={setSelectedDishForModal}
        onQuickAdd={handleQuickAdd}
      />

      {/* Footer with Recent Orders Section */}
      <Footer
        recentOrders={recentOrders}
        onOpenRecentOrders={() => setIsRecentOrdersModalOpen(true)}
        onSelectOrderForReceipt={(order) => setRecentPlacedOrder(order)}
      />

      {/* Dish Detail Modal */}
      <DishModal
        dish={selectedDishForModal}
        onClose={() => setSelectedDishForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Order Tray Slide-Over Drawer */}
      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        diningDetails={diningDetails}
        onChangeDiningDetails={setDiningDetails}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearTray={handleClearTray}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Scan to Order Modal */}
      <ScanToOrderModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        currentTable={diningDetails.tableNumber}
        onSelectTable={(table) => setDiningDetails({ ...diningDetails, tableNumber: table })}
      />

      {/* Recent Orders Modal (Last 5 orders) */}
      <RecentOrdersModal
        isOpen={isRecentOrdersModalOpen}
        onClose={() => setIsRecentOrdersModalOpen(false)}
        recentOrders={recentOrders}
        onSelectOrderForReceipt={(order) => setRecentPlacedOrder(order)}
        onReorderItems={handleReorderItems}
        onClearHistory={handleClearHistory}
      />

      {/* Order Success Ticket & Printable Receipt */}
      <OrderSuccessModal
        order={recentPlacedOrder}
        onClose={() => setRecentPlacedOrder(null)}
        onNewOrder={() => {
          setRecentPlacedOrder(null);
          handleNavigateSection('menu');
        }}
      />

      {/* Kitchen & Bar Manager */}
      <ManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        dishes={dishes}
        onToggleAvailability={handleToggleAvailability}
        onUpdatePrice={handleUpdatePrice}
        onAddNewDish={handleAddNewDish}
        onResetMenu={handleResetMenu}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171c26] border border-[#f59e0b]/50 text-[#f8f5ee] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-bounce">
          <div className="p-1 rounded-full bg-[#f59e0b] text-[#0f1115]">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
