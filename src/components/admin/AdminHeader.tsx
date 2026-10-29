"use client";

import React from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, children }: AdminHeaderProps) {
  return (
    <header className="p-4 sm:p-6 lg:p-8 border-b border-neutral-900 bg-black flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-light uppercase tracking-tight text-white break-words">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] sm:text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          {children}
        </div>
      )}
    </header>
  );
}
