import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/app/context/ThemeProvider";
import PriceCalculator from "@/components/PriceCalculator";
import { absoluteUrl, siteConfig } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "Shining Property Service | Melbourne Cleaning & Mobile Detailing",
    template: "%s | Shining Property Service",
  },
  description: siteConfig.description,
  keywords: [
    "Melbourne cleaning services",
    "end of lease cleaning Melbourne",
    "deep cleaning Melbourne",
    "regular house cleaning Melbourne",
    "commercial cleaning Melbourne",
    "mobile car detailing Melbourne",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shining Property Service | Melbourne Cleaning & Mobile Detailing",
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.heroImage,
        width: 1200,
        height: 630,
        alt: "Shining Property Service cleaning team in Melbourne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shining Property Service | Melbourne Cleaning & Mobile Detailing",
    description: siteConfig.description,
    images: [siteConfig.heroImage],
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
    icon: absoluteUrl(siteConfig.logo),
    apple: absoluteUrl(siteConfig.logo),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <PriceCalculator />
        </ThemeProvider>
      </body>
    </html>
  );
}
