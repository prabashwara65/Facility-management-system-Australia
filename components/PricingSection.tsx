'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent, PRICING_STORAGE_KEY, defaultPricingContent, PricingContent } from '@/lib/siteContent';

type ServiceCategory = 'Residential' | 'Commercial';

export default function PricingSection() {
  // Use shared data for pricing
  const [pricingData] = useSiteContent<PricingContent>(
    PRICING_STORAGE_KEY,
    defaultPricingContent
  );

  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('Residential');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [direction, setDirection] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  // Set initial selected tier when data loads
  useEffect(() => {
    const residentialTiers = pricingData.tiers.filter(t => t.category === 'Residential');
    if (residentialTiers.length > 0 && !selectedTier) {
      setSelectedTier(residentialTiers[0].label);
    }
  }, [pricingData, selectedTier]);

  const handleCategoryChange = (category: ServiceCategory) => {
    if (category === activeCategory) return;
    setDirection(activeCategory === 'Residential' ? 1 : -1);
    setActiveCategory(category);
    
    const tiers = pricingData.tiers.filter(t => t.category === category);
    if (tiers.length > 0) {
      setSelectedTier(tiers[0].label);
    }
    setOpenFaqIndex(null);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  // Get filtered data for current category
  const getCategoryData = (category: ServiceCategory) => {
    const tiers = pricingData.tiers.filter(t => t.category === category);
    const addOnsLeft = pricingData.addOns.filter(a => a.category === category && a.side === 'left');
    const addOnsRight = pricingData.addOns.filter(a => a.category === category && a.side === 'right');
    const faqs = pricingData.faqs.filter(f => f.category === category);
    
    return { tiers, addOnsLeft, addOnsRight, faqs };
  };

  const residentialData = getCategoryData('Residential');
  const commercialData = getCategoryData('Commercial');

  // Get current data based on active category
  const currentData = activeCategory === 'Residential' ? residentialData : commercialData;

  return (
    <section
      id="pricing"
      className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden"
      style={{
        backgroundColor: 'var(--theme-primary)',
        color: 'var(--theme-text)',
      }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Category Toggle */}
        <div className="flex justify-center">
          <div
            className="p-1.5 rounded-xl flex space-x-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {['Residential', 'Commercial'].map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category as ServiceCategory)}
                  className="relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{
                    color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                    backgroundColor: isActive ? 'var(--theme-secondary)' : 'transparent',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isActive ? '0 4px 20px rgba(59,130,246,0.3)' : 'none',
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliding Content */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeCategory}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {activeCategory === 'Residential' ? (
                <ResidentialContent 
                  data={residentialData}
                  selectedTier={selectedTier}
                  setSelectedTier={setSelectedTier}
                  openFaqIndex={openFaqIndex}
                  toggleFaq={toggleFaq}
                  hoveredTier={hoveredTier}
                  setHoveredTier={setHoveredTier}
                />
              ) : (
                <CommercialContent data={commercialData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ResidentialContent({ 
  data, 
  selectedTier, 
  setSelectedTier, 
  openFaqIndex, 
  toggleFaq,
  hoveredTier,
  setHoveredTier 
}: any) {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span
          className="font-semibold tracking-widest text-xs uppercase"
          style={{ color: 'var(--theme-secondary)' }}
        >
          Pick the One That Fits Your Home
        </span>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white">
          Choose My Clean
        </h2>
        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Takes less than 30 seconds. No payment required to book.
        </p>
      </div>

      {/* Service Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.tiers.map((tier: any) => {
          const isSelected = selectedTier === tier.label;
          const isHovered = hoveredTier === tier.label;

          return (
            <motion.div
              key={tier.id}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTier(tier.label)}
              onMouseEnter={() => setHoveredTier(tier.label)}
              onMouseLeave={() => setHoveredTier(null)}
              className="relative cursor-pointer rounded-xl p-6 flex flex-col transition-all duration-300 border backdrop-blur-sm"
              style={{
                backgroundColor: isSelected ? 'var(--theme-secondary)' : 'rgba(255,255,255,0.08)',
                borderColor: isSelected ? 'var(--theme-secondary)' : isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 8px 32px rgba(59,130,246,0.4)' : isHovered ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.1)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {tier.isPopular && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap"
                  style={{
                    backgroundColor: 'var(--theme-secondary)',
                    color: 'white',
                  }}
                >
                  Most Popular
                </motion.span>
              )}

              <div className="flex-1 text-center">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'white' }}>
                  {tier.label}
                </h3>
                <motion.span 
                  className="text-4xl font-serif font-bold tracking-tight block mb-3"
                  style={{ color: 'white' }}
                  animate={{ scale: isSelected ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {tier.price}
                </motion.span>
                {tier.description && (
                  <p className="text-sm leading-relaxed" style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)' }}>
                    {tier.description}
                  </p>
                )}
              </div>

              <motion.button
                className="mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? 'white' : 'var(--theme-secondary)',
                  color: isSelected ? 'var(--theme-primary)' : 'white',
                  opacity: isSelected ? 1 : 0.9,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected ? '✓ Selected' : 'Choose'}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Add-Ons Section */}
      <div
        className="rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h3 className="text-xl font-serif font-semibold text-white text-center">Optional Add-Ons</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <div className="space-y-3">
            {data.addOnsLeft.map((item: any, idx: number) => (
              <motion.div
                key={`${item.name}-${idx}`}
                className="flex items-center justify-between py-3 px-4 rounded-lg border-b transition-all duration-200"
                style={{ 
                  borderColor: 'rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  paddingLeft: '20px',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.name}</span>
                <span className="font-bold font-serif text-base" style={{ color: 'var(--theme-secondary)' }}>
                  {item.price}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            {data.addOnsRight.map((item: any, idx: number) => (
              <motion.div
                key={`${item.name}-${idx}`}
                className="flex items-center justify-between py-3 px-4 rounded-lg border-b transition-all duration-200"
                style={{ 
                  borderColor: 'rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  paddingLeft: '20px',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.name}</span>
                <span className="font-bold font-serif text-base" style={{ color: 'var(--theme-secondary)' }}>
                  {item.price}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-center pt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          * Prices are indicative and may vary based on property condition and size. All prices include GST.
        </p>
      </div>

      {/* FAQ Section */}
      <div
        className="rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h2 className="text-xl font-serif font-semibold text-white text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-3 max-w-3xl mx-auto">
          {data.faqs.map((faq: any, index: number) => {
            const isOpen = openFaqIndex === index;
            
            return (
              <motion.div
                key={faq.id}
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                initial={false}
                animate={{ 
                  borderColor: isOpen ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)',
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left transition-all duration-200 hover:bg-white/5"
                >
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {faq.question}
                  </span>
                  <motion.span
                    className="text-xl flex-shrink-0 ml-4"
                    style={{ color: 'var(--theme-secondary)' }}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? '−' : '+'}
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4">
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Book Now Banner */}
      <motion.div
        className="text-center rounded-2xl p-6 cursor-pointer"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        whileHover={{ 
          backgroundColor: 'rgba(255,255,255,0.1)',
          scale: 1.01,
        }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <span style={{ color: 'var(--theme-secondary)' }}>★</span> Book My Clean Today!
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          BOOK NOW TO GUARANTEE THIS WEEK'S AVAILABILITY — spots filling fast
        </p>
      </motion.div>
    </div>
  );
}

function CommercialContent({ data }: any) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">
          PROFESSIONAL COMMERCIAL CLEANING MELBOURNE
        </h1>
        <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-secondary)' }}>
          FROM JUST $199
        </p>
        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
          We are industry-leading experts in commercial cleaning Melbourne, proudly serving clients across Victoria with reliable, professional solutions tailored to every kind of workspace.
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          We take pride in making your workplace flawlessly clean with trusted commercial cleaning services that make a lasting impression.
        </p>
        <div>
          <button
            className="px-8 py-3 rounded-lg font-semibold text-sm transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--theme-secondary)',
              color: 'white',
            }}
          >
            REQUEST A FREE QUOTE
          </button>
        </div>
        <div className="flex justify-center items-center gap-2">
          <span style={{ color: 'var(--theme-secondary)' }}>★★★★★</span>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Rated 4.8 from over 1000 happy clients!
          </span>
        </div>
      </div>

      {/* Specialisations */}
      <div>
        <h2 className="text-xl font-serif font-semibold text-white text-center mb-6">
          We specialise in
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            'Office cleaning Melbourne',
            'Retail cleaning',
            'School cleaning',
            'Gym cleaning',
            'Showrooms & Warehouses',
            'Medical Centres',
            'Shopping Centres'
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="p-4 rounded-lg text-center text-sm transition-all duration-300 cursor-default"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.9)',
              }}
              whileHover={{ 
                backgroundColor: 'rgba(255,255,255,0.12)',
                scale: 1.05,
                borderColor: 'rgba(59,130,246,0.3)',
              }}
            >
              {item}
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-center mt-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Our commercial cleaning Melbourne solutions are fully customised to suit your particular needs. Whether it's nightly, weekly, fortnightly, or monthly cleans, we've got you covered—with the option to add deep cleans when needed.
        </p>
        <div className="text-center mt-4">
          <button
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--theme-secondary)',
              color: 'white',
            }}
          >
            REQUEST A FREE QUOTE!
          </button>
        </div>
      </div>

      {/* Custom Packages */}
      <div
        className="rounded-2xl p-8"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 className="text-xl font-serif font-semibold text-white text-center mb-6">
          custom cleaning PACKAGES for your workplace
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            '100% Customisable tailored package',
            'Professional experienced cleaners',
            '100% police checked & insured',
            '100% satisfaction guaranteed',
            'Superior cleaning products',
            'Replenish cleaning goods',
            'Restock toiletries & more'
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-2 text-sm"
              style={{ color: 'rgba(255,255,255,0.8)' }}
              whileHover={{ x: 4 }}
            >
              <span style={{ color: 'var(--theme-secondary)' }}>✓</span>
              {feature}
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-center mt-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
          When it comes to office cleaning Melbourne, we focus on hygiene, consistency, and creating a productive environment. Our flexible packages make sure your team can work in a clean and healthy space.
        </p>
        <div className="text-center mt-4">
          <button
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--theme-secondary)',
              color: 'white',
            }}
          >
            REQUEST A FREE QUOTE!
          </button>
        </div>
      </div>

      {/* Services List */}
      <div>
        <h2 className="text-xl font-serif font-semibold text-white text-center mb-6">
          SERVICES
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            'Vacuuming',
            'Mopping',
            'Dusting',
            'Surface wiping',
            'Toilets & Bathrooms',
            'Kitchen',
            'Emptying Bins',
            'Sanitising',
            'Windows & glass',
            '& Much More'
          ].map((service, idx) => (
            <motion.div
              key={idx}
              className="p-3 rounded-lg text-center text-sm transition-all duration-300 cursor-default"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.9)',
              }}
              whileHover={{ 
                backgroundColor: 'rgba(255,255,255,0.12)',
                scale: 1.05,
                borderColor: 'rgba(59,130,246,0.3)',
              }}
            >
              {service}
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-center mt-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Our experienced team is dedicated to delivering top-tier commercial cleaning Melbourne for every industry. From routine maintenance to in-depth deep cleans, we ensure every corner of your office, store, or facility is taken care of.
        </p>
        <div className="text-center mt-4">
          <button
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--theme-secondary)',
              color: 'white',
            }}
          >
            REQUEST A FREE QUOTE!
          </button>
        </div>
      </div>

      {/* Partners */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 className="text-xl font-serif font-semibold text-white mb-6">
          SOME OF OUR TRUSTED PARTNERS
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {['badd', 'brg', 'r1 auto', 'zr'].map((partner, idx) => (
            <motion.span
              key={idx}
              className="text-lg font-semibold uppercase"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              whileHover={{ 
                color: 'rgba(255,255,255,0.9)',
                scale: 1.1,
              }}
              transition={{ duration: 0.2 }}
            >
              {partner}
            </motion.span>
          ))}
          <span className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>
            + Many more
          </span>
        </div>
      </div>

      {/* Footer Banner */}
      <motion.div
        className="text-center rounded-2xl p-6"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        whileHover={{ 
          backgroundColor: 'rgba(255,255,255,0.1)',
          scale: 1.01,
        }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <span style={{ color: 'var(--theme-secondary)' }}>★</span> Get the clean freaks difference
        </p>
      </motion.div>
    </div>
  );
}