"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Video,
  Sparkles,
  GraduationCap,
  Banknote,
  MapPin,
  Star,
  Inbox,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Photo Library", href: "/admin/media", icon: ImageIcon },
    { label: "Video Showcase", href: "/admin/videos", icon: Video },
    { label: "Dance Styles", href: "/admin/dance-styles", icon: Sparkles },
    { label: "Curriculum", href: "/admin/curriculum", icon: GraduationCap },
    { label: "Classes & Fees", href: "/admin/classes", icon: Banknote },
    { label: "Branches", href: "/admin/branches", icon: MapPin },
    { label: "Google Reviews", href: "/admin/reviews", icon: Star },
    { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
    { label: "Settings & Security", href: "/admin/settings", icon: Sliders },
  ];

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40 h-16">
        <Link
          href="/admin"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.96] border border-white/20 shadow"
        >
          <div className="relative w-28 h-7">
            <Image
              src="/images/logo/logo.png"
              alt="DK Dance Company Admin"
              fill
              className="object-contain object-center"
              sizes="112px"
            />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-neutral-400 hover:text-white border border-neutral-800 rounded-lg text-xs font-mono"
            title="View Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-2.5 rounded-lg border transition-all ${
              mobileOpen
                ? "bg-white text-black border-white"
                : "text-neutral-300 hover:text-white bg-neutral-900 border-neutral-800"
            }`}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 top-16 flex flex-col">
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Full height scrollable drawer */}
          <div className="relative z-50 bg-neutral-950 border-b border-neutral-800 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-4rem)] flex flex-col justify-between space-y-6 shadow-2xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-dk-yellow block px-2">
                Administrative Sections
              </span>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 text-xs font-mono uppercase tracking-wider rounded-lg transition-all duration-200 min-h-[46px] ${
                        isActive
                          ? "bg-white text-black font-semibold shadow-md"
                          : "text-neutral-300 hover:text-white hover:bg-neutral-900 active:bg-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-dk-yellow shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-neutral-900 space-y-3">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-mono text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between"
              >
                <span>Open Public Website</span>
                <ExternalLink className="w-4 h-4" />
              </Link>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 text-xs font-mono uppercase tracking-wider text-dk-red hover:bg-dk-red/10 border border-dk-red/30 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out from Console</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-neutral-950 border-r border-neutral-800 flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="p-6 border-b border-neutral-900">
          <Link href="/admin" className="block p-2 rounded-xl bg-white/[0.96] border border-white/20 shadow">
            <div className="relative w-32 h-8">
              <Image
                src="/images/logo/logo.png"
                alt="DK Dance Company Admin"
                fill
                className="object-contain object-center"
                sizes="128px"
              />
            </div>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-widest text-dk-yellow mt-2 block">
            Administrative Console
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-mono uppercase tracking-wider rounded-none transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black font-normal"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-neutral-900 space-y-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-2.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-dk-red hover:bg-dk-red/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  </>
);
}
