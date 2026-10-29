"use client";

import React from "react";
import { FadeUp } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function EnquiryCTASection() {
  return (
    <section className="bg-black text-white py-20 sm:py-36 relative overflow-hidden">
      {/* Background Subtle Accent Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-dk-yellow/10 via-dk-red/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8">
        <div className="p-6 sm:p-14 md:p-20 rounded-3xl glass-panel border border-white/[0.08] hover:border-dk-yellow/30 bg-white/[0.02] text-center relative overflow-hidden transition-all duration-500">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-dk-yellow/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-dk-red/10 rounded-full blur-3xl pointer-events-none" />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6 sm:mb-8 transition-transform duration-300 hover:scale-105">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-dk-yellow tracking-widest text-[10px] sm:text-xs">
                BEGIN YOUR MOVEMENT JOURNEY
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extralight uppercase tracking-tight text-white leading-[1.05] sm:leading-[1.0] mb-6 sm:mb-8">
              Step onto the stage. <br className="hidden sm:inline" />
              Train with DK Dance Company.
            </h2>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="text-neutral-400 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-12">
              Admissions are open for our Kozhikode studio branches and
              international programs. Begin with structured training under Director
              Dhanesh Krishnan.
            </p>
          </FadeUp>

          <FadeUp delay={0.35}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 max-w-sm sm:max-w-none mx-auto">
              <Button href="/contact" variant="primary" size="lg" icon className="w-full sm:w-auto">
                Enquire For Admission
              </Button>
              <WhatsAppButton variant="button" className="w-full sm:w-auto justify-center">
                WhatsApp Our Desk
              </WhatsAppButton>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
