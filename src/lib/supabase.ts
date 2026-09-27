import { createClient } from '@supabase/supabase-js';
import { Product, Category, CartItemRecord, WishlistItemRecord, ProductReview } from '../types';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://wwxalepbdmfjdzadisgp.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_1OEdrMFm5H-OFQBBYelUqA_M-MYfFO9';

export const SUPABASE_JWKS_URL =
  'https://wwxalepbdmfjdzadisgp.supabase.co/auth/v1/.well-known/jwks.json';

export const SUPABASE_DASHBOARD_SQL_URL =
  'https://supabase.com/dashboard/project/wwxalepbdmfjdzadisgp/sql/new';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SESSION_KEY = 'joji_kids_session_id';
const DEFAULT_PRESET_SESSION = '4ca551ab-09b3-452e-a7b4-e39fe2b0433f';

const CART_STORAGE_PREFIX = 'joji_local_cart_';
const WISHLIST_STORAGE_PREFIX = 'joji_local_wishlist_';

export function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = typeof error.message === 'string' ? error.message.toLowerCase() : '';
  return (
    error.code === 'PGRST205' ||
    error.code === '42P01' ||
    msg.includes('schema cache') ||
    (msg.includes('relation') && msg.includes('does not exist')) ||
    msg.includes('could not find the table')
  );
}

// ----------------------------------------------------
// Local Storage Resilient Fallbacks
// ----------------------------------------------------
function getLocalCart(sessionId: string): CartItemRecord[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_PREFIX + sessionId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(sessionId: string, items: CartItemRecord[]): void {
  try {
    localStorage.setItem(CART_STORAGE_PREFIX + sessionId, JSON.stringify(items));
  } catch (e) {
    console.warn('Notice: local cart update:', e);
  }
}

function getLocalWishlist(sessionId: string): WishlistItemRecord[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_PREFIX + sessionId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalWishlist(sessionId: string, items: WishlistItemRecord[]): void {
  try {
    localStorage.setItem(WISHLIST_STORAGE_PREFIX + sessionId, JSON.stringify(items));
  } catch (e) {
    console.warn('Notice: local wishlist update:', e);
  }
}

// ----------------------------------------------------
// Product Reviews Local Storage & Starter Seed
// ----------------------------------------------------
const REVIEWS_STORAGE_PREFIX = 'joji_product_reviews_';

const SEED_REVIEW_TEMPLATES = [
  {
    user_name: 'Pooja Deshmukh',
    rating: 5,
    title: 'Super soft material & perfect sizing!',
    comment: 'Ordered this for my 4yo daughter. The fabric is 100% pure breathable cotton and didn’t fade after washing. Gentle on sensitive skin with no itchy seams.',
    daysAgo: 2,
    helpful_count: 14,
  },
  {
    user_name: 'Vikram Mehta',
    rating: 5,
    title: 'Kids friendly design & high durability',
    comment: 'My son runs around all day in this. Colors are bright, stretch is natural, and stitches hold up amazingly well. Highly recommended for daily play.',
    daysAgo: 5,
    helpful_count: 9,
  },
  {
    user_name: 'Dr. Shalini Rao',
    rating: 4,
    title: 'Prompt delivery & looks exactly as shown',
    comment: 'Delivered in clean packaging within 24 hours. Fitting is true to size chart. Happy with the purchase and will order again.',
    daysAgo: 9,
    helpful_count: 6,
  },
];

function generateDefaultReviews(productId: string): ProductReview[] {
  const now = Date.now();
  return SEED_REVIEW_TEMPLATES.map((tmpl, idx) => ({
    id: `seed_rev_${productId}_${idx}`,
    product_id: productId,
    user_name: tmpl.user_name,
    rating: tmpl.rating,
    title: tmpl.title,
    comment: tmpl.comment,
    verified_purchase: true,
    helpful_count: tmpl.helpful_count,
    created_at: new Date(now - tmpl.daysAgo * 86400000).toISOString(),
  }));
}

function getLocalReviews(productId: string): ProductReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_PREFIX + productId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Return generated sample reviews and cache them
    const defaults = generateDefaultReviews(productId);
    localStorage.setItem(REVIEWS_STORAGE_PREFIX + productId, JSON.stringify(defaults));
    return defaults;
  } catch {
    return generateDefaultReviews(productId);
  }
}

