'use client';

import Link from "next/link";
import { motion, useInView } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[#faf9f5] px-6 py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Section Heading */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p 
            className="text-xs font-bold tracking-[0.16em] text-[#c99a32] sm:text-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            OUR SERVICES
          </motion.p>

          <motion.h2 
            className="mt-6 font-serif text-[42px] font-medium leading-tight tracking-tight text-[#1f3152] sm:text-[48px] lg:text-[58px]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Every clean,{" "}
            <span className="italic text-[#c99a32]">
              done right.
            </span>
          </motion.h2>

          <motion.p 
            className="mx-auto mt-4 max-w-2xl text-[16px] text-[#687184]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Choose from our range of professional cleaning services tailored to your needs
          </motion.p>
        </motion.div>

        {/* Service Cards */}
        <motion.div 
          className="mt-20 grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              custom={index}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
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
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link
            href="#contact"
            className="inline-block rounded-md bg-[#d0a037] px-10 py-3.5 text-[15px] font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#dfae45]"
          >
            View All Services →
          </Link>
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
    <div className="flex min-h-[455px] flex-col rounded-xl border border-[#e1e2e5] bg-white p-10 shadow-[0_5px_25px_rgba(30,45,75,0.06)] transition-all duration-300 hover:shadow-[0_12px_35px_rgba(30,45,75,0.1)] lg:p-12">
      <motion.div 
        className="text-[32px]"
        whileHover={{ 
          scale: 1.2,
          rotate: [0, -5, 5, -5, 0],
          transition: { duration: 0.5 }
        }}
      >
        {icon}
      </motion.div>

      <h3 className="mt-10 font-serif text-[29px] font-bold leading-tight text-[#1f3152]">
        {title}
      </h3>

      <motion.p 
        className="mt-5 text-[23px] font-bold text-[#c99a32]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {price}
      </motion.p>

      <p className="mt-6 max-w-[430px] text-[16px] font-medium leading-[1.75] text-[#687184]">
        {description}
      </p>

      <Link
        href="#contact"
        className="mt-auto inline-flex w-fit border-b-[3px] border-[#c99a32] pb-1 text-[16px] font-bold tracking-wide text-[#1f3152] transition-colors hover:text-[#c99a32]"
      >
        LEARN MORE →
      </Link>
    </div>
  );
}