"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Film,
  ArrowRight,
} from "lucide-react";
import { MediaItem } from "@/types";
import { FadeUp } from "@/components/ui/Motion";

interface HomeVideoSectionProps {
  videos?: MediaItem[];
}

export function HomeVideoSection({ videos = [] }: HomeVideoSectionProps) {
  const validVideos = [...videos.filter((v) => v.type === "video")].sort(
    (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
  );

  // Maximum 4 videos in the showcase reel
  const displayVideos = validVideos.slice(0, 4);

  // Spotlight active index (which video is featured on the grand screen)
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Lightbox Modal state
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
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

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    return (
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.includes("/images/videos/") ||
      url.startsWith("blob:")
    );
  };

  const activeVideo =
    fullscreenIndex !== null ? displayVideos[fullscreenIndex] : null;
  const activeEmbedUrl = activeVideo ? getEmbedUrl(activeVideo.url) : null;

  const spotlightVideo =
    displayVideos.length > 0
      ? displayVideos[Math.min(activeSpotlightIndex, displayVideos.length - 1)]
      : null;

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

  // Preview video playback on hover
  const handleSpotlightMouseEnter = () => {
    setIsHovered(true);
    if (previewVideoRef.current) {
      previewVideoRef.current.play().catch(() => {});
    }
  };

  const handleSpotlightMouseLeave = () => {
    setIsHovered(false);
    if (previewVideoRef.current) {
      previewVideoRef.current.pause();
      previewVideoRef.current.currentTime = 0;
    }
  };

  if (displayVideos.length === 0 || !spotlightVideo) {
    return null;
  }

  const spotlightThumb =
    spotlightVideo.thumbnailUrl || "/images/styles/contemporary.jpg";
  const hasDirectVideoPreview = isDirectVideo(spotlightVideo.url);

  // Modal JSX rendered via portal to document.body
  const modalContent =
    fullscreenIndex !== null && activeVideo && mounted ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Fullscreen video player"
        className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-8 animate-fade-in"
        onClick={handleClose}
      >
        {/* Close Button at Top-Right */}
        <button
          onClick={handleClose}
          aria-label="Close video"
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100010] inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-neutral-900/90 hover:bg-dk-yellow hover:text-black text-white border border-white/20 hover:border-dk-yellow text-xs sm:text-sm font-heading font-medium uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-95 shadow-xl"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
          <span>Exit Theatre</span>
        </button>

        {/* Top Header Information Bar */}
        <div
          className="w-full max-w-5xl flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-white/[0.1] pr-32 sm:pr-40"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 truncate">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dk-yellow/15 border border-dk-yellow/30 text-[10px] font-mono text-dk-yellow uppercase tracking-widest shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              {activeVideo.category || "Performance"}
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <h4 className="text-xs sm:text-base font-heading font-light uppercase tracking-wide text-white truncate">
              {activeVideo.title}
            </h4>
          </div>
        </div>

        {/* Left Navigation Arrow */}
        {displayVideos.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous video"
            className="fixed left-3 sm:left-8 top-1/2 -translate-y-1/2 z-[100005] w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-2xl"
          >
            <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Right Navigation Arrow */}
        {displayVideos.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next video"
            className="fixed right-3 sm:right-8 top-1/2 -translate-y-1/2 z-[100005] w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 shadow-2xl"
          >
            <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Video Player Box with Ambient Glow */}
        <div
          className="relative w-full max-w-5xl aspect-video bg-black rounded-xl sm:rounded-2xl border border-white/15 flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.95)]"
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
          className="mt-3.5 flex items-center justify-between w-full max-w-5xl text-xs font-mono text-neutral-400 px-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">
              0{fullscreenIndex + 1}
            </span>
            <span>/</span>
            <span>0{displayVideos.length}</span>
            <span className="text-neutral-600 hidden sm:inline ml-2">•</span>
            <span className="text-neutral-500 hidden sm:inline">DK Dance Company Cinema Mode</span>
          </div>

          <button
            onClick={handleClose}
            className="hover:text-dk-yellow transition-colors underline underline-offset-4 cursor-pointer text-[11px]"
          >
            Press ESC or tap background to exit
          </button>
        </div>
      </div>
    ) : null;

  return (
    <section className="relative bg-neutral-950 text-white py-20 sm:py-32 overflow-hidden selection:bg-dk-yellow selection:text-black">
      {/* Ambient Radial Glow in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,241,2,0.08),transparent_70%)] pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div>
            <FadeUp>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-light uppercase tracking-tight text-white leading-[1.05]">
                Energy In Rhythm. <br />
                <span className="text-neutral-500 font-extralight">
                  Choreography In Motion.
                </span>
              </h2>
            </FadeUp>
          </div>

          <FadeUp delay={0.15}>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/[0.03] border border-white/[0.12] hover:border-dk-yellow/60 hover:bg-dk-yellow hover:text-black text-neutral-300 font-mono text-xs uppercase tracking-widest transition-all duration-300 w-fit group active:scale-95 shadow-sm"
            >
              <span>Explore All Videos</span>
              <span className="text-[10px] opacity-70 group-hover:text-black">
                ({validVideos.length})
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-dk-yellow transition-transform duration-300 group-hover:text-black group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        </div>

        {/* ============================================================== */}
        {/* GRAND CINEMA SPOTLIGHT THEATRE (Full 16:9 Cinema Showcase)      */}
        {/* ============================================================== */}
        <FadeUp delay={0.2}>
          <div className="relative max-w-5xl mx-auto">
            {/* Ambient Backlight Aura matching stage lights */}
            <div className="absolute -inset-3 sm:-inset-6 bg-gradient-to-r from-dk-yellow/20 via-amber-500/15 to-dk-yellow/15 rounded-[2.5rem] blur-2xl sm:blur-3xl opacity-40 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none -z-10" />

            {/* Main Interactive Cinema Screen */}
            <div
              onClick={() => handleOpen(activeSpotlightIndex)}
              onMouseEnter={handleSpotlightMouseEnter}
              onMouseLeave={handleSpotlightMouseLeave}
              className="group relative aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-white/[0.12] hover:border-dk-yellow/60 cursor-pointer shadow-[0_20px_70px_rgba(0,0,0,0.9)] transition-all duration-500 hover:shadow-[0_25px_80px_rgba(255,241,2,0.18)]"
            >
              {/* Poster Image */}
              <Image
                src={spotlightThumb}
                alt={spotlightVideo.title || "DKDC Choreography"}
                fill
                priority
                className={`object-cover transition-transform duration-1000 ease-out ${
                  isHovered && hasDirectVideoPreview
                    ? "opacity-0 scale-105"
                    : "opacity-100 group-hover:scale-105"
                }`}
                sizes="(max-width: 1024px) 100vw, 1200px"
              />

              {/* Silent Motion Video Preview on Hover (for direct MP4 files) */}
              {hasDirectVideoPreview && (
                <video
                  ref={previewVideoRef}
                  src={spotlightVideo.url}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
                    isHovered ? "opacity-100 scale-105" : "opacity-0"
                  }`}
                />
              )}

              {/* Cinema Vignette & Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none transition-colors duration-500 group-hover:from-black/90" />

              {/* Center Magnetic Play Magnet (The Irresistible Trigger) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 p-4">
                <div className="relative flex items-center justify-center">
                  {/* Outer Breathing Rings */}
                  <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-dk-yellow/30 animate-ping opacity-30 duration-1000" />
                  <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-dk-yellow/50 animate-pulse duration-700" />

                  {/* Main Glass Play Disc */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/65 sm:bg-white/10 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center group-hover:bg-dk-yellow group-hover:text-black group-hover:border-dk-yellow group-hover:scale-110 shadow-[0_0_50px_rgba(255,241,2,0.45)] transition-all duration-300">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>

              {/* Bottom Information - Main Content Title Only */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between pointer-events-none z-10">
                <div className="max-w-2xl">
                  <h3 className="text-xl sm:text-3xl md:text-4xl font-heading font-light uppercase tracking-wide text-white group-hover:text-dk-yellow transition-colors leading-tight line-clamp-1">
                    {spotlightVideo.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ============================================================== */}
        {/* MULTI-VIDEO SHOWCASE REEL STRIP (When 2, 3 or 4 videos exist)   */}
        {/* ============================================================== */}
        {displayVideos.length > 1 && (
          <FadeUp delay={0.3}>
            <div className="mt-8 sm:mt-10 max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                  <Film className="w-3.5 h-3.5 text-dk-yellow" />
                  <span>SELECT PRODUCTION ({displayVideos.length})</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  Tap to switch or play
                </span>
              </div>

              {/* Grid of widescreen companion cards */}
              <div
                className={`grid gap-4 ${
                  displayVideos.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : displayVideos.length === 3
                    ? "grid-cols-1 sm:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
                }`}
              >
                {displayVideos.map((video, idx) => {
                  const isActive = idx === activeSpotlightIndex;
                  const thumb =
                    video.thumbnailUrl || "/images/styles/contemporary.jpg";

                  return (
                    <div
                      key={video._id || `vid_reel_${idx}`}
                      onClick={() => {
                        setActiveSpotlightIndex(idx);
                        // If already active, direct click opens modal
                        if (isActive) {
                          handleOpen(idx);
                        }
                      }}
                      className={`group/card relative rounded-xl overflow-hidden p-2.5 transition-all duration-300 cursor-pointer border ${
                        isActive
                          ? "bg-white/[0.06] border-dk-yellow/80 shadow-[0_0_25px_rgba(255,241,2,0.15)]"
                          : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Compact 16:9 Thumbnail Box */}
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-neutral-900 border border-white/10">
                        <Image
                          src={thumb}
                          alt={video.title || "Video"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                          sizes="(max-width: 640px) 100vw, 300px"
                        />
                        <div className="absolute inset-0 bg-black/35 group-hover/card:bg-black/15 transition-colors duration-300" />

                        {/* Index Badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/15 text-[10px] font-mono text-white">
                          0{idx + 1}
                        </div>

                        {/* Active Indicator or Play Trigger */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isActive ? (
                            <div className="w-8 h-8 rounded-full bg-dk-yellow text-black flex items-center justify-center shadow-lg animate-pulse">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-200">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          )}
                        </div>

                        {/* Duration Pill */}
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-neutral-300">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      {/* Info below thumbnail */}
                      <div className="pt-2.5 px-0.5">
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono uppercase tracking-wider text-dk-yellow mb-0.5">
                          <span className="truncate">
                            {video.category || "Showcase"}
                          </span>
                          {isActive && (
                            <span className="text-[9px] font-medium text-black bg-dk-yellow px-1.5 py-0.2 rounded-full shrink-0">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <h4
                          className={`text-xs font-heading font-light uppercase tracking-wide truncate ${
                            isActive
                              ? "text-white font-normal"
                              : "text-neutral-300 group-hover/card:text-white"
                          }`}
                        >
                          {video.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeUp>
        )}
      </div>

      {/* Render Fullscreen Lightbox Modal via Portal directly to body */}
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </section>
  );
}
