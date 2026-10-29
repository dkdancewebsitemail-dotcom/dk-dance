"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { MediaItem, MediaCategory } from "@/types";
import { FadeUp } from "@/components/ui/Motion";

interface GalleryGridProps {
  items: MediaItem[];
  showCategories?: boolean;
  limit?: number;
}

const CATEGORIES: Array<"All" | MediaCategory> = [
  "All",
  "Classes",
  "Performances",
  "Stage Shows",
  "Competitions",
  "School Programs",
  "Cultural Events",
  "Workshops",
  "Special Training",
  "Branch Activities",
  "Bournemouth",
];

export function GalleryGrid({
  items,
  showCategories = true,
  limit,
}: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Exclusively display photos (strictly no videos in gallery) and sort by displayOrder
  const photoOnlyItems = [...items.filter((item) => item.type !== "video")].sort(
    (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
  );

  const filteredItems = photoOnlyItems.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  const currentItem =
    activeItemIndex !== null ? displayItems[activeItemIndex] : null;

  const handleNext = useCallback(() => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((prev) =>
      prev !== null && prev < displayItems.length - 1 ? prev + 1 : 0
    );
  }, [activeItemIndex, displayItems.length]);

  const handlePrev = useCallback(() => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((prev) =>
      prev !== null && prev > 0 ? prev - 1 : displayItems.length - 1
    );
  }, [activeItemIndex, displayItems.length]);

  const handleClose = useCallback(() => {
    setActiveItemIndex(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeItemIndex === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItemIndex, handleClose, handleNext, handlePrev]);

  // Lock body scroll during lightbox
  useEffect(() => {
    if (activeItemIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeItemIndex]);

  return (
    <div>
      {/* Category Filter Pills */}
      {showCategories && (
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-12 scrollbar-none no-scrollbar overscroll-x-contain">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveItemIndex(null);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  isSelected
                    ? "bg-white text-black font-normal shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {displayItems.length === 0 && (
        <div className="py-24 text-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 glass-panel">
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mb-2">
            No media found in this category
          </p>
          <p className="text-sm text-neutral-400 font-light">
            Check back soon as new class and performance media is uploaded.
          </p>
        </div>
      )}

      {/* Grid with Asymmetrical Rhythm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayItems.map((item, idx) => {
          const isLarge = idx % 5 === 0;

          return (
            <FadeUp
              key={item._id || item.url || idx}
              delay={idx * 0.05}
              className={isLarge ? "sm:col-span-2 sm:row-span-2" : ""}
            >
              <div
                onClick={() => setActiveItemIndex(idx)}
                className="group relative aspect-[4/3] w-full bg-neutral-950 border border-white/[0.08] rounded-3xl overflow-hidden cursor-pointer shadow-xl"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.url}
                    alt={item.title || "DK Dance Company Gallery Media"}
                    fill
                    loading="lazy"
                    className="object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                {/* Subtle Hover Action Indicator */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-lg">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </FadeUp>
          );
        })}
      </div>

      {/* Lightbox / Video Modal */}
      {currentItem && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          onClick={handleClose}
        >
          {/* Prominent Close button at Top-Right */}
          <button
            onClick={handleClose}
            aria-label="Close media dialog"
            className="fixed top-3 right-3 sm:top-6 sm:right-6 z-[100010] inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-neutral-900/95 hover:bg-dk-yellow hover:text-black text-white border-2 border-white/20 hover:border-dk-yellow text-xs sm:text-sm font-heading font-semibold uppercase tracking-widest shadow-[0_10px_35px_rgba(0,0,0,0.9)] transition-all duration-200 cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
            <span>Close</span>
          </button>

          {/* Navigation Controls */}
          {displayItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous item"
                className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[100005] w-9 h-9 sm:w-16 sm:h-16 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl active:scale-95"
              >
                <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next item"
                className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[100005] w-9 h-9 sm:w-16 sm:h-16 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl active:scale-95"
              >
                <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Main Media Content */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[65vh] sm:max-h-[75vh] h-[60vh] sm:h-[75vh] flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl bg-black">
              <Image
                src={currentItem.url}
                alt={currentItem.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Media Caption */}
            <div className="w-full mt-4 flex items-center justify-between text-white border-t border-neutral-800 pt-3">
              <div>
                <span className="text-xs font-mono uppercase text-dk-yellow mr-3">
                  {currentItem.category}
                </span>
                <span className="text-sm font-heading font-light uppercase">
                  {currentItem.title}
                </span>
                {currentItem.description && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {currentItem.description}
                  </p>
                )}
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {activeItemIndex! + 1} / {displayItems.length}
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
