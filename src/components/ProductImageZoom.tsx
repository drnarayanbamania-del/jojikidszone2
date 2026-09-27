import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  Sparkles,
  ShieldCheck,
  RotateCcw as ReturnIcon,
  Search,
  Check,
  X,
} from 'lucide-react';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  tag?: string;
  fallbackSrc?: string;
}

export const ProductImageZoom: React.FC<ProductImageZoomProps> = ({
  src,
  alt,
  tag,
  fallbackSrc = 'https://images.pexels.com/photos/5693891/pexels-photo-5693891.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState(src);

  // Zoom and Pan States
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 to 3.5
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Pan state for active drag/touch inspection mode
  const [isInspectMode, setIsInspectMode] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);

  // Sync image source if prop changes
  useEffect(() => {
    setImgSrc(src);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setIsInspectMode(false);
  }, [src]);

  // Handle Desktop Mouse Move for Hover Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setHoverPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isInspectMode && zoomLevel === 1) {
      setHoverPosition({ x: 50, y: 50 });
    }
  };

  // Toggle or Set Zoom
  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsInspectMode(true);
    setZoomLevel((prev) => Math.min(3.5, Number((prev + 0.5).toFixed(1))));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomLevel((prev) => {
      const next = Math.max(1, Number((prev - 0.5).toFixed(1)));
      if (next === 1) {
        setIsInspectMode(false);
        setPanOffset({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setIsInspectMode(false);
    setHoverPosition({ x: 50, y: 50 });
  };

  // Double Click / Double Tap to toggle Zoom
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (zoomLevel > 1) {
      handleResetZoom();
    } else {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setHoverPosition({ x, y });
      }
      setIsInspectMode(true);
      setZoomLevel(2.5);
    }
  };

  // Drag-to-Pan (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1 && !isHovered) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    };
  };

  const handleDragMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const maxOffset = (zoomLevel - 1) * 120;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPanOffset({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    });
  }, [isDragging, zoomLevel]);

  const handleDragMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMouseMove);
      window.addEventListener('mouseup', handleDragMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMouseMove);
      window.removeEventListener('mouseup', handleDragMouseUp);
    };
  }, [isDragging, handleDragMouseMove, handleDragMouseUp]);

  // Touch Support for Mobile Pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      dragStartRef.current = {
        x: touch.clientX - panOffset.x,
        y: touch.clientY - panOffset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    const touch = e.touches[0];
    const maxOffset = (zoomLevel - 1) * 110;
    const newX = touch.clientX - dragStartRef.current.x;
    const newY = touch.clientY - dragStartRef.current.y;
    setPanOffset({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Determine current effective scale
  // When hovered on desktop without manual inspect lock, use dynamic 2x hover zoom
  const effectiveZoom = isInspectMode ? zoomLevel : isHovered ? 2.2 : 1;
  const isZoomed = effectiveZoom > 1;

  return (
    <>
      <div
        ref={containerRef}
        className={`relative w-full h-full min-h-[300px] md:min-h-full bg-slate-100 dark:bg-slate-800 flex flex-col justify-between overflow-hidden select-none group ${
          isZoomed
            ? isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab md:cursor-crosshair'
            : 'cursor-zoom-in'
        }`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Image with Pan & Zoom Transform */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={imgSrc}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setImgSrc(fallbackSrc)}
            style={{
              transformOrigin: isInspectMode
                ? '50% 50%'
                : `${hoverPosition.x}% ${hoverPosition.y}%`,
              transform: `scale(${effectiveZoom}) translate(${panOffset.x / effectiveZoom}px, ${panOffset.y / effectiveZoom}px)`,
              transition: isDragging
                ? 'none'
                : isHovered && !isInspectMode
                ? 'transform 0.15s ease-out'
                : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="w-full h-full object-cover object-center max-h-[360px] md:max-h-none pointer-events-none will-change-transform"
          />
        </div>

        {/* Tag Pill */}
        {tag && (
          <span className="absolute top-4 left-4 z-10 text-xs font-black uppercase tracking-wider px-3 py-1 bg-amber-500 text-slate-950 rounded-full shadow-md pointer-events-none">
            {tag}
          </span>
        )}

        {/* Floating Zoom & Pan Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3.5}
            title="Zoom in (inspect fabric)"
            className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-700 dark:hover:text-amber-400 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {isZoomed && (
            <>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1 && !isHovered}
                title="Zoom out"
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResetZoom}
                title="Reset zoom & pan"
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreenModal(true);
            }}
            title="Full-screen Texture Inspector"
            className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pan Indicator when Zoomed */}
        {isZoomed && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[11px] font-black px-3 py-1 rounded-full shadow-lg border border-amber-500/30 flex items-center gap-1.5 animate-in fade-in duration-200 pointer-events-none">
            <Move className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>{isInspectMode ? `${zoomLevel}x Zoom` : '2.2x Lens'} • Drag to Pan</span>
          </div>
        )}

        {/* Bottom Fabric Texture Hint Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-3 pt-6 text-white text-xs flex flex-col gap-1.5 transition-opacity duration-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-[11px] text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Fabric & Texture Inspector</span>
            </span>
            <span className="text-[10px] text-slate-300 hidden sm:inline-block">
              {isZoomed ? 'Double-click to reset' : 'Hover or click to zoom'}
            </span>
          </div>

          <div className="hidden sm:flex items-center justify-between text-[11px] text-slate-300 pt-0.5 border-t border-white/10">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Skin Safe
            </span>
            <span className="flex items-center gap-1 font-medium">
              <ReturnIcon className="w-3.5 h-3.5 text-amber-400" />
              15-Day Free Returns
            </span>
          </div>
        </div>
      </div>

      {/* FULLSCREEN FABRIC INSPECTION LIGHTBOX MODAL */}
      {isFullscreenModal && (
        <FullscreenTextureInspector
          imgSrc={imgSrc}
          alt={alt}
          onClose={() => setIsFullscreenModal(false)}
        />
      )}
    </>
  );
};

// High-Resolution Lightbox Fullscreen Inspector
interface FullscreenTextureInspectorProps {
  imgSrc: string;
  alt: string;
  onClose: () => void;
}

const FullscreenTextureInspector: React.FC<FullscreenTextureInspectorProps> = ({
  imgSrc,
  alt,
  onClose,
}) => {
  const [scale, setScale] = useState<number>(2);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const max = (scale - 1) * 350;
    setOffset({
      x: Math.max(-max, Math.min(max, e.clientX - dragStart.current.x)),
      y: Math.max(-max, Math.min(max, e.clientY - dragStart.current.y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => {
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      return Math.max(1, Math.min(4.5, Number((prev + delta).toFixed(2))));
    });
  };

  return (
    <div
      className="fixed inset-0 z-70 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in"
      onWheel={handleWheel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between z-10 bg-slate-900/80 backdrop-blur-md p-3 px-5 rounded-2xl border border-slate-800 text-white max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white truncate max-w-[200px] sm:max-w-md">
              Fabric Texture Inspector: {alt}
            </h3>
            <span className="text-[10px] text-amber-300 font-mono">
              Zoom: {scale}x • Click & Drag to inspect stitching & weave
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(4.5, Number((s + 0.5).toFixed(1))))}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(1, Number((s - 0.5).toFixed(1))))}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setScale(1.5);
              setOffset({ x: 0, y: 0 });
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition-colors ml-2"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Pan Surface */}
      <div
        className="flex-1 w-full flex items-center justify-center overflow-hidden my-4 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          src={imgSrc}
          alt={alt}
          style={{
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="max-h-[75vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl pointer-events-none will-change-transform"
        />
      </div>

      {/* Bottom Hint */}
      <div className="text-center text-[11px] text-slate-400 z-10">
        Tip: Scroll mouse wheel to zoom dynamically • Drag in any direction to pan across fabric weave
      </div>
    </div>
  );
};
