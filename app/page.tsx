import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import PromiseSection from "@/components/PromiseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ServiceAreasSection from "@/components/ServiceAreasSection";
import MobileDetailing from "@/components/MobileDetailing";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absoluteUrl('/#business'),
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.heroImage),
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Melbourne',
      addressRegion: 'VIC',
      addressCountry: 'AU',
    },
    areaServed: siteConfig.areaServed.map((name) => ({
      '@type': 'Place',
      name,
    })),
    makesOffer: siteConfig.services.map((name) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name,
        areaServed: 'Melbourne',
      },
    })),
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: 'var(--theme-bg)',
        color: 'var(--theme-text)',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <Services />
      <ServicesSection />
      <PricingSection />
      <PromiseSection />
      <TestimonialsSection />
      <ServiceAreasSection />
      <BookingSection />
      <MobileDetailing />
      <Footer />
    </main>
  );
}
