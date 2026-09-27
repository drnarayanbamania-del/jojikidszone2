import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Layers,
  ShoppingBag,
  LucideIcon,
  Shirt,
  Footprints,
  ToyBrick,
  Backpack,
  Baby,
  Gift,
  Heart,
  Crown,
} from 'lucide-react';
import { Category } from '../types';

interface CategoryTilesProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  productCountByCategory: Record<string, number>;
  totalProducts: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Shirt,
  Footprints,
  ToyBrick,
  Backpack,
  Baby,
  Gift,
  Sparkles,
  Heart,
  Crown,
  ShoppingBag,
};

// Curated high-resolution imagery specifically matching child fashion, footwear, toys, accessories, baby care & gifting
const DEFAULT_CATEGORY_IMAGES: Record<string, { image: string; brandBadge: string; tagline: string; accentColor: string }> = {
  clothing: {
    image: 'https://images.pexels.com/photos/5693891/pexels-photo-5693891.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    brandBadge: 'JOJI KIDS FASHION',
    tagline: 'Pure Combed Cotton Outfits & Sets',
    accentColor: 'from-amber-500/80 via-orange-500/80 to-rose-600/80',
  },
  'ethnic-wear': {
    image: 'https://images.pexels.com/photos/8819389/pexels-photo-8819389.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    brandBadge: 'JOJI ETHNIC & FESTIVE',
    tagline: 'Peplum Lehengas & Janmashtami Sets',
    accentColor: 'from-fuchsia-600/80 via-rose-600/80 to-amber-600/80',
  },
  footwear: {
    image: 'https://images.pexels.com/photos/19869753/pexels-photo-19869753.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    brandBadge: 'LITTLE STEPS COMFORT',
    tagline: 'Light-Up LEDs & Anti-Slip Soles',
    accentColor: 'from-blue-600/80 via-cyan-600/80 to-indigo-700/80',
  },
  toys: {
    image: 'https://images.pexels.com/photos/35619/cap-race-car-model-car-fast.jpg?auto=compress&cs=tinysrgb&h=650&w=940',
    brandBadge: 'JOJI TOY ZONE',
    tagline: 'RC Turbo Stunt Cars & Plush Teddy',
    accentColor: 'from-rose-500/80 via-pink-600/80 to-purple-700/80',
  },
  accessories: {
    image: 'https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    brandBadge: 'PLAYTIME GEAR',
    tagline: '3D Dino Bags & UV400 Shades',
    accentColor: 'from-emerald-600/80 via-teal-600/80 to-cyan-700/80',
  },
  'baby-care': {
    image: 'https://images.pexels.com/photos/3845492/pexels-photo-3845492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    brandBadge: 'JOJI BABY CARE',
    tagline: 'Organic Bamboo Muslin Swaddles',
    accentColor: 'from-teal-500/80 via-cyan-600/80 to-sky-700/80',
  },
  gifting: {
    image: 'https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    brandBadge: 'CELEBRATION BOXES',
    tagline: 'Newborn Welcome Hampers & Gifts',
    accentColor: 'from-purple-600/80 via-indigo-600/80 to-pink-600/80',
  },
};

export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  productCountByCategory,
  totalProducts,
}) => {
  return (
    <section className="w-full space-y-4 pt-1">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
              Featured Category Hub
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Handcrafted for infants, toddlers, and young trendsetters • Explore authentic brand collections
          </p>
        </div>

        {/* Total stats pill */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              selectedCategorySlug === 'all'
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-400'
            }`}
          >
            Show All ({totalProducts})
          </button>
        </div>
      </div>

      {/* Grid of Category Visual Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {categories.map((cat) => {
          const fallbackData = DEFAULT_CATEGORY_IMAGES[cat.slug] || {
            image:
              cat.image_url ||
              'https://images.pexels.com/photos/5693891/pexels-photo-5693891.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
            brandBadge: cat.brand_tagline || 'JOJI KIDS ZONE',
            tagline: cat.description || `${cat.name} Collection`,
            accentColor: 'from-amber-600/80 via-orange-600/80 to-rose-600/80',
          };

          const imageUrl = cat.image_url || fallbackData.image;
          const brandBadge = cat.brand_tagline || fallbackData.brandBadge;
          const tagline = cat.description || fallbackData.tagline;
          const isSelected = selectedCategorySlug === cat.slug;
          const count = productCountByCategory[cat.slug] ?? 0;
          const IconComp = ICON_MAP[cat.icon_name] || ShoppingBag;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectCategory(cat.slug);
                }
              }}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-end text-left aspect-3/4 sm:aspect-4/5 border-2 shadow-xs hover:shadow-xl hover:shadow-amber-500/15 ${
                isSelected
                  ? 'border-amber-500 ring-4 ring-amber-500/20 scale-[1.03]'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500 hover:-translate-y-1'
              }`}
            >
              {/* Background Product Image */}
              <img
                src={imageUrl}
                alt={`${cat.name} at JOJI Kids Zone`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />

              {/* Multi-tone Gradient Overlay to ensure maximum text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-all duration-300" />

              {/* Top Floating Badge with Brand / Tag */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-300/30">
                  {brandBadge.split(' ')[0]}
                </span>
                {count > 0 && (
                  <span className="text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>

              {/* Category Icon Badge in middle right */}
              <div className="absolute top-8 right-2.5 w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
                <IconComp className="w-3.5 h-3.5 text-amber-300" />
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10 p-3 sm:p-4 space-y-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-white/25 text-white group-hover:bg-amber-400 group-hover:text-slate-950'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-display font-black text-sm sm:text-base text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-1 leading-snug font-medium">
                  {tagline}
                </p>

                {/* Explore Action Button */}
                <div className="pt-1 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isSelected ? 'text-amber-300' : 'text-amber-200 group-hover:text-amber-300'
                    }`}
                  >
                    <span>{isSelected ? 'Browsing' : 'Explore'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 ring-4 ring-amber-400/40" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
