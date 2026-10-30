"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import clsx from "clsx";

import { StatItem } from "@/types";
import { INITIAL_SITE_SETTINGS } from "@/lib/constants";

const STATS_DATA: StatItem[] = INITIAL_SITE_SETTINGS.stats || [
  {
    target: 5000,
    suffix: "+",
    label: "Students Trained",
  },
  {
    target: 10,
    suffix: "+",
    label: "Master Instructors",
  },
  {
    target: 6,
    suffix: "",
    label: "Studio Spaces",
  },
  {
    target: 2,
    suffix: "",
    label: "Countries (India & UK)",
  },
  {
    target: 100,
    suffix: "+",
    label: "Stage Productions",
  },
  {
    target: 12,
    suffix: "+",
    label: "Years of Legacy",
  },
];

function AnimatedCounter({
  target,
  suffix = "",
  shouldStart = false,
}: {
  target: number;
  suffix?: string;
  shouldStart: boolean;
}) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number | null = null;
    const duration = 2000;

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentVal = Math.floor(1 + (target - 1) * easedProgress);
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [shouldStart, target]);

  return (
    <span className="inline-flex items-baseline justify-center">
      <span>{count.toLocaleString()}</span>
      {suffix && (
        <span className="text-amber-500 font-light ml-0.5 sm:ml-1 text-2xl sm:text-4xl lg:text-6xl transition-colors duration-300 group-hover:text-amber-600">
          {suffix}
        </span>
      )}
    </span>
  );
}

export function StatsCounterSection({ stats }: { stats?: StatItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    margin: "-10% 0px -10% 0px",
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  const displayStats =
    stats && Array.isArray(stats) && stats.length === 6 ? stats : STATS_DATA;

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <motion.section
      ref={sectionRef}
      animate={{
        backgroundColor: isInView ? "#ffffff" : "#000000",
      }}
      transition={{
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden select-none"
    >
      {/* Top fade from black */}
      <div
        className={clsx(
          "absolute top-0 left-0 right-0 h-16 sm:h-24 pointer-events-none z-10 transition-opacity duration-700",
          isInView ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle glow */}
      <div
        className={clsx(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/[0.04] blur-[150px] pointer-events-none rounded-full transition-opacity duration-700",
          isInView ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-20">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16 lg:mb-20">
          <FadeUp>
            <div
              className={clsx(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm mb-4 transition-all duration-700 hover:scale-105",
                isInView
                  ? "bg-neutral-100 border-neutral-300/80 text-neutral-600"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-dk-red animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] font-medium">
                MILESTONES & IMPACT
              </span>
            </div>
            <h2
              className={clsx(
                "text-2xl sm:text-4xl lg:text-5xl font-heading font-thin uppercase tracking-tight transition-colors duration-700",
                isInView ? "text-neutral-950" : "text-white"
              )}
            >
              DKDC By The Numbers
            </h2>
          </FadeUp>
        </div>

        {/* 6 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 sm:gap-y-10 gap-x-4 sm:gap-x-8">
          {displayStats.map((item, idx) => {
            return (
              <div
                key={`${item.label}-${idx}`}
                className="flex flex-col items-center justify-center py-6 sm:py-10 lg:py-12 px-3 sm:px-6 rounded-2xl transition-all duration-300 group min-w-0 max-w-full overflow-hidden hover:-translate-y-1.5 cursor-default text-center"
              >
                <FadeUp
                  delay={idx * 0.05}
                  className="w-full flex flex-col items-center justify-center text-center"
                >
                  <div
                    className={clsx(
                      "relative flex flex-col items-center justify-center text-center text-2xl sm:text-5xl lg:text-7xl font-heading font-thin tracking-tight group-hover:scale-105 transition-all duration-700 max-w-full",
                      isInView ? "text-neutral-950" : "text-white"
                    )}
                  >
                    <AnimatedCounter
                      target={item.target}
                      suffix={item.suffix}
                      shouldStart={hasAnimated || isInView}
                    />
                    <div className="mx-auto mt-2 h-[2px] w-0 bg-gradient-to-r from-dk-yellow via-amber-400 to-dk-red rounded-full group-hover:w-10 sm:group-hover:w-14 transition-all duration-300 ease-out" />
                  </div>

                  <div
                    className={clsx(
                      "mt-2 sm:mt-3 lg:mt-4 text-[10px] sm:text-xs lg:text-sm font-mono uppercase tracking-[0.12em] sm:tracking-[0.2em] lg:tracking-[0.25em] font-light transition-colors duration-700 max-w-full break-words [overflow-wrap:anywhere] px-1 text-center",
                      isInView
                        ? "text-neutral-600 group-hover:text-neutral-950"
                        : "text-neutral-400 group-hover:text-white"
                    )}
                  >
                    {item.label}
                  </div>
                </FadeUp>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom fade to black */}
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 h-16 sm:h-24 pointer-events-none z-10 transition-opacity duration-700",
          isInView ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.6) 30%, rgba(10,10,10,0) 100%)",
        }}
        aria-hidden="true"
      />
    </motion.section>
  );
}
