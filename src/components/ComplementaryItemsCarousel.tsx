import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Check, Sparkles, Plus, Star } from 'lucide-react';
import { Product, Category } from '../types';

export interface ComplementaryItemsCarouselProps {
  currentProduct: Product;
  allProducts: Product[];
  categories?: Category[];
  onAddToCart: (productId: string, size: string | null) => void;
  onSelectProduct: (product: Product) => void;
}

export const ComplementaryItemsCarousel: React.FC<ComplementaryItemsCarouselProps> = ({
  currentProduct,
  allProducts = [],
  categories = [],
  onAddToCart,
  onSelectProduct,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [addedItemIds, setAddedItemIds] = useState<Set<string>>(new Set());

  // 1. Identify category of currentProduct
  const currentCat = categories.find((c) => c.id === currentProduct.category_id);
  const currentCategorySlug = currentCat?.slug || (
    currentProduct.name.toLowerCase().includes('sneaker') || currentProduct.name.toLowerCase().includes('shoe')
      ? 'footwear'
      : currentProduct.name.toLowerCase().includes('toy') || currentProduct.name.toLowerCase().includes('puzzle')
      ? 'toys'
      : currentProduct.name.toLowerCase().includes('lehenga') || currentProduct.name.toLowerCase().includes('kurta')
      ? 'ethnic-wear'
      : currentProduct.name.toLowerCase().includes('swaddle') || currentProduct.name.toLowerCase().includes('baby')
      ? 'baby-care'
      : currentProduct.name.toLowerCase().includes('bag') || currentProduct.name.toLowerCase().includes('sock')
      ? 'accessories'
      : 'clothing'
  );

  // 2. Determine target complementary category slugs & keyword priorities
  const getComplementaryCriteria = () => {
    switch (currentCategorySlug) {
      case 'clothing':
        return {
          categorySlugs: ['accessories', 'footwear'],
          keywords: ['sock', 'hat', 'sunglass', 'bag', 'sneaker', 'belt', 'hairband'],
          sectionTitle: 'Complete the Look • Matching Accessories & Socks',
          badgeText: 'Pairs Great',
        };
      case 'ethnic-wear':
        return {
          categorySlugs: ['accessories', 'footwear'],
          keywords: ['hairband', 'brooch', 'dupatta', 'flats', 'sandals', 'ethnic', 'jewellery', 'sock'],
          sectionTitle: 'Royal Festive Pairings • Festive Accessories',
          badgeText: 'Festive Match',
        };
      case 'footwear':
        return {
          categorySlugs: ['accessories', 'clothing'],
          keywords: ['sock', 'ankle', 'grip', 'shorts', 'pants', 't-shirt'],
          sectionTitle: 'Best Paired With • Anti-Slip Socks & Gear',
          badgeText: 'Matching Socks',
        };
      case 'toys':
        return {
          categorySlugs: ['gifting', 'accessories', 'toys'],
          keywords: ['hamper', 'bag', 'puzzle', 'car', 'blocks', 'gift'],
          sectionTitle: 'More Fun Pairings • Gift & Play Essentials',
          badgeText: 'Fun Add-On',
        };
      case 'baby-care':
        return {
          categorySlugs: ['clothing', 'accessories', 'gifting'],
          keywords: ['romper', 'swaddle', 'sock', 'booties', 'bib', 'cotton'],
          sectionTitle: 'Gentle Essentials • Baby Cotton Pairs & Socks',
          badgeText: 'Baby Essential',
        };
      case 'accessories':
        return {
          categorySlugs: ['clothing', 'footwear'],
          keywords: ['cotton', 'frock', 'shorts', 'sneaker', 'romper'],
          sectionTitle: 'Style It With • Outfit & Shoe Pairings',
          badgeText: 'Outfit Match',
        };
      default:
        return {
          categorySlugs: ['accessories', 'clothing'],
          keywords: ['sock', 'hat', 'sunglass', 'sneaker', 'bag'],
          sectionTitle: 'Complementary Items & Accessories',
          badgeText: 'Curated Pair',
        };
    }
  };

  const criteria = getComplementaryCriteria();

  // 3. Compute matching complementary products
  const complementaryProducts = React.useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const otherProducts = allProducts.filter((p) => p.id !== currentProduct.id);

    // Target category ID lookups
    const targetCategoryIds = new Set(
      categories
        .filter((c) => criteria.categorySlugs.includes(c.slug))
        .map((c) => c.id)
    );

    // Score products based on relevance:
    // +5 for target category match
    // +4 for keyword match in name (e.g. 'sock', 'accessory')
    // +2 for gender alignment
    // +1 for high rating / bestseller
    const scored = otherProducts.map((prod) => {
      let score = 0;
      const lowerName = prod.name.toLowerCase();
      const lowerDesc = (prod.description || '').toLowerCase();

      if (targetCategoryIds.has(prod.category_id)) {
        score += 5;
      }

      criteria.keywords.forEach((kw) => {
        if (lowerName.includes(kw)) score += 6;
        else if (lowerDesc.includes(kw)) score += 3;
      });

      if (currentProduct.gender && prod.gender) {
        if (prod.gender === currentProduct.gender || prod.gender === 'unisex') {
          score += 2;
        }
      }

      if (prod.is_bestseller || prod.tag === 'BESTSELLER') {
        score += 1;
      }

      return { prod, score };
    });

    // Filter to items with positive relevance or backfill
    const filtered = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.prod);

    // If less than 4 items, backfill from other items so customer always gets great suggestions
    if (filtered.length < 4) {
      const existingIds = new Set(filtered.map((p) => p.id));
      for (const p of otherProducts) {
        if (!existingIds.has(p.id)) {
          filtered.push(p);
          existingIds.add(p.id);
          if (filtered.length >= 6) break;
        }
      }
    }

    return filtered.slice(0, 8);
  }, [allProducts, currentProduct, categories, criteria]);

  // Handle scroll arrows state
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [complementaryProducts]);

  const scrollBy = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, prod: Product) => {
    e.stopPropagation();
    const isShoe = prod.name.toLowerCase().includes('sneaker') || prod.name.toLowerCase().includes('shoe');
    const defaultSize = isShoe ? '24 EU' : '3-4Y';
    onAddToCart(prod.id, defaultSize);

    setAddedItemIds((prev) => new Set([...prev, prod.id]));
    setTimeout(() => {
      setAddedItemIds((prev) => {
        const next = new Set(prev);
        next.delete(prod.id);
        return next;
      });
    }, 2000);
  };

  if (complementaryProducts.length === 0) return null;

  return (
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
      {/* Header with Title and Scroll Arrows */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {criteria.sectionTitle}
          </h4>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scrollBy(-200)}
            disabled={!canScrollLeft}
            aria-label="Previous complementary items"
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(200)}
            disabled={!canScrollRight}
            aria-label="Next complementary items"
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x snap-mandatory"
      >
        {complementaryProducts.map((item) => {
          const isAdded = addedItemIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="snap-start shrink-0 w-38 sm:w-44 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/80 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between overflow-hidden group/item p-2"
            >
              {/* Product Thumbnail */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700/60 mb-2">
                <img
                  src={item.image_url}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover/item:scale-106 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src =
                      'https://images.pexels.com/photos/5693891/pexels-photo-5693891.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
                  }}
                />

                {/* Badge Tag */}
                <div className="absolute top-1.5 left-1.5">
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-900/85 text-white text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs">
                    {item.name.toLowerCase().includes('sock') ? 'Socks' : criteria.badgeText}
                  </span>
                </div>

                {/* Rating Pill */}
                {item.rating && (
                  <div className="absolute bottom-1.5 left-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-black text-slate-800 dark:text-slate-100 flex items-center gap-0.5 shadow-2xs">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div className="space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors">
                    {item.name}
                  </h5>
                </div>

                <div className="pt-1.5 flex items-baseline justify-between gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                      ₹{item.price}
                    </span>
                    {item.old_price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{item.old_price}
                      </span>
                    )}
                  </div>
                  {item.discount_percent && (
                    <span className="text-[9.5px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded">
                      {item.discount_percent}%
                    </span>
                  )}
                </div>

                {/* Quick Add to Bag Button */}
                <button
                  type="button"
                  onClick={(e) => handleQuickAdd(e, item)}
                  className={`w-full mt-2 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-2xs active:scale-95'
                  }`}
                  title="Quick add to bag"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Pair &amp; Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
