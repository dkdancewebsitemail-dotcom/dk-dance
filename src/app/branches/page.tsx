import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BranchesSection } from "@/components/sections/BranchesSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FadeUp } from "@/components/ui/Motion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getBranches } from "@/lib/db-services";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dance Studio Branches in Kozhikode & UK | DK Dance Company",
  description:
    "Find DK Dance Company studios in Kozhikode (Kunduparamba, Westhill, Balussery, Kottooli, Parambilbazar) and Bournemouth, UK. Comprehensive dance classes for all age groups.",
  alternates: {
    canonical: "/branches",
  },
  openGraph: {
    title: "Dance Studio Branches in Kozhikode & UK | DK Dance Company",
    description:
      "Explore 6 dedicated studio locations in Kozhikode, Kerala & Bournemouth, UK with specialized sprung dance floors and certified curriculum.",
    url: "https://www.dkdancecompany.com/branches",
    type: "website",
    images: [
      {
        url: "/images/branches/westhill.jpg",
        width: 1200,
        height: 630,
        alt: "DK Dance Company Studios and Branches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dance Studio Branches in Kozhikode & UK | DK Dance Company",
    description:
      "Find your nearest DK Dance Company studio in Kozhikode or Bournemouth UK.",
    images: ["/images/branches/westhill.jpg"],
  },
};

export default async function BranchesPage() {
  const branches = await getBranches();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dkdancecompany.com";

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "DK Dance Company Studio Branches",
    description: "Directory of physical dance studio branches operated by DK Dance Company.",
    itemListElement: branches.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "DanceSchool",
        name: `DK Dance Company - ${b.name} Branch`,
        url: `${baseUrl}/branches/${b.slug}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: b.address || `${b.name}, ${b.city}`,
          addressLocality: b.city,
          addressRegion: b.state,
          addressCountry: b.country === "United Kingdom" ? "GB" : "IN",
        },
        telephone: b.phone || "+919995272083",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <Breadcrumbs items={[{ name: "Studio Branches" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                OUR STUDIOS
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              <span className="block text-dk-yellow text-xs sm:text-sm font-mono font-normal tracking-widest mb-2">
                DK DANCE COMPANY LOCATIONS
              </span>
              Studio Branches
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed">
              Find your nearest DK Dance Company studio. Each location offers a
              dedicated learning space with specialized flooring, acoustic
              installations, and curriculum directed by Dhanesh Krishnan.
            </p>
          </FadeUp>
        </section>

        {/* Directory Section */}
        <BranchesSection branches={branches} showAll />
      </main>

      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
