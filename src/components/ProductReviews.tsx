import React, { useState, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  ShieldCheck,
  PenLine,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ProductReview } from '../types';
import { fetchProductReviews, addProductReview, voteHelpfulReview } from '../lib/supabase';

interface ProductReviewsProps {
  productId: string;
  productName: string;
  onReviewsCountChange?: (count: number, avgRating: number) => void;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productName,
  onReviewsCountChange,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [isWriting, setIsWriting] = useState(false);
  const [votedHelpful, setVotedHelpful] = useState<Set<string>>(new Set());

  // Form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load reviews on mount and when productId changes
  useEffect(() => {
    let isMounted = true;
    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await fetchProductReviews(productId);
        if (isMounted) {
          setReviews(data);
          if (onReviewsCountChange && data.length > 0) {
            const avg = data.reduce((acc, r) => acc + r.rating, 0) / data.length;
            onReviewsCountChange(data.length, Math.round(avg * 10) / 10);
          }
        }
      } catch (err) {
        console.warn('Notice loading reviews:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Derived rating metrics
  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  const filteredReviews = starFilter === 'all'
    ? reviews
    : reviews.filter((r) => Math.round(r.rating) === starFilter);

  const handleVoteHelpful = async (reviewId: string, currentHelpful = 0) => {
    if (votedHelpful.has(reviewId)) return;
    setVotedHelpful((prev) => new Set(prev).add(reviewId));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r))
    );
    await voteHelpfulReview(reviewId, currentHelpful);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setSubmitError('Please provide a short comment about your experience.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const savedReview = await addProductReview({
        product_id: productId,
        user_name: userName.trim() || 'Happy Parent',
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        verified_purchase: true,
      });

      const updated = [savedReview, ...reviews.filter((r) => r.id !== savedReview.id)];
      setReviews(updated);
      setSubmitSuccess(true);
      setIsWriting(false);

      // Reset form
      setUserName('');
      setTitle('');
      setComment('');
      setRating(5);

      if (onReviewsCountChange) {
        const avg = updated.reduce((acc, r) => acc + r.rating, 0) / updated.length;
        onReviewsCountChange(updated.length, Math.round(avg * 10) / 10);
      }

      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      console.warn('Error submitting review:', err);
      setSubmitError('Unable to post review right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingDescriptor = (val: number) => {
    switch (val) {
      case 5: return 'Loved it! (5/5)';
      case 4: return 'Good quality (4/5)';
      case 3: return 'Average / As expected (3/5)';
      case 2: return 'Below expectations (2/5)';
      case 1: return 'Disappointed (1/5)';
      default: return '';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 30) return `${diffDays} days ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-5" id="product-reviews-container">
      {/* Header Summary Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Left score */}
          <div className="sm:col-span-5 text-center sm:text-left flex sm:flex-col items-center sm:items-start justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 pb-3 sm:pb-0 sm:pr-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
                  {avgRating}
                </span>
                <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(Number(avgRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Based on {totalCount} verified parent {totalCount === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsWriting((prev) => !prev)}
              className="mt-0 sm:mt-3 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>{isWriting ? 'Cancel Review' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Right Rating Breakdown Bars */}
          <div className="sm:col-span-7 space-y-1.5">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const count = starCounts[starNum] || 0;
              const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
              const isSelected = starFilter === starNum;

              return (
                <button
                  key={starNum}
                  type="button"
                  onClick={() => setStarFilter(isSelected ? 'all' : starNum)}
                  className={`w-full flex items-center gap-2 text-xs group text-left px-1.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    isSelected ? 'bg-amber-100/70 dark:bg-amber-950/60 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={`Filter by ${starNum} stars`}
                >
                  <span className="w-6 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                    {starNum} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                  </span>

                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        starNum >= 4
                          ? 'bg-emerald-500'
                          : starNum === 3
                          ? 'bg-amber-500'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-10 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Thank you! Your verified feedback has been published and saved to Supabase.</span>
        </div>
      )}

      {/* Write a Review Collapsible Form */}
      {isWriting && (
        <form
          onSubmit={handleSubmitReview}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border-2 border-amber-300 dark:border-amber-500/50 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Share your experience for {productName}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Overall Rating *
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const active = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          active
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {getRatingDescriptor(hoverRating || rating)}
              </span>
            </div>
          </div>

          {/* Reviewer Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Name / Parent Identifier
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g., Anita Sharma (Mother of 3yo)"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Review Headline (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Breathable fabric & beautiful print"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Feedback *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other parents about the sizing, soft touch, wash durability, and comfort for kids..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {submitError && (
            <div className="text-xs text-rose-500 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting to Supabase...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Count Bar */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          <span>Parent Testimonials ({filteredReviews.length})</span>
        </div>

        {starFilter !== 'all' && (
          <button
            type="button"
            onClick={() => setStarFilter('all')}
            className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Showing {starFilter}★ only</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
          <span>Fetching reviews from Supabase...</span>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-6 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No {starFilter !== 'all' ? `${starFilter}-star` : ''} reviews yet for this product.
          </p>
          <button
            type="button"
            onClick={() => {
              setStarFilter('all');
              setIsWriting(true);
            }}
            className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
          >
            Be the first parent to share a review!
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((rev) => {
            const hasVoted = votedHelpful.has(rev.id);
            return (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-2 shadow-2xs hover:border-amber-200 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar Badge */}
                    <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {rev.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rev.user_name}
                        </span>
                        {rev.verified_purchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                            <ShieldCheck className="w-3 h-3" />
                            Verified Parent
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {formatDate(rev.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Star Rating Badge */}
                  <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-lg border border-amber-200/60 dark:border-amber-900/60">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                {rev.title && (
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 pt-0.5">
                    {rev.title}
                  </h4>
                )}

                {/* Comment */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>

                {/* Footer / Helpful Button */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                  <span>Authentic parent feedback</span>
                  <button
                    type="button"
                    onClick={() => handleVoteHelpful(rev.id, rev.helpful_count || 0)}
                    disabled={hasVoted}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      hasVoted
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'fill-emerald-600 dark:fill-emerald-400' : ''}`} />
                    <span>Helpful ({rev.helpful_count || 0})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
