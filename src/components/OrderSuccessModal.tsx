import React from 'react';
import { PlacedOrder } from '../types/menu';
import { CheckCircle2, Clock, Smartphone, ReceiptText, Utensils } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
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

        {/* Itemized Receipt in KSh */}
        <div className="space-y-2 text-xs border-t border-[#262d3c] pt-4">
          <div className="flex justify-between text-[#8e8779]">
            <span>Location</span>
            <span className="text-[#f8f5ee] font-medium">
              {order.diningDetails.tableNumber} ({order.diningDetails.guestCount} Diners)
            </span>
          </div>
          <div className="flex justify-between text-[#8e8779]">
            <span>Time</span>
            <span className="text-[#f8f5ee] font-mono tabular-nums">{order.timestamp}</span>
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

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onNewOrder}
            className="flex-1 py-3 px-4 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-bold text-xs tracking-wider uppercase transition-colors text-center"
          >
            Order More Fast Food
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-[#1f2533] hover:bg-[#2b3344] text-[#f8f5ee] font-medium text-xs tracking-wider transition-colors text-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
