import React from 'react';

interface JojiLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBorder?: boolean;
}

export const JojiLogo: React.FC<JojiLogoProps> = ({
  className = '',
  size = 'md',
  showBorder = true,
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  }[size];

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center select-none ${sizeClasses} ${
        showBorder ? 'ring-2 ring-amber-400/80 shadow-md shadow-amber-500/20' : ''
      } ${className}`}
    >
      <img
        src="/logo.svg"
        alt="JOJI KIDS ZONE Logo"
        className="w-full h-full object-contain rounded-full bg-white"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
