import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp } from "@/components/ui/Motion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy | DK Dance Company",
  description:
    "Privacy Policy of DK Dance Company regarding student data, admission enquiries, and website privacy standards across Kozhikode & UK studios.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | DK Dance Company",
    description:
      "Privacy Policy of DK Dance Company regarding student data, admission enquiries, and website data standards.",
    url: "https://www.dkdancecompany.com/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | DK Dance Company",
    description: "Data privacy and security standards at DK Dance Company.",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        <section className="max-w-4xl mx-auto px-4 sm:px-8 mb-16">
          <Breadcrumbs items={[{ name: "Privacy Policy" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                LEGAL & DATA
              </span>
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-6xl font-heading font-extralight sm:font-thin uppercase tracking-tight text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-10">
              Last Updated: October 2026
            </p>
          </FadeUp>

          <div className="p-6 sm:p-12 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] shadow-2xl space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
            <FadeUp delay={0.1}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                1. Information We Collect
              </h2>
              <p>
                When you interact with DK Dance Company through our website or
                admission forms, we collect information you voluntarily provide.
                This includes student and parent names, contact telephone/WhatsApp
                numbers, email addresses, student age, preferred studio branches,
                and specific dance style interests.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                2. Use of Information
              </h2>
              <p>
                The information collected is used exclusively for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 text-neutral-400">
                <li>Processing admission consultations and batch scheduling.</li>
                <li>Communicating timetable changes, fee reminders, and workshop notices.</li>
                <li>Coordinating stage performance rehearsals and competitive entries.</li>
                <li>Responding to questions submitted via our contact forms.</li>
              </ul>
              <p className="mt-3">
                We never sell, trade, or distribute your personal contact details to
                third-party marketers.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                3. Third-Party Services
              </h2>
              <p>
                Our web platform utilizes select infrastructure services:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 text-neutral-400">
                <li>
                  <strong className="text-white font-normal">UploadThing:</strong> For secure storage and delivery of studio media assets.
                </li>
                <li>
                  <strong className="text-white font-normal">MongoDB Atlas:</strong> For secure database management of enquiries, branches, and site settings.
                </li>
                <li>
                  <strong className="text-white font-normal">Google Maps:</strong> Direct destination links to assist students and parents navigating to our physical studio locations.
                </li>
              </ul>
            </FadeUp>

            <FadeUp delay={0.25}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                4. Cookies & Security
              </h2>
              <p>
                Our public website does not employ intrusive tracking cookies.
                Strictly necessary HTTP-only authentication cookies are utilized
                solely for authorized administrative dashboard access. All data
                transmitted between your browser and our servers is encrypted
                using modern SSL/TLS protocols.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                5. Contacting the Administration
              </h2>
              <p>
                If you have questions regarding your stored information, request
                data modification, or wish to withdraw an enquiry, please contact
                Director Dhanesh Krishnan at info@dkdancecompany.com or via
                WhatsApp at +91 9995 272 083.
              </p>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
