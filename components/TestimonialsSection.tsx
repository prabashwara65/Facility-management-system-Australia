'use client';

import { motion, Variants } from 'framer-motion';
import { Star, Check } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      '"Absolutely spotless. Our property manager was blown away — we got our full bond back the same day. Will be using SparkWell for our new place too."',
    name: 'Sarah M.',
    location: 'South Yarra',
  },
  {
    quote:
      '"Booked a spring clean before hosting a dinner party. The team arrived on time, were incredibly thorough, and even folded the toilet paper — a lovely touch."',
    name: 'James R.',
    location: 'Fitzroy',
  },
  {
    quote:
      '"I\'ve tried three other cleaning companies this year. SparkWell is a cut above — professional, responsive, and genuinely good at what they do."',
    name: 'Priya K.',
    location: 'Richmond',
  },
  {
    quote:
      '"Regular fortnightly cleans since March. The same team every time, they know our home, and it\'s always immaculate. Can\'t recommend enough."',
    name: 'Tom & Wei L.',
    location: 'Carlton',
  },
];

// Explicitly typed Variants to avoid TypeScript errors
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-[#F2F0E8] py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Header */}
        <div className="text-center space-y-4">
          {/* Top 5 Gold Stars */}
          <div className="flex justify-center items-center space-x-1 text-[#c29233]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1b2a4a] tracking-tight">
            1,200+ happy homes across Melbourne.
          </h2>
        </div>

        {/* Testimonial Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between space-y-6 transition-all duration-200"
            >
              <div className="space-y-4">
                {/* 5 Card Stars */}
                <div className="flex items-center space-x-1 text-[#c29233]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-gray-700 text-sm italic leading-relaxed">
                  {item.quote}
                </p>
              </div>

              {/* Author & Verified Badge */}
              <div className="flex items-end justify-between pt-2">
                <div>
                  <h3 className="font-bold text-sm text-[#1b2a4a]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    {item.location}
                  </p>
                </div>

                {/* Verified Pill */}
                <div className="flex items-center space-x-1 bg-[#eaf5ea] text-[#1e8a56] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}