"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { StatItem } from "@/types";
import { INITIAL_SITE_SETTINGS } from "@/lib/constants";
import { resolveColor } from "@/lib/resolve-colors";

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

  // Scroll-driven scrub interpolation linked directly to scroll position
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background color:
  // Starts Black (#000000) from About section -> scrubs to White (#ffffff) -> scrubs back to Black (#000000)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.75, 0.95],
    ["#000000", "#ffffff", "#ffffff", "#000000"]
  );

  // Text color:
  // Starts White (#ffffff) -> scrubs to Dark (#0a0a0a) -> scrubs back to White (#ffffff)
  const textColor = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.75, 0.95],
    ["#ffffff", "#0a0a0a", "#0a0a0a", "#ffffff"]
  );

  // Subtext / label color:
  const subtextColor = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.75, 0.95],
    ["#a3a3a3", "#525252", "#525252", "#a3a3a3"]
  );

  // Milestone badge style transforms
  const badgeBg = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.75, 0.95],
    [
      "rgba(23, 23, 23, 0.8)",
      "rgba(245, 245, 245, 0.9)",
      "rgba(245, 245, 245, 0.9)",
      "rgba(23, 23, 23, 0.8)",
    ]
  );
  const badgeBorder = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.75, 0.95],
    [
      "rgba(38, 38, 38, 0.8)",
      "rgba(212, 212, 212, 0.8)",
      "rgba(212, 212, 212, 0.8)",
      "rgba(38, 38, 38, 0.8)",
    ]
  );
  const badgeText = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.75, 0.95],
    ["#a3a3a3", "#525252", "#525252", "#a3a3a3"]
  );

  const isInView = useInView(sectionRef, {
    margin: "-15% 0px -15% 0px",
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
      id="theme-switch-trigger"
      ref={sectionRef}
      style={{ backgroundColor }}
      className="relative py-20 sm:py-28 lg:py-36 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-20">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16 lg:mb-20">
          <FadeUp>
            <motion.div
              style={{
                backgroundColor: badgeBg,
                borderColor: badgeBorder,
                color: badgeText,
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm mb-4 transition-transform duration-300 hover:scale-105"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-dk-red animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] font-medium">
                MILESTONES & IMPACT
              </span>
            </motion.div>
            <motion.h2
              style={{ color: textColor }}
              className="text-2xl sm:text-4xl lg:text-5xl font-heading font-thin uppercase tracking-tight"
            >
              DKDC By The Numbers
            </motion.h2>
          </FadeUp>
        </div>

        {/* 6 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 sm:gap-y-10 gap-x-4 sm:gap-x-8">
          {displayStats.map((item, idx) => {
            return (
              <div
                key={`${item.label}-${idx}`}
                className="flex flex-col items-center justify-center py-6 sm:py-10 lg:py-12 px-3 sm:px-6 rounded-2xl transition-transform duration-300 group min-w-0 max-w-full overflow-hidden hover:-translate-y-1.5 cursor-default text-center"
              >
                <FadeUp
                  delay={idx * 0.05}
                  className="w-full flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    style={{ color: textColor }}
                    className="relative flex flex-col items-center justify-center text-center text-2xl sm:text-5xl lg:text-7xl font-heading font-thin tracking-tight group-hover:scale-105 transition-transform duration-300 max-w-full"
                  >
                    <AnimatedCounter
                      target={item.target}
                      suffix={item.suffix}
                      shouldStart={hasAnimated || isInView}
                    />
                    <div className="mx-auto mt-2 h-[2px] w-0 bg-gradient-to-r from-dk-yellow via-amber-400 to-dk-red rounded-full group-hover:w-10 sm:group-hover:w-14 transition-all duration-300 ease-out" />
                  </motion.div>

                  <motion.div
                    style={{ color: subtextColor }}
                    className="mt-2 sm:mt-3 lg:mt-4 text-[10px] sm:text-xs lg:text-sm font-mono uppercase tracking-[0.12em] sm:tracking-[0.2em] lg:tracking-[0.25em] font-light max-w-full break-words [overflow-wrap:anywhere] px-1 text-center"
                  >
                    {item.label}
                  </motion.div>
                </FadeUp>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
