'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Check,
  Car,
  Truck,
  Warehouse,
  Bus,
  Shield,
  Clock,
  MapPin,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/app/context/ThemeProvider'; 

interface Service {
  id: number;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  popular?: boolean;
  description: string;
  exterior: string[];
  interior: string[];
  vehicleType: 'car' | 'truck' | 'van' | 'suv' | 'all';
}

const services: Service[] = [
  {
    id: 1,
    name: 'Premium Detail Package',
    price: '$229',
    rating: 4.72,
    reviews: 23770,
    popular: true,
    description: 'Our signature auto detailing package with comprehensive INTERIOR and EXTERIOR services including shampoo and high quality wax.',
    vehicleType: 'car',
    exterior: [
      'Full wash wheels & tires',
      'Windows',
      'Clay bar',
      'Hand wax'
    ],
    interior: [
      'Vacuum',
      'UV protector',
      'Shampoo',
      'Deep clean windows'
    ]
  },
  {
    id: 2,
    name: 'Express Detail Package',
    price: '$169',
    rating: 4.75,
    reviews: 11963,
    description: 'Combines the complete EXTERIOR detail and hand wax with Interior vacuum, wipe down, and leather/vinyl dressings',
    vehicleType: 'car',
    exterior: [
      'Full wash wheels & tires',
      'Windows',
      'Clay bar',
      'Hand wax'
    ],
    interior: [
      'Vacuum',
      'Leather conditioner',
      'UV protector',
      'Windows'
    ]
  },
  {
    id: 3,
    name: 'Titanium Detail Package',
    price: '$419',
    rating: 4.68,
    reviews: 1648,
    description: 'Our most thorough detailing package for your vehicle! A complete exterior detail with single pass compounding/buffing paint correction combined with a full interior detailing.',
    vehicleType: 'car',
    exterior: [
      'Buffing',
      'Full wash',
      'Clay bar',
      'Hand wax',
      'Wheels & tires',
      'Windows'
    ],
    interior: [
      'Vacuum',
      'Deep clean',
      'Shampoo',
      'Head liner',
      'UV protector'
    ]
  },
  {
    id: 4,
    name: 'Truck & SUV Detail',
    price: '$349',
    rating: 4.67,
    reviews: 467,
    description: 'All of the exterior services in the FULL Titanium detail package for trucks and SUVs.',
    vehicleType: 'truck',
    exterior: [
      'Compounding',
      'Buffing',
      'Full wash',
      'Clay bar',
      'Hand wax',
      'Wheels & tires',
      'Windows'
    ],
    interior: [
      'Vacuum',
      'Deep clean',
      'Shampoo',
      'UV protector'
    ]
  },
  {
    id: 5,
    name: 'Interior Only Detail',
    price: '$169',
    rating: 4.73,
    reviews: 13773,
    description: 'INTERIOR ONLY detailing package including vacuum, shampoo, deep cleaning and leather/vinyl dressings.',
    vehicleType: 'car',
    exterior: [],
    interior: [
      'Vacuum',
      'Deep clean',
      'Shampoo',
      'Head liner',
      'UV protector'
    ]
  },
  {
    id: 6,
    name: 'Van Detail Package',
    price: '$299',
    rating: 4.71,
    reviews: 893,
    description: 'Complete interior and exterior detailing for vans and cargo vehicles.',
    vehicleType: 'van',
    exterior: [
      'Full wash',
      'Wheels & tires',
      'Windows',
      'Hand wax'
    ],
    interior: [
      'Vacuum',
      'Deep clean',
      'Shampoo',
      'UV protector',
      'Cargo area clean'
    ]
  },
  {
    id: 7,
    name: 'SUV Premium Detail',
    price: '$379',
    rating: 4.69,
    reviews: 1234,
    popular: true,
    description: 'Premium detailing package specifically designed for SUVs with extra attention to cargo areas and third-row seating.',
    vehicleType: 'suv',
    exterior: [
      'Full wash',
      'Wheels & tires',
      'Windows',
      'Clay bar',
      'Hand wax'
    ],
    interior: [
      'Vacuum',
      'Deep clean',
      'Shampoo',
      'UV protector',
      'Cargo area clean',
      'Third-row clean'
    ]
  }
];

const vehicleTypes = [
  { id: 'all', label: 'All Vehicles', icon: Car },
  { id: 'car', label: 'Cars', icon: Car },
  { id: 'truck', label: 'Trucks', icon: Truck },
  { id: 'van', label: 'Vans', icon: Warehouse },
  { id: 'suv', label: 'SUVs', icon: Bus },
];

