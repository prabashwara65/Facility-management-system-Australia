'use client';

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Flag,
  BadgeCheck,
  Star,
  Recycle,
  LogIn,
} from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

interface TrustItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface HeroProps {
  onScrollTrigger?: () => void;
}

export default function Hero({ onScrollTrigger }: HeroProps) {
  const trustItems = [
    { icon: <ShieldCheck size={16} />, title: "100% Satisfaction", subtitle: "Guaranteed" },
    { icon: <Flag size={16} />, title: "Fully Insured", subtitle: "& Bonded" },
    { icon: <BadgeCheck size={16} />, title: "Police-Checked", subtitle: "Team Members" },
    { icon: <Star size={16} />, title: "4.9 / 5 Stars", subtitle: "1,200+ Reviews" },
    { icon: <Recycle size={16} />, title: "Eco-Friendly", subtitle: "Products Used" },
  ];

  return (
    <section className="relative h-[60svh] min-h-[480px] w-full overflow-hidden rounded-lg lg:h-screen">
      <Link
        href="/"
        className="absolute left-4 top-4 z-30 flex max-w-[calc(100%-5.5rem)] items-center gap-2 rounded-[14px] border px-2.5 py-2 shadow-lg backdrop-blur-md lg:hidden"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--theme-surface) 82%, transparent)',
          borderColor: 'rgba(255,255,255,0.55)',
          color: 'var(--theme-primary)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        }}
        aria-label="Shining Property Service home"
      >
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
          <Image
            src="/img/02.png"
            alt="Shining Property Service"
            width={28}
            height={28}
            className="h-full w-full object-cover"
            priority
          />
        </span>
        <span className="min-w-0 font-serif text-[13px] font-bold leading-tight">
          <span style={{ color: 'var(--theme-primary)' }}>SHINING</span>
          <span className="block truncate text-[10px]" style={{ color: 'var(--theme-secondary)' }}>
            PROPERTY SERVICE
          </span>
        </span>
      </Link>

      <Link
        href="/login"
        className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-[14px] border shadow-lg backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
        style={{
          backgroundColor: '#F6D961',
          borderColor: 'rgba(255,255,255,0.55)',
          color: '#111827',
          outlineColor: 'var(--theme-secondary)',
          boxShadow: '0 4px 15px rgba(246, 217, 97, 0.3)',
        }}
        aria-label="Login"
        title="Login"
      >
        <LogIn className="h-5 w-5 flex-shrink-0" />
      </Link>

      {/* Background Image */}
      <img
        src="/img/cleaning_lady.avif"
        alt="Cleaning lady"
        className="absolute inset-0 h-full w-full object-cover object-center sm:object-center"
        style={{ opacity: 0.6 }}
      />

      {/* Gradient Overlay */}
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
              MELBOURNE&apos;S MOST TRUSTED
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
        className="absolute bottom-0 left-0 right-0 z-20 border-t backdrop-blur-sm py-2"
        style={{
          borderColor: 'var(--hero-badge-border)',
          backgroundColor: 'color-mix(in srgb, var(--theme-primary) 90%, black)',
        }}
      >
        <div className="mx-auto max-w-[1400px] px-2 sm:px-4">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 0,
                loop: false,
                autoplay: false,
              },
            }}
            className="w-full"
          >
            {trustItems.map((item, index) => (
              <SwiperSlide key={index}>
                <TrustItem
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, title, subtitle }: TrustItemProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-2 py-2 lg:border-r border-[var(--hero-badge-border)] lg:last:border-r-0">
      <div className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--hero-badge-border)]" style={{ color: 'var(--hero-text)' }}>
        {icon}
      </div>

      <div className="min-w-0">
        <div className="whitespace-nowrap text-[10px] sm:text-[11px] md:text-xs font-bold truncate" style={{ color: 'var(--hero-text)' }}>
          {title}
        </div>

        <div className="text-[8px] sm:text-[9px] md:text-[10px] truncate" style={{ color: 'var(--hero-text-secondary)' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
