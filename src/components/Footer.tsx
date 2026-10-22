import React from 'react';
import { Smartphone, Clock, Receipt, Printer, ArrowRight } from 'lucide-react';
import { PlacedOrder } from '../types/menu';

interface FooterProps {
  recentOrders: PlacedOrder[];
  onOpenRecentOrders: () => void;
  onSelectOrderForReceipt: (order: PlacedOrder) => void;
}

export const Footer: React.FC<FooterProps> = ({
  recentOrders,
  onOpenRecentOrders,
  onSelectOrderForReceipt,
}) => {
  return (
    <footer className="bg-[#0b0e13] border-t border-[#1f242e] pt-12 pb-8 text-[#8e8779] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main 4-column restaurant information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="text-lg font-serif text-[#f8f5ee] font-bold tracking-tight">
              Sizzle & Crisp Diner
            </div>
            <p className="text-xs text-[#a0988a] leading-relaxed">
              Kenya’s premier fast food diner for juicy smash burgers, charcoal nyama choma, family sharing platters, crispy chicken, and artisan ice creams.
            </p>
          </div>

          {/* Location & Opening Hours */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#d8d2c4]">
              Hours & Location
            </div>
            <p className="text-[#a0988a]">Monday – Sunday: 10:00 AM – Midnight</p>
            <p className="text-[#a0988a]">Late Night Drive-Thru & Counter</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Moi+Avenue+Westlands+Nairobi+Kenya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f59e0b] hover:underline flex items-center gap-1 block"
              title="Open directions in Google Maps"
            >
              Westlands & Moi Ave, Nairobi ↗
            </a>
          </div>

          {/* Contact & Orders */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#d8d2c4]">
              Phone & Delivery
            </div>
            <p className="text-[#a0988a]">Direct Line: +254 700 123 456</p>
            <p className="text-[#a0988a]">WhatsApp Orders: +254 722 889 900</p>
            <p className="text-[#a0988a]">orders@sizzle-crisp.co.ke</p>
          </div>

          {/* Fast Kenyan Payments */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#d8d2c4]">
              Accepted Payments
            </div>
            <p className="text-[#a0988a] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#00a854]" />
              Lipa Na M-Pesa (Buy Goods Till 882910)
            </p>
            <p className="text-[#a0988a]">Visa, Mastercard, & Cash Accepted</p>
            <p className="text-[#736c61]">All poultry and beef are 100% Halal certified</p>
          </div>
        </div>

        {/* Dedicated Recent Orders Section in Footer */}
        <div className="p-5 rounded-2xl bg-[#12161f] border border-[#232936] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#f8f5ee]">
                Recent Orders On This Device ({recentOrders.length}/5 Logged)
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenRecentOrders}
              className="flex items-center gap-1.5 text-xs font-bold text-[#f59e0b] hover:text-[#fbbf24] transition-colors self-start sm:self-auto"
            >
              <span>{recentOrders.length > 0 ? 'Manage Order History' : 'View Order Log'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-[#7d776b]">
              No past orders logged on this device yet. Your last 5 orders will be saved here automatically so you can reprint receipts or re-order anytime.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {recentOrders.slice(0, 3).map((order) => (
                <div
                  key={order.orderId}
                  className="p-3 rounded-xl bg-[#181d26] border border-[#282f3d] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#f59e0b] text-xs">
                        #{order.ticketNumber}
                      </span>
                      <span className="text-[11px] text-[#8e8779] truncate">
                        · {order.diningDetails.tableNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#a0988a] truncate mt-0.5">
                      {order.items.length} items · <strong className="text-[#f8f5ee]">KSh {order.total.toLocaleString()}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectOrderForReceipt(order)}
                    className="p-2 rounded-lg bg-[#222938] hover:bg-[#2e374c] text-[#f59e0b] transition-colors shrink-0"
                    title="View & Print Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1a1e27] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6d665a]">
          <div>
            © {new Date().getFullYear()} Sizzle & Crisp Diner Kenya. All prices quoted in Kenyan Shillings (KSh).
          </div>
          <div className="flex items-center gap-4">
            <span>Fast 10-Min Kitchen Dispatch</span>
            <span aria-hidden="true">·</span>
            <span>Scan to Order Enabled</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenRecentOrders}
              className="text-[#8e8779] hover:text-[#f59e0b] transition-colors"
            >
              Order Log ({recentOrders.length})
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
