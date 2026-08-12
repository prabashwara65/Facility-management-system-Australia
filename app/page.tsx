import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import PromiseSection from "@/components/PromiseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ServiceAreasSection from "@/components/ServiceAreasSection";
import BookingSection from "@/components/BookingSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#243453] text-white">
      <Navbar />
      <Hero />
      <Services />
      <ServicesSection />
      <PricingSection />
      <PromiseSection />
      <TestimonialsSection />
      <ServiceAreasSection /> 
      <BookingSection />
      <Footer />
    </main>
  );
}