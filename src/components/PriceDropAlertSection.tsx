import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  TrendingDown,
  Mail,
  CheckCircle2,
  Sparkles,
  Shield,
  Trash2,
  Edit2,
  X,
  Send,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Product, PriceDropAlert } from '../types';
import {
  getAlertForProduct,
  savePriceAlert,
  removePriceAlert,
  getLastUsedEmail,
} from '../lib/priceAlertStorage';

interface PriceDropAlertSectionProps {
  product: Product;
}

export const PriceDropAlertSection: React.FC<PriceDropAlertSectionProps> = ({ product }) => {
  const [existingAlert, setExistingAlert] = useState<PriceDropAlert | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [alertType, setAlertType] = useState<'any_drop' | 'target_price'>('any_drop');
  const [customPrice, setCustomPrice] = useState<number>(Math.round(product.price * 0.9));
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);

  // Load existing alert if already registered for this product
  useEffect(() => {
    const alert = getAlertForProduct(product.id);
    setExistingAlert(alert);
    if (alert) {
      setEmail(alert.email);
      setAlertType(alert.alertType);
      setCustomPrice(alert.targetPrice);
    } else {
      setEmail(getLastUsedEmail());
      setCustomPrice(Math.round(product.price * 0.9));
      setAlertType('any_drop');
    }
    setShowSuccessMessage(false);
  }, [product.id, product.price]);

  // Target price presets
  const drop5Percent = Math.round(product.price * 0.95);
  const drop10Percent = Math.round(product.price * 0.9);
  const drop15Percent = Math.round(product.price * 0.85);

  const calculateTargetPrice = (): number => {
    if (alertType === 'any_drop') {
      return product.price - 1; // Any drop below current price
    }
    return customPrice;
  };

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val.trim()) {
      return 'Please enter your email address.';
    }
    if (!emailRegex.test(val.trim())) {
      return 'Please enter a valid email address (e.g. name@example.com).';
    }
    return '';
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError('');

    if (alertType === 'target_price' && customPrice >= product.price) {
      setEmailError(`Target price must be lower than current price (₹${product.price}).`);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const target = calculateTargetPrice();
      const saved = savePriceAlert({
        productId: product.id,
        productName: product.name,
        productImage: product.image_url,
        email: email.trim(),
        currentPrice: product.price,
        targetPrice: target,
        alertType: alertType,
      });

      setExistingAlert(saved);
      setIsSaving(false);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setIsExpanded(false);
        setShowSuccessMessage(false);
      }, 2500);
    }, 450);
  };

  const handleRemove = () => {
    removePriceAlert(product.id);
    setExistingAlert(undefined);
    setIsExpanded(false);
    setShowSuccessMessage(false);
  };

  return (
    <div className="w-full my-2">
      {/* 1. Subscribed Active State */}
      {existingAlert && !isExpanded ? (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-300 dark:border-emerald-800/80 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  Price Alert Active
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {existingAlert.alertType === 'any_drop'
                    ? 'Any Price Drop'
                    : `Target: ₹${existingAlert.targetPrice}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Notifying: <span className="font-semibold text-slate-700 dark:text-slate-300">{existingAlert.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <button
              type="button"
              onClick={() => setShowEmailPreviewModal(true)}
              className="px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Preview simulated price drop email"
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="p-1.5 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Alert"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Cancel & Remove Alert"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : !isExpanded ? (
        /* 2. Unsubscribed Trigger Button */
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="group w-full flex items-center justify-between p-2.5 sm:px-3.5 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 hover:bg-amber-100/70 dark:hover:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 hover:border-amber-400 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-amber-950 dark:text-amber-200 block group-hover:text-amber-800 dark:group-hover:text-amber-300">
                Notify me on price drop
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                Get an instant email alert if this item goes on discount
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Set Alert</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      ) : (
        /* 3. Expanded Subscription Form Card */
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-amber-300/80 dark:border-amber-700/60 shadow-lg animate-in fade-in zoom-in-95 duration-200 relative">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Set Price Drop Alert</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Free
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Current Price: <strong className="text-slate-900 dark:text-white font-mono">₹{product.price}</strong>
              </p>
            </div>
          </div>

          {showSuccessMessage ? (
            <div className="py-4 text-center space-y-2 animate-in fade-in duration-200">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h5 className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                Price Alert Set Successfully!
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                We'll email <strong className="font-bold text-slate-900 dark:text-white">{email}</strong> as soon as the price drops!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveAlert} className="space-y-3.5">
              {/* Alert Type & Target Options */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                  Alert Me When:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAlertType('any_drop')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      alertType === 'any_drop'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Any Price Drop</span>
                    </div>
                    <span className="text-[10px] block opacity-85 mt-0.5 font-normal">
                      Even ₹50 or 5% off
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertType('target_price')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      alertType === 'target_price'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Target Price</span>
                    </div>
                    <span className="text-[10px] block opacity-85 mt-0.5 font-normal">
                      Target ₹{customPrice} or below
                    </span>
                  </button>
                </div>
              </div>

              {/* Target Price selector if custom target selected */}
              {alertType === 'target_price' && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-150">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                    Choose Target Price:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCustomPrice(drop5Percent)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                        customPrice === drop5Percent
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-400'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      ₹{drop5Percent} (-5%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPrice(drop10Percent)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                        customPrice === drop10Percent
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-400'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      ₹{drop10Percent} (-10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPrice(drop15Percent)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                        customPrice === drop15Percent
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-400'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      ₹{drop15Percent} (-15%)
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-500 font-mono">Custom: ₹</span>
                    <input
                      type="number"
                      max={product.price - 1}
                      min={10}
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      className="w-28 px-2 py-1 text-xs font-bold font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                    <span className="text-[11px] text-slate-400">
                      (Must be below ₹{product.price})
                    </span>
                  </div>
                </div>
              )}

              {/* Email Address Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                  Your Email Address:
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="Enter your email (e.g. parent@gmail.com)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] text-rose-500 font-semibold">{emailError}</p>
                )}
              </div>

              {/* Anti-Spam Guarantee & Action */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  Zero spam • 1-click unsubscribe anytime
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-1.5 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Set Alert</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Simulated Email Preview Modal */}
      {showEmailPreviewModal && existingAlert && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowEmailPreviewModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Email Header Bar */}
            <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  JK
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block">
                    JOJI KIDS ZONE Price Alerts
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    alerts@jojiidszone.in → {existingAlert.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEmailPreviewModal(false)}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Content Body */}
            <div className="p-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Price Drop Notification Sample</span>
              </div>

              <h3 className="font-display font-black text-base text-slate-900 dark:text-white">
                Great news! The price of "{product.name}" just dropped! 🎉
              </h3>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{existingAlert.targetPrice}
                    </span>
                    <span className="text-xs text-slate-400 line-through font-mono">
                      ₹{product.price}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950 px-1.5 rounded">
                      Special Offer
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                You asked us to watch this product for you at <strong>JOJI KIDS ZONE (120 A.B. Road, Dewas)</strong>. Stock is limited for this festive season!
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailPreviewModal(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Close Preview</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
