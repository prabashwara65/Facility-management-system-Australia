'use client';

import {
  ShieldCheck,
  Flag,
  BadgeCheck,
  Star,
  Recycle,
} from "lucide-react";
import { motion } from "framer-motion";

interface TrustItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface HeroProps {
  onScrollTrigger?: () => void;
}

export default function Hero({ onScrollTrigger }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/cleaning-hero.jpg')",
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, color-mix(in srgb, var(--theme-primary) 95%, black), color-mix(in srgb, var(--theme-secondary) 90%, var(--theme-primary)))',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-center px-6 lg:px-8 xl:px-10">
        <motion.div 
          className="max-w-[580px]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* Badge */}
          <motion.div 
            className="mb-5 inline-flex rounded-full px-3.5 py-1.5 backdrop-blur-sm"
            style={{
              borderColor: 'var(--hero-badge-border)',
              backgroundColor: 'var(--hero-badge)',
              border: '1px solid var(--hero-badge-border)',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-[10px] font-semibold tracking-[0.08em] sm:text-xs" style={{ color: 'var(--hero-text)' }}>
              MELBOURNE'S MOST TRUSTED
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="font-serif text-[34px] font-medium leading-[1.05] tracking-tight sm:text-[40px] md:text-[46px] lg:text-[52px]" style={{ color: 'var(--hero-text)' }}>
            A Home That Feels
            <motion.span 
              className="mt-0.5 block italic"
              style={{ color: 'var(--theme-secondary)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Truly Clean.
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p 
            className="mt-5 max-w-[520px] text-[14px] font-medium leading-[1.6] sm:text-[15px]"
            style={{ color: 'var(--hero-text-secondary)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Professional end-of-lease, deep, and regular cleaning across
            Melbourne — backed by our 100% bond-back guarantee and 48-hour
            re-clean promise.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.button 
              className="rounded-md px-6 py-2.5 text-[14px] font-bold transition-all hover:-translate-y-1"
              style={{ backgroundColor: 'var(--theme-card)', color: 'var(--theme-primary)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>

            <motion.button 
              className="rounded-md border-2 px-6 py-2.5 text-[14px] font-bold transition-all"
              style={{
                borderColor: 'var(--hero-badge-border)',
                color: 'var(--hero-text)',
                backgroundColor: 'transparent',
              }}
              whileHover={{ scale: 1.04, backgroundColor: 'var(--hero-badge)' }}
              whileTap={{ scale: 0.95 }}
            >
              Call Us Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* TRUST BAR - Blue */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 border-t backdrop-blur-sm"
        style={{
          borderColor: 'var(--hero-badge-border)',
          backgroundColor: 'color-mix(in srgb, var(--theme-primary) 90%, black)',
        }}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-5">
          <TrustItem
            icon={<ShieldCheck size={18} />}
            title="100% Satisfaction"
            subtitle="Guaranteed"
          />
          <TrustItem
            icon={<Flag size={18} />}
            title="Fully Insured"
            subtitle="& Bonded"
          />
          <TrustItem
            icon={<BadgeCheck size={18} />}
            title="Police-Checked"
            subtitle="Team Members"
          />
          <TrustItem
            icon={<Star size={18} />}
            title="4.9 / 5 Stars"
            subtitle="1,200+ Reviews"
          />
          <TrustItem
            icon={<Recycle size={18} />}
            title="Eco-Friendly"
            subtitle="Products Used"
          />
        </div>
      </div>

      {/* Chat */}
      {/* <motion.button
        className="absolute bottom-20 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Open chat"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div
          className="flex h-5 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          ...
        </div>
      </motion.button> */}
    </section>
  );
}

function TrustItem({ icon, title, subtitle }: TrustItemProps) {
  return (
    <div className="flex items-center gap-2 border-r px-3 py-3 last:border-r-0 lg:px-4 xl:px-5" style={{ borderColor: 'var(--hero-badge-border)' }}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2" style={{ borderColor: 'var(--hero-badge-border)', color: 'var(--hero-text)' }}>
        {icon}
      </div>

      <div>
        <div className="whitespace-nowrap text-[10px] font-bold sm:text-xs" style={{ color: 'var(--hero-text)' }}>
          {title}
        </div>

        <div className="text-[9px] sm:text-[10px]" style={{ color: 'var(--hero-text-secondary)' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}