"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Play, X, ChevronLeft, ChevronRight, Film, ArrowRight } from "lucide-react";
import { MediaItem } from "@/types";
import { FadeUp } from "@/components/ui/Motion";

interface HomeVideoSectionProps {
  videos?: MediaItem[];
}

export function HomeVideoSection({ videos = [] }: HomeVideoSectionProps) {
  const validVideos = [...videos.filter((v) => v.type === "video")].sort(
    (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
  );

  // Maximum 3 videos displayed on the home page showcase
  const displayVideos = validVideos.slice(0, 3);

  // Lightbox Modal state
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to determine YouTube/Vimeo embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/
    );
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    return null;
  };

  const activeVideo =
    fullscreenIndex !== null ? displayVideos[fullscreenIndex] : null;
  const activeEmbedUrl = activeVideo ? getEmbedUrl(activeVideo.url) : null;

  const handleOpen = (index: number) => {
    setFullscreenIndex(index);
  };

  const handleClose = useCallback(() => {
    setFullscreenIndex(null);
  }, []);

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (fullscreenIndex === null || displayVideos.length === 0) return;
      setFullscreenIndex((prev) =>
        prev !== null ? (prev + 1) % displayVideos.length : 0
      );
    },
    [fullscreenIndex, displayVideos.length]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (fullscreenIndex === null || displayVideos.length === 0) return;
      setFullscreenIndex((prev) =>
        prev !== null ? (prev - 1 + displayVideos.length) % displayVideos.length : 0
      );
    },
    [fullscreenIndex, displayVideos.length]
  );

  // Keyboard navigation
  useEffect(() => {
    if (fullscreenIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [fullscreenIndex, handleClose, handleNext, handlePrev]);

  if (displayVideos.length === 0) {
    return null;
  }

  // Modal JSX rendered via portal to document.body
  const modalContent =
    fullscreenIndex !== null && activeVideo && mounted ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Fullscreen video player"
        className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-8"
        onClick={handleClose}
      >
        {/* Close Button at Top-Right */}
        <button
          onClick={handleClose}
          aria-label="Close video"
          className="fixed top-3 right-3 sm:top-6 sm:right-6 z-[100010] inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-neutral-900/95 hover:bg-dk-yellow hover:text-black text-white border-2 border-white/20 hover:border-dk-yellow text-xs sm:text-sm font-heading font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer active:scale-95"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>Close</span>
        </button>

        {/* Top Header Information Bar */}
        <div
          className="w-full max-w-5xl flex items-center justify-between pb-3 mb-3 border-b border-white/[0.12] pr-28 sm:pr-32"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-[11px] font-mono text-dk-yellow uppercase tracking-widest shrink-0">
              {activeVideo.category || "Video"}
            </span>
            <span className="text-neutral-500">•</span>
            <h4 className="text-sm sm:text-base font-heading font-light uppercase tracking-wide text-white truncate">
              {activeVideo.title}
            </h4>
          </div>
        </div>

        {/* Left Navigation Arrow */}
        {displayVideos.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous video"
            className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[100005] w-9 h-9 sm:w-16 sm:h-16 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Right Navigation Arrow */}
        {displayVideos.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next video"
            className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[100005] w-9 h-9 sm:w-16 sm:h-16 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Video Player Box */}
        <div
          className="relative w-full max-w-5xl aspect-video bg-black border border-neutral-800 flex items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {activeEmbedUrl ? (
            <iframe
              src={activeEmbedUrl}
              title={activeVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              ref={modalVideoRef}
              src={activeVideo.url}
              poster={activeVideo.thumbnailUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Bottom Bar: Counter & Quick Close Hint */}
        <div
          className="mt-3 flex items-center justify-between w-full max-w-5xl text-xs font-mono text-neutral-400"
          onClick={(e) => e.stopPropagation()}
        >
          <span>
            {fullscreenIndex + 1} / {displayVideos.length}
          </span>
          <button
            onClick={handleClose}
            className="hover:text-dk-yellow transition-colors underline underline-offset-4 cursor-pointer"
          >
            Click here or press ESC to exit
          </button>
        </div>
      </div>
    ) : null;

  return (
    <section className="relative bg-neutral-950 text-white py-24 sm:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <FadeUp>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dk-yellow mb-3">
                <Film className="w-3.5 h-3.5" />
                <span>DKDC CINEMATIC ARCHIVE // VIDEO SHOWCASE</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-light uppercase tracking-tight text-white">
                Energy In Rhythm. <br />
                <span className="text-neutral-400">Choreography In Motion.</span>
              </h2>
            </FadeUp>
          </div>

          <FadeUp delay={0.15}>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/[0.1] text-neutral-300 hover:text-white hover:border-dk-yellow/50 font-mono text-xs uppercase tracking-widest transition-all duration-300 w-fit hover:scale-105 active:scale-95 group"
            >
              <span>More Videos</span>
              <ArrowRight className="w-3.5 h-3.5 text-dk-yellow transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        </div>

        {/* Square Boxes with Sharp Edges & Video Info - Maximum 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayVideos.map((video, idx) => {
            const thumb =
              video.thumbnailUrl || "/images/styles/contemporary.jpg";

            return (
              <div
                key={video._id || `vid_${idx}`}
                onClick={() => handleOpen(idx)}
                className="group cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Square Box Container with Sharp Edges */}
                <div className="relative aspect-square w-full bg-neutral-900 border border-neutral-800 overflow-hidden group-hover:border-dk-yellow/80 transition-all duration-300">
                  <Image
                    src={thumb}
                    alt={video.title || "DKDC Video"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Dark Vignette Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/55 transition-colors duration-300" />

                  {/* Sharp Minimalist Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black/75 border border-white/20 flex items-center justify-center text-white group-hover:bg-dk-yellow group-hover:text-black group-hover:scale-110 transition-all duration-300">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info / Writings Below */}
                <div className="pt-3.5 px-0.5 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-dk-yellow truncate">
                      {video.category || "Showcase"}
                    </span>
                  </div>

                  <h3 className="text-sm font-heading font-light uppercase tracking-wide text-white group-hover:text-dk-yellow transition-colors line-clamp-2 break-words [overflow-wrap:anywhere]">
                    {video.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render Modal via Portal directly to body */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </section>
  );
}
