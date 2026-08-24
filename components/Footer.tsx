'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

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
    <footer className="w-full pt-16 pb-8 px-4 sm:px-6 lg:px-8 font-sans border-t bg-slate-900 text-white border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">
          {/* Logo & Brand Section */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center space-x-4 group">
              <motion.div 
                className="flex h-28 w-28 lg:h-32 lg:w-32 items-center justify-center rounded-full overflow-hidden flex-shrink-0 grayscale"
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/img/02.png"
                  alt="Shining Property Service"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              <div className="font-serif text-[16px] sm:text-[18px] md:text-[21px] font-bold whitespace-nowrap overflow-hidden">
                <span className="text-white/60">Shining</span>
                <span className="text-white/40 hidden sm:inline"> Property Service</span>
                <span className="text-white/40 sm:hidden"> PS</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm text-white/60">
              Melbourne's trusted cleaning specialists since 2018. Professional, reliable, guaranteed.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <motion.a
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                aria-label="Facebook"
                className="p-2.5 rounded-lg transition-colors duration-200 bg-white/5 text-white/70 border border-white/10 hover:bg-blue-500 hover:text-white hover:border-blue-500"
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
                className="p-2.5 rounded-lg transition-colors duration-200 bg-white/5 text-white/70 border border-white/10 hover:bg-blue-600 hover:text-white hover:border-blue-600"
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
                className="p-2.5 rounded-lg transition-colors duration-200 bg-white/5 text-white/70 border border-white/10 hover:bg-red-600 hover:text-white hover:border-red-600"
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
                <h3 className="text-xs font-semibold tracking-wider uppercase text-white/40">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-200 inline-flex items-center space-x-1 group text-white/50 hover:text-blue-400"
                      >
                        <span>{link.label}</span>
                        {link.hasArrow && (
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-white/40" />
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
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs gap-4 text-white/40">
          <p>© 2026 Shining Property Service Pty Ltd. All rights reserved. ABN 12 345 678 901</p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <span>
              Developed by{' '}
              <a 
                href="#" 
                className="font-medium transition-colors text-white/50 hover:text-blue-400"
              >
                Apps Technologies
              </a>
            </span>
            <Link 
              href="#" 
              className="transition-colors text-white/40 hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="transition-colors text-white/40 hover:text-blue-400"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}