export default function MobileDetailing() {
  const { currentTheme } = useTheme(); // Get the current theme
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const filteredServices = services.filter(
    service => selectedVehicle === 'all' || service.vehicleType === selectedVehicle
  );

  const toggleExpand = (id: number) => {
    setExpandedService(expandedService === id ? null : id);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : i < rating 
                  ? 'fill-yellow-400/50 text-yellow-400/50' 
                  : 'fill-gray-600 text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  // Get theme colors for dynamic styling
  const primaryColor = currentTheme.colors[1];
  const secondaryColor = currentTheme.colors[2];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-theme-bg text-theme-text pt-20">
        {/* Hero Section */}
        <div 
          className="relative border-b border-theme-border"
          style={{ 
            background: `linear-gradient(to right, ${primaryColor}40, ${secondaryColor}40)`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-hero-text mb-4">
                Professional <span style={{ color: secondaryColor }}>Mobile Detailing</span>
              </h1>
              <p className="text-lg sm:text-xl text-hero-text-secondary max-w-3xl mx-auto mb-6">
                We detail everything! Choose from a variety of packages to fit your needs and budget. 
                All packages come with our exclusive service guarantee.
              </p>
              <div className="flex items-center justify-center gap-3 text-hero-text-secondary">
                <Phone className="w-5 h-5" style={{ color: secondaryColor }} />
                <span>Questions? Call us at <a href="tel:1800123456" className="hover:underline" style={{ color: secondaryColor }}>1800 123 456</a></span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Type Filter */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {vehicleTypes.map((type) => {
              const Icon = type.icon;
              const isActive = selectedVehicle === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedVehicle(type.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-theme-panel border-theme-border text-theme-muted hover:bg-theme-soft hover:text-theme-text'
                  }`}
                  style={
                    isActive
                      ? { 
                          backgroundColor: primaryColor, 
                          borderColor: secondaryColor,
                          boxShadow: `0 8px 32px ${primaryColor}40`
                        }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Cards - Flex Row */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-wrap gap-6 justify-center">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: service.id * 0.05 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] xl:w-[calc(25%-18px)]"
              >
                <div 
                  className="bg-theme-card backdrop-blur-sm border border-theme-border rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:shadow-xl"
                  style={{ 
                    boxShadow: `0 4px 24px ${primaryColor}10`,
                    '--hover-shadow': `${secondaryColor}20`
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = secondaryColor;
                    e.currentTarget.style.boxShadow = `0 8px 40px ${secondaryColor}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = `0 4px 24px ${primaryColor}10`;
                  }}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Title & Price */}
                  <h3 className="text-xl font-bold text-theme-text mb-1">{service.name}</h3>
                  <p className="text-2xl font-bold" style={{ color: secondaryColor }}>{service.price}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(service.rating)}
                    <span className="text-theme-muted text-sm">({service.reviews.toLocaleString()})</span>
                  </div>

                  {/* Description */}
                  <p className="text-theme-text/80 text-sm mb-4 flex-grow">{service.description}</p>

                  {/* Service Highlights */}
                  <div className="space-y-2 mb-4">
                    {service.exterior.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: secondaryColor }}>Exterior</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {service.exterior.slice(0, 4).map((item, idx) => (
                            <span key={idx} className="text-xs bg-theme-panel px-2 py-1 rounded-full text-theme-text/80">
                              {item}
                            </span>
                          ))}
                          {service.exterior.length > 4 && (
                            <span className="text-xs text-theme-muted">+{service.exterior.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    {service.interior.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>Interior</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {service.interior.slice(0, 4).map((item, idx) => (
                            <span key={idx} className="text-xs bg-theme-panel px-2 py-1 rounded-full text-theme-text/80">
                              {item}
                            </span>
                          ))}
                          {service.interior.length > 4 && (
                            <span className="text-xs text-theme-muted">+{service.interior.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Full Details Button */}
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className="mt-auto flex items-center justify-center gap-2 transition-colors text-sm font-medium py-2 border-t border-theme-border pt-3"
                    style={{ color: secondaryColor }}
                    onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = secondaryColor}
                  >
                    {expandedService === service.id ? 'Hide Details' : 'View Full Details'}
                    {expandedService === service.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedService === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-theme-border mt-3 space-y-4">
                          {service.exterior.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2" style={{ color: secondaryColor }}>Exterior Services</h4>
                              <ul className="space-y-1">
                                {service.exterior.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-theme-text/80">
                                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {service.interior.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2" style={{ color: primaryColor }}>Interior Services</h4>
                              <ul className="space-y-1">
                                {service.interior.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-theme-text/80">
                                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-theme-muted text-lg">No services available for this vehicle type.</p>
            </div>
          )}
        </div>

        {/* Trust Section */}
        <div className="bg-theme-panel border-t border-theme-border py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: secondaryColor }} />
                <p className="text-theme-text font-semibold">100% Satisfaction</p>
                <p className="text-theme-muted text-sm">Guaranteed</p>
              </div>
              <div>
                <Award className="w-8 h-8 mx-auto mb-3" style={{ color: secondaryColor }} />
                <p className="text-theme-text font-semibold">Fully Insured</p>
                <p className="text-theme-muted text-sm">& Bonded</p>
              </div>
              <div>
                <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: secondaryColor }} />
                <p className="text-theme-text font-semibold">We Come to You</p>
                <p className="text-theme-muted text-sm">Mobile Service</p>
              </div>
              <div>
                <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: secondaryColor }} />
                <p className="text-theme-text font-semibold">Melbourne Metro</p>
                <p className="text-theme-muted text-sm">No Travel Fees</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className="py-12"
          style={{ 
            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Your Vehicle Detailed?</h2>
            <p className="text-white/80 mb-6">Book online in minutes. We come to you!</p>
            <Link
              href="/booking"
              className="inline-block bg-white hover:bg-blue-50 px-8 py-3 rounded-full font-bold transition-colors"
              style={{ color: primaryColor }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}