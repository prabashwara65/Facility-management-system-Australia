'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Calendar,
  Minus,
  Plus,
  Sparkles,
  ChevronDown,
  CheckCircle,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  service_area: string;
  hours: string;
  guarantee_title: string;
  guarantee_description: string;
}

interface ResidentialBookingData {
  selectedTier: string;
  selectedAddOns: string[];
  category: string;
  timestamp: string;
  finalized?: boolean;
}

interface AddOn {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
}

const defaultContactInfo = {
  phone: '1800 123 456',
  email: 'hello@sparkwell.com.au',
  service_area: 'Melbourne, VIC',
  hours: 'Mon–Sat, 7am–6pm',
  guarantee_title: 'Bond-Back Guarantee',
  guarantee_description: "If your property manager isn't satisfied, we return free of charge. That's our promise.",
};

// Add-ons data for reference
const addOnsData: AddOn[] = [
  { id: 'carpet-living', name: 'Carpet Steam Cleaning (Living Area/Hall)', price: '$100', description: 'Living Area/Hall', category: 'Carpet & Upholstery' },
  { id: 'carpet-bedroom', name: 'Carpet Steam Cleaning (Per Bedroom)', price: '$55', description: 'Per Bedroom', category: 'Carpet & Upholstery' },
  { id: 'upholstery', name: 'Upholstery Steam Cleaning', price: 'Custom', description: 'Available upon request', category: 'Carpet & Upholstery' },
  { id: 'oven', name: 'Oven Cleaning', price: '$65', description: 'Professional oven cleaning', category: 'Kitchen Add-ons' },
  { id: 'fridge', name: 'Fridge Cleaning', price: '$35', description: 'Deep fridge cleaning', category: 'Kitchen Add-ons' },
  { id: 'dishes', name: 'Dishes', price: '$35', description: 'Wash and put away dishes', category: 'Kitchen Add-ons' },
  { id: 'cabinets', name: 'Clean Inside Cabinets', price: '$30 - $100', description: 'Based on number of cabinets', category: 'Whole Home' },
  { id: 'windows', name: 'Inside Window Cleaning', price: '$65 - $150', description: 'Based on number of windows', category: 'Whole Home' },
  { id: 'blinds', name: 'Wet Wipe Blinds', price: '$29', description: 'Per blind', category: 'Whole Home' },
  { id: 'walls', name: 'Clean Walls', price: '$29', description: 'Per wall', category: 'Whole Home' },
  { id: 'green-supplies', name: 'Use Green Supplies', price: '$5', description: 'Eco-friendly cleaning products', category: 'Whole Home' },
  { id: 'linen', name: 'Bed Linen Change', price: '$15', description: 'Fresh bed linen', category: 'Deep Detail' },
  { id: 'ironing', name: 'Ironing', price: '$45', description: 'Per 30 minutes', category: 'Deep Detail' },
  { id: 'laundry', name: 'Laundry Service', price: '$30', description: 'Per load', category: 'Deep Detail' },
  { id: 'balcony', name: 'Balcony / Patio Clean', price: '$60 - $100', description: 'Based on size', category: 'Deep Detail' },
  { id: 'garage', name: 'Garage Clean', price: '$50+', description: 'Starting from $50', category: 'Deep Detail' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Storage key for residential booking
const RESIDENTIAL_BOOKING_KEY = 'residential_booking_data';

// Load from local storage
const loadFromLocalStorage = (): ResidentialBookingData | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(RESIDENTIAL_BOOKING_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Clear local storage after loading
const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(RESIDENTIAL_BOOKING_KEY);
  }
};

export default function BookingSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<ResidentialBookingData | null>(null);
  const [addOnsSummary, setAddOnsSummary] = useState<string>('');
  const [addOnsList, setAddOnsList] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    suburb: '',
    preferredDate: '',
    specialInstructions: '',
  });

  const supabase = createClient();

  // Fetch contact info from Supabase
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching contact info:', error);
          setContactInfo(defaultContactInfo as any);
        } else if (data) {
          setContactInfo(data);
        } else {
          setContactInfo(defaultContactInfo as any);
        }
      } catch (error) {
        console.error('Error:', error);
        setContactInfo(defaultContactInfo as any);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Load booking data from local storage
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData && savedData.selectedTier) {
      setBookingData(savedData);

      // Generate add-ons summary
      if (savedData.selectedAddOns && savedData.selectedAddOns.length > 0) {
        const addOnNames = savedData.selectedAddOns.map(id => {
          const addon = addOnsData.find(a => a.id === id);
          return addon ? addon.name : id;
        });
        setAddOnsList(addOnNames);
        setAddOnsSummary(addOnNames.join(', '));
      }
    }
  }, []);

  const contactInfoItems = contactInfo ? [
    { icon: Phone, label: 'Phone', value: contactInfo.phone },
    { icon: Mail, label: 'Email', value: contactInfo.email },
    { icon: MapPin, label: 'Service Area', value: contactInfo.service_area },
    { icon: Clock, label: 'Hours', value: contactInfo.hours },
  ] : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newBooking = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        service_type: bookingData?.selectedTier || 'End of Lease / Bond Clean',
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        address: formData.address || '',
        suburb: formData.suburb,
        preferred_date: formData.preferredDate || '',
        special_instructions: formData.specialInstructions || '',
        status: 'Pending',
        total_price: calculatePrice(bookingData?.selectedTier || 'End of Lease / Bond Clean', bedrooms, bathrooms),
        // Store the booking data from local storage
        selected_package: bookingData?.selectedTier || null,
        selected_addons: addOnsSummary || null,
        booking_data: bookingData || null,
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select();

      if (error) {
        console.error('Error creating booking:', error);
        alert('Failed to submit booking. Please try again.');
        return;
      }

      console.log('Booking Submitted:', data);
      
      // Clear local storage after successful booking
      clearLocalStorage();
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        suburb: '',
        preferredDate: '',
        specialInstructions: '',
      });
      setBedrooms(2);
      setBathrooms(1);
      setBookingData(null);
      setAddOnsSummary('');
      setAddOnsList([]);

      alert('Booking submitted successfully! We will contact you shortly.');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculatePrice = (serviceType: string, bedrooms: number, bathrooms: number) => {
    const basePrices: Record<string, number> = {
      'End of Lease / Bond Clean': 319,
      'Regular Clean': 99,
      'Deep Clean': 249,
      'General Clean': 179,
      'Deep Reset Clean': 249,
      'End of Lease Cleaning': 319,
    };
    const basePrice = basePrices[serviceType] || 199;
    const extraRooms = Math.max(0, (bedrooms + bathrooms) - 3);
    return basePrice + (extraRooms * 25);
  };

  if (loading) {
    return (
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 font-sans" id="booking" style={{ backgroundColor: 'var(--theme-primary)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full py-16 px-4 sm:px-6 lg:px-8 font-sans"
      id="booking"
      style={{ backgroundColor: 'var(--theme-primary)' }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <span
            className="font-semibold tracking-widest text-xs uppercase"
            style={{ color: 'var(--theme-secondary)' }}
          >
            Get In Touch
          </span>
          <h2 
            className="text-3xl sm:text-4xl font-serif font-bold tracking-tight"
            style={{ color: 'white' }}
          >
            {bookingData ? 'Complete Your Booking' : 'Book your clean today.'}
          </h2>
          {bookingData && (
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              You've selected a package. Fill in your details below to finalize your booking.
            </p>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column - Contact Info & Selected Package */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              {contactInfoItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3.5 pb-4 last:border-0"
                    style={{ 
                      borderBottom: index < contactInfoItems.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' 
                    }}
                  >
                    <div
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        color: 'white' 
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span 
                        className="block text-[11px] font-medium"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                      >
                        {item.label}
                      </span>
                      <span 
                        className="text-sm font-bold"
                        style={{ color: 'white' }}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <motion.a
              href={`tel:${contactInfo?.phone?.replace(/\s/g, '') || ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors duration-200"
              style={{ backgroundColor: 'var(--theme-secondary)', color: 'white' }}
            >
              <Phone className="w-4 h-4" />
              <span>Call Us Now</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>


            {/* Display selected booking summary */}
            {bookingData && (
              <div 
                className="rounded-2xl p-5 space-y-3 backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(59,130,246,0.15)', 
                  border: '1px solid rgba(59,130,246,0.3)' 
                }}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" style={{ color: 'var(--theme-secondary)' }} />
                  <p className="text-xs font-semibold" style={{ color: 'var(--theme-secondary)' }}>
                    Selected Package
                  </p>
                </div>
                <p className="text-sm font-bold text-white">{bookingData.selectedTier}</p>
                
                {addOnsList.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 mt-3">
                      <ShoppingBag className="w-4 h-4" style={{ color: 'var(--theme-secondary)' }} />
                      <p className="text-xs font-semibold" style={{ color: 'var(--theme-secondary)' }}>
                        Add-ons ({addOnsList.length})
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {addOnsList.map((name, idx) => (
                        <li key={idx} className="text-xs text-white/70">• {name}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="text-xs text-white/40 mt-1">Complete the form to confirm</p>
              </div>
            )}
          </motion.div>

          {/* Right Column - Booking Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h3 
              className="text-xl font-serif font-bold mb-6 text-white"
            >
              {bookingData ? 'Your Details' : 'Request a Booking'}
            </h3>

            {bookingData && (
              <div className="mb-4 p-4 rounded-xl space-y-2" style={{ backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="flex items-start gap-3">
                  <Package className="w-4 h-4 mt-0.5" style={{ color: 'var(--theme-secondary)' }} />
                  <div>
                    <p className="text-xs text-white/60">Package</p>
                    <p className="text-sm font-semibold text-white">{bookingData.selectedTier}</p>
                  </div>
                </div>
                {addOnsList.length > 0 && (
                  <div className="flex items-start gap-3">
                    <ShoppingBag className="w-4 h-4 mt-0.5" style={{ color: 'var(--theme-secondary)' }} />
                    <div>
                      <p className="text-xs text-white/60">Add-ons ({addOnsList.length})</p>
                      <p className="text-sm text-white/80">{addOnsSummary}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Sarah"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] placeholder:text-white/40"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Mitchell"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] placeholder:text-white/40"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                    }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0412 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] placeholder:text-white/40"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="sarah@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] placeholder:text-white/40"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                    }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Bedrooms <span className="text-red-400">*</span>
                  </label>
                  <div 
                    className="flex items-center justify-between rounded-xl px-4 py-2"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.08)', 
                      border: '1px solid rgba(255,255,255,0.08)' 
                    }}
                  >
                    <button 
                      type="button" 
                      onClick={() => setBedrooms(Math.max(1, bedrooms - 1))} 
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span 
                      className="text-sm font-bold text-white"
                    >
                      {bedrooms}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setBedrooms(bedrooms + 1)} 
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Bathrooms <span className="text-red-400">*</span>
                  </label>
                  <div 
                    className="flex items-center justify-between rounded-xl px-4 py-2"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.08)', 
                      border: '1px solid rgba(255,255,255,0.08)' 
                    }}
                  >
                    <button 
                      type="button" 
                      onClick={() => setBathrooms(Math.max(1, bathrooms - 1))} 
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span 
                      className="text-sm font-bold text-white"
                    >
                      {bathrooms}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setBathrooms(bathrooms + 1)} 
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="45 Collins Street"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] placeholder:text-white/40"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Suburb
                  </label>
                  <input
                    type="text"
                    name="suburb"
                    placeholder="South Yarra"
                    value={formData.suburb}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] placeholder:text-white/40"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label 
                  className="text-[11px] font-semibold tracking-wider uppercase"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Preferred Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="preferredDate"
                    placeholder="mm/dd/yyyy"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] placeholder:text-white/40"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                    }}
                  />
                  <Calendar 
                    className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label 
                  className="text-[11px] font-semibold tracking-wider uppercase"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  rows={3}
                  placeholder="e.g. Please focus extra time on oven and bathrooms..."
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  className="w-full rounded-xl p-4 text-sm transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] placeholder:text-white/40"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors duration-200 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--theme-secondary)', color: 'white' }}
                >
                  <span>{submitting ? 'Submitting...' : bookingData ? 'Confirm Booking' : 'Request My Booking'}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}