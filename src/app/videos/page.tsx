import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { VideosPageContent } from "@/components/videos/VideosPageContent";
import { getVideos, getSiteSettings } from "@/lib/db-services";

export const metadata: Metadata = {
  title: "Dance Videos & Choreography Showcase | DK Dance Company",
  description:
    "Watch video performances, contemporary choreography, urban hip-hop routines, and stage productions from DK Dance Company Kozhikode & UK.",
  openGraph: {
    title: "Dance Videos & Choreography Showcase | DK Dance Company",
    description:
      "Watch video performances, contemporary choreography, urban hip-hop routines, and stage productions from DK Dance Company Kozhikode & UK.",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function VideosPage() {
  const [videos, settings] = await Promise.all([
    getVideos({ onlyPublished: true }),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
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
