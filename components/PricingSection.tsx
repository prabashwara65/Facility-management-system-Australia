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
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="font-semibold tracking-widest text-xs uppercase theme-primary">
            Transparent Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: 'var(--theme-text)' }}>
            Fixed rates. No surprises.
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--theme-muted)' }}>
            Select your service type and property size below. All prices include GST.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <div 
            className="p-1.5 rounded-xl flex space-x-1"
            style={{ 
              backgroundColor: 'var(--theme-surface)', 
              border: '1px solid var(--theme-border)' 
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
                    color: isActive ? 'white' : 'var(--theme-muted)',
                    backgroundColor: isActive ? 'var(--theme-primary)' : 'transparent',
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4">
          {pricingTiers.map((tier) => {
            const isSelected = selectedTier === tier.beds;

            return (
              <motion.div
                key={tier.beds}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTier(tier.beds)}
                className="relative cursor-pointer rounded-xl p-6 flex flex-col justify-center items-center text-center transition-all duration-200 border"
                style={{
                  backgroundColor: isSelected ? 'var(--theme-primary)' : 'var(--theme-card)',
                  borderColor: isSelected ? 'var(--theme-primary)' : 'var(--theme-border)',
                  boxShadow: isSelected ? '0 8px 32px rgba(26,58,107,0.25)' : 'none',
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
                    color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--theme-muted)' 
                  }}
                >
                  {tier.beds}
                </span>
                <span 
                  className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
                  style={{ 
                    color: isSelected ? 'white' : 'var(--theme-text)' 
                  }}
                >
                  {tier.price}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Add-Ons */}
        <div 
          className="rounded-2xl p-6 sm:p-10 space-y-8"
          style={{ 
            backgroundColor: 'var(--theme-card)', 
            border: '1px solid var(--theme-border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <h3 
            className="text-xl font-serif font-semibold"
            style={{ color: 'var(--theme-text)' }}
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
                    borderColor: 'var(--theme-border)',
                  }}
                >
                  <span style={{ color: 'var(--theme-text)' }}>{item.name}</span>
                  <span 
                    className="font-bold font-serif text-base"
                    style={{ color: 'var(--theme-primary)' }}
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
                    borderColor: 'var(--theme-border)',
                  }}
                >
                  <span style={{ color: 'var(--theme-text)' }}>{item.name}</span>
                  <span 
                    className="font-bold font-serif text-base"
                    style={{ color: 'var(--theme-primary)' }}
                  >
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p 
            className="text-xs pt-2"
            style={{ color: 'var(--theme-muted)' }}
          >
            * Prices are indicative and may vary based on property condition and size. All prices include GST.
          </p>
        </div>
      </div>
    </section>
  );
}