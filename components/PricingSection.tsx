'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type ServiceType = 'End of Lease' | 'Deep Clean' | 'Regular Clean';

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
    <section 
      id="pricing" 
      className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans"
      style={{ 
        backgroundColor: 'var(--theme-primary)',
        color: 'var(--theme-text)'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span 
            className="font-semibold tracking-widest text-xs uppercase"
            style={{ color: 'var(--theme-secondary)' }}
          >
            Transparent Pricing
          </span>
          <h2 
            className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white"
          >
            Fixed rates. No surprises.
          </h2>
          <p 
            className="text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Select your service type and property size below. All prices include GST.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div 
            className="p-1.5 rounded-xl flex space-x-1"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.08)', 
              border: '1px solid rgba(255,255,255,0.08)' 
            }}
          >
            {serviceTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                    backgroundColor: isActive ? 'var(--theme-secondary)' : 'transparent',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Tiers - Using rgba(255,255,255,0.1) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4">
          {pricingTiers.map((tier) => {
            const isSelected = selectedTier === tier.beds;

            return (
              <motion.div
                key={tier.beds}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTier(tier.beds)}
                className="relative cursor-pointer rounded-xl p-6 flex flex-col justify-center items-center text-center transition-all duration-200 border backdrop-blur-sm"
                style={{
                  backgroundColor: isSelected ? 'var(--theme-secondary)' : 'rgba(255,255,255,0.1)',
                  borderColor: isSelected ? 'var(--theme-secondary)' : 'rgba(255,255,255,0.08)',
                  boxShadow: isSelected ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.1)',
                }}
              >
                {tier.isPopular && (
                  <span 
                    className="absolute -top-3 text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-sm"
                    style={{ 
                      backgroundColor: 'var(--theme-secondary)', 
                      color: 'white' 
                    }}
                  >
                    Most Popular
                  </span>
                )}

                <span 
                  className="text-xs font-medium mb-2"
                  style={{ 
                    color: isSelected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)' 
                  }}
                >
                  {tier.beds}
                </span>
                <span 
                  className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
                  style={{ 
                    color: isSelected ? 'white' : 'white' 
                  }}
                >
                  {tier.price}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Add-Ons - Using rgba(255,255,255,0.1) */}
        <div 
          className="rounded-2xl p-6 sm:p-10 space-y-8 backdrop-blur-sm"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <h3 
            className="text-xl font-serif font-semibold text-white"
          >
            Optional Add-Ons
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              {addOnsLeft.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between py-3 border-b"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.name}</span>
                  <span 
                    className="font-bold font-serif text-base"
                    style={{ color: 'var(--theme-secondary)' }}
                  >
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {addOnsRight.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between py-3 border-b"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.name}</span>
                  <span 
                    className="font-bold font-serif text-base"
                    style={{ color: 'var(--theme-secondary)' }}
                  >
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p 
            className="text-xs pt-2"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            * Prices are indicative and may vary based on property condition and size. All prices include GST.
          </p>
        </div>
      </div>
    </section>
  );
}