function saveLocalReview(review: ProductReview): void {
  try {
    const current = getLocalReviews(review.product_id);
    const updated = [review, ...current.filter((r) => r.id !== review.id)];
    localStorage.setItem(REVIEWS_STORAGE_PREFIX + review.product_id, JSON.stringify(updated));
  } catch (e) {
    console.warn('Notice: local review save:', e);
  }
}

function updateLocalReviewHelpful(reviewId: string, helpfulCount: number): void {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(REVIEWS_STORAGE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const list: ProductReview[] = JSON.parse(raw);
          const found = list.find((r) => r.id === reviewId);
          if (found) {
            found.helpful_count = helpfulCount;
            localStorage.setItem(key, JSON.stringify(list));
            break;
          }
        }
      }
    }
  } catch (e) {
    console.warn('Notice: local review vote update:', e);
  }
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return DEFAULT_PRESET_SESSION;
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = DEFAULT_PRESET_SESSION;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function resetSessionId(): string {
  const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'session_' + Date.now();
  localStorage.setItem(SESSION_KEY, newId);
  return newId;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (isTableMissingError(error)) {
        // Table not created yet in Supabase schema - return empty without throwing
        return [];
      }
      console.warn('Notice fetching products from Supabase:', error.message);
      return [];
    }
    return (data || []) as Product[];
  } catch (err: any) {
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      if (isTableMissingError(error)) {
        // Table not created yet in Supabase schema - return empty without throwing
        return [];
      }
      console.warn('Notice fetching categories from Supabase:', error.message);
      return [];
    }
    return (data || []) as Category[];
  } catch (err: any) {
    return [];
  }
}

export async function fetchCartItems(sessionId: string): Promise<CartItemRecord[]> {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return getLocalCart(sessionId);
    }
    if (data && data.length > 0) {
      return data as CartItemRecord[];
    }
    return getLocalCart(sessionId);
  } catch {
    return getLocalCart(sessionId);
  }
}

export async function addToCart(
  sessionId: string,
  productId: string,
  quantity: number = 1,
  size: string | null = null
): Promise<CartItemRecord | null> {
  // Helper for local cart insertion
  const addLocally = (): CartItemRecord => {
    const local = getLocalCart(sessionId);
    const existingIndex = local.findIndex(
      (item) => item.product_id === productId && item.size === size
    );
    if (existingIndex > -1) {
      local[existingIndex].quantity += quantity;
      saveLocalCart(sessionId, local);
      return local[existingIndex];
    } else {
      const newItem: CartItemRecord = {
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        session_id: sessionId,
        product_id: productId,
        quantity,
        size,
        created_at: new Date().toISOString(),
      };
      local.push(newItem);
      saveLocalCart(sessionId, local);
      return newItem;
    }
  };

  try {
    // Check if item with matching product and size already exists
    let query = supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', productId);

    if (size) {
      query = query.eq('size', size);
    }

    const { data: existing, error: selectErr } = await query;

    if (selectErr) {
      return addLocally();
    }

    if (existing && existing.length > 0) {
      const item = existing[0];
      const newQuantity = (item.quantity || 1) + quantity;
      const { data: updated, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', item.id)
        .select()
        .single();

      if (error) {
        return addLocally();
      }
      return updated as CartItemRecord;
    } else {
      const { data: inserted, error } = await supabase
        .from('cart_items')
        .insert({
          session_id: sessionId,
          product_id: productId,
          quantity,
          size
        })
        .select()
        .single();

      if (error) {
        return addLocally();
      }
      return inserted as CartItemRecord;
    }
  } catch {
    return addLocally();
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number, sessionId?: string): Promise<boolean> {
  if (quantity <= 0) {
    return removeCartItem(itemId, sessionId);
  }

  // Update local cart if session provided
  if (sessionId) {
    const local = getLocalCart(sessionId);
    const item = local.find((i) => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      saveLocalCart(sessionId, local);
    }
  }

  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    return !error;
  } catch {
    return true;
  }
}

export async function removeCartItem(itemId: string, sessionId?: string): Promise<boolean> {
  if (sessionId) {
    const local = getLocalCart(sessionId);
    const filtered = local.filter((i) => i.id !== itemId);
    saveLocalCart(sessionId, filtered);
  }

  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    return !error;
  } catch {
    return true;
  }
}

