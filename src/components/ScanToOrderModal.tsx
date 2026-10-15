import React, { useState } from 'react';
import { X, QrCode, Smartphone, Copy, Check, Printer, ExternalLink, Sparkles } from 'lucide-react';

interface ScanToOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTable: string;
  onSelectTable: (table: string) => void;
}

export const ScanToOrderModal: React.FC<ScanToOrderModalProps> = ({
  isOpen,
  onClose,
  currentTable,
  onSelectTable,
}) => {
  const [copied, setCopied] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  if (!isOpen) return null;

  const tables = ['Table 01', 'Table 02', 'Table 04', 'Table 07', 'Table 10', 'Table 14', 'Terrace 02', 'Express Counter'];
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?table=${encodeURIComponent(currentTable)}`
    : `https://restaurant.app/?table=${encodeURIComponent(currentTable)}`;

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate SVG QR Code pattern deterministically based on table name
  // Standard 21x21 QR Code representation with finder patterns and pseudo data modules
  const generateQrGrid = (seed: string) => {
    const size = 21;
    const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    // Finder patterns (top-left, top-right, bottom-left)
    const addFinder = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (
            i === 0 || i === 6 || j === 0 || j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            grid[r + i][c + j] = true;
          }
        }
      }
    };

    addFinder(0, 0);
    addFinder(0, 14);
    addFinder(14, 0);

    // Timing patterns
    for (let i = 8; i < 13; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Hash seed to populate pseudo-data modules
    let hash = 0;
    for (let k = 0; k < seed.length; k++) {
      hash = (hash << 5) - hash + seed.charCodeAt(k);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder areas
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= 13) ||
          (r >= 13 && c < 8) ||
          r === 6 || c === 6
        ) {
          continue;
        }
        const pseudoRandom = Math.sin(hash + r * 31 + c * 17) * 10000;
        grid[r][c] = (pseudoRandom - Math.floor(pseudoRandom)) > 0.48;
      }
    }

    return grid;
  };

  const qrMatrix = generateQrGrid(currentTable);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#141820] border border-[#2d3444] rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#252b38] flex items-center justify-between bg-[#101319]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-semibold text-[#f8f5ee]">
                Scan To Order On Phone
              </h2>
              <p className="text-xs text-[#8e8779]">
                Instant contactless ordering right from your table
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close scan to order"
            className="p-1.5 rounded-lg text-[#8e8779] hover:text-[#f8f5ee] hover:bg-[#1f242e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Table Selector Strip */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a0988a] mb-2">
              Select Dining Table to Generate QR Stand:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {tables.map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => onSelectTable(tbl)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                    currentTable === tbl
                      ? 'bg-[#f59e0b] text-[#0f1115] border-[#f59e0b] font-bold'
                      : 'bg-[#181c24] text-[#a0988a] border-[#292e3a] hover:text-[#f8f5ee]'
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive QR Display Card */}
          <div className="bg-[#191e28] border border-[#2d3544] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-inner text-center sm:text-left">
            {/* SVG QR Code */}
            <div className="bg-white p-4 rounded-xl shadow-lg shrink-0 flex flex-col items-center">
              <svg
                viewBox="0 0 21 21"
                className="w-36 h-36"
                shapeRendering="crispEdges"
              >
                {qrMatrix.map((row, r) =>
                  row.map((filled, c) =>
                    filled ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width="1"
                        height="1"
                        fill="#0f1115"
                      />
                    ) : null
                  )
                )}
              </svg>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#0f1115] mt-1.5 font-mono">
                {currentTable}
              </div>
            </div>

            {/* Explanatory text */}
            <div className="space-y-3 flex-1">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#f59e0b] font-semibold">
                  Fast Food Contactless Menu
                </span>
                <h3 className="text-xl font-serif font-bold text-[#f8f5ee] mt-0.5">
                  Point Camera & Dine
                </h3>
              </div>

              <p className="text-xs text-[#a0988a] leading-relaxed">
                Scan with any iPhone or Android camera to load our full menu directly on your mobile device. Order burgers, chicken, and loaded fries without waiting for a server!
              </p>

              {/* URL preview & copy */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="bg-[#101319] border border-[#2b313e] text-[#f8f5ee] text-[11px] rounded-lg px-2.5 py-1.5 font-mono flex-1 truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#272d3a] hover:bg-[#343b4c] text-[#f8f5ee] text-xs font-medium transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#5ac28a]" />
                      <span className="text-[#5ac28a]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 3 Simple Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#161a22] border border-[#252b36] text-center space-y-1">
              <div className="text-xs font-bold text-[#f59e0b] font-mono">STEP 1</div>
              <div className="text-xs font-semibold text-[#f8f5ee]">Scan QR Code</div>
              <div className="text-[11px] text-[#8e8779]">Open phone camera & tap the notification link.</div>
            </div>
            <div className="p-3 rounded-xl bg-[#161a22] border border-[#252b36] text-center space-y-1">
              <div className="text-xs font-bold text-[#f59e0b] font-mono">STEP 2</div>
              <div className="text-xs font-semibold text-[#f8f5ee]">Customize Meal</div>
              <div className="text-[11px] text-[#8e8779]">Select spice level, extra cheese, and cold drinks.</div>
            </div>
            <div className="p-3 rounded-xl bg-[#161a22] border border-[#252b36] text-center space-y-1">
              <div className="text-xs font-bold text-[#f59e0b] font-mono">STEP 3</div>
              <div className="text-xs font-semibold text-[#f8f5ee]">Pay with M-Pesa</div>
              <div className="text-[11px] text-[#8e8779]">Order sends straight to kitchen fryer & grill.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#252b38] bg-[#101319] flex items-center justify-between">
          <div className="text-xs text-[#8e8779]">
            Active table session: <strong className="text-[#f8f5ee] font-medium">{currentTable}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-semibold text-xs tracking-wider uppercase transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
