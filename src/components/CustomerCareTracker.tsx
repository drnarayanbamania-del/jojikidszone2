import React, { useState } from 'react';
import { Truck, CheckCircle2, AlertCircle, ArrowRight, Sparkles, RotateCcw, PackageCheck, Headphones } from 'lucide-react';

interface CustomerCareTrackerProps {
  onOpenWishlist: () => void;
  onOpenDbStatus: () => void;
  onOpenTrackingModal: (orderId: string) => void;
  onOpenOrderHistory?: () => void;
  onOpenContactUs?: () => void;
}

export const CustomerCareTracker: React.FC<CustomerCareTrackerProps> = ({
  onOpenWishlist,
  onOpenDbStatus,
  onOpenTrackingModal,
  onOpenOrderHistory,
  onOpenContactUs,
}) => {
  const [orderInput, setOrderInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validatedOrderId, setValidatedOrderId] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Pattern: JOJI-123456 or JJ-123456 (case-insensitive)
  const ORDER_PATTERN = /^(JOJI|JJ)-\d{6}$/i;
  const SAMPLE_ORDER = 'JOJI-742918';

  const handleValidateAndTrack = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setValidatedOrderId(null);

    const cleanInput = orderInput.trim().toUpperCase();

    if (!cleanInput) {
      setErrorMessage('Please enter an order number.');
      return;
    }

    setIsValidating(true);

    setTimeout(() => {
      setIsValidating(false);
      if (ORDER_PATTERN.test(cleanInput)) {
        setValidatedOrderId(cleanInput);
        setErrorMessage('');
      } else {
        setErrorMessage('Invalid format. Expected: JOJI-XXXXXX (e.g., JOJI-742918)');
      }
    }, 400);
  };

  const handleUseSample = () => {
    setOrderInput(SAMPLE_ORDER);
    setErrorMessage('');
    setValidatedOrderId(null);
    setIsValidating(true);

    setTimeout(() => {
      setIsValidating(false);
      setValidatedOrderId(SAMPLE_ORDER);
    }, 300);
  };

  const handleReset = () => {
    setOrderInput('');
    setErrorMessage('');
    setValidatedOrderId(null);
  };

  return (
    <div className="space-y-3.5 text-xs">
      <div>
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          Customer Care & Tracking
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Track packages or access order assistance 24/7
        </p>
      </div>

      {/* Quick Navigation Links */}
      <ul className="space-y-1.5 text-slate-400">
        {onOpenContactUs && (
          <li>
            <button
              onClick={onOpenContactUs}
              className="text-amber-300 hover:text-amber-200 transition-colors font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact Us & Help Center</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                Support
              </span>
            </button>
          </li>
        )}
        {onOpenOrderHistory && (
          <li>
            <button
              onClick={onOpenOrderHistory}
              className="text-amber-300 hover:text-amber-200 transition-colors font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Past Orders & Reorder</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                New
              </span>
            </button>
          </li>
        )}
        <li>
          <button
            onClick={() => {
              handleUseSample();
              onOpenTrackingModal(SAMPLE_ORDER);
            }}
            className="hover:text-amber-400 transition-colors text-left flex items-center gap-1"
          >
            <span>Track Sample Order (JOJI-742918)</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
              Live
            </span>
          </button>
        </li>
        <li>
          <button onClick={onOpenWishlist} className="hover:text-amber-400 transition-colors">
            My Saved Wishlist
          </button>
        </li>
        <li>
          <button onClick={onOpenDbStatus} className="hover:text-amber-400 transition-colors">
            Database & API Diagnostics
          </button>
        </li>
        <li>
          <span className="text-slate-500">7-Day Free Home Exchange & Returns</span>
        </li>
      </ul>

      {/* Mock 'Track My Order' Input Form */}
      <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="track-order-input" className="text-[11px] font-bold text-slate-300">
            Track My Order
          </label>
          <button
            type="button"
            onClick={handleUseSample}
            className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
          >
            Try sample: {SAMPLE_ORDER}
          </button>
        </div>

        <form onSubmit={handleValidateAndTrack} className="space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                id="track-order-input"
                type="text"
                value={orderInput}
                onChange={(e) => {
                  setOrderInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Pattern: JOJI-XXXXXX"
                className="w-full uppercase font-mono text-xs px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              {orderInput && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                  title="Clear"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isValidating}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {isValidating ? (
                <span className="animate-spin text-xs">⏳</span>
              ) : (
                <>
                  <span>Track</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

          {/* Validation Feedback Messages */}
          {errorMessage && (
            <div className="flex items-start gap-1.5 text-[11px] text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/50">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {validatedOrderId && (
            <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-700/60 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-emerald-300">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Valid Order #{validatedOrderId}</span>
                </div>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-semibold">
                  Out for Delivery
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Arriving today by 6:00 PM via BlueDart Express (Air).
              </p>
              <button
                type="button"
                onClick={() => onOpenTrackingModal(validatedOrderId)}
                className="w-full py-1.5 px-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <span>View Full Shipment Journey</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </form>

        <p className="text-[10px] text-slate-500 font-mono leading-tight">
          Accepted format: JOJI-XXXXXX or JJ-XXXXXX (6 digits)
        </p>
      </div>
    </div>
  );
};
