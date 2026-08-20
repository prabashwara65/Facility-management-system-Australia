'use client';

import Link from "next/link";
import { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, ChevronDown } from "lucide-react";
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

export default function Navbar({ 
  logoText = "Shining Property Service",
  phoneNumber = "1800 123 456"
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState<boolean>(false);
  const { currentTheme, setTheme, themes } = useTheme();

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
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#pricing", label: "Pricing" },
    { href: "#why-us", label: "Why Us" },
    { href: "#areas", label: "Areas" },
    { href: "#booking", label: "Book Now" },
  ];

  // Get current theme colors for preview
  const currentColors = THEMES.find(t => t.name === currentTheme.name)?.colors || ['#ffffff', '#1a3a6b', '#4a7bc4', '#0a1d38'];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 shadow-lg shadow-slate-200/70 backdrop-blur-md' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        borderBottom: '1px solid color-mix(in srgb, var(--theme-primary) 12%, white)',
      }}
    >
      <div className="mx-auto flex h-[50px] max-w-[1400px] items-center justify-between gap-3 px-6 lg:px-8 xl:px-10">
        {/* Logo - Using group.jpg */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <motion.div 
            className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/img/02.png"
              alt="Shining Property Service"
              width={48}
              height={48}
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="font-serif text-[21px] font-bold whitespace-nowrap">
            <span style={{ color: 'var(--theme-primary)' }}>Shining</span>
            <span style={{ color: 'var(--theme-secondary)' }}> Property Service</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} onClick={scrollToSection}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
            className="hidden text-[15px] font-bold xl:block transition-colors"
            style={{ color: 'var(--theme-primary)' }}
          >
            {phoneNumber}
          </a>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="#booking"
              className="rounded-md px-6 py-3 text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              Book Now
            </Link>
          </motion.div>

          {/* Theme Switcher - Compact Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100"
              style={{ color: 'var(--theme-primary)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Change theme"
            >
              <div className="flex gap-0.5">
                {currentColors.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </motion.button>

            {/* Theme Dropdown */}
            <AnimatePresence>
              {isThemeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5"
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
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Color preview */}
                          <div className="flex h-8 w-8 rounded-lg overflow-hidden flex-shrink-0">
                            <div className="flex-1" style={{ backgroundColor: bg }} />
                            <div className="flex-1" style={{ backgroundColor: primary }} />
                            <div className="flex-1" style={{ backgroundColor: secondary }} />
                            <div className="flex-1" style={{ backgroundColor: text }} />
                          </div>
                          
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-gray-800">
                              {theme.label}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {theme.description}
                            </div>
                          </div>
                          
                          {isActive && (
                            <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden transition-colors"
            style={{ color: 'var(--theme-primary)' }}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className="lg:hidden overflow-hidden border-t bg-white"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, white)' }}
      >
        <div className="space-y-2 px-6 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block rounded-lg px-3 py-3 transition-colors"
              style={{ color: 'var(--theme-primary)' }}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t pt-4" style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, white)' }}>
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="block py-2 font-bold"
              style={{ color: 'var(--theme-primary)' }}
            >
              {phoneNumber}
            </a>
            
            {/* Mobile Theme Selector */}
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-gray-500">Switch Theme</p>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => {
                      setTheme(theme.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      currentTheme.name === theme.name 
                        ? 'border-blue-600 scale-110' 
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` 
                    }}
                    title={theme.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => onClick(e, href)}
      className="group relative cursor-pointer text-[14px] font-semibold transition-colors"
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