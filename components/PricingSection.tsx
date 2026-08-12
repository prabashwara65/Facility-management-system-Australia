'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Service Types
type ServiceType = 'End of Lease' | 'Deep Clean' | 'Regular Clean';

// Bedroom Options Interface
interface TierOption {
  beds: string;
  price: string;
  isPopular?: boolean;
}

const serviceTabs: ServiceType[] = ['End of Lease', 'Deep Clean', 'Regular Clean'];

const pricingTiers: TierOption[] = [
  { beds: '1 Bed', price: '$99' },
  { beds: '2 Bed', price: '$129' },
  { beds: '3 Bed', price: '$159', isPopular: true },
  { beds: '4 Bed', price: '$189' },
  { beds: '5+ Bed', price: 'POA' },
];

const addOnsLeft = [
  { name: 'Inside oven', price: '$45' },
  { name: 'Inside windows', price: '$60' },
  { name: 'Balcony / outdoor area', price: '$50' },
];

const addOnsRight = [
  { name: 'Inside fridge', price: '$35' },
  { name: 'Carpet steam clean (per room)', price: '$55' },
  { name: 'Garage', price: '$70' },
];

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState<ServiceType>('Regular Clean');
  const [selectedTier, setSelectedTier] = useState<string>('3 Bed');

  return (
    <section className="w-full bg-[#16233b] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-amber-500 font-semibold tracking-widest text-xs uppercase">
            Transparent Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight">
            Fixed rates. No surprises.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
            Select your service type and property size below. All prices include GST.
          </p>
        </div>

        {/* Service Type Toggle Tabs */}
        <div className="flex justify-center">
          <div className="bg-[#21304d] p-1.5 rounded-xl flex space-x-1 border border-white/5">
            {serviceTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 z-10 ${
                    isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-[#d4a340] rounded-lg -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bedroom Pricing Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4">
          {pricingTiers.map((tier) => {
            const isSelected = selectedTier === tier.beds;

            return (
              <motion.div
                key={tier.beds}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTier(tier.beds)}
                className={`relative cursor-pointer rounded-xl p-6 flex flex-col justify-center items-center text-center transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#d4a340] text-white border-[#d4a340] shadow-xl'
                    : 'bg-[#233352]/60 hover:bg-[#233352] text-white border-white/10'
                }`}
              >
                {/* Most Popular Badge */}
                {tier.isPopular && (
                  <span className="absolute -top-3 bg-[#1e8a56] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <span
                  className={`text-xs font-medium mb-2 ${
                    isSelected ? 'text-amber-100' : 'text-gray-300'
                  }`}
                >
                  {tier.beds}
                </span>
                <span className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                  {tier.price}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Optional Add-Ons Box */}
        <div className="bg-[#21304d]/70 rounded-2xl p-6 sm:p-10 border border-white/10 space-y-8">
          <h3 className="text-xl font-serif font-semibold text-white">
            Optional Add-Ons
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {/* Left Add-ons Column */}
            <div className="space-y-4">
              {addOnsLeft.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-white/10 text-sm"
                >
                  <span className="text-gray-300 font-medium">{item.name}</span>
                  <span className="text-amber-400 font-bold font-serif text-base">{item.price}</span>
                </div>
              ))}
            </div>

            {/* Right Add-ons Column */}
            <div className="space-y-4">
              {addOnsRight.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-white/10 text-sm"
                >
                  <span className="text-gray-300 font-medium">{item.name}</span>
                  <span className="text-amber-400 font-bold font-serif text-base">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 pt-2">
            * Prices are indicative and may vary based on property condition and size. All prices include GST.
          </p>
        </div>
      </div>
    </section>
  );
}