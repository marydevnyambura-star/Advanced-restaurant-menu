import React from 'react';
import heroImg from '../assets/images/hero_fast_food_spread_1792063965751.jpg';
import { DiningDetails } from '../types/menu';
import { Clock, MapPin, Users, QrCode, Zap, Smartphone } from 'lucide-react';

interface HeroProps {
  diningDetails: DiningDetails;
  onChangeDiningDetails: (details: DiningDetails) => void;
  onExploreMenu: () => void;
  onOpenScanModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  diningDetails,
  onChangeDiningDetails,
  onExploreMenu,
  onOpenScanModal,
}) => {
  const tableNumbers = ['Table 01', 'Table 02', 'Table 04', 'Table 07', 'Table 10', 'Table 14', 'Terrace 02', 'Express Counter'];

  return (
    <section className="relative overflow-hidden border-b border-[#252b36] bg-[#12151c]">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Freshly prepared fast food meal spread with smash burgers, fried chicken and fries"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1217] via-[#0f1217]/80 to-[#0f1217]/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs tracking-[0.2em] uppercase text-[#f59e0b] font-bold">
              Fast Food Kitchen · Fresh Daily
            </span>
            <span aria-hidden="true" className="text-[#495163]">·</span>
            <span className="text-xs text-[#a39c8e]">100% Halal Certified</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#fbf8f2] leading-[1.12] mb-4">
            Juicy smash burgers, crispy chicken, and loaded fries.
          </h1>

          <p className="text-base sm:text-lg text-[#b8b0a2] leading-relaxed mb-6 max-w-2xl">
            Order directly from your table in Kenyan Shillings. Enjoy freshly fried chicken buckets, authentic Nairobi smochas, and ice-cold shakes with instant M-Pesa or card checkout.
          </p>

          {/* Adjacency & Provenance Info */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#a0988a] mb-8 pb-5 border-b border-[#292f3d]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#f59e0b]" />
              Westlands / Moi Ave, Nairobi
            </span>
            <span aria-hidden="true" className="text-[#444a56]">·</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
              Average Prep: 8–12 Minutes
            </span>
            <span aria-hidden="true" className="text-[#444a56]">·</span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#f59e0b]" />
              Pay via M-Pesa Express, Card, or Cash
            </span>
          </div>

          {/* Fast Food Dining Mode & Scan To Order Bar */}
          <div className="bg-[#181d26]/95 backdrop-blur border border-[#2b3342] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Service Mode Selector */}
              <div className="flex items-center gap-1 p-1 bg-[#0f1217] rounded-xl border border-[#252b36]">
                <button
                  type="button"
                  onClick={() => onChangeDiningDetails({ ...diningDetails, serviceMode: 'dine-in' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    diningDetails.serviceMode === 'dine-in'
                      ? 'bg-[#f59e0b] text-[#0f1115]'
                      : 'text-[#9c9589] hover:text-[#f8f5ee]'
                  }`}
                >
                  Table Dine-In
                </button>
                <button
                  type="button"
                  onClick={() => onChangeDiningDetails({ ...diningDetails, serviceMode: 'takeout' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    diningDetails.serviceMode === 'takeout'
                      ? 'bg-[#f59e0b] text-[#0f1115]'
                      : 'text-[#9c9589] hover:text-[#f8f5ee]'
                  }`}
                >
                  Takeaway Box
                </button>
                <button
                  type="button"
                  onClick={() => onChangeDiningDetails({ ...diningDetails, serviceMode: 'curbside' })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    diningDetails.serviceMode === 'curbside'
                      ? 'bg-[#f59e0b] text-[#0f1115]'
                      : 'text-[#9c9589] hover:text-[#f8f5ee]'
                  }`}
                >
                  Express Pickup
                </button>
              </div>

              {/* Table / Guests */}
              {diningDetails.serviceMode === 'dine-in' ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor="table-select" className="text-xs text-[#a39c8e] whitespace-nowrap">
                      Your Table:
                    </label>
                    <select
                      id="table-select"
                      value={diningDetails.tableNumber}
                      onChange={(e) => onChangeDiningDetails({ ...diningDetails, tableNumber: e.target.value })}
                      className="bg-[#0f1217] border border-[#2c3444] text-[#f8f5ee] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#f59e0b] cursor-pointer"
                    >
                      {tableNumbers.map((table) => (
                        <option key={table} value={table}>
                          {table}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#a39c8e]" />
                    <select
                      aria-label="Party size"
                      value={diningDetails.guestCount}
                      onChange={(e) => onChangeDiningDetails({ ...diningDetails, guestCount: Number(e.target.value) })}
                      className="bg-[#0f1217] border border-[#2c3444] text-[#f8f5ee] text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#f59e0b] cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#a8a192]">
                  Order ready at counter in approx <strong className="text-[#f8f5ee]">10 minutes</strong>
                </div>
              )}

              {/* Action Buttons: Scan on Phone + Browse Menu */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenScanModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#222936] hover:bg-[#2d3647] text-[#f59e0b] border border-[#f59e0b]/40 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 shadow-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan to Order on Phone</span>
                </button>
                <button
                  type="button"
                  onClick={onExploreMenu}
                  className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 shadow-md"
                >
                  View Fast Food Menu ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
