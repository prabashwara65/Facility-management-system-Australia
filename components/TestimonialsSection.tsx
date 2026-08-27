'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Star, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  status: string;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const supabase = createClient();

  // Load testimonials from Supabase
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'Active')
          .order('id', { ascending: true });

        if (error) {
          console.error('❌ Error loading testimonials:', error);
          setTestimonials([]);
          return;
        }

        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        console.error('❌ Error:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const totalSlides = testimonials.length;

  if (loading) {
    return (
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans" style={{ backgroundColor: 'var(--theme-surface)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: 'var(--theme-muted)' }}>Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans" style={{ backgroundColor: 'var(--theme-surface)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: 'var(--theme-muted)' }}>No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden" style={{ backgroundColor: 'var(--theme-surface)' }}>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-1" style={{ color: 'var(--theme-secondary)' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: 'var(--theme-text)' }}>
            Happy homes across Melbourne.
          </h2>
          <p className="text-sm" style={{ color: 'var(--theme-muted)' }}>
            Hear what our clients have to say about us
          </p>
        </div>

        {/* Swiper Carousel - One Testimonial at a Time */}
        <div className="relative">
          <Swiper
            onSwiper={setSwiperRef}
            modules={[Navigation]}
            slidesPerView={1}
            spaceBetween={0}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="max-w-2xl mx-auto"
                >
                  <div
                    className="rounded-2xl p-8 md:p-12 flex flex-col items-center text-center space-y-6 transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--theme-card)', 
                      border: '1px solid var(--theme-border)', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    }}
                  >
                    {/* Stars */}
                    <div className="flex items-center space-x-1" style={{ color: 'var(--theme-secondary)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-lg md:text-xl italic leading-relaxed" style={{ color: 'var(--theme-text)' }}>
                      "{item.quote}"
                    </p>

                    {/* Author */}
                    <div className="pt-2">
                      <h3 className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>{item.name}</h3>
                      <p className="text-sm" style={{ color: 'var(--theme-muted)' }}>{item.location}</p>
                    </div>

                    {/* Verified Badge */}
                    {item.verified && (
                      <div className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-secondary) 14%, white)', color: 'var(--theme-primary)' }}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Verified Review</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Numbered Navigation - Only this, no bars */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => swiperRef?.slideTo(index)}
                  className={`transition-all duration-300 rounded-full flex items-center justify-center text-xs font-medium ${
                    isActive
                      ? 'w-10 h-10 text-white shadow-md scale-110'
                      : 'w-8 h-8 text-gray-500 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--theme-secondary)' : 'rgba(0,0,0,0.06)',
                    color: isActive ? 'white' : 'var(--theme-muted)',
                    border: isActive ? 'none' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Swiper Styles - Hide default pagination */}
        <style jsx>{`
          :global(.swiper-pagination) {
            display: none !important;
          }
          :global(.swiper-button-next),
          :global(.swiper-button-prev) {
            display: none !important;
          }
        `}</style>
      </div>
    </section>
  );
}