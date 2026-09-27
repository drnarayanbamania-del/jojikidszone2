import React, { useEffect, useState, useMemo } from 'react';
import {
  fetchProducts,
  fetchCategories,
  fetchCartItems,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  fetchWishlistItems,
  toggleWishlistItem,
  getSessionId,
  checkDatabaseHealth,
  deleteProduct,
} from './lib/supabase';
import { Product, Category, CartItemRecord, CartItemWithProduct, FilterState, AdminSession, PastOrder } from './types';
import { getPastOrders } from './lib/orderStorage';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryTiles } from './components/CategoryTiles';
import { CategoryChips } from './components/CategoryChips';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
import { DatabaseStatusModal } from './components/DatabaseStatusModal';
import { CustomerCareTracker } from './components/CustomerCareTracker';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminManagementModal } from './components/AdminManagementModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { ContactUsView } from './components/ContactUsView';
import { CustomerChatBot } from './components/CustomerChatBot';
import { SizeGuideModal } from './components/SizeGuideModal';
import {
  Filter,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Heart,
  CheckCircle2,
  Database,
  Truck,
  ShieldCheck,
  Award,
  PhoneCall,
  Mail,
  MapPin,
  PackageCheck,
  Instagram,
} from 'lucide-react';
import { JojiLogo } from './components/JojiLogo';
import { JojiBrandTitle } from './components/JojiBrandTitle';
import { DEMO_CATEGORIES, DEMO_CATALOG_PRODUCTS } from './lib/demoProducts';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartRecords, setCartRecords] = useState<CartItemRecord[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(true);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDbStatusOpen, setIsDbStatusOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);
  const [isGlobalSizeGuideOpen, setIsGlobalSizeGuideOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(() => getPastOrders());
  const [cartBumpTrigger, setCartBumpTrigger] = useState(0);

  const refreshPastOrders = () => {
    setPastOrders(getPastOrders());
  };

  // Admin Access & Session State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = localStorage.getItem('joji_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = !!adminSession;

  const handleAdminLogout = () => {
    localStorage.removeItem('joji_admin_session');
    setAdminSession(null);
    setIsAdminPanelOpen(false);
  };

  // Global Dark Mode Theme State with persistence & system preference detection
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('joji_theme');
      if (saved) return saved === 'dark';
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('joji_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('joji_theme', 'light');
      }
    } catch (e) {
      console.error('Failed to update theme:', e);
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Coupons
  const [couponCode, setCouponCode] = useState('JOJI15');
  const [appliedDiscount, setAppliedDiscount] = useState(0.15); // 15% default launch offer

  // Filter State
  const [filter, setFilter] = useState<FilterState>({
    searchQuery: '',
    selectedCategorySlug: 'all',
    selectedGender: 'all',
    sortBy: 'featured',
    tagFilter: null,
    maxPrice: 2000,
  });

  const sessionId = getSessionId();

  // Load Initial Data from Supabase & complement with Demo Catalogue
  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats, cart, wish, health] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchCartItems(sessionId),
        fetchWishlistItems(sessionId),
        checkDatabaseHealth(),
      ]);

      // Ensure all standard store categories exist for seamless browsing
      const combinedCategories = [...cats];
      DEMO_CATEGORIES.forEach((demoCat) => {
        if (!combinedCategories.some((c) => c.slug === demoCat.slug)) {
          combinedCategories.push(demoCat);
        }
      });
      setCategories(combinedCategories);

      // Merge Supabase products with rich demo items so every category (Toys, Footwear, Clothing, Accessories, Baby Care, Gifting)
      // is fully displayed with demo data until edited in the admin console.
      const existingProductIds = new Set(prods.map((p) => p.id));
      const existingProductNames = new Set(prods.map((p) => p.name.toLowerCase().trim()));

      const complementaryDemos = DEMO_CATALOG_PRODUCTS.filter(
        (demo) => !existingProductIds.has(demo.id) && !existingProductNames.has(demo.name.toLowerCase().trim())
      );

      setProducts([...prods, ...complementaryDemos]);
      setCartRecords(cart);
      setWishlistProductIds(new Set(wish.map((w) => w.product_id)));
      setIsDbConnected(health.connected && health.isSchemaReady);
    } catch (err) {
      console.warn('Notice loading Supabase data, continuing with catalog:', err);
      setCategories(DEMO_CATEGORIES);
      setProducts(DEMO_CATALOG_PRODUCTS);
      setIsDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProductFromCard = async (product: Product) => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    const confirmDelete = window.confirm(
      `Admin Action:\nAre you sure you want to delete "${product.name}"?\nThis will permanently remove it from the catalog & database.`
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);
      await loadData();
    } catch (err: any) {
      console.error('Failed deleting product:', err);
      alert('Error deleting item: ' + (err.message || 'Database error'));
    }
  };

  const handleEditProductFromCard = (product: Product) => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
      return;
    }
    setIsAdminPanelOpen(true);
  };

  const handleFilterChange = (update: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...update }));
  };

  // Helper to deduce category slug when category_id is null in Supabase
  const getProductCategorySlug = (product: Product): string => {
    if (product.category_id) {
      const matched = categories.find((c) => c.id === product.category_id);
      if (matched) return matched.slug;
    }
    const nameLower = product.name.toLowerCase();
    if (nameLower.includes('sneaker') || nameLower.includes('shoe') || nameLower.includes('sandal')) {
      return 'footwear';
    }
    if (nameLower.includes('baby') || nameLower.includes('care') || nameLower.includes('lotion')) {
      return 'baby-care';
    }
    if (nameLower.includes('toy') || nameLower.includes('game') || nameLower.includes('puzzle')) {
      return 'toys';
    }
    if (nameLower.includes('bag') || nameLower.includes('cap') || nameLower.includes('glasses')) {
      return 'accessories';
    }
    if (nameLower.includes('gift') || nameLower.includes('box')) {
      return 'gifting';
    }
    return 'clothing';
  };

  // Category counts
  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.slug] = 0;
    });
    products.forEach((p) => {
      const slug = getProductCategorySlug(p);
      counts[slug] = (counts[slug] || 0) + 1;
    });
    return counts;
  }, [products, categories]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesTag = p.tag?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesTag) return false;
      }

      // Category
      if (filter.selectedCategorySlug !== 'all') {
        const slug = getProductCategorySlug(p);
        if (slug !== filter.selectedCategorySlug) return false;
      }

      // Gender
      if (filter.selectedGender !== 'all') {
        if (p.gender && p.gender !== 'unisex' && p.gender !== filter.selectedGender) {
          return false;
        }
      }

      // Tag filter
      if (filter.tagFilter) {
        if (p.tag?.toUpperCase() !== filter.tagFilter.toUpperCase()) {
          return false;
        }
      }

      // Max price
      if (p.price > filter.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filter.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return (b.discount_percent || 0) - (a.discount_percent || 0);
        case 'featured':
        default:
          return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
      }
    });
  }, [products, filter, categories]);

  // Cart items with product details
  const cartItemsWithProduct: CartItemWithProduct[] = useMemo(() => {
    return cartRecords
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) return null;
        return {
          ...item,
          product,
        };
      })
      .filter((item): item is CartItemWithProduct => item !== null);
  }, [cartRecords, products]);

  const totalCartCount = cartItemsWithProduct.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItemsWithProduct.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Cart operations
  const handleAddToCart = async (productId: string, size: string | null) => {
    // Trigger subtle pop animation on cart icon
    setCartBumpTrigger((prev) => prev + 1);

    // Optimistic local update
    const existingIndex = cartRecords.findIndex(
      (r) => r.product_id === productId && (!size || r.size === size)
    );

    if (existingIndex > -1) {
      const updated = [...cartRecords];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      setCartRecords(updated);
    } else {
      const tempItem: CartItemRecord = {
        id: 'temp_' + Date.now(),
        session_id: sessionId,
        product_id: productId,
        quantity: 1,
        size,
        created_at: new Date().toISOString(),
      };
      setCartRecords((prev) => [...prev, tempItem]);
    }

    // Supabase update
    try {
      const record = await addToCart(sessionId, productId, 1, size);
      if (record) {
        // Refresh cart to ensure consistency
        const refreshed = await fetchCartItems(sessionId);
        setCartRecords(refreshed);
      }
    } catch (err) {
      console.warn('Notice adding to cart:', err);
    }
  };

  const handleUpdateCartQuantity = async (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCartRecords((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item))
    );
    await updateCartItemQuantity(itemId, qty, sessionId);
  };

  const handleRemoveCartItem = async (itemId: string) => {
    setCartRecords((prev) => prev.filter((item) => item.id !== itemId));
    await removeCartItem(itemId, sessionId);
  };

  // Wishlist operations
  const handleToggleWishlist = async (productId: string) => {
    const isCurrentlySaved = wishlistProductIds.has(productId);
    const updated = new Set(wishlistProductIds);
    if (isCurrentlySaved) {
      updated.delete(productId);
    } else {
      updated.add(productId);
    }
    setWishlistProductIds(updated);

    try {
      await toggleWishlistItem(sessionId, productId);
    } catch (err) {
      console.warn('Notice toggling wishlist:', err);
    }
  };

  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlistProductIds.has(p.id));
  }, [products, wishlistProductIds]);

  const handleMoveWishlistToCart = (productId: string) => {
    handleAddToCart(productId, '3-4Y');
    handleToggleWishlist(productId);
  };

  // Order History Reordering Operations
  const handleReorderSingleItem = async (productId: string, size?: string | null, quantity: number = 1) => {
    const targetProduct =
      products.find((p) => p.id === productId || p.name.toLowerCase().includes(productId.toLowerCase())) ||
      products[0];
    if (targetProduct) {
      for (let i = 0; i < (quantity || 1); i++) {
        await handleAddToCart(targetProduct.id, size || null);
      }
    }
  };

  const handleReorderEntireOrder = async (order: PastOrder) => {
    for (const item of order.items) {
      const targetProduct =
        products.find((p) => p.id === item.productId || p.name.toLowerCase() === item.name.toLowerCase()) ||
        products[0];
      if (targetProduct) {
        for (let i = 0; i < (item.quantity || 1); i++) {
          await handleAddToCart(targetProduct.id, item.size || null);
        }
      }
    }
  };

  const handleOrderCompleted = async () => {
    setCartRecords([]);
    await clearCart(sessionId);
    refreshPastOrders();
  };

  const freeShippingThreshold = 999;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartItemsWithProduct.length === 0 ? 0 : 99;
  const discountAmount = Math.round(cartSubtotal * appliedDiscount);
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + (cartItemsWithProduct.length > 0 ? shippingFee : 0));

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/20 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <Header
        filter={filter}
        onFilterChange={handleFilterChange}
        cartCount={totalCartCount}
        cartTotal={cartSubtotal}
        wishlistCount={wishlistProductIds.size}
        ordersCount={pastOrders.length}
        cartBumpTrigger={cartBumpTrigger}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        onOpenDbStatus={() => setIsDbStatusOpen(true)}
        isDbConnected={isDbConnected}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onAdminLogout={handleAdminLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        products={products}
        categories={categories}
        onSelectProduct={(product) => {
          setQuickViewProduct(product);
          setIsContactUsOpen(false);
        }}
        onOpenContactUs={() => {
          setIsContactUsOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {isContactUsOpen ? (
        <ContactUsView
          onBackToHome={() => setIsContactUsOpen(false)}
          onOpenOrderHistory={() => {
            setIsOrderHistoryOpen(true);
          }}
          onOpenTrackModal={(orderId) => {
            if (orderId) setTrackedOrderId(orderId);
            setIsTrackModalOpen(true);
          }}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        />
      ) : (
        /* Main Content Area */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Hero Promotional Banner */}
        <HeroBanner
          onQuickFilter={(tag, maxP) => {
            handleFilterChange({
              tagFilter: tag,
              maxPrice: maxP ?? 2000,
              selectedCategorySlug: 'all',
              searchQuery: '',
            });
          }}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
          onOpenTrackingModal={() => setIsTrackModalOpen(true)}
          onSelectCategory={(slug) => handleFilterChange({ selectedCategorySlug: slug })}
        />

        {/* Category Visual Hub / Photo Tiles */}
        <CategoryTiles
          categories={categories}
          selectedCategorySlug={filter.selectedCategorySlug}
          onSelectCategory={(slug) => handleFilterChange({ selectedCategorySlug: slug })}
          productCountByCategory={productCountByCategory}
          totalProducts={products.length}
        />

        {/* Categories Quick Filter Chips */}
        <CategoryChips
          categories={categories}
          selectedCategorySlug={filter.selectedCategorySlug}
          onSelectCategory={(slug) => handleFilterChange({ selectedCategorySlug: slug })}
          productCountByCategory={productCountByCategory}
          totalProducts={products.length}
          isAdmin={isAdmin}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        />

        {/* Filter Controls & Products Header */}
        <div id="products-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                  {filter.selectedCategorySlug === 'all'
                    ? 'All Kids Outfits & Essentials'
                    : categories.find((c) => c.slug === filter.selectedCategorySlug)?.name || 'Collection'}
                </h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xs">
                  {filteredProducts.length} items
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                Soft organic fabrics, tested for playground durability and all-day comfort.
              </p>
            </div>

            {/* Sorting & Filter controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Sort By selector */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-2xs text-xs font-semibold text-slate-700 dark:text-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-medium">Sort:</span>
                <select
                  value={filter.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                >
                  <option value="featured" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Featured / Bestseller</option>
                  <option value="price-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Price: Low to High</option>
                  <option value="price-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Price: High to Low</option>
                  <option value="rating" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Customer Rating</option>
                  <option value="discount" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Biggest Discount</option>
                </select>
              </div>

              {/* Tag filters (Bestseller, New, Trending) */}
              {filter.tagFilter && (
                <button
                  onClick={() => handleFilterChange({ tagFilter: null })}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Tag: {filter.tagFilter}</span>
                  <span className="text-xs">×</span>
                </button>
              )}

              {/* Reset button if filtered */}
              {(filter.searchQuery ||
                filter.selectedCategorySlug !== 'all' ||
                filter.selectedGender !== 'all' ||
                filter.tagFilter ||
                filter.maxPrice < 2000) && (
                <button
                  onClick={() =>
                    setFilter({
                      searchQuery: '',
                      selectedCategorySlug: 'all',
                      selectedGender: 'all',
                      sortBy: 'featured',
                      tagFilter: null,
                      maxPrice: 2000,
                    })
                  }
                  className="flex items-center gap-1 px-2.5 py-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Clear all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Active filter pills */}
          {(filter.selectedGender !== 'all' || filter.searchQuery || filter.tagFilter) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Active Filters:</span>
              {filter.selectedGender !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                  Gender: <span className="capitalize">{filter.selectedGender}</span>
                  <button onClick={() => handleFilterChange({ selectedGender: 'all' })} className="cursor-pointer">×</button>
                </span>
              )}
              {filter.searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700">
                  Search: "{filter.searchQuery}"
                  <button onClick={() => handleFilterChange({ searchQuery: '' })} className="cursor-pointer">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5 lg:gap-5.5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                <div className="aspect-square sm:aspect-4/5 bg-slate-200 dark:bg-slate-800 rounded-xl sm:rounded-2xl w-full" />
                <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Filter className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                No matching products found
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 max-w-sm mx-auto">
                Try loosening your filters, removing search terms, or exploring other categories.
              </p>
            </div>
            <button
              onClick={() =>
                setFilter({
                  searchQuery: '',
                  selectedCategorySlug: 'all',
                  selectedGender: 'all',
                  sortBy: 'featured',
                  tagFilter: null,
                  maxPrice: 2000,
                })
              }
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5 lg:gap-5.5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistProductIds.has(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(prodId, size) => handleAddToCart(prodId, size)}
                onQuickView={(prod) => setQuickViewProduct(prod)}
                isAdmin={isAdmin}
                onDeleteProduct={handleDeleteProductFromCard}
                onEditProduct={handleEditProductFromCard}
              />
            ))}
          </div>
        )}

        {/* Why Parents Love Joji Section */}
        <div className="mt-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xs transition-colors">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
              Designed with Love for Growing Kids
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Every garment and sneaker undergoes rigorous safety and wash tests before reaching your home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-100 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Zero Scratchy Tags</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Printed neck labels and ultra-flat seams ensure complete sensory comfort for sensitive skin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-orange-50/50 dark:bg-slate-800/60 border border-orange-100 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Non-Toxic Certified</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Colours and prints are tested lead-free, nickel-free, and phthalate-free for complete peace of mind.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/50 dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700/60">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Express Delivery & Returns</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Free home pickup for exchanges and returns within 7 days. Prompt refunds with no friction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Brand Info with small attractive logo */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <JojiLogo size="sm" />
                <div>
                  <JojiBrandTitle size="sm" />
                  <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase block">
                    Kids Wear &amp; Toys
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Premium, sensory-friendly clothing, shoes, and fun learning toys designed for infants, toddlers, and active kids. Fashion for kids • Fun for life.
              </p>

              {/* Instagram Highlight Button */}
              <a
                href="https://www.instagram.com/jojiidszone.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-pink-900/30 transition-all hover:scale-[1.02] cursor-pointer"
                title="Connect with us on Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>Connect @jojiidszone.in</span>
              </a>

              <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected to Supabase Live Backend</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
                Shop By Category
              </h4>
              <ul className="space-y-2 text-slate-400">
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => handleFilterChange({ selectedCategorySlug: c.slug })}
                      className="hover:text-amber-400 transition-colors text-left capitalize cursor-pointer"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care with Track My Order */}
            <CustomerCareTracker
              onOpenWishlist={() => setIsWishlistOpen(true)}
              onOpenDbStatus={() => setIsDbStatusOpen(true)}
              onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
              onOpenTrackingModal={(id) => {
                setTrackedOrderId(id);
                setIsTrackModalOpen(true);
              }}
              onOpenContactUs={() => {
                setIsContactUsOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Contact & Support */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
                Store &amp; Contact
              </h4>
              <div className="space-y-2.5 text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">120 A.B. Road, Dewas</p>
                    <p className="text-[11px] text-slate-400">Madhya Pradesh, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <a href="tel:7415432020" className="hover:text-amber-300 font-bold text-white transition-colors">
                    7415432020
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <a
                    href="https://www.instagram.com/jojiidszone.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-300 font-medium text-pink-300 transition-colors underline decoration-pink-500/50"
                  >
                    @jojiidszone.in
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>support@jojikidszone.com</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsContactUsOpen(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Help Center &amp; Contact Us →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 JOJI KIDS ZONE. All rights reserved. Powered by Supabase Live Database.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (isAdmin) {
                    setIsAdminPanelOpen(true);
                  } else {
                    setIsAdminLoginOpen(true);
                  }
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Admin Console' : 'Admin Login'}</span>
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setIsDbStatusOpen(true)}
                className="text-slate-400 hover:text-amber-400 underline font-mono text-[11px]"
              >
                Supabase Diagnostics
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick View Product Modal */}
      <ProductDetailsModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlistProductIds.has(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItemsWithProduct}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        couponCode={couponCode}
        appliedDiscount={appliedDiscount}
        onApplyCoupon={(code) => {
          setCouponCode(code);
          setAppliedDiscount(0.15);
        }}
        onRemoveCoupon={() => {
          setCouponCode('');
          setAppliedDiscount(0);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItemsWithProduct}
        subtotal={cartSubtotal}
        discountAmount={discountAmount}
        shippingFee={shippingFee}
        grandTotal={grandTotal}
        couponCode={couponCode}
        onOrderCompleted={handleOrderCompleted}
        onTrackOrder={(id) => {
          setTrackedOrderId(id);
          setIsTrackModalOpen(true);
        }}
        onViewOrderHistory={() => {
          setIsOrderHistoryOpen(true);
          refreshPastOrders();
        }}
      />

      {/* User Order History & One-Click Reorder Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={pastOrders}
        onReorderItem={(productId, size, qty) => {
          handleReorderSingleItem(productId, size, qty);
          setIsCartOpen(true);
        }}
        onReorderEntireOrder={(order) => {
          handleReorderEntireOrder(order);
          setIsCartOpen(true);
        }}
        onTrackOrder={(id) => {
          setTrackedOrderId(id);
          setIsTrackModalOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onRefreshOrders={refreshPastOrders}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistedProducts={wishlistedProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveWishlistToCart}
      />

      {/* Database Verification & Status Modal ("Check and Verify") */}
      <DatabaseStatusModal
        isOpen={isDbStatusOpen}
        onClose={() => setIsDbStatusOpen(false)}
        onSessionReset={loadData}
      />

      {/* Track Order Journey Modal */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        orderId={trackedOrderId || 'JOJI-742918'}
      />

      {/* Admin Authentication Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(session) => {
          setAdminSession(session);
          setIsAdminPanelOpen(true);
        }}
      />

      {/* Admin Management Dashboard (Add, Edit, Delete Items & Categories) */}
      <AdminManagementModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        products={products}
        categories={categories}
        adminSession={adminSession}
        onLogout={handleAdminLogout}
        onRefreshData={loadData}
      />

      {/* Floating Customer Care Assistant ChatBot */}
      <CustomerChatBot
        onOpenTrackOrder={(orderId) => {
          if (orderId) setTrackedOrderId(orderId);
          setIsTrackModalOpen(true);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenContactUs={() => setIsContactUsOpen(true)}
        onSelectCategory={(categorySlug) => {
          handleFilterChange({ selectedCategorySlug: categorySlug });
          setTimeout(() => {
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenSizeGuide={() => setIsGlobalSizeGuideOpen(true)}
        categories={categories}
        pastOrders={pastOrders}
        isDarkMode={isDarkMode}
      />

      {/* Global Size Guide Modal */}
      <SizeGuideModal
        isOpen={isGlobalSizeGuideOpen}
        onClose={() => setIsGlobalSizeGuideOpen(false)}
        productName="Kids Outfits & Shoes"
        onSelectSize={() => {}}
      />
    </div>
  );
}
