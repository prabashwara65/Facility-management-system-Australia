'use client';

import { useSyncExternalStore } from 'react';

export type ServiceCategory = 'Residential' | 'Commercial';
export type ContentStatus = 'Active' | 'Inactive' | 'Draft';

export interface ContactInfo {
  phone: string;
  email: string;
  serviceArea: string;
  hours: string;
  guarantee: {
    title: string;
    description: string;
  };
}

export interface PricingTier {
  id: number;
  label: string;
  price: string;
  description: string;
  isPopular: boolean;
  category: ServiceCategory;
  bookings: number;
  rating: number;
  status: ContentStatus;
}

export interface PricingAddOn {
  id: number;
  name: string;
  price: string;
  category: ServiceCategory;
  side: 'left' | 'right';
}

export interface PricingFAQ {
  id: number;
  question: string;
  answer: string;
  category: ServiceCategory;
}

export interface PricingContent {
  tiers: PricingTier[];
  addOns: PricingAddOn[];
  faqs: PricingFAQ[];
}

export interface PromiseFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
  status: ContentStatus;
  order: number;
}

export const CONTACT_INFO_STORAGE_KEY = 'sparkwell:contact-info';
export const PRICING_STORAGE_KEY = 'sparkwell:pricing';
export const PROMISE_STORAGE_KEY = 'sparkwell:promise';

export const defaultContactInfo: ContactInfo = {
  phone: '1800 123 456',
  email: 'hello@sparkwell.com.au',
  serviceArea: 'Melbourne, VIC',
  hours: 'Mon-Sat, 7am-6pm',
  guarantee: {
    title: 'Bond-Back Guarantee',
    description: "If your property manager isn't satisfied, we return free of charge. That's our promise.",
  },
};

export const defaultPricingContent: PricingContent = {
  tiers: [
    {
      id: 1,
      label: 'General Clean',
      price: '$179',
      description: 'Perfect for regular upkeep. Keep your place feeling fresh, organised, and stress-free every week or fortnight. Member rates apply',
      isPopular: false,
      category: 'Residential',
      bookings: 156,
      rating: 4.8,
      status: 'Active',
    },
    {
      id: 2,
      label: 'Deep Reset Clean',
      price: '$249',
      description: "For when your home needs more than a touch-up. Floors, bathrooms, kitchen, tackled top to bottom. It's the reset button for your space.",
      isPopular: true,
      category: 'Residential',
      bookings: 98,
      rating: 4.9,
      status: 'Active',
    },
    {
      id: 3,
      label: 'End of Lease Cleaning',
      price: '$319',
      description: '100% BOND RETURN GUARANTEE. Designed to get your bond back. Full vacate clean with checklist compliance. Zero stress, all sparkle.',
      isPopular: false,
      category: 'Residential',
      bookings: 234,
      rating: 4.7,
      status: 'Active',
    },
    {
      id: 4,
      label: 'Office Clean',
      price: '$199',
      description: 'Professional office cleaning for workspaces up to 3 rooms. Daily or weekly service available.',
      isPopular: false,
      category: 'Commercial',
      bookings: 67,
      rating: 4.6,
      status: 'Active',
    },
    {
      id: 5,
      label: 'Retail Clean',
      price: '$299',
      description: 'Specialised retail space cleaning to keep your shop floor and displays spotless.',
      isPopular: true,
      category: 'Commercial',
      bookings: 45,
      rating: 4.8,
      status: 'Active',
    },
    {
      id: 6,
      label: 'Warehouse Clean',
      price: '$399',
      description: 'Complete warehouse and industrial space cleaning with heavy-duty equipment.',
      isPopular: false,
      category: 'Commercial',
      bookings: 23,
      rating: 4.5,
      status: 'Draft',
    },
  ],
  addOns: [
    { id: 1, name: 'Inside oven', price: '$45', category: 'Residential', side: 'left' },
    { id: 2, name: 'Inside windows', price: '$60', category: 'Residential', side: 'left' },
    { id: 3, name: 'Balcony / outdoor area', price: '$50', category: 'Residential', side: 'left' },
    { id: 4, name: 'Inside fridge', price: '$35', category: 'Residential', side: 'right' },
    { id: 5, name: 'Carpet steam clean (per room)', price: '$55', category: 'Residential', side: 'right' },
    { id: 6, name: 'Garage', price: '$70', category: 'Residential', side: 'right' },
    { id: 7, name: 'Washroom sanitising', price: '$45', category: 'Commercial', side: 'left' },
    { id: 8, name: 'Window cleaning', price: '$90', category: 'Commercial', side: 'left' },
    { id: 9, name: 'After-hours clean', price: '$60', category: 'Commercial', side: 'left' },
    { id: 10, name: 'Carpet treatment', price: '$80', category: 'Commercial', side: 'right' },
    { id: 11, name: 'Deep kitchen detail', price: '$95', category: 'Commercial', side: 'right' },
    { id: 12, name: 'Strata common area', price: '$120', category: 'Commercial', side: 'right' },
  ],
  faqs: [
    {
      id: 1,
      question: "What's included in your residential cleaning services?",
      answer: "Our residential cleaning services include dusting, vacuuming, mopping, surface wiping, disinfecting high-touch areas, and detailed cleaning of kitchens and bathrooms. You can also request extras like inside window cleaning or oven cleaning, depending on your home's needs.",
      category: 'Residential',
    },
    {
      id: 2,
      question: 'How do I book residential cleaning services?',
      answer: 'Booking is quick and easy! Simply select your preferred cleaning package, choose your date and time, and confirm your booking. No payment is required at the time of booking - you only pay after the service is completed to your satisfaction.',
      category: 'Residential',
    },
    {
      id: 3,
      question: 'Are your residential cleaning services customisable?',
      answer: 'Yes! We understand every home is different. You can customise your cleaning package by adding extra services, focusing on specific rooms, or scheduling regular cleans. Our team works with you to create the perfect cleaning plan for your home.',
      category: 'Residential',
    },
    {
      id: 4,
      question: 'Do you provide house cleaning for specific rooms only?',
      answer: "Absolutely! If you only need certain rooms cleaned, we can tailor our service to focus on those areas. Whether it's just the kitchen and bathrooms, or specific bedrooms, we'll create a customised plan that meets your needs.",
      category: 'Residential',
    },
    {
      id: 5,
      question: 'Are your cleaners insured and background-checked?',
      answer: 'Yes, all our cleaners are fully insured, police-checked, and professionally trained. We take your safety and trust seriously, ensuring every cleaner who enters your home is reliable, trustworthy, and experienced.',
      category: 'Residential',
    },
    {
      id: 6,
      question: 'Do I need to be home during the cleaning?',
      answer: "It's completely up to you! Many clients prefer to be home to oversee the service, while others provide us with access instructions. We have flexible arrangements to suit your preferences and schedule.",
      category: 'Residential',
    },
    {
      id: 7,
      question: 'What commercial cleaning services do you offer?',
      answer: 'We offer comprehensive commercial cleaning services including office cleaning, retail cleaning, school cleaning, gym cleaning, showroom cleaning, medical centre cleaning, and shopping centre cleaning.',
      category: 'Commercial',
    },
    {
      id: 8,
      question: 'How often do you provide commercial cleaning?',
      answer: 'We offer flexible scheduling options including nightly, weekly, fortnightly, or monthly cleans. We can also accommodate deep cleans and one-time special events.',
      category: 'Commercial',
    },
    {
      id: 9,
      question: 'Are your commercial cleaners insured and background-checked?',
      answer: 'Yes, absolutely. All our cleaners are 100% police checked, insured, and professionally trained. We take security and trust very seriously, ensuring your workplace and assets are always in safe hands.',
      category: 'Commercial',
    },
    {
      id: 10,
      question: 'Do you provide cleaning supplies and equipment for commercial spaces?',
      answer: 'Yes, we come fully equipped with superior cleaning products, professional-grade equipment, and all necessary supplies. We can also replenish cleaning goods and restock toiletries as part of our service.',
      category: 'Commercial',
    },
    {
      id: 11,
      question: 'Can I customise my commercial cleaning package?',
      answer: 'Absolutely! Our commercial cleaning packages are 100% customisable. We work with you to create a tailored cleaning plan that fits your specific needs, schedule, and budget. You can add or remove services as needed.',
      category: 'Commercial',
    },
  ],
};

