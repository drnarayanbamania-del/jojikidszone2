import React, { useRef, useEffect, useState } from 'react';
import { Product, Category } from '../types';
import {
  Search,
  ArrowRight,
  Tag,
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  Trash2,
  Layers,
  ChevronRight,
  Shirt,
  ShoppingBag,
  Footprints,
  ToyBrick,
  Backpack,
  Baby,
  Gift,
  CornerUpLeft,
} from 'lucide-react';
import { getAutocompleteSuggestions, AutocompleteSuggestion } from '../lib/autocompleteSuggestions';

export interface PredictiveSearchDropdownProps {
  query: string;
  products: Product[];
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSearchSubmit: (query: string) => void;
  onFillQuery?: (phrase: string) => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  clothing: Shirt,
  'ethnic-wear': Sparkles,
  footwear: Footprints,
  toys: ToyBrick,
  accessories: Backpack,
  'baby-care': Baby,
  gifting: Gift,
};

// Component to highlight matched substring
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  const clean = query.trim();
  const escapedQuery = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === clean.toLowerCase() ? (
          <mark
            key={i}
            className="bg-amber-200/90 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 font-black rounded-xs px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export const PredictiveSearchDropdown: React.FC<PredictiveSearchDropdownProps> = ({
  query,
  products = [],
  categories = [],
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory,
  onSearchSubmit,
  onFillQuery,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Recent searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('joji_recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem('joji_recent_searches', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save recent search', err);
    }
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('joji_recent_searches');
    } catch (err) {
      console.warn('Failed clearing recent searches', err);
    }
  };

  const cleanQuery = query.trim().toLowerCase();

  // Curated popular trending keywords for kids wear & toys
  const trendingSearches = [
    'Festive Lehenga',
    'Cotton Rompers',
    'LED Light-Up Sneakers',
    'Janmashtami Krishna Set',
    'Wooden Montessori Toys',
    'Denim Dungarees',
    'Peplum Choli',
    'Organic Swaddles',
  ];

  // Autocomplete Suggestions (instant prefix & keyword suggestions)
  const autocompleteList = cleanQuery
    ? getAutocompleteSuggestions(cleanQuery, products, categories)
    : [];

  // Matched Categories
  const matchedCategories = cleanQuery
    ? categories
        .filter(
          (c) =>
            c.name.toLowerCase().includes(cleanQuery) ||
            c.slug.toLowerCase().includes(cleanQuery) ||
            (c.description && c.description.toLowerCase().includes(cleanQuery))
        )
        .slice(0, 4)
    : [];

  // Matched Products (name, brand, tag, description, gender, age_group)
  const matchedProducts = cleanQuery
    ? products
        .filter((p) => {
          const inName = p.name.toLowerCase().includes(cleanQuery);
          const inBrand = p.brand?.toLowerCase().includes(cleanQuery);
          const inTag = p.tag?.toLowerCase().includes(cleanQuery);
          const inDesc = p.description?.toLowerCase().includes(cleanQuery);
          const inGender = p.gender?.toLowerCase().includes(cleanQuery);
          const inAge = p.age_group?.toLowerCase().includes(cleanQuery);
          return inName || inBrand || inTag || inDesc || inGender || inAge;
        })
        .slice(0, 6)
    : [];

  // Build unified items array for keyboard navigation
  const selectableItems = cleanQuery
    ? [
        ...autocompleteList.map((a) => ({ type: 'autocomplete' as const, data: a })),
        ...matchedCategories.map((c) => ({ type: 'category' as const, data: c })),
        ...matchedProducts.map((p) => ({ type: 'product' as const, data: p })),
        { type: 'submit' as const, data: cleanQuery },
      ]
    : [];

  // Reset selectedIndex when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [cleanQuery]);

  // Click outside listener
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

  // Keyboard navigation handler (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (selectableItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % selectableItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + selectableItems.length) % selectableItems.length);
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < selectableItems.length) {
          e.preventDefault();
          const item = selectableItems[selectedIndex];
          if (item.type === 'autocomplete') {
            const sug = item.data as AutocompleteSuggestion;
            saveRecentSearch(sug.phrase);
            if (sug.categorySlug && sug.type === 'category') {
              onSelectCategory(sug.categorySlug);
            } else {
              onSearchSubmit(sug.phrase);
            }
            onClose();
          } else if (item.type === 'category') {
            saveRecentSearch((item.data as Category).name);
            onSelectCategory((item.data as Category).slug);
            onClose();
          } else if (item.type === 'product') {
            saveRecentSearch((item.data as Product).name);
            onSelectProduct(item.data as Product);
            onClose();
          } else if (item.type === 'submit') {
            saveRecentSearch(cleanQuery);
            onSearchSubmit(cleanQuery);
            onClose();
          }
        } else if (cleanQuery) {
          saveRecentSearch(cleanQuery);
          onSearchSubmit(cleanQuery);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectableItems, selectedIndex, cleanQuery, onClose, onSelectCategory, onSelectProduct, onSearchSubmit]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      id="predictive-search-dropdown"
      className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[78vh] overflow-y-auto scrollbar-thin divide-y divide-slate-100 dark:divide-slate-800/80"
    >
      {cleanQuery.length === 0 ? (
        /* Empty Query State: Recent Searches & Trending Keywords */
        <div className="p-4 space-y-4">
          {/* Recent Searches (if user has any) */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      saveRecentSearch(term);
                      onSearchSubmit(term);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/70 text-slate-700 dark:text-slate-200 hover:text-amber-900 dark:hover:text-amber-300 font-semibold transition-all cursor-pointer border border-transparent hover:border-amber-300 dark:hover:border-amber-700 active:scale-95"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Keywords */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
              <span>Trending in Kids Fashion &amp; Toys</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {trendingSearches.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => {
                    saveRecentSearch(kw);
                    onSearchSubmit(kw);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-100/80 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-900 dark:hover:text-amber-300 font-semibold transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700 active:scale-95"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{kw}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Explore Popular Categories Grid */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Explore Categories</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.slice(0, 6).map((cat) => {
                const IconComp = CATEGORY_ICONS[cat.slug] || ShoppingBag;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      saveRecentSearch(cat.name);
                      onSelectCategory(cat.slug);
                      onClose();
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-amber-50/60 dark:hover:bg-amber-950/40 hover:border-amber-300 dark:hover:border-amber-600 transition-all cursor-pointer group text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 block truncate">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                        Browse →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Has Active Query: Real-Time Matched Categories & Products */
        <div>
          {/* Header Summary Strip */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Suggestions for <strong className="text-slate-900 dark:text-white">"{query}"</strong>
            </span>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              {autocompleteList.length + matchedProducts.length + matchedCategories.length} suggestions &amp; matches
            </span>
          </div>

          {/* 1. Autocomplete Instant Search Suggestions Section */}
          {autocompleteList.length > 0 && (
            <div className="p-2 sm:p-3 bg-gradient-to-b from-amber-50/60 to-white dark:from-amber-950/20 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 mb-1">
                <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Autocomplete Suggestions
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Tap or press Enter ↵</span>
              </div>
              <div className="space-y-0.5">
                {autocompleteList.map((sug, sIdx) => {
                  const isCurSelected = selectedIndex === sIdx;
                  return (
                    <div
                      key={sug.id}
                      onClick={() => {
                        saveRecentSearch(sug.phrase);
                        if (sug.categorySlug && sug.type === 'category') {
                          onSelectCategory(sug.categorySlug);
                        } else {
                          onSearchSubmit(sug.phrase);
                        }
                        onClose();
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
                        isCurSelected
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 font-black shadow-2xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Search
                          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                            isCurSelected
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-400 group-hover:text-amber-500'
                          }`}
                        />
                        <span className="truncate">
                          <HighlightMatch text={sug.phrase} query={cleanQuery} />
                        </span>
                        {sug.category && (
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-950 text-amber-800 dark:text-amber-300 shrink-0 font-bold uppercase tracking-wider">
                            {sug.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {sug.itemCount !== undefined && (
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                            {sug.itemCount} {sug.itemCount === 1 ? 'item' : 'items'}
                          </span>
                        )}
                        {onFillQuery && (
                          <button
                            type="button"
                            title="Complete search query"
                            onClick={(e) => {
                              e.stopPropagation();
                              onFillQuery(sug.phrase);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
                          >
                            <CornerUpLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matched Categories Section */}
          {matchedCategories.length > 0 && (
            <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 block mb-2 px-1">
                Matching Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {matchedCategories.map((c, idx) => {
                  const isCurSelected = selectedIndex === autocompleteList.length + idx;
                  const IconComp = CATEGORY_ICONS[c.slug] || ShoppingBag;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(c.name);
                        onSelectCategory(c.slug);
                        onClose();
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                        isCurSelected
                          ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-400/40 scale-102'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        <HighlightMatch text={c.name} query={cleanQuery} />
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matched Products Section */}
          <div className="p-2 sm:p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 py-1 mb-1">
              <span>Matching Products ({matchedProducts.length})</span>
              <button
                type="button"
                onClick={() => {
                  saveRecentSearch(cleanQuery);
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
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No direct products found for "{query}"
                </p>
                <p className="text-[11px] text-slate-400">
                  Try broader terms like 'lehenga', 't-shirt', 'shoes', 'toys', or 'romper'
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {matchedProducts.map((p, pIdx) => {
                  const itemIndex = autocompleteList.length + matchedCategories.length + pIdx;
                  const isCurSelected = selectedIndex === itemIndex;

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        saveRecentSearch(p.name);
                        onSelectProduct(p);
                        onClose();
                      }}
                      className={`group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isCurSelected
                          ? 'bg-amber-50/90 dark:bg-amber-950/60 border-amber-300 dark:border-amber-600 ring-2 ring-amber-400/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 border-transparent hover:border-slate-100 dark:hover:border-slate-800'
                      }`}
                    >
                      {/* Thumbnail with rounded corners and fallback */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.pexels.com/photos/5693891/pexels-photo-5693891.jpeg?auto=compress&cs=tinysrgb&h=300';
                          }}
                        />
                      </div>

                      {/* Product Metadata & Highlighted Title */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 truncate">
                            <HighlightMatch text={p.brand || 'JOJI'} query={cleanQuery} />
                          </span>
                          {p.tag && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold uppercase shrink-0">
                              <HighlightMatch text={p.tag} query={cleanQuery} />
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          <HighlightMatch text={p.name} query={cleanQuery} />
                        </h4>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                            ₹{p.price}
                          </span>
                          {p.old_price && p.old_price > p.price && (
                            <span className="text-[11px] text-slate-400 line-through font-mono">
                              ₹{p.old_price}
                            </span>
                          )}
                          {p.discount_percent && p.discount_percent > 0 && (
                            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded">
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

                      {/* Right Action Chevron */}
                      <div className="text-slate-400 group-hover:text-amber-500 transition-colors pr-1 shrink-0">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Footer Button */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
            <span className="hidden sm:inline text-[11px] text-slate-400">
              Use <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-mono">↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-mono">Enter</kbd> to select
            </span>
            <button
              type="button"
              onClick={() => {
                saveRecentSearch(cleanQuery);
                onSearchSubmit(cleanQuery);
                onClose();
              }}
              className="ml-auto inline-flex items-center gap-1.5 font-black text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer text-xs"
            >
              <span>Search all for "{query}"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
