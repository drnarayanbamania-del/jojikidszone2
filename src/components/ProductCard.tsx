import React from 'react';
import { Heart, ShoppingBag, Star, Check, Eye, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string, size: string | null) => void;
  onQuickView: (product: Product) => void;
  isAdmin?: boolean;
  onDeleteProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  isAdmin,
  onDeleteProduct,
  onEditProduct,
}) => {
  const [selectedSize, setSelectedSize] = React.useState<string>(() => {
    return product.name.toLowerCase().includes('sneaker') || product.name.toLowerCase().includes('shoe')
      ? '24 EU'
      : '3-4Y';
  });
  const [isAdding, setIsAdding] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(false);

  const isFootwear =
    product.name.toLowerCase().includes('sneaker') ||
    product.name.toLowerCase().includes('shoe') ||
    product.name.toLowerCase().includes('sandal');

  const availableSizes = isFootwear
    ? ['22 EU', '23 EU', '24 EU', '25 EU']
    : ['2-3Y', '3-4Y', '4-5Y', '5-6Y'];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product.id, selectedSize);
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }, 300);
  };

  const getTagBadgeColor = (tag: string) => {
    switch (tag.toUpperCase()) {
      case 'BESTSELLER':
        return 'bg-amber-500 text-white';
      case 'NEW':
        return 'bg-emerald-600 text-white';
      case 'TRENDING':
        return 'bg-indigo-600 text-white';
      case 'LIMITED':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500 shadow-xs hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/5 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback to branded fallback placeholder
            const target = e.currentTarget;
            target.onerror = null;
            target.src = 'https://images.pexels.com/photos/5693891/pexels-photo-5693891.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
          }}
        />

        {/* Admin Quick Action Controls */}
        {isAdmin && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditProduct?.(product);
              }}
              title="Admin: Edit this item"
              className="w-8 h-8 rounded-full bg-slate-900/90 dark:bg-slate-800 hover:bg-amber-500 text-white flex items-center justify-center backdrop-blur-md shadow-md transition-all scale-95 hover:scale-105 cursor-pointer border border-transparent dark:border-slate-700"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProduct?.(product);
              }}
              title="Admin: Delete this item from store"
              className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center backdrop-blur-md shadow-md transition-all scale-95 hover:scale-105 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Wishlist Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-xs z-10 ${
            isWishlisted
              ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-500 hover:scale-110 shadow-rose-200 dark:shadow-none'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-900 border border-transparent dark:border-slate-700'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Tag Badge */}
        {product.tag && (
          <div className={`absolute z-10 ${isAdmin ? 'top-12 left-3' : 'top-3 left-3'}`}>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${getTagBadgeColor(
                product.tag
              )}`}
            >
              {product.tag}
            </span>
          </div>
        )}

        {/* Quick View Hover Pill */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 text-xs font-bold rounded-full shadow-md border border-transparent dark:border-slate-700">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            Quick View
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Gender */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
            <span className="uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">{product.brand}</span>
            {product.gender && (
              <span className="capitalize text-slate-400 dark:text-slate-500 font-medium">{product.gender}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">(90+ reviews)</span>
          </div>
        </div>

        {/* Pricing & Size Controls */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Price details */}
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-lg text-slate-900 dark:text-white">
              ₹{product.price}
            </span>
            {product.old_price && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium">
                ₹{product.old_price}
              </span>
            )}
            {product.discount_percent && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                {product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Size Pills */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Select Size:</div>
            <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
                    selectedSize === size
                      ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-slate-900 dark:bg-amber-500 hover:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 active:scale-98'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added to Bag!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
