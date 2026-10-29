"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { FadeUp, RevealImage } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";

interface OnlineClassesSectionProps {
  onlineData?: {
    headline: string;
    description: string;
    features: string[];
  };
}

export function OnlineClassesSection({ onlineData }: OnlineClassesSectionProps) {
  const data = onlineData || {
    headline: "Learn dance from anywhere in the world",
    description:
      "DK Dance Company’s online training programs bring our signature Kozhikode curriculum directly to students across the globe. Through structured digital modules and personalized feedback, dancers build solid technique and expressive confidence.",
    features: [
      "Foundational & Advanced Dance Movements",
      "Rhythm, Timing & Musicality Drills",
      "Kinetic Body Coordination & Flexibility",
      "Performance Conditioning & Stage Skills",
    ],
  };

  return (
    <section className="bg-black text-white py-28 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="lg:col-span-7">
            <FadeUp>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-4 transition-transform duration-300 hover:scale-105">
                <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
                <span className="editorial-eyebrow text-neutral-400">
                  07 — GLOBAL DIGITAL STUDIO
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-heading font-light uppercase tracking-tight text-white mb-6">
                Online Classes
              </h2>
              <p className="text-xl text-neutral-300 font-heading font-light leading-snug mb-4">
                {data.headline}
              </p>
              <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed mb-8">
                {data.description}
              </p>
            </FadeUp>

            {/* Core Benefits */}
            <FadeUp delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {data.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02] hover:border-dk-yellow/40 hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-dk-yellow/15 text-dk-yellow flex items-center justify-center shrink-0 mt-0.5 border border-dk-yellow/30">
                      <Check className="w-3.5 h-3.5 text-dk-yellow" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wide text-neutral-300 font-light">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </FadeUp>

            {/* CTA */}
            <FadeUp delay={0.25}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Button href="/contact?mode=online" variant="accent" size="lg" icon>
                  Enquire For Online Classes
                </Button>
                <span className="text-xs font-mono text-neutral-500 uppercase px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.05]">
                  Available Worldwide • Flexible Timings
                </span>
              </div>
            </FadeUp>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 relative aspect-[4/5] bg-neutral-950 overflow-hidden rounded-3xl border border-white/[0.08]">
            <RevealImage className="w-full h-full relative">
              <Image
                src="/images/styles/lyrical.jpg"
                alt="Student training online with DK Dance Company"
                fill
                className="object-cover object-center transition-all duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-dk-yellow block mb-1">
                  Global Reach
                </span>
                <span className="text-base font-heading font-light uppercase text-white">
                  Live Interactive Digital Masterclasses
                </span>
              </div>
            </RevealImage>
          </div>
        </div>
      </div>
    </section>
  );
}
