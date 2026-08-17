'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ServiceCategory = 'Residential' | 'Commercial';

const residentialData = {
  tabs: ['General Clean', 'Deep Reset Clean', 'End of Lease Cleaning'],
  tiers: [
    { 
      label: 'General Clean', 
      price: '$179', 
      description: 'Perfect for regular upkeep. Keep your place feeling fresh, organised, and stress-free every week or fortnight. Member rates apply' 
    },
    { 
      label: 'Deep Reset Clean', 
      price: '$249', 
      isPopular: true,
      description: 'For when your home needs more than a touch-up. Floors, bathrooms, kitchen, tackled top to bottom. It\'s the reset button for your space.' 
    },
    { 
      label: 'End of Lease Cleaning', 
      price: '$319', 
      description: '100% BOND RETURN GUARANTEE. Designed to get your bond back. Full vacate clean with checklist compliance. Zero stress, all sparkle.' 
    },
  ],
  addOnsLeft: [
    { name: 'Inside oven', price: '$45' },
    { name: 'Inside windows', price: '$60' },
    { name: 'Balcony / outdoor area', price: '$50' },
  ],
  addOnsRight: [
    { name: 'Inside fridge', price: '$35' },
    { name: 'Carpet steam clean (per room)', price: '$55' },
    { name: 'Garage', price: '$70' },
  ],
  faqs: [
    {
      question: 'What’s included in your residential cleaning services?',
      answer: 'Our residential cleaning services include dusting, vacuuming, mopping, surface wiping, disinfecting high-touch areas, and detailed cleaning of kitchens and bathrooms. You can also request extras like inside window cleaning or oven cleaning, depending on your home\'s needs.'
    },
    {
      question: 'How do I book residential cleaning services?',
      answer: 'Booking is quick and easy! Simply select your preferred cleaning package, choose your date and time, and confirm your booking. No payment is required at the time of booking – you only pay after the service is completed to your satisfaction.'
    },
    {
      question: 'Are your residential cleaning services customisable?',
      answer: 'Yes! We understand every home is different. You can customise your cleaning package by adding extra services, focusing on specific rooms, or scheduling regular cleans. Our team works with you to create the perfect cleaning plan for your home.'
    },
    {
      question: 'Do you provide house cleaning for specific rooms only?',
      answer: 'Absolutely! If you only need certain rooms cleaned, we can tailor our service to focus on those areas. Whether it\'s just the kitchen and bathrooms, or specific bedrooms, we\'ll create a customised plan that meets your needs.'
    },
    {
      question: 'Are your cleaners insured and background-checked?',
      answer: 'Yes, all our cleaners are fully insured, police-checked, and professionally trained. We take your safety and trust seriously, ensuring every cleaner who enters your home is reliable, trustworthy, and experienced.'
    },
    {
      question: 'Do I need to be home during the cleaning?',
      answer: 'It\'s completely up to you! Many clients prefer to be home to oversee the service, while others provide us with access instructions. We have flexible arrangements to suit your preferences and schedule.'
    }
  ]
};

const commercialData = {
  header: {
    title: 'PROFESSIONAL COMMERCIAL CLEANING MELBOURNE',
    subtitle: 'FROM JUST $199',
    description: 'We are industry-leading experts in commercial cleaning Melbourne, proudly serving clients across Victoria with reliable, professional solutions tailored to every kind of workspace.',
    subDescription: 'We take pride in making your workplace flawlessly clean with trusted commercial cleaning services that make a lasting impression.',
    rating: 'Rated 4.8 from over 1000 happy clients!'
  },
  specialisations: [
    'Office cleaning Melbourne',
    'Retail cleaning',
    'School cleaning',
    'Gym cleaning',
    'Showrooms & Warehouses',
    'Medical Centres',
    'Shopping Centres'
  ],
  features: [
    '100% Customisable tailored package',
    'Professional experienced cleaners',
    '100% police checked & insured',
    '100% satisfaction guaranteed',
    'Superior cleaning products',
    'Replenish cleaning goods',
    'Restock toiletries & more'
  ],
  services: [
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
  ],
  partners: ['badd', 'brg', 'r1 auto', 'zr']
};

