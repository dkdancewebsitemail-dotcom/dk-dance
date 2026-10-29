"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 sm:px-8 py-32 text-center">
      <div className="max-w-xl">
        <span className="text-xs font-mono uppercase tracking-widest text-dk-red block mb-4">
          SYSTEM NOTICE // UNEXPECTED STATE
        </span>
        <h1 className="text-4xl sm:text-6xl font-heading font-extralight sm:font-thin uppercase tracking-tight text-white mb-6">
          Performance Interrupted.
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          An unexpected server error occurred while preparing this view. Our
          technical team has been notified.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => reset()} variant="accent" size="md">
            Try Again
          </Button>
          <Button href="/" variant="secondary" size="md">
            Return to Homepage
          </Button>
        </div>
      </div>
    </main>
  );
}