export async function clearCart(sessionId: string): Promise<boolean> {
  saveLocalCart(sessionId, []);
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    return !error;
  } catch {
    return true;
  }
}

export async function fetchWishlistItems(sessionId: string): Promise<WishlistItemRecord[]> {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('session_id', sessionId);

    if (error) {
      return getLocalWishlist(sessionId);
    }
    if (data && data.length > 0) {
      return data as WishlistItemRecord[];
    }
    return getLocalWishlist(sessionId);
  } catch {
    return getLocalWishlist(sessionId);
  }
}

export async function toggleWishlistItem(sessionId: string, productId: string): Promise<boolean> {
  const local = getLocalWishlist(sessionId);
  const existsLocally = local.some((w) => w.product_id === productId);

  if (existsLocally) {
    const filtered = local.filter((w) => w.product_id !== productId);
    saveLocalWishlist(sessionId, filtered);
  } else {
    local.push({
      id: 'wish_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      session_id: sessionId,
      product_id: productId,
      created_at: new Date().toISOString(),
    });
    saveLocalWishlist(sessionId, local);
  }

  try {
    const { data: existing, error: selectErr } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('session_id', sessionId)
      .eq('product_id', productId);

    if (selectErr) {
      return !existsLocally;
    }

    if (existing && existing.length > 0) {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', existing[0].id);
      return !error ? false : true;
    } else {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({ session_id: sessionId, product_id: productId });
      return !error ? true : false;
    }
  } catch {
    return !existsLocally;
  }
}

// ----------------------------------------------------
// Product Reviews Operations (Supabase + Local Fallback)
// ----------------------------------------------------
export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      return getLocalReviews(productId);
    }
    if (data && data.length > 0) {
      return data as ProductReview[];
    }
    return getLocalReviews(productId);
  } catch {
    return getLocalReviews(productId);
  }
}

export async function addProductReview(reviewData: {
  product_id: string;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  verified_purchase?: boolean;
}): Promise<ProductReview> {
  const newReview: ProductReview = {
    id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    product_id: reviewData.product_id,
    user_name: reviewData.user_name.trim() || 'Parent Customer',
    rating: Math.max(1, Math.min(5, reviewData.rating)),
    title: reviewData.title?.trim() || undefined,
    comment: reviewData.comment.trim(),
    verified_purchase: reviewData.verified_purchase ?? true,
    helpful_count: 0,
    created_at: new Date().toISOString(),
  };

  // Always store locally so user sees their review immediately
  saveLocalReview(newReview);

  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .insert({
        id: newReview.id,
        product_id: newReview.product_id,
        user_name: newReview.user_name,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        verified_purchase: newReview.verified_purchase,
        helpful_count: newReview.helpful_count,
      })
      .select()
      .single();

    if (!error && data) {
      return data as ProductReview;
    }
    return newReview;
  } catch {
    return newReview;
  }
}

