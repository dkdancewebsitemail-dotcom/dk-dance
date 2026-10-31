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
    // If the user is already inside the admin console navigating sub-tabs, don't show splash again
    if (typeof window !== "undefined") {
      const hasEntered = sessionStorage.getItem("dkdc_admin_loaded");
      if (hasEntered && isAdmin) {
        setIsLoading(false);
        return;
      }
    }

    // Lock body scroll while loading
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const startTime = Date.now();
    // Exactly 1000ms progression + 200ms fade = 1.2 seconds total smooth entry
    const duration = 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic curve: fast start, soft deceleration towards 100%
      const eased = 1 - Math.pow(1 - ratio, 3);
      const currentPercent = Math.min(100, Math.round(eased * 100));

      setProgress(currentPercent);

      if (ratio >= 1) {
        clearInterval(interval);
        if (typeof window !== "undefined" && isAdmin) {
          sessionStorage.setItem("dkdc_admin_loaded", "true");
        }
        setIsFadingOut(true);

        // Complete unmount & restore scrolling at exactly 1.2s
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = originalOverflow;
        }, 200);
      }
    }, 25);

    // If page is fully ready sooner, boost progress
    const handleWindowLoad = () => {
      setProgress((prev) => (prev < 90 ? 95 : prev));
    };

    if (typeof window !== "undefined" && document.readyState === "complete") {
      handleWindowLoad();
    } else if (typeof window !== "undefined") {
      window.addEventListener("load", handleWindowLoad);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleWindowLoad);
      }
      document.body.style.overflow = originalOverflow;
    };
  }, [isAdmin]);

  // Omit when loading finishes
  if (!isLoading) {
    return null;
  }

  return (
    <aside
      aria-label="Loading DK Dance Company"
      aria-live="polite"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-out select-none ${
        isFadingOut
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Clean Center Content Lockup - Minimal, Pure, No Background Glow */}
      <div className="flex flex-col items-center text-center px-6 max-w-xs w-full">
        {/* Crisp Brand Logo - No Glow, No Drop Shadow */}
        <div className="relative w-44 sm:w-52 h-14 sm:h-16 mb-4">
          <Image
            src="/images/logo/logo.png"
            alt="DK Dance Company"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 640px) 176px, 208px"
          />
        </div>

        {/* Brand Name */}
        <h2 className="text-xs sm:text-sm font-heading font-light tracking-[0.32em] uppercase text-white/90 mb-7">
          DK Dance Company
        </h2>

        {/* Minimal Hairline Progress Bar */}
        <div className="w-48 sm:w-56 h-[2px] bg-white/[0.08] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-dk-yellow rounded-full transition-[width] duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="mt-3 flex items-center justify-between w-48 sm:w-56 text-[11px] font-mono tracking-widest tabular-nums">
          <span className="uppercase tracking-[0.24em] text-[10px] text-neutral-500">
            LOADING
          </span>
          <span className="text-dk-yellow font-medium">
            {progress}%
          </span>
        </div>
      </div>
    </aside>
  );
}
