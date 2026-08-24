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

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: 'var(--theme-bg)',
        color: 'var(--theme-text)',
      }}
    >
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