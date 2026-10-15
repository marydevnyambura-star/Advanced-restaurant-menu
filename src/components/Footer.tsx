import React from 'react';
import { Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0e13] border-t border-[#1f242e] py-12 text-[#8e8779] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="text-lg font-serif text-[#f8f5ee] font-bold tracking-tight">
              Sizzle & Crisp Diner
            </div>
            <p className="text-xs text-[#a0988a] leading-relaxed">
              Kenya’s premier fast food joint for juicy smash burgers, 24-hr seasoned crispy chicken, peri-peri loaded fries, and authentic Nairobi smochas.
            </p>
          </div>

          {/* Location & Opening Hours */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#d8d2c4]">
              Hours of Service
            </div>
            <p className="text-[#a0988a]">Monday – Sunday: 10:00 AM – Midnight</p>
            <p className="text-[#a0988a]">Late Night Drive-Thru & Counter</p>
            <p className="text-[#736c61]">Westlands Mall & CBD Moi Avenue, Nairobi</p>
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

        <div className="pt-8 border-t border-[#1a1e27] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6d665a]">
          <div>
            © {new Date().getFullYear()} Sizzle & Crisp Diner Kenya. All prices quoted in Kenyan Shillings (KSh).
          </div>
          <div className="flex items-center gap-4">
            <span>Fast 10-Min Kitchen Dispatch</span>
            <span aria-hidden="true">·</span>
            <span>Scan to Order Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
