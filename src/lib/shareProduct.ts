import { Product } from '../types';

export interface ShareResult {
  shared: boolean;
  copied: boolean;
  message?: string;
}

export const getProductShareUrl = (productId: string): string => {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('product', productId);
  return url.toString();
};

export const shareProduct = async (product: Product): Promise<ShareResult> => {
  const shareUrl = getProductShareUrl(product.id);
  const shareTitle = `${product.name} - ₹${product.price} | JOJI KIDS ZONE`;
  const shareText = `Check out this ${product.name} for ₹${product.price} on JOJI KIDS ZONE (120 A.B. Road, Dewas)! ✨👶`;

  // 1. Try Web Share API first (Native Mobile / Supported Desktop)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      return { shared: true, copied: false, message: 'Shared successfully!' };
    } catch (err: unknown) {
      // User cancelled native share dialogue
      if (err instanceof Error && err.name === 'AbortError') {
        return { shared: false, copied: false };
      }
      // If native sharing fails for another reason, fallback to clipboard copy
      console.warn('Web Share API error, falling back to clipboard copy:', err);
    }
  }

  // 2. Fallback: Copy link to clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      return { shared: false, copied: true, message: 'Product link copied to clipboard!' };
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { shared: false, copied: true, message: 'Product link copied to clipboard!' };
    }
  } catch (clipboardErr) {
    console.error('Failed to copy to clipboard:', clipboardErr);
    return { shared: false, copied: false, message: 'Could not share link' };
  }
};
