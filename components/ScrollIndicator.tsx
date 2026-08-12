'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

interface ScrollIndicatorProps {
  targetId: string;
  label?: string;
}

export default function ScrollIndicator({ targetId, label = "Scroll to explore" }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();
  
  // Fade out the indicator as user scrolls
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest: number) => {
      if (latest > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToSection = (): void => {
    const section = document.querySelector(targetId);
    if (section) {
      const topOffset = section.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div 
      className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 cursor-pointer"
      onClick={scrollToSection}
      style={{ opacity }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <span className="text-xs font-medium tracking-widest text-white/60 uppercase">
        {label}
      </span>
      
      <motion.div
        className="flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ 
          duration: 1.8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="h-6 w-0.5 bg-white/20 rounded-full" />
        <motion.div 
          className="h-8 w-0.5 bg-white/60 rounded-full"
          animate={{ 
            height: ["24px", "36px", "24px"],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 1.8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="h-6 w-0.5 bg-white/20 rounded-full" />
        
        {/* Animated Arrow */}
        <motion.svg 
          className="w-5 h-5 text-white/60 mt-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ y: [0, 4, 0] }}
          transition={{ 
            duration: 1.8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}