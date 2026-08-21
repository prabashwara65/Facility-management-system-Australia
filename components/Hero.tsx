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
      {/* Background Image */}
      <img
        src="/img/cleaning_lady.avif"
        alt="Cleaning lady"
        className="absolute inset-0 h-full w-full object-cover object-center sm:object-center"
        style={{ opacity: 0.6 }}
      />

      {/* Gradient Overlay - with transparency */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, color-mix(in srgb, var(--theme-primary) 85%, transparent), color-mix(in srgb, var(--theme-secondary) 75%, transparent))',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8 xl:px-10">
        <motion.div 
          className="max-w-[580px] w-full"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* Badge */}
          <motion.div 
            className="mb-3 sm:mb-5 inline-flex rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 backdrop-blur-sm"
            style={{
              borderColor: 'var(--hero-badge-border)',
              backgroundColor: 'var(--hero-badge)',
              border: '1px solid var(--hero-badge-border)',
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-[8px] sm:text-[10px] font-semibold tracking-[0.08em] sm:text-xs" style={{ color: 'var(--hero-text)' }}>
              MELBOURNE'S MOST TRUSTED
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="font-serif text-[28px] sm:text-[34px] md:text-[40px] lg:text-[46px] xl:text-[52px] font-medium leading-[1.05] tracking-tight" style={{ color: 'var(--hero-text)' }}>
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
            className="mt-3 sm:mt-5 max-w-[520px] text-[13px] sm:text-[14px] md:text-[15px] font-medium leading-[1.6]"
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
            className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.a
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                const section = document.querySelector('#booking');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="inline-block rounded-md px-5 sm:px-6 py-2.5 text-[13px] sm:text-[14px] font-bold transition-all hover:-translate-y-1 cursor-pointer text-center"
              style={{ backgroundColor: 'var(--theme-card)', color: 'var(--theme-primary)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.a>

            <motion.a
              href="#booking"
              onClick={(e) => {
                e.preventDefault();
                const section = document.querySelector('#booking');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="inline-block rounded-md border-2 px-5 sm:px-6 py-2.5 text-[13px] sm:text-[14px] font-bold transition-all cursor-pointer text-center"
              style={{
                borderColor: 'var(--hero-badge-border)',
                color: 'var(--hero-text)',
                backgroundColor: 'transparent',
              }}
              whileHover={{ scale: 1.04, backgroundColor: 'var(--hero-badge)' }}
              whileTap={{ scale: 0.95 }}
            >
              Call Us Now
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* TRUST BAR */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 border-t backdrop-blur-sm"
        style={{
          borderColor: 'var(--hero-badge-border)',
          backgroundColor: 'color-mix(in srgb, var(--theme-primary) 90%, black)',
        }}
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-3 lg:grid-cols-5 px-2 sm:px-4">
          <TrustItem
            icon={<ShieldCheck size={16} />}
            title="100% Satisfaction"
            subtitle="Guaranteed"
          />
          <TrustItem
            icon={<Flag size={16} />}
            title="Fully Insured"
            subtitle="& Bonded"
          />
          <TrustItem
            icon={<BadgeCheck size={16} />}
            title="Police-Checked"
            subtitle="Team Members"
          />
          <TrustItem
            icon={<Star size={16} />}
            title="4.9 / 5 Stars"
            subtitle="1,200+ Reviews"
          />
          <TrustItem
            icon={<Recycle size={16} />}
            title="Eco-Friendly"
            subtitle="Products Used"
          />
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, title, subtitle }: TrustItemProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 border-r border-[var(--hero-badge-border)] px-1.5 sm:px-2 md:px-3 lg:px-4 xl:px-5 py-2 sm:py-3 last:border-r-0">
      <div className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--hero-badge-border)]" style={{ color: 'var(--hero-text)' }}>
        {icon}
      </div>

      <div className="min-w-0">
        <div className="whitespace-nowrap text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold truncate" style={{ color: 'var(--hero-text)' }}>
          {title}
        </div>

        <div className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] truncate" style={{ color: 'var(--hero-text-secondary)' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}