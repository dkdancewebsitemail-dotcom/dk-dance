import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BranchesSection } from "@/components/sections/BranchesSection";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FadeUp } from "@/components/ui/Motion";
import { getBranches } from "@/lib/db-services";

export const metadata: Metadata = {
  title: "Branch Studios | DK Dance Company Kozhikode & UK",
  description:
    "Explore DK Dance Company studios in Kozhikode (Kunduparamba, Westhill, Balussery, Kottooli, Parambilbazar) and our international branch in Bournemouth, UK.",
};

export const revalidate = 60;

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                OUR STUDIOS
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
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
