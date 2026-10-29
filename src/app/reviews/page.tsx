import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FadeUp } from "@/components/ui/Motion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  GoogleReviewsSection,
  GoogleGLogo,
  GoogleStars,
  WRITE_REVIEW_URL,
} from "@/components/sections/GoogleReviewsSection";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { getReviews, getSiteSettings } from "@/lib/db-services";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Student Reviews & Google Testimonials | DK Dance Company",
  description:
    "Read verified Google reviews and student experiences from dancers and parents across DK Dance Company branches in Kozhikode and abroad. Rated 5.0 on Google.",
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: "Student Reviews & Google Testimonials | DK Dance Company",
    description:
      "Rated 5.0 on Google by over 140 dancers and parents across Kozhikode, Kerala & Bournemouth, UK.",
    url: "https://www.dkdancecompany.com/reviews",
    type: "website",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "DK Dance Company 5-Star Reviews on Google",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Reviews & Testimonials | DK Dance Company",
    description:
      "100% authentic student feedback from DK Dance Company dancers.",
    images: ["/images/logo/logo.png"],
  },
};

export default async function ReviewsPage() {
  const [reviews, settings] = await Promise.all([
    getReviews(true),
    getSiteSettings(),
  ]);

  const ratingBreakdown = [
    { stars: 5, percentage: 96, count: "135+" },
    { stars: 4, percentage: 4, count: "5" },
    { stars: 3, percentage: 0, count: "0" },
    { stars: 2, percentage: 0, count: "0" },
    { stars: 1, percentage: 0, count: "0" },
  ];

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dkdancecompany.com";

  // AggregateRating & Review structured data
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "DanceSchool",
    name: "DK Dance Company",
    url: baseUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "140",
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating || 5,
        bestRating: "5",
      },
      reviewBody: r.text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-16 w-full overflow-x-clip">
        {/* Editorial Page Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16 sm:mb-20">
          <Breadcrumbs items={[{ name: "Reviews" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <GoogleGLogo className="w-4 h-4" />
              <span className="editorial-eyebrow text-neutral-400">
                OFFICIAL REPUTATION & REVIEWS
              </span>
            </div>

            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              <span className="block text-dk-yellow text-xs sm:text-sm font-mono font-normal tracking-widest mb-2">
                VERIFIED STUDENT FEEDBACK
              </span>
              Google Reviews & Testimonials
            </h1>

            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed mb-12">
              Every step, every routine, every transformation. Discover what students, parents, and artists say about training at DK Dance Company.
            </p>
          </FadeUp>

          {/* Google Scorecard Box */}
          <FadeUp delay={0.1}>
            <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Overall Score */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
                <div className="flex items-center gap-3 mb-2">
                  <GoogleGLogo className="w-8 h-8" />
                  <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                    Google Rating
                  </span>
                </div>
                <div className="text-6xl sm:text-7xl font-heading font-light text-white tracking-tight my-2">
                  5.0
                </div>
                <div className="mb-3">
                  <GoogleStars rating={5} size="w-6 h-6" />
                </div>
                <div className="text-xs text-neutral-400 font-light">
                  Based on 140+ verified Google reviews
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-[#34A853] mt-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Authentic Student Feedback</span>
                </div>
              </div>

              {/* Star Rating Breakdown Bar */}
              <div className="lg:col-span-5 space-y-2.5">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 text-xs font-mono">
                    <span className="w-12 text-neutral-400 text-right">
                      {item.stars} star
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#FBBC05] rounded-full transition-all duration-700"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-neutral-500 text-left">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Write Review Action */}
              <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center text-center lg:text-right">
                <p className="text-neutral-400 text-xs mb-4 font-light max-w-xs">
                  Your feedback helps aspiring dancers discover their passion.
                </p>
                <a
                  href={WRITE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-black text-xs uppercase tracking-wider font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
                >
                  <GoogleGLogo className="w-4 h-4" />
                  <span>Write a Google Review</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Embedded Reviews Section */}
        <GoogleReviewsSection reviews={reviews} isFullPage={true} />
      </main>

      <Footer settings={settings} />
      <WhatsAppButton variant="floating" phone={settings?.contact?.whatsapp} />
    </>
  );
}