export async function voteHelpfulReview(reviewId: string, currentCount: number): Promise<number> {
  const newCount = currentCount + 1;
  updateLocalReviewHelpful(reviewId, newCount);

  try {
    await supabase
      .from('product_reviews')
      .update({ helpful_count: newCount })
      .eq('id', reviewId);
  } catch {
    // Local update already applied
  }
  return newCount;
}

export interface HealthCheckReport {
  connected: boolean;
  isSchemaReady: boolean;
  latencyMs: number;
  url: string;
  tables: {
    products: { ok: boolean; count: number; error?: string };
    categories: { ok: boolean; count: number; error?: string };
    cart_items: { ok: boolean; count: number; error?: string };
    wishlist_items: { ok: boolean; count: number; error?: string };
    product_reviews?: { ok: boolean; count: number; error?: string };
  };
  timestamp: string;
}

export async function checkDatabaseHealth(): Promise<HealthCheckReport> {
  const startTime = Date.now();
  const report: HealthCheckReport = {
    connected: false,
    isSchemaReady: false,
    latencyMs: 0,
    url: SUPABASE_URL,
    tables: {
      products: { ok: false, count: 0 },
      categories: { ok: false, count: 0 },
      cart_items: { ok: false, count: 0 },
      wishlist_items: { ok: false, count: 0 },
      product_reviews: { ok: false, count: 0 },
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const [pRes, cRes, cartRes, wishRes, revRes] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('cart_items').select('*', { count: 'exact', head: true }),
      supabase.from('wishlist_items').select('*', { count: 'exact', head: true }),
      supabase.from('product_reviews').select('*', { count: 'exact', head: true }),
    ]);

    report.latencyMs = Date.now() - startTime;
    report.connected = true;
    report.isSchemaReady = !pRes.error && !cRes.error;

    report.tables.products = {
      ok: !pRes.error,
      count: pRes.count ?? 0,
      error: pRes.error ? (isTableMissingError(pRes.error) ? 'Table pending SQL setup' : pRes.error.message) : undefined,
    };
    report.tables.categories = {
      ok: !cRes.error,
      count: cRes.count ?? 0,
      error: cRes.error ? (isTableMissingError(cRes.error) ? 'Table pending SQL setup' : cRes.error.message) : undefined,
    };
    report.tables.cart_items = {
      ok: !cartRes.error,
      count: cartRes.count ?? 0,
      error: cartRes.error ? (isTableMissingError(cartRes.error) ? 'Table pending SQL setup' : cartRes.error.message) : undefined,
    };
    report.tables.wishlist_items = {
      ok: !wishRes.error,
      count: wishRes.count ?? 0,
      error: wishRes.error ? (isTableMissingError(wishRes.error) ? 'Table pending SQL setup' : wishRes.error.message) : undefined,
    };
    report.tables.product_reviews = {
      ok: !revRes.error,
      count: revRes.count ?? 0,
      error: revRes.error ? (isTableMissingError(revRes.error) ? 'Table pending SQL setup' : revRes.error.message) : undefined,
    };
  } catch (err: any) {
    report.connected = false;
    report.isSchemaReady = false;
    report.latencyMs = Date.now() - startTime;
  }

  return report;
}

