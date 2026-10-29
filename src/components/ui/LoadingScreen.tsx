"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function LoadingScreen() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Admin routes do not use the loading screen
    if (isAdmin) {
      setIsLoading(false);
      return;
    }

    // Lock body scroll while loading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Progress animation milestones
    const intervals: NodeJS.Timeout[] = [];

    // Step 1: Initial rapid jump to 28%
    intervals.push(
      setTimeout(() => {
        setProgress(28);
      }, 100)
    );

    // Step 2: Steady increase to 62%
    intervals.push(
      setTimeout(() => {
        setProgress(62);
      }, 350)
    );

    // Step 3: Advance to 88%
    intervals.push(
      setTimeout(() => {
        setProgress(88);
      }, 650)
    );

    // Step 4: Finish at 100%
    intervals.push(
      setTimeout(() => {
        setProgress(100);
      }, 950)
    );

    // Step 5: Begin smooth fade-out curtain
    intervals.push(
      setTimeout(() => {
        setIsFadingOut(true);
      }, 1200)
    );

    // Step 6: Complete unmount and unlock scroll
    intervals.push(
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = originalOverflow;
      }, 1850)
    );

    // If window finishes loading faster, fast-forward progress
    const handleWindowLoad = () => {
      setProgress((prev) => (prev < 90 ? 95 : prev));
    };

    if (typeof window !== "undefined" && document.readyState === "complete") {
      handleWindowLoad();
    } else if (typeof window !== "undefined") {
      window.addEventListener("load", handleWindowLoad);
    }

    return () => {
      intervals.forEach((timer) => clearTimeout(timer));
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleWindowLoad);
      }
      document.body.style.overflow = originalOverflow;
    };
  }, [isAdmin]);

  // Completely omit for admin routes or when loading finishes
  if (isAdmin || !isLoading) {
    return null;
  }

  return (
    <aside
      aria-label="Loading DK Dance Company"
      aria-live="polite"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isFadingOut
          ? "opacity-0 pointer-events-none scale-[1.02] filter blur-[2px]"
          : "opacity-100 pointer-events-auto scale-100"
      }`}
    >
      {/* Ambient background bloom */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-dk-yellow/[0.04] blur-[100px] pointer-events-none" />

      {/* Center content lockup */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full">
        {/* Brand Logo with subtle breathing glow */}
        <div className="relative w-52 sm:w-64 h-14 sm:h-16 mb-4 transition-transform duration-700 ease-out">
          <div className="absolute inset-0 bg-dk-yellow/[0.08] blur-xl rounded-full scale-110 pointer-events-none" />
          <Image
            src="/images/logo/logo.png"
            alt="DK Dance Company"
            fill
            priority
            className="object-contain filter drop-shadow-[0_0_12px_rgba(255,241,2,0.18)]"
            sizes="(max-width: 640px) 208px, 256px"
          />
        </div>

        {/* Minimalist Editorial Subtitle */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-1.5 h-[1px] bg-neutral-700" />
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400 font-light">
            Learn • Train • Perform • Grow
          </span>
          <span className="w-1.5 h-[1px] bg-neutral-700" />
        </div>

        {/* Hairline Minimal Progress Bar */}
        <div className="w-44 sm:w-52 h-[1.5px] bg-neutral-900 rounded-full overflow-hidden mt-7 relative">
          <div
            className="h-full bg-gradient-to-r from-neutral-600 via-dk-yellow to-white transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Clean Monospace Progress Counter */}
        <div className="mt-3 flex items-center justify-between w-44 sm:w-52 text-[10px] font-mono text-neutral-400 tracking-wider tabular-nums">
          <span className="uppercase text-[9px] tracking-[0.2em] text-neutral-400">Loading</span>
          <span className="text-neutral-400">{progress}%</span>
        </div>
      </div>
    </aside>
  );
}
