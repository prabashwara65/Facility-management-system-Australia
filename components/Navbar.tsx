'use client';

import Link from "next/link";
import { ReactNode, MouseEvent, useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  logoText = "SparkWell",
  phoneNumber = "1800 123 456"
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
    { href: "#blog", label: "Blog" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1e2e4e] shadow-lg shadow-black/20' 
          : 'bg-[#1e2e4e]'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex h-[82px] max-w-[1600px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <motion.div 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d0a037]"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-lg text-[#243453]">✦</span>
          </motion.div>
          <div className="font-serif text-[21px] font-bold">
            <span className="text-white">Spark</span>
            <span className="text-[#d0a037]">Well</span>
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
        <div className="flex items-center gap-4">
          <a
            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
            className="hidden text-[15px] font-bold text-[#d8ad4b] xl:block hover:text-[#e8bd5b] transition-colors"
          >
            {phoneNumber}
          </a>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="#booking"
              className="rounded-md bg-[#d0a037] px-6 py-3 text-sm font-bold text-white hover:bg-[#dfae45] transition-colors"
            >
              Book Now
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-[#d0a037] transition-colors"
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
        className={`lg:hidden overflow-hidden bg-[#1e2e4e] border-t border-white/10`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg px-3 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-white/10">
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="block py-2 text-[#d8ad4b] font-bold"
            >
              {phoneNumber}
            </a>
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
      className="text-[14px] font-semibold text-white/80 transition-colors hover:text-white cursor-pointer relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d0a037] transition-all group-hover:w-full"></span>
    </a>
  );
}