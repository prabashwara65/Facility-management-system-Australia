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
    quote: '"Absolutely spotless. Our property manager was blown away — we got our full bond back the same day. Will be using SparkWell for our new place too."',
    name: 'Sarah M.',
    location: 'South Yarra',
  },
  {
    quote: '"Booked a spring clean before hosting a dinner party. The team arrived on time, were incredibly thorough, and even folded the toilet paper — a lovely touch."',
    name: 'James R.',
    location: 'Fitzroy',
  },
  {
    quote: '"I\'ve tried three other cleaning companies this year. SparkWell is a cut above — professional, responsive, and genuinely good at what they do."',
    name: 'Priya K.',
    location: 'Richmond',
  },
  {
    quote: '"Regular fortnightly cleans since March. The same team every time, they know our home, and it\'s always immaculate. Can\'t recommend enough."',
    name: 'Tom & Wei L.',
    location: 'Carlton',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function TestimonialsSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans" style={{ backgroundColor: 'var(--theme-surface)' }}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-1" style={{ color: 'var(--theme-secondary)' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: 'var(--theme-text)' }}>
            1,200+ happy homes across Melbourne.
          </h2>
        </div>

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
              className="rounded-xl p-6 flex flex-col justify-between space-y-6 transition-all duration-200"
              style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-1" style={{ color: 'var(--theme-secondary)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-sm italic leading-relaxed" style={{ color: 'var(--theme-muted)' }}>
                  {item.quote}
                </p>
              </div>

              <div className="flex items-end justify-between pt-2">
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--theme-text)' }}>{item.name}</h3>
                  <p className="text-xs font-medium" style={{ color: 'var(--theme-muted)' }}>{item.location}</p>
                </div>

                <div className="flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-secondary) 14%, white)', color: 'var(--theme-primary)' }}>
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