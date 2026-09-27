export interface VideoReel {
  id: string;
  title: string;
  badge: string;
  videoSrc: string;
  posterSrc: string;
  discount: string;
  categorySlug: string;
  headline: string;
  caption: string;
  coupon: string;
  isCustom?: boolean;
}

export const DEFAULT_VIDEO_REELS: VideoReel[] = [
  {
    id: 'diwali-reel',
    title: 'Royal Diwali Reel',
    badge: '✨ DIWALI SPECIAL',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    posterSrc: 'https://images.pexels.com/photos/8819389/pexels-photo-8819389.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    discount: 'FLAT 40% OFF',
    categorySlug: 'ethnic-wear',
    headline: 'Sparkle in Royal Ethnic Wear',
    caption: 'Pure silk blends, handcrafted peplum lehengas & kurta sets for royal celebrations.',
    coupon: 'DIWALI40',
  },
  {
    id: 'play-reel',
    title: 'Active Fun & Toys',
    badge: '🎈 PLAY & LEARN',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    posterSrc: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=900&auto=format&fit=crop&q=80',
    discount: 'UNDER ₹699',
    categorySlug: 'toys',
    headline: 'Montessori Toys & Active Sneakers',
    caption: 'Safe, non-toxic educational toys & comfortable cushioned shoes made for joyful little steps.',
    coupon: 'TOYJOY',
  },
  {
    id: 'baby-reel',
    title: 'Organic Newborn Wear',
    badge: '🌿 100% PURE COTTON',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    posterSrc: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=900&auto=format&fit=crop&q=80',
    discount: 'BUY 2 GET 1 FREE',
    categorySlug: 'clothing',
    headline: 'Ultra-Soft Organic Rompers',
    caption: 'Hypoallergenic baby wear designed with gentle seams for newborn tender skin.',
    coupon: 'BABY35',
  },
];

const BANNER_STORAGE_KEY = 'joji_custom_festive_banner';
const VIDEO_REELS_STORAGE_KEY = 'joji_custom_video_reels';

const ALL_BANNER_STORAGE_KEYS = [
  'joji_custom_festive_banner',
  'joji_custom_banner',
  'custom_banner',
  'festive_banner',
  'joji_festive_banner',
  'joji_hero_banner',
  'custom_uploaded_banner',
  'customBanner',
];

export const getStoredCustomBanner = (): string | null => {
  try {
    for (const key of ALL_BANNER_STORAGE_KEYS) {
      const item = localStorage.getItem(key);
      if (item && item.trim().length > 0) {
        return item;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const saveStoredCustomBanner = (dataUrl: string): boolean => {
  try {
    localStorage.setItem(BANNER_STORAGE_KEY, dataUrl);
    window.dispatchEvent(new Event('joji_banner_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to save banner:', err);
    return false;
  }
};

export const deleteStoredCustomBanner = (): boolean => {
  try {
    ALL_BANNER_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // ignore
      }
    });
    window.dispatchEvent(new Event('joji_banner_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to delete banner:', err);
    return false;
  }
};

export const getStoredVideoReels = (): VideoReel[] => {
  try {
    const raw = localStorage.getItem(VIDEO_REELS_STORAGE_KEY);
    if (!raw) return DEFAULT_VIDEO_REELS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_VIDEO_REELS;
  } catch {
    return DEFAULT_VIDEO_REELS;
  }
};

export const saveStoredVideoReels = (reels: VideoReel[]): boolean => {
  try {
    localStorage.setItem(VIDEO_REELS_STORAGE_KEY, JSON.stringify(reels));
    window.dispatchEvent(new Event('joji_video_reels_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to save video reels:', err);
    return false;
  }
};

export const resetStoredVideoReels = (): boolean => {
  try {
    localStorage.removeItem(VIDEO_REELS_STORAGE_KEY);
    window.dispatchEvent(new Event('joji_video_reels_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to reset video reels:', err);
    return false;
  }
};
