import React from 'react';

interface JojiBrandTitleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const JojiBrandTitle: React.FC<JojiBrandTitleProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const sizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  }[size];

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className={`font-display font-black tracking-tight flex items-baseline gap-1.5 ${sizeClasses}`}>
        {/* JOJI in vibrant Pink matching logo #FF1D8D / #EC4899 */}
        <span className="text-[#EC4899] drop-shadow-[0_1px_1px_rgba(236,72,153,0.25)] transition-transform duration-200 hover:scale-105 inline-block">
          JOJI
        </span>
        {/* KIDS in vibrant Leaf Green matching logo #22C55E / #16A34A */}
        <span className="text-[#16A34A] dark:text-[#22C55E] drop-shadow-[0_1px_1px_rgba(34,197,94,0.25)] transition-transform duration-200 hover:scale-105 inline-block">
          KIDS
        </span>
        {/* ZONE in vibrant Sky Blue matching logo #0284C7 / #00A3FF */}
        <span className="text-[#0284C7] dark:text-[#38BDF8] drop-shadow-[0_1px_1px_rgba(2,132,199,0.25)] transition-transform duration-200 hover:scale-105 inline-block">
          ZONE
        </span>
      </div>

      {showSubtitle && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide flex items-center gap-1 mt-0.5">
          <span className="font-bold text-[#EC4899]">Fashion</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="font-bold text-[#16A34A] dark:text-[#22C55E]">Fun</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="font-bold text-[#0284C7] dark:text-[#38BDF8]">Toys</span>
        </p>
      )}
    </div>
  );
};
