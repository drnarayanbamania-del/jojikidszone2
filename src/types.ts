export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string | null;
  price: number;
  old_price: number | null;
  discount_percent: number | null;
  image_url: string;
  tag: string | null;
  color_theme: string | null;
  category_id: string | null;
  gender: 'boys' | 'girls' | 'unisex' | string | null;
  age_group: string | null;
  rating: number;
  is_bestseller: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  sort_order: number;
  image_url?: string;
  description?: string;
  brand_tagline?: string;
  created_at?: string;
}

export interface CartItemRecord {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  created_at: string;
}

export interface CartItemWithProduct extends CartItemRecord {
  product: Product;
}

export interface WishlistItemRecord {
  id: string;
  session_id: string;
  product_id: string;
  created_at: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategorySlug: string;
  selectedGender: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
  tagFilter: string | null;
  maxPrice: number;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
}

export interface AdminSession {
  email: string;
  role: 'super_admin' | 'store_manager';
  token: string;
  loggedInAt: string;
}

export interface PastOrderItem {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  size: string | null;
  quantity: number;
  price: number;
}

export interface PastOrder {
  id: string;
  orderDate: string;
  status: 'Delivered' | 'In Transit' | 'Out for Delivery' | 'Processing' | 'Confirmed';
  items: PastOrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  couponCode?: string;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'Paid' | 'Pending COD';
  shippingAddress: CheckoutFormData;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  verified_purchase?: boolean;
  helpful_count?: number;
  created_at: string;
}

export interface PriceDropAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  email: string;
  currentPrice: number;
  targetPrice: number;
  alertType: 'any_drop' | 'target_price';
  createdAt: string;
  notified?: boolean;
}