export const defaultPromiseFeatures: PromiseFeature[] = [
  {
    id: 1,
    icon: 'ShieldCheck',
    title: '48-Hour Re-Clean Guarantee',
    description: 'Not happy? We return within 48 hours at no extra cost, no questions asked.',
    status: 'Active',
    order: 1,
  },
  {
    id: 2,
    icon: 'FileCheck2',
    title: 'Fully Insured & Bonded',
    description: 'All cleaners carry $10M public liability insurance for complete peace of mind.',
    status: 'Active',
    order: 2,
  },
  {
    id: 3,
    icon: 'UserCheck',
    title: 'Vetted & Background-Checked',
    description: 'Every team member passes a national police check before joining our crew.',
    status: 'Active',
    order: 3,
  },
  {
    id: 4,
    icon: 'Tag',
    title: 'Fixed, Transparent Pricing',
    description: 'No hidden fees. Your quoted price is what you pay - always.',
    status: 'Active',
    order: 4,
  },
  {
    id: 5,
    icon: 'Leaf',
    title: 'Eco-Friendly Products',
    description: 'We use hospital-grade, biodegradable cleaning products safe for kids and pets.',
    status: 'Active',
    order: 5,
  },
  {
    id: 6,
    icon: 'Plane',
    title: 'No Travel Fees',
    description: 'Free travel within our service area - Melbourne metro and inner suburbs.',
    status: 'Active',
    order: 6,
  },
];

const listeners = new Set<() => void>();

function emitStoreChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function readSiteContent<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? { ...fallback, ...JSON.parse(storedValue) } : fallback;
  } catch {
    return fallback;
  }
}

export function writeSiteContent<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(key, JSON.stringify(value));
  emitStoreChange();
}

export function useSiteContent<T>(key: string, fallback: T): [T, (value: T) => void] {
  const getSnapshot = () => JSON.stringify(readSiteContent(key, fallback));
  const getServerSnapshot = () => JSON.stringify(fallback);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = JSON.parse(snapshot) as T;

  return [value, (nextValue) => writeSiteContent(key, nextValue)];
}
