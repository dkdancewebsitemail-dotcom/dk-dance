import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryMarquee } from "@/components/gallery/GalleryMarquee";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FadeUp } from "@/components/ui/Motion";
import { getMedia } from "@/lib/db-services";

export const metadata: Metadata = {
  title: "Visual Gallery | DK Dance Company Performances & Classes",
  description:
    "Explore the visual archive of DK Dance Company: stage shows, competition wins, workshop intensives, and branch activities in Kozhikode and Bournemouth UK.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPage() {
  const mediaItems = await getMedia();
  const publishedPhotos = mediaItems.filter((m) => m.published !== false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-12">
          <FadeUp>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              Gallery
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed">
              Photographs, stage productions, and studio captures showcasing the
              energy, discipline, and artistic spirit of DK Dance Company.
            </p>
          </FadeUp>
        </section>

        {/* 2-Layer Horizontal Infinite Loop Showcase */}
        <section className="mb-20 overflow-hidden">
          <GalleryMarquee items={mediaItems} />
        </section>

        {/* Categorized Archive Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="border-t border-white/[0.08] pt-12 mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-light uppercase tracking-tight text-white mb-2">
              Browse All Categories
            </h2>
            <p className="text-sm text-neutral-400 font-light">
              Filter by class sessions, stage spectacles, international workshops, and branch showcases.
            </p>
          </div>
          <GalleryGrid items={publishedPhotos} showCategories={true} />
        </section>
      </main>

      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