export default function PricingSection() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('Residential');
  const [selectedTier, setSelectedTier] = useState<string>(residentialData.tiers[0].label);
  const [direction, setDirection] = useState(0);
  const [openResidentialFaqIndex, setOpenResidentialFaqIndex] = useState<number | null>(null);

  const handleCategoryChange = (category: ServiceCategory) => {
    if (category === activeCategory) return;
    setDirection(activeCategory === 'Residential' ? 1 : -1);
    setActiveCategory(category);
    if (category === 'Residential') {
      setSelectedTier(residentialData.tiers[0].label);
    }
    setOpenResidentialFaqIndex(null);
  };

  const toggleResidentialFaq = (index: number) => {
    setOpenResidentialFaqIndex(openResidentialFaqIndex === index ? null : index);
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
            {(Object.keys({ Residential: '', Commercial: '' }) as ServiceCategory[]).map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className="relative px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                    backgroundColor: isActive ? 'var(--theme-secondary)' : 'transparent',
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
                  openFaqIndex={openResidentialFaqIndex}
                  toggleFaq={toggleResidentialFaq}
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

function ResidentialContent({ data, selectedTier, setSelectedTier, openFaqIndex, toggleFaq }: any) {
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
        <p
          className="text-sm sm:text-base max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Takes less than 30 seconds. No payment required to book.
        </p>
      </div>

      {/* Service Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.tiers.map((tier: any) => {
          const isSelected = selectedTier === tier.label;

          return (
            <motion.div
              key={tier.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTier(tier.label)}
              className="relative cursor-pointer rounded-xl p-6 flex flex-col transition-all duration-200 border backdrop-blur-sm"
              style={{
                backgroundColor: isSelected ? 'var(--theme-secondary)' : 'rgba(255,255,255,0.1)',
                borderColor: isSelected ? 'var(--theme-secondary)' : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.1)',
              }}
            >
              {tier.isPopular && (
                <span
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap"
                  style={{
                    backgroundColor: 'var(--theme-secondary)',
                    color: 'white',
                  }}
                >
                  Most Popular
                </span>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'white' }}>
                  {tier.label}
                </h3>
                <span className="text-4xl font-serif font-bold tracking-tight block mb-3" style={{ color: 'white' }}>
                  {tier.price}
                </span>
                {tier.description && (
                  <p className="text-sm leading-relaxed" style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)' }}>
                    {tier.description}
                  </p>
                )}
              </div>

              <button
                className="mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isSelected ? 'white' : 'var(--theme-secondary)',
                  color: isSelected ? 'var(--theme-primary)' : 'white',
                }}
              >
                {isSelected ? 'Selected' : 'Choose'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div
        className="rounded-2xl p-6 sm:p-10 space-y-6 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <h2 className="text-xl font-serif font-semibold text-white text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-3">
          {data.faqs.map((faq: any, index: number) => {
            const isOpen = openFaqIndex === index;
            
            return (
              <div
                key={index}
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-white/5"
                >
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {faq.question}
                  </span>
                  <span
                    className="text-xl transition-transform duration-200 flex-shrink-0 ml-4"
                    style={{ color: 'var(--theme-secondary)' }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
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
                      <div className="px-6 pb-4">
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Book Now Banner */}
      <div
        className="text-center rounded-2xl p-6"
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <span style={{ color: 'var(--theme-secondary)' }}>★</span> Book My Clean Today!
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          BOOK NOW TO GUARANTEE THIS WEEK'S AVAILABILITY — spots filling fast
        </p>
      </div>
    </div>
  );
}

function CommercialContent({ data }: any) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">
          {data.header.title}
        </h1>
        <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-secondary)' }}>
          {data.header.subtitle}
        </p>
        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {data.header.description}
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {data.header.subDescription}
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
            {data.header.rating}
          </span>
        </div>
      </div>

      {/* Specialisations */}
      <div>
        <h2 className="text-xl font-serif font-semibold text-white text-center mb-6">
          We specialise in
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.specialisations.map((item: string, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-lg text-center text-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {item}
            </div>
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
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h2 className="text-xl font-serif font-semibold text-white text-center mb-6">
          custom cleaning PACKAGES for your workplace
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.features.map((feature: string, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-sm"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              <span style={{ color: 'var(--theme-secondary)' }}>✓</span>
              {feature}
            </div>
          ))}
        </div>
        <p className="text-sm text-center mt-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
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

      {/* Services */}
      <div>
        <h2 className="text-xl font-serif font-semibold text-white text-center mb-6">
          SERVICES
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.services.map((service: string, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-lg text-center text-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {service}
            </div>
          ))}
        </div>
        <p className="text-sm text-center mt-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
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
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h2 className="text-xl font-serif font-semibold text-white mb-6">
          SOME OF OUR TRUSTED PARTNERS
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {data.partners.map((partner: string, idx: number) => (
            <span
              key={idx}
              className="text-lg font-semibold uppercase"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {partner}
            </span>
          ))}
          <span className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
            + Many more
          </span>
        </div>
      </div>

      {/* Footer Banner */}
      <div
        className="text-center rounded-2xl p-6"
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <span style={{ color: 'var(--theme-secondary)' }}>★</span> Get the clean freaks difference
        </p>
      </div>
    </div>
  );
}