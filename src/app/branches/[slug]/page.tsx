import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { MapPin, Phone, MessageCircle, ArrowUpRight, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppButton, WhatsAppIcon } from "@/components/ui/WhatsAppButton";
import { FadeUp, RevealImage } from "@/components/ui/Motion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getBranchBySlug, getBranches, getDanceStyles } from "@/lib/db-services";
import { GoogleMapsPinIcon } from "@/components/sections/BranchesSection";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  if (!branch) {
    return {
      title: "Branch Not Found | DK Dance Company",
    };
  }

  const title = `Dance Classes in ${branch.name}, ${branch.city} | DK Dance Company`;
  const description =
    branch.description ||
    `Professional dance classes at DK Dance Company ${branch.name} studio in ${branch.city}, ${branch.country}. Bollywood, Hip-Hop, Contemporary & Western dance for all ages.`;

  const canonicalPath = `/branches/${branch.slug}`;
  const imageUrl = branch.imageUrl || "/images/logo/logo.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: `https://www.dkdancecompany.com${canonicalPath}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `DK Dance Company ${branch.name} Studio in ${branch.city}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [branch, allBranches, danceStyles] = await Promise.all([
    getBranchBySlug(slug),
    getBranches(),
    getDanceStyles(true),
  ]);

  if (!branch) {
    notFound();
  }

  // Enforce single canonical URL if accessed by Mongo ID or case mismatch
  if (slug !== branch.slug) {
    permanentRedirect(`/branches/${branch.slug}`);
  }

  const isInternational = branch.country.toLowerCase() !== "india";
  const baseUrl = "https://www.dkdancecompany.com";

  // Structured Data for Local Dance School
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "DanceSchool",
    "@id": `${baseUrl}/branches/${branch.slug}#branch`,
    name: `DK Dance Company - ${branch.name} Studio`,
    url: `${baseUrl}/branches/${branch.slug}`,
    telephone: branch.phone || "+919995272083",
    image: branch.imageUrl ? `${baseUrl}${branch.imageUrl}` : `${baseUrl}/images/logo/logo.png`,
    description: branch.description || `Professional dance classes at DK Dance Company ${branch.name} branch in ${branch.city}.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address || `${branch.name}, ${branch.city}`,
      addressLocality: branch.city,
      addressRegion: branch.state,
      addressCountry: isInternational ? "GB" : "IN",
    },
    parentOrganization: {
      "@type": "DanceSchool",
      name: "DK Dance Company",
      url: baseUrl,
    },
    hasMap: branch.googleMapsUrl || undefined,
    priceRange: "₹₹",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        {/* Navigation Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 flex flex-wrap items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { name: "Branches", href: "/branches" },
              { name: branch.name },
            ]}
            className="mb-0"
          />

          <Link
            href="/branches"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Branches</span>
          </Link>
        </div>

        {/* Hero Section of Branch */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <FadeUp>
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
                  <span className="editorial-eyebrow text-neutral-400">
                    {isInternational ? "INTERNATIONAL STUDIO" : "KERALA STUDIO"}
                  </span>
                </div>
                <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-heading font-extralight sm:font-thin uppercase tracking-tight text-white mb-6">
                  <span className="block text-dk-yellow text-xs sm:text-sm font-mono font-normal tracking-widest mb-2">
                    DK DANCE COMPANY STUDIO
                  </span>
                  {branch.name}, {branch.city}
                </h1>
                <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono uppercase mb-6">
                  <MapPin className="w-4 h-4 text-dk-red" />
                  <span>
                    {branch.city}, {branch.country}
                  </span>
                </div>
                <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-8">
                  {branch.description ||
                    `DK Dance Company ${branch.name} studio offers professional training for beginners to advanced performers under our comprehensive syllabus.`}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none">
                  {branch.googleMapsUrl && (
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-neutral-950 hover:bg-[#1a73e8] hover:text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-[0_4px_20px_rgba(26,115,232,0.4)] text-center group active:scale-95"
                    >
                      <GoogleMapsPinIcon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Google Maps Location</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#1a73e8] group-hover:text-white transition-colors" />
                    </a>
                  )}
                  <a
                    href={`https://wa.me/${branch.whatsapp || "919995272083"}?text=${encodeURIComponent(`Hello DK Dance Company, I would like to enquire about the ${branch.name} branch batches and admission.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-mono uppercase tracking-wider font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.55)] text-center group active:scale-95"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white shrink-0 group-hover:scale-110 transition-transform" />
                    <span>WhatsApp Enquiry</span>
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* Visual */}
            <div className="lg:col-span-5 relative aspect-[4/3] bg-neutral-950 overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl">
              <RevealImage className="w-full h-full relative">
                {branch.imageUrl ? (
                  <Image
                    src={branch.imageUrl}
                    alt={`DK Dance Company ${branch.name} Studio in ${branch.city}`}
                    fill
                    priority
                    className="object-cover object-center transition-all duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-dk-yellow" />
                    </div>
                    <span className="text-base font-heading uppercase tracking-widest text-white">
                      {branch.name} Studio
                    </span>
                    <span className="text-xs font-mono uppercase text-neutral-400 mt-2">
                      {branch.city}, {branch.country}
                    </span>
                  </div>
                )}
              </RevealImage>
            </div>
          </div>
        </section>

        {/* Branch Info Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-8 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] shadow-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                Address & Location
              </span>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4 font-light">
                {branch.address || `${branch.name}, ${branch.city}, ${branch.country}`}
              </p>
              {branch.googleMapsUrl && (
                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-[#1a73e8] border border-white/10 hover:border-[#1a73e8] text-xs font-mono uppercase text-white transition-all duration-300 group shadow-sm hover:shadow-[0_2px_15px_rgba(26,115,232,0.35)]"
                >
                  <GoogleMapsPinIcon className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Open in Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#4285F4] group-hover:text-white transition-colors" />
                </a>
              )}
            </div>

            <div className="p-8 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Class Timetable & Batches
                </span>
                <p className="text-sm text-neutral-300 leading-relaxed mb-4 font-mono font-light">
                  {branch.classTimings || "Batch schedules confirmed upon admission consultation."}
                </p>
                <span className="text-xs text-neutral-500 font-light block mb-4">
                  Weekend & weekday batches available
                </span>
              </div>
              <a
                href={`https://wa.me/${branch.whatsapp || "919995272083"}?text=${encodeURIComponent(`Hello DK Dance Company, I would like to enquire about class batches and timings at ${branch.name} studio.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-mono uppercase tracking-wider font-medium transition-all duration-300 shadow-md hover:shadow-[0_4px_15px_rgba(37,211,102,0.35)] w-fit active:scale-95 group"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white shrink-0 group-hover:scale-110 transition-transform" />
                <span>Enquire Batches</span>
              </a>
            </div>

            <div className="p-8 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] shadow-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                Direct Contact
              </span>
              <div className="space-y-2 text-sm text-neutral-300 font-mono font-light">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{branch.phone || "+91 9995 272 083"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366] shrink-0" />
                  <a
                    href={`https://wa.me/${branch.whatsapp || "919995272083"}?text=${encodeURIComponent(`Hello DK Dance Company, I would like to contact the ${branch.name} studio.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#25D366] transition-colors"
                  >
                    WhatsApp: {branch.whatsapp || "919995272083"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Branches Navigation for Internal Linking */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
          <div className="border-t border-white/[0.08] pt-12 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                Explore More Studios
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-light uppercase text-white">
                Other DK Dance Company Branches
              </h2>
            </div>
            <Link
              href="/branches"
              className="text-xs font-mono uppercase text-dk-yellow hover:text-white transition-colors"
            >
              View All Locations →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {allBranches
              .filter((b) => b.slug !== branch.slug && b.isActive !== false)
              .map((b) => (
                <Link
                  key={b.slug}
                  href={`/branches/${b.slug}`}
                  className="p-5 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02] hover:border-dk-yellow/40 hover:bg-white/[0.05] transition-all group"
                >
                  <span className="text-xs font-mono uppercase text-neutral-500 block mb-1">
                    {b.city}
                  </span>
                  <span className="text-base font-heading uppercase text-white group-hover:text-dk-yellow transition-colors block">
                    {b.name}
                  </span>
                </Link>
              ))}
          </div>
        </section>

        {/* Enquiry Form Preselected for this Branch */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <span className="editorial-eyebrow text-dk-yellow block mb-2">
              ADMISSION CONSULTATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-light uppercase tracking-tight text-white mb-4">
              Enquire For {branch.name} Studio
            </h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Submit your inquiry and our branch coordinator will reach out to schedule your trial class or batch placement.
            </p>
          </div>

          <ContactForm branches={allBranches} danceStyles={danceStyles} defaultBranch={branch.name} />
        </section>
      </main>

      <Footer />
      <WhatsAppButton variant="floating" branchName={branch.name} />
    </>
  );
}
