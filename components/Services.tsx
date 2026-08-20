'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { createClient } from '@/lib/supabase/client';

const iconMap = {
  Home: Home,
  Sparkles: Sparkles,
  Calendar: Calendar,
};

// Default fallback data (only used if Supabase fails)
const defaultServices = [
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

export default function Services() {
  const [services, setServices] = useState(defaultServices);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const supabase = createClient();

  // Load services from Supabase
  const loadServices = async () => {
    try {
      setIsLoading(true);
      console.log('🔵 Loading services from Supabase...');

      const { data, error } = await supabase
        .from('services')
        .select('id, icon, title, price, description')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ Error loading services:', error);
        // Fallback to default services
        setServices(defaultServices);
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Services loaded:', data.length);
        // Transform data to match component format
        const transformed = data.map(service => ({
          id: service.id,
          icon: service.icon || 'Home',
          title: service.title,
          price: service.price,
          description: service.description,
        }));
        setServices(transformed);
      } else {
        console.log('📝 No services found, using defaults');
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

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 15,
      },
    },
  };

  if (isLoading) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="px-6 py-16 lg:py-20"
        style={{ backgroundColor: 'var(--theme-bg)' }}
      >
        <div className="mx-auto max-w-[1400px] flex justify-center items-center min-h-[400px]">
          <div style={{ color: 'var(--theme-muted)' }}>Loading services...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="px-6 py-16 lg:py-20"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section Heading */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p 
            className="text-[10px] font-bold tracking-[0.16em] uppercase sm:text-xs"
            style={{ color: 'var(--theme-primary)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            OUR SERVICES
          </motion.p>

          <motion.h2 
            className="mt-4 font-serif text-[32px] font-medium leading-tight tracking-tight sm:text-[38px] lg:text-[44px]"
            style={{ color: 'var(--theme-text)' }}
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Every clean,{" "}
            <span className="italic" style={{ color: 'var(--theme-primary)' }}>
              done right.
            </span>
          </motion.h2>

          <motion.p 
            className="mx-auto mt-3 max-w-2xl text-[14px]"
            style={{ color: 'var(--theme-muted)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Choose from our range of professional cleaning services tailored to your needs
          </motion.p>
        </motion.div>

        {/* Service Cards */}
        <motion.div 
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Home;
            return (
              <motion.div
                key={service.id || service.title}
                variants={itemVariants}
                whileHover={{ 
                  y: -6,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <ServiceCard
                  icon={<Icon className="w-7 h-7" />}
                  title={service.title}
                  price={service.price}
                  description={service.description}
                />
              </motion.div>
            );
          })}
        </motion.div>
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
      className="flex min-h-[380px] flex-col rounded-xl border p-8 transition-all duration-300 hover:shadow-xl lg:p-9"
      style={{
        backgroundColor: 'var(--theme-card)',
        borderColor: 'var(--theme-border)',
        boxShadow: '0 4px 20px color-mix(in srgb, var(--theme-primary) 6%, transparent)',
      }}
    >
      <div 
        className="flex h-14 w-14 items-center justify-center rounded-xl"
        style={{ 
          backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)',
          color: 'var(--theme-primary)',
        }}
      >
        {icon}
      </div>

      <h3 className="mt-6 font-serif text-[22px] font-bold leading-tight" style={{ color: 'var(--theme-text)' }}>
        {title}
      </h3>

      <motion.p 
        className="mt-2 text-2xl font-bold"
        style={{ color: 'var(--theme-primary)' }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {price}
      </motion.p>

      <p className="mt-4 max-w-[400px] text-[14px] font-medium leading-[1.6]" style={{ color: 'var(--theme-muted)' }}>
        {description}
      </p>

      <Link
        href="#contact"
        className="mt-auto inline-flex items-center gap-1.5 w-fit text-[14px] font-semibold transition-all hover:gap-2.5"
        style={{ color: 'var(--theme-primary)' }}
      >
        <span>Learn More</span>
        <ArrowRight className="w-4 h-4 transition-transform" />
      </Link>
    </div>
  );
}