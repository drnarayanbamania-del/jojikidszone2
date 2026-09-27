import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  Search,
  CheckCircle2,
  Database,
  Sparkles,
  X,
  ShieldCheck,
  LogOut,
  Plus,
  PackageCheck,
  Sun,
  Moon,
  Instagram,
  Headphones
} from 'lucide-react';
import { FilterState, Product, Category } from '../types';
import { JojiLogo } from './JojiLogo';
import { JojiBrandTitle } from './JojiBrandTitle';
import { PredictiveSearchDropdown } from './PredictiveSearchDropdown';

interface HeaderProps {
  filter: FilterState;
  onFilterChange: (update: Partial<FilterState>) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  ordersCount?: number;
  cartBumpTrigger?: number;
  products?: Product[];
  categories?: Category[];
  onSelectProduct?: (product: Product) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrderHistory: () => void;
  onOpenDbStatus: () => void;
  isDbConnected: boolean;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  onAdminLogout: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenContactUs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filter,
  onFilterChange,
  cartCount,
  cartTotal,
  wishlistCount,
  ordersCount = 0,
  cartBumpTrigger = 0,
  products = [],
  categories = [],
  onSelectProduct,
  onOpenCart,
  onOpenWishlist,
  onOpenOrderHistory,
  onOpenDbStatus,
  isDbConnected,
  isAdmin,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onAdminLogout,
  isDarkMode = false,
  onToggleDarkMode,
  onOpenContactUs,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDesktopSearchDropdownOpen, setIsDesktopSearchDropdownOpen] = useState(false);
  const [isMobileSearchDropdownOpen, setIsMobileSearchDropdownOpen] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(cartCount);
  const prevTriggerRef = useRef(cartBumpTrigger);

  useEffect(() => {
    const triggerChanged = cartBumpTrigger > prevTriggerRef.current;
    const countIncreased = cartCount > prevCountRef.current;

    if (triggerChanged || countIncreased) {
      setIsPopping(true);
      const timer = setTimeout(() => {
        setIsPopping(false);
      }, 700);
      prevCountRef.current = cartCount;
      prevTriggerRef.current = cartBumpTrigger;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartCount;
    prevTriggerRef.current = cartBumpTrigger;
  }, [cartCount, cartBumpTrigger]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-100 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top promotional bar */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white text-xs font-semibold py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
              Special launch offer: Use code <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider text-amber-100 font-bold">JOJI15</span> for 15% OFF!
            </span>
          </div>

          {/* Instagram connect link & Contact Us */}
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <a
              href="https://www.instagram.com/jojiidszone.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all font-bold hover:scale-105 cursor-pointer shadow-2xs"
              title="Open Instagram page @jojiidszone.in"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-200" />
              <span>Instagram: <span className="underline decoration-pink-300">@jojiidszone.in</span></span>
            </a>

            {onOpenContactUs && (
              <button
                onClick={onOpenContactUs}
                className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400/30 hover:bg-amber-400/50 text-white transition-all font-bold cursor-pointer text-[11px]"
                title="Customer Help & Contact Us"
              >
                <Headphones className="w-3 h-3 text-amber-200" />
                <span>Contact Us</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onFilterChange({ selectedCategorySlug: 'all', selectedGender: 'all', searchQuery: '', tagFilter: null })}
              className="group flex items-center gap-2.5 text-left focus:outline-hidden cursor-pointer"
            >
              {/* Small and attractive official logo */}
              <JojiLogo size="md" className="group-hover:scale-105 transition-transform duration-200" />
              <div>
                <JojiBrandTitle size="md" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide flex items-center gap-1 mt-0.5">
                  <span className="font-bold text-[#EC4899]">Fashion</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="font-bold text-[#16A34A] dark:text-[#22C55E]">Fun</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="font-bold text-[#0284C7] dark:text-[#38BDF8]">Toys</span>
                  <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-slate-400 dark:text-slate-500">120 A.B. Road, Dewas</span>
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Search input */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div ref={desktopSearchContainerRef} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={filter.searchQuery}
                onFocus={() => setIsDesktopSearchDropdownOpen(true)}
                onChange={(e) => {
                  onFilterChange({ searchQuery: e.target.value });
                  setIsDesktopSearchDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsDesktopSearchDropdownOpen(false);
                  }
                }}
                placeholder="Search t-shirts, sets, shorts, shoes, denim..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100/80 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-amber-400 dark:focus:border-amber-500 rounded-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-3 focus:ring-amber-400/20 transition-all"
              />
              {filter.searchQuery && (
                <button
                  onClick={() => {
                    onFilterChange({ searchQuery: '' });
                    setIsDesktopSearchDropdownOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Predictive Real-time Search Dropdown */}
              <PredictiveSearchDropdown
                query={filter.searchQuery}
                products={products}
                categories={categories}
                isOpen={isDesktopSearchDropdownOpen}
                onClose={() => setIsDesktopSearchDropdownOpen(false)}
                onSelectProduct={(product) => {
                  if (onSelectProduct) {
                    onSelectProduct(product);
                  } else {
                    onFilterChange({ searchQuery: product.name });
                  }
                }}
                onSelectCategory={(slug) => {
                  onFilterChange({ selectedCategorySlug: slug, searchQuery: '' });
                }}
                onSearchSubmit={(q) => {
                  onFilterChange({ searchQuery: q });
                }}
              />
            </div>
          </div>

          {/* Actions & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Instagram Link Button */}
            <a
              id="header-instagram-link"
              href="https://www.instagram.com/jojiidszone.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-2 sm:p-2.5 rounded-full text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 transition-all cursor-pointer group shadow-2xs"
              aria-label="Connect on Instagram @jojiidszone.in"
              title="Connect with JOJI on Instagram (@jojiidszone.in)"
            >
              <Instagram className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
            </a>

            {/* Theme Toggle Button */}
            {onToggleDarkMode && (
              <button
                id="header-theme-toggle"
                onClick={onToggleDarkMode}
                className="relative p-2 sm:p-2.5 rounded-full text-slate-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer group shadow-2xs"
                aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 transition-transform duration-300 group-hover:-rotate-12" />
                )}
              </button>
            )}

            {/* Admin Access Button */}
            {isAdmin ? (
              <div className="flex items-center gap-1 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 rounded-full pl-2.5 pr-1 py-1">
                <button
                  onClick={onOpenAdminPanel}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-200 hover:text-amber-700 dark:hover:text-amber-100 transition-colors"
                  title="Open Admin Management Console"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span className="hidden sm:inline">Admin</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-500 text-white rounded-md font-extrabold">
                    Panel
                  </span>
                </button>
                <button
                  onClick={onAdminLogout}
                  title="Sign out of Admin"
                  className="p-1 rounded-full text-amber-800 dark:text-amber-300 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                title="Admin Login to Add or Delete Items & Categories"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 hover:text-amber-900 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            {/* Supabase Connection Verification Badge */}
            <button
              onClick={onOpenDbStatus}
              title="Click to check and verify Supabase database live status"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-200 dark:hover:border-emerald-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden lg:inline font-semibold">Supabase</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">Live</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 hidden sm:inline" />
            </button>

            {/* Mobile Search button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs animate-scale">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Orders History Button */}
            <button
              id="header-orders-btn"
              onClick={onOpenOrderHistory}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 hover:text-amber-900 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors cursor-pointer"
              aria-label="Order History & Reorder"
              title="View Past Orders & Reorder"
            >
              <PackageCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Orders</span>
              {ordersCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <motion.button
              id="header-cart-btn"
              onClick={onOpenCart}
              animate={
                isPopping
                  ? {
                      scale: [1, 1.06, 0.98, 1.02, 1],
                      boxShadow: [
                        '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
                        '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      ],
                    }
                  : { scale: 1 }
              }
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center gap-2.5 bg-slate-900 dark:bg-amber-500 hover:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 px-3.5 sm:px-4 py-2 rounded-full font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-95 group relative overflow-visible cursor-pointer"
              aria-label="Shopping Cart Bag"
              title="View Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                {/* Subtle ripple wave on pop */}
                {isPopping && (
                  <motion.span
                    initial={{ scale: 0.7, opacity: 0.9 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="absolute inset-0 -m-1 rounded-full bg-amber-400/40 pointer-events-none"
                  />
                )}

                {/* Popping Shopping Bag Icon */}
                <motion.div
                  animate={
                    isPopping
                      ? {
                          scale: [1, 1.34, 0.88, 1.12, 1],
                          rotate: [0, -9, 9, -4, 0],
                        }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                >
                  <ShoppingBag
                    className={`w-4 h-4 transition-colors ${
                      isPopping ? 'text-amber-400 dark:text-slate-950' : 'text-amber-300 dark:text-slate-950 group-hover:text-white dark:group-hover:text-slate-900'
                    }`}
                  />
                </motion.div>

                {/* Animated Badge Count */}
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </div>
              <span className="hidden sm:inline">Bag</span>
              {cartTotal > 0 && (
                <span className="hidden md:inline font-mono font-bold text-amber-200 dark:text-slate-950 group-hover:text-white dark:group-hover:text-slate-900 border-l border-white/20 dark:border-slate-950/30 pl-2">
                  ₹{cartTotal}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search input popup */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1">
            <div ref={mobileSearchContainerRef} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={filter.searchQuery}
                onFocus={() => setIsMobileSearchDropdownOpen(true)}
                onChange={(e) => {
                  onFilterChange({ searchQuery: e.target.value });
                  setIsMobileSearchDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsMobileSearchDropdownOpen(false);
                  }
                }}
                placeholder="Search products..."
                autoFocus
                className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
              {filter.searchQuery && (
                <button
                  onClick={() => {
                    onFilterChange({ searchQuery: '' });
                    setIsMobileSearchDropdownOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Predictive Real-time Search Dropdown for Mobile */}
              <PredictiveSearchDropdown
                query={filter.searchQuery}
                products={products}
                categories={categories}
                isOpen={isMobileSearchDropdownOpen}
                onClose={() => setIsMobileSearchDropdownOpen(false)}
                onSelectProduct={(product) => {
                  if (onSelectProduct) {
                    onSelectProduct(product);
                  } else {
                    onFilterChange({ searchQuery: product.name });
                  }
                  setMobileSearchOpen(false);
                }}
                onSelectCategory={(slug) => {
                  onFilterChange({ selectedCategorySlug: slug, searchQuery: '' });
                  setMobileSearchOpen(false);
                }}
                onSearchSubmit={(q) => {
                  onFilterChange({ searchQuery: q });
                  setMobileSearchOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Gender tabs navigation sub-bar */}
      <div className="bg-amber-50/40 dark:bg-slate-900/90 border-t border-amber-100/60 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-1.5 scrollbar-none gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'all', label: 'All Kids' },
              { id: 'boys', label: 'Boys Collection' },
              { id: 'girls', label: 'Girls Collection' },
              { id: 'unisex', label: 'Unisex Essentials' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onFilterChange({ selectedGender: tab.id })}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filter.selectedGender === tab.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Cotton & Safe Dyes</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>Easy 7-Day Returns</span>
          </div>
        </div>
      </div>

      {/* Admin Mode Quick Action Bar */}
      {isAdmin && (
        <div className="bg-slate-900 dark:bg-slate-950 text-white px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              Admin Mode Active:
            </span>
            <span className="text-slate-300 hidden md:inline">
              You can Add, Edit, or Delete any catalog items & categories directly.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdminPanel}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catalog & Category Manager</span>
            </button>
            <button
              onClick={onAdminLogout}
              className="px-2.5 py-1 bg-slate-800 hover:bg-rose-600/40 text-slate-300 hover:text-rose-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
