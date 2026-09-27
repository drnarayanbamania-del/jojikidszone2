import React from 'react';
import {
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
  Plus,
  Trash2,
  LucideIcon
} from 'lucide-react';
import { Category } from '../types';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  productCountByCategory: Record<string, number>;
  totalProducts: number;
  isAdmin?: boolean;
  onOpenAdminPanel?: () => void;
  onDeleteCategory?: (category: Category) => void;
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

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  productCountByCategory,
  totalProducts,
  isAdmin,
  onOpenAdminPanel,
  onDeleteCategory,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
          Explore Categories
        </h2>
        <span className="text-xs text-slate-400 dark:text-slate-400 font-medium">
          {categories.length} live categories
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {/* "All" chip */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 border ${
            selectedCategorySlug === 'all'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-[1.02]'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-slate-700/60'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
              selectedCategorySlug === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-amber-50 dark:bg-slate-700 text-amber-600 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <span>All Items</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              selectedCategorySlug === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
            }`}
          >
            {totalProducts}
          </span>
        </button>

        {/* Category chips from Supabase */}
        {categories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon_name] || Sparkles;
          const isSelected = selectedCategorySlug === cat.slug;
          const count = productCountByCategory[cat.slug] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-slate-700/60'
              }`}
            >
              {cat.image_url ? (
                <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 border border-white/40 shadow-2xs">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-50 dark:bg-slate-700 text-amber-600 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-slate-600'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
              )}
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Add Category Chip */}
        {isAdmin && (
          <button
            onClick={onOpenAdminPanel}
            title="Admin: Add or manage categories"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-dashed border-amber-400 dark:border-amber-600 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <span>+ Add Category</span>
          </button>
        )}
      </div>
    </div>
  );
};
