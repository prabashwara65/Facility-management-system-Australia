'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Home, Bath, Sparkles, Clock, Check, ArrowRight } from 'lucide-react';

interface ServiceOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
  popular?: boolean;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'end-of-lease',
    name: 'End of Lease',
    icon: <Home className="w-5 h-5" />,
    price: 299,
    description: 'Complete bond back cleaning',
    popular: true,
  },
  {
    id: 'deep-clean',
    name: 'Deep Clean',
    icon: <Sparkles className="w-5 h-5" />,
    price: 199,
    description: 'Thorough deep cleaning',
  },
  {
    id: 'regular-clean',
    name: 'Regular Clean',
    icon: <Clock className="w-5 h-5" />,
    price: 149,
    description: 'Standard maintenance clean',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    icon: <Bath className="w-5 h-5" />,
    price: 399,
    description: 'Office & commercial spaces',
  },
];

const addOns: AddOn[] = [
  { id: 'window', name: 'Window Cleaning', price: 50, description: 'Interior & exterior windows' },
  { id: 'carpet', name: 'Carpet Steam Clean', price: 80, description: 'Deep carpet cleaning' },
  { id: 'oven', name: 'Oven Cleaning', price: 45, description: 'Professional oven clean' },
  { id: 'fridge', name: 'Fridge Cleaning', price: 35, description: 'Deep fridge clean' },
];

export default function PriceCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('end-of-lease');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when calculator is open
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectedServiceData = serviceOptions.find(s => s.id === selectedService);
  const basePrice = selectedServiceData?.price || 0;
  const addOnsTotal = selectedAddOns.reduce((total, id) => {
    const addOn = addOns.find(a => a.id === id);
    return total + (addOn?.price || 0);
  }, 0);
  const totalPrice = basePrice + addOnsTotal;

  const handleBookNow = () => {
    setIsOpen(false);
    // Navigate to booking section
    const bookingSection = document.querySelector('#booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full shadow-2xl text-white font-bold group"
        style={{ backgroundColor: 'var(--theme-primary)' }}
        whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <Calculator className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Calculate Price</span>
        <span className="sm:hidden">Price</span>
      </motion.button>

      {/* Calculator Panel */}
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[540px] bg-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg text-white"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                  >
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Price Calculator</h2>
                    <p className="text-xs text-gray-500">Get an instant estimate</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                {/* Service Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Service</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceOptions.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                          selectedService === service.id
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg transition-colors ${
                              selectedService === service.id
                                ? 'text-white'
                                : 'text-gray-500'
                            }`}
                            style={{
                              backgroundColor: selectedService === service.id ? 'var(--theme-primary)' : '#f3f4f6'
                            }}>
                              {service.icon}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{service.name}</div>
                              <div className="text-xs text-gray-500">{service.description}</div>
                            </div>
                          </div>
                          {service.popular && (
                            <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full absolute -top-1 -right-1">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-right">
                          <span className="text-lg font-bold" style={{ color: 'var(--theme-primary)' }}>
                            ${service.price}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Add-on Services</h3>
                  <div className="space-y-2">
                    {addOns.map((addOn) => (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn.id)}
                        className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                          selectedAddOns.includes(addOn.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedAddOns.includes(addOn.id)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedAddOns.includes(addOn.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-gray-900">{addOn.name}</div>
                            <div className="text-xs text-gray-500">{addOn.description}</div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-700">+${addOn.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Service</span>
                    <span className="font-medium text-gray-900">${basePrice}</span>
                  </div>
                  {selectedAddOns.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Add-ons ({selectedAddOns.length})</span>
                      <span className="font-medium text-gray-900">+${addOnsTotal}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total Estimate</span>
                    <div>
                      <span className="text-xs text-gray-400 line-through mr-2">
                        {totalPrice > 0 && totalPrice < 400 ? `$${Math.round(totalPrice * 1.2)}` : ''}
                      </span>
                      <span className="text-2xl font-bold" style={{ color: 'var(--theme-primary)' }}>
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                  {totalPrice > 0 && (
                    <div className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-center">
                      ✓ Save up to 20% on combined services
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <motion.button
                    onClick={handleBookNow}
                    className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Trust Badge */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1 flex-wrap justify-center">
                      <span className="text-green-500">✓</span> No obligation
                      <span className="mx-1">•</span>
                      <span className="text-green-500">✓</span> Free quote
                      <span className="mx-1">•</span>
                      <span className="text-green-500">✓</span> 100% satisfaction
                      <span className="mx-1">•</span>
                      <span className="text-green-500">✓</span> Insured & bonded
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}