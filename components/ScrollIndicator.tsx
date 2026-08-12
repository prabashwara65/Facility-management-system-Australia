'use client';

import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  targetId: string;
  label?: string;
}

export default function ScrollIndicator({ targetId, label = "Scroll to explore" }: ScrollIndicatorProps) {
  const scrollToSection = () => {
    const section = document.querySelector(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div 
      className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 cursor-pointer"
      onClick={scrollToSection}
      initial={{ opacity: 0, y: -20 }}
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
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="h-6 w-0.5 bg-white/30 rounded-full" />
        <motion.div 
          className="h-6 w-0.5 bg-white/60 rounded-full"
          animate={{ height: ["24px", "32px", "24px"] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="h-6 w-0.5 bg-white/30 rounded-full" />
      </motion.div>
    </motion.div>
  );
}