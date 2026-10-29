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
  Sparkles,
  ArrowRight,
  MessageCircle,
  Clock,
  Layers,
} from "lucide-react";
import { MediaItem } from "@/types";
import { FadeUp } from "@/components/ui/Motion";

interface VideosPageContentProps {
  videos: MediaItem[];
  whatsappPhone?: string;
}

export function VideosPageContent({
  videos = [],
  whatsappPhone = "919995272083",
}: VideosPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter only valid videos and sort by displayOrder
  const allVideos = [...videos.filter((v) => v.type === "video")].sort(
    (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
  );

  // Extract unique categories dynamically
  const uniqueCategories = Array.from(
    new Set(allVideos.map((v) => v.category).filter(Boolean))
  ) as string[];

  const categories = ["All", ...uniqueCategories];

  // Filtered list based on active category
  const filteredVideos = allVideos.filter((v) => {
    if (selectedCategory === "All") return true;
    return v.category === selectedCategory;
  });

  // Embed URL helper (YouTube, Vimeo)
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
    fullscreenIndex !== null ? filteredVideos[fullscreenIndex] : null;
  const activeEmbedUrl = activeVideo ? getEmbedUrl(activeVideo.url) : null;

  const handleOpen = (idx: number) => {
    setFullscreenIndex(idx);
  };

  const handleClose = useCallback(() => {
    setFullscreenIndex(null);
  }, []);

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (fullscreenIndex === null || filteredVideos.length === 0) return;
      setFullscreenIndex((prev) =>
        prev !== null ? (prev + 1) % filteredVideos.length : 0
      );
    },
    [fullscreenIndex, filteredVideos.length]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (fullscreenIndex === null || filteredVideos.length === 0) return;
      setFullscreenIndex((prev) =>
        prev !== null
          ? (prev - 1 + filteredVideos.length) % filteredVideos.length
          : 0
      );
    },
    [fullscreenIndex, filteredVideos.length]
  );

  // Keyboard navigation & body scroll lock
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

  const cleanWhatsapp = (whatsappPhone || "").replace(/\D/g, "") || "919995272083";

  // Lightbox Modal JSX
  const modalContent =
    fullscreenIndex !== null && activeVideo && mounted
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen video player"
            className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200"
            onClick={handleClose}
          >
            {/* Close Button Top Right */}
            <button
              onClick={handleClose}
              aria-label="Close video player"
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100010] inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-neutral-900/90 hover:bg-dk-yellow hover:text-black text-white border border-white/20 hover:border-dk-yellow text-xs sm:text-sm font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-2xl active:scale-95"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span className="font-semibold">Close</span>
            </button>

            {/* Video Meta Info Bar */}
            <div
              className="w-full max-w-5xl flex items-center justify-between pb-3.5 mb-3 border-b border-white/[0.12] pr-28 sm:pr-32"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 truncate">
                <span className="text-[11px] font-mono text-dk-yellow uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-dk-yellow/10 border border-dk-yellow/30 shrink-0">
                  {activeVideo.category || "Showcase"}
                </span>
                <span className="text-neutral-500">•</span>
                <h4 className="text-sm sm:text-base font-heading font-light uppercase tracking-wide text-white truncate">
                  {activeVideo.title}
                </h4>
              </div>
              <div className="hidden sm:block text-xs font-mono text-neutral-400 shrink-0">
                {fullscreenIndex + 1} / {filteredVideos.length}
              </div>
            </div>

            {/* Previous Video Button */}
            {filteredVideos.length > 1 && (
              <button
                onClick={handlePrev}
                aria-label="Previous video"
                className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[100005] w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl active:scale-95"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}

            {/* Next Video Button */}
            {filteredVideos.length > 1 && (
              <button
                onClick={handleNext}
                aria-label="Next video"
                className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[100005] w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-200 hover:text-black hover:bg-dk-yellow hover:border-dk-yellow flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl active:scale-95"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}

            {/* Video Player Box */}
            <div
              className="relative w-full max-w-5xl aspect-video bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex items-center justify-center"
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
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </div>

            {/* Bottom Info Bar */}
            <div
              className="mt-3.5 flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl gap-2 text-xs font-mono text-neutral-400"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span>
                  Video {fullscreenIndex + 1} of {filteredVideos.length}
                </span>
                {activeVideo.duration && (
                  <span className="text-neutral-500">
                    Duration: {activeVideo.duration}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="hover:text-dk-yellow transition-colors underline underline-offset-4 cursor-pointer"
              >
                Click backdrop or press ESC to exit
              </button>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {modalContent}

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-12 sm:mb-16">
        <FadeUp>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
            <Film className="w-3.5 h-3.5 text-dk-yellow" />
            <span className="editorial-eyebrow text-neutral-300 font-medium tracking-widest text-[11px]">
              DKDC CINEMATIC ARCHIVE // VIDEO SHOWCASE
            </span>
          </div>

          <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-5xl mb-6">
            Choreography <br />
            <span className="text-neutral-400">& Motion</span>
          </h1>

          <p className="text-lg sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed mb-8">
            Step into the visual world of DK Dance Company. Stage productions,
            explosive urban routines, contemporary flows, and intensive studio
            reels directed by Dhanesh Krishnan.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2 border-t border-white/[0.08] text-xs font-mono uppercase tracking-wider text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-dk-yellow animate-pulse" />
              <span className="text-white font-medium">
                {allVideos.length} Videos Available
              </span>
            </div>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-dk-yellow" />
              <span>Full HD & 4K Quality</span>
            </div>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-dk-yellow" />
              <span>Kozhikode & Bournemouth UK</span>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Interactive Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 sm:mb-14">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none no-scrollbar overscroll-x-contain">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All"
                ? allVideos.length
                : allVideos.filter((v) => v.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setFullscreenIndex(null);
                }}
                className={`whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer active:scale-95 flex items-center gap-2 ${
                  isSelected
                    ? "bg-dk-yellow text-black font-semibold shadow-[0_0_20px_rgba(255,200,0,0.3)]"
                    : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.08] backdrop-blur-sm"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-black/20 text-black font-bold"
                      : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Videos Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-20 sm:mb-28">
        {filteredVideos.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 glass-panel max-w-xl mx-auto">
            <Film className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest mb-2">
              No videos in this category
            </p>
            <p className="text-sm text-neutral-500 font-light mb-6">
              Try selecting another category or view all videos in the archive.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-dk-yellow hover:text-black text-white font-mono text-xs uppercase tracking-widest transition-all"
            >
              Reset to All Videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredVideos.map((video, idx) => {
              const thumb =
                video.thumbnailUrl || "/images/styles/contemporary.jpg";

              return (
                <div
                  key={video._id || `vid_${idx}`}
                  onClick={() => handleOpen(idx)}
                  className="group cursor-pointer flex flex-col bg-neutral-950/70 border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-dk-yellow/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(0,0,0,0.85)]"
                >
                  {/* Aspect Video Container */}
                  <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                    <Image
                      src={thumb}
                      alt={video.title || "DK Dance Video"}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Gradient & Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent group-hover:from-black/75 transition-colors duration-300" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-dk-yellow px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                        {video.category || "Showcase"}
                      </span>

                      {video.duration && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-300 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                          <Clock className="w-2.5 h-2.5 text-neutral-400" />
                          <span>{video.duration}</span>
                        </span>
                      )}
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/75 border border-white/25 flex items-center justify-center text-white group-hover:bg-dk-yellow group-hover:text-black group-hover:scale-110 group-hover:border-dk-yellow transition-all duration-300 shadow-2xl">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Video Meta Info Card Bottom */}
                  <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-heading font-light uppercase tracking-wide text-white group-hover:text-dk-yellow transition-colors line-clamp-2 leading-snug">
                        {video.title}
                      </h3>

                      {video.description && (
                        <p className="text-xs sm:text-sm text-neutral-400 font-light mt-2 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-neutral-400">
                      <span className="text-dk-yellow uppercase tracking-wider inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Play Video</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA / Performance Enquiry Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <FadeUp>
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-gradient-to-br from-neutral-900/90 via-black to-neutral-950 p-8 sm:p-14 glass-panel">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-dk-yellow/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dk-yellow/10 border border-dk-yellow/30 text-dk-yellow text-xs font-mono uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CHOREOGRAPHY & STAGE BOOKINGS</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-heading font-light uppercase tracking-tight text-white mb-4">
                Bring High-Impact Choreography to Your Stage
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed mb-8">
                Looking for bespoke stage routines, competition choreography, or
                corporate event performances? Connect directly with Director
                Dhanesh Krishnan and the DKDC creative team.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full bg-dk-yellow hover:bg-yellow-400 text-black font-heading font-medium text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,200,0,0.3)]"
                >
                  Book Performance
                </Link>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    "Hello DK Dance Company, I watched your video archive and would like to enquire about choreography / performances."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-dk-yellow/40 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  );
}
