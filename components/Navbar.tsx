'use client';

import Link from "next/link";
import { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Sparkles, DollarSign, Users, MapPin, Calendar, Phone, Palette, LogIn } from "lucide-react";
import { useTheme, THEMES } from "@/app/context/ThemeProvider";
import Image from "next/image";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
}

interface NavbarProps {
  logoText?: string;
  phoneNumber?: string;
}

interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: ReactNode;
}

export default function Navbar({ 
  logoText = "Shining Property Service",
  phoneNumber = "1800 123 456"
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState<boolean>(false);
  const { currentTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
    e.preventDefault();
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsThemeDropdownOpen(false);
    }
  };

  const navLinks: NavItem[] = [
    { href: "#services", label: "Services", shortLabel: "Services", icon: <Sparkles className="w-4 h-4" /> },
    { href: "#pricing", label: "Pricing", shortLabel: "Pricing", icon: <DollarSign className="w-4 h-4" /> },
    { href: "#why-us", label: "Why Us", shortLabel: "Why", icon: <Users className="w-4 h-4" /> },
    { href: "#areas", label: "Areas", shortLabel: "Areas", icon: <MapPin className="w-4 h-4" /> },
    { href: "#booking", label: "Book Now", shortLabel: "Book", icon: <Calendar className="w-4 h-4" /> },
  ];

  // Get current theme colors for preview
  const currentColors = THEMES.find(t => t.name === currentTheme.name)?.colors || ['#ffffff', '#1a3a6b', '#4a7bc4', '#0a1d38'];

  return (
    <>
    <motion.header 
      className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 shadow-lg shadow-slate-200/70 backdrop-blur-md' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div className="mx-auto flex h-[64px] md:h-[72px] max-w-[1400px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-2.5 flex-shrink-0 min-w-0" aria-label={logoText}>
          <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/img/02.png"
              alt={logoText}
              width={36}
              height={36}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="font-serif text-[16px] sm:text-[18px] md:text-[21px] font-bold whitespace-nowrap overflow-hidden">
            <span style={{ color: 'var(--theme-primary)' }}>SHINING</span>
            <span style={{ color: 'var(--theme-secondary)' }} className="hidden sm:inline"> PROPERTY SERVICE</span>
            <span style={{ color: 'var(--theme-secondary)' }} className="sm:hidden"> PS</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} onClick={scrollToSection}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
            className="hidden xl:flex items-center gap-1.5 text-[14px] xl:text-[15px] font-bold transition-colors whitespace-nowrap"
            style={{ color: 'var(--theme-primary)' }}
          >
            <Phone className="w-4 h-4" />
            {phoneNumber}
          </a>

          <Link
            href="/login"
            className="hidden lg:flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap"
            style={{
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-primary)',
              backgroundColor: 'color-mix(in srgb, var(--theme-surface) 78%, transparent)',
            }}
          >
            <LogIn className="w-4 h-4" />
            
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block"
          >
            <Link
              href="#booking"
              className="rounded-md px-4 sm:px-5 md:px-6 py-2 md:py-3 text-xs sm:text-sm font-bold text-white transition-colors whitespace-nowrap flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </Link>
          </motion.div>

          {/* Theme Switcher - Desktop only (hidden on mobile) */}
          <div className="hidden lg:block relative">
            <motion.button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-gray-100/50"
              style={{ color: 'var(--theme-primary)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Change theme"
            >
              <Palette className="h-3.5 w-3.5" />
              <div className="flex gap-0.5">
                {currentColors.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5 opacity-60" />
            </motion.button>

            {/* Theme Dropdown */}
            <AnimatePresence>
              {isThemeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 sm:w-56 rounded-xl bg-white/95 backdrop-blur-sm p-2 shadow-2xl ring-1 ring-black/5 z-50"
                >
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {THEMES.map((theme) => {
                      const isActive = currentTheme.name === theme.name;
                      const [bg, primary, secondary, text] = theme.colors;
                      
                      return (
                        <motion.button
                          key={theme.name}
                          onClick={() => {
                            setTheme(theme.name);
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 transition-all ${
                            isActive ? 'bg-blue-50/80' : 'hover:bg-gray-50/80'
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Color preview */}
                          <div className="flex h-6 w-6 sm:h-8 sm:w-8 rounded-lg overflow-hidden flex-shrink-0">
                            <div className="flex-1" style={{ backgroundColor: bg }} />
                            <div className="flex-1" style={{ backgroundColor: primary }} />
                            <div className="flex-1" style={{ backgroundColor: secondary }} />
                            <div className="flex-1" style={{ backgroundColor: text }} />
                          </div>
                          
                          <div className="flex-1 text-left">
                            <div className="text-xs sm:text-sm font-medium text-gray-800">
                              {theme.label}
                            </div>
                            <div className="text-[8px] sm:text-[10px] text-gray-500">
                              {theme.description}
                            </div>
                          </div>
                          
                          {isActive && (
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>

    <AnimatePresence>
      {isThemeDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 mx-auto w-full overflow-hidden px-2 lg:hidden"
        >
          <div
            className="mx-auto max-h-[45vh] w-full max-w-md overflow-y-auto rounded-xl border p-2 shadow-2xl backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(255,255,255,0.92)',
              borderColor: 'rgba(0,0,0,0.08)',
              boxShadow: '0 18px 50px rgba(0,0,0,0.08)',
            }}
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {THEMES.map((theme) => {
                const isActive = currentTheme.name === theme.name;

                return (
                  <button
                    key={theme.name}
                    type="button"
                    onClick={() => {
                      setTheme(theme.name);
                      setIsThemeDropdownOpen(false);
                    }}
                    className="flex min-h-12 min-w-0 items-center gap-2 rounded-md border px-2 py-2 text-left transition-transform active:scale-95"
                    style={{
                      backgroundColor: isActive
                        ? 'rgba(59,130,246,0.08)'
                        : 'rgba(255,255,255,0.5)',
                      borderColor: isActive ? 'rgba(59,130,246,0.3)' : 'rgba(0,0,0,0.06)',
                      color: 'var(--theme-text)',
                    }}
                    aria-label={`Use ${theme.label} theme`}
                  >
                    <span className="flex flex-shrink-0 gap-0.5">
                      {theme.colors.slice(0, 3).map((color, index) => (
                        <span
                          key={`${theme.name}-${color}-${index}`}
                          className="h-3.5 w-3.5 rounded-full border border-gray-200 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11px] font-bold">
                      {theme.label}
                    </span>
                    {isActive && <Check className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Mobile Bottom Navigation Bar - Using var(--theme-surface) */}
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 w-full overflow-hidden px-2 lg:hidden">
      <motion.nav
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border px-1.5 py-2 shadow-2xl backdrop-blur-md sm:px-2"
        initial={{ y: 96 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.06)',
        }}
        aria-label="Primary navigation"
      >
        <div className="grid min-w-0 grid-cols-7 gap-0.5 sm:gap-1">
          {navLinks.map(({ href, shortLabel, icon }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => scrollToSection(e, href)}
              className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-md px-0.5 text-[9px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-[380px]:text-[10px] sm:px-1 sm:text-xs"
              style={{
                color: 'var(--theme-text)',
                outlineColor: 'var(--theme-secondary)',
              }}
            >
              <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center opacity-70">{icon}</span>
              <span className="block max-w-full truncate leading-none">{shortLabel}</span>
            </a>
          ))}

          <button
            type="button"
            onClick={() => setIsThemeDropdownOpen((open) => !open)}
            className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-md px-0.5 text-[9px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-[380px]:text-[10px] sm:px-1 sm:text-xs"
            style={{
              backgroundColor: isThemeDropdownOpen
                ? 'color-mix(in srgb, var(--theme-secondary) 12%, transparent)'
                : 'transparent',
              color: 'var(--theme-text)',
              outlineColor: 'var(--theme-secondary)',
            }}
            aria-label="Choose theme"
            aria-expanded={isThemeDropdownOpen}
          >
            <Palette className="h-4 w-4 flex-shrink-0 opacity-70" />
            <span className="block max-w-full truncate leading-none">Theme</span>
          </button>

          <Link
            href="/login"
            className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-md px-0.5 text-[9px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-[380px]:text-[10px] sm:px-1 sm:text-xs"
            style={{
              color: 'var(--theme-text)',
              outlineColor: 'var(--theme-secondary)',
            }}
            aria-label="Login"
          >
            <LogIn className="h-4 w-4 flex-shrink-0 opacity-70" />
            <span className="block max-w-full truncate leading-none">Login</span>
          </Link>
        </div>
      </motion.nav>
    </div>

    <style jsx global>{`
      @media (max-width: 1023px) {
        html,
        body {
          overflow-x: hidden;
        }

        body {
          padding-bottom: calc(82px + env(safe-area-inset-bottom));
        }
      }
    `}</style>
    </>
  );
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => onClick(e, href)}
      className="group relative cursor-pointer text-[13px] xl:text-[14px] font-semibold transition-colors whitespace-nowrap"
      style={{ color: 'var(--theme-primary)' }}
    >
      {children}
      <span
        className="absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full"
        style={{ backgroundColor: 'var(--theme-primary)' }}
      ></span>
    </a>
  );
}
