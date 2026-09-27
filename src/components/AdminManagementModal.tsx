import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Package,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Shirt,
  Footprints,
  ToyBrick,
  Backpack,
  Baby,
  Gift,
  Heart,
  Crown,
  ShoppingBag,
  ExternalLink,
  Save,
  RotateCcw,
  LucideIcon,
  Upload,
  Image as ImageIcon,
  FileCheck,
  Check,
  Zap,
  Film,
  Video,
  Camera,
} from 'lucide-react';
import { Product, Category, AdminSession } from '../types';
import { JojiBrandTitle } from './JojiBrandTitle';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  deleteCategory,
  isTableMissingError
} from '../lib/supabase';
import {
  optimizeAndCompressImage,
  formatBytes,
  ImageOptimizationResult
} from '../lib/imageOptimizer';
import {
  VideoReel,
  getStoredVideoReels,
  saveStoredVideoReels,
  resetStoredVideoReels,
  getStoredCustomBanner,
  saveStoredCustomBanner,
  deleteStoredCustomBanner,
} from '../lib/heroMediaStorage';

interface AdminManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  adminSession: AdminSession | null;
  onLogout: () => void;
  onRefreshData: () => Promise<void>;
  onOpenAddProductDirectly?: boolean;
}

const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: 'Shirt', icon: Shirt },
  { name: 'Footprints', icon: Footprints },
  { name: 'ToyBrick', icon: ToyBrick },
  { name: 'Backpack', icon: Backpack },
  { name: 'Baby', icon: Baby },
  { name: 'Gift', icon: Gift },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Heart', icon: Heart },
  { name: 'Crown', icon: Crown },
  { name: 'ShoppingBag', icon: ShoppingBag },
];

