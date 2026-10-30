import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { VideosPageContent } from "@/components/videos/VideosPageContent";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getVideos, getSiteSettings } from "@/lib/db-services";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dance Choreography & Performance Videos | DK Dance Company",
  description:
    "Watch video performances, contemporary choreography, urban hip-hop routines, and stage productions from DK Dance Company Kozhikode & Bournemouth UK.",
  alternates: {
    canonical: "/videos",
  },
  openGraph: {
    title: "Dance Choreography & Performance Videos | DK Dance Company",
    description:
      "Watch video performances, contemporary choreography, urban hip-hop routines, and stage productions from DK Dance Company Kozhikode & UK.",
    url: "https://www.dkdancecompany.com/videos",
    type: "video.other",
    images: [
      {
        url: "/images/styles/contemporary.jpg",
        width: 1200,
        height: 630,
        alt: "DK Dance Company Choreography Showcase Video",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dance Performance Videos | DK Dance Company",
    description:
      "Stage choreography, contemporary routines, and studio reels from DK Dance Company.",
    images: ["/images/styles/contemporary.jpg"],
  },
};

export default async function VideosPage() {
  const [videos, settings] = await Promise.all([
    getVideos({ onlyPublished: true }),
    getSiteSettings(),
  ]);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dkdancecompany.com";

  // VideoObject Structured Data for Google Video Search
  const videoObjectSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "DK Dance Company Choreography Videos",
    description: "Official dance performance and studio video archives of DK Dance Company.",
    itemListElement: videos.map((v, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        description: v.description || `Dance choreography video by DK Dance Company - ${v.title}`,
        thumbnailUrl: [
          v.thumbnailUrl
            ? v.thumbnailUrl.startsWith("http")
              ? v.thumbnailUrl
              : `${baseUrl}${v.thumbnailUrl}`
            : `${baseUrl}/images/styles/contemporary.jpg`,
        ],
        contentUrl: v.url?.startsWith("http") ? v.url : `${baseUrl}${v.url || ""}`,
        uploadDate: "2025-01-01T00:00:00Z",
        duration: v.duration ? `PT${v.duration.replace(":", "M")}S` : undefined,
        publisher: {
          "@type": "DanceSchool",
          name: "DK Dance Company",
          url: baseUrl,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-4">
          <Breadcrumbs items={[{ name: "Videos Archive" }]} />
        </div>

        <VideosPageContent
          videos={videos}
          whatsappPhone={settings?.contact?.whatsapp}
        />
      </main>

      <Footer settings={settings} />
      <WhatsAppButton
        variant="floating"
        phone={settings?.contact?.whatsapp}
      />
    </>
  );
}
