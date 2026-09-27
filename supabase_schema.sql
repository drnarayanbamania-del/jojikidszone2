-- =========================================================================
-- JOJI KIDS ZONE - Supabase Database Schema & Setup Script
-- Project: https://wwxalepbdmfjdzadisgp.supabase.co
-- How to apply:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/wwxalepbdmfjdzadisgp/sql/new
-- 2. Paste this entire script into the SQL Editor.
-- 3. Click "Run". All tables, RLS security policies, and initial categories will be created!
-- =========================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
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

-- 3. Products Table
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

-- 4. Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    size TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Wishlist Items Table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_session_product UNIQUE(session_id, product_id)
);

-- 6. Product Reviews Table
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

-- 7. Orders Table
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

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 8. Policies for Anon / Public access
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Public insert categories" ON public.categories;
DROP POLICY IF EXISTS "Public update categories" ON public.categories;
DROP POLICY IF EXISTS "Public delete categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Public delete categories" ON public.categories FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public insert products" ON public.products;
DROP POLICY IF EXISTS "Public update products" ON public.products;
DROP POLICY IF EXISTS "Public delete products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read cart_items" ON public.cart_items;
DROP POLICY IF EXISTS "Public insert cart_items" ON public.cart_items;
DROP POLICY IF EXISTS "Public update cart_items" ON public.cart_items;
DROP POLICY IF EXISTS "Public delete cart_items" ON public.cart_items;
CREATE POLICY "Public read cart_items" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Public insert cart_items" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update cart_items" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Public delete cart_items" ON public.cart_items FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read wishlist_items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Public insert wishlist_items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Public delete wishlist_items" ON public.wishlist_items;
CREATE POLICY "Public read wishlist_items" ON public.wishlist_items FOR SELECT USING (true);
CREATE POLICY "Public insert wishlist_items" ON public.wishlist_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete wishlist_items" ON public.wishlist_items FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read product_reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Public insert product_reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Public update product_reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Public delete product_reviews" ON public.product_reviews;
CREATE POLICY "Public read product_reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Public insert product_reviews" ON public.product_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update product_reviews" ON public.product_reviews FOR UPDATE USING (true);
CREATE POLICY "Public delete product_reviews" ON public.product_reviews FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

-- 9. Insert Core Categories
INSERT INTO public.categories (name, slug, icon_name, sort_order) VALUES
  ('Clothing & Ethnic', 'clothing', 'Shirt', 1),
  ('Footwear', 'footwear', 'Footprints', 2),
  ('Toys & Learning', 'toys', 'Sparkles', 3),
  ('Accessories', 'accessories', 'Watch', 4),
  ('Baby Care', 'baby-care', 'Smile', 5),
  ('Gifts & Combos', 'gifts', 'Gift', 6)
ON CONFLICT (slug) DO NOTHING;

-- 10. Seed Initial Products (JOJI Kids Zone Top Picks)
INSERT INTO public.products (name, brand, description, price, old_price, discount_percent, image_url, tag, color_theme, gender, age_group, rating, is_bestseller, is_active)
VALUES
  ('Pure Cotton Floral Jaipuri Twirl Frock', 'JOJI KIDS ZONE', 'Breathable 100% organic cotton handcrafted ethnic summer dress with gentle inner lining.', 599.00, 1199.00, 50, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80', 'Bestseller', 'rose', 'girls', '2-6 Years', 4.9, true, true),
  ('Cool Dinosaur Graphic Tee & Cotton Denim Shorts', 'JOJI KIDS ZONE', 'Pre-washed soft jersey cotton t-shirt paired with stretchable drawstring shorts for boys.', 649.00, 1299.00, 50, 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80', 'Trending', 'emerald', 'boys', '3-7 Years', 4.8, true, true),
  ('Montessori Wooden Sensory Building Blocks Set', 'JOJI KIDS ZONE', 'Safe non-toxic water-based colored smooth wooden educational geometric blocks.', 499.00, 899.00, 44, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80', 'Educational', 'amber', 'unisex', '1-5 Years', 5.0, true, true),
  ('Festive Jacquard Kurta Pajama with Nehru Jacket', 'JOJI KIDS ZONE', 'Rich festive wedding collection Kurta Pyjama set for boys with designer buttons.', 899.00, 1799.00, 50, 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80', 'Festive Pick', 'indigo', 'boys', '4-10 Years', 4.9, true, true),
  ('Kids Breathable Mesh Athletic Sneakers with LED Lights', 'JOJI KIDS ZONE', 'Ultra lightweight anti-skid flexible cushioned running shoes with fun LED lights in sole.', 699.00, 1399.00, 50, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80', 'Hot Seller', 'purple', 'unisex', '3-8 Years', 4.7, true, true),
  ('Organic Gentle Baby Care Bath & Moisturizer Gift Kit', 'JOJI KIDS ZONE', 'Pediatrician certified tear-free nourishing baby wash, shampoo, and body lotion.', 449.00, 799.00, 43, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80', 'Pure & Safe', 'sky', 'unisex', '0-2 Years', 4.9, true, true);
