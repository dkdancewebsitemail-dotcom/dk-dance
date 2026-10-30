import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryMarquee } from "@/components/gallery/GalleryMarquee";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FadeUp } from "@/components/ui/Motion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getMedia } from "@/lib/db-services";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Visual Performance Gallery & Studio Archive | DK Dance Company",
  description:
    "Explore the official visual archive of DK Dance Company: stage spectacles, championship performances, international workshops, and studio sessions in Kozhikode & UK.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Visual Performance Gallery & Studio Archive | DK Dance Company",
    description:
      "Stage shows, competitions, and studio moments from DK Dance Company dancers in Kerala & Bournemouth UK.",
    url: "https://www.dkdancecompany.com/gallery",
    type: "website",
    images: [
      {
        url: "/images/styles/western.jpg",
        width: 1200,
        height: 630,
        alt: "DK Dance Company Live Stage Performance Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visual Performance Gallery | DK Dance Company",
    description:
      "Stage shows, choreography reels, and studio moments from DK Dance Company.",
    images: ["/images/styles/western.jpg"],
  },
};

export default async function GalleryPage() {
  const mediaItems = await getMedia();
  const publishedPhotos = mediaItems.filter((m) => m.published !== false);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dkdancecompany.com";

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "DK Dance Company Performance & Studio Gallery",
    description: "Visual documentation of dance performances, student workshops, and company productions.",
    url: `${baseUrl}/gallery`,
    publisher: {
      "@type": "DanceSchool",
      name: "DK Dance Company",
      url: baseUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-12">
          <Breadcrumbs items={[{ name: "Gallery" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                VISUAL DOCUMENTATION
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              <span className="block text-dk-yellow text-xs sm:text-sm font-mono font-normal tracking-widest mb-2">
                DK DANCE COMPANY ARCHIVE
              </span>
              Stage & Studio Gallery
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