const PRESET_IMAGES = [
  {
    label: 'Girls Festive Peplum Lehenga',
    url: 'https://images.pexels.com/photos/8819389/pexels-photo-8819389.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Krishna Costume Accessories (Crown, Bansuri, Haar)',
    url: 'https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Boys Cotton Tee & Shorts',
    url: 'https://images.pexels.com/photos/5693889/pexels-photo-5693889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Girls Floral Dress',
    url: 'https://images.pexels.com/photos/3662849/pexels-photo-3662849.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Kids Casual Sneakers',
    url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Baby Organic Cotton Romper & Jhabla',
    url: 'https://images.pexels.com/photos/3845492/pexels-photo-3845492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Duck Potty Trainer Chair',
    url: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Baby Bibs & Burp Cloths',
    url: 'https://images.pexels.com/photos/3662852/pexels-photo-3662852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Educational Wooden Puzzle Set',
    url: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    label: 'Cute Cartoon Backpack',
    url: 'https://images.pexels.com/photos/5624977/pexels-photo-5624977.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export const AdminManagementModal: React.FC<AdminManagementModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  adminSession,
  onLogout,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'banners'>('products');

  // Banner & Cinematic Video Management states
  const [adminCustomBanner, setAdminCustomBanner] = useState<string | null>(() => getStoredCustomBanner());
  const [showDeleteBannerConfirm, setShowDeleteBannerConfirm] = useState(false);
  const adminBannerInputRef = useRef<HTMLInputElement>(null);
  const [adminVideoReels, setAdminVideoReels] = useState<VideoReel[]>(() => getStoredVideoReels());
  const [adminSelectedReelId, setAdminSelectedReelId] = useState<string>(() => getStoredVideoReels()[0]?.id || 'diwali-reel');

  // Sync banner & reels whenever storage updates or modal opens
  useEffect(() => {
    const syncBanner = () => setAdminCustomBanner(getStoredCustomBanner());
    const syncReels = () => setAdminVideoReels(getStoredVideoReels());
    window.addEventListener('joji_banner_updated', syncBanner);
    window.addEventListener('joji_video_reels_updated', syncReels);
    return () => {
      window.removeEventListener('joji_banner_updated', syncBanner);
      window.removeEventListener('joji_video_reels_updated', syncReels);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAdminCustomBanner(getStoredCustomBanner());
      setAdminVideoReels(getStoredVideoReels());
      setShowDeleteBannerConfirm(false);
    }
  }, [isOpen]);

  const adminActiveReel = adminVideoReels.find((r) => r.id === adminSelectedReelId) || adminVideoReels[0];

  const handleAdminBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        saveStoredCustomBanner(dataUrl);
        setAdminCustomBanner(dataUrl);
        showFeedback('success', '✓ Custom store banner uploaded and published to storefront!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAdminDeleteBanner = () => {
    deleteStoredCustomBanner();
    setAdminCustomBanner(null);
    setShowDeleteBannerConfirm(false);
    showFeedback('success', '✓ Custom banner deleted successfully! Official Diwali Festive banner restored.');
  };

  const handleAdminUpdateActiveReel = (field: keyof VideoReel, value: string) => {
    setAdminVideoReels((prev) =>
      prev.map((r) => (r.id === adminActiveReel.id ? { ...r, [field]: value } : r))
    );
  };

  const handleAdminAddNewReel = () => {
    const newId = `custom-reel-${Date.now()}`;
    const newReel: VideoReel = {
      id: newId,
      title: `Store Promo Reel #${adminVideoReels.length + 1}`,
      badge: '✨ DEWAS SPECIAL',
      videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      posterSrc: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=900&auto=format&fit=crop&q=80',
      discount: 'FLAT 30% OFF',
      categorySlug: 'clothing',
      headline: 'New Festive Collection 2026',
      caption: 'Exclusive kids festive fashion and active wear available at 120 A.B. Road, Dewas.',
      coupon: 'DEWAS30',
      isCustom: true,
    };
    setAdminVideoReels((prev) => [...prev, newReel]);
    setAdminSelectedReelId(newId);
    showFeedback('success', 'New video reel added! Customize the details and click Save Video Reels.');
  };

  const handleAdminDeleteReel = (idToDelete: string) => {
    if (adminVideoReels.length <= 1) {
      showFeedback('error', 'At least one cinematic video reel must remain active.');
      return;
    }
    const updated = adminVideoReels.filter((r) => r.id !== idToDelete);
    setAdminVideoReels(updated);
    setAdminSelectedReelId(updated[0].id);
    saveStoredVideoReels(updated);
    showFeedback('success', '✓ Video reel deleted.');
  };

  const handleAdminSaveVideoReels = () => {
    const ok = saveStoredVideoReels(adminVideoReels);
    if (ok) {
      showFeedback('success', '✓ Cinematic video section and reels updated successfully!');
    } else {
      showFeedback('error', 'Failed saving video reels.');
    }
  };

  const handleAdminResetVideoReels = () => {
    resetStoredVideoReels();
    const def = getStoredVideoReels();
    setAdminVideoReels(def);
    setAdminSelectedReelId(def[0].id);
    showFeedback('success', '✓ All cinematic video reels reset to defaults.');
  };

  // Product Filter and Search in Admin Panel
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Product Add / Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    brand: 'JOJI KIDS ZONE',
    description: '',
    price: 499,
    old_price: 899,
    category_id: '',
    gender: 'unisex' as 'boys' | 'girls' | 'unisex',
    age_group: '2-4Y',
    image_url: PRESET_IMAGES[0].url,
    tag: 'NEW',
    rating: 4.8,
    is_bestseller: false,
    is_active: true,
  });

  // Category Add Form state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catIcon, setCatIcon] = useState('Sparkles');
  const [catSortOrder, setCatSortOrder] = useState(10);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Image Upload, Auto-Resize & WebP Compression states
  const [imageStats, setImageStats] = useState<ImageOptimizationResult | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleImageFileUpload = async (file: File) => {
    if (!file) return;
    setIsProcessingImage(true);
    try {
      const result = await optimizeAndCompressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82,
        thumbSize: 200,
      });
      setProductFormData((prev) => ({ ...prev, image_url: result.dataUrl }));
      setImageStats(result);
      showFeedback(
        'success',
        `Image resized to ${result.width}×${result.height} & WebP compressed (${result.savingsPercent}% saved)!`
      );
    } catch (err: any) {
      console.error('Image compression failed:', err);
      showFeedback('error', err.message || 'Image compression failed');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // ----------------------------------------------------
  // Product Actions
  // ----------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setImageStats(null);
    setProductFormData({
      name: '',
      brand: 'JOJI KIDS ZONE',
      description: '',
      price: 499,
      old_price: 799,
      category_id: categories.length > 0 ? categories[0].id : '',
      gender: 'unisex',
      age_group: '2-4Y',
      image_url: PRESET_IMAGES[0].url,
      tag: 'NEW',
      rating: 4.8,
      is_bestseller: false,
      is_active: true,
    });
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImageStats(null);
    setProductFormData({
      name: product.name,
      brand: product.brand || 'JOJI KIDS ZONE',
      description: product.description || '',
      price: product.price,
      old_price: product.old_price || Math.round(product.price * 1.4),
      category_id: product.category_id || (categories[0]?.id ?? ''),
      gender: (product.gender as any) || 'unisex',
      age_group: product.age_group || '2-4Y',
      image_url: product.image_url,
      tag: product.tag || 'NEW',
      rating: product.rating || 4.8,
      is_bestseller: product.is_bestseller,
      is_active: product.is_active,
    });
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      showFeedback('error', 'Please provide a product title.');
      return;
    }
    if (!productFormData.image_url.trim()) {
      showFeedback('error', 'Please provide an image URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Update product
        await updateProduct(editingProduct.id, {
          name: productFormData.name.trim(),
          brand: productFormData.brand.trim(),
          description: productFormData.description.trim() || null,
          price: Number(productFormData.price),
          old_price: Number(productFormData.old_price),
          discount_percent: Math.round(
            ((Number(productFormData.old_price) - Number(productFormData.price)) /
              Number(productFormData.old_price)) *
              100
          ),
          category_id: productFormData.category_id || null,
          gender: productFormData.gender,
          age_group: productFormData.age_group.trim() || null,
          image_url: productFormData.image_url.trim(),
          tag: productFormData.tag.trim() || null,
          rating: Number(productFormData.rating),
          is_bestseller: productFormData.is_bestseller,
          is_active: productFormData.is_active,
        });
        showFeedback('success', `Product "${productFormData.name}" updated successfully.`);
      } else {
        // Add new product
        await addProduct({
          name: productFormData.name.trim(),
          brand: productFormData.brand.trim() || 'JOJI KIDS ZONE',
          description: productFormData.description.trim() || null,
          price: Number(productFormData.price),
          old_price: Number(productFormData.old_price),
          discount_percent: Math.round(
            ((Number(productFormData.old_price) - Number(productFormData.price)) /
              Number(productFormData.old_price)) *
              100
          ),
          category_id: productFormData.category_id || null,
          gender: productFormData.gender,
          age_group: productFormData.age_group.trim() || null,
          image_url: productFormData.image_url.trim(),
          tag: productFormData.tag.trim() || 'NEW',
          color_theme: 'amber',
          rating: Number(productFormData.rating) || 4.8,
          is_bestseller: productFormData.is_bestseller,
          is_active: productFormData.is_active,
        });
        showFeedback('success', `New product "${productFormData.name}" added to catalog.`);
      }

      setIsProductFormOpen(false);
      await onRefreshData();
    } catch (err: any) {
      if (isTableMissingError(err)) {
        showFeedback('error', 'Supabase table "products" is not initialized yet. Please open Database Status and run the setup SQL script.');
      } else {
        showFeedback('error', 'Error saving product: ' + (err.message || 'Database error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"?\nThis will remove it from the catalog, cart, and live database.`
    );
    if (!confirmDelete) return;

    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      showFeedback('success', `Item "${product.name}" has been deleted.`);
      await onRefreshData();
    } catch (err: any) {
      if (isTableMissingError(err)) {
        showFeedback('error', 'Supabase table "products" is not initialized yet. Please run the setup SQL script.');
      } else {
        showFeedback('error', 'Error deleting item: ' + (err.message || 'Database error'));
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ----------------------------------------------------
  // Category Actions
  // ----------------------------------------------------
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = catName.trim();
    if (!cleanName) {
      showFeedback('error', 'Please enter a category name.');
      return;
    }

    const cleanSlug = catSlug.trim()
      ? catSlug.trim().toLowerCase().replace(/\s+/g, '-')
      : cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Check duplicate slug
    if (categories.some((c) => c.slug === cleanSlug)) {
      showFeedback('error', `A category with slug "${cleanSlug}" already exists.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await addCategory({
        name: cleanName,
        slug: cleanSlug,
        icon_name: catIcon,
        sort_order: Number(catSortOrder) || categories.length + 1,
      });

      setCatName('');
      setCatSlug('');
      setCatIcon('Sparkles');
      setCatSortOrder(categories.length + 2);
      showFeedback('success', `Category "${cleanName}" added successfully.`);
      await onRefreshData();
    } catch (err: any) {
      if (isTableMissingError(err)) {
        showFeedback('error', 'Supabase table "categories" is not initialized yet. Please run the setup SQL script.');
      } else {
        showFeedback('error', 'Failed adding category: ' + (err.message || 'Database error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const itemCount = products.filter((p) => p.category_id === category.id).length;
    const confirmDelete = window.confirm(
      `Delete category "${category.name}"?\n${itemCount} product(s) linked to this category will become unassigned.`
    );
    if (!confirmDelete) return;

    setDeletingId(category.id);
    try {
      await deleteCategory(category.id);
      showFeedback('success', `Category "${category.name}" deleted.`);
      await onRefreshData();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      showFeedback('error', 'Failed deleting category: ' + (err.message || 'Database error'));
    } finally {
      setDeletingId(null);
    }
  };

  // Filter products for admin table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      selectedCategoryFilter === 'all' || p.category_id === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
              <Package className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-xl tracking-tight text-white">
                  JOJI KIDS ZONE • Admin Console
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live DB Access
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-amber-300 font-semibold">{adminSession?.email || 'admin'}</span>
              </p>
            </div>
          </div>

          {/* Navigation tabs & Logout */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex p-1 bg-slate-800 rounded-2xl border border-slate-700">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Items ({products.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Categories ({categories.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('banners')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'banners'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Banners &amp; Video</span>
              </button>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out of Admin Mode"
              className="p-2 text-rose-400 hover:text-white hover:bg-rose-600/30 rounded-xl transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-b border-rose-200 dark:border-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50">
          {/* ---------------------------------------------------- */}
          {/* TAB 1: PRODUCTS / ITEMS MANAGEMENT                   */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Product Controls Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search items by name or brand..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={onRefreshData}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Reload from Supabase"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>

                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Item</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Gender / Age</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Tag</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-10 text-center text-slate-400 dark:text-slate-500">
                            No items found matching your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((item) => {
                          const cat = categories.find((c) => c.id === item.category_id);
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                      {item.name}
                                    </div>
                                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                      {item.brand || 'JOJI KIDS ZONE'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {cat?.name || 'Unassigned'}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <div className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                                  {item.gender || 'Unisex'}
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-500">
                                  {item.age_group || 'All Ages'}
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900 dark:text-white">₹{item.price}</div>
                                {item.old_price && (
                                  <div className="text-[11px] text-slate-400 dark:text-slate-500 line-through">
                                    ₹{item.old_price}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                {item.tag ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300">
                                    {item.tag}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">—</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditProduct(item)}
                                    title="Edit item"
                                    className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(item)}
                                    disabled={deletingId === item.id}
                                    title="Delete item from catalog"
                                    className="p-1.5 text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: CATEGORIES MANAGEMENT                         */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Category Form */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Add New Category</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">Creates a new section in navigation</p>
                  </div>
                </div>

                <form onSubmit={handleAddCategory} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={catName}
                      onChange={(e) => {
                        setCatName(e.target.value);
                        if (!catSlug || catSlug === catName.toLowerCase().replace(/\s+/g, '-')) {
                          setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                        }
                      }}
                      placeholder="e.g., Ethnic Wear, Sleepwear, Party"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={catSlug}
                      onChange={(e) => setCatSlug(e.target.value)}
                      placeholder="e.g., ethnic-wear"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Icon
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {AVAILABLE_ICONS.map(({ name, icon: IconComp }) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setCatIcon(name)}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                            catIcon === name
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700'
                          }`}
                          title={name}
                        >
                          <IconComp className="w-4 h-4" />
                          <span className="text-[9px] mt-0.5 truncate w-full text-center">
                            {name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={catSortOrder}
                      onChange={(e) => setCatSortOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-slate-900 dark:bg-amber-500 hover:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Category</span>
                  </button>
                </form>
              </div>

              {/* Categories List */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Live Categories ({categories.length})
                  </h4>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Linked to Supabase live database
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const itemCount = products.filter((p) => p.category_id === category.id).length;
                    const IconComp =
                      AVAILABLE_ICONS.find((i) => i.name === category.icon_name)?.icon || Sparkles;

                    return (
                      <div
                        key={category.id}
                        className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 group hover:border-amber-300 dark:hover:border-amber-500 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-sm text-slate-900 dark:text-white">{category.name}</h5>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                              <span>/{category.slug}</span>
                              <span>•</span>
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">{itemCount} items</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteCategory(category)}
                          disabled={deletingId === category.id}
                          title="Delete Category"
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 3: BANNERS & CINEMATIC VIDEO SECTION MANAGEMENT  */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              {/* Section 1: Hero Banner Management */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-500" />
                        <span>Storefront Hero Promotional Banner</span>
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          adminCustomBanner
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {adminCustomBanner ? 'Custom Banner Active' : 'Official Diwali Festive Banner'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Upload promotional posters or delete custom banners to restore the default official carnival banner
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={adminBannerInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAdminBannerUpload}
                    />
                    <button
                      type="button"
                      onClick={() => adminBannerInputRef.current?.click()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload New Banner</span>
                    </button>

                    {adminCustomBanner ? (
                      showDeleteBannerConfirm ? (
                        <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/80 p-1 rounded-xl border border-rose-300 dark:border-rose-800 animate-in fade-in">
                          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 px-1">
                            Delete Banner?
                          </span>
                          <button
                            type="button"
                            onClick={handleAdminDeleteBanner}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            Yes, Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteBannerConfirm(false)}
                            className="px-2 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowDeleteBannerConfirm(true)}
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Delete custom banner and restore default"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Banner</span>
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={handleAdminDeleteBanner}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                        title="Ensure default official banner is set"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                        <span>Official Default Active</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Banner Preview Card */}
                <div className="relative aspect-21/9 max-h-72 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 group/prev">
                  <img
                    src={adminCustomBanner || '/diwali-carnival-banner.svg'}
                    alt="Active Storefront Banner Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/75 backdrop-blur-md rounded-xl text-white text-[11px] font-bold border border-white/20 flex items-center gap-2">
                    <span>
                      Live Preview:{' '}
                      {adminCustomBanner
                        ? 'Custom Uploaded Banner'
                        : 'Official Diwali Festive Banner (Default)'}
                    </span>
                    {adminCustomBanner && (
                      <button
                        type="button"
                        onClick={handleAdminDeleteBanner}
                        className="ml-2 px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                      >
                        Delete &amp; Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Cinematic Video Section Management */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-amber-500" />
                      <span>Cinematic Video Section &amp; Store Reels</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage video URLs, titles, captions, and festive promo reels for Dewas store
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAdminAddNewReel}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Video Reel</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAdminSaveVideoReels}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Video Reels</span>
                    </button>
                  </div>
                </div>

                {/* Reels Grid & Editor Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Reels list */}
                  <div className="lg:col-span-4 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Active Reels ({adminVideoReels.length})
                    </span>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {adminVideoReels.map((reel, rIdx) => {
                        const isSelected = reel.id === adminSelectedReelId;
                        return (
                          <div
                            key={reel.id}
                            onClick={() => setAdminSelectedReelId(reel.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/20 shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                                {rIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {reel.title}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {reel.discount} • {reel.coupon}
                                </div>
                              </div>
                            </div>

                            {adminVideoReels.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdminDeleteReel(reel.id);
                                }}
                                title="Delete this video reel"
                                className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleAdminResetVideoReels}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Video Reels to Defaults</span>
                    </button>
                  </div>

                  {/* Right Column: Active Reel Editor Form */}
                  <div className="lg:col-span-8 space-y-4">
                    {adminActiveReel && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-amber-500" />
                            <span>Editing: {adminActiveReel.title}</span>
                          </h5>
                          <span className="text-[10px] font-mono text-slate-400">
                            ID: {adminActiveReel.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Reel Tab Title
                            </label>
                            <input
                              type="text"
                              value={adminActiveReel.title}
                              onChange={(e) =>
                                handleAdminUpdateActiveReel('title', e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Badge Tag Pill
                            </label>
                            <input
                              type="text"
                              value={adminActiveReel.badge}
                              onChange={(e) =>
                                handleAdminUpdateActiveReel('badge', e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              MP4 Video URL
                            </label>
                            <input
                              type="text"
                              value={adminActiveReel.videoSrc}
                              onChange={(e) =>
                                handleAdminUpdateActiveReel('videoSrc', e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Video Poster Thumbnail Image URL
                            </label>
                            <input
                              type="text"
                              value={adminActiveReel.posterSrc}
                              onChange={(e) =>
                                handleAdminUpdateActiveReel('posterSrc', e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Headline
                            </label>
                            <input
                              type="text"
                              value={adminActiveReel.headline}
                              onChange={(e) =>
                                handleAdminUpdateActiveReel('headline', e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Caption &amp; Store Description
                            </label>
                            <textarea
                              rows={2}
                              value={adminActiveReel.caption}
                              onChange={(e) =>
                                handleAdminUpdateActiveReel('caption', e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Discount Tag
                            </label>
                            <input
                              type="text"
                              value={adminActiveReel.discount}
                              onChange={(e) =>
                                handleAdminUpdateActiveReel('discount', e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Coupon Code
                            </label>
                            <input
                              type="text"
                              value={adminActiveReel.coupon}
                              onChange={(e) =>
                                handleAdminUpdateActiveReel('coupon', e.target.value.toUpperCase())
                              }
                              className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* ADD / EDIT PRODUCT MODAL (SUB-MODAL)                 */}
        {/* ---------------------------------------------------- */}
        {isProductFormOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    {editingProduct ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">
                      {editingProduct ? 'Edit Catalog Item' : 'Add New Item to Catalog'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Instantly synced to live storefront & Supabase
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsProductFormOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* Product Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    placeholder="e.g., Baby Boys Striped Polo & Chino Shorts"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    required
                  />
                </div>

                {/* Price & Old Price */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Sale Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={productFormData.price}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, price: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      MRP / Old Price (₹)
                    </label>
                    <input
                      type="number"
                      value={productFormData.old_price}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, old_price: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Discount %
                    </label>
                    <div className="px-3 py-2 bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-slate-700 rounded-xl font-bold flex items-center justify-center">
                      {productFormData.old_price > productFormData.price
                        ? `${Math.round(
                            ((productFormData.old_price - productFormData.price) /
                              productFormData.old_price) *
                              100
                          )}% OFF`
                        : '0% OFF'}
                    </div>
                  </div>
                </div>

                {/* Category & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={productFormData.category_id}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, category_id: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={productFormData.gender}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          gender: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option value="boys">Boys</option>
                      <option value="girls">Girls</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Age Group
                    </label>
                    <input
                      type="text"
                      value={productFormData.age_group}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, age_group: e.target.value })
                      }
                      placeholder="e.g., 2-3Y or 4-6Y"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Image Upload & Optimization Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Product Photo *
                    </label>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Auto-Resize + WebP + Thumbnail
                    </span>
                  </div>

                  {/* Drag & Drop Upload Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleImageFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                      isDragging
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-4 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="file"
                      id="product-photo-upload"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageFileUpload(e.target.files[0]);
                        }
                      }}
                      className="sr-only"
                    />

                    {isProcessingImage ? (
                      <div className="flex flex-col items-center justify-center py-4 space-y-2">
                        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold text-slate-800 dark:text-white">
                          Optimizing & Compressing...
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Resizing to HD bounds & converting to lightweight WebP
                        </p>
                      </div>
                    ) : (
                      <label
                        htmlFor="product-photo-upload"
                        className="cursor-pointer flex flex-col items-center justify-center py-2"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2 shadow-xs">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-slate-800 dark:text-white text-xs">
                          Click to upload or drag & drop photo
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Automatically resized (max 1200px), compressed to WebP, with thumbnail
                        </p>
                      </label>
                    )}
                  </div>

                  {/* Optimization Report Badge if Compressed */}
                  {imageStats && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900">
                        <img
                          src={imageStats.thumbnailDataUrl}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-emerald-300 font-bold text-center py-0.5 uppercase">
                          Thumb
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5" /> Auto-Compressed WebP
                          </span>
                          <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-md text-[9px] font-black">
                            {imageStats.savingsPercent}% SMALLER
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                          <span>{imageStats.width}×{imageStats.height}px</span>
                          <span>•</span>
                          <span className="line-through opacity-70">
                            {formatBytes(imageStats.originalSize)}
                          </span>
                          <span>→</span>
                          <span className="font-bold">
                            {formatBytes(imageStats.compressedSize)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual Image URL Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Direct Image URL
                    </label>
                    <input
                      type="text"
                      value={productFormData.image_url}
                      onChange={(e) => {
                        setProductFormData({ ...productFormData, image_url: e.target.value });
                        setImageStats(null);
                      }}
                      placeholder="https://images.pexels.com/... or data:image/webp;base64,..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 truncate"
                      required
                    />
                  </div>

                  {/* Preset Quick Select */}
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                      Or pick from royalty-free kids catalog presets:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setProductFormData({ ...productFormData, image_url: preset.url });
                            setImageStats(null);
                          }}
                          className={`p-1.5 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                            productFormData.image_url === preset.url
                              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-500'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-7 h-7 rounded-md object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium truncate">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tag & Rating */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Promotional Tag
                    </label>
                    <select
                      value={productFormData.tag}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, tag: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option value="NEW">NEW</option>
                      <option value="BESTSELLER">BESTSELLER</option>
                      <option value="TRENDING">TRENDING</option>
                      <option value="100% COTTON">100% COTTON</option>
                      <option value="LIMITED">LIMITED</option>
                      <option value="">None</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Customer Rating (0.0 to 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={productFormData.rating}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, rating: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Checkbox: Bestseller */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_bestseller_check"
                    checked={productFormData.is_bestseller}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, is_bestseller: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-amber-400"
                  />
                  <label htmlFor="is_bestseller_check" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Highlight as Storefront Bestseller
                  </label>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsProductFormOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingProduct ? 'Update Product' : 'Save to Catalog'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
