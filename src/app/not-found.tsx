import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-black text-white flex items-center justify-center px-6 sm:px-8 py-32 text-center">
        <div className="max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-dk-yellow block mb-4">
            404 // ROUTE NOT FOUND
          </span>
          <h1 className="text-6xl sm:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight text-white mb-6">
            Off Beat.
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8 font-light">
            The page you are looking for does not exist, has moved, or the rhythm
            shifted. Return to our main studio directory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/" variant="primary" size="md">
              Return Home
            </Button>
            <Button href="/dance-styles" variant="secondary" size="md">
              Explore Styles
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
