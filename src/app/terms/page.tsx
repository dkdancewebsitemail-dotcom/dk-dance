import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp } from "@/components/ui/Motion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms & Conditions | DK Dance Company",
  description:
    "Terms of service, admission contracts, and studio terms for DK Dance Company students and guardians.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | DK Dance Company",
    description:
      "Terms of service, admission contracts, and studio terms for DK Dance Company.",
    url: "https://www.dkdancecompany.com/terms",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions | DK Dance Company",
    description: "Terms and conditions for DK Dance Company.",
  },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        <section className="max-w-4xl mx-auto px-4 sm:px-8 mb-16">
          <Breadcrumbs items={[{ name: "Terms & Conditions" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                TERMS OF SERVICE
              </span>
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-6xl font-heading font-extralight sm:font-thin uppercase tracking-tight text-white mb-6">
              Terms & Conditions
            </h1>
            <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-10">
              Last Updated: October 2026
            </p>
          </FadeUp>

          <div className="p-6 sm:p-12 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] shadow-2xl space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
            <FadeUp delay={0.1}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                1. Institutional Agreement
              </h2>
              <p>
                By enrolling in DK Dance Company (DKDC) or utilizing this website,
                you agree to adhere to the policies, codes of conduct, and fee
                structures established by Artistic Director Dhanesh Krishnan and
                management.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                2. Admission & Monthly Tuition
              </h2>
              <p>
                A one-time admission fee of ₹1,000 is required upon registration.
                Monthly tuition (₹500 for 1 class/week or ₹800 for 2 classes/week,
                subject to branch variations) must be paid on or before the 10th
                of each month. Non-payment may result in forfeiture of batch placement.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                3. Physical Activity & Liability Release
              </h2>
              <p>
                Dance is a rigorous physical activity. While our instructors
                prioritize safe anatomical execution and warm-up protocols,
                students and parents acknowledge inherent athletic risks.
                Students must disclose relevant health conditions before training.
              </p>
            </FadeUp>

            <FadeUp delay={0.25}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                4. Intellectual Property & Choreography
              </h2>
              <p>
                All choreography, artistic routines, musical edits, and
                instructional methodologies produced by Dhanesh Krishnan and DKDC
                faculty remain the intellectual property of DK Dance Company.
                Commercial reproduction or unauthorized teaching of company
                choreography is strictly prohibited without written consent.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <h2 className="text-xl font-heading font-light uppercase text-white mb-3">
                5. Media & Performance Rights
              </h2>
              <p>
                Photographs and video recordings captured during classes,
                workshops, stage shows, and competitions may be archived in our
                official gallery or promotional materials to celebrate student
                achievements.
              </p>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
