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

const defaultContactInfo = {
  phone: '1800 123 456',
  email: 'hello@sparkwell.com.au',
  service_area: 'Melbourne, VIC',
  hours: 'Mon–Sat, 7am–6pm',
  guarantee_title: 'Bond-Back Guarantee',
  guarantee_description: "If your property manager isn't satisfied, we return free of charge. That's our promise.",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function BookingSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    serviceType: 'End of Lease / Bond Clean',
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

  const contactInfoItems = contactInfo ? [
    { icon: Phone, label: 'Phone', value: contactInfo.phone },
    { icon: Mail, label: 'Email', value: contactInfo.email },
    { icon: MapPin, label: 'Service Area', value: contactInfo.service_area },
    { icon: Clock, label: 'Hours', value: contactInfo.hours },
  ] : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        service_type: formData.serviceType,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        address: formData.address || '',
        suburb: formData.suburb,
        preferred_date: formData.preferredDate || '',
        special_instructions: formData.specialInstructions || '',
        status: 'Pending',
        total_price: calculatePrice(formData.serviceType, bedrooms, bathrooms),
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
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        serviceType: 'End of Lease / Bond Clean',
        address: '',
        suburb: '',
        preferredDate: '',
        specialInstructions: '',
      });
      setBedrooms(2);
      setBathrooms(1);

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
            Book your clean today.
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column - Contact Info */}
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

            <div 
              className="rounded-2xl p-5 space-y-2 backdrop-blur-sm"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.08)', 
                border: '1px solid rgba(255,255,255,0.08)' 
              }}
            >
              <div className="flex items-center space-x-2 font-bold text-sm" style={{ color: 'var(--theme-secondary)' }}>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{contactInfo?.guarantee_title || 'Bond-Back Guarantee'}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {contactInfo?.guarantee_description || "If your property manager isn't satisfied, we return free of charge. That's our promise."}
              </p>
            </div>
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
              Request a Booking
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    First Name
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
                    Last Name
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
                    Phone
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
                    Email
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

              <div className="space-y-1.5">
                <label 
                  className="text-[11px] font-semibold tracking-wider uppercase"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  Service Type
                </label>
                <div className="relative">
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm appearance-none cursor-pointer transition-colors pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)]"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                    }}
                  >
                    <option value="End of Lease / Bond Clean" style={{ backgroundColor: 'var(--theme-primary)' }}>
                      End of Lease / Bond Clean
                    </option>
                    <option value="Regular Clean" style={{ backgroundColor: 'var(--theme-primary)' }}>
                      Regular Clean
                    </option>
                    <option value="Deep Clean" style={{ backgroundColor: 'var(--theme-primary)' }}>
                      Deep Clean
                    </option>
                  </select>
                  <ChevronDown 
                    className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    Bedrooms
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
                    Bathrooms
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
                  <span>{submitting ? 'Submitting...' : 'Request My Booking'}</span>
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