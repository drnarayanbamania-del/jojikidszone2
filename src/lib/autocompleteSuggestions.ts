import { Product, Category } from '../types';

export interface AutocompleteSuggestion {
  id: string;
  phrase: string;
  category?: string;
  categorySlug?: string;
  itemCount?: number;
  type: 'product' | 'category' | 'popular' | 'tag';
}

// Curated high-intent kids wear & toys search phrases
const CURATED_PHRASES: string[] = [
  'Diwali Festive Kurta Set',
  'Peplum Lehenga Choli',
  'Cotton Baby Rompers',
  'LED Light-Up Sneakers',
  'Janmashtami Krishna Dhoti Set',
  'Montessori Wooden Toys',
  'Denim Dungaree Set',
  'Pure Organic Swaddles',
  'Soft Sole Infant Booties',
  'Girls Party Twirl Frock',
  'Boys Casual Polo T-Shirts',
  'STEM Educational Building Blocks',
  'Waterproof Anti-Chafing Bibs',
  'Festive Kurta Pajama',
  'Toddler Breathable Sandals',
  'Baby Sleepsuits Pack of 3',
  'Musical Activity Play Mat',
  'Ethnic Waistcoat & Pant Set',
  'Lightweight Running Shoes',
  'Summer Cotton Shorts',
];

/**
 * Builds dynamic, intelligent autocomplete suggestions from the active catalogue and curated phrases.
 */
export const getAutocompleteSuggestions = (
  query: string,
  products: Product[] = [],
  categories: Category[] = []
): AutocompleteSuggestion[] => {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 1) return [];

  const suggestions: AutocompleteSuggestion[] = [];
  const seenPhrases = new Set<string>();

  // 1. Check Matching Categories first
  categories.forEach((cat) => {
    if (cat.name.toLowerCase().includes(clean)) {
      const phrase = cat.name;
      if (!seenPhrases.has(phrase.toLowerCase())) {
        seenPhrases.add(phrase.toLowerCase());
        const count = products.filter((p) => p.category_id === cat.id).length;
        suggestions.push({
          id: `cat_${cat.id}`,
          phrase: phrase,
          category: 'Category',
          categorySlug: cat.slug,
          itemCount: count > 0 ? count : undefined,
          type: 'category',
        });
      }
    }
  });

  // 2. Check Curated Popular Search Phrases
  CURATED_PHRASES.forEach((phrase, idx) => {
    if (phrase.toLowerCase().includes(clean) && !seenPhrases.has(phrase.toLowerCase())) {
      seenPhrases.add(phrase.toLowerCase());
      // Count matching products
      const count = products.filter(
        (p) =>
          p.name.toLowerCase().includes(clean) ||
          p.description?.toLowerCase().includes(clean)
      ).length;

      suggestions.push({
        id: `curated_${idx}`,
        phrase: phrase,
        itemCount: count > 0 ? count : undefined,
        type: 'popular',
      });
    }
  });

  // 3. Extract phrases and high-ranking titles from Products
  products.forEach((prod) => {
    const prodName = prod.name;
    const lowerName = prodName.toLowerCase();

    if (lowerName.includes(clean)) {
      // Suggest full or concise product title
      if (!seenPhrases.has(lowerName)) {
        seenPhrases.add(lowerName);
        const cat = categories.find((c) => c.id === prod.category_id);
        suggestions.push({
          id: `prod_${prod.id}`,
          phrase: prodName,
          category: cat ? cat.name : prod.brand,
          categorySlug: cat?.slug,
          type: 'product',
        });
      }

      // Also suggest keyword sub-phrases (e.g. "Cotton Rompers" from "JOJI Pure Cotton Rompers Set")
      const words = prodName.split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const biPhrase = `${words[i]} ${words[i + 1]}`.replace(/[^\w\s-]/g, '');
        if (
          biPhrase.toLowerCase().includes(clean) &&
          biPhrase.length > clean.length &&
          !seenPhrases.has(biPhrase.toLowerCase())
        ) {
          seenPhrases.add(biPhrase.toLowerCase());
          suggestions.push({
            id: `sub_${prod.id}_${i}`,
            phrase: biPhrase,
            type: 'popular',
          });
        }
      }
    }
  });

  // Sort: Exact prefix matches first, then shorter phrases, up to 7 suggestions
  return suggestions
    .sort((a, b) => {
      const aStarts = a.phrase.toLowerCase().startsWith(clean);
      const bStarts = b.phrase.toLowerCase().startsWith(clean);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.phrase.length - b.phrase.length;
    })
    .slice(0, 7);
};
