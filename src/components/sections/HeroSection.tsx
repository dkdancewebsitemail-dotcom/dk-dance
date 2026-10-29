"use client";

import React from "react";
import { FadeUp } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";

interface HeroSectionProps {
  videoUrl?: string;
}

export function HeroSection({ videoUrl }: HeroSectionProps) {
  const activeVideo = videoUrl || "/images/videos/8688823-hd_1080_1920_25fps.mp4";

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-white text-neutral-950 pt-28 sm:pt-32 pb-16 sm:pb-20">
      
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          key={activeVideo}
          src={activeVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[center_35%] sm:object-center scale-[1.02] transition-transform duration-1000"
          aria-hidden="true"
        />

        
        <div className="absolute inset-0 bg-white/25" />

        {/* Left-side gentle contrast feathering so text is 100% readable while dancer remains fully visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 via-45% to-transparent" />

        {/* Soft, airy ambient mist blooms */}
        <div className="absolute top-1/4 -left-10 w-[450px] h-[450px] rounded-full bg-white/30 blur-[90px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[300px] rounded-full bg-white/25 blur-[100px]" />

        {/* Top subtle vignette for transparent navbar */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 via-white/15 to-transparent" />

        {/* Bottom seamless fade into black BrandIntro section */}
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-black via-black/80 via-40% to-transparent z-[2]" />
      </div>

      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full my-auto">
        <div className="max-w-2xl lg:max-w-3xl text-left">
          {/* Eyebrow Status Badge */}
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 border border-black/10 backdrop-blur-md mb-6 shadow-sm transition-transform duration-300 hover:scale-105">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dk-yellow opacity-85" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-dk-yellow" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-800 font-medium">
                00 — THE ART OF MOVEMENT
              </span>
            </div>
          </FadeUp>

          {/* Monumental Ultra-Clean High-Fashion Typography */}
          <FadeUp delay={0.2} duration={0.8}>
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading font-thin tracking-tight leading-[0.92] uppercase mb-6 select-none text-neutral-950">
              <span className="block font-thin tracking-tight text-neutral-950">
                MOVEMENT.
              </span>
              <span className="block font-light tracking-tight text-neutral-800">
                DISCIPLINE.
              </span>
              <span className="block font-normal tracking-tight text-neutral-950">
                ARTISTRY<span className="text-dk-yellow drop-shadow-[0_2px_8px_rgba(255,241,2,0.6)]">.</span>
              </span>
            </h1>
          </FadeUp>

          {/* Tagline & Supporting Copy */}
          <FadeUp delay={0.35}>
            <p className="text-base sm:text-xl font-light tracking-wide text-neutral-900 font-heading mb-3 max-w-xl">
              Learn • Train • Perform • Elevate
            </p>
            <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-700 max-w-md sm:max-w-lg mb-8">
              India&apos;s premier contemporary and commercial dance academy directed by
              Dhanesh Krishnan. Fostering technical excellence, rhythmic intuition,
              and world-class stage confidence from foundational movement to international platforms.
            </p>
          </FadeUp>

          {/* Minimalist Luxury CTA Group with Micro-interactions (No Heavy Shadows) */}
          <FadeUp delay={0.45}>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-start w-full">
              <Button
                href="/dance-styles"
                variant="accent"
                size="md"
                className="!bg-dk-yellow !text-neutral-950 font-medium border border-dk-yellow/50 hover:!bg-[#fff433] hover:border-black/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                icon
              >
                Explore Styles
              </Button>
              <Button
                href="/contact"
                variant="primary"
                size="md"
                className="!bg-neutral-950 !text-white hover:!bg-neutral-800 border border-black/20 hover:border-black/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Join DKDC
              </Button>
              <Button
                href="/branches"
                variant="secondary"
                size="md"
                className="!bg-white/80 !text-neutral-900 !border-black/15 hover:!border-black/40 hover:!bg-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                View Studios
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
