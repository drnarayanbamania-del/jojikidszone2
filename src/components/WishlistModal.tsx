import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (productId: string) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveFromWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/40 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                My Saved Wishlist
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                {wishlistedProducts.length} saved {wishlistedProducts.length === 1 ? 'favorite' : 'favorites'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-300 dark:text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 max-w-xs mx-auto">
                Tap the heart icon on any outfit or shoes you love to save them here for later!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Browse Outfits
              </button>
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-rose-200 dark:hover:border-rose-900/60 transition-colors"
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-18 rounded-xl object-cover object-center shrink-0 bg-slate-100 dark:bg-slate-700"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                    {p.brand}
                  </span>
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate">{p.name}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-black text-sm text-slate-900 dark:text-white">₹{p.price}</span>
                    {p.old_price && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 line-through">₹{p.old_price}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => onMoveToCart(p.id)}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-amber-500 hover:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Move to Bag
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(p.id)}
                    className="px-3 py-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
