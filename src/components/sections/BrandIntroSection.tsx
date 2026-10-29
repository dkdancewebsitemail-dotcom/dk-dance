"use client";

import React from "react";
import Image from "next/image";
import { FadeUp } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { SiteSettings } from "@/types";
import { ExpandableText } from "@/components/ui/ExpandableText";

interface BrandIntroSectionProps {
  settings?: SiteSettings;
}

export function BrandIntroSection({ settings }: BrandIntroSectionProps) {
  const introText =
    settings?.intro ||
    "A professional dance training institution dedicated to developing skills, creativity, confidence, and stage performance.";

  const missionText =
    settings?.mission ||
    "To inspire, train, and empower every dancer through quality dance education and professional technical guidance.";

  const visionText =
    settings?.vision ||
    "To build confident performers and create opportunities for dancers to learn, grow, and shine on state, national, and international stages.";

  return (
    <section className="bg-black text-white py-28 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <FadeUp>
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 transition-transform duration-300 hover:scale-105">
            <span className="w-1.5 h-1.5 rounded-full bg-dk-red animate-pulse" />
            <span className="editorial-eyebrow text-neutral-400">
              01 — INSTITUTION PHILOSOPHY
            </span>
          </div>
        </FadeUp>

        {/* Large Statement Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          <div className="lg:col-span-10">
            <FadeUp delay={0.1}>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[1.2] text-white break-words [overflow-wrap:anywhere]">
                {introText}
              </h2>
            </FadeUp>
          </div>
        </div>

        {/* Balanced Editorial Composition: Compact Executive Founder Profile & Mission/Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Refined Compact Founder Profile Card */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <FadeUp delay={0.1}>
              <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] relative overflow-hidden group hover:border-dk-yellow/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300 w-full max-w-md">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                  {/* Compact, elegant portrait with luxury border */}
                  <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-neutral-900 group-hover:border-dk-yellow/50 transition-colors duration-300">
                    <Image
                      src="/images/dhanesh-krishnan.png"
                      alt="Dhanesh Krishnan K - Founder & Director"
                      fill
                      priority
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="128px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-dk-yellow/10 border border-dk-yellow/20 text-dk-yellow text-[10px] font-mono uppercase tracking-wider mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow" />
                      Founder & Director
                    </div>
                    <h3 className="text-xl sm:text-2xl font-heading font-light uppercase tracking-tight text-white mb-1 group-hover:text-neutral-100 transition-colors">
                      Dhanesh Krishnan K
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mb-3">
                      Artistic Director & Choreographer
                    </p>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed italic">
                      &ldquo;Dance is discipline, emotional expression, and the confidence to own every stage in life.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>DKDC Kozhikode & UK</span>
                  <Button href="/about" variant="ghost" size="sm" icon className="text-xs py-1 px-3 group-hover:text-dk-yellow transition-colors">
                    Profile
                  </Button>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Mission & Vision & Training Core */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <FadeUp delay={0.15}>
              <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02] relative overflow-hidden group hover:border-dk-yellow/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300 min-w-0 max-w-full">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-dk-yellow to-transparent" />
                <span className="editorial-eyebrow text-dk-yellow block mb-2">
                  Our Mission
                </span>
                <ExpandableText
                  text={missionText}
                  limit={180}
                  className="text-base sm:text-lg font-heading text-neutral-200 font-light leading-snug break-words [overflow-wrap:anywhere]"
                />
              </div>
            </FadeUp>

            <FadeUp delay={0.25}>
              <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02] relative overflow-hidden group hover:border-dk-red/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300 min-w-0 max-w-full">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-dk-red to-transparent" />
                <span className="editorial-eyebrow text-dk-red block mb-2">
                  Our Vision
                </span>
                <ExpandableText
                  text={visionText}
                  limit={180}
                  className="text-base sm:text-lg font-heading text-neutral-200 font-light leading-snug break-words [overflow-wrap:anywhere]"
                />
              </div>
            </FadeUp>

            
            <FadeUp delay={0.35}>
              <div className="pt-4 border-t border-white/[0.08]">
                <span className="text-xs uppercase tracking-widest font-mono text-neutral-500 block mb-3">
                  Curriculum Focus Areas
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Technique",
                    "Rhythm",
                    "Body Movement",
                    "Flexibility",
                    "Coordination",
                    "Creativity",
                    "Performance Skills",
                  ].map((pillar) => (
                    <span
                      key={pillar}
                      className="text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/[0.03] text-neutral-300 border border-white/[0.08] hover:border-dk-yellow/40 hover:bg-white/[0.08] hover:text-white hover:scale-105 transition-all duration-200 backdrop-blur-sm cursor-default"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
