'use client';

import Link from "next/link";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    icon: "🏠",
    title: "End of Lease Clean",
    price: "From $280",
    description:
      "Bond-back guarantee with our comprehensive end-of-tenancy deep clean. We cover every corner.",
  },
  {
    icon: "✨",
    title: "Deep / Spring Clean",
    price: "From $199",
    description:
      "A thorough top-to-bottom reset — inside appliances, behind furniture, skirting boards, and more.",
  },
  {
    icon: "🗓️",
    title: "Regular Clean",
    price: "From $99",
    description:
      "Weekly or fortnightly maintenance cleans tailored to your home and schedule.",
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
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
        type: "spring" as const,
        stiffness: 120,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[#faf9f5] px-6 py-16 lg:py-20"
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
            className="text-[10px] font-bold tracking-[0.16em] text-[#c99a32] uppercase sm:text-xs"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            OUR SERVICES
          </motion.p>

          <motion.h2 
            className="mt-4 font-serif text-[32px] font-medium leading-tight tracking-tight text-[#1f3152] sm:text-[38px] lg:text-[44px]"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Every clean,{" "}
            <span className="italic text-[#c99a32]">
              done right.
            </span>
          </motion.h2>

          <motion.p 
            className="mx-auto mt-3 max-w-2xl text-[14px] text-[#687184]"
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
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ 
                y: -6,
                transition: { type: "spring" as const, stiffness: 300 }
              }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                price={service.price}
                description={service.description}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Service CTA */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
       
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
  icon: string;
  title: string;
  price: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[380px] flex-col rounded-xl border border-[#e1e2e5] bg-white p-8 shadow-[0_5px_20px_rgba(30,45,75,0.06)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(30,45,75,0.08)] lg:p-9">
      <motion.div 
        className="text-[28px]"
        whileHover={{ 
          scale: 1.15,
          rotate: [0, -5, 5, -5, 0],
          transition: { duration: 0.4 }
        }}
      >
        {icon}
      </motion.div>

      <h3 className="mt-8 font-serif text-[24px] font-bold leading-tight text-[#1f3152]">
        {title}
      </h3>

      <motion.p 
        className="mt-3 text-[20px] font-bold text-[#c99a32]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring" as const, stiffness: 300 }}
      >
        {price}
      </motion.p>

      <p className="mt-4 max-w-[400px] text-[14px] font-medium leading-[1.6] text-[#687184]">
        {description}
      </p>

      <Link
        href="#contact"
        className="mt-auto inline-flex w-fit border-b-[2px] border-[#c99a32] pb-1 text-[14px] font-bold tracking-wide text-[#1f3152] transition-colors hover:text-[#c99a32]"
      >
        LEARN MORE →
      </Link>
    </div>
  );
}