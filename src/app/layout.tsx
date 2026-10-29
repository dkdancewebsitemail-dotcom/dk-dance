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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dkdancecompany.com"
  ),
  title: {
    default: "DK Dance Company | Dance Classes in Kozhikode",
    template: "%s | DK Dance Company",
  },
  description:
    "DK Dance Company offers structured dance training for children, teenagers and adults in Kozhikode, Kerala, with an international branch in Bournemouth, UK and online dance classes.",
  keywords: [
    "DK Dance Company",
    "DKDC",
    "Dhanesh Krishnan",
    "Dance Classes in Kozhikode",
    "Dance School Kerala",
    "Hip-hop classes Kozhikode",
    "Contemporary dance Kozhikode",
    "Bollywood dance classes",
    "Dance Academy Bournemouth UK",
    "Online dance training",
  ],
  authors: [{ name: "Dhanesh Krishnan", url: "https://www.dkdancecompany.com" }],
  creator: "DK Dance Company",
  publisher: "DK Dance Company",
  formatDetection: {
    email: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.dkdancecompany.com",
    siteName: "DK Dance Company",
    title: "DK Dance Company | Dance Classes in Kozhikode",
    description:
      "DK Dance Company offers structured dance training for children, teenagers and adults in Kozhikode, Kerala, with an international branch in Bournemouth, UK and online dance classes.",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "DK Dance Company Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DK Dance Company | Dance Classes in Kozhikode",
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
    "@type": "DanceSchool",
    name: "DK Dance Company",
    alternateName: "DKDC",
    url: "https://www.dkdancecompany.com",
    logo: "https://www.dkdancecompany.com/images/logo/logo.png",
    description:
      "Professional dance training institution dedicated to developing dance skills, creativity, confidence, and stage performance.",
    founder: {
      "@type": "Person",
      name: "Dhanesh Krishnan",
      jobTitle: "Director",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kozhikode",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    telephone: "+919995272083",
    email: "info@dkdancecompany.com",
    sameAs: [
      "https://instagram.com/dkdancecompany",
      "https://facebook.com/dkdancecompany",
      "https://youtube.com/@dkdancecompany",
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
      <body className={`${inter.className} bg-black text-white font-light tracking-[-0.01em] antialiased selection:bg-[#FFF102] selection:text-black min-h-screen flex flex-col justify-between overflow-x-hidden w-full relative`}>
        <ToastProvider>
          <LoadingScreen />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
