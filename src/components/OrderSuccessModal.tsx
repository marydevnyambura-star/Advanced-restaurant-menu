import React from 'react';
import { PlacedOrder } from '../types/menu';
import { CheckCircle2, Clock, Smartphone, Printer } from 'lucide-react';

interface OrderSuccessModalProps {
  order: PlacedOrder | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onNewOrder,
}) => {
  if (!order) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  const todayDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      {/* On-Screen Interactive Modal (Hidden during printing via CSS) */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
        <div
          className="w-full max-w-lg bg-[#141822] border border-[#2d3545] rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-left animate-fadeIn my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#1b3323] text-[#48db88] border border-[#225435]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[#f59e0b] font-bold">
                Fast Food Order Confirmed!
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#f8f5ee]">
                Order Ticket #{order.ticketNumber}
              </h2>
            </div>
          </div>

          {/* M-Pesa Notice if chosen */}
          {order.diningDetails.paymentMethod === 'mpesa' && (
            <div className="p-3.5 rounded-xl bg-[#0d2a1a] border border-[#1b6b3e] text-xs text-[#dcfce7] flex items-start gap-2.5">
              <Smartphone className="w-4 h-4 text-[#48db88] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">M-Pesa STK Prompt Sent:</span> Please check your phone (+254 {order.diningDetails.customerPhone || '...'}) and enter your M-Pesa PIN to finalize payment of{' '}
                <strong className="font-mono tabular-nums text-[#48db88]">KSh {order.total.toLocaleString()}</strong>.
              </div>
            </div>
          )}

          {/* Kitchen Status Tracker */}
          <div className="p-4 rounded-xl bg-[#191f2b] border border-[#2b3342] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a0988a]">Estimated Cooking Time</span>
              <span className="flex items-center gap-1 font-bold text-[#f8f5ee]">
                <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
                ~{order.estimatedMinutes} Minutes
              </span>
            </div>

            {/* 4 Progression Steps */}
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              {[
                { label: 'Received', done: true },
                { label: 'On Grill / Fryer', done: true },
                { label: 'Packing', done: false },
                { label: 'Serving', done: false }
              ].map((step) => (
                <div key={step.label} className="text-center">
                  <div
                    className={`h-1.5 rounded-full mb-1.5 ${
                      step.done ? 'bg-[#f59e0b]' : 'bg-[#28303f]'
                    }`}
                  />
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${step.done ? 'text-[#f5efe6]' : 'text-[#615a4e]'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Screen Summary */}
          <div className="space-y-2 text-xs border-t border-[#262d3c] pt-4">
            <div className="flex justify-between text-[#8e8779]">
              <span>Dining Location</span>
              <span className="text-[#f8f5ee] font-medium">
                {order.diningDetails.tableNumber} ({order.diningDetails.guestCount} Diners)
              </span>
            </div>
            <div className="flex justify-between text-[#8e8779]">
              <span>Timestamp</span>
              <span className="text-[#f8f5ee] font-mono tabular-nums">{order.timestamp}</span>
            </div>
            <div className="flex justify-between text-[#8e8779]">
              <span>Payment Type</span>
              <span className="text-[#f8f5ee] uppercase font-semibold">
                {order.diningDetails.paymentMethod === 'mpesa' ? 'M-Pesa Express' : order.diningDetails.paymentMethod}
              </span>
            </div>

            <div className="pt-2 border-t border-[#232a39] space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#c4bdaf]">
                  <span>{item.quantity}x {item.dish.name}</span>
                  <span className="font-mono tabular-nums">KSh {item.itemTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-bold text-[#f8f5ee] pt-2 border-t border-[#262d3c]">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums text-[#f59e0b] text-base font-extrabold">
                KSh {order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons: Print Receipt, Order More, Done */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={handlePrintReceipt}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#222938] hover:bg-[#2d364a] text-[#f59e0b] border border-[#f59e0b]/40 font-bold text-xs tracking-wider uppercase transition-colors text-center"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={onNewOrder}
              className="flex-1 py-3 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-bold text-xs tracking-wider uppercase transition-colors text-center"
            >
              Order More
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-[#1f2533] hover:bg-[#2b3344] text-[#f8f5ee] font-medium text-xs tracking-wider transition-colors text-center"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Printer-Friendly Receipt (Visible only during print via CSS media queries) */}
      <div id="printable-receipt" className="hidden print:block text-black font-mono text-xs leading-relaxed">
        {/* Receipt Header */}
        <div className="text-center pb-3 border-b border-dashed border-black">
          <div className="text-base font-bold tracking-wider">SIZZLE & CRISP DINER</div>
          <div className="text-[11px]">Nairobi Central & Westlands Branches</div>
          <div className="text-[11px]">Tel: +254 700 123 456</div>
          <div className="text-[11px]">Lipa Na M-Pesa Till: 882910</div>
          <div className="text-[11px]">VAT Reg: P051284920K</div>
        </div>

        {/* Order Details Header */}
        <div className="py-2.5 border-b border-dashed border-black space-y-1">
          <div className="flex justify-between font-bold text-sm">
            <span>ORDER TICKET:</span>
            <span>#{order.ticketNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time:</span>
            <span>{todayDate} · {order.timestamp}</span>
          </div>
          <div className="flex justify-between">
            <span>Table:</span>
            <span>{order.diningDetails.tableNumber} ({order.diningDetails.guestCount} Diners)</span>
          </div>
          <div className="flex justify-between">
            <span>Service Mode:</span>
            <span className="uppercase">{order.diningDetails.serviceMode}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="uppercase font-semibold">{order.diningDetails.paymentMethod}</span>
          </div>
        </div>

        {/* Column Headers */}
        <div className="py-2 border-b border-black flex justify-between font-bold text-[11px]">
          <span className="w-7/12">ITEM</span>
          <span className="w-2/12 text-center">QTY</span>
          <span className="w-3/12 text-right">AMOUNT</span>
        </div>

        {/* Itemized Rows */}
        <div className="py-2.5 border-b border-dashed border-black space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between font-bold">
                <span className="w-7/12 truncate">{item.dish.name}</span>
                <span className="w-2/12 text-center">{item.quantity}</span>
                <span className="w-3/12 text-right">KSh {item.itemTotal.toLocaleString()}</span>
              </div>
              {/* Modifiers & Notes */}
              {(item.selectedPortionSize || item.selectedAccompaniment || item.selectedScoopCount || item.selectedSpiceLevel || item.selectedDrink || item.selectedSides.length > 0 || item.selectedAddons.length > 0 || (item.selectedFlavors && item.selectedFlavors.length > 0)) && (
                <div className="text-[10px] text-gray-700 pl-2">
                  {item.selectedPortionSize && `• Portion: ${item.selectedPortionSize.name} `}
                  {item.selectedAccompaniment && `• Side: ${item.selectedAccompaniment.name} `}
                  {item.selectedScoopCount && `• Scoops: ${item.selectedScoopCount.name} `}
                  {item.selectedFlavors && item.selectedFlavors.length > 0 && `• Flavors: ${item.selectedFlavors.join(', ')} `}
                  {item.selectedSpiceLevel && `• Spice: ${item.selectedSpiceLevel} `}
                  {item.selectedDrink && `• Drink: ${item.selectedDrink} `}
                  {item.selectedSides.map(s => `• Side: ${s.name} `)}
                  {item.selectedAddons.map(a => `• Add: ${a.name} `)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div className="py-2.5 border-b border-black space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>KSh {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (16% Included):</span>
            <span>KSh {order.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Crew Gratuity:</span>
            <span>KSh {order.tipAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-dashed border-black">
            <span>TOTAL PAID:</span>
            <span>KSh {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 text-center space-y-1 text-[11px]">
          <div className="font-bold">STATUS: PAID & SENT TO GRILL</div>
          <div>Estimated Kitchen Prep: ~{order.estimatedMinutes} Mins</div>
          <div className="pt-2 text-[10px] italic">Thank you for dining with Sizzle & Crisp!</div>
          <div className="text-[10px] font-bold">KARIBU TENA</div>
        </div>
      </div>
    </>
  );
};
