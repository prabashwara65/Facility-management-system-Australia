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
  ChevronDown
} from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '1800 123 456',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@sparkwell.com.au',
  },
  {
    icon: MapPin,
    label: 'Service Area',
    value: 'Melbourne, VIC',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon–Sat, 7am–6pm',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
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
    <section className="w-full bg-[#16233b] text-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[#c29233] font-semibold tracking-widest text-xs uppercase">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            Book your clean today.
          </h2>
        </div>

        {/* Main Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Sidebar - Contact Details */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            {/* Contact Info Items */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3.5 pb-4 border-b border-white/10 last:border-0"
                  >
                    <div className="p-2 rounded-lg bg-[#21304d] text-gray-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-gray-400 font-medium">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call Us Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#d4a340] hover:bg-[#c29233] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors duration-200"
            >
              <span>Call Us Now</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Bond-Back Guarantee Card */}
            <div className="bg-[#21304d]/50 border border-white/10 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-[#d4a340] font-bold text-sm">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Bond-Back Guarantee</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                If your property manager isn't satisfied, we return free of charge. That's our promise.
              </p>
            </div>
          </motion.div>

          {/* Right Form Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 bg-[#21304d]/70 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl"
          >
            <h3 className="text-xl font-serif font-bold mb-6">Request a Booking</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Sarah"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4a340] transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Mitchell"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4a340] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0412 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4a340] transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="sarah@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4a340] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Service Type Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                  Service Type
                </label>
                <div className="relative">
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-[#d4a340] transition-colors pr-10"
                  >
                    <option value="End of Lease / Bond Clean" className="bg-[#1b2a4a]">
                      End of Lease / Bond Clean
                    </option>
                    <option value="Regular Clean" className="bg-[#1b2a4a]">
                      Regular Clean
                    </option>
                    <option value="Deep Clean" className="bg-[#1b2a4a]">
                      Deep Clean
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-300 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Bedrooms & Bathrooms Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bedrooms */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                    Bedrooms
                  </label>
                  <div className="flex items-center justify-between bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2">
                    <button
                      type="button"
                      onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                      className="text-gray-300 hover:text-white transition-colors p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-white">{bedrooms}</span>
                    <button
                      type="button"
                      onClick={() => setBedrooms(bedrooms + 1)}
                      className="text-gray-300 hover:text-white transition-colors p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                    Bathrooms
                  </label>
                  <div className="flex items-center justify-between bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2">
                    <button
                      type="button"
                      onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                      className="text-gray-300 hover:text-white transition-colors p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-white">{bathrooms}</span>
                    <button
                      type="button"
                      onClick={() => setBathrooms(bathrooms + 1)}
                      className="text-gray-300 hover:text-white transition-colors p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Address & Suburb */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="45 Collins Street"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4a340] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                    Suburb
                  </label>
                  <input
                    type="text"
                    name="suburb"
                    placeholder="South Yarra"
                    value={formData.suburb}
                    onChange={handleChange}
                    className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4a340] transition-colors"
                  />
                </div>
              </div>

              {/* Preferred Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
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
                    className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4a340] transition-colors pr-10"
                  />
                  <Calendar className="w-4 h-4 text-gray-300 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-wider text-gray-300 uppercase">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  rows={3}
                  placeholder="e.g. Please focus extra time on oven and bathrooms..."
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  className="w-full bg-[#2a3c5e]/80 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4a340] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full bg-[#d4a340] hover:bg-[#c29233] text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-colors duration-200"
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