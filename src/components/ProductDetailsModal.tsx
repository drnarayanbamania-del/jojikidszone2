import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, Check, RotateCcw, MessageSquare, Info, Sparkles, Ruler } from 'lucide-react';
import { Product } from '../types';
import { ProductReviews } from './ProductReviews';
import { SizeGuideModal } from './SizeGuideModal';
import { PriceDropAlertSection } from './PriceDropAlertSection';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string, size: string | null) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (!product) return null;

  const isFootwear =
    product.name.toLowerCase().includes('sneaker') ||
    product.name.toLowerCase().includes('shoe') ||
    product.name.toLowerCase().includes('sandal');

  const availableSizes = isFootwear
    ? ['22 EU', '23 EU', '24 EU', '25 EU']
    : ['2-3Y', '3-4Y', '4-5Y', '5-6Y'];

  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[1] || availableSizes[0]);
  const [pincode, setPincode] = useState('400001');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const [totalReviews, setTotalReviews] = useState<number>(3);
  const [currentRating, setCurrentRating] = useState<number>(product.rating || 4.8);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [recommendedSizeApplied, setRecommendedSizeApplied] = useState<string | null>(null);

  const handleAdd = () => {
    onAddToCart(product.id, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleReviewsUpdate = (count: number, avg: number) => {
    setTotalReviews(count);
    setCurrentRating(avg);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white flex items-center justify-center shadow-md transition-colors cursor-pointer border border-transparent dark:border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Section */}
        <div className="md:col-span-5 bg-slate-100 dark:bg-slate-800 relative min-h-[260px] md:min-h-full flex flex-col justify-between overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center max-h-[340px] md:max-h-none"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'https://images.pexels.com/photos/5693891/pexels-photo-5693891.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
            }}
          />
          {product.tag && (
            <span className="absolute top-4 left-4 text-xs font-black uppercase tracking-wider px-3 py-1 bg-amber-500 text-slate-950 rounded-full shadow-md">
              {product.tag}
            </span>
          )}

          {/* Quick trust strip on image overlay */}
          <div className="hidden md:flex absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-4 text-white text-xs items-center justify-between">
            <span className="flex items-center gap-1 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Skin Safe
            </span>
            <span className="flex items-center gap-1 font-semibold text-[11px]">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              15-Day Free Returns
            </span>
          </div>
        </div>

        {/* Right Details Section */}
        <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[92vh] space-y-4">
          <div className="space-y-4">
            {/* Header / Brand & Title */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                <span>{product.brand}</span>
                {product.gender && <span className="text-slate-400 dark:text-slate-500 capitalize">{product.gender}</span>}
              </div>

              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h2>

              {/* Rating header with quick jump to reviews */}
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="mt-1.5 flex items-center gap-2 group cursor-pointer text-left"
              >
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(currentRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentRating}</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 group-hover:underline font-semibold flex items-center gap-1">
                  | {totalReviews} verified parent {totalReviews === 1 ? 'review' : 'reviews'}
                  <MessageSquare className="w-3 h-3 inline" />
                </span>
              </button>
            </div>

            {/* Price Pill */}
            <div className="flex items-baseline gap-3 pb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white">
                ₹{product.price}
              </span>
              {product.old_price && (
                <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-semibold">
                  ₹{product.old_price}
                </span>
              )}
              {product.discount_percent && (
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full">
                  SAVE {product.discount_percent}%
                </span>
              )}
            </div>

            {/* Price Drop Alert Feature */}
            <PriceDropAlertSection product={product} />

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 px-1 font-bold text-xs flex items-center gap-1.5 transition-all relative cursor-pointer ${
                  activeTab === 'details'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Product Details & Fit</span>
                {activeTab === 'details' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 px-1 font-bold text-xs flex items-center gap-1.5 transition-all relative cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reviews & Ratings</span>
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                  {totalReviews}
                </span>
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Tab 1: Product Overview & Sizing */}
            {activeTab === 'details' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description ||
                    'Tailored from 100% premium super-combed cotton for maximum playtime breathability. Pre-washed to avoid shrinkage and finished with skin-friendly flatlock seams.'}
                </p>

                {/* Size Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 dark:text-slate-300">Select Age / Size</span>
                      {recommendedSizeApplied && recommendedSizeApplied === selectedSize && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
                          <Sparkles className="w-2.5 h-2.5" />
                          Recommended Fit
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold text-xs flex items-center gap-1.5 hover:underline cursor-pointer group"
                    >
                      <Ruler className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Size Guide & Fit Calculator</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize === size;
                      const isRec = recommendedSizeApplied === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 px-1 text-center font-bold text-xs rounded-xl border transition-all cursor-pointer relative ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-black'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500'
                          }`}
                        >
                          {size}
                          {isRec && (
                            <span
                              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"
                              title="Calculated Best Fit for Child"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Pincode Check */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Delivery Availability & Estimates
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit pincode"
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setPincodeChecked(true)}
                      className="px-3.5 py-1.5 bg-slate-800 dark:bg-amber-500 hover:bg-slate-900 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeChecked && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Delivery by Tomorrow to {pincode || 'your area'} (Standard Express)
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Hypoallergenic & azo-free dyes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Pre-shrunk combed cotton</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Reviews & Feedback */}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in">
                <ProductReviews
                  productId={product.id}
                  productName={product.name}
                  onReviewsCountChange={handleReviewsUpdate}
                />
              </div>
            )}
          </div>

          {/* Persistent Action CTAs */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900 sticky bottom-0">
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-900 text-rose-500'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-700'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleAdd}
              className={`flex-1 py-3 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20 font-black'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  Item Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Bag • ₹{product.price}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Size Guide & Fit Recommender Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productName={product.name}
        isFootwear={isFootwear}
        currentSelectedSize={selectedSize}
        onSelectSize={(size) => {
          setSelectedSize(size);
          setRecommendedSizeApplied(size);
        }}
      />
    </div>
  );
};
