import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Zap,
  Tag,
  Clock,
  Heart,
  RotateCcw,
  Truck,
  ShieldCheck,
  Camera,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  MapPin,
  MessageCircle,
  Trash2,
  Lock,
  Settings,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  VideoReel,
  getStoredVideoReels,
  getStoredCustomBanner,
  saveStoredCustomBanner,
  deleteStoredCustomBanner,
} from '../lib/heroMediaStorage';
import { AdminVideoEditorModal } from './AdminVideoEditorModal';

export interface HeroBannerProps {
  onQuickFilter: (tag: string | null, maxPrice?: number) => void;
  onOpenWishlist?: () => void;
  onOpenOrderHistory?: () => void;
  onOpenTrackingModal?: () => void;
  onSelectCategory?: (categorySlug: string) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onOpenAdminPanel?: () => void;
}

interface SlideData {
  id: string;
  badge: string;
  badgeIcon: string;
  timerBadge?: string;
  title: string;
  highlightText: string;
  subtitle: string;
  discounts: string[];
  couponCode: string;
  couponLabel: string;
  ctaText: string;
  quickFilterTag?: string | null;
  quickFilterPrice?: number;
  categorySlug?: string;
  bgGradient: string;
  accentGlow: string;
  imageUrl: string;
  imageAlt: string;
  isFullBanner?: boolean;
  storeLocation?: string;
  whatsAppNumber?: string;
}

