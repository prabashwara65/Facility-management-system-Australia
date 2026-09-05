'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Check, Plus, Minus, Sparkles, Home, Bath, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type ServiceCategory = 'Residential' | 'Commercial';

interface Tier {
  id: number;
  label: string;
  price: string;
  description: string;
  isPopular: boolean;
  category: ServiceCategory;
  bookings: number;
  rating: number;
  status: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: ServiceCategory;
}

interface AddOn {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  selected?: boolean;
}

interface DisplayAddOn {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
}

interface SelectedBookingAddOn {
  name: string;
  price: string;
}

interface ResidentialBookingData {
  selectedTier?: string;
  selectedAddOns?: string[];
  category?: string;
  timestamp: string;
  service?: string;
  price?: string;
  addons?: SelectedBookingAddOn[];
  finalized?: boolean;
}

const isSelectedBookingAddOn = (addOn: SelectedBookingAddOn | null): addOn is SelectedBookingAddOn => addOn !== null;

const defaultTiers: Tier[] = [
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
    description: 'For when your home needs more than a touch-up. Floors, bathrooms, kitchen, tackled top to bottom. It\'s the reset button for your space.',
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
];

const defaultFAQs: FAQ[] = [
  {
    id: 1,
    question: 'What\'s included in your residential cleaning services?',
    answer: 'Our residential cleaning services include dusting, vacuuming, mopping, surface wiping, disinfecting high-touch areas, and detailed cleaning of kitchens and bathrooms. You can also request extras like inside window cleaning or oven cleaning, depending on your home\'s needs.',
    category: 'Residential',
  },
  {
    id: 2,
    question: 'Do you bring your own cleaning supplies?',
    answer: 'Yes, we bring all necessary cleaning supplies and equipment. We also offer eco-friendly green supplies upon request.',
    category: 'Residential',
  },
  {
    id: 3,
    question: 'How much do you charge for residential cleaning?',
    answer: 'Our residential cleaning services start from $179 for a General Clean, with prices varying based on the size of your home and the scope of work. We offer transparent, upfront pricing with no hidden costs.',
    category: 'Residential',
  },
  {
    id: 4,
    question: 'Do you offer commercial cleaning services?',
    answer: 'Yes, we offer comprehensive commercial cleaning services for offices, retail spaces, warehouses, gyms, and medical centres. Our commercial packages start from $199 and are fully customizable.',
    category: 'Commercial',
  },
  {
    id: 5,
    question: 'What areas do you service?',
    answer: 'We service across Melbourne and surrounding suburbs. We offer both residential and commercial cleaning services throughout the metropolitan area.',
    category: 'Residential',
  },
  {
    id: 6,
    question: 'How do I book a cleaning service?',
    answer: 'You can book our services online through our booking system. Select your preferred package, add any extras, choose your date, and fill in your details. It takes less than 30 seconds.',
    category: 'Residential',
  },
];

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  'Carpet & Upholstery': <Home className="w-4 h-4" />,
  'Kitchen Add-ons': <Bath className="w-4 h-4" />,
  'Whole Home': <Sparkles className="w-4 h-4" />,
  'Deep Detail': <Clock className="w-4 h-4" />,
};

// Storage key for residential booking
const RESIDENTIAL_BOOKING_KEY = 'residential_booking_data';
const RESIDENTIAL_BOOKING_EVENT = 'residential-booking-updated';

const saveToLocalStorage = (data: ResidentialBookingData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RESIDENTIAL_BOOKING_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(RESIDENTIAL_BOOKING_EVENT, { detail: data }));
  }
};

const loadFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(RESIDENTIAL_BOOKING_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const INITIAL_ADDON_CATEGORY = 'Carpet & Upholstery';

export default function PricingSection() {
  const [pricingData, setPricingData] = useState<{
    tiers: Tier[];
    faqs: FAQ[];
    addOns: AddOn[];
  }>({
    tiers: [],
    faqs: [],
    addOns: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('Residential');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [direction, setDirection] = useState(0);
  const [isFaqSectionOpen, setIsFaqSectionOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [expandedAddOnCategory, setExpandedAddOnCategory] = useState<string | null>(INITIAL_ADDON_CATEGORY);
  const [selectedTierData, setSelectedTierData] = useState<Tier | null>(null);
  const [allAddOns, setAllAddOns] = useState<AddOn[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const supabase = createClient();

  // Load pricing data from Supabase
  useEffect(() => {
    const loadPricingData = async () => {
      try {
        setLoading(true);

        // Load tiers
        const { data: tiersData, error: tiersError } = await supabase
          .from('pricing_tiers')
          .select('*')
          .eq('status', 'Active')
          .order('sort_order', { ascending: true });

        if (tiersError) {
          console.error('Error loading tiers:', tiersError);
          setPricingData(prev => ({
            ...prev,
            tiers: defaultTiers,
          }));
        } else {
          setPricingData(prev => ({
            ...prev,
            tiers: tiersData && tiersData.length > 0 ? tiersData : defaultTiers,
          }));
        }

        // Load FAQs
        const { data: faqsData, error: faqsError } = await supabase
          .from('faqs')
          .select('*')
          .order('sort_order', { ascending: true });

        if (faqsError) {
          console.error('Error loading FAQs:', faqsError);
          setPricingData(prev => ({
            ...prev,
            faqs: defaultFAQs,
          }));
        } else {
          setPricingData(prev => ({
            ...prev,
            faqs: faqsData && faqsData.length > 0 ? faqsData : defaultFAQs,
          }));
        }

        // Load Add-ons from database
        const { data: addOnsData, error: addOnsError } = await supabase
          .from('addons')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (addOnsError) {
          console.error('Error loading add-ons:', addOnsError);
          setPricingData(prev => ({
            ...prev,
            addOns: [],
          }));
        } else {
          setPricingData(prev => ({
            ...prev,
            addOns: addOnsData || [],
          }));
          setAllAddOns(addOnsData || []);
        }
      } catch (error) {
        console.error('Error loading pricing data:', error);
        setPricingData({
          tiers: defaultTiers,
          faqs: defaultFAQs,
          addOns: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadPricingData();
  }, []);

  // Load saved data from local storage
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setSelectedTier(savedData.selectedTier || '');
      setSelectedAddOns(savedData.selectedAddOns || []);
    }
  }, []);

  // Set initial selected tier when data loads
  useEffect(() => {
    const residentialTiers = pricingData.tiers.filter(t => t.category === 'Residential');
    if (residentialTiers.length > 0 && !selectedTier) {
      setSelectedTier(residentialTiers[0].label);
    }
  }, [pricingData.tiers, selectedTier]);

  // Update selected tier data when tier changes
  useEffect(() => {
    const tier = pricingData.tiers.find(t => t.label === selectedTier);
    setSelectedTierData(tier || null);
  }, [selectedTier, pricingData.tiers]);

  useEffect(() => {
    if (allAddOns.length === 0) return;

    setExpandedAddOnCategory((currentCategory) => {
      if (currentCategory && allAddOns.some((addOn) => addOn.category === currentCategory)) {
        return currentCategory;
      }

      const preferredCategory = allAddOns.find(
        (addOn) => addOn.category.trim().toLowerCase() === INITIAL_ADDON_CATEGORY.toLowerCase()
      )?.category;
      const carpetCategory = allAddOns.find((addOn) =>
        addOn.category.toLowerCase().includes('carpet')
      )?.category;

      return preferredCategory || carpetCategory || allAddOns[0].category;
    });
  }, [allAddOns]);

  // Save to local storage whenever selections change
  useEffect(() => {
    if (selectedTier) {
      const selectedAddOnDetails = selectedAddOns
        .map(id => {
          const addon = allAddOns.find(a => a.id.toString() === id);
          return addon ? { name: addon.name, price: addon.price } : null;
        })
        .filter(Boolean) as SelectedBookingAddOn[];

      const dataToSave = {
        selectedTier,
        selectedAddOns,
        category: 'Residential',
        service: selectedTier,
        price: selectedTierData?.price,
        addons: selectedAddOnDetails,
        timestamp: new Date().toISOString(),
      };
      saveToLocalStorage(dataToSave);
    }
  }, [selectedTier, selectedAddOns, selectedTierData, allAddOns]);

  const handleCategoryChange = (category: ServiceCategory) => {
    if (category === activeCategory) return;
    setDirection(activeCategory === 'Residential' ? 1 : -1);
    setActiveCategory(category);
    
    const tiers = pricingData.tiers.filter(t => t.category === category);
    if (tiers.length > 0) {
      setSelectedTier(tiers[0].label);
    }
    setIsFaqSectionOpen(false);
    setOpenFaqIndex(null);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const toggleAddOnCategory = (category: string) => {
    setExpandedAddOnCategory(expandedAddOnCategory === category ? null : category);
  };

  const handleBookNow = () => {
    if (selectedTierData) {
      const bookingData = {
        selectedTier: selectedTierData.label,
        selectedAddOns,
        service: selectedTierData.label,
        price: selectedTierData.price,
        category: selectedTierData.category,
        addons: selectedAddOns.map(id => {
          const addon = allAddOns.find(a => a.id.toString() === id);
          return addon ? { name: addon.name, price: addon.price } : null;
        }).filter(isSelectedBookingAddOn),
        timestamp: new Date().toISOString(),
      };
      
      saveToLocalStorage({
        ...bookingData,
        finalized: true,
      });

      document.querySelector('#booking')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
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

  const getCategoryData = (category: ServiceCategory) => {
    const tiers = pricingData.tiers.filter(t => t.category === category && t.status === 'Active');
    const faqs = pricingData.faqs.filter(f => f.category === category);
    return { tiers, faqs };
  };

  const residentialData = getCategoryData('Residential');
  const commercialData = getCategoryData('Commercial');

  // Group add-ons by category from database
  const groupedAddOns = allAddOns.reduce<Record<string, DisplayAddOn[]>>((acc, addOn) => {
    if (!acc[addOn.category]) {
      acc[addOn.category] = [];
    }
    acc[addOn.category].push({
      id: addOn.id.toString(),
      name: addOn.name,
      price: addOn.price,
      description: addOn.description,
      category: addOn.category,
    });
    return acc;
  }, {});

  if (loading) {
    return (
      <section
        id="pricing"
        className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden"
        style={{
          backgroundColor: 'var(--theme-primary)',
          color: 'var(--theme-text)',
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Loading pricing...</p>
        </div>
      </section>
    );
  }

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
                  isFaqSectionOpen={isFaqSectionOpen}
                  setIsFaqSectionOpen={setIsFaqSectionOpen}
                  openFaqIndex={openFaqIndex}
                  setOpenFaqIndex={setOpenFaqIndex}
                  toggleFaq={toggleFaq}
                  hoveredTier={hoveredTier}
                  setHoveredTier={setHoveredTier}
                  groupedAddOns={groupedAddOns}
                  selectedAddOns={selectedAddOns}
                  toggleAddOn={toggleAddOn}
                  expandedAddOnCategory={expandedAddOnCategory}
                  toggleAddOnCategory={toggleAddOnCategory}
                  selectedTierData={selectedTierData}
                  handleBookNow={handleBookNow}
                  activeSlideIndex={activeSlideIndex}
                  setActiveSlideIndex={setActiveSlideIndex}
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
  isFaqSectionOpen,
  setIsFaqSectionOpen,
  openFaqIndex, 
  setOpenFaqIndex,
  toggleFaq,
  hoveredTier,
  setHoveredTier,
  groupedAddOns,
  selectedAddOns,
  toggleAddOn,
  expandedAddOnCategory,
  toggleAddOnCategory,
  selectedTierData,
  handleBookNow,
  activeSlideIndex,
  setActiveSlideIndex,
}: any) {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Breakpoints for responsive cards
  const breakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    640: {
      slidesPerView: 1.2,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  };

  const handleSlideChange = (swiper: any) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setActiveSlideIndex(swiper.activeIndex);
  };

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

      {/* Swiper Carousel for Tiers */}
      <div className="relative px-12 sm:px-14">
        {/* Navigation Arrows */}
        <button
          onClick={() => swiperRef?.slidePrev()}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isBeginning 
              ? 'opacity-30 cursor-not-allowed' 
              : 'opacity-80 hover:opacity-100 hover:scale-110'
          }`}
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
          }}
          disabled={isBeginning}
          aria-label="Previous package"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => swiperRef?.slideNext()}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isEnd 
              ? 'opacity-30 cursor-not-allowed' 
              : 'opacity-80 hover:opacity-100 hover:scale-110'
          }`}
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
          }}
          disabled={isEnd}
          aria-label="Next package"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <Swiper
          onSwiper={(swiper) => {
            setSwiperRef(swiper);
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          modules={[Navigation, Pagination]}
          breakpoints={breakpoints}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          onSlideChange={handleSlideChange}
          className="pb-12"
          style={{
            paddingBottom: '50px',
          }}
        >
          {data.tiers.map((tier: any) => {
            const isSelected = selectedTier === tier.label;
            const isHovered = hoveredTier === tier.label;

            return (
              <SwiperSlide key={tier.id}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTier(tier.label)}
                  onMouseEnter={() => setHoveredTier(tier.label)}
                  onMouseLeave={() => setHoveredTier(null)}
                  className={`relative cursor-pointer rounded-xl p-6 ${tier.isPopular ? 'pt-11' : ''} flex flex-col transition-all duration-300 border backdrop-blur-sm h-full min-h-[320px]`}
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
                      className="absolute left-1/2 top-4 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1 text-[11px] font-bold uppercase shadow-lg"
                      style={{
                        backgroundColor: '#F6D961',
                        border: '1px solid rgba(255,255,255,0.55)',
                        color: '#111827',
                        boxShadow: '0 8px 22px rgba(246, 217, 97, 0.32)',
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
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Pagination Dots */}
        <style jsx>{`
          :global(.swiper-pagination-bullet) {
            background: rgba(255,255,255,0.3) !important;
            opacity: 1 !important;
            width: 10px !important;
            height: 10px !important;
          }
          :global(.swiper-pagination-bullet-active) {
            background: var(--theme-secondary) !important;
            width: 24px !important;
            border-radius: 5px !important;
          }
          :global(.swiper-pagination) {
            bottom: 0 !important;
          }
        `}</style>
      </div>

      {/* Add-ons Section - Only shown when a tier is selected */}
      {selectedTier && Object.keys(groupedAddOns).length > 0 && (
        <div className="rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="text-center">
            <h2 className="text-xl font-serif font-semibold text-white">
              Want It Cleaner Than Clean?
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Add These Upgrades to Your Booking:
            </p>
          </div>

          {/* Add-ons by Category */}
          <div className="space-y-4">
            {Object.entries(groupedAddOns as Record<string, DisplayAddOn[]>).map(([category, addOns]) => {
              const isExpanded = expandedAddOnCategory === category;
              const selectedCount = addOns.filter((a) => selectedAddOns.includes(a.id)).length;
              
              return (
                <div key={category} className="rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <button
                    onClick={() => toggleAddOnCategory(category)}
                    className="w-full px-4 py-3 flex items-center justify-between transition-all hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ color: 'var(--theme-secondary)' }}>
                        {categoryIcons[category] || <Sparkles className="w-4 h-4" />}
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {category}
                      </span>
                      {selectedCount > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: 'var(--theme-secondary)',
                            color: 'white',
                          }}
                        >
                          {selectedCount}
                        </span>
                      )}
                    </div>
                    <motion.span
                      className="text-lg flex-shrink-0"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isExpanded ? '−' : '+'}
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-2">
                          {addOns.map((addOn) => {
                            const isSelected = selectedAddOns.includes(addOn.id);
                            return (
                              <button
                                key={addOn.id}
                                onClick={() => toggleAddOn(addOn.id)}
                                className="w-full flex items-center justify-between p-3 rounded-lg transition-all"
                                style={{
                                  backgroundColor: isSelected ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                                  border: isSelected ? '1px solid var(--theme-secondary)' : '1px solid rgba(255,255,255,0.06)',
                                }}
                              >
                                <div className="flex items-center gap-3 text-left">
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-gray-500'
                                  }`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <div>
                                    <div className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                      {addOn.name}
                                    </div>
                                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                      {addOn.description}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm font-medium" style={{ color: 'var(--theme-secondary)' }}>
                                  {addOn.price}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Book Now Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBookNow}
              className="px-8 py-3 rounded-lg text-sm font-bold transition-all hover:opacity-90 flex items-center gap-2"
              style={{
                backgroundColor: 'var(--theme-secondary)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
              }}
            >
              Book Now
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div
        className="rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setIsFaqSectionOpen((isOpen: boolean) => !isOpen);
            setOpenFaqIndex(null);
          }}
          className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-lg px-5 py-4 text-left transition-all duration-200 hover:bg-white/5"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          aria-expanded={isFaqSectionOpen}
          aria-controls="pricing-faq-list"
        >
          <span className="text-xl font-serif font-semibold text-white">
            Frequently Asked Questions
          </span>
          <span
            className="ml-4 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'var(--theme-secondary)',
            }}
          >
            {isFaqSectionOpen ? <Minus size={18} /> : <Plus size={18} />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isFaqSectionOpen && (
            <motion.div
              id="pricing-faq-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
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
                        aria-expanded={isOpen}
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
                          {isOpen ? '-' : '+'}
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
            </motion.div>
          )}
        </AnimatePresence>
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
