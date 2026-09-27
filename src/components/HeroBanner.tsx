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
  Award
} from 'lucide-react';

export interface HeroBannerProps {
  onQuickFilter: (tag: string | null, maxPrice?: number) => void;
  onOpenWishlist?: () => void;
  onOpenOrderHistory?: () => void;
  onOpenTrackingModal?: () => void;
  onSelectCategory?: (categorySlug: string) => void;
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
}

const SLIDES: SlideData[] = [
  {
    id: 'rush-hour',
    badge: '⚡ FASTEST DELIVERY',
    badgeIcon: 'Zap',
    timerBadge: '8PM - 12AM',
    title: 'RUSH HOUR',
    highlightText: 'Deals',
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
    id: 'diwali-carnival',
    badge: '✨ FESTIVE CARNIVAL',
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
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const slide = SLIDES[currentIdx];

  // Auto-play timer (slides every 4.8 seconds unless paused)
  useEffect(() => {
    if (isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 4800);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, currentIdx]);

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

  // Animation variants for FirstCry-like sliding transition
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
      {/* FirstCry-style Top Category Quick Ribbon */}
      <div className="hidden sm:flex items-center justify-between bg-amber-400 text-slate-950 px-4 py-2 rounded-2xl font-bold text-xs shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onQuickFilter(null)}
            className="flex items-center gap-1.5 hover:text-amber-900 transition-colors uppercase tracking-wider font-extrabold cursor-pointer"
          >
            <span>ALL CATEGORIES</span>
            <span className="text-[10px]">▼</span>
          </button>
          <span className="text-amber-600">|</span>
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
            Toys & Books
          </button>
          <button
            onClick={() => onQuickFilter('BESTSELLER')}
            className="hover:underline uppercase tracking-wide cursor-pointer"
          >
            Bestsellers
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0 pl-4">
          <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md text-[10px] font-black tracking-widest">
            JOJI CLUB
          </span>
          <span className="text-[11px] font-extrabold text-rose-700 tracking-wider">
            PREMIUM CERTIFIED
          </span>
        </div>
      </div>

      {/* Main Animated Carousel Section */}
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
            className={`w-full bg-gradient-to-r ${slide.bgGradient} p-6 sm:p-10 text-white flex flex-col justify-center relative overflow-hidden`}
            style={{ minHeight: '380px' }}
          >
            {/* Dynamic Background Glow Layer */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${slide.accentGlow} pointer-events-none blur-3xl`}
            />
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Promotional Content */}
              <div className="lg:col-span-7 space-y-4">
                {/* Header Tag Badges */}
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

                {/* Big Display Typography */}
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

                {/* Discounts Badges Strip (FirstCry style) */}
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

                {/* Interactive Coupon Box & CTA Button */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* FirstCry style Coupon Capsule Button */}
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

                  {/* Primary CTA Shop Action */}
                  <button
                    onClick={() => handleSlideCta(slide)}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Hero Image Card (FirstCry Model style) */}
              <div className="lg:col-span-5 relative flex justify-center items-center">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-800/40">
                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Vignette & Soft Gradient on bottom of image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Guarantee Stamp */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl text-slate-900 dark:text-white flex items-center justify-between shadow-lg border border-transparent dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-[11px] font-extrabold">100% Cotton & Lab Tested</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                      JOJI ASSURED
                    </span>
                  </div>
                </div>
              </div>
            </div>
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

      {/* FirstCry Signature Bottom Quick-Action Bar (Directly beneath carousel) */}
      <div className="bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
          {/* Shortlist link */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 hover:border-rose-200 font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Shortlist</span>
          </button>

          {/* Quick Re-Order link */}
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

          {/* Track Order link */}
          <button
            onClick={onOpenTrackingModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-blue-900 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-200 font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Track Order</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Genuine Brands
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden md:flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Free Shipping on ₹999+
          </span>
        </div>
      </div>
    </div>
  );
};
