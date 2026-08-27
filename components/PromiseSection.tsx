'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, FileCheck2, UserCheck, Tag, Leaf, Plane, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PromiseFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
  status: string;
}

const iconMap: Record<string, any> = {
  ShieldCheck: ShieldCheck,
  FileCheck2: FileCheck2,
  UserCheck: UserCheck,
  Tag: Tag,
  Leaf: Leaf,
  Plane: Plane,
};

const defaultFeatures = [
  {
    id: 1,
    icon: 'ShieldCheck',
    title: '48-Hour Re-Clean Guarantee',
    description: 'Not happy? We return within 48 hours at no extra cost, no questions asked.',
    status: 'Active',
  },
  {
    id: 2,
    icon: 'FileCheck2',
    title: 'Fully Insured & Bonded',
    description: 'All cleaners carry $10M public liability insurance for complete peace of mind.',
    status: 'Active',
  },
  {
    id: 3,
    icon: 'UserCheck',
    title: 'Vetted & Background-Checked',
    description: 'Every team member passes a national police check before joining our crew.',
    status: 'Active',
  },
  {
    id: 4,
    icon: 'Tag',
    title: 'Fixed, Transparent Pricing',
    description: 'No hidden fees. Your quoted price is what you pay — always.',
    status: 'Active',
  },
  {
    id: 5,
    icon: 'Leaf',
    title: 'Eco-Friendly Products',
    description: 'We use hospital-grade, biodegradable cleaning products safe for kids and pets.',
    status: 'Active',
  },
  {
    id: 6,
    icon: 'Plane',
    title: 'No Travel Fees',
    description: 'Free travel within our service area — Melbourne metro and inner suburbs.',
    status: 'Active',
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
  const [features, setFeatures] = useState<PromiseFeature[]>(defaultFeatures);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const supabase = createClient();

  // Load features from Supabase
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('promise_features')
          .select('*')
          .eq('status', 'Active')
          .order('id', { ascending: true });

        if (error) {
          console.error('❌ Error loading features:', error);
          setFeatures(defaultFeatures);
          return;
        }

        if (data && data.length > 0) {
          setFeatures(data);
        } else {
          setFeatures(defaultFeatures);
        }
      } catch (error) {
        console.error('❌ Error:', error);
        setFeatures(defaultFeatures);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans" id="why-us" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <p style={{ color: 'var(--theme-muted)' }}>Loading promise features...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans" id="why-us" style={{ backgroundColor: 'var(--theme-bg)' }}>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="font-semibold tracking-widest text-xs uppercase" style={{ color: 'var(--theme-primary)' }}>
            The Shining Property Service Promise
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || ShieldCheck;
            const isExpanded = expandedId === feature.id;

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="rounded-xl p-4 sm:p-6 md:p-8 transition-all duration-200 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--theme-card)', 
                  border: '1px solid var(--theme-border)', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                }}
                onClick={() => toggleExpand(feature.id)}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-secondary)' }}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold truncate" style={{ color: 'var(--theme-text)' }}>
                        {feature.title}
                      </h3>
                      {/* Expand/Collapse icon - visible only on mobile */}
                      <button 
                        className="sm:hidden flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
                        style={{ color: 'var(--theme-muted)' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(feature.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Description - Always visible on desktop, expandable on mobile */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isExpanded || window.innerWidth >= 640 ? 'auto' : 0,
                        opacity: isExpanded || window.innerWidth >= 640 ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-sm leading-relaxed pt-1" style={{ color: 'var(--theme-muted)' }}>
                        {feature.description}
                      </p>
                    </motion.div>

                    {/* Mobile: Show truncated description when collapsed */}
                    {!isExpanded && (
                      <p className="text-[10px] leading-relaxed sm:hidden opacity-60 truncate" style={{ color: 'var(--theme-muted)' }}>
                        {feature.description.length > 50 ? feature.description.substring(0, 50) + '...' : feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}