export const SUPABASE_SETUP_SQL = `-- JOJI KIDS ZONE - Supabase Database Schema & Setup Script
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/wwxalepbdmfjdzadisgp/sql/new

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT DEFAULT 'Sparkles',
    sort_order INT DEFAULT 0,
    image_url TEXT,
    description TEXT,
    brand_tagline TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    brand TEXT DEFAULT 'JOJI KIDS ZONE' NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    discount_percent INT,
    image_url TEXT NOT NULL,
    tag TEXT,
    color_theme TEXT DEFAULT 'amber',
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    gender TEXT DEFAULT 'unisex',
    age_group TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    is_bestseller BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    size TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_session_product UNIQUE(session_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT true,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) DEFAULT 0,
    payment_method TEXT DEFAULT 'cod',
    status TEXT DEFAULT 'Confirmed',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Public delete categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Public read cart_items" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Public insert cart_items" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update cart_items" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Public delete cart_items" ON public.cart_items FOR DELETE USING (true);

CREATE POLICY "Public read wishlist_items" ON public.wishlist_items FOR SELECT USING (true);
CREATE POLICY "Public insert wishlist_items" ON public.wishlist_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete wishlist_items" ON public.wishlist_items FOR DELETE USING (true);

CREATE POLICY "Public read product_reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Public insert product_reviews" ON public.product_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update product_reviews" ON public.product_reviews FOR UPDATE USING (true);
CREATE POLICY "Public delete product_reviews" ON public.product_reviews FOR DELETE USING (true);

CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

INSERT INTO public.categories (name, slug, icon_name, sort_order) VALUES
  ('Clothing & Ethnic', 'clothing', 'Shirt', 1),
  ('Footwear', 'footwear', 'Footprints', 2),
  ('Toys & Learning', 'toys', 'Sparkles', 3),
  ('Accessories', 'accessories', 'Watch', 4),
  ('Baby Care', 'baby-care', 'Smile', 5),
  ('Gifts & Combos', 'gifts', 'Gift', 6)
ON CONFLICT (slug) DO NOTHING;
`;

// ----------------------------------------------------
// Admin Product CRUD Operations
// ----------------------------------------------------
export async function addProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string }
): Promise<Product> {
  const newProduct: any = {
    name: productData.name,
    brand: productData.brand || 'JOJI KIDS',
    description: productData.description || null,
    price: Number(productData.price),
    old_price: productData.old_price ? Number(productData.old_price) : null,
    discount_percent:
      productData.discount_percent ??
      (productData.old_price && productData.old_price > productData.price
        ? Math.round(((productData.old_price - productData.price) / productData.old_price) * 100)
        : null),
    image_url: productData.image_url,
    tag: productData.tag || null,
    color_theme: productData.color_theme || 'amber',
    category_id: productData.category_id || null,
    gender: productData.gender || 'unisex',
    age_group: productData.age_group || null,
    rating: productData.rating || 4.8,
    is_bestseller: !!productData.is_bestseller,
    is_active: productData.is_active ?? true,
  };

  const { data, error } = await supabase
    .from('products')
    .insert(newProduct)
    .select()
    .single();

  if (error) {
    console.error('Error adding product to Supabase:', error);
    throw error;
  }
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const cleanUpdates = { ...updates, updated_at: new Date().toISOString() };
  delete (cleanUpdates as any).id;

  const { data, error } = await supabase
    .from('products')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  return data as Product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // First clear any dependent cart_items or wishlist_items
  await supabase.from('cart_items').delete().eq('product_id', id);
  await supabase.from('wishlist_items').delete().eq('product_id', id);

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product from Supabase:', error);
    throw error;
  }
  return true;
}

// ----------------------------------------------------
// Admin Category CRUD Operations
// ----------------------------------------------------
export async function addCategory(categoryData: {
  name: string;
  slug: string;
  icon_name?: string;
  sort_order?: number;
}): Promise<Category> {
  const cleanSlug = categoryData.slug
    ? categoryData.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-')
    : categoryData.name.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

  const newCat = {
    name: categoryData.name,
    slug: cleanSlug,
    icon_name: categoryData.icon_name || 'Sparkles',
    sort_order: categoryData.sort_order || 99,
  };

  const { data, error } = await supabase
    .from('categories')
    .insert(newCat)
    .select()
    .single();

  if (error) {
    console.error('Error adding category:', error);
    throw error;
  }
  return data as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const cleanUpdates = { ...updates };
  delete (cleanUpdates as any).id;

  const { data, error } = await supabase
    .from('categories')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }
  return data as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  // First unlink any products that use this category
  await supabase
    .from('products')
    .update({ category_id: null })
    .eq('category_id', id);

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category from Supabase:', error);
    throw error;
  }
  return true;
}

