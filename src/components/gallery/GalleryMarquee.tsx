"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { MediaItem } from "@/types";

interface GalleryMarqueeProps {
  items: MediaItem[];
}

export function GalleryMarquee({ items }: GalleryMarqueeProps) {
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter for photos only (strictly images in photo gallery) and sort by displayOrder
  const photoItems = [...items.filter((item) => item.type !== "video")].sort(
    (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
  );

  // Ensure enough items for smooth infinite loop by alternating into two rows
  const row1Base = photoItems.filter((_, idx) => idx % 2 === 0);
  const row2Base = photoItems.filter((_, idx) => idx % 2 !== 0);

  // Fallbacks if one row is empty
  const r1Source = row1Base.length > 0 ? row1Base : photoItems;
  const r2Source = row2Base.length > 0 ? row2Base : photoItems;

  // Duplicate items to ensure the track is plenty wide enough for seamless -50% translation
  const repeatToMinimum = (arr: MediaItem[], min: number = 8): MediaItem[] => {
    if (arr.length === 0) return [];
    let result = [...arr];
    while (result.length < min) {
      result = [...result, ...arr];
    }
    return result;
  };

  const row1Items = repeatToMinimum(r1Source, 8);
  const row2Items = repeatToMinimum(r2Source, 8);

  // Duplicated twice for 0% -> -50% seamless CSS loop
  const loopRow1 = [...row1Items, ...row1Items];
  const loopRow2 = [...row2Items, ...row2Items];

  // Lightbox navigation
  const activeIndex = activeItem
    ? photoItems.findIndex((it) => (it._id || it.url) === (activeItem._id || activeItem.url))
    : -1;

  const handleNext = useCallback(() => {
    if (activeIndex === -1 || photoItems.length === 0) return;
    const nextIdx = (activeIndex + 1) % photoItems.length;
    setActiveItem(photoItems[nextIdx]);
  }, [activeIndex, photoItems]);

  const handlePrev = useCallback(() => {
    if (activeIndex === -1 || photoItems.length === 0) return;
    const prevIdx = (activeIndex - 1 + photoItems.length) % photoItems.length;
    setActiveItem(photoItems[prevIdx]);
  }, [activeIndex, photoItems]);

  const handleClose = useCallback(() => {
    setActiveItem(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeItem) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, handleClose, handleNext, handlePrev]);

  // Lock body scroll during lightbox
  useEffect(() => {
    if (activeItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeItem]);

  return (
    <div className="relative w-full overflow-hidden select-none py-4">
      {/* Edge Shadow Vignettes for Cinematic Infinite Fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

      {/* Row 1 / Layer 1: Moving to LEFT */}
      <div className="mb-4 sm:mb-5 lg:mb-6 overflow-hidden">
        <div className="animate-marquee-left hover:[animation-play-state:paused] marquee-track flex gap-4 sm:gap-6 items-center">
          {loopRow1.map((item, idx) => (
            <div
              key={`row1-${item._id || item.url}-${idx}`}
              onClick={() => setActiveItem(item)}
              className="group relative aspect-[16/10] w-[280px] sm:w-[380px] md:w-[420px] lg:w-[450px] xl:w-[490px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-white/[0.08] bg-neutral-950 transition-all duration-300 hover:border-dk-yellow/50 hover:scale-[1.02]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={item.url}
                  alt={item.title || "DK Dance Company Photo"}
                  fill
                  loading="lazy"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 490px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 / Layer 2: Moving to RIGHT */}
      <div className="overflow-hidden">
        <div className="animate-marquee-right hover:[animation-play-state:paused] marquee-track flex gap-4 sm:gap-6 items-center">
          {loopRow2.map((item, idx) => (
            <div
              key={`row2-${item._id || item.url}-${idx}`}
              onClick={() => setActiveItem(item)}
              className="group relative aspect-[16/10] w-[280px] sm:w-[380px] md:w-[420px] lg:w-[450px] xl:w-[490px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-white/[0.08] bg-neutral-950 transition-all duration-300 hover:border-dk-yellow/50 hover:scale-[1.02]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={item.url}
                  alt={item.title || "DK Dance Company Photo"}
                  fill
                  loading="lazy"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 490px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {activeItem && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={handleClose}
        >
          {/* Prominent Close button at Top-Right */}
          <button
            onClick={handleClose}
            aria-label="Close photo preview"
            className="fixed top-3 right-3 sm:top-6 sm:right-6 z-[100010] inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-neutral-900/95 hover:bg-dk-yellow hover:text-black text-white border-2 border-white/20 hover:border-dk-yellow text-xs sm:text-sm font-heading font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Close</span>
          </button>

          {/* Navigation Controls */}
          {photoItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous photo"
                className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[100005] w-9 h-9 sm:w-16 sm:h-16 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next photo"
                className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[100005] w-9 h-9 sm:w-16 sm:h-16 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Main Media Content */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[65vh] sm:max-h-[75vh] h-[60vh] sm:h-[75vh] flex items-center justify-center overflow-hidden border border-white/10 rounded-2xl bg-black">
              <Image
                src={activeItem.url}
                alt={activeItem.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Media Caption */}
            <div className="w-full mt-4 flex items-center justify-between text-white border-t border-neutral-800 pt-3">
              <div>
                <span className="text-xs font-mono uppercase text-dk-yellow mr-3">
                  {activeItem.category}
                </span>
                <span className="text-sm sm:text-base font-heading font-light uppercase">
                  {activeItem.title}
                </span>
                {activeItem.description && (
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl font-light">
                    {activeItem.description}
                  </p>
                )}
              </div>
              {activeIndex >= 0 && (
                <span className="text-xs font-mono text-neutral-500 whitespace-nowrap ml-4">
                  {activeIndex + 1} / {photoItems.length}
                </span>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
