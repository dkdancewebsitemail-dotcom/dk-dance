import React from "react";
import { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FadeUp } from "@/components/ui/Motion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getBranches, getSiteSettings, getDanceStyles } from "@/lib/db-services";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact & Admissions | DK Dance Company Kozhikode & UK",
  description:
    "Contact DK Dance Company head office in Kozhikode or Bournemouth UK. Enquire about admissions, workshop bookings, and choreography projects with Director Dhanesh Krishnan.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Admissions | DK Dance Company Kozhikode & UK",
    description:
      "Get in touch with DK Dance Company for dance batch admissions, audition dates, and choreography enquiries in Kerala & the UK.",
    url: "https://www.dkdancecompany.com/contact",
    type: "website",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "Contact DK Dance Company Admissions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Admissions | DK Dance Company",
    description:
      "Admissions and inquiries for DK Dance Company studios in Kozhikode & UK.",
    images: ["/images/logo/logo.png"],
  },
};

export default async function ContactPage() {
  const [branches, settings, danceStyles] = await Promise.all([
    getBranches(),
    getSiteSettings(),
    getDanceStyles(true),
  ]);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dkdancecompany.com";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact DK Dance Company",
    url: `${baseUrl}/contact`,
    mainEntity: {
      "@type": "DanceSchool",
      name: "DK Dance Company",
      url: baseUrl,
      telephone: settings.contact.phone,
      email: settings.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.contact.address,
        addressLocality: "Kozhikode",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: settings.contact.phone,
        contactType: "admissions desk",
        availableLanguage: ["English", "Malayalam", "Hindi"],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <Breadcrumbs items={[{ name: "Contact & Admissions" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                GET IN TOUCH
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              <span className="block text-dk-yellow text-xs sm:text-sm font-mono font-normal tracking-widest mb-2">
                DK DANCE COMPANY ADMISSIONS
              </span>
              Contact Us
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed">
              Begin your dance journey with DK Dance Company. Submit an admission
              enquiry or connect directly with our studio administration.
            </p>
          </FadeUp>
        </section>

        {/* Contact Grid: Details on Left, Form on Right */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-10">
              <FadeUp delay={0.1}>
                <div className="p-8 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] shadow-xl">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-dk-red/10 text-dk-red border border-dk-red/20 mb-4">
                    Head Office
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-light uppercase tracking-tight text-white mb-6">
                    Kozhikode, Kerala, India
                  </h2>
                  <div className="space-y-4 text-sm text-neutral-300 font-light">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-1" />
                      <span>{settings.contact.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                      <a
                        href={`tel:${settings.contact.phone}`}
                        className="hover:text-dk-yellow font-mono transition-colors"
                      >
                        {settings.contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                      <a
                        href={`mailto:${settings.contact.email}`}
                        className="hover:text-dk-yellow font-mono transition-colors"
                      >
                        {settings.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                      <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="p-7 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] shadow-xl relative overflow-hidden">
                  <span className="text-xs font-mono uppercase tracking-widest text-dk-yellow block mb-2">
                    Direct Leadership
                  </span>
                  <h3 className="text-xl font-heading font-light uppercase text-white mb-1">
                    Director Dhanesh Krishnan
                  </h3>
                  <p className="text-xs text-neutral-400 mb-5 font-light">
                    Artistic Director & Head Choreographer
                  </p>
                  <a
                    href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent("Hello Director Dhanesh Krishnan, I would like to enquire about DK Dance Company.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-xs font-mono uppercase text-[#25D366] hover:bg-[#25D366]/20 transition-all duration-300"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Direct Desk</span>
                  </a>
                </div>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-4">
                    Active Studio Locations
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono uppercase text-neutral-400">
                    {branches.map((b) => (
                      <div
                        key={b.slug}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all"
                      >
                        <span className="text-white block font-heading font-light">{b.name}</span>
                        <span className="text-neutral-500 text-[10px]">{b.city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <FadeUp delay={0.15}>
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-dk-yellow/10 text-dk-yellow border border-dk-yellow/20 mb-3">
                    ADMISSIONS DESK
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-light uppercase tracking-tight text-white">
                    Submit Admission Enquiry
                  </h2>
                </div>
                <ContactForm branches={branches} danceStyles={danceStyles} />
              </FadeUp>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppButton variant="floating" />
    </>
  );
}
