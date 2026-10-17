import React from 'react';
import { PlacedOrder, CartItem } from '../types/menu';
import { X, Clock, Receipt, RotateCcw, Trash2, Printer, CheckCircle2, ShoppingBag, Utensils } from 'lucide-react';

interface RecentOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: PlacedOrder[];
  onSelectOrderForReceipt: (order: PlacedOrder) => void;
  onReorderItems: (items: CartItem[]) => void;
  onClearHistory: () => void;
}

export const RecentOrdersModal: React.FC<RecentOrdersModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
  onSelectOrderForReceipt,
  onReorderItems,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#141822] border border-[#2d3545] rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#252b38] flex items-center justify-between bg-[#101319]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#f8f5ee]">
                Recent Orders on this Device
              </h2>
              <p className="text-xs text-[#8e8779]">
                Log of your last {Math.min(5, Math.max(recentOrders.length, 1))} orders saved in local storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close recent orders modal"
            className="p-1.5 rounded-lg text-[#8e8779] hover:text-[#f8f5ee] hover:bg-[#1f2533] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {recentOrders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Utensils className="w-12 h-12 text-[#353d4f] mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#ded8cb]">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-[#827c70] max-w-sm mx-auto">
                Once you order smash burgers, crispy chicken, or drinks from your table or phone, your receipt history will be securely logged here.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#f59e0b] text-[#0f1115] hover:bg-[#d97706] transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div
                  key={order.orderId}
                  className="bg-[#181d26] border border-[#28303f] hover:border-[#3d475a] rounded-2xl p-4 sm:p-5 transition-all shadow-sm space-y-3"
                >
                  {/* Top row: Ticket #, Date, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#232938]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#f59e0b] font-mono bg-[#101319] px-2.5 py-1 rounded-lg border border-[#f59e0b]/30">
                        Ticket #{order.ticketNumber}
                      </span>
                      <span className="text-xs text-[#a0988a]">
                        {order.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#c4bdaf] font-medium">
                        {order.diningDetails.tableNumber}
                      </span>
                      <span aria-hidden="true" className="text-[#495163]">·</span>
                      <span className="uppercase text-[11px] font-semibold text-[#8e8779] bg-[#11141c] px-2 py-0.5 rounded">
                        {order.diningDetails.paymentMethod === 'mpesa' ? 'M-Pesa' : order.diningDetails.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1.5 text-xs">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-[#c4bdaf]">
                        <span className="truncate pr-2">
                          {item.quantity}x {item.dish.name}
                          {item.selectedSpiceLevel && (
                            <span className="text-[#8e8779] text-[11px] ml-1">({item.selectedSpiceLevel})</span>
                          )}
                        </span>
                        <span className="font-mono tabular-nums text-[#ded8cc] shrink-0">
                          KSh {item.itemTotal.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row: Total & Action Buttons */}
                  <div className="pt-3 border-t border-[#232938] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-[#8e8779]">Total:</span>
                      <span className="font-mono tabular-nums text-base font-bold text-[#f59e0b]">
                        KSh {order.total.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectOrderForReceipt(order);
                          onClose();
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222938] hover:bg-[#2d364a] text-[#f8f5ee] text-xs font-semibold transition-colors border border-[#343d52]"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#f59e0b]" />
                        <span>View / Print Receipt</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onReorderItems(order.items);
                          onClose();
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] text-xs font-bold transition-colors shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Re-Order Meals</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Clear History Option */}
        <div className="p-4 border-t border-[#252b38] bg-[#101319] flex items-center justify-between">
          {recentOrders.length > 0 ? (
            <button
              type="button"
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-[#8e8779] hover:text-[#f87171] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Order Log</span>
            </button>
          ) : (
            <div className="text-xs text-[#8e8779]">Logged locally on this device</div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1f2533] hover:bg-[#2b3344] text-[#f8f5ee] font-medium text-xs tracking-wider transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
