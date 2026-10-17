import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Smartphone, Copy, Check, Download, ExternalLink, CheckCircle2 } from 'lucide-react';

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
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [urlMode, setUrlMode] = useState<'shared' | 'current'>('shared');

  const publicSharedUrl = 'https://ais-pre-6ntekunwfd5giwrjgnkia3-358481995147.europe-west2.run.app';
  
  const tables = [
    'Table 01',
    'Table 02',
    'Table 04',
    'Table 07',
    'Table 10',
    'Table 14',
    'Terrace 02',
    'Express Counter',
  ];

  // Resolve base URL for mobile camera scan:
  // Prefer the cloud shared URL so physical phones on external networks/Wi-Fi can resolve it
  const baseUrl = (urlMode === 'shared' || typeof window === 'undefined')
    ? publicSharedUrl
    : `${window.location.origin}${window.location.pathname}`;

  const currentUrl = `${baseUrl}?table=${encodeURIComponent(currentTable)}`;

  // Generate authentic ISO/IEC 18004 standards-compliant QR Code Data URL
  useEffect(() => {
    QRCode.toDataURL(currentUrl, {
      width: 360,
      margin: 2,
      color: {
        dark: '#0f1217',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate real QR code:', err);
      });
  }, [currentUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `SizzleCrisp-QR-${currentTable.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#141822] border border-[#2d3545] rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#252b38] flex items-center justify-between bg-[#101319]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#f8f5ee]">
                Live Mobile Scan-to-Order QR Code
              </h2>
              <p className="text-xs text-[#8e8779]">
                Scannable directly with any iPhone or Android camera
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close scan to order"
            className="p-1.5 rounded-lg text-[#8e8779] hover:text-[#f8f5ee] hover:bg-[#1f2533] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[82vh]">
          {/* Table Selector Strip */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a0988a] mb-2">
              Select Dining Table to Generate QR:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {tables.map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => onSelectTable(tbl)}
                  className={`px-3 py-1.5 text-xs rounded-xl transition-colors whitespace-nowrap shrink-0 border ${
                    currentTable === tbl
                      ? 'bg-[#f59e0b] text-[#0f1115] border-[#f59e0b] font-bold'
                      : 'bg-[#181c25] text-[#a0988a] border-[#29303e] hover:text-[#f8f5ee]'
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>
          </div>

          {/* Real QR Code Display Card */}
          <div className="bg-[#191f2b] border border-[#2b3342] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 shadow-inner text-center sm:text-left">
            {/* Scannable High-Res QR Image */}
            <div className="bg-white p-3.5 rounded-2xl shadow-xl shrink-0 flex flex-col items-center border-4 border-[#f59e0b]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Real QR code for ${currentTable}`}
                  className="w-44 h-44 sm:w-48 sm:h-48 rounded-lg block"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-black font-mono">
                  Generating QR Code...
                </div>
              )}
              <div className="text-[11px] uppercase font-bold tracking-widest text-[#0f1115] mt-1.5 font-mono">
                {currentTable}
              </div>
            </div>

            {/* Explanatory text & actions */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#48db88] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Genuine Camera-Scannable QR</span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-[#f8f5ee]">
                  Point Your Phone Camera
                </h3>
                <p className="text-xs text-[#a0988a] leading-relaxed mt-1">
                  Open your smartphone's camera (iPhone or Android) and aim it at this QR code. It will instantly pop up a notification to open the fast food menu and order directly for <strong className="text-[#f8f5ee]">{currentTable}</strong>!
                </p>
              </div>

              {/* URL Switcher between Shared Cloud URL (for real phones) and local dev */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8e8779] mb-1">
                  <span>URL Target:</span>
                  <button
                    type="button"
                    onClick={() => setUrlMode('shared')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      urlMode === 'shared' ? 'bg-[#f59e0b] text-[#0f1115]' : 'bg-[#151922] text-[#8e8779]'
                    }`}
                  >
                    Public Cloud Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlMode('current')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      urlMode === 'current' ? 'bg-[#f59e0b] text-[#0f1115]' : 'bg-[#151922] text-[#8e8779]'
                    }`}
                  >
                    Current Host
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="bg-[#101319] border border-[#2b3342] text-[#f8f5ee] text-[11px] rounded-xl px-2.5 py-1.5 font-mono flex-1 truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#242b38] hover:bg-[#30394a] text-[#f8f5ee] text-xs font-semibold transition-colors shrink-0"
                    title="Copy direct mobile URL"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#48db88]" />
                        <span className="text-[#48db88]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Download QR Image button */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#242b38] hover:bg-[#30394a] text-[#f59e0b] text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Table Stand PNG</span>
                </button>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#181d26] hover:bg-[#202733] text-[#a0988a] hover:text-[#f8f5ee] text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick instructions for customers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[#161a23] border border-[#252b38] text-center space-y-1">
              <div className="text-xs font-bold text-[#f59e0b] font-mono">1. AIM CAMERA</div>
              <div className="text-[11px] text-[#a0988a]">Point any phone camera without needing an app.</div>
            </div>
            <div className="p-3 rounded-xl bg-[#161a23] border border-[#252b38] text-center space-y-1">
              <div className="text-xs font-bold text-[#f59e0b] font-mono">2. TAP BANNER</div>
              <div className="text-[11px] text-[#a0988a]">Tap the yellow link pop-up on your phone screen.</div>
            </div>
            <div className="p-3 rounded-xl bg-[#161a23] border border-[#252b38] text-center space-y-1">
              <div className="text-xs font-bold text-[#f59e0b] font-mono">3. ORDER & M-PESA</div>
              <div className="text-[11px] text-[#a0988a]">Food & drinks arrive right to your table!</div>
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
            className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f1115] font-bold text-xs tracking-wider uppercase transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
