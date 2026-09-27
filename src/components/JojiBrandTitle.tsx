import React from 'react';

interface JojiBrandTitleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  withBadge?: boolean;
}

export const JojiBrandTitle: React.FC<JojiBrandTitleProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  withBadge = false,
}) => {
  const sizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl lg:text-[1.65rem]',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  }[size];

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className={`font-display font-black tracking-tight flex items-baseline gap-1.5 ${sizeClasses}`}>
        {/* JOJI in vibrant Pink with rich gradient and drop-shadow */}
        <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(244,63,94,0.35)] transition-transform duration-200 hover:scale-105 inline-block">
          JOJI
        </span>

        {/* KIDS in vibrant Emerald / Leaf Green */}
        <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(16,185,129,0.35)] transition-transform duration-200 hover:scale-105 inline-block">
          KIDS
        </span>

        {/* ZONE in vibrant Electric Sky Blue */}
        <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(14,165,233,0.35)] transition-transform duration-200 hover:scale-105 inline-block">
          ZONE
        </span>

        {/* Pro Trademark Symbol */}
        <span className="text-[9px] sm:text-[10px] font-black text-amber-500 align-super -ml-0.5 select-none opacity-90">
          ™
        </span>

        {/* Optional Pro Store Badge */}
        {withBadge && (
          <span className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-blue-500/15 border border-amber-400/30 text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest ml-1">
            ORIGINAL
          </span>
        )}
      </div>

      {showSubtitle && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide flex items-center gap-1.5 mt-0.5">
          <span className="font-extrabold text-[#EC4899] uppercase text-[10px] tracking-wider">Fashion</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="font-extrabold text-[#16A34A] dark:text-[#22C55E] uppercase text-[10px] tracking-wider">Fun</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="font-extrabold text-[#0284C7] dark:text-[#38BDF8] uppercase text-[10px] tracking-wider">Toys</span>
        </p>
      )}
    </div>
  );
};
