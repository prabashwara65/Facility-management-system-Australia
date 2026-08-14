'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const navSections = [
  {
    title: 'SERVICES',
    links: [
      { label: 'End of Lease', href: '#' },
      { label: 'Deep Clean', href: '#' },
      { label: 'Regular Clean', href: '#' },
      { label: 'Commercial', href: '#' },
      { label: 'Add-Ons', href: '#' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Why Us', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'AREAS',
    links: [
      { label: 'Melbourne CBD', href: '#' },
      { label: 'South Yarra', href: '#' },
      { label: 'Fitzroy', href: '#' },
      { label: 'Richmond', href: '#' },
      { label: 'View All', href: '#', hasArrow: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8 font-sans border-t"
      style={{ 
        backgroundColor: '#0F172A',
        color: 'white',
        borderColor: 'rgba(255,255,255,0.08)'
      }}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          {/* Logo & Brand Section */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="p-2 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--theme-secondary)', color: 'white' }}>
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-white">
                Spark<span style={{ color: 'var(--theme-secondary)' }}>Well</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Melbourne's trusted cleaning specialists since 2018. Professional, reliable, guaranteed.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="Facebook"
                className="p-2.5 rounded-lg transition-colors duration-200 hover:bg-white/10"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  color: 'rgba(255,255,255,0.7)' 
                }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="LinkedIn"
                className="p-2.5 rounded-lg transition-colors duration-200 hover:bg-white/10"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  color: 'rgba(255,255,255,0.7)' 
                }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="YouTube"
                className="p-2.5 rounded-lg transition-colors duration-200 hover:bg-white/10"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.06)', 
                  color: 'rgba(255,255,255,0.7)' 
                }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-white/60">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-200 inline-flex items-center space-x-1 group hover:text-white"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        <span>{link.label}</span>
                        {link.hasArrow && (
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.4)' }} />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-xs gap-4"
          style={{ 
            borderColor: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.4)'
          }}
        >
          <p>© 2026 SparkWell Cleaning Services Pty Ltd. All rights reserved. ABN 12 345 678 901</p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <span>
              Developed by{' '}
              <a 
                href="#" 
                className="font-medium transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Apps Technologies
              </a>
            </span>
            <Link 
              href="#" 
              className="transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="transition-colors hover:text-white"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}