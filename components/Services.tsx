'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Home, Sparkles, Calendar, ArrowRight, type LucideIcon } from "lucide-react";
import { createClient } from '@/lib/supabase/client';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Service {
  id: number;
  icon: string;
  title: string;
  price: string;
  description: string;
}

const iconMap: Record<string, LucideIcon> = {
  Home: Home,
  Sparkles: Sparkles,
  Calendar: Calendar,
};

// Default fallback data (only used if Supabase fails)
const defaultServices: Service[] = [
  {
    id: 1,
    icon: 'Home',
    title: "End of Lease Clean",
    price: "From $280",
    description: "Bond-back guarantee with our comprehensive end-of-tenancy deep clean. We cover every corner.",
  },
  {
    id: 2,
    icon: 'Sparkles',
    title: "Deep / Spring Clean",
    price: "From $199",
    description: "A thorough top-to-bottom reset — inside appliances, behind furniture, skirting boards, and more.",
  },
  {
    id: 3,
    icon: 'Calendar',
    title: "Regular Clean",
    price: "From $99",
    description: "Weekly or fortnightly maintenance cleans tailored to your home and schedule.",
  },
];

// Card variants matching testimonials style
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: 'easeOut' 
    } 
  },
};

export default function Services() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [isLoading, setIsLoading] = useState(true);
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const supabase = createClient();

  // Load services from Supabase
  const loadServices = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('services')
        .select('id, icon, title, price, description')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ Error loading services:', error);
        setServices(defaultServices);
        return;
      }

      if (data && data.length > 0) {
        const transformed = (data as Service[]).map((service) => ({
          id: service.id,
          icon: service.icon || 'Home',
          title: service.title,
          price: service.price,
          description: service.description,
        }));
        setServices(transformed);
      } else {
        setServices(defaultServices);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setServices(defaultServices);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const totalSlides = services.length;

  // Breakpoints for responsive cards
  const breakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  };

  if (isLoading) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: 'var(--theme-muted)' }}>Loading services...</p>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: 'var(--theme-muted)' }}>No services available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header - Matching testimonials style */}
        <div className="text-center space-y-4">
          <span
            className="font-semibold tracking-widest text-xs uppercase"
            style={{ color: 'var(--theme-secondary)' }}
          >
            OUR SERVICES
          </span>

          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: 'var(--theme-text)' }}>
            Every clean,{" "}
            <span className="italic" style={{ color: 'var(--theme-secondary)' }}>
              done right.
            </span>
          </h2>

          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--theme-muted)' }}>
            Choose from our range of professional cleaning services tailored to your needs
          </p>
        </div>

        {/* Swiper Carousel - Mobile & Tablet */}
        <div className="block lg:hidden">
          <div className="relative">
            <Swiper
              onSwiper={setSwiperRef}
              modules={[Navigation, Pagination]}
              breakpoints={breakpoints}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="pb-12"
            >
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Home;
                return (
                  <SwiperSlide key={service.id}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <ServiceCard
                        icon={<Icon className="w-5 h-5" />}
                        title={service.title}
                        price={service.price}
                        description={service.description}
                      />
                    </motion.div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Numbered Navigation - Mobile & Tablet */}
            <div className="flex justify-center items-center gap-3 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => swiperRef?.slideTo(index)}
                    className={`transition-all duration-300 rounded-full flex items-center justify-center text-xs font-medium ${
                      isActive
                        ? 'w-10 h-10 text-white shadow-md scale-110'
                        : 'w-8 h-8 text-gray-500 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--theme-secondary)' : 'rgba(0,0,0,0.06)',
                      color: isActive ? 'white' : 'var(--theme-muted)',
                      border: isActive ? 'none' : '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {/* Hide default Swiper pagination */}
            <style jsx>{`
              :global(.swiper-pagination) {
                display: none !important;
              }
              :global(.swiper-button-next),
              :global(.swiper-button-prev) {
                display: none !important;
              }
            `}</style>
          </div>
        </div>

        {/* Grid View - Desktop (lg and above) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Home;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ServiceCard
                  icon={<Icon className="w-5 h-5" />}
                  title={service.title}
                  price={service.price}
                  description={service.description}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  icon,
  title,
  price,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  price: string;
  description: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col transition-all duration-200"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        minHeight: '240px',
        maxHeight: '320px',
      }}
    >
      {/* Icon */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--theme-secondary) 12%, transparent)',
          color: 'var(--theme-secondary)',
        }}
      >
        {icon}
      </div>

      {/* Price */}
      <motion.span
        className="text-xl font-bold tracking-tight mb-1"
        style={{ color: 'var(--theme-secondary)' }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {price}
      </motion.span>

      {/* Title */}
      <h3 className="font-serif text-lg font-bold leading-snug mb-2" style={{ color: 'var(--theme-text)' }}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed flex-1 line-clamp-3" style={{ color: 'var(--theme-muted)' }}>
        {description}
      </p>
    </div>
  );
}
