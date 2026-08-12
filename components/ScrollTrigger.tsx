'use client';

import { useEffect, useRef } from 'react';

interface ScrollTriggerProps {
  targetId?: string;
  scrollThreshold?: number;
}

export default function ScrollTrigger({ 
  targetId = "#services", 
  scrollThreshold = 50 
}: ScrollTriggerProps) {
  const hasTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      if (hasTriggeredRef.current) return;
      
      const scrollY = window.scrollY;
      const servicesSection = document.querySelector(targetId);
      
      // If user has scrolled at least the threshold amount, smooth scroll to services
      if (scrollY > scrollThreshold && servicesSection) {
        hasTriggeredRef.current = true;
        servicesSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        // Remove the listeners after triggering once
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('wheel', handleWheel as EventListener);
        window.removeEventListener('touchmove', handleTouchMove as EventListener);
      }
    };

    const handleWheel = (e: WheelEvent): void => {
      if (hasTriggeredRef.current) return;
      
      const delta = e.deltaY;
      
      // If user scrolls down even a little bit (minimum 5px)
      if (delta > 5) {
        const servicesSection = document.querySelector(targetId);
        if (servicesSection) {
          e.preventDefault();
          hasTriggeredRef.current = true;
          
          // Smooth scroll to services section
          servicesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          
          // Remove the event listeners after first trigger
          window.removeEventListener('wheel', handleWheel as EventListener);
          window.removeEventListener('touchmove', handleTouchMove as EventListener);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (hasTriggeredRef.current) return;
      
      const touch = e.touches[0];
      if (!touch) return;
      
      // Track touch start position
      const startY = 0;
      
      // If user swipes down even a little bit
      if (touch.clientY - startY > 5) {
        const servicesSection = document.querySelector(targetId);
        if (servicesSection) {
          e.preventDefault();
          hasTriggeredRef.current = true;
          
          servicesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          
          window.removeEventListener('wheel', handleWheel as EventListener);
          window.removeEventListener('touchmove', handleTouchMove as EventListener);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    // Add event listeners only on the hero section
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      heroSection.addEventListener('wheel', handleWheel as EventListener, { passive: false });
      heroSection.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    }

    // Also add scroll listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (heroSection) {
        heroSection.removeEventListener('wheel', handleWheel as EventListener);
        heroSection.removeEventListener('touchmove', handleTouchMove as EventListener);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [targetId, scrollThreshold]);

  return null;
}