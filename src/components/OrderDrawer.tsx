import React, { useState } from 'react';
import { CartItem, DiningDetails } from '../types/menu';
import { X, Trash2, Plus, Minus, Users, ReceiptText, Utensils, Check, Smartphone, CreditCard, Banknote } from 'lucide-react';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  diningDetails: DiningDetails;
  onChangeDiningDetails: (details: DiningDetails) => void;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearTray: () => void;
  onSubmitOrder: (orderPayload: {
    tipAmount: number;
    tax: number;
    subtotal: number;
    total: number;
    customerPhone?: string;
    paymentMethod: 'mpesa' | 'card' | 'cash';
  }) => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  items,
  diningDetails,
  onChangeDiningDetails,
  onUpdateQuantity,
  onRemoveItem,
  onClearTray,
  onSubmitOrder,
}) => {
  const [selectedTip, setSelectedTip] = useState<number>(100); // KSh 100
  const [customTip, setCustomTip] = useState<string>('');
  const [splitCount, setSplitCount] = useState<number>(diningDetails.guestCount || 2);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cash'>(diningDetails.paymentMethod || 'mpesa');
  const [phone, setPhone] = useState<string>(diningDetails.customerPhone || '0712345678');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.itemTotal, 0);
  // 16% VAT is standard in Kenya, typically included or added
  const tax = Math.round(subtotal * 0.16);
  const tipAmount = customTip !== '' ? Number(customTip) || 0 : selectedTip;
  const total = subtotal + tax + tipAmount;
  const perPersonAmount = splitCount > 0 ? Math.round(total / splitCount) : total;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    onSubmitOrder({
      subtotal,
      tax,
      tipAmount,
      total,
      customerPhone: phone,
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-lg bg-[#13161e] border-l border-[#262c3a] h-full flex flex-col shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#252b38] flex items-center justify-between bg-[#101319]">
          <div className="flex items-center gap-2.5">
            <ReceiptText className="w-5 h-5 text-[#f59e0b]" />
            <div>
              <h2 className="text-base font-serif font-bold text-[#f8f5ee]">
                Fast Food Order Tray
              </h2>
              <div className="text-xs text-[#8e8779]">
                {diningDetails.serviceMode === 'dine-in'
                  ? `${diningDetails.tableNumber} · ${diningDetails.guestCount} Diners`
                  : `${diningDetails.serviceMode.toUpperCase()} Order`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearTray}
                className="text-xs text-[#a0988a] hover:text-[#f87171] px-2 py-1 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close order tray"
              className="p-1.5 rounded-lg text-[#8e8779] hover:text-[#f8f5ee] hover:bg-[#1f2532] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <Utensils className="w-12 h-12 text-[#323947] mb-3" />
              <h3 className="font-serif text-lg text-[#d8d2c4] mb-1">Your Tray is Empty</h3>
              <p className="text-xs text-[#827c70] max-w-xs mb-6">
                Add juicy smash burgers, crispy chicken buckets, or a fresh Nairobi smocha to begin!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#f59e0b] text-[#0f1115] hover:bg-[#d97706] transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Itemized Meal List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#a0988a]">
                  Selected Items ({items.length})
                </div>

                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-xl bg-[#181c25] border border-[#272e3d] space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-serif font-bold text-[#f8f5ee]">
                          {item.dish.name}
                        </h4>

                        {/* Modifiers display */}
                        <div className="text-[11px] text-[#9c9588] space-y-0.5 mt-1">
                          {item.selectedPortionSize && (
                            <div>Portion: <span className="text-[#f59e0b] font-medium">{item.selectedPortionSize.name}</span></div>
                          )}
                          {item.selectedAccompaniment && (
                            <div>Accompaniment: <span className="text-[#34d399] font-medium">{item.selectedAccompaniment.name}</span></div>
                          )}
                          {item.selectedScoopCount && (
                            <div>Scoops: <span className="text-[#ded8cc]">{item.selectedScoopCount.name}</span></div>
                          )}
                          {item.selectedFlavors && item.selectedFlavors.length > 0 && (
                            <div>Flavors: <span className="text-[#fcd34d]">{item.selectedFlavors.join(', ')}</span></div>
                          )}
                          {item.selectedSauceToppings && item.selectedSauceToppings.length > 0 && (
                            <div>Toppings: <span className="text-[#ded8cc]">{item.selectedSauceToppings.map(t => t.name).join(', ')}</span></div>
                          )}
                          {item.selectedSpiceLevel && (
                            <div>Spice: <span className="text-[#f59e0b] font-medium">{item.selectedSpiceLevel}</span></div>
                          )}
                          {item.selectedDrink && (
                            <div>Drink: <span className="text-[#ded8cc]">{item.selectedDrink}</span></div>
                          )}
                          {item.selectedAddons.length > 0 && (
                            <div>
                              Toppings: <span className="text-[#ded8cc]">{item.selectedAddons.map(a => `${a.name} (+KSh ${a.price})`).join(', ')}</span>
                            </div>
                          )}
                          {item.selectedSides.length > 0 && (
                            <div>
                              Sides: <span className="text-[#ded8cc]">{item.selectedSides.map(s => `${s.name} (+KSh ${s.price})`).join(', ')}</span>
                            </div>
                          )}
                          {item.includeBeveragePairing && item.dish.beveragePairing && (
                            <div className="text-[#f59e0b] font-medium pt-0.5">
                              Drink: {item.dish.beveragePairing.name} (+KSh {item.dish.beveragePairing.price})
                            </div>
                          )}
                          {item.specialInstructions && (
                            <div className="italic text-[#7d776b] pt-0.5">"{item.specialInstructions}"</div>
                          )}
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => onRemoveItem(item.cartItemId)}
                        aria-label="Remove item"
                        className="text-[#6d665a] hover:text-[#f87171] p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom row with stepper & KSh subtotal */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#232938]">
                      <div className="flex items-center bg-[#101319] border border-[#272e3d] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 text-[#8e8779] hover:text-[#f8f5ee]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums font-bold text-[#f8f5ee]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 text-[#8e8779] hover:text-[#f8f5ee]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-mono tabular-nums text-sm font-bold text-[#f8f5ee]">
                        KSh {item.itemTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kenyan Payment Selection (M-Pesa, Card, Cash) */}
              <div className="p-3.5 rounded-xl bg-[#161a24] border border-[#262c3b] space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#d8d2c4]">
                  Payment Method (Kenyan Shillings)
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1 border transition-colors ${
                      paymentMethod === 'mpesa'
                        ? 'bg-[#008542]/20 border-[#00a854] text-[#48db88]'
                        : 'bg-[#181c25] border-[#272e3d] text-[#8e8779] hover:text-[#f8f5ee]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#00a854]" />
                    <span className="text-[11px] font-bold">M-Pesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1 border transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d]'
                        : 'bg-[#181c25] border-[#272e3d] text-[#8e8779] hover:text-[#f8f5ee]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl flex flex-col items-center gap-1 border transition-colors ${
                      paymentMethod === 'cash'
                        ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fcd34d]'
                        : 'bg-[#181c25] border-[#272e3d] text-[#8e8779] hover:text-[#f8f5ee]'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Cash</span>
                  </button>
                </div>

                {paymentMethod === 'mpesa' && (
                  <div className="pt-2 border-t border-[#232938]">
                    <label htmlFor="mpesa-phone" className="block text-[11px] text-[#a0988a] mb-1">
                      M-Pesa Mobile Number (for instant STK push prompt):
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#a0988a] bg-[#101319] px-2 py-1.5 rounded-lg border border-[#2a3140]">
                        +254
                      </span>
                      <input
                        id="mpesa-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="712 345 678"
                        className="flex-1 bg-[#101319] border border-[#2a3140] rounded-lg px-2.5 py-1.5 text-xs text-[#f8f5ee] font-mono focus:border-[#00a854] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Kitchen Tip (in KSh) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#a0988a]">
                  <span className="font-bold uppercase tracking-wider">Kitchen & Crew Tip</span>
                  <span className="font-mono tabular-nums text-[#f59e0b] font-bold">KSh {tipAmount.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[50, 100, 150, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedTip(amt);
                        setCustomTip('');
                      }}
                      className={`py-1.5 text-xs rounded-lg font-mono tabular-nums transition-colors border ${
                        selectedTip === amt && customTip === ''
                          ? 'bg-[#f59e0b] text-[#0f1115] border-[#f59e0b] font-bold'
                          : 'bg-[#181c25] text-[#a0988a] border-[#29303e] hover:border-[#3e4758]'
                      }`}
                    >
                      {amt}/=
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTip(0);
                      setCustomTip('0');
                    }}
                    className={`py-1.5 text-xs rounded-lg transition-colors border ${
                      customTip === '0'
                        ? 'bg-[#f59e0b] text-[#0f1115] border-[#f59e0b] font-bold'
                        : 'bg-[#181c25] text-[#a0988a] border-[#29303e] hover:border-[#3e4758]'
                    }`}
                  >
                    None
                  </button>
                </div>
              </div>

              {/* Split Bill Calculator */}
              <div className="p-3.5 rounded-xl bg-[#161a24] border border-[#272e3d] space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsSplitMode(!isSplitMode)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      isSplitMode ? 'bg-[#f59e0b] text-[#0f1115]' : 'bg-[#1f2532] text-[#a0988a] hover:text-[#f8f5ee]'
                    }`}
                  >
                    {isSplitMode ? 'Bill Split Active' : 'Calculate Bill Split (KSh)'}
                  </button>

                  {isSplitMode && (
                    <div className="flex items-center gap-1.5 text-xs text-[#a0988a]">
                      <span>Split by:</span>
                      <select
                        aria-label="Split diners count"
                        value={splitCount}
                        onChange={(e) => setSplitCount(Number(e.target.value))}
                        className="bg-[#101319] border border-[#2e3646] text-[#f8f5ee] rounded px-2 py-0.5"
                      >
                        {[2, 3, 4, 5, 6, 8].map(n => (
                          <option key={n} value={n}>{n} People</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {isSplitMode && (
                  <div className="pt-2 border-t border-[#232938] flex items-center justify-between text-xs">
                    <span className="text-[#c4bdaf]">Each Person Pays:</span>
                    <span className="font-mono tabular-nums text-base font-bold text-[#f59e0b]">
                      KSh {perPersonAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Tabular Financial Breakdown in KSh */}
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex items-center justify-between text-[#8e8779]">
                  <span>Items Subtotal</span>
                  <span className="font-mono tabular-nums">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#8e8779]">
                  <span>VAT (16% Included)</span>
                  <span className="font-mono tabular-nums">KSh {tax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#8e8779]">
                  <span>Crew Tip</span>
                  <span className="font-mono tabular-nums">KSh {tipAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-[#f8f5ee] pt-2 border-t border-[#262c3a]">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-xl text-[#f59e0b]">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout CTA */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#252b38] bg-[#101319]">
            <button
              onClick={handlePlaceOrder}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-bold text-xs tracking-wider uppercase transition-colors shadow-xl"
            >
              <span>Confirm & Send to Kitchen</span>
              <span className="font-mono tabular-nums text-base font-extrabold">
                KSh {total.toLocaleString()}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
