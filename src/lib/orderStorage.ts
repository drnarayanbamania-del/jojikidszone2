import { PastOrder } from '../types';

const STORAGE_KEY = 'joji_kids_orders_history';

export const INITIAL_SAMPLE_ORDERS: PastOrder[] = [
  {
    id: 'JOJI-819342',
    orderDate: '16 Sep 2026, 11:15 AM',
    status: 'Out for Delivery',
    courier: 'BlueDart Express Air',
    trackingNumber: 'BD99281744',
    estimatedDelivery: 'Today by 6:00 PM',
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    subtotal: 2098,
    discountAmount: 314,
    shippingFee: 0,
    grandTotal: 1784,
    couponCode: 'JOJI15',
    shippingAddress: {
      fullName: 'Priya Sharma',
      phone: '9876543210',
      email: 'priya.sharma@example.com',
      address: 'Flat 402, Sunshine Apartments, Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      paymentMethod: 'card',
    },
    items: [
      {
        productId: 'prod-dress-01',
        name: 'Floral Party Tutu Dress with Satin Ribbon',
        brand: 'JOJI Princess',
        imageUrl:
          'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&auto=format&fit=crop&q=80',
        size: '3-4Y',
        quantity: 1,
        price: 1299,
      },
      {
        productId: 'prod-bag-01',
        name: 'Ergonomic Animal Water-Resistant Kids Backpack',
        brand: 'JOJI Gear',
        imageUrl:
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
        size: 'Standard',
        quantity: 1,
        price: 799,
      },
    ],
  },
  {
    id: 'JOJI-742918',
    orderDate: '14 Sep 2026, 02:30 PM',
    status: 'Delivered',
    courier: 'BlueDart Express Air',
    trackingNumber: 'BD84920194',
    estimatedDelivery: 'Delivered on Sep 16, 2026',
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    subtotal: 1897,
    discountAmount: 284,
    shippingFee: 0,
    grandTotal: 1613,
    couponCode: 'JOJI15',
    shippingAddress: {
      fullName: 'Priya Sharma',
      phone: '9876543210',
      email: 'priya.sharma@example.com',
      address: 'Flat 402, Sunshine Apartments, Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      paymentMethod: 'upi',
    },
    items: [
      {
        productId: 'prod-tee-01',
        name: 'Pure Organic Cotton Dino Print Kids T-Shirt',
        brand: 'JOJI Baby',
        imageUrl:
          'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&auto=format&fit=crop&q=80',
        size: '2-3Y',
        quantity: 2,
        price: 499,
      },
      {
        productId: 'prod-shoe-01',
        name: 'Breathable Flex Mesh Lightweight Kids Sneakers',
        brand: 'JOJI Active',
        imageUrl:
          'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&auto=format&fit=crop&q=80',
        size: 'UK 7',
        quantity: 1,
        price: 899,
      },
    ],
  },
];

export function getPastOrders(): PastOrder[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_ORDERS));
      return INITIAL_SAMPLE_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SAMPLE_ORDERS;
  } catch (err) {
    console.error('Failed reading past orders:', err);
    return INITIAL_SAMPLE_ORDERS;
  }
}

export function savePastOrder(newOrder: PastOrder): PastOrder[] {
  try {
    const existing = getPastOrders();
    const updated = [newOrder, ...existing.filter((o) => o.id !== newOrder.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed saving past order:', err);
    return [newOrder];
  }
}

export function resetSampleOrders(): PastOrder[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_ORDERS));
    return INITIAL_SAMPLE_ORDERS;
  } catch (err) {
    console.error('Failed resetting sample orders:', err);
    return INITIAL_SAMPLE_ORDERS;
  }
}

export function clearPastOrders(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed clearing orders:', err);
  }
}
