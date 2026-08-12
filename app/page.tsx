import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#243453] text-white">
      <Navbar />
      <Hero />
      <Services />
      <ServicesSection />
      <PricingSection />
    </main>
  );
}