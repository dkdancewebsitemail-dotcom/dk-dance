import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dkdancecompany.com"),
  title: {
    default: "Best Dance Academy in Kozhikode | Dance Classes Near Me – DK Dance Company",
    template: "%s | DK Dance Company",
  },
  description:
    "DK Dance Company offers structured dance training for children, teenagers and adults in Kozhikode, Kerala, with an international branch in Bournemouth, UK and worldwide online dance classes.",
  keywords: [
    "DK Dance Company",
    "DKDC",
    "Danzon",
    "Dhanesh Krishnan",
    "Dance Classes in Kozhikode",
    "Dance Classes in Calicut",
    "Dance classes near me",
    "Best dance academy in Kozhikode",
    "Dance School Kerala",
    "Hip-hop classes Kozhikode",
    "Contemporary dance Kozhikode",
    "Bollywood dance classes",
    "Dance Academy Bournemouth UK",
    "Online dance training",
  ],
  authors: [{ name: "Dhanesh Krishnan", url: "https://www.dkdancecompany.com/about" }],
  creator: "DK Dance Company",
  publisher: "DK Dance Company",
  alternates: {
    canonical: "./",
  },
  formatDetection: {
    email: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.dkdancecompany.com",
    siteName: "DK Dance Company",
    title: "Best Dance Academy in Kozhikode | Dance Classes Near Me – DK Dance Company",
    description:
      "DK Dance Company offers structured dance training for children, teenagers and adults in Kozhikode, Kerala, with an international branch in Bournemouth, UK and online dance classes.",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "DK Dance Company Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Dance Academy in Kozhikode | Dance Classes Near Me – DK Dance Company",
    description:
      "Structured dance training in Kozhikode, Kerala and Bournemouth, UK. Learn • Train • Perform • Grow.",
    images: ["/images/logo/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo/logo.png",
    apple: "/images/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.dkdancecompany.com/#website",
        url: "https://www.dkdancecompany.com",
        name: "DK Dance Company",
        description:
          "Professional Dance Classes in Kozhikode, Kerala & Bournemouth, UK",
        publisher: {
          "@id": "https://www.dkdancecompany.com/#organization",
        },
      },
      {
        "@type": ["DanceSchool", "EducationalOrganization"],
        "@id": "https://www.dkdancecompany.com/#organization",
        name: "DK Dance Company",
        alternateName: ["DKDC", "Danzon"],
        url: "https://www.dkdancecompany.com",
        logo: "https://www.dkdancecompany.com/images/logo/logo.png",
        image: "https://www.dkdancecompany.com/images/logo/logo.png",
        description:
          "Professional dance training institution dedicated to developing dance skills, creativity, confidence, and stage performance across Kozhikode, Kerala and Bournemouth, UK.",
        founder: {
          "@type": "Person",
          name: "Dhanesh Krishnan K",
          jobTitle: "Artistic Director & Choreographer",
          sameAs: "https://www.dkdancecompany.com/about",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kozhikode",
          addressRegion: "Kerala",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "11.2588",
          longitude: "75.7804",
        },
        telephone: "+919995272083",
        email: "info@dkdancecompany.com",
        priceRange: "₹₹",
        currenciesAccepted: "INR, GBP",
        paymentAccepted: "Cash, UPI, Bank Transfer",
        areaServed: [
          "Kozhikode",
          "Calicut",
          "Kerala",
          "India",
          "Bournemouth",
          "United Kingdom",
          "Worldwide",
        ],
        sameAs: [
          "https://instagram.com/dkdancecompany",
          "https://facebook.com/dkdancecompany",
          "https://youtube.com/@dkdancecompany",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Dance Classes & Programs",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Bollywood Dance Classes",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Hip-Hop Dance Training",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Contemporary Dance Classes",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Lyrical Dance Training",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Western Commercial Dance",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Freestyle & Movement Training",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Online Dance Classes Worldwide",
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.className} bg-black text-white font-light tracking-[-0.01em] antialiased selection:bg-[#FFF102] selection:text-black min-h-screen flex flex-col justify-between overflow-x-hidden w-full relative`}
      >
        <ToastProvider>
          <LoadingScreen />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
