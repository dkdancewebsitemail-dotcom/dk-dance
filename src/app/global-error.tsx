"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md space-y-6">
          <p className="text-xs font-mono uppercase tracking-widest text-[#D32F2F]">
            SYSTEM ALERT // ROOT EXCEPTION
          </p>
          <h1 className="text-3xl font-light uppercase tracking-tight text-white">
            Application Interrupted
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed font-light">
            An unexpected error occurred at the application boundary. You can retry the operation or reload the application.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-[#FFD700] text-black text-xs font-mono uppercase tracking-wider hover:bg-white transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 border border-neutral-800 text-neutral-300 text-xs font-mono uppercase tracking-wider hover:text-white hover:border-white transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
