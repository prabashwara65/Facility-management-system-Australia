'use client';

import { motion, Variants } from 'framer-motion';
import { ShieldCheck, FileCheck2, UserCheck, Tag, Leaf, Plane } from 'lucide-react';

interface PromiseFeature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: PromiseFeature[] = [
  {
    icon: ShieldCheck,
    title: '48-Hour Re-Clean Guarantee',
    description: 'Not happy? We return within 48 hours at no extra cost, no questions asked.',
  },
  {
    icon: FileCheck2,
    title: 'Fully Insured & Bonded',
    description: 'All cleaners carry $10M public liability insurance for complete peace of mind.',
  },
  {
    icon: UserCheck,
    title: 'Vetted & Background-Checked',
    description: 'Every team member passes a national police check before joining our crew.',
  },
  {
    icon: Tag,
    title: 'Fixed, Transparent Pricing',
    description: 'No hidden fees. Your quoted price is what you pay — always.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Products',
    description: 'We use hospital-grade, biodegradable cleaning products safe for kids and pets.',
  },
  {
    icon: Plane,
    title: 'No Travel Fees',
    description: 'Free travel within our service area — Melbourne metro and inner suburbs.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function PromiseSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans" id="why-us" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="font-semibold tracking-widest text-xs uppercase" style={{ color: 'var(--theme-primary)' }}>
            The Sparkwell Promise
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: 'var(--theme-text)' }}>
            Why homeowners <span className="italic font-normal" style={{ color: 'var(--theme-secondary)' }}>trust us.</span>
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="rounded-xl p-6 sm:p-8 flex items-start space-x-4 transition-all duration-200"
                style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
              >
                <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-secondary)' }}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold" style={{ color: 'var(--theme-text)' }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--theme-muted)' }}>{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}