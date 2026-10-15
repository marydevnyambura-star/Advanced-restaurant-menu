import React from 'react';
import { ShoppingBag, QrCode } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenManager: () => void;
  onOpenScanToOrder: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onNavigateSection,
  onOpenManager,
  onOpenScanToOrder,
  activeSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f1217]/95 backdrop-blur-md border-b border-[#252b36] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#menu"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('menu');
          }}
          className="text-2xl font-serif font-bold tracking-tight text-[#f8f5ee] hover:text-[#f59e0b] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>Sizzle & Crisp Diner</span>
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#a8a192]">
          <button
            onClick={() => onNavigateSection('menu')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeSection === 'menu'
                ? 'text-[#f8f5ee] border-[#f59e0b]'
                : 'border-transparent hover:text-[#f8f5ee] hover:border-[#424855]'
            }`}
          >
            Fast Food
          </button>
          <button
            onClick={() => onNavigateSection('combos')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeSection === 'combos'
                ? 'text-[#f8f5ee] border-[#f59e0b]'
                : 'border-transparent hover:text-[#f8f5ee] hover:border-[#424855]'
            }`}
          >
            Value Combos
          </button>
          <button
            onClick={() => onNavigateSection('drinks')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeSection === 'drinks'
                ? 'text-[#f8f5ee] border-[#f59e0b]'
                : 'border-transparent hover:text-[#f8f5ee] hover:border-[#424855]'
            }`}
          >
            Drinks & Bar
          </button>
          <button
            onClick={onOpenScanToOrder}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 border-transparent text-[#f59e0b] hover:text-[#fbbf24] hover:border-[#f59e0b]"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan To Order</span>
          </button>
          <button
            onClick={onOpenManager}
            className="transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 border-transparent text-[#a8a192] hover:text-[#f8f5ee] hover:border-[#424855]"
          >
            Kitchen Manager
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenScanToOrder}
            className="md:hidden flex items-center gap-1 p-2 rounded-lg bg-[#1a1f29] border border-[#2d3444] text-[#f59e0b] hover:bg-[#252c3a] transition-colors"
            title="Scan to order on phone"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCart}
            aria-label={`View order tray containing ${cartCount} items`}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]/50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Order Tray</span>
            <span className="sm:hidden">Tray</span>
            {cartCount > 0 && (
              <span className="font-mono tabular-nums bg-[#0f1115]/20 px-1.5 py-0.5 rounded text-[11px] font-bold">
                {cartCount} · KSh {cartTotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
