import React, { useRef, useEffect } from 'react';
import { Product, Category } from '../types';
import { Search, ArrowRight, Tag, Star, Sparkles, TrendingUp } from 'lucide-react';

interface PredictiveSearchDropdownProps {
  query: string;
  products: Product[];
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const PredictiveSearchDropdown: React.FC<PredictiveSearchDropdownProps> = ({
  query,
  products,
  categories,
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory,
  onSearchSubmit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const cleanQuery = query.trim().toLowerCase();

  // Popular or trending searches when query is empty or 1 letter
  const popularKeywords = [
    'Lehenga',
    'Krishna Costume',
    'Dungarees',
    'Thermal Innerwear',
    'Denim Shorts',
    'Sneakers',
    'Cotton Dress',
    'Feeder Bibs',
  ];

  // Match products by name, tag, description, brand, or age_group
  const matchedProducts = cleanQuery
    ? products
        .filter((p) => {
          const inName = p.name.toLowerCase().includes(cleanQuery);
          const inTag = p.tag?.toLowerCase().includes(cleanQuery);
          const inDesc = p.description?.toLowerCase().includes(cleanQuery);
          const inBrand = p.brand?.toLowerCase().includes(cleanQuery);
          const inAge = p.age_group?.toLowerCase().includes(cleanQuery);
          const inGender = p.gender?.toLowerCase().includes(cleanQuery);
          return inName || inTag || inDesc || inBrand || inAge || inGender;
        })
        .slice(0, 6)
    : [];

  // Match categories
  const matchedCategories = cleanQuery
    ? categories
        .filter((c) => c.name.toLowerCase().includes(cleanQuery) || c.slug.toLowerCase().includes(cleanQuery))
        .slice(0, 4)
    : [];

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      id="predictive-search-dropdown"
      className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {cleanQuery.length === 0 ? (
        /* Empty Query: Trending Suggestions & Popular Categories */
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => {
                    onSearchSubmit(kw);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Explore Popular Categories
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    onClose();
                  }}
                  className="text-left p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-amber-300 dark:hover:border-amber-600 transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 block truncate">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Shop collection →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Has Query: Live Matches */
        <div>
          {/* Categories matches if any */}
          {matchedCategories.length > 0 && (
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1.5">
                Categories matching "{query}"
              </span>
              <div className="flex flex-wrap gap-2">
                {matchedCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(c.slug);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-amber-600 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{c.name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Results */}
          <div className="p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2">
              <span>Matching Products ({matchedProducts.length})</span>
              <button
                type="button"
                onClick={() => {
                  onSearchSubmit(cleanQuery);
                  onClose();
                }}
                className="text-amber-600 dark:text-amber-400 hover:underline normal-case text-xs font-bold cursor-pointer"
              >
                View all results →
              </button>
            </div>

            {matchedProducts.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  No products matching "{query}"
                </p>
                <p className="text-[11px] text-slate-400">
                  Try searching for 'lehenga', 't-shirt', 'dungarees', 'shoes', or 'bibs'
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {matchedProducts.map((p) => {
                  // highlight matched term in product name
                  const matchIndex = p.name.toLowerCase().indexOf(cleanQuery);
                  let before = p.name;
                  let match = '';
                  let after = '';

                  if (matchIndex !== -1) {
                    before = p.name.slice(0, matchIndex);
                    match = p.name.slice(matchIndex, matchIndex + cleanQuery.length);
                    after = p.name.slice(matchIndex + cleanQuery.length);
                  }

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                    >
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.pexels.com/photos/5560019/pexels-photo-5560019.jpeg?auto=compress&cs=tinysrgb&w=300';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {matchIndex !== -1 ? (
                              <>
                                {before}
                                <span className="bg-amber-200/80 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 rounded px-0.5">
                                  {match}
                                </span>
                                {after}
                              </>
                            ) : (
                              p.name
                            )}
                          </span>
                          {p.tag && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold shrink-0">
                              {p.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                            ₹{p.price}
                          </span>
                          {p.old_price && p.old_price > p.price && (
                            <span className="text-[11px] text-slate-400 line-through font-mono">
                              ₹{p.old_price}
                            </span>
                          )}
                          {p.discount_percent && p.discount_percent > 0 && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              {p.discount_percent}% OFF
                            </span>
                          )}
                          {p.rating && (
                            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 ml-auto">
                              <Star className="w-2.5 h-2.5 fill-amber-500" />
                              {p.rating}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-slate-400 group-hover:text-amber-500 transition-colors pr-1">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer of Dropdown */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">
              Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-mono">Enter</kbd> to see all matches
            </span>
            <button
              type="button"
              onClick={() => {
                onSearchSubmit(cleanQuery);
                onClose();
              }}
              className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer text-xs"
            >
              Search "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
