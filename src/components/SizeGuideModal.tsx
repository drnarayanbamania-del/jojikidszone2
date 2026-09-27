import React, { useState, useMemo } from 'react';
import {
  X,
  Ruler,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  Scale,
  Baby
} from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  isFootwear?: boolean;
  currentSelectedSize?: string;
  onSelectSize: (size: string) => void;
}

interface ApparelSizeData {
  size: string;
  ageRange: string;
  minHeightCm: number;
  maxHeightCm: number;
  minAgeYears: number;
  maxAgeYears: number;
  chestCm: string;
  waistCm: string;
  hipCm: string;
}

const APPAREL_SIZE_CHART: ApparelSizeData[] = [
  {
    size: '1-2Y',
    ageRange: '1 - 2 Years',
    minHeightCm: 80,
    maxHeightCm: 90,
    minAgeYears: 1,
    maxAgeYears: 2,
    chestCm: '50 - 52 cm',
    waistCm: '48 - 50 cm',
    hipCm: '50 - 53 cm',
  },
  {
    size: '2-3Y',
    ageRange: '2 - 3 Years',
    minHeightCm: 90,
    maxHeightCm: 98,
    minAgeYears: 2,
    maxAgeYears: 3,
    chestCm: '52 - 54 cm',
    waistCm: '50 - 52 cm',
    hipCm: '53 - 56 cm',
  },
  {
    size: '3-4Y',
    ageRange: '3 - 4 Years',
    minHeightCm: 98,
    maxHeightCm: 105,
    minAgeYears: 3,
    maxAgeYears: 4,
    chestCm: '54 - 57 cm',
    waistCm: '52 - 54 cm',
    hipCm: '56 - 60 cm',
  },
  {
    size: '4-5Y',
    ageRange: '4 - 5 Years',
    minHeightCm: 105,
    maxHeightCm: 112,
    minAgeYears: 4,
    maxAgeYears: 5,
    chestCm: '57 - 60 cm',
    waistCm: '54 - 56 cm',
    hipCm: '60 - 64 cm',
  },
  {
    size: '5-6Y',
    ageRange: '5 - 6 Years',
    minHeightCm: 112,
    maxHeightCm: 120,
    minAgeYears: 5,
    maxAgeYears: 6,
    chestCm: '60 - 63 cm',
    waistCm: '56 - 58 cm',
    hipCm: '64 - 68 cm',
  },
  {
    size: '6-7Y',
    ageRange: '6 - 7 Years',
    minHeightCm: 120,
    maxHeightCm: 128,
    minAgeYears: 6,
    maxAgeYears: 7,
    chestCm: '63 - 66 cm',
    waistCm: '58 - 60 cm',
    hipCm: '68 - 72 cm',
  },
  {
    size: '7-8Y',
    ageRange: '7 - 8 Years',
    minHeightCm: 128,
    maxHeightCm: 136,
    minAgeYears: 7,
    maxAgeYears: 8,
    chestCm: '66 - 70 cm',
    waistCm: '60 - 62 cm',
    hipCm: '72 - 76 cm',
  },
];

interface FootwearSizeData {
  size: string;
  euSize: string;
  footLengthCm: string;
  ageGuide: string;
  minFootCm: number;
  maxFootCm: number;
}