const SLIDES: SlideData[] = [
  {
    id: 'diwali-carnival',
    isFullBanner: true,
    badge: '🪔 DIWALI CARNIVAL • FLAT 40% OFF',
    badgeIcon: 'Sparkles',
    timerBadge: 'DIWALI SPECIAL',
    title: 'DIWALI CARNIVAL',
    highlightText: 'FLAT 40% OFF',
    subtitle: 'Royal Festive Kurta Sets, Designer Peplum Lehengas & Kids Ethnic Wear • Joji Kids Zone Dewas',
    discounts: ['Flat 40% Off', 'Royal Kurta Sets', 'Lehenga Choli', 'Festive Accessories'],
    couponCode: 'DIWALI40',
    couponLabel: 'Coupon: DIWALI40',
    ctaText: 'Shop Diwali Carnival',
    categorySlug: 'ethnic-wear',
    quickFilterTag: 'FESTIVE',
    storeLocation: '120 A.B. Road, Dewas',
    whatsAppNumber: '9893380637',
    bgGradient: 'from-[#380d12] via-[#5c1320] to-[#801726]',
    accentGlow: 'from-amber-500/35 via-rose-500/25 to-yellow-400/20',
    imageUrl: '/diwali-carnival-banner.svg',
    imageAlt: 'Diwali Carnival - Kids Ethnic Wear Flat 40% Off - Joji Kids Zone Dewas',
  },
  {
    id: 'dewas-festive-ethnic',
    isFullBanner: true,
    badge: '👑 DEWAS SPECIAL • WEAR • PLAY • SMILE',
    badgeIcon: 'Sparkles',
    timerBadge: 'FESTIVE SEASON',
    title: 'FESTIVE SEASON',
    highlightText: 'ETHNIC WEAR',
    subtitle: 'Dress Up Little Moments, Create Big Memories • Joji Kids Zone Dewas',
    discounts: ['Girls Wear', 'Boys Wear', 'Toys & Gifts', 'Kids Accessories'],
    couponCode: 'DEWAS15',
    couponLabel: 'Coupon: DEWAS15',
    ctaText: 'Shop Festive Ethnic Wear',
    categorySlug: 'clothing',
    quickFilterTag: 'FESTIVE',
    storeLocation: '120 A.B. Road, Dewas',
    whatsAppNumber: '9893380637',
    bgGradient: 'from-[#450a24] via-[#701a40] to-[#9d174d]',
    accentGlow: 'from-pink-500/30 via-rose-500/20 to-amber-400/20',
    imageUrl: '/festive-banner.svg',
    imageAlt: 'Joji Kids Zone Festive Season Ethnic Wear - Dewas Store Banner',
  },
  {
    id: 'rush-hour',
    badge: '⚡ FASTEST DELIVERY IN DEWAS',
    badgeIcon: 'Zap',
    timerBadge: '8PM - 12AM FLASH',
    title: 'RUSH HOUR',
    highlightText: 'DEALS',
    subtitle: 'One Coupon Many Discounts • Autumn & Playwear Specials',
    discounts: ['Flat 60% Off', '55% Off', '50% Off', '45% Off'],
    couponCode: 'HITZ',
    couponLabel: 'Coupon: HITZ',
    ctaText: 'Shop Rush Hour Deals',
    quickFilterTag: 'BESTSELLER',
    bgGradient: 'from-[#0d1338] via-[#1a1752] to-[#341864]',
    accentGlow: 'from-amber-400/20 via-pink-500/20 to-purple-600/30',
    imageUrl:
      'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Happy kids in casual trendy outfits smiling',
  },
  {
    id: 'festive-ethnic-showcase',
    badge: '✨ ROYAL ETHNIC FEST',
    badgeIcon: 'Sparkles',
    timerBadge: 'LIMITED EDITION',
    title: 'PREP UP FOR',
    highlightText: 'FESTIVE DIWALI',
    subtitle: 'Designer Peplum Lehengas, Janmashtami Krishna Sets & Royal Ethnic Outfits',
    discounts: ['Flat 45% Off', 'Buy 2 Get 1 Free', 'Extra 10% on Prepaid'],
    couponCode: 'JOJIFEST',
    couponLabel: 'Coupon: JOJIFEST',
    ctaText: 'Explore Ethnic & Festive',
    categorySlug: 'ethnic-wear',
    quickFilterTag: 'FESTIVE',
    bgGradient: 'from-[#3a0808] via-[#631818] to-[#9a3412]',
    accentGlow: 'from-amber-500/30 via-orange-500/20 to-yellow-500/20',
    imageUrl:
      'https://images.pexels.com/photos/8819389/pexels-photo-8819389.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Kids festive twirl peplum lehenga choli set',
  },
  {
    id: 'kids-toys',
    badge: '🧸 KIDS TOYS & PLAY SETS',
    badgeIcon: 'Sparkles',
    timerBadge: 'PLAY & LEARN FEST',
    title: 'EDUCATIONAL TOYS &',
    highlightText: 'CREATIVE PLAY',
    subtitle: 'Montessori Wooden Toys, STEM Building Sets, Musical & Soft Plush Toys',
    discounts: ['Flat 40% Off', 'Under ₹599', '100% Non-Toxic & Safe'],
    couponCode: 'TOYJOY',
    couponLabel: 'Coupon: TOYJOY',
    ctaText: 'Shop Kids Toys & Games',
    categorySlug: 'toys',
    quickFilterPrice: 699,
    bgGradient: 'from-[#854d0e] via-[#c2410c] to-[#991b1b]',
    accentGlow: 'from-yellow-400/30 via-orange-400/20 to-rose-500/20',
    imageUrl:
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Colorful Montessori wooden toys and educational building blocks for kids',
  },
  {
    id: 'footwear-flex',
    badge: '👟 LITTLE STEPS ACTIVE',
    badgeIcon: 'Zap',
    timerBadge: 'STEP UP SALE',
    title: 'FLEX LIGHTWEIGHT',
    highlightText: 'SNEAKERS',
    subtitle: 'Cushioned flex soles, breathable mesh and light-up play shoes',
    discounts: ['Starting ₹499', 'Buy 1 Get 1 at 50% Off', 'Anti-Slip Grip'],
    couponCode: 'STEP25',
    couponLabel: 'Coupon: STEP25',
    ctaText: 'Explore Footwear',
    categorySlug: 'footwear',
    quickFilterTag: 'BESTSELLER',
    bgGradient: 'from-[#0b192c] via-[#0f3460] to-[#1e5f74]',
    accentGlow: 'from-sky-400/30 via-teal-400/20 to-blue-500/20',
    imageUrl:
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Cushioned lightweight sneakers for toddlers and kids',
  },
  {
    id: 'organic-baby',
    badge: '🌿 100% PURE ORGANIC',
    badgeIcon: 'ShieldCheck',
    timerBadge: 'BABY ESSENTIALS',
    title: 'NEWBORN & BABY',
    highlightText: 'CARE WEAR',
    subtitle: 'Ultra-soft combed cotton rompers, sleepsuits and anti-chafing sets',
    discounts: ['Flat 35% Off', 'Dermatologist Tested', 'Pack of 3 from ₹799'],
    couponCode: 'BABY35',
    couponLabel: 'Coupon: BABY35',
    ctaText: 'Shop Baby Essentials',
    categorySlug: 'clothing',
    quickFilterPrice: 799,
    bgGradient: 'from-[#064e3b] via-[#047857] to-[#0f766e]',
    accentGlow: 'from-emerald-400/30 via-teal-400/20 to-lime-400/20',
    imageUrl:
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Soft baby organic cotton clothes and accessories',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onQuickFilter,
  onOpenWishlist,
  onOpenOrderHistory,
  onOpenTrackingModal,
  onSelectCategory,
  isAdmin = false,
  onOpenAdminLogin,
  onOpenAdminPanel,
}) => {
  // Mode: 'video' | 'banners'
  const [heroMode, setHeroMode] = useState<'video' | 'banners'>('video');

  // Video reels loaded from storage (managed via admin)
  const [videoReels, setVideoReels] = useState<VideoReel[]>(() => getStoredVideoReels());
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Admin video reels editor modal state
  const [isAdminVideoEditorOpen, setIsAdminVideoEditorOpen] = useState(false);

  // Custom festive banner loaded from storage (managed via admin)
  const [customUploadedBanner, setCustomUploadedBanner] = useState<string | null>(() =>
    getStoredCustomBanner()
  );

  // Banner & Video feedback toasts
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Unauthorized admin prompt modal
  const [adminAuthNotice, setAdminAuthNotice] = useState<string | null>(null);

  // Carousel slide states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with global custom banner and video reel storage events
  useEffect(() => {
    const handleBannerUpdate = () => {
      setCustomUploadedBanner(getStoredCustomBanner());
    };
    const handleReelsUpdate = () => {
      setVideoReels(getStoredVideoReels());
    };

    window.addEventListener('joji_banner_updated', handleBannerUpdate);
    window.addEventListener('joji_video_reels_updated', handleReelsUpdate);
    return () => {
      window.removeEventListener('joji_banner_updated', handleBannerUpdate);
      window.removeEventListener('joji_video_reels_updated', handleReelsUpdate);
    };
  }, []);

  const currentReel = videoReels[activeReelIdx] || videoReels[0] || {
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
  };

  const slide = SLIDES[currentIdx];

  // Video Time Update & Progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100;
      setVideoProgress(progress);
    }
  };

  const toggleVideoPlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // Web Audio Synth ambient chime generator when unmuting
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAudioMuted) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioContextRef.current && AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        if (audioContextRef.current) {
          const ctx = audioContextRef.current;
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
            gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.18);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.18);
            osc.stop(ctx.currentTime + i * 0.18 + 0.85);
          });
        }
      } catch (err) {
        console.warn('Audio Context init:', err);
      }
      setIsAudioMuted(false);
    } else {
      setIsAudioMuted(true);
    }
  };

  // ---------------------------------------------------------------------------
  // ADMIN-GATED ACTIONS: Upload Banner, Delete Banner, Edit Video Section
  // ---------------------------------------------------------------------------
  const handleBannerUploadClick = () => {
    if (!isAdmin) {
      setAdminAuthNotice(
        'Admin Login Required: Only authorized store administrators can upload and change storefront promotional banners.'
      );
      return;
    }
    fileInputRef.current?.click();
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      setAdminAuthNotice('Admin Login Required: Unauthorized banner upload attempt.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        saveStoredCustomBanner(dataUrl);
        setCustomUploadedBanner(dataUrl);
        setActionToast({
          message: '✓ Custom store banner uploaded and published successfully!',
          type: 'success',
        });
        setTimeout(() => setActionToast(null), 3500);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be uploaded again if needed
    e.target.value = '';
  };

  const handleDeleteBannerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) {
      setAdminAuthNotice(
        'Admin Login Required: Only authorized store administrators can delete or reset promotional banners.'
      );
      return;
    }

    if (
      window.confirm(
        'Delete the custom uploaded banner and restore the official Diwali Festive banner?'
      )
    ) {
      deleteStoredCustomBanner();
      setCustomUploadedBanner(null);
      setActionToast({
        message: '✓ Custom banner deleted. Official Diwali Carnival banner restored.',
        type: 'info',
      });
      setTimeout(() => setActionToast(null), 3500);
    }
  };

  const handleEditVideoSectionClick = () => {
    if (!isAdmin) {
      setAdminAuthNotice(
        'Admin Login Required: The Cinematic Video Section and video reels can only be customized and updated after logging in to the Admin section.'
      );
      return;
    }
    setIsAdminVideoEditorOpen(true);
  };

  // Carousel Auto-play timer for Banner mode
  useEffect(() => {
    if (heroMode !== 'banners' || isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 4800);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [heroMode, isPaused, currentIdx]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIdx((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > currentIdx ? 1 : -1);
    setCurrentIdx(idx);
  };

  const handleCopyCoupon = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleSlideCta = (s: SlideData) => {
    if (s.categorySlug && onSelectCategory) {
      onSelectCategory(s.categorySlug);
    } else {
      onQuickFilter(s.quickFilterTag ?? null, s.quickFilterPrice);
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 30 },
        opacity: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Input for Admin Banner Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBannerFileChange}
      />

      {/* Top Quick Ribbon & Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between bg-amber-400 dark:bg-amber-500 text-slate-950 px-3 sm:px-4 py-2 rounded-2xl font-bold text-xs shadow-xs gap-2">
        {/* Category shortcuts */}
        <div className="hidden sm:flex items-center gap-3 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => onQuickFilter(null)}
            className="flex items-center gap-1.5 hover:text-amber-900 transition-colors uppercase tracking-wider font-extrabold cursor-pointer"
          >
            <span>ALL CATEGORIES</span>
            <span className="text-[10px]">▼</span>
          </button>
          <span className="text-amber-700/60">|</span>
          <button
            onClick={() => onSelectCategory?.('clothing')}
            className="hover:underline uppercase tracking-wide cursor-pointer"
          >
            Boy Fashion
          </button>
          <button
            onClick={() => onSelectCategory?.('clothing')}
            className="hover:underline uppercase tracking-wide cursor-pointer"
          >
            Girl Fashion
          </button>
          <button
            onClick={() => onSelectCategory?.('footwear')}
            className="hover:underline uppercase tracking-wide cursor-pointer"
          >
            Footwear
          </button>
          <button
            onClick={() => onSelectCategory?.('toys')}
            className="hover:underline uppercase tracking-wide cursor-pointer"
          >
            Toys &amp; Games
          </button>
          <button
            onClick={() => onQuickFilter('FESTIVE')}
            className="hover:underline uppercase tracking-wide cursor-pointer text-amber-950 font-black flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-950" />
            Diwali Fest
          </button>
        </div>

        {/* Right Controls: Mode Switcher & Admin Banner Buttons */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          {/* Experience Mode Toggle */}
          <div className="bg-slate-900/90 text-white p-0.5 rounded-xl flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => setHeroMode('video')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                heroMode === 'video'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinema Video</span>
            </button>
            <button
              type="button"
              onClick={() => setHeroMode('banners')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                heroMode === 'banners'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Showcase Banners</span>
            </button>
          </div>

          {/* ADMIN-ONLY BANNER CONTROLS */}
          {/* 1. Upload Banner Button */}
          <button
            type="button"
            onClick={handleBannerUploadClick}
            title={
              isAdmin
                ? 'Upload custom festive banner image (Admin Authorized)'
                : 'Upload Banner (Admin Login Required)'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer ${
              isAdmin
                ? 'bg-slate-950 text-amber-300 hover:bg-slate-900 border border-amber-400/40'
                : 'bg-white/90 hover:bg-white text-slate-900'
            }`}
          >
            {isAdmin ? (
              <Camera className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{isAdmin ? 'Upload Banner' : 'Upload Banner'}</span>
          </button>

          {/* 2. Delete Custom Banner Button (Only visible/active when custom banner exists) */}
          {customUploadedBanner && (
            <button
              type="button"
              onClick={handleDeleteBannerClick}
              title={
                isAdmin
                  ? 'Delete custom banner and restore default (Admin Authorized)'
                  : 'Delete Banner (Admin Login Required)'
              }
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer ${
                isAdmin
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Delete Banner' : 'Delete'}</span>
            </button>
          )}

          {/* Admin Indicator Badge */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdminPanel}
              title="Open Admin Management Console"
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 bg-slate-950 text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-500/40 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Logged In</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Action Feedback Toast */}
      {actionToast && (
        <div
          className={`p-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md animate-in fade-in slide-in-from-top-1 ${
            actionToast.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-900 text-amber-300 border border-amber-400/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className="p-1 hover:opacity-80 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PREMIUM HERO VIDEO AREA                                                */}
      {/* ========================================================================= */}
      {heroMode === 'video' ? (
        <div
          id="premium-hero-video-stage"
          className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-950/20 bg-slate-950 group select-none border border-amber-500/20 min-h-[420px] sm:min-h-[480px] flex flex-col justify-between"
        >
          {/* Background Ambient Video Layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              key={currentReel.videoSrc}
              src={currentReel.videoSrc}
              poster={currentReel.posterSrc}
              autoPlay
              loop
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover object-center opacity-65 scale-105 transition-all duration-700 blur-[0.5px]"
            />

            {/* Cinematic Gradient Scrims for Perfect Typographic Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          </div>

          {/* Top Video Header Bar (Live Badge, Reel Switcher, Playback & Admin Controls) */}
          <div className="relative z-20 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3">
            {/* Live Reel Badge & Store Info */}
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-900/40 border border-rose-400/30">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>JOJI CINEMA REEL</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span>120 A.B. Road, Dewas</span>
              </span>
            </div>

            {/* Video Controls & Admin Section Update Button */}
            <div className="flex items-center gap-2">
              {/* ADMIN-ONLY: Edit / Update Video Section Button */}
              <button
                type="button"
                onClick={handleEditVideoSectionClick}
                title={
                  isAdmin
                    ? 'Admin: Update Video Section & Reels'
                    : 'Edit Video Section (Admin Login Required)'
                }
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer backdrop-blur-md shadow-sm active:scale-95 ${
                  isAdmin
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                    : 'bg-white/15 hover:bg-white/25 text-white/90 border border-white/20'
                }`}
              >
                {isAdmin ? (
                  <Settings className="w-3.5 h-3.5 text-slate-950 animate-spin-slow" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>{isAdmin ? 'Edit Video Section' : 'Edit Video (Admin)'}</span>
              </button>

              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={toggleVideoPlay}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/20"
                title={isVideoPlaying ? 'Pause ambient video' : 'Play ambient video'}
              >
                {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${
                  !isAudioMuted
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/30 font-black'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
                }`}
                title={isAudioMuted ? 'Play festive melody' : 'Mute audio'}
              >
                {!isAudioMuted ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reel Picker Tabs */}
              <div className="hidden md:flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/10">
                {videoReels.map((reel, rIdx) => (
                  <button
                    key={reel.id}
                    type="button"
                    onClick={() => setActiveReelIdx(rIdx)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                      activeReelIdx === rIdx
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {reel.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Video Hero Content */}
          <div className="relative z-20 px-4 sm:px-8 py-4 sm:py-6 max-w-2xl space-y-4">
            {/* Reel Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 backdrop-blur-md text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentReel.badge}</span>
              <span className="text-white/40">•</span>
              <span className="text-amber-200 font-extrabold">{currentReel.discount}</span>
            </div>

            {/* Display Typography */}
            <div className="space-y-2">
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none drop-shadow-lg">
                {currentReel.headline.split(' ')[0]}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                  {currentReel.headline.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                {currentReel.caption}
              </p>
            </div>

            {/* Action Bar (WhatsApp, Shop Now, Coupon) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  onSelectCategory
                    ? onSelectCategory(currentReel.categorySlug)
                    : onQuickFilter('FESTIVE')
                }
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-400/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>Shop This Reel</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/919893380637?text=Hi%20Joji%20Kids%20Zone!%20I%20saw%20your%20${encodeURIComponent(
                  currentReel.title
                )}%20and%20want%20to%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Dewas Store</span>
              </a>

              <button
                type="button"
                onClick={(e) => handleCopyCoupon(currentReel.coupon, e)}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-mono font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {copiedCoupon === currentReel.coupon
                    ? '✓ Copied'
                    : `Code: ${currentReel.coupon}`}
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Video Progress Bar & Mobile Reel Selectors */}
          <div className="relative z-20 p-4 sm:p-6 pt-0 space-y-2">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-200"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            <div className="flex md:hidden items-center justify-between gap-1 overflow-x-auto pt-1">
              {videoReels.map((reel, rIdx) => (
                <button
                  key={reel.id}
                  type="button"
                  onClick={() => setActiveReelIdx(rIdx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeReelIdx === rIdx
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {reel.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. SHOWCASE GRAPHIC BANNERS MODE (Classic FirstCry / Diwali Carousel)    */
        /* ========================================================================= */
        <div
          id="firstcry-hero-carousel"
          className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/15 group cursor-default select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ minHeight: '380px' }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={slide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={`w-full bg-gradient-to-r ${slide.bgGradient} p-4 sm:p-8 text-white flex flex-col justify-center relative overflow-hidden`}
              style={{ minHeight: '380px' }}
            >
              {/* Dynamic Background Glow Layer */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${slide.accentGlow} pointer-events-none blur-3xl`}
              />
              <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

              {slide.isFullBanner ? (
                <div
                  className="relative w-full h-full min-h-[380px] sm:min-h-[440px] flex flex-col items-center justify-center cursor-pointer group/fullbanner"
                  onClick={() => handleSlideCta(slide)}
                >
                  <img
                    src={
                      slide.id === 'diwali-carnival'
                        ? customUploadedBanner || slide.imageUrl
                        : customUploadedBanner || slide.imageUrl
                    }
                    alt={slide.imageAlt}
                    className="w-full h-full max-h-[460px] object-cover sm:object-contain rounded-2xl shadow-2xl transition-transform duration-500 group-hover/fullbanner:scale-[1.01]"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/diwali-carnival-banner.svg';
                    }}
                  />

                  {/* Interactive Floating Footer Bar on Full Banner */}
                  <div
                    className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-6 sm:right-6 bg-slate-950/85 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 flex flex-wrap items-center justify-between gap-2 shadow-2xl z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2 sm:gap-4">
                      <a
                        href={`https://wa.me/91${
                          slide.whatsAppNumber || '9893380637'
                        }?text=Hi%20Joji%20Kids%20Zone%20Dewas!%20I%20am%20interested%20in%20Festive%20Season%20Ethnic%20Wear`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition active:scale-95 cursor-pointer"
                      >
                        <span>💬 WhatsApp: {slide.whatsAppNumber || '9893380637'}</span>
                      </a>
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-pink-200">
                        📍 {slide.storeLocation || '120 A.B. Road, Dewas'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delete Custom Banner Button in banner footer if admin */}
                      {customUploadedBanner && (
                        <button
                          type="button"
                          onClick={handleDeleteBannerClick}
                          title={isAdmin ? 'Delete custom banner' : 'Delete (Admin Required)'}
                          className="px-2.5 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl border border-rose-400/40 cursor-pointer transition active:scale-95 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Reset Banner</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => handleCopyCoupon(slide.couponCode, e)}
                        className="px-2.5 sm:px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/25 cursor-pointer transition active:scale-95"
                      >
                        {copiedCoupon === slide.couponCode
                          ? '✓ Copied'
                          : `Code: ${slide.couponCode}`}
                      </button>
                      <button
                        onClick={() => handleSlideCta(slide)}
                        className="px-3.5 sm:px-4 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider border border-white/20">
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                        {slide.badge}
                      </span>
                      {slide.timerBadge && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm">
                          <Clock className="w-3 h-3 text-slate-950" />
                          {slide.timerBadge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-white drop-shadow-md">
                        {slide.title}{' '}
                        <span className="text-amber-300 underline decoration-amber-400 decoration-wavy decoration-2">
                          {slide.highlightText}
                        </span>
                      </h1>
                      <p className="text-white/90 text-sm sm:text-base font-medium max-w-lg leading-snug pt-1">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {slide.discounts.map((disc, dIdx) => (
                        <span
                          key={dIdx}
                          className="px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/25 rounded-lg text-xs font-black text-white shadow-xs tracking-wide"
                        >
                          {disc}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        id={`coupon-btn-${slide.couponCode}`}
                        onClick={(e) => handleCopyCoupon(slide.couponCode, e)}
                        className="relative group/btn flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-amber-100 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-black/20 border-2 border-dashed border-amber-500 transition-all cursor-pointer active:scale-95"
                        title="Click to copy coupon code"
                      >
                        <Tag className="w-4 h-4 text-amber-600" />
                        <span>{slide.couponLabel}</span>
                        {copiedCoupon === slide.couponCode ? (
                          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[11px] font-bold">
                            <Check className="w-3 h-3" />
                            Copied!
                          </span>
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-slate-700" />
                        )}
                      </button>

                      <button
                        onClick={() => handleSlideCta(slide)}
                        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative flex justify-center items-center">
                    <div className="relative w-full max-w-sm sm:max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-800/40">
                      <img
                        src={slide.imageUrl}
                        alt={slide.imageAlt}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl text-slate-900 dark:text-white flex items-center justify-between shadow-lg border border-transparent dark:border-slate-700/60">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-[11px] font-extrabold">
                            100% Cotton &amp; Lab Tested
                          </span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                          JOJI ASSURED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Floating Prev / Next Arrow Navigation Controls */}
          <button
            id="hero-carousel-prev-btn"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white shadow-xl backdrop-blur-sm flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer border border-transparent dark:border-slate-700"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 dark:text-white" />
          </button>

          <button
            id="hero-carousel-next-btn"
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white shadow-xl backdrop-blur-sm flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer border border-transparent dark:border-slate-700"
          >
            <ChevronRight className="w-6 h-6 text-slate-800 dark:text-white" />
          </button>

          {/* Bottom Pagination Dots Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {SLIDES.map((s, idx) => {
              const isActive = idx === currentIdx;
              return (
                <button
                  key={s.id}
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-white/50 hover:bg-white'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Signature Bottom Quick-Action Bar */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 hover:border-rose-200 font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Shortlist</span>
          </button>

          <button
            onClick={onOpenOrderHistory}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-amber-900 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 hover:border-amber-200 font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Quick Re-Order</span>
            <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
              HOT
            </span>
          </button>

          <button
            onClick={onOpenTrackingModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-blue-900 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-200 font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Track Order</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Genuine Brands
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden md:flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Same-Day Dispatch in Dewas
          </span>
        </div>
      </div>

      {/* Admin Video Editor Modal (Admin Only) */}
      <AdminVideoEditorModal
        isOpen={isAdminVideoEditorOpen}
        onClose={() => setIsAdminVideoEditorOpen(false)}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => onOpenAdminLogin?.()}
      />

      {/* UNAUTHORIZED ADMIN PROMPT MODAL */}
      {adminAuthNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                Admin Section Login Required
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {adminAuthNotice}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 text-left flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                Uploading banners, deleting banners, and updating cinematic video reels are protected administrative operations for Dewas store staff.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAdminAuthNotice(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminAuthNotice(null);
                  onOpenAdminLogin?.();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
