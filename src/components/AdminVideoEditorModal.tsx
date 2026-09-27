import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Film,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Video,
  Play,
  Tag,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  VideoReel,
  getStoredVideoReels,
  saveStoredVideoReels,
  resetStoredVideoReels,
  DEFAULT_VIDEO_REELS,
} from '../lib/heroMediaStorage';

interface AdminVideoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
}

export const AdminVideoEditorModal: React.FC<AdminVideoEditorModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onOpenAdminLogin,
}) => {
  const [reels, setReels] = useState<VideoReel[]>(() => getStoredVideoReels());
  const [selectedReelId, setSelectedReelId] = useState<string>(reels[0]?.id || 'diwali-reel');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  // Security gate: If somehow opened without admin session, show gatekeeper prompt
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Film className="w-7 h-7" />
          </div>
          <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
            Admin Authentication Required
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The Cinematic Video Section and Store Video Reels can only be edited or updated after logging in as an authorized store administrator.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdminLogin();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeReel = reels.find((r) => r.id === selectedReelId) || reels[0];

  const handleUpdateActiveReel = (field: keyof VideoReel, value: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === activeReel.id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddNewReel = () => {
    const newId = `custom-reel-${Date.now()}`;
    const newReel: VideoReel = {
      id: newId,
      title: `Store Promo Reel #${reels.length + 1}`,
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
    const updated = [...reels, newReel];
    setReels(updated);
    setSelectedReelId(newId);
    setStatusMessage({ text: 'New video reel added! Make your changes and click Save.', type: 'success' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDeleteReel = (idToDelete: string) => {
    if (reels.length <= 1) {
      setStatusMessage({ text: 'At least one cinematic video reel must remain active.', type: 'error' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    const updated = reels.filter((r) => r.id !== idToDelete);
    setReels(updated);
    setSelectedReelId(updated[0].id);
    saveStoredVideoReels(updated);
    setStatusMessage({ text: 'Reel deleted and updated successfully.', type: 'success' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveAll = () => {
    const success = saveStoredVideoReels(reels);
    if (success) {
      setStatusMessage({ text: '✓ Cinematic Video Reels updated and published successfully!', type: 'success' });
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ text: 'Failed saving video reels to storage.', type: 'error' });
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all cinematic video reels to the original factory defaults?')) {
      resetStoredVideoReels();
      setReels(DEFAULT_VIDEO_REELS);
      setSelectedReelId(DEFAULT_VIDEO_REELS[0].id);
      setStatusMessage({ text: '✓ Video reels reset to official defaults.', type: 'success' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  Admin • Cinematic Video Section Manager
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update video links, headlines, discounts, and custom store reels for Dewas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Strip */}
        {statusMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-b border-rose-500/20'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Body Container (Reels List & Form Editor) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Reels Navigation & Add Button */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Active Reels ({reels.length})
              </span>
              <button
                type="button"
                onClick={handleAddNewReel}
                className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Reel</span>
              </button>
            </div>

            <div className="space-y-2">
              {reels.map((reel, idx) => {
                const isSelected = reel.id === selectedReelId;
                return (
                  <div
                    key={reel.id}
                    onClick={() => setSelectedReelId(reel.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {reel.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {reel.discount} • {reel.coupon}
                        </div>
                      </div>
                    </div>

                    {reels.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReel(reel.id);
                        }}
                        title="Delete this reel"
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Official Defaults</span>
              </button>
            </div>
          </div>

          {/* Right Column: Edit Active Reel Form */}
          <div className="md:col-span-8 space-y-4">
            {activeReel && (
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-amber-500" />
                    <span>Edit Reel: {activeReel.title}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">ID: {activeReel.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Reel Tab Label */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tab Title
                    </label>
                    <input
                      type="text"
                      value={activeReel.title}
                      onChange={(e) => handleUpdateActiveReel('title', e.target.value)}
                      placeholder="e.g. Royal Diwali Reel"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  {/* Top Badge */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Top Badge Pill
                    </label>
                    <input
                      type="text"
                      value={activeReel.badge}
                      onChange={(e) => handleUpdateActiveReel('badge', e.target.value)}
                      placeholder="e.g. ✨ DIWALI SPECIAL"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  {/* Video URL */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Video MP4 URL (Direct Video Source)
                    </label>
                    <input
                      type="text"
                      value={activeReel.videoSrc}
                      onChange={(e) => handleUpdateActiveReel('videoSrc', e.target.value)}
                      placeholder="https://.../video.mp4"
                      className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  {/* Poster Image URL */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Video Poster Thumbnail Image
                    </label>
                    <input
                      type="text"
                      value={activeReel.posterSrc}
                      onChange={(e) => handleUpdateActiveReel('posterSrc', e.target.value)}
                      placeholder="https://.../poster.jpg"
                      className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  {/* Headline */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Headline (Big Text)
                    </label>
                    <input
                      type="text"
                      value={activeReel.headline}
                      onChange={(e) => handleUpdateActiveReel('headline', e.target.value)}
                      placeholder="e.g. Sparkle in Royal Ethnic Wear"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  {/* Caption */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Caption / Description
                    </label>
                    <textarea
                      rows={2}
                      value={activeReel.caption}
                      onChange={(e) => handleUpdateActiveReel('caption', e.target.value)}
                      placeholder="Short promo summary for Dewas customers..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  {/* Discount Tag */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Discount Badge Tag
                    </label>
                    <input
                      type="text"
                      value={activeReel.discount}
                      onChange={(e) => handleUpdateActiveReel('discount', e.target.value)}
                      placeholder="e.g. FLAT 40% OFF"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  {/* Coupon Code */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={activeReel.coupon}
                      onChange={(e) => handleUpdateActiveReel('coupon', e.target.value.toUpperCase())}
                      placeholder="e.g. DIWALI40"
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Updates require authenticated store admin login</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Publish Video Section</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
