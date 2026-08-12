"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="relative z-50 h-[82px] bg-[#283655]">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-6 lg:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d0a037]">
            <span className="text-lg text-[#243453]">✦</span>
          </div>

          <div className="font-serif text-[21px] font-bold">
            <span className="text-white">Spark</span>
            <span className="text-[#d0a037]">Well</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#why-us">Why Us</NavLink>
          <NavLink href="#areas">Areas</NavLink>
          <NavLink href="#blog">Blog</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <a
            href="tel:1800123456"
            className="hidden text-[15px] font-bold text-[#d8ad4b] xl:block"
          >
            1800 123 456
          </a>

          <Link
            href="#booking"
            className="rounded-md bg-[#d0a037] px-6 py-3 text-sm font-bold text-white hover:bg-[#dfae45]"
          >
            Book Now
          </Link>
        </div>

      </div>
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-[14px] font-semibold text-white/80 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}