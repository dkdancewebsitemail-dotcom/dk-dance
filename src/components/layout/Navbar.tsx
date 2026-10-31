"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Classes", href: "/classes" },
  { label: "Styles", href: "/dance-styles" },
  { label: "Branches", href: "/branches" },
  { label: "Videos", href: "/videos" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Online", href: "/online-classes" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Hide public navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const isLightHero = isHome && !isScrolled;

  return (
    <>
      {/* Spacious, Elegant, Transparent Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          mobileMenuOpen
            ? "bg-transparent py-3 sm:py-5 px-4 sm:px-8 lg:px-14 text-white"
            : isScrolled
            ? "bg-neutral-950/90 backdrop-blur-2xl border-b border-white/[0.08] py-3.5 sm:py-4.5 px-4 sm:px-8 lg:px-14 text-white"
            : isLightHero
            ? "bg-transparent py-4 sm:py-6 px-4 sm:px-8 lg:px-14 text-neutral-900"
            : "bg-transparent py-4 sm:py-6 px-4 sm:px-8 lg:px-14 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Brand Lockup & Return Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!isHome && !mobileMenuOpen && (
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    router.back();
                  } else {
                    router.push("/");
                  }
                }}
                aria-label="Back to previous page"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 ${
                  isLightHero
                    ? "bg-black/[0.05] hover:bg-black/[0.1] border border-black/10 text-neutral-800 hover:text-black"
                    : "bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-dk-yellow/50 text-neutral-300 hover:text-white"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-dk-yellow" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Prominent, Large Brand Logo without any Box/Background */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center group relative focus-visible:outline-none"
              aria-label="DK Dance Company Homepage"
            >
              <div
                className={`relative w-44 xs:w-52 sm:w-64 md:w-72 lg:w-80 h-11 xs:h-13 sm:h-16 md:h-18 lg:h-20 transition-all duration-300 group-hover:scale-[1.03] active:scale-[0.98] ${
                  isScrolled || mobileMenuOpen
                    ? "filter drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]"
                    : ""
                }`}
              >
                <Image
                  src="/images/logo/logo.png"
                  alt="DK Dance Company"
                  fill
                  priority
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 224px, 256px"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - Pure Clean Typography with Subtle Hairline Indicator */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-6 xl:gap-8"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] sm:text-sm font-light tracking-wide transition-all duration-200 relative py-1 group/nav ${
                    isLightHero
                      ? isActive
                        ? "text-black font-medium"
                        : "text-neutral-700 hover:text-black"
                      : isActive
                      ? "text-white font-medium"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Subtle Expanding Hairline Accent */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-dk-yellow transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover/nav:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA & Mobile Trigger */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className={`hidden sm:inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 group/cta ${
                isLightHero
                  ? "bg-neutral-950 text-white hover:bg-dk-yellow hover:text-neutral-950 border border-neutral-950/20"
                  : "bg-dk-yellow hover:bg-[#fff433] text-neutral-950 border border-dk-yellow/40 hover:border-amber-400"
              }`}
            >
              <span>Enquire</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
            </Link>

            {/* Mobile Hamburger / Close Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className={`lg:hidden relative z-50 p-2.5 rounded-full transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95 ${
                mobileMenuOpen
                  ? "bg-neutral-800/90 border border-white/25 text-white hover:bg-dk-yellow hover:text-black hover:border-dk-yellow shadow-[0_0_20px_rgba(255,241,2,0.3)] ring-2 ring-white/10"
                  : isLightHero
                  ? "bg-black/[0.06] hover:bg-black/[0.12] border border-black/10 text-neutral-900"
                  : "bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white hover:text-dk-yellow"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white transition-transform duration-300 rotate-0 hover:rotate-90" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu with Smooth Framer Motion Entrance & Exit */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full z-40 bg-neutral-950/98 backdrop-blur-2xl flex flex-col justify-between px-5 sm:px-8 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-hidden text-white lg:hidden select-none"
          >
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-28 -right-28 w-72 h-72 rounded-full bg-dk-yellow/[0.07] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-dk-red/[0.06] blur-3xl" />

            {/* Subheader / Directory indicator */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] shrink-0 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 font-mono">
                  DIRECTORY
                </span>
              </div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-dk-yellow font-mono">
                DK DANCE COMPANY
              </span>
            </div>

            {/* Navigation Links: dynamic auto-distribution to guarantee 100% single screen fit without scrolling */}
            <nav
              aria-label="Mobile Navigation"
              className="flex-1 min-h-0 flex flex-col justify-evenly py-1 my-auto relative z-10"
            >
              {NAV_LINKS.map((link, idx) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.03 + idx * 0.02,
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                    className="flex-1 min-h-0 flex items-center"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full group flex items-center justify-between py-1 px-2.5 -mx-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-white/[0.05] text-dk-yellow shadow-[inset_0_0_12px_rgba(255,241,2,0.06)]"
                          : "text-neutral-300 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`font-mono text-[10px] tracking-widest w-4 shrink-0 transition-colors ${
                            isActive
                              ? "text-dk-yellow font-semibold"
                              : "text-neutral-600 group-hover:text-neutral-400"
                          }`}
                        >
                          {idx < 9 ? `0${idx + 1}` : idx + 1}
                        </span>
                        {isActive && (
                          <span className="w-1 h-3.5 sm:h-4 rounded-full bg-dk-yellow shadow-[0_0_8px_#FFF102] shrink-0" />
                        )}
                        <span
                          className={`text-[clamp(15px,2.2vh,20px)] font-light tracking-tight truncate transition-transform duration-200 group-hover:translate-x-0.5 ${
                            isActive ? "font-medium text-dk-yellow" : ""
                          }`}
                        >
                          {link.label}
                        </span>
                      </div>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 transition-all duration-200 shrink-0 ${
                          isActive
                            ? "text-dk-yellow opacity-100"
                            : "text-neutral-600 opacity-40 group-hover:opacity-100 group-hover:text-dk-yellow group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        }`}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile Footer CTAs: Fixed at bottom, always visible on single screen */}
            <div className="pt-2 sm:pt-3 border-t border-white/[0.08] flex flex-col gap-2 shrink-0 relative z-10">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 sm:py-3 px-5 rounded-full bg-dk-yellow hover:bg-[#fff433] text-neutral-950 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(255,241,2,0.25)] transition-all hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>Enquire Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400 font-mono pt-0.5">
                <span className="truncate">Kozhikode • Bournemouth</span>
                <a
                  href="tel:+919995272083"
                  className="text-neutral-300 hover:text-dk-yellow transition-colors shrink-0 font-medium"
                >
                  +91 9995 272 083
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
