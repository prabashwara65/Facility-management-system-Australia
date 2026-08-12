'use client';

import { motion, Variants } from 'framer-motion';
import { Plane } from 'lucide-react';

const suburbs = [
  'Melbourne CBD',
  'South Yarra',
  'Fitzroy',
  'Richmond',
  'Carlton',
  'Prahran',
  'St Kilda',
  'Docklands',
  'Collingwood',
  'Brunswick',
  'Hawthorn',
  'Camberwell',
  'Toorak',
  'Malvern',
  'Armadale',
  'Northcote',
  'Clifton Hill',
  'Albert Park',
  'Port Melbourne',
  'Windsor',
];

const regions = ['CBD', 'North', 'East', 'South', 'West'];

// Explicitly typed Variants to avoid Framer Motion easing type errors
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function ServiceAreasSection() {
  return (
    <section className="w-full bg-[#FAFAF6] py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column - Content & Suburb Tags */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <span className="text-amber-600 font-semibold tracking-widest text-xs uppercase">
              Service Areas
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1b2a4a] leading-tight">
              Melbourne metro &amp; inner suburbs.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              We service all major Melbourne suburbs with no travel fees. If you don't see your area below, give us a call — we're always expanding.
            </p>
          </div>

          {/* Suburbs Pills List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="flex flex-wrap gap-2.5 pt-2"
          >
            {suburbs.map((suburb) => (
              <motion.span
                key={suburb}
                variants={pillVariants}
                whileHover={{ scale: 1.04 }}
                className="bg-white text-[#1b2a4a] text-xs font-semibold px-4 py-2 rounded-full border border-gray-200/80 shadow-sm cursor-default transition-colors hover:border-[#c29233]"
              >
                {suburb}
              </motion.span>
            ))}
          </motion.div>

          {/* Footer Guarantee */}
          <div className="flex items-center space-x-2 text-[#1e8a56] font-bold text-xs sm:text-sm pt-2">
            <Plane className="w-4 h-4 fill-current stroke-none transform -rotate-45" />
            <span>No travel fees within service area</span>
          </div>
        </div>

        {/* Right Column - Map Banner Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-5 bg-[#182642] rounded-3xl p-8 sm:p-12 flex flex-col justify-center items-center text-center text-white shadow-xl min-h-[380px] sm:min-h-[440px] relative overflow-hidden border border-white/5"
        >
          {/* Map Graphic Icon */}
          <div className="text-6xl mb-6 select-none animate-bounce-slow">
            🗺️
          </div>

          {/* Card Title & Subtitle */}
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            Melbourne Metro
          </h3>
          <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase mb-8">
            20+ Suburbs Covered
          </span>

          {/* Region Filters Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {regions.map((region) => (
              <span
                key={region}
                className="bg-white/10 backdrop-blur-md text-gray-200 text-xs font-medium px-3.5 py-1.5 rounded-lg border border-white/10"
              >
                {region}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}