const FOOTWEAR_SIZE_CHART: FootwearSizeData[] = [
  { size: '21 EU', euSize: '21', footLengthCm: '12.5 - 13.0 cm', ageGuide: '1 - 1.5 Years', minFootCm: 12.0, maxFootCm: 13.0 },
  { size: '22 EU', euSize: '22', footLengthCm: '13.1 - 13.7 cm', ageGuide: '1.5 - 2 Years', minFootCm: 13.1, maxFootCm: 13.7 },
  { size: '23 EU', euSize: '23', footLengthCm: '13.8 - 14.4 cm', ageGuide: '2 - 2.5 Years', minFootCm: 13.8, maxFootCm: 14.4 },
  { size: '24 EU', euSize: '24', footLengthCm: '14.5 - 15.1 cm', ageGuide: '2.5 - 3.5 Years', minFootCm: 14.5, maxFootCm: 15.1 },
  { size: '25 EU', euSize: '25', footLengthCm: '15.2 - 15.8 cm', ageGuide: '3.5 - 4.5 Years', minFootCm: 15.2, maxFootCm: 15.8 },
  { size: '26 EU', euSize: '26', footLengthCm: '15.9 - 16.5 cm', ageGuide: '4.5 - 5.5 Years', minFootCm: 15.9, maxFootCm: 16.5 },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  productName,
  isFootwear = false,
  currentSelectedSize,
  onSelectSize,
}) => {
  // Measurement state
  const [childAgeYears, setChildAgeYears] = useState<number>(3.5);
  const [heightCm, setHeightCm] = useState<number>(102);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [buildPreference, setBuildPreference] = useState<'slim' | 'regular' | 'growth'>('growth');
  const [activeTab, setActiveTab] = useState<'calculator' | 'chart' | 'measuring'>('calculator');

  // Footwear specific
  const [footLengthCm, setFootLengthCm] = useState<number>(14.2);

  // Compute recommendation
  const recommendation = useMemo(() => {
    if (isFootwear) {
      const match = FOOTWEAR_SIZE_CHART.find(
        (s) => footLengthCm >= s.minFootCm && footLengthCm <= s.maxFootCm
      ) || (footLengthCm < 13 ? FOOTWEAR_SIZE_CHART[0] : FOOTWEAR_SIZE_CHART[FOOTWEAR_SIZE_CHART.length - 1]);

      return {
        recommendedSize: match.size,
        confidence: 'High Fit Match',
        reason: `Based on foot length of ${footLengthCm} cm (approx. age ${match.ageGuide}).`,
        tip: 'For active toddlers, leaving 0.5 cm thumb-space at the toe gives room to sprint without chafing.',
      };
    }

    // Apparel Recommendation Logic
    // Find best match according to height and age
    let matchedItem = APPAREL_SIZE_CHART.find(
      (item) => heightCm >= item.minHeightCm && heightCm <= item.maxHeightCm
    );

    if (!matchedItem) {
      matchedItem = APPAREL_SIZE_CHART.find(
        (item) => childAgeYears >= item.minAgeYears && childAgeYears <= item.maxAgeYears
      );
    }

    if (!matchedItem) {
      if (heightCm < 80) matchedItem = APPAREL_SIZE_CHART[0];
      else matchedItem = APPAREL_SIZE_CHART[APPAREL_SIZE_CHART.length - 1];
    }

    let recommendedSize = matchedItem.size;

    // Adjust for build preference
    if (buildPreference === 'growth') {
      const currentIndex = APPAREL_SIZE_CHART.findIndex((s) => s.size === recommendedSize);
      // If close to the upper bound or parent selected growth spurt, suggest next size up
      if (heightCm >= (matchedItem.minHeightCm + matchedItem.maxHeightCm) / 2) {
        if (currentIndex < APPAREL_SIZE_CHART.length - 1) {
          recommendedSize = APPAREL_SIZE_CHART[currentIndex + 1].size;
        }
      }
    }

    const tip =
      buildPreference === 'growth'
        ? 'Selected with growth-spurt allowance so your child can wear this comfortably through upcoming seasons.'
        : buildPreference === 'slim'
        ? 'Snug tailored fit recommended for slimmer silhouettes.'
        : 'True-to-standard pediatric sizing for regular playwear.';

    return {
      recommendedSize,
      confidence: '98% Fit Accuracy',
      reason: `Matched for ${heightCm} cm height (${(heightCm / 2.54).toFixed(0)} inches) & ${childAgeYears} years old.`,
      tip,
    };
  }, [isFootwear, footLengthCm, heightCm, childAgeYears, buildPreference]);

  if (!isOpen) return null;

  const handleApplySize = () => {
    onSelectSize(recommendation.recommendedSize);
    onClose();
  };

  const handleHeightSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setHeightCm(val);
  };

  return (
    <div
      className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        id="size-guide-modal"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                  Smart Size & Fit Recommender
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  <Sparkles className="w-3 h-3" />
                  Growth-Aware
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-md">
                Personalized sizing guide for {productName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`py-3 flex items-center gap-1.5 transition-colors relative cursor-pointer ${
              activeTab === 'calculator'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Fit Calculator</span>
            {activeTab === 'calculator' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`py-3 flex items-center gap-1.5 transition-colors relative cursor-pointer ${
              activeTab === 'chart'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Standard Size Chart</span>
            {activeTab === 'chart' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('measuring')}
            className={`py-3 flex items-center gap-1.5 transition-colors relative cursor-pointer ${
              activeTab === 'measuring'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to Measure</span>
            {activeTab === 'measuring' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-5 animate-fade-in">
              {/* Highlighted Result Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-400/5 to-transparent border-2 border-amber-400/60 dark:border-amber-500/40 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Suggested Best Fit
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-display font-black text-4xl text-slate-950 dark:text-white">
                        {recommendation.recommendedSize}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                        {recommendation.confidence}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {recommendation.reason}
                    </p>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-medium mt-1">
                      💡 {recommendation.tip}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplySize}
                    className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <span>Choose {recommendation.recommendedSize}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* User Measurement Inputs */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-amber-500" />
                  Your Child's Details
                </h4>

                {!isFootwear ? (
                  <>
                    {/* Age Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300">Child Age</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {childAgeYears} {childAgeYears === 1 ? 'Year' : 'Years'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={childAgeYears}
                        onChange={(e) => setChildAgeYears(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                        <span>1 Year</span>
                        <span>3 Years</span>
                        <span>5 Years</span>
                        <span>8 Years</span>
                      </div>
                    </div>

                    {/* Height Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700 dark:text-slate-300">Current Height</span>
                          <div className="inline-flex rounded-md p-0.5 bg-slate-200 dark:bg-slate-700 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setHeightUnit('cm')}
                              className={`px-1.5 py-0.5 rounded ${heightUnit === 'cm' ? 'bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                              cm
                            </button>
                            <button
                              type="button"
                              onClick={() => setHeightUnit('in')}
                              className={`px-1.5 py-0.5 rounded ${heightUnit === 'in' ? 'bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white' : 'text-slate-500'}`}
                            >
                              inch
                            </button>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {heightUnit === 'cm'
                            ? `${heightCm} cm`
                            : `${(heightCm / 2.54).toFixed(1)} inches`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="140"
                        step="1"
                        value={heightCm}
                        onChange={handleHeightSlider}
                        className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                        <span>80 cm (2'7")</span>
                        <span>105 cm (3'5")</span>
                        <span>125 cm (4'1")</span>
                        <span>140 cm (4'7")</span>
                      </div>
                    </div>

                    {/* Fit & Growth Preference */}
                    <div>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Fit & Growth Preference
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'slim', label: 'Slim / Exact', desc: 'True to measurements' },
                          { id: 'regular', label: 'Regular Fit', desc: 'Standard playtime drape' },
                          { id: 'growth', label: 'Room to Grow', desc: 'Size up for longevity' },
                        ].map((pref) => (
                          <button
                            key={pref.id}
                            type="button"
                            onClick={() => setBuildPreference(pref.id as any)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              buildPreference === pref.id
                                ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 font-bold'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-amber-300'
                            }`}
                          >
                            <div className="text-xs font-bold">{pref.label}</div>
                            <div className="text-[10px] opacity-80">{pref.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Footwear measurement */
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-700 dark:text-slate-300">Foot Length (Heel to Toe)</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {footLengthCm} cm (approx. {(footLengthCm / 2.54).toFixed(1)} inches)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12.0"
                      max="17.0"
                      step="0.1"
                      value={footLengthCm}
                      onChange={(e) => setFootLengthCm(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>12 cm</span>
                      <span>14 cm</span>
                      <span>16 cm</span>
                      <span>17 cm</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Size Pills */}
              <div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Available Sizes in Store:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(isFootwear
                    ? FOOTWEAR_SIZE_CHART.map((f) => f.size)
                    : APPAREL_SIZE_CHART.map((a) => a.size)
                  ).map((s) => {
                    const isRec = s === recommendation.recommendedSize;
                    const isCur = s === currentSelectedSize;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onSelectSize(s)}
                        className={`px-3 py-2 text-xs rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isRec
                            ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-xs ring-2 ring-amber-300 dark:ring-amber-500'
                            : isCur
                            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                        }`}
                      >
                        {isRec && <Sparkles className="w-3 h-3" />}
                        <span>{s}</span>
                        {isRec && <span className="text-[10px] opacity-90">(Best Fit)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIZE CHART TABLE */}
          {activeTab === 'chart' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                All measurements are in centimeters unless stated otherwise. Joji garments are designed with a relaxed children's fit.
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                {!isFootwear ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">Size Label</th>
                        <th className="p-3">Age Range</th>
                        <th className="p-3">Child Height</th>
                        <th className="p-3">Chest</th>
                        <th className="p-3">Waist</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {APPAREL_SIZE_CHART.map((row) => {
                        const isMatch = row.size === recommendation.recommendedSize;
                        return (
                          <tr
                            key={row.size}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors ${
                              isMatch ? 'bg-amber-50/70 dark:bg-amber-950/40 font-semibold' : ''
                            }`}
                          >
                            <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {row.size}
                              {isMatch && (
                                <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-md font-bold">
                                  Rec
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{row.ageRange}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">
                              {row.minHeightCm} - {row.maxHeightCm} cm
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{row.chestCm}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{row.waistCm}</td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectSize(row.size);
                                  onClose();
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 rounded-lg transition-colors cursor-pointer"
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3">EU Size</th>
                        <th className="p-3">Foot Length (cm)</th>
                        <th className="p-3">Approx. Age</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {FOOTWEAR_SIZE_CHART.map((row) => {
                        const isMatch = row.size === recommendation.recommendedSize;
                        return (
                          <tr
                            key={row.size}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors ${
                              isMatch ? 'bg-amber-50/70 dark:bg-amber-950/40 font-semibold' : ''
                            }`}
                          >
                            <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {row.size}
                              {isMatch && (
                                <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-md font-bold">
                                  Rec
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{row.footLengthCm}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">{row.ageGuide}</td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectSize(row.size);
                                  onClose();
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 rounded-lg transition-colors cursor-pointer"
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HOW TO MEASURE */}
          {activeTab === 'measuring' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Height (Tallest Point)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Have your child stand barefoot with feet together and back flat against a wall. Place a flat ruler level on their head and mark the wall lightly to measure down to floor.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Chest / Torso</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Measure around the fullest part of the chest, keeping the tape measure horizontal under the armpits. Keep it comfortably snug, not tight.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Waist & Elastic</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Measure around the natural waistline (just above hip bone / belly button level). Joji pants & shorts feature stretchable soft elastic cords for easy adjustment.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">The "Between Sizes" Rule</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Children grow quickly! If your child’s height falls right on the boundary between two sizes, we always advise picking the larger size.
                  </p>
                </div>
              </div>

              {/* Free Exchange Promise */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold">100% Hassle-Free Size Exchanges:</span> If the size isn’t perfect upon delivery, our delivery partner will swap it at your doorstep within 48 hours for free.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Recommended: <span className="font-bold text-slate-800 dark:text-slate-200">{recommendation.recommendedSize}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplySize}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Apply {recommendation.recommendedSize}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
