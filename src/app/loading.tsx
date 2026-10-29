import React from "react";

export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-neutral-900 overflow-hidden pointer-events-none"
    >
      <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#FFF102] to-transparent animate-preloader-shimmer" />
    </div>
  );
}
