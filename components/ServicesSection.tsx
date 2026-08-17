'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ServicesSection() {
  return (
    /* Outer wrapper with #FAFAF6 background */
    <div className="w-full bg-[#FAFAF6] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <section className="max-w-7xl mx-auto space-y-8 font-sans">
        {/* Card 1: Residential */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Left Side - Image */}
          <div className="relative min-h-[300px] md:min-h-[420px] w-full">
            <Image
              src="/img/img_1.png"
              alt="Residential cleaning"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right Side - Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center items-start space-y-6" style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-card)' }}>
            <span className="font-semibold tracking-widest text-xs uppercase" style={{ color: 'var(--theme-secondary)' }}>
              Residential
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
              Your home deserves more than a once-over.
            </h2>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--theme-soft)' }}>
              From quick fortnightly visits to thorough move-out cleans, our
              residential team treats your space with care, discretion, and
              professional-grade equipment.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-medium px-8 py-3 rounded-md transition-colors duration-200"
              style={{ backgroundColor: 'var(--theme-secondary)', color: 'white' }}
            >
              Book Now
            </motion.button>
          </div>
        </motion.div>

        {/* Card 2: Commercial */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Left Side - Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center items-start space-y-6 order-2 md:order-1" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
            <span className="font-semibold tracking-widest text-xs uppercase" style={{ color: 'var(--theme-secondary)' }}>
              Commercial
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight" style={{ color: 'var(--theme-text)' }}>
              First impressions start with a spotless office.
            </h2>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--theme-muted)' }}>
              Offices, retail spaces, strata buildings — we offer flexible scheduling
              including after-hours and weekend cleans so your business never
              misses a beat.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-medium px-8 py-3 rounded-md transition-colors duration-200"
              style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-card)' }}
            >
              Get a Quote
            </motion.button>
          </div>

          {/* Right Side - Image */}
          <div className="relative min-h-[300px] md:min-h-[420px] w-full order-1 md:order-2">
            <Image
              src="/img/img_2.png"
              alt="Commercial cleaning"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
}