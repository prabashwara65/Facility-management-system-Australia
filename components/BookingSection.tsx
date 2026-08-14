'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
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

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '1800 123 456' },
  { icon: Mail, label: 'Email', value: 'hello@sparkwell.com.au' },
  { icon: MapPin, label: 'Service Area', value: 'Melbourne, VIC' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 7am–6pm' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function BookingSection() {
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', { ...formData, bedrooms, bathrooms });
  };

  return (
    <section
      className="w-full py-16 px-4 sm:px-6 lg:px-8 font-sans"
      id="booking"
      style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-text)' }}
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
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3.5 pb-4 last:border-0"
                    style={{ 
                      borderBottom: index < contactInfo.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' 
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors duration-200"
              style={{ backgroundColor: 'var(--theme-secondary)', color: 'white' }}
            >
              <span>Call Us Now</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <div 
              className="rounded-2xl p-5 space-y-2"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.08)', 
                border: '1px solid rgba(255,255,255,0.1)' 
              }}
            >
              <div className="flex items-center space-x-2 font-bold text-sm" style={{ color: 'var(--theme-secondary)' }}>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Bond-Back Guarantee</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                If your property manager isn't satisfied, we return free of charge. That's our promise.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Booking Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 rounded-3xl p-6 sm:p-8 shadow-xl"
            style={{ 
              backgroundColor: 'var(--theme-card)',
              border: '1px solid var(--theme-border)'
            }}
          >
            <h3 
              className="text-xl font-serif font-bold mb-6"
              style={{ color: 'var(--theme-text)' }}
            >
              Request a Booking
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Sarah"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Mitchell"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0412 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="sarah@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label 
                  className="text-[11px] font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Service Type
                </label>
                <div className="relative">
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm appearance-none cursor-pointer transition-colors pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                  >
                    <option value="End of Lease / Bond Clean" style={{ backgroundColor: 'var(--theme-card)' }}>
                      End of Lease / Bond Clean
                    </option>
                    <option value="Regular Clean" style={{ backgroundColor: 'var(--theme-card)' }}>
                      Regular Clean
                    </option>
                    <option value="Deep Clean" style={{ backgroundColor: 'var(--theme-card)' }}>
                      Deep Clean
                    </option>
                  </select>
                  <ChevronDown 
                    className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--theme-text)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Bedrooms
                  </label>
                  <div 
                    className="flex items-center justify-between rounded-xl px-4 py-2"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      border: '1px solid var(--theme-border)' 
                    }}
                  >
                    <button 
                      type="button" 
                      onClick={() => setBedrooms(Math.max(1, bedrooms - 1))} 
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {bedrooms}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setBedrooms(bedrooms + 1)} 
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Bathrooms
                  </label>
                  <div 
                    className="flex items-center justify-between rounded-xl px-4 py-2"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      border: '1px solid var(--theme-border)' 
                    }}
                  >
                    <button 
                      type="button" 
                      onClick={() => setBathrooms(Math.max(1, bathrooms - 1))} 
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {bathrooms}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setBathrooms(bathrooms + 1)} 
                      className="p-1 hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--theme-text)' }}
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
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="45 Collins Street"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label 
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    Suburb
                  </label>
                  <input
                    type="text"
                    name="suburb"
                    placeholder="South Yarra"
                    value={formData.suburb}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label 
                  className="text-[11px] font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--theme-text)' }}
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
                    className="w-full rounded-xl px-4 py-2.5 text-sm transition-colors pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)',
                    }}
                  />
                  <Calendar 
                    className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--theme-text)' }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label 
                  className="text-[11px] font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  rows={3}
                  placeholder="e.g. Please focus extra time on oven and bathrooms..."
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  className="w-full rounded-xl p-4 text-sm transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                  style={{
                    backgroundColor: 'var(--theme-surface)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)',
                  }}
                />
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors duration-200"
                  style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}
                >
                  <span>Request My Booking</span>
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