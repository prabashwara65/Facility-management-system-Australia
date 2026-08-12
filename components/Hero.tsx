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
      <div className="absolute inset-0 bg-[#1d2d4d]/90" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-center px-6 py-12 lg:px-10">
        <motion.div 
          className="max-w-[680px]"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {/* Badge */}
          <motion.div 
            className="mb-7 inline-flex rounded-full border border-[#c99a32] bg-[#263856]/60 px-4 py-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-xs font-semibold tracking-[0.08em] text-[#d4a438]">
              MELBOURNE'S MOST TRUSTED
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="font-serif text-[42px] font-medium leading-[1.02] tracking-tight sm:text-[48px] md:text-[56px] lg:text-[64px]">
            A Home That Feels
            <motion.span 
              className="mt-1 block italic text-[#d2a037]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Truly Clean.
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p 
            className="mt-7 max-w-[590px] text-[15px] font-medium leading-[1.75] text-white/75 sm:text-base"
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
            className="mt-7 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.button 
              className="rounded-md bg-[#d0a037] px-8 py-3 text-[15px] font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#dfae45]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>

            <motion.button 
              className="rounded-md border-2 border-white/40 px-8 py-3 text-[15px] font-bold text-white transition-all hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Call Us Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* TRUST BAR - Now at bottom of full viewport */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/15 bg-[#30405f]/85">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-5">
          <TrustItem
            icon={<ShieldCheck size={22} />}
            title="100% Satisfaction"
            subtitle="Guaranteed"
          />
          <TrustItem
            icon={<Flag size={21} />}
            title="Fully Insured"
            subtitle="& Bonded"
          />
          <TrustItem
            icon={<BadgeCheck size={22} />}
            title="Police-Checked"
            subtitle="Team Members"
          />
          <TrustItem
            icon={<Star size={22} />}
            title="4.9 / 5 Stars"
            subtitle="1,200+ Reviews"
          />
          <TrustItem
            icon={<Recycle size={22} />}
            title="Eco-Friendly"
            subtitle="Products Used"
          />
        </div>
      </div>

      {/* Chat */}
      <motion.button
        className="absolute bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#d0a037] shadow-xl"
        aria-label="Open chat"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="flex h-6 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#243453]">
          ...
        </div>
      </motion.button>
    </section>
  );
}

function TrustItem({ icon, title, subtitle }: TrustItemProps) {
  return (
    <div className="flex items-center gap-2.5 border-r border-white/10 px-4 py-4 last:border-r-0 lg:px-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#d0a037] text-[#d0a037]">
        {icon}
      </div>

      <div>
        <div className="whitespace-nowrap text-xs font-bold text-white sm:text-sm">
          {title}
        </div>

        <div className="text-xs text-white/55">
          {subtitle}
        </div>
      </div>
    </div>
